"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { CURRENCIES, CurrencyCode, useCurrency } from "../context/CurrencyContext";
import { useCookieConsent } from "../context/CookieConsentContext";
import { useOnboarding } from "../context/OnboardingContext";
import { Container } from "./layout/Container";
import { cn } from "@/lib/utils";

const columns = [
  {
    title: "Ride",
    links: [
      { href: "/cars", label: "Browse the fleet" },
      { href: "/cars?service=Chauffeur+%26+Protocol", label: "Chauffeur & protocol" },
      { href: "/cars?service=Airport+VIP+Transfer", label: "Airport VIP transfer" },
      { href: "/services#calculator", label: "Corporate SuperFlex" },
      { href: "/services#benchmark", label: "How we compare" },
    ],
  },
  {
    title: "Hubs",
    links: [
      { href: "/cars?hub=Lagos", label: "Lagos · LOS" },
      { href: "/cars?hub=Abuja", label: "Abuja · ABV" },
      { href: "/cars?hub=Port+Harcourt", label: "Port Harcourt · PHC" },
      { href: "/cars?hub=Kano", label: "Kano · KAN" },
      { href: "/cars?category=Pickup+%26+Shuttle", label: "4x4 & shuttles" },
    ],
  },
  {
    title: "Host",
    links: [
      { href: "/host", label: "Become a host" },
      { href: "/cars/list-car", label: "List a car" },
      { href: "/dashboard/host", label: "Host garage" },
      { href: "/dashboard/bookings", label: "Bookings" },
      { href: "/user/dashboard", label: "Profile & certificates" },
    ],
  },
];

const Footer = () => {
  const { isAuthenticated } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const { openCookieSettings } = useCookieConsent();
  const { openOnboarding, startProductTour } = useOnboarding();

  return (
    <footer className="border-t border-border/70 bg-surface">
      <Container className="py-14 md:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <p className="text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-none tracking-[-0.04em] text-foreground">
              Izzac Mobility<span className="text-primary">.</span>
            </p>
            <p className="max-w-[40ch] text-[15px] leading-relaxed text-muted-foreground">
              Executive chauffeur service, evaluated self-drive, airport protocol and corporate fleets across Nigeria&apos;s
              major hubs. One account for riders and hosts.
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              {isAuthenticated && (
                <>
                  <button
                    type="button"
                    onClick={openOnboarding}
                    className="rounded-md border border-border bg-surface-elevated px-3 py-1.5 font-mono text-xs text-foreground transition-colors duration-150 hover:border-input"
                  >
                    Onboarding guide
                  </button>
                  <button
                    type="button"
                    onClick={startProductTour}
                    className="rounded-md border border-border bg-surface-elevated px-3 py-1.5 font-mono text-xs text-foreground transition-colors duration-150 hover:border-input"
                  >
                    Product tour
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={openCookieSettings}
                className="rounded-md border border-border bg-surface-elevated px-3 py-1.5 font-mono text-xs text-foreground transition-colors duration-150 hover:border-input"
              >
                Cookie settings
              </button>
              <Link
                href="/privacy"
                className="rounded-md border border-border bg-surface-elevated px-3 py-1.5 font-mono text-xs text-foreground transition-colors duration-150 hover:border-input"
              >
                Privacy & cookies
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:pl-8">
            {columns.map((column) => (
              <div key={column.title} className="space-y-4">
                <h2 className="type-eyebrow text-muted-foreground">{column.title}</h2>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-foreground/80 transition-colors duration-150 hover:text-primary">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-2xs uppercase tracking-[0.1em] text-muted-foreground">
            <span className="tabular-nums">© 2026 Izzac Mobility</span>
            <span aria-hidden="true">·</span>
            <span>LOS · ABV · PHC · KAN · IBA · ENU</span>
            <span aria-hidden="true">·</span>
            <span>NIID-verified cover on every trip</span>
            <span aria-hidden="true">·</span>
            <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
              Privacy & Cookie Policy
            </Link>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={openCookieSettings}
              className="uppercase tracking-[0.1em] underline underline-offset-4 hover:text-foreground"
            >
              Manage Cookies
            </button>
          </div>
          <div className="inline-flex items-center rounded-md border border-border bg-surface-elevated p-0.5" role="group" aria-label="Display currency">
            {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setCurrency(code)}
                aria-pressed={currency === code}
                className={cn(
                  "rounded-sm px-2.5 py-1 font-mono text-2xs font-semibold transition-colors duration-150",
                  currency === code ? "bg-ink text-ink-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
