"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import { DRIVING_TEST_QUESTIONS, INSURANCE_PLAN_OPTIONS, SELF_DRIVE_TRIAL_STAGES } from "../lib/productContent";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Eyebrow } from "./layout/Eyebrow";
import { SectionHeading } from "./layout/SectionHeading";
import { Stat } from "./layout/Stat";
import { Ledger } from "./layout/Ledger";
import { OptionCard } from "./layout/OptionCard";
import { cn } from "@/lib/utils";

type DrivingEvaluationPanelProps = {
  compact?: boolean;
};

type StageState = "done" | "current" | "locked";

const stageLabel: Record<StageState, string> = { done: "Done", current: "Current", locked: "Locked" };

const DrivingEvaluationPanel = ({ compact = false }: DrivingEvaluationPanelProps) => {
  const { qualification, markChauffeurTrialCompleted, submitDrivingEvaluation } = useAuth();
  const { formatPrice } = useCurrency();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [frscLicense, setFrscLicense] = useState(qualification.frsc_license_number || "");
  const [ninNumber, setNinNumber] = useState(qualification.nin_number || "");
  const [yearsExperience, setYearsExperience] = useState<number>(qualification.years_experience || 3);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showExplanations, setShowExplanations] = useState(false);

  useEffect(() => {
    if (qualification.frsc_license_number && !frscLicense) setFrscLicense(qualification.frsc_license_number);
    if (qualification.nin_number && !ninNumber) setNinNumber(qualification.nin_number);
    if (qualification.years_experience && yearsExperience === 3) setYearsExperience(qualification.years_experience);
  }, [qualification, frscLicense, ninNumber, yearsExperience]);

  // Defer validation styling until the user has interacted; sync aria-invalid and a fallback class.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const dirtyState = new WeakMap<HTMLInputElement, { hasInteracted: boolean; hasBlurred: boolean }>();

    const syncAriaAndFallback = (input: HTMLInputElement) => {
      if (!input.checkValidity) return;
      const isValid = input.checkValidity();
      if (typeof CSS !== "undefined" && !CSS.supports("selector(:user-invalid)")) {
        input.classList.toggle("user-invalid-fallback", !isValid);
        input.classList.toggle("user-valid-fallback", isValid);
      }
      input.setAttribute("aria-invalid", isValid ? "false" : "true");
    };

    const handleBlur = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target || target.tagName !== "INPUT") return;
      const state = dirtyState.get(target) || { hasInteracted: false, hasBlurred: false };
      state.hasBlurred = true;
      dirtyState.set(target, state);
      if (state.hasInteracted) syncAriaAndFallback(target);
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target || target.tagName !== "INPUT") return;
      const state = dirtyState.get(target) || { hasInteracted: false, hasBlurred: false };
      state.hasInteracted = true;
      dirtyState.set(target, state);
      if (state.hasBlurred || target.hasAttribute("aria-invalid")) syncAriaAndFallback(target);
    };

    form.addEventListener("blur", handleBlur, true);
    form.addEventListener("input", handleInput);
    return () => {
      form.removeEventListener("blur", handleBlur, true);
      form.removeEventListener("input", handleInput);
    };
  }, []);

  const activeStageIndex = qualification.self_drive_eligible ? 2 : qualification.chauffeur_trial_completed ? 1 : 0;

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const confirmTrial = (text: string) => {
    markChauffeurTrialCompleted();
    setFeedback({ type: "success", text });
  };

  const handleSubmitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!qualification.chauffeur_trial_completed) {
      setFeedback({
        type: "error",
        text: "Stage one first: complete your chauffeur-driven trial before submitting the driving test evaluation.",
      });
      return;
    }

    const unanswered = DRIVING_TEST_QUESTIONS.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      setFeedback({ type: "error", text: `Answer all five questions (${unanswered.length} remaining).` });
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
      setFeedback({ type: result.passed ? "success" : "error", text: result.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="evaluation" className="scroll-mt-20 space-y-10" aria-labelledby="driving-eval-heading">
      <SectionHeading
        eyebrow="Self-drive qualification"
        title={<span id="driving-eval-heading">Chauffeur trial, driving test &amp; self-drive clearance</span>}
        lede="New riders start chauffeur-driven. One completed trip unlocks the five-question driving test; an 80% score issues your digital clearance certificate."
        size="h2"
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            <Button asChild>
              <Link href="/cars?service=Chauffeur+%26+Protocol">Book chauffeur trial</Link>
            </Button>
            {!qualification.chauffeur_trial_completed && (
              <Button
                type="button"
                variant="outline"
                onClick={() => confirmTrial("Chauffeur trial recorded. You can now take the driving test evaluation below.")}
              >
                Mark trial complete
              </Button>
            )}
          </div>
        }
      />

      <ol
        aria-label="Self-drive qualification progress"
        className="grid grid-cols-1 divide-y divide-border/70 border-y border-border/70 md:grid-cols-3 md:divide-x md:divide-y-0"
      >
        {SELF_DRIVE_TRIAL_STAGES.map((item, idx) => {
          const state: StageState =
            idx < activeStageIndex || qualification.self_drive_eligible ? "done" : idx === activeStageIndex ? "current" : "locked";
          return (
            <li
              key={item.stage}
              aria-current={state === "current" ? "step" : undefined}
              className={cn("space-y-2.5 py-6 md:px-6 md:first:pl-0 md:last:pr-0", state === "locked" && "opacity-60")}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-2xs uppercase tracking-[0.12em] text-primary tabular-nums">{item.stage}</span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-[0.1em]",
                    state === "done" ? "text-primary" : state === "current" ? "text-amber-700" : "text-muted-foreground"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      state === "done" ? "bg-primary" : state === "current" ? "bg-amber-500" : "bg-border"
                    )}
                  />
                  {stageLabel[state]}
                </span>
              </div>
              <h3 className="text-base font-medium tracking-[-0.01em] text-foreground">{item.title}</h3>
              <p className="font-mono text-2xs text-muted-foreground">{item.subtitle}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{item.description}</p>
            </li>
          );
        })}
      </ol>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
        <div className="space-y-6 lg:col-span-7">
          {!qualification.chauffeur_trial_completed && (
            <Alert variant="warning">
              <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
                <span>
                  <strong>Trial period active.</strong> Complete one chauffeur-driven booking before submitting the evaluation.
                </span>
                <button
                  type="button"
                  onClick={() => confirmTrial("Chauffeur trial recorded. Complete the driving test evaluation below.")}
                  className="shrink-0 font-mono text-xs font-semibold underline underline-offset-4 hover:text-foreground"
                >
                  Already done? Confirm →
                </button>
              </AlertDescription>
            </Alert>
          )}

          <form ref={formRef} onSubmit={handleSubmitEvaluation} className="space-y-8">
            <fieldset className="space-y-5">
              <legend className="mb-5">
                <Eyebrow index="A">Licence &amp; ID verification</Eyebrow>
              </legend>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="eval-frsc">Driver&apos;s licence</Label>
                  <span id="eval-frsc-hint" className="block font-mono text-2xs text-muted-foreground">
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
                  <div className="validated-field-error">Enter a valid 6–20 character licence number.</div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="eval-nin">National ID (NIN)</Label>
                  <span id="eval-nin-hint" className="block font-mono text-2xs text-muted-foreground">
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
                  <div className="validated-field-error">Enter your 11-digit National Identification Number.</div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="eval-exp">Driving experience</Label>
                  <span id="eval-exp-hint" className="block font-mono text-2xs text-muted-foreground">
                    Minimum 2 years
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
                    onChange={(e) => setYearsExperience(Number(e.target.value))}
                    className="validated-input font-mono text-xs tabular-nums"
                  />
                  <div className="validated-field-error">Minimum 2 years driving experience required.</div>
                </div>
              </div>
            </fieldset>

            <div className="space-y-0">
              <div className="mb-2">
                <Eyebrow index="B">Highway code, flood protocol &amp; insurance · 5 questions</Eyebrow>
              </div>
              <div className="divide-y divide-border/70 border-y border-border/70">
                {DRIVING_TEST_QUESTIONS.map((q) => {
                  const selected = answers[q.id];
                  return (
                    <fieldset key={q.id} className="space-y-3 py-6">
                      <legend className="text-sm font-medium leading-snug text-foreground">{q.question}</legend>
                      <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
                        {q.options.map((opt) => (
                          <OptionCard
                            key={opt.id}
                            size="sm"
                            name={`driving_test_${q.id}`}
                            value={opt.id}
                            checked={selected === opt.id}
                            onChange={() => handleSelectAnswer(q.id, opt.id)}
                            title={opt.label}
                          />
                        ))}
                      </div>
                      {showExplanations && (
                        <p className="rounded-sm bg-primary-soft/70 px-3 py-2 font-mono text-2xs text-primary">
                          Official rule: {q.explanation}
                        </p>
                      )}
                    </fieldset>
                  );
                })}
              </div>
            </div>

            {feedback && (
              <Alert variant={feedback.type === "success" ? "emerald" : "destructive"}>
                <AlertDescription className="font-medium">{feedback.text}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" size="lg" disabled={submitting} enterKeyHint="done">
                {submitting
                  ? "Evaluating…"
                  : qualification.self_drive_eligible
                  ? `Re-validate (current ${qualification.driving_test_score}%)`
                  : "Submit driving test"}
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="/cars">Browse fleet</Link>
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-6 lg:col-span-5 lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]">
          <Card tone="surface" className="space-y-5 p-6">
            <div className="flex items-center justify-between border-b border-border/70 pb-4">
              <Eyebrow>Clearance summary</Eyebrow>
              <span
                className={cn(
                  "font-mono text-2xs uppercase tracking-[0.1em]",
                  qualification.self_drive_eligible ? "text-primary" : "text-muted-foreground"
                )}
              >
                {qualification.self_drive_eligible ? "Certified" : "Trial required"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <Stat
                size="sm"
                label="Chauffeur trial"
                value={qualification.chauffeur_trial_completed ? "Complete" : "0 / 1"}
                tone={qualification.chauffeur_trial_completed ? "primary" : "default"}
              />
              <Stat
                size="sm"
                label="Test score"
                value={qualification.driving_test_score > 0 ? `${qualification.driving_test_score}%` : "—"}
                tone={qualification.driving_test_status === "passed" ? "primary" : "default"}
                detail={qualification.driving_test_score > 0 ? qualification.driving_test_status : "80% to pass"}
              />
            </div>
            <Stat
              size="sm"
              label="Certificate"
              value={<span className="text-base">{qualification.clearance_certificate || "Not issued"}</span>}
              tone={qualification.clearance_certificate ? "primary" : "default"}
            />
            <p className="border-t border-border/70 pt-4 text-xs leading-relaxed text-muted-foreground">
              Once the trial and the test are both passed, self-drive unlocks across every vehicle on Izzac.
            </p>
          </Card>

          {!compact && (
            <div className="space-y-3">
              <Eyebrow>Motor insurance at checkout</Eyebrow>
              <Ledger>
                {INSURANCE_PLAN_OPTIONS.map((ins) => (
                  <div key={ins.code} className="space-y-1 py-3.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-sm font-medium text-foreground">{ins.name}</p>
                      <span className="shrink-0 font-mono text-xs font-semibold text-primary tabular-nums">
                        {ins.dailyRateNgn === 0 ? "Included" : `+${formatPrice(ins.dailyRateNgn)}/d`}
                      </span>
                    </div>
                    <p className="font-mono text-2xs text-muted-foreground tabular-nums">
                      {ins.underwriter} · up to {formatPrice(ins.coverageLimitNgn)}
                    </p>
                  </div>
                ))}
              </Ledger>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DrivingEvaluationPanel;
