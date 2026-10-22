"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import {
  DRIVING_TEST_QUESTIONS,
  INSURANCE_PLAN_OPTIONS,
  SELF_DRIVE_TRIAL_STAGES,
} from "../lib/productContent";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tooltip } from "./ui/tooltip";
import { Alert, AlertDescription } from "./ui/alert";

type DrivingEvaluationPanelProps = {
  compact?: boolean;
};

const DrivingEvaluationPanel = ({
  compact = false,
}: DrivingEvaluationPanelProps) => {
  const {
    qualification,
    markChauffeurTrialCompleted,
    submitDrivingEvaluation,
  } = useAuth();
  const { formatPrice } = useCurrency();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [frscLicense, setFrscLicense] = useState(
    qualification.frsc_license_number || ""
  );
  const [ninNumber, setNinNumber] = useState(qualification.nin_number || "");
  const [yearsExperience, setYearsExperience] = useState<number>(
    qualification.years_experience || 3
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showExplanations, setShowExplanations] = useState(false);

  useEffect(() => {
    if (qualification.frsc_license_number && !frscLicense) {
      setFrscLicense(qualification.frsc_license_number);
    }
    if (qualification.nin_number && !ninNumber) {
      setNinNumber(qualification.nin_number);
    }
    if (qualification.years_experience && yearsExperience === 3) {
      setYearsExperience(qualification.years_experience);
    }
  }, [qualification, frscLicense, ninNumber, yearsExperience]);

  // Modern Web Guidance (validate-input-after-interaction): WeakMap fallback + aria-invalid sync
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const dirtyState = new WeakMap<
      HTMLInputElement,
      { hasInteracted: boolean; hasBlurred: boolean }
    >();

    const syncAriaAndFallback = (input: HTMLInputElement) => {
      if (!input.checkValidity) return;
      const isValid = input.checkValidity();
      if (
        typeof CSS !== "undefined" &&
        !CSS.supports("selector(:user-invalid)")
      ) {
        input.classList.toggle("user-invalid-fallback", !isValid);
        input.classList.toggle("user-valid-fallback", isValid);
      }
      if (!isValid) {
        input.setAttribute("aria-invalid", "true");
      } else {
        input.setAttribute("aria-invalid", "false");
      }
    };

    const handleBlur = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target || target.tagName !== "INPUT") return;
      const state = dirtyState.get(target) || {
        hasInteracted: false,
        hasBlurred: false,
      };
      state.hasBlurred = true;
      dirtyState.set(target, state);
      if (state.hasInteracted) {
        syncAriaAndFallback(target);
      }
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target || target.tagName !== "INPUT") return;
      const state = dirtyState.get(target) || {
        hasInteracted: false,
        hasBlurred: false,
      };
      state.hasInteracted = true;
      dirtyState.set(target, state);
      if (state.hasBlurred || target.hasAttribute("aria-invalid")) {
        syncAriaAndFallback(target);
      }
    };

    form.addEventListener("blur", handleBlur, true);
    form.addEventListener("input", handleInput);
    return () => {
      form.removeEventListener("blur", handleBlur, true);
      form.removeEventListener("input", handleInput);
    };
  }, []);

  const activeStageIndex = qualification.self_drive_eligible
    ? 2
    : qualification.chauffeur_trial_completed
    ? 1
    : 0;

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!qualification.chauffeur_trial_completed) {
      setFeedback({
        type: "error",
        text: "Step 1 Required: New users must complete their Chauffeur-Driven trial period before submitting the Driving Test Evaluation.",
      });
      return;
    }

    const unanswered = DRIVING_TEST_QUESTIONS.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      setFeedback({
        type: "error",
        text: `Please answer all 5 driving evaluation questions (${unanswered.length} remaining).`,
      });
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitDrivingEvaluation({
        frsc_license_number: frscLicense.trim().toUpperCase(),
        nin_number: ninNumber.trim(),
        years_experience: Number(yearsExperience),
        answers,
      });
      setShowExplanations(true);
      setFeedback({
        type: result.passed ? "success" : "error",
        text: result.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="evaluation"
      className="space-y-8 scroll-mt-20"
      aria-labelledby="driving-eval-heading"
    >
      {/* Architectural Header & 3-Stage Qualification Progress Tracker */}
      <div className="rounded-2xl border border-border/90 bg-card shadow-surface overflow-hidden">
        <div className="p-6 md:p-8 border-b border-border/80 bg-[#0d1713] text-stone-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="dark">
                Graduated Self-Drive & Insurance Protocol
              </Badge>
              {qualification.self_drive_eligible ? (
                <Badge variant="emerald">
                  Self-Drive Unlocked ·{" "}
                  {qualification.clearance_certificate || "IZZAC-SD-2026"}
                </Badge>
              ) : (
                <Badge variant="secondary">
                  {qualification.chauffeur_trial_completed
                    ? "Stage 2 · Ready for Driving Test Evaluation"
                    : "Stage 1 · Chauffeur Trial Period Active"}
                </Badge>
              )}
            </div>
            <h2
              id="driving-eval-heading"
              className="text-2xl md:text-3xl font-bold text-stone-50 tracking-[-0.03em]"
            >
              Chauffeur Trial Period, Driving Test Evaluation & Motor Insurance
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed">
              New Izzac users begin with a Chauffeur-Driven trial period before taking our FRSC/NIN Driving Test Evaluation to unlock independent Self-Drive—backed by NAICOM/NIID Motor Insurance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Tooltip content="Book a chauffeur-driven car to complete your initial trial period">
              <Button asChild size="default">
                <Link href="/cars?service=Chauffeur+%26+Protocol">
                  Book Chauffeur Trial
                </Link>
              </Button>
            </Tooltip>
            {!qualification.chauffeur_trial_completed && (
              <Tooltip content="Already completed a chauffeur trial ride? Record trial completion to unlock the test">
                <button
                  type="button"
                  onClick={() => {
                    markChauffeurTrialCompleted();
                    setFeedback({
                      type: "success",
                      text: "Chauffeur-Driven Trial Period verified! You can now take the 5-question Driving Test Evaluation below.",
                    });
                  }}
                  className="rounded-lg border border-white/20 bg-white/10 px-3.5 py-2 font-mono text-xs font-semibold text-emerald-300 hover:bg-white/15 transition-colors"
                >
                  Verify Trial Completion ✓
                </button>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Modern Web Guidance (forms §11): Semantic Multi-Step Progress Tracker */}
        <nav
          aria-label="Self-drive qualification progress"
          className="border-b border-border/80 bg-secondary/40"
        >
          <ol className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/80">
            {SELF_DRIVE_TRIAL_STAGES.map((item, idx) => {
              const isCompleted = idx < activeStageIndex || qualification.self_drive_eligible;
              const isCurrent = idx === activeStageIndex && !qualification.self_drive_eligible;
              return (
                <li
                  key={item.stage}
                  aria-current={isCurrent ? "step" : undefined}
                  className={`p-5 md:p-6 space-y-2 ${
                    isCurrent ? "bg-card" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary tabular-nums">
                      {item.stage}
                    </span>
                    <Badge
                      variant={
                        isCompleted
                          ? "emerald"
                          : isCurrent
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {isCompleted
                        ? "Completed ✓"
                        : isCurrent
                        ? "Current Step"
                        : "Locked"}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {item.subtitle}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Interactive Driving Test & License Evaluation Form */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-1.5">
                <Badge variant="emerald">
                  FRSC / NIN & Road Readiness Assessment
                </Badge>
                <h3 className="text-xl font-bold text-foreground tracking-[-0.02em]">
                  Izzac Self-Drive Driving Test Evaluation
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Score at least 80% (4 of 5 questions) after completing your Chauffeur-Driven trial period to receive your digital Self-Drive Clearance Certificate.
                </p>
              </div>

              {!qualification.chauffeur_trial_completed && (
                <Alert variant="emerald">
                  <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
                    <span>
                      <strong>Trial Period Active:</strong> New accounts must complete 1 Chauffeur-Driven booking before submitting the Self-Drive evaluation.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        markChauffeurTrialCompleted();
                        setFeedback({
                          type: "success",
                          text: "Chauffeur-Driven Trial Period verified! Complete the Driving Test Evaluation below.",
                        });
                      }}
                      className="rounded-md bg-primary px-3 py-1 font-mono text-xs font-semibold text-primary-foreground hover:bg-emerald-800 shrink-0"
                    >
                      Confirm Trial Completed →
                    </button>
                  </AlertDescription>
                </Alert>
              )}

              <form
                ref={formRef}
                onSubmit={handleSubmitEvaluation}
                className="space-y-6"
              >
                {/* Driver Credentials Fieldset */}
                <fieldset className="rounded-xl border border-border/80 bg-secondary/25 p-4 md:p-5 space-y-4">
                  <legend className="px-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
                    Part A · Driver License & NIN Verification
                  </legend>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="eval-frsc" className="text-xs">
                        FRSC License Number
                      </Label>
                      {/* Modern Web Guidance (validate-input-after-interaction): hint placed ABOVE input */}
                      <span
                        id="eval-frsc-hint"
                        className="block font-mono text-[10px] text-muted-foreground"
                      >
                        Format: LAG12345AA99
                      </span>
                      <Input
                        id="eval-frsc"
                        name="frsc_license_number"
                        type="text"
                        required
                        minLength={6}
                        maxLength={20}
                        pattern="[A-Za-z0-9\-]{6,20}"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        aria-describedby="eval-frsc-hint"
                        value={frscLicense}
                        onChange={(e) => setFrscLicense(e.target.value)}
                        placeholder="LAG12345AA99"
                        className="validated-input font-mono text-xs uppercase tabular-nums"
                      />
                      <div className="validated-field-error">
                        Enter a valid 6–20 character FRSC license number.
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="eval-nin" className="text-xs">
                        11-Digit NIN
                      </Label>
                      <span
                        id="eval-nin-hint"
                        className="block font-mono text-[10px] text-muted-foreground"
                      >
                        11 numeric digits
                      </span>
                      <Input
                        id="eval-nin"
                        name="nin_number"
                        type="text"
                        inputMode="numeric"
                        required
                        pattern="\d{11}"
                        maxLength={11}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        aria-describedby="eval-nin-hint"
                        value={ninNumber}
                        onChange={(e) => setNinNumber(e.target.value)}
                        placeholder="12345678901"
                        className="validated-input font-mono text-xs tabular-nums"
                      />
                      <div className="validated-field-error">
                        Enter your 11-digit National Identification Number.
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="eval-exp" className="text-xs">
                        Driving Experience
                      </Label>
                      <span
                        id="eval-exp-hint"
                        className="block font-mono text-[10px] text-muted-foreground"
                      >
                        Minimum 2 years required
                      </span>
                      <Input
                        id="eval-exp"
                        name="years_experience"
                        type="number"
                        min={2}
                        max={60}
                        required
                        aria-describedby="eval-exp-hint"
                        value={yearsExperience}
                        onChange={(e) =>
                          setYearsExperience(Number(e.target.value))
                        }
                        className="validated-input font-mono text-xs tabular-nums"
                      />
                      <div className="validated-field-error">
                        Minimum 2 years driving experience required.
                      </div>
                    </div>
                  </div>
                </fieldset>

                {/* 5-Question Highway Code & Defensive Driving Assessment */}
                <div className="space-y-4">
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
                    Part B · Highway Code, Flood Protocol & Insurance Exam (5 Questions)
                  </p>

                  {DRIVING_TEST_QUESTIONS.map((q) => {
                    const selected = answers[q.id];
                    return (
                      <fieldset
                        key={q.id}
                        className="rounded-xl border border-border/80 bg-card p-4 space-y-2.5"
                      >
                        <legend className="text-xs sm:text-sm font-semibold text-foreground leading-snug">
                          {q.question}
                        </legend>
                        <div className="space-y-2 pt-1">
                          {q.options.map((opt) => {
                            const isChecked = selected === opt.id;
                            return (
                              <label
                                key={opt.id}
                                className={`selectable-option-card ${
                                  isChecked ? "is-active" : ""
                                } rounded-lg px-3 py-2 cursor-pointer flex items-start gap-2.5 text-xs`}
                              >
                                <input
                                  type="radio"
                                  name={`driving_test_${q.id}`}
                                  value={opt.id}
                                  checked={isChecked}
                                  onChange={() =>
                                    handleSelectAnswer(q.id, opt.id)
                                  }
                                  className="option-control mt-0.5 h-3.5 w-3.5 shrink-0"
                                />
                                <span className="text-foreground/90 leading-snug">
                                  {opt.label}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                        {showExplanations && (
                          <p className="text-[11px] font-mono text-primary bg-primary/10 rounded-md px-2.5 py-1.5 mt-2">
                            ✓ Official Rule: {q.explanation}
                          </p>
                        )}
                      </fieldset>
                    );
                  })}
                </div>

                {feedback && (
                  <Alert
                    variant={
                      feedback.type === "success" ? "emerald" : "destructive"
                    }
                  >
                    <AlertDescription className="font-semibold">
                      {feedback.text}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    enterKeyHint="done"
                  >
                    {submitting
                      ? "Evaluating driving test..."
                      : qualification.self_drive_eligible
                      ? `Re-validate Driving Test (Current: ${qualification.driving_test_score}%)`
                      : "Submit Driving Test & Unlock Self-Drive"}
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/cars">Browse Fleet</Link>
                  </Button>
                </div>
              </form>
            </div>

            {/* Right Column: NAICOM / NIID Motor Insurance Portfolio & Active Clearance Dossier */}
            <div className="lg:col-span-5 space-y-5">
              {/* Self-Drive Qualification Telemetry Card */}
              <Card className="p-5 md:p-6 bg-[#0d1713] text-stone-100 border-emerald-950 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-emerald-300">
                    Self-Drive Clearance Dossier
                  </span>
                  <Badge
                    variant={
                      qualification.self_drive_eligible ? "emerald" : "dark"
                    }
                  >
                    {qualification.self_drive_eligible
                      ? "CERTIFIED ✓"
                      : "TRIAL REQUIRED"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono text-xs tabular-nums">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <p className="text-stone-400 text-[10px] uppercase">
                      Chauffeur Trial
                    </p>
                    <p className="text-sm font-bold text-stone-100 mt-1">
                      {qualification.chauffeur_trial_completed
                        ? "Completed ✓"
                        : "Pending (0/1)"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <p className="text-stone-400 text-[10px] uppercase">
                      Driving Exam Score
                    </p>
                    <p className="text-sm font-bold text-emerald-300 mt-1">
                      {qualification.driving_test_score > 0
                        ? `${qualification.driving_test_score}% (${qualification.driving_test_status})`
                        : "Not Taken (80% req)"}
                    </p>
                  </div>
                </div>

                {qualification.clearance_certificate && (
                  <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/60 p-3 font-mono text-xs text-emerald-200 flex items-center justify-between">
                    <span>Clearance Ref:</span>
                    <span className="font-bold">
                      {qualification.clearance_certificate}
                    </span>
                  </div>
                )}

                <p className="text-xs text-stone-300 leading-relaxed">
                  Once both your Chauffeur-Driven Trial Period and Driving Test Evaluation are passed, Self-Drive unlocks across all 32+ vehicles on Izzac.
                </p>
              </Card>

              {/* NAICOM / NIID Motor Insurance Tiers Summary */}
              {!compact && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Badge variant="emerald">
                      NAICOM & NIID Motor Insurance
                    </Badge>
                    <h3 className="text-lg font-bold text-foreground tracking-[-0.02em]">
                      Mandatory & Comprehensive Motor Insurance Tiers
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Every Izzac booking issues a live NIID insurance certificate reference. Choose your coverage level at checkout:
                    </p>
                  </div>

                  <div className="space-y-3">
                    {INSURANCE_PLAN_OPTIONS.map((ins) => (
                      <Card key={ins.code} className="p-4 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <Badge
                            variant={
                              ins.code === "comprehensive_shield"
                                ? "emerald"
                                : "secondary"
                            }
                          >
                            {ins.badge}
                          </Badge>
                          <span className="font-mono text-xs font-bold text-primary tabular-nums">
                            {ins.dailyRateNgn === 0
                              ? "Included (₦0/d)"
                              : `+${formatPrice(ins.dailyRateNgn)} /day`}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-foreground">
                          {ins.name}
                        </h4>
                        <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
                          Underwriter: {ins.underwriter} · Cover Limit:{" "}
                          {formatPrice(ins.coverageLimitNgn)}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {ins.summary}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DrivingEvaluationPanel;
