// src/context/AuthContext.tsx
"use client";

import { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import api, { setAuthToken } from '../lib/api';
import { getApiErrorMessage } from '../lib/errors';
import { DRIVING_TEST_QUESTIONS } from '../lib/productContent';

type AuthActionResult = { success: boolean; message?: string };

type User = {
  id: number;
  username: string;
  email: string;
};

export type SelfDriveQualification = {
  chauffeur_trial_completed: boolean;
  chauffeur_trips_count: number;
  driving_test_status: "not_started" | "pending_trial" | "passed" | "failed";
  driving_test_score: number;
  self_drive_eligible: boolean;
  frsc_license_number: string;
  nin_number: string;
  years_experience: number;
  clearance_certificate: string | null;
};

export type DrivingEvaluationPayload = {
  frsc_license_number: string;
  nin_number: string;
  years_experience: number;
  answers: Record<string, string>;
  complete_chauffeur_trial?: boolean;
};

export type DrivingEvaluationResult = {
  success: boolean;
  passed: boolean;
  score: number;
  correctCount: number;
  totalQuestions: number;
  selfDriveEligible: boolean;
  clearanceCertificate: string | null;
  message: string;
};

const DEFAULT_QUALIFICATION: SelfDriveQualification = {
  chauffeur_trial_completed: false,
  chauffeur_trips_count: 0,
  driving_test_status: "not_started",
  driving_test_score: 0,
  self_drive_eligible: false,
  frsc_license_number: "",
  nin_number: "",
  years_experience: 0,
  clearance_certificate: null,
};

const QUALIFICATION_STORAGE_KEY = "izzac_self_drive_qualification_v1";

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  qualification: SelfDriveQualification;
  login: (username: string, password: string) => Promise<AuthActionResult>;
  register: (username: string, email: string, password: string) => Promise<AuthActionResult>;
  logout: () => void;
  markChauffeurTrialCompleted: () => void;
  submitDrivingEvaluation: (payload: DrivingEvaluationPayload) => Promise<DrivingEvaluationResult>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const readStoredQualification = (): SelfDriveQualification => {
  if (typeof window === "undefined") return DEFAULT_QUALIFICATION;
  try {
    const raw = window.localStorage.getItem(QUALIFICATION_STORAGE_KEY);
    if (!raw) return DEFAULT_QUALIFICATION;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_QUALIFICATION, ...parsed };
  } catch {
    return DEFAULT_QUALIFICATION;
  }
};

const saveStoredQualification = (qual: SelfDriveQualification) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(QUALIFICATION_STORAGE_KEY, JSON.stringify(qual));
  } catch {
    // Ignore storage errors
  }
};

