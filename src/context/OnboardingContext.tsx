"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useAuth } from "./AuthContext";
import { CURRENCIES, CurrencyCode, useCurrency } from "./CurrencyContext";
import { Eyebrow } from "../components/layout/Eyebrow";
import { Button } from "../components/ui/button";

type OnboardingContextValue = {
  openOnboarding: () => void;
  closeOnboarding: () => void;
  startProductTour: () => void;
  stopProductTour: () => void;
  isTourActive: boolean;
  tourStep: number;
};

const OnboardingContext = createContext<OnboardingContextValue | undefined>(
  undefined
);

const ONBOARDING_SEEN_KEY = "izzac_onboarding_completed_v1";

const ONBOARDING_STEPS = [
  {
    step: "01",
    badge: "Step 1 of 4 · Welcome to Izzac Mobility",
    title: "Your Executive Mobility & Fleet Operating System",
    summary:
      "Izzac Mobility upgrades global car rental models (like Europcar) with mandatory Chauffeur-Driven trials, Self-Drive evaluation, and verified motor insurance.",
    bullets: [
      "New riders start with a Chauffeur-Driven Trial trip (+₦25k/day) before taking the Driving Test Evaluation to unlock Self-Drive.",
      "Schedule flight-tracked Airport VIP Meet & Greet at LOS, ABV, and PHC terminals.",
      "Use one unified account to both book executive rides and monetize your own vehicles.",
    ],
  },
  {
    step: "02",
    badge: "Step 2 of 4 · Currency & Regional Hubs",
    title: "Choose your preferred display currency",
    summary:
      "All 32+ vehicles are natively priced in ₦ NGN, with instant live conversion for international and regional corporate teams.",
    bullets: [
      "Switch anytime between ₦ NGN, $ USD, GH₵ GHS, and KSh KES.",
      "Filter inventory by city hub: Lagos, Abuja, Port Harcourt, Kano, Ibadan, and Enugu.",
      "Automatic 10% Weekly (7+ days) and 22% Monthly SuperFlex (30+ days) discounts.",
    ],
  },
  {
    step: "03",
    badge: "Step 3 of 4 · Motor Insurance, Road & Fuel Protection",
    title: "Engineered for real road & fuel conditions",
    summary:
      "Instead of generic winter tyres or ski racks, Izzac Mobility equips every trip with NIID motor insurance, road protection, and executive add-ons.",
    bullets: [
      "Every booking includes NAICOM/NIID Motor Insurance (Statutory Third-Party, Comprehensive, or Zero-Excess).",
      "Road, Tyre & Flood Shield covers pothole tyre/rim impact and windscreen chips.",
      "Prepaid Full-Tank Fuel Provisioning and optional Mobile Police (MOPOL) / Protocol Security Escort.",
    ],
  },
  {
    step: "04",
    badge: "Step 4 of 4 · Ready to Explore",
    title: "Start browsing or take the 60-second Product Tour",
    summary:
      "Jump straight into the live 32-vehicle catalogue, compare our B2B SuperFlex fleet rates against Europcar, or launch the guided Product Tour.",
    bullets: [
      "Browse 32+ verified executive sedans, luxury SUVs, EVs, and Hilux 4x4 pickups.",
      "Use the interactive Corporate Rate Estimator on the Services & B2B page.",
      "Publish your own car in My Garage to earn recurring NGN host revenue.",
    ],
  },
];

const PRODUCT_TOUR_STOPS = [
  {
    id: 1,
    eyebrow: "Tour Stop 01 / 05 · Header Currency & Navigation",
    title: "Multi-Currency Switcher & Quick Navigation",
    description:
      "Use the currency selector in the top bar to switch all rates between ₦ NGN, $ USD, GH₵ GHS, and KSh KES immediately.",
    actionLabel: "Browse Fleet",
    actionHref: "/cars",
  },
  {
    id: 2,
    eyebrow: "Tour Stop 02 / 05 · Hub & Service Mode Filters",
    title: "Filter by City Hub & Mobility Service",
    description:
      "Narrow the 32-vehicle fleet by Lagos, Abuja, Port Harcourt, or Kano—and filter specifically for Chauffeur & Protocol, Airport VIP, or Interstate 4x4 units.",
    actionLabel: "Filter Lagos Fleet",
    actionHref: "/cars?hub=Lagos",
  },
  {
    id: 3,
    eyebrow: "Tour Stop 03 / 05 · Services & Europcar Benchmark",
    title: "6 Mobility Pillars & Corporate SuperFlex Calculator",
    description:
      "Explore our Services & B2B hub to calculate 22% Monthly SuperFlex savings and inspect the side-by-side Izzac Mobility vs. Europcar comparison table.",
    actionLabel: "Open Services & B2B",
    actionHref: "/services",
  },
  {
    id: 4,
    eyebrow: "Tour Stop 04 / 05 · Vehicle Dossier & Configurator",
    title: "Customize Chauffeur, Motor Insurance & Prepaid Fuel",
    description:
      "Open any vehicle page to configure dates, toggle Chauffeur vs. Self-Drive, select NIID motor insurance, and add Prepaid Full-Tank Fuel.",
    actionLabel: "Inspect Sample Vehicle",
    actionHref: "/cars/3",
  },
  {
    id: 5,
    eyebrow: "Tour Stop 05 / 05 · Dual-Role Rider & Host Workspace",
    title: "Manage Bookings & Your Host Garage in One Account",
    description:
      "Track trips you booked as a rider or switch to Host Mode to manage vehicles you list and reservations made on your fleet.",
    actionLabel: "Explore Host Tools",
    actionHref: "/host",
  },
];

