"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { CURRENCIES, CurrencyCode, useCurrency } from "./CurrencyContext";
import { Badge } from "../components/ui/badge";
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
    badge: "Step 1 of 4 · Welcome to Izzac",
    title: "Your Nigerian & Pan-African Mobility Operating System",
    summary:
      "Izzac upgrades global car rental models (like Europcar) specifically for Lagos, Abuja, Port Harcourt, and regional African corridors.",
    bullets: [
      "Toggle any vehicle between Vetted Corporate Chauffeur (+₦25k/day) and Verified Self-Drive.",
      "Schedule flight-tracked Airport VIP Meet & Greet at MMIA Lagos (LOS), Abuja (ABV), and PH (PHC).",
      "Use one unified account to both book executive rides and monetize your own vehicles.",
    ],
  },
  {
    step: "02",
    badge: "Step 2 of 4 · Currency & Regional Hubs",
    title: "Choose your preferred display currency",
    summary:
      "All 32+ vehicles are natively priced in Nigerian Naira (₦ NGN), with instant live conversion for international and Pan-African teams.",
    bullets: [
      "Switch anytime between ₦ NGN, $ USD, GH₵ GHS (Ghana), and KSh KES (Kenya).",
      "Filter inventory by city hub: Lagos, Abuja, Port Harcourt, Kano, Ibadan, and Enugu.",
      "Automatic 10% Weekly (7+ days) and 22% Monthly SuperFlex (30+ days) discounts.",
    ],
  },
  {
    step: "03",
    badge: "Step 3 of 4 · Nigerian Road & Fuel Protection",
    title: "Engineered for real road & fuel conditions",
    summary:
      "Instead of generic European winter tyres or ski racks, Izzac equips every trip with practical African mobility protection and add-ons.",
    bullets: [
      "Naija Road, Tyre & Flood Shield covers pothole tyre/rim impact and windscreen chips.",
      "Prepaid Full-Tank Fuel Provisioning lets you skip filling station queues completely.",
      "Optional Mobile Police (MOPOL) / Protocol Security Escort and 5G Cabin Wi-Fi.",
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
    title: "Filter by Nigerian City Hub & Mobility Service",
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
      "Explore our Services & B2B hub to calculate 22% Monthly SuperFlex savings and inspect the side-by-side Izzac vs. Europcar comparison table.",
    actionLabel: "Open Services & B2B",
    actionHref: "/services",
  },
  {
    id: 4,
    eyebrow: "Tour Stop 04 / 05 · Vehicle Dossier & Configurator",
    title: "Customize Chauffeur, Naija Road Shield & Prepaid Fuel",
    description:
      "Open any vehicle page to configure dates, toggle Chauffeur vs. Self-Drive, select pothole/tyre shield, and add Prepaid Full-Tank Fuel.",
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
  const { currency, setCurrency } = useCurrency();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Show non-blocking welcome bar / onboarding prompt on first visit
  const [showFirstVisitBanner, setShowFirstVisitBanner] = useState(false);

  useEffect(() => {
    try {
      const seen = window.localStorage.getItem(ONBOARDING_SEEN_KEY);
      if (!seen) {
        setShowFirstVisitBanner(true);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

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
      {/* First-visit non-blocking welcome bar so SSR page source & initial layout remain clean */}
      {showFirstVisitBanner && !isOpen && !isTourActive && (
        <div
          role="region"
          aria-label="First-time visitor onboarding guide"
          className="border-b border-emerald-900/30 bg-[#0d1713] text-stone-100 px-4 py-2.5 text-xs"
        >
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Badge variant="dark">New to Izzac?</Badge>
              <span className="text-stone-200">
                Take the 4-step Nigerian & African Mobility Onboarding or launch the interactive Product Tour.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openOnboarding}
                className="rounded-md bg-primary px-3 py-1 font-mono text-[11px] font-semibold text-primary-foreground hover:bg-emerald-700 transition-colors"
              >
                Start Onboarding (4 Steps)
              </button>
              <button
                type="button"
                onClick={startProductTour}
                className="rounded-md border border-white/20 bg-white/5 px-3 py-1 font-mono text-[11px] font-semibold text-stone-100 hover:bg-white/10 transition-colors"
              >
                Guided Product Tour
              </button>
              <button
                type="button"
                onClick={markOnboardingSeen}
                aria-label="Dismiss welcome guide"
                className="px-2 py-1 font-mono text-[11px] text-stone-400 hover:text-stone-200"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {children}

      {/* Step-by-Step Onboarding Modal Dialog (Modern Web Guidance: light-dismiss-a-dialog) */}
      <dialog
        ref={dialogRef}
        {...({ closedby: "any" } as React.DialogHTMLAttributes<HTMLDialogElement>)}
        aria-labelledby="onboarding-dialog-title"
        className="w-full max-w-xl rounded-2xl border border-border bg-card p-0 text-foreground shadow-elevated backdrop:bg-black/60 backdrop:backdrop-blur-xs"
      >
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border/80 pb-4">
            <Badge variant="emerald">{currentSlide.badge}</Badge>
            <button
              type="button"
              onClick={closeOnboarding}
              className="rounded-lg border border-border/80 px-2.5 py-1 font-mono text-xs text-muted-foreground hover:text-foreground"
            >
              Esc · Close
            </button>
          </div>

          <div className="space-y-3">
            <h2
              id="onboarding-dialog-title"
              className="text-2xl font-bold text-foreground tracking-[-0.03em]"
            >
              {currentSlide.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentSlide.summary}
            </p>
          </div>

          {onboardingStep === 1 && (
            <div className="rounded-xl border border-border/80 bg-secondary/50 p-4 space-y-2.5">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-foreground">
                Select your active currency:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setCurrency(code)}
                    className={`rounded-lg border px-3 py-2 font-mono text-xs font-semibold transition-colors ${
                      currency === code
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:bg-secondary"
                    }`}
                  >
                    {CURRENCIES[code].flag} {CURRENCIES[code].label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <ul className="space-y-2.5 border-t border-border/70 pt-4 text-sm text-foreground/90">
            {currentSlide.bullets.map((bullet, idx) => (
              <li key={bullet} className="flex items-start gap-2.5">
                <span className="font-mono text-xs font-bold text-primary pt-0.5 tabular-nums">
                  0{idx + 1}
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          {/* Step Progress Dots & Navigation Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/80 pt-5">
            <div className="flex items-center gap-1.5" aria-label="Onboarding progress">
              {ONBOARDING_STEPS.map((s, idx) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setOnboardingStep(idx)}
                  aria-label={`Go to step ${idx + 1}`}
                  className={`h-2 rounded-full transition-all ${
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
                  ← Previous
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
                  Next step →
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={startProductTour}
                  >
                    Launch Product Tour
                  </Button>
                  <Button type="button" size="sm" onClick={closeOnboarding}>
                    Start Exploring
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </dialog>

      {/* Guided Product Tour Floating Dock */}
      {isTourActive && (
        <aside
          aria-label="Guided Product Tour"
          className="fixed bottom-4 inset-x-4 z-50 mx-auto max-w-2xl rounded-2xl border border-emerald-500/40 bg-[#0d1713] p-5 text-stone-100 shadow-elevated animate-enter-subtle"
        >
          <div className="flex items-center justify-between gap-2 pb-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-300 tabular-nums">
              {currentTourStop.eyebrow}
            </span>
            <button
              type="button"
              onClick={stopProductTour}
              className="font-mono text-xs text-stone-400 hover:text-stone-100"
            >
              End Tour ✕
            </button>
          </div>

          <h3 className="text-lg font-bold text-stone-50 tracking-[-0.02em]">
            {currentTourStop.title}
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
            {currentTourStop.description}
          </p>

          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <Link
              href={currentTourStop.actionHref}
              onClick={stopProductTour}
              className="font-mono text-xs font-semibold text-emerald-300 hover:underline"
            >
              {currentTourStop.actionLabel} →
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={tourStep === 0}
                onClick={() => setTourStep((s) => Math.max(0, s - 1))}
                className="rounded-lg border border-white/15 px-3 py-1.5 font-mono text-xs text-stone-200 disabled:opacity-40 hover:bg-white/10"
              >
                ← Prev
              </button>
              {tourStep < PRODUCT_TOUR_STOPS.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setTourStep((s) =>
                      Math.min(PRODUCT_TOUR_STOPS.length - 1, s + 1)
                    )
                  }
                  className="rounded-lg bg-primary px-3.5 py-1.5 font-mono text-xs font-semibold text-primary-foreground hover:bg-emerald-700"
                >
                  Next ({tourStep + 1}/{PRODUCT_TOUR_STOPS.length}) →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopProductTour}
                  className="rounded-lg bg-primary px-3.5 py-1.5 font-mono text-xs font-semibold text-primary-foreground hover:bg-emerald-700"
                >
                  Finish Tour ✓
                </button>
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