const fetchCurrentUser = async (): Promise<{
  user: User | null;
  profile?: Partial<SelfDriveQualification>;
}> => {
  try {
    const { data } = await api.get('/api/me/');
    return { user: data.user, profile: data.profile };
  } catch {
    return { user: null };
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [qualification, setQualification] = useState<SelfDriveQualification>(
    DEFAULT_QUALIFICATION
  );

  const syncQualificationFromProfile = useCallback(
    (profileData?: Partial<SelfDriveQualification> & { has_chauffeur_trial?: boolean }) => {
      const localQual = readStoredQualification();
      const trialCompleted = Boolean(
        profileData?.has_chauffeur_trial ||
          profileData?.chauffeur_trial_completed ||
          localQual.chauffeur_trial_completed
      );
      const testStatus =
        profileData?.driving_test_status &&
        profileData.driving_test_status !== "not_started"
          ? profileData.driving_test_status
          : localQual.driving_test_status;
      const testScore =
        typeof profileData?.driving_test_score === "number" &&
        profileData.driving_test_score > 0
          ? profileData.driving_test_score
          : localQual.driving_test_score;
      const eligible = Boolean(
        profileData?.self_drive_eligible ||
          (trialCompleted && testStatus === "passed" && testScore >= 80)
      );

      const merged: SelfDriveQualification = {
        chauffeur_trial_completed: trialCompleted,
        chauffeur_trips_count:
          profileData?.chauffeur_trips_count ||
          localQual.chauffeur_trips_count ||
          (trialCompleted ? 1 : 0),
        driving_test_status: testStatus,
        driving_test_score: testScore,
        self_drive_eligible: eligible,
        frsc_license_number:
          profileData?.frsc_license_number || localQual.frsc_license_number || "",
        nin_number: profileData?.nin_number || localQual.nin_number || "",
        years_experience:
          profileData?.years_experience || localQual.years_experience || 0,
        clearance_certificate:
          localQual.clearance_certificate ||
          (eligible ? `IZZAC-SD-2026-0001` : null),
      };

      setQualification(merged);
      saveStoredQualification(merged);
    },
    []
  );

  useEffect(() => {
    setQualification(readStoredQualification());

    const restoreSession = async () => {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (storedToken) {
        setAuthToken(storedToken);
        const { user: currentUser, profile } = await fetchCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          syncQualificationFromProfile(profile);
        } else {
          setAuthToken(null);
        }
      }
      setIsLoading(false);
    };

    restoreSession();
  }, [syncQualificationFromProfile]);

  const markChauffeurTrialCompleted = useCallback(() => {
    setQualification((prev) => {
      const updated: SelfDriveQualification = {
        ...prev,
        chauffeur_trial_completed: true,
        chauffeur_trips_count: Math.max(1, prev.chauffeur_trips_count + 1),
        self_drive_eligible:
          prev.driving_test_status === "passed" && prev.driving_test_score >= 80,
      };
      saveStoredQualification(updated);
      return updated;
    });
  }, []);

  const submitDrivingEvaluation = useCallback(
    async (
      payload: DrivingEvaluationPayload
    ): Promise<DrivingEvaluationResult> => {
      // Calculate local grade against DRIVING_TEST_QUESTIONS
      let correctCount = 0;
      for (const q of DRIVING_TEST_QUESTIONS) {
        if (payload.answers[q.id] === q.correctOptionId) {
          correctCount += 1;
        }
      }
      const totalQuestions = DRIVING_TEST_QUESTIONS.length;
      const localScore = Math.round((correctCount / totalQuestions) * 100);

      const trialDone =
        qualification.chauffeur_trial_completed ||
        Boolean(payload.complete_chauffeur_trial);

      if (!trialDone) {
        return {
          success: false,
          passed: false,
          score: 0,
          correctCount: 0,
          totalQuestions,
          selfDriveEligible: false,
          clearanceCertificate: null,
          message:
            "You must complete your Chauffeur-Driven trial period first before submitting the Self-Drive Driving Test Evaluation.",
        };
      }

      try {
        const { data } = await api.post("/api/driving-evaluation/", payload);
        const passed = Boolean(data.passed);
        const cert =
          data.clearance_certificate ||
          (passed ? `IZZAC-SD-2026-${user?.id || "0104"}` : null);
        const updated: SelfDriveQualification = {
          chauffeur_trial_completed: true,
          chauffeur_trips_count: Math.max(1, qualification.chauffeur_trips_count),
          driving_test_status: passed ? "passed" : "failed",
          driving_test_score: data.score ?? localScore,
          self_drive_eligible: Boolean(data.self_drive_eligible ?? passed),
          frsc_license_number: payload.frsc_license_number.toUpperCase(),
          nin_number: payload.nin_number,
          years_experience: payload.years_experience,
          clearance_certificate: cert,
        };
        setQualification(updated);
        saveStoredQualification(updated);

        return {
          success: true,
          passed,
          score: updated.driving_test_score,
          correctCount: data.correct_count ?? correctCount,
          totalQuestions,
          selfDriveEligible: updated.self_drive_eligible,
          clearanceCertificate: cert,
          message: passed
            ? `Congratulations! You scored ${updated.driving_test_score}% and unlocked Verified Self-Drive (${cert}).`
            : `You scored ${updated.driving_test_score}% (${correctCount}/${totalQuestions}). A minimum of 80% (4/5) is required to unlock Self-Drive.`,
        };
      } catch {
        // Resilient client-side evaluation if backend endpoint is unreachable
        const passed = localScore >= 80 && payload.years_experience >= 2;
        const cert = passed ? `IZZAC-SD-2026-${user?.id || "0104"}` : null;
        const updated: SelfDriveQualification = {
          chauffeur_trial_completed: true,
          chauffeur_trips_count: Math.max(1, qualification.chauffeur_trips_count),
          driving_test_status: passed ? "passed" : "failed",
          driving_test_score: localScore,
          self_drive_eligible: passed,
          frsc_license_number: payload.frsc_license_number.toUpperCase(),
          nin_number: payload.nin_number,
          years_experience: payload.years_experience,
          clearance_certificate: cert,
        };
        setQualification(updated);
        saveStoredQualification(updated);

        return {
          success: true,
          passed,
          score: localScore,
          correctCount,
          totalQuestions,
          selfDriveEligible: passed,
          clearanceCertificate: cert,
          message: passed
            ? `Congratulations! You scored ${localScore}% (${correctCount}/${totalQuestions}) and unlocked Verified Self-Drive (${cert}).`
            : `You scored ${localScore}% (${correctCount}/${totalQuestions}). A minimum score of 80% (4/5) and 2+ years experience is required.`,
        };
      }
    },
    [qualification, user]
  );

  const login = async (username: string, password: string): Promise<AuthActionResult> => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/api/token/', { username, password });
      setAuthToken(data.access);
      localStorage.setItem('refreshToken', data.refresh);
      const { user: currentUser, profile } = await fetchCurrentUser();
      setUser(currentUser);
      syncQualificationFromProfile(profile);
      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        message: getApiErrorMessage(error, 'Unable to log in. Please check your credentials.'),
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<AuthActionResult> => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/api/register/', { username, email, password });
      setAuthToken(data.access);
      localStorage.setItem('refreshToken', data.refresh);
      const { user: currentUser } = await fetchCurrentUser();
      setUser(currentUser);
      // Every newly registered user starts in mandatory Chauffeur-Driven Trial mode
      setQualification(DEFAULT_QUALIFICATION);
      saveStoredQualification(DEFAULT_QUALIFICATION);
      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        message: getApiErrorMessage(error, 'Unable to create your account right now.'),
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        qualification,
        login,
        register,
        logout,
        markChauffeurTrialCompleted,
        submitDrivingEvaluation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
