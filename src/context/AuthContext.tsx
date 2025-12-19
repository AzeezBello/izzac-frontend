// src/context/AuthContext.tsx
"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import api, { setAuthToken } from '../lib/api';

type AuthActionResult = { success: boolean; message?: string };

type User = {
  id: number;
  username: string;
  email: string;
};

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<AuthActionResult>;
  register: (username: string, email: string, password: string) => Promise<AuthActionResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const { data } = await api.get('/api/me/');
    return data.user;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (storedToken) {
        setAuthToken(storedToken);
        const currentUser = await fetchCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          setAuthToken(null);
        }
      }
      setIsLoading(false);
    };

    restoreSession();
  }, []);

  const login = async (username: string, password: string): Promise<AuthActionResult> => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/api/token/', { username, password });
      setAuthToken(data.access);
      localStorage.setItem('refreshToken', data.refresh);
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
      return { success: true };
    } catch (error: any) {
      const message = error?.response?.data?.detail || 'Unable to log in. Please check your credentials.';
      return { success: false, message };
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
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
      return { success: true };
    } catch (error: any) {
      const message = error?.response?.data?.detail || 'Unable to create your account right now.';
      return { success: false, message };
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
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), isLoading, login, register, logout }}>
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
