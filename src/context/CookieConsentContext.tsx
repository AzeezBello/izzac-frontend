"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { Eyebrow } from "../components/layout/Eyebrow";
import { OptionCard } from "../components/layout/OptionCard";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

export interface CookiePreferences {
  essential: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
  decided: boolean;
}

interface CookieConsentContextValue {
  preferences: CookiePreferences;
  hasConsented: boolean;
  acceptAllCookies: () => void;
  rejectNonEssentialCookies: () => void;
  saveCookiePreferences: (prefs: Pick<CookiePreferences, "functional" | "analytics" | "marketing">) => void;
  openCookieSettings: () => void;
  closeCookieSettings: () => void;
}

const CONSENT_STORAGE_KEY = "izzac_cookie_consent_v1";
const CONSENT_COOKIE_NAME = "izzac_cookie_consent";
const NON_ESSENTIAL_COOKIES = ["izzac_functional", "izzac_analytics", "izzac_marketing"];

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
  updatedAt: "",
  decided: false,
};

const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(
  undefined
);

type CookieStoreLike = {
  set: (options: {
    name: string;
    value: string;
    expires?: number;
    path?: string;
    sameSite?: "strict" | "lax" | "none";
  }) => Promise<void>;
  delete: (name: string) => Promise<void>;
};

const getBrowserCookieStore = (): CookieStoreLike | null => {
  if (typeof window === "undefined") return null;
  const win = window as Window & { cookieStore?: CookieStoreLike };
  return win.cookieStore ?? null;
};

const writeConsentCookie = async (prefs: CookiePreferences) => {
  if (typeof window === "undefined") return;
  const compactValue = encodeURIComponent(
    JSON.stringify({
      e: 1,
      f: prefs.functional ? 1 : 0,
      a: prefs.analytics ? 1 : 0,
      m: prefs.marketing ? 1 : 0,
      t: prefs.updatedAt,
    })
  );
  const oneYearMs = 365 * 24 * 60 * 60 * 1000;
  const store = getBrowserCookieStore();

  if (store) {
    try {
      await store.set({
        name: CONSENT_COOKIE_NAME,
        value: compactValue,
        expires: Date.now() + oneYearMs,
        path: "/",
        sameSite: "lax",
      });
    } catch {
      document.cookie = `${CONSENT_COOKIE_NAME}=${compactValue}; Max-Age=31536000; Path=/; SameSite=Lax`;
    }
  } else {
    document.cookie = `${CONSENT_COOKIE_NAME}=${compactValue}; Max-Age=31536000; Path=/; SameSite=Lax`;
  }

  // Clear any non-essential cookies that were revoked
  const toDelete: string[] = [];
  if (!prefs.functional) toDelete.push("izzac_functional");
  if (!prefs.analytics) toDelete.push("izzac_analytics");
  if (!prefs.marketing) toDelete.push("izzac_marketing");

  for (const name of toDelete) {
    if (store) {
      try {
        await store.delete(name);
      } catch {
        document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
      }
    } else {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    }
  }
};