export const OnboardingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Show non-blocking welcome bar / onboarding prompt only for logged-in users who haven't completed it
  const [showFirstVisitBanner, setShowFirstVisitBanner] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      setShowFirstVisitBanner(false);
      setIsOpen(false);
      setIsTourActive(false);
      const dialog = dialogRef.current;
      if (dialog && dialog.open) {
        dialog.close();
      }
      return;
    }

    try {
      const seen = window.localStorage.getItem(ONBOARDING_SEEN_KEY);
      if (!seen) {
        setShowFirstVisitBanner(true);
      }
    } catch {
      // Ignore storage errors
    }
  }, [isAuthenticated, isLoading]);

  // Modern Web Guidance (light-dismiss-a-dialog): fallback for browsers without native closedby="any"
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      setIsOpen(false);
    };
    dialog.addEventListener("close", handleClose);

    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!isInDialog) {
        dialog.close();
      }
    };

    if (
      typeof HTMLDialogElement !== "undefined" &&
      !("closedBy" in HTMLDialogElement.prototype)
    ) {
      dialog.addEventListener("click", handleBackdropClick);
    }

    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("click", handleBackdropClick);
    };
  }, []);

  const markOnboardingSeen = () => {
    setShowFirstVisitBanner(false);
    try {
      window.localStorage.setItem(ONBOARDING_SEEN_KEY, "true");
    } catch {
      // Ignore storage errors
    }
  };

  const openOnboarding = () => {
    if (!isAuthenticated) return;
    setOnboardingStep(0);
    setIsOpen(true);
    setShowFirstVisitBanner(false);
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  };

  const closeOnboarding = () => {
    markOnboardingSeen();
    setIsOpen(false);
    const dialog = dialogRef.current;
    if (dialog && dialog.open) {
      dialog.close();
    }
  };

  const startProductTour = () => {
    if (!isAuthenticated) return;
    closeOnboarding();
    setTourStep(0);
    setIsTourActive(true);
  };

  const stopProductTour = () => {
    markOnboardingSeen();
    setIsTourActive(false);
  };

  const currentSlide = ONBOARDING_STEPS[onboardingStep] || ONBOARDING_STEPS[0];
  const currentTourStop =
    PRODUCT_TOUR_STOPS[tourStep] || PRODUCT_TOUR_STOPS[0];

  return (
    <OnboardingContext.Provider
      value={{
        openOnboarding,
        closeOnboarding,
        startProductTour,
        stopProductTour,
        isTourActive,
        tourStep,
      }}
    >
      {/* First-visit, non-blocking welcome bar (logged-in users only) */}
      {isAuthenticated && showFirstVisitBanner && !isOpen && !isTourActive && (
        <div
          role="region"
          aria-label="First-time visitor onboarding guide"
          className="border-b border-border/70 bg-surface"
        >
          <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-10 xl:px-12">
            <p className="flex items-center gap-3 text-xs text-foreground/85">
              <span className="type-eyebrow text-primary">New here?</span>
              <span>Take the four-step introduction or a 60-second product tour.</span>
            </p>
            <div className="flex items-center gap-1.5">
              <Button type="button" size="sm" onClick={openOnboarding}>
                Start introduction
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={startProductTour}>
                Product tour
              </Button>
              <button
                type="button"
                onClick={markOnboardingSeen}
                aria-label="Dismiss welcome guide"
                className="px-2 py-1 font-mono text-2xs text-muted-foreground transition-colors duration-150 hover:text-foreground"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {children}

      {/* Step-by-step onboarding dialog (light-dismiss) */}
      <dialog
        ref={dialogRef}
        {...({ closedby: "any" } as React.DialogHTMLAttributes<HTMLDialogElement>)}
        aria-labelledby="onboarding-dialog-title"
        className="w-full max-w-xl rounded-xl border border-border bg-surface-elevated p-0 text-foreground shadow-modal backdrop:bg-ink/60 backdrop:backdrop-blur-sm open:animate-enter-subtle"
      >
        <div className="space-y-6 p-6 md:p-8">
          <div className="flex items-center justify-between border-b border-border/70 pb-4">
            <Eyebrow index={currentSlide.step}>{currentSlide.badge}</Eyebrow>
            <button
              type="button"
              onClick={closeOnboarding}
              className="rounded-sm border border-border px-2.5 py-1 font-mono text-2xs text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              Esc · Close
            </button>
          </div>

          <div className="space-y-3">
            <h2 id="onboarding-dialog-title" className="text-h2 text-foreground">
              {currentSlide.title}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{currentSlide.summary}</p>
          </div>

          {onboardingStep === 1 && (
            <div className="space-y-2.5">
              <p className="type-eyebrow text-muted-foreground">Display currency</p>
              <div className="grid grid-cols-2 gap-1 rounded-md border border-border bg-surface p-1 sm:grid-cols-4" role="group" aria-label="Display currency">
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setCurrency(code)}
                    aria-pressed={currency === code}
                    className={`rounded-sm py-2 font-mono text-xs font-medium transition-colors duration-150 ${
                      currency === code
                        ? "bg-ink text-ink-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {CURRENCIES[code].flag} {code}
                  </button>
                ))}
              </div>
            </div>
          )}

          <ol className="divide-y divide-border/70 border-y border-border/70">
            {currentSlide.bullets.map((bullet, idx) => (
              <li key={bullet} className="grid grid-cols-[2rem_1fr] gap-2 py-3 text-sm text-foreground/90">
                <span className="font-mono text-xs text-primary tabular-nums">0{idx + 1}</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-1.5" aria-label="Onboarding progress">
              {ONBOARDING_STEPS.map((s, idx) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setOnboardingStep(idx)}
                  aria-label={`Go to step ${idx + 1}`}
                  aria-current={idx === onboardingStep ? "step" : undefined}
                  className={`h-1.5 rounded-full transition-[width,background-color] duration-200 ease-out-quart ${
                    idx === onboardingStep
                      ? "w-7 bg-primary"
                      : "w-2 bg-border hover:bg-muted-foreground"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {onboardingStep > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setOnboardingStep((s) => Math.max(0, s - 1))}
                >
                  Previous
                </Button>
              )}

              {onboardingStep < ONBOARDING_STEPS.length - 1 ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    setOnboardingStep((s) =>
                      Math.min(ONBOARDING_STEPS.length - 1, s + 1)
                    )
                  }
                >
                  Next step
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={startProductTour}
                  >
                    Launch product tour
                  </Button>
                  <Button type="button" size="sm" onClick={closeOnboarding}>
                    Start exploring
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </dialog>

      {/* Guided product tour dock (logged-in users only) */}
      {isAuthenticated && isTourActive && (
        <aside
          aria-label="Guided product tour"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-lg border border-border bg-surface-elevated p-5 text-foreground shadow-floating animate-enter-subtle"
        >
          <div className="flex items-center justify-between gap-2 pb-2">
            <Eyebrow>{currentTourStop.eyebrow}</Eyebrow>
            <button
              type="button"
              onClick={stopProductTour}
              className="font-mono text-2xs text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              End tour ✕
            </button>
          </div>

          <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
            {currentTourStop.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {currentTourStop.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-3">
            <Link
              href={currentTourStop.actionHref}
              onClick={stopProductTour}
              className="text-sm font-medium text-primary transition-colors duration-150 hover:text-primary-hover"
            >
              {currentTourStop.actionLabel} →
            </Link>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={tourStep === 0}
                onClick={() => setTourStep((s) => Math.max(0, s - 1))}
              >
                Prev
              </Button>
              {tourStep < PRODUCT_TOUR_STOPS.length - 1 ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    setTourStep((s) =>
                      Math.min(PRODUCT_TOUR_STOPS.length - 1, s + 1)
                    )
                  }
                >
                  Next ({tourStep + 1}/{PRODUCT_TOUR_STOPS.length})
                </Button>
              ) : (
                <Button type="button" size="sm" onClick={stopProductTour}>
                  Finish tour
                </Button>
              )}
            </div>
          </div>
        </aside>
      )}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextValue => {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    return {
      openOnboarding: () => {},
      closeOnboarding: () => {},
      startProductTour: () => {},
      stopProductTour: () => {},
      isTourActive: false,
      tourStep: 0,
    };
  }
  return ctx;
};
