"use client";

import Link from "next/link";
import Image from "next/image";
import { CURRENCIES, CurrencyCode, useCurrency } from "../context/CurrencyContext";
import { useOnboarding } from "../context/OnboardingContext";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Tooltip } from "./ui/tooltip";

const footerSections = [
  {
    title: "Mobility Services",
    links: [
      { href: "/services", label: "All Products & Services" },
      { href: "/cars?service=Chauffeur+%26+Protocol", label: "Chauffeur & Protocol" },
      { href: "/cars?service=Airport+VIP+Transfer", label: "Airport VIP (LOS/ABV/PHC)" },
      { href: "/services#calculator", label: "Corporate SuperFlex (-22%)" },
      { href: "/services#benchmark", label: "Izzac vs. Europcar" },
    ],
  },
  {
    title: "Fleet & Hubs",
    links: [
      { href: "/cars", label: "Browse 32+ Vehicles" },
      { href: "/cars?hub=Lagos", label: "Lagos (VI, Lekki, Ikeja)" },
      { href: "/cars?hub=Abuja", label: "Abuja (Maitama, Asokoro)" },
      { href: "/cars?hub=Port+Harcourt", label: "Port Harcourt Energy Hub" },
      { href: "/cars?category=Pickup+%26+Shuttle", label: "Hilux 4x4 & Executive Vans" },
    ],
  },
  {
    title: "Host & Account",
    links: [
      { href: "/host", label: "Host & Fleet Partners" },
      { href: "/cars/list-car", label: "How Listing Works" },
      { href: "/dashboard/add-car", label: "List a Car" },
      { href: "/dashboard", label: "My Garage" },
      { href: "/dashboard/bookings", label: "Bookings Workspace" },
    ],
  },
];

const Footer = () => {
  const { currency, setCurrency } = useCurrency();
  const { openOnboarding, startProductTour } = useOnboarding();

  return (
    <footer className="border-t border-border/80 bg-secondary/40 text-foreground">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-10">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo-mark.svg"
                alt="Izzac Mobility crest logo"
                width={32}
                height={32}
                loading="lazy"
                className="h-8 w-8 shrink-0 rounded-lg shadow-surface"
              />
              <span className="text-xl font-bold tracking-[-0.03em] text-foreground">
                Izzac
              </span>
              <Badge variant="emerald">Nigeria & Pan-African Mobility</Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Enterprise car rental, vetted corporate chauffeur service, airport VIP meet & greet, and P2P fleet sharing built for Lagos, Abuja, Port Harcourt, and West/East African corridors.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1 font-mono text-xs text-muted-foreground tabular-nums">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-card px-2.5 py-1">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="h-3.5 w-3.5 text-primary"
                >
                  <circle cx="10" cy="10" r="7.5" />
                  <path d="M2.5 10h15M10 2.5c2.2 2.2 2.2 12.8 0 15M10 2.5c-2.2 2.2-2.2 12.8 0 15" />
                </svg>
                <span>NG · GH · KE Hubs</span>
              </span>
              <div className="inline-flex items-center rounded-md border border-border/80 bg-card p-0.5">
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setCurrency(code)}
                    className={`rounded px-2 py-0.5 text-[11px] font-semibold transition-colors duration-150 ${
                      currency === code
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {CURRENCIES[code].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Tooltip
                position="top"
                content="Re-open the 4-step Nigerian & African mobility intro"
              >
                <button
                  type="button"
                  onClick={openOnboarding}
                  className="rounded-lg border border-border/80 bg-card px-3 py-1.5 font-mono text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  Onboarding Guide
                </button>
              </Tooltip>
              <Tooltip
                position="top"
                content="Walk through the 5 core features step by step"
              >
                <button
                  type="button"
                  onClick={startProductTour}
                  className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-xs font-semibold text-primary hover:bg-primary/15 transition-colors"
                >
                  Start Product Tour
                </button>
              </Tooltip>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-3">
                <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                  {section.title}
                </h2>
                <ul className="space-y-2.5 text-sm">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground transition-colors duration-150 ease-out-quart hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-mono tabular-nums">© 2026 Izzac Mobility Africa.</span>
            <span aria-hidden="true">·</span>
            <Link href="/" className="hover:text-foreground transition-colors duration-150">
              Home
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/services" className="hover:text-foreground transition-colors duration-150">
              Services & B2B
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/cars" className="hover:text-foreground transition-colors duration-150">
              Browse fleet
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/host" className="hover:text-foreground transition-colors duration-150">
              Host
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/dashboard/rider" className="hover:text-foreground transition-colors duration-150">
              Rider Hub
            </Link>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
            <Link
              href="/cars?hub=Lagos"
              className="hover:text-foreground transition-colors duration-150"
            >
              LOS Lagos
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href="/cars?hub=Abuja"
              className="hover:text-foreground transition-colors duration-150"
            >
              ABV Abuja
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href="/cars?hub=Port+Harcourt"
              className="hover:text-foreground transition-colors duration-150"
            >
              PHC Port Harcourt
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