export const CookieConsentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);
  const [showBanner, setShowBanner] = useState(false);

  // Draft toggles inside the preferences modal
  const [draftFunctional, setDraftFunctional] = useState(true);
  const [draftAnalytics, setDraftAnalytics] = useState(false);
  const [draftMarketing, setDraftMarketing] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<CookiePreferences>;
        if (parsed && parsed.decided) {
          const restored: CookiePreferences = {
            essential: true,
            functional: Boolean(parsed.functional),
            analytics: Boolean(parsed.analytics),
            marketing: Boolean(parsed.marketing),
            updatedAt: parsed.updatedAt || new Date().toISOString(),
            decided: true,
          };
          setPreferences(restored);
          setDraftFunctional(restored.functional);
          setDraftAnalytics(restored.analytics);
          setDraftMarketing(restored.marketing);
          setShowBanner(false);
          return;
        }
      }
    } catch {
      // Ignore storage read errors
    }
    setShowBanner(true);
  }, []);

  // Light-dismiss fallback for browsers without native closedby="any"
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

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
      dialog.removeEventListener("click", handleBackdropClick);
    };
  }, []);

  const persistPreferences = useCallback((next: CookiePreferences) => {
    setPreferences(next);
    setDraftFunctional(next.functional);
    setDraftAnalytics(next.analytics);
    setDraftMarketing(next.marketing);
    setShowBanner(false);

    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage errors
    }

    void writeConsentCookie(next);

    const dialog = dialogRef.current;
    if (dialog && dialog.open) {
      dialog.close();
    }
  }, []);

  const acceptAllCookies = useCallback(() => {
    persistPreferences({
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
      updatedAt: new Date().toISOString(),
      decided: true,
    });
  }, [persistPreferences]);

  const rejectNonEssentialCookies = useCallback(() => {
    // Also clear any non-essential cookies immediately
    if (typeof document !== "undefined") {
      for (const name of NON_ESSENTIAL_COOKIES) {
        document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
      }
    }
    persistPreferences({
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
      updatedAt: new Date().toISOString(),
      decided: true,
    });
  }, [persistPreferences]);

  const saveCookiePreferences = useCallback(
    (prefs: Pick<CookiePreferences, "functional" | "analytics" | "marketing">) => {
      persistPreferences({
        essential: true,
        functional: prefs.functional,
        analytics: prefs.analytics,
        marketing: prefs.marketing,
        updatedAt: new Date().toISOString(),
        decided: true,
      });
    },
    [persistPreferences]
  );

  const openCookieSettings = useCallback(() => {
    setDraftFunctional(preferences.decided ? preferences.functional : true);
    setDraftAnalytics(preferences.decided ? preferences.analytics : false);
    setDraftMarketing(preferences.decided ? preferences.marketing : false);
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, [preferences]);

  const closeCookieSettings = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog && dialog.open) {
      dialog.close();
    }
  }, []);

  return (
    <CookieConsentContext.Provider
      value={{
        preferences,
        hasConsented: preferences.decided,
        acceptAllCookies,
        rejectNonEssentialCookies,
        saveCookiePreferences,
        openCookieSettings,
        closeCookieSettings,
      }}
    >
      {children}

      {/* Non-blocking bottom cookie consent banner */}
      {showBanner && (
        <aside
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface-elevated/95 shadow-floating backdrop-blur-md animate-enter-subtle"
        >
          <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10 xl:px-12">
            <div className="max-w-3xl space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <Eyebrow index="01">Privacy & cookie consent</Eyebrow>
                <Badge variant="emerald">NDPA 2023 & GDPR</Badge>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
                We use strictly necessary cookies to secure your account, bookings and NIID motor insurance checkout. With your consent, we also store regional currency preferences and anonymous fleet telemetry. Read our{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-foreground underline underline-offset-4 transition-colors duration-150 hover:text-primary"
                >
                  Privacy & Cookie Policy
                </Link>
                .
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={rejectNonEssentialCookies}
              >
                Reject non-essential
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={openCookieSettings}
              >
                Customize
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={acceptAllCookies}
              >
                Accept all
              </Button>
            </div>
          </div>
        </aside>
      )}

      {/* Granular cookie preferences modal (<dialog>) */}
      <dialog
        ref={dialogRef}
        {...({ closedby: "any" } as React.DialogHTMLAttributes<HTMLDialogElement>)}
        aria-labelledby="cookie-dialog-title"
        className="w-full max-w-xl rounded-xl border border-border bg-surface-elevated p-0 text-foreground shadow-modal backdrop:bg-ink/60 backdrop:backdrop-blur-sm open:animate-enter-subtle"
      >
        <div className="space-y-5 p-6 md:p-7">
          <div className="flex items-center justify-between border-b border-border/70 pb-4">
            <Eyebrow index="01">Cookie & storage preferences</Eyebrow>
            <button
              type="button"
              onClick={closeCookieSettings}
              className="rounded-sm border border-border px-2.5 py-1 font-mono text-2xs text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              Esc · Close
            </button>
          </div>

          <div className="space-y-2">
            <h2 id="cookie-dialog-title" className="text-h2 text-foreground">
              Manage how Izzac Mobility uses cookies
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Under the Nigeria Data Protection Act (NDPA) 2023 and GDPR, non-essential cookies are disabled until you opt in. You can change or revoke consent at any time.{" "}
              <Link
                href="/privacy"
                onClick={closeCookieSettings}
                className="font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
              >
                View full Privacy & Cookie Policy →
              </Link>
            </p>
          </div>

          <div className="space-y-2.5">
            <OptionCard
              kind="checkbox"
              size="sm"
              checked
              disabled
              readOnly
              title="01 · Strictly necessary & security"
              meta="Always active"
              description="Required for JWT authentication, session integrity, NIID motor insurance verification, and storing your cookie consent choice."
            />
            <OptionCard
              kind="checkbox"
              size="sm"
              checked={draftFunctional}
              onChange={(e) => setDraftFunctional(e.target.checked)}
              title="02 · Functional & regional currency"
              meta={draftFunctional ? "Enabled" : "Off"}
              description="Remembers your display currency (NGN, USD, GHS, KES), preferred Nigerian city hub (Lagos, Abuja, PHC), and onboarding status."
            />
            <OptionCard
              kind="checkbox"
              size="sm"
              checked={draftAnalytics}
              onChange={(e) => setDraftAnalytics(e.target.checked)}
              title="03 · Performance & fleet telemetry"
              meta={draftAnalytics ? "Enabled" : "Off"}
              description="Anonymous aggregate metrics on vehicle search demand, page load speed (Core Web Vitals), and booking funnel reliability."
            />
            <OptionCard
              kind="checkbox"
              size="sm"
              checked={draftMarketing}
              onChange={(e) => setDraftMarketing(e.target.checked)}
              title="04 · Corporate SuperFlex & host updates"
              meta={draftMarketing ? "Enabled" : "Off"}
              description="Optional notifications about B2B SuperFlex monthly discounts and host fleet yield programs."
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-border/70 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={rejectNonEssentialCookies}
            >
              Reject non-essential
            </Button>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  saveCookiePreferences({
                    functional: draftFunctional,
                    analytics: draftAnalytics,
                    marketing: draftMarketing,
                  })
                }
              >
                Save preferences
              </Button>
              <Button type="button" size="sm" onClick={acceptAllCookies}>
                Accept all
              </Button>
            </div>
          </div>
        </div>
      </dialog>
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = (): CookieConsentContextValue => {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    return {
      preferences: DEFAULT_PREFERENCES,
      hasConsented: false,
      acceptAllCookies: () => {},
      rejectNonEssentialCookies: () => {},
      saveCookiePreferences: () => {},
      openCookieSettings: () => {},
      closeCookieSettings: () => {},
    };
  }
  return ctx;
};
