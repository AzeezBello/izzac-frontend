"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import { useAuth } from "../context/AuthContext";
import { CURRENCIES, CurrencyCode, useCurrency } from "../context/CurrencyContext";
import { useOnboarding } from "../context/OnboardingContext";
import { Button } from "./ui/button";
import { Eyebrow } from "./layout/Eyebrow";
import { Container } from "./layout/Container";
import { cn, pad } from "@/lib/utils";

interface MegaMenuItem {
  href: string;
  label: string;
  hint: string;
  badge?: string;
}

const fleetCategories: MegaMenuItem[] = [
  {
    href: "/cars",
    label: "All 32+ vehicles",
    hint: "Complete live catalogue across all classes",
    badge: "32 units",
  },
  {
    href: "/cars?category=Executive+Sedan",
    label: "Executive sedans",
    hint: "Mercedes C300, BMW 330i, Lexus ES 350 & Genesis G80",
  },
  {
    href: "/cars?category=Luxury+SUV",
    label: "Luxury & flagship SUVs",
    hint: "Land Cruiser 300, GLE 450, Range Rover Velar & Cayenne",
  },
  {
    href: "/cars?category=Crossover",
    label: "City crossovers",
    hint: "RAV4 Adventure, CR-V, Tucson, Sportage & Mazda CX-5",
  },
  {
    href: "/cars?category=Electric",
    label: "Electric vehicles (EV)",
    hint: "Tesla Model 3 Long Range & Model Y Performance",
  },
  {
    href: "/cars?category=Pickup+%26+Shuttle",
    label: "4x4 pickups & shuttles",
    hint: "Toyota Hilux Adventure, Ranger Wildtrak & Mercedes V250d",
  },
];

const fleetHubs: MegaMenuItem[] = [
  {
    href: "/cars?hub=Lagos",
    label: "Lagos · LOS",
    hint: "Victoria Island, Ikoyi, Lekki Phase 1, Ikeja GRA & MMIA",
    badge: "Primary",
  },
  {
    href: "/cars?hub=Abuja",
    label: "Abuja · ABV",
    hint: "Maitama, Asokoro, Wuse II & Nnamdi Azikiwe Int'l",
  },
  {
    href: "/cars?hub=Port+Harcourt",
    label: "Port Harcourt · PHC",
    hint: "Old/New GRA, Trans-Amadi & PHC Airport desk",
  },
  {
    href: "/cars?hub=Kano",
    label: "Kano · KAN",
    hint: "Nassarawa GRA & Mallam Aminu Kano Int'l",
  },
  {
    href: "/cars?hub=Ibadan",
    label: "Ibadan & Enugu",
    hint: "Bodija, Agodi GRA & Independence Layout corridors",
  },
];

const serviceModes: MegaMenuItem[] = [
  {
    href: "/cars?service=Chauffeur+%26+Protocol",
    label: "Chauffeur & protocol",
    hint: "Uniformed executive drivers (+₦25k/day) & VIP arrival",
    badge: "Popular",
  },
  {
    href: "/cars?service=Verified+Self-Drive",
    label: "Verified self-drive",
    hint: "Unlocked after chauffeur trial & 80%+ driving evaluation",
  },
  {
    href: "/cars?service=Airport+VIP+Transfer",
    label: "Airport VIP meet & greet",
    hint: "Flight-tracked terminal pickup at LOS, ABV & PHC (+₦15k)",
  },
  {
    href: "/services#calculator",
    label: "Corporate monthly fleet",
    hint: "SuperFlex 30+ day corporate subscriptions (−22% rate)",
    badge: "−22%",
  },
  {
    href: "/cars?service=Interstate+%26+4x4",
    label: "Interstate & 4x4 escort",
    hint: "Federal highway Hilux/SUV units & optional MOPOL escort",
  },
];

const serviceResources: MegaMenuItem[] = [
  {
    href: "/services",
    label: "All 6 mobility pillars",
    hint: "Complete overview of daily, weekly & B2B service tiers",
  },
  {
    href: "/services#calculator",
    label: "SuperFlex rate calculator",
    hint: "Estimate multi-vehicle corporate monthly savings live",
  },
  {
    href: "/services#benchmark",
    label: "Izzac Mobility vs. global standards",
    hint: "Side-by-side Europcar & local market comparison",
  },
  {
    href: "/user/dashboard#evaluation",
    label: "Self-drive qualification",
    hint: "3-stage clearance certificate & NIID motor insurance tiers",
  },
];

const hostPlatformLinks: MegaMenuItem[] = [
  {
    href: "/host",
    label: "Host overview & yield",
    hint: "How vehicle monetization, guest vetting & payouts work",
    badge: "Up to 85%",
  },
  {
    href: "/cars/list-car",
    label: "List your vehicle",
    hint: "Onboard a sedan, SUV, EV or 4x4 pickup in 3 minutes",
  },
  {
    href: "/host#protection",
    label: "Host protection plans",
    hint: "Compare Basic (85%), Standard (80%) & Max Shield (75%)",
  },
  {
    href: "/host#faq",
    label: "Host FAQ & inspection",
    hint: "2013+ model standards, telemetry & payout timelines",
  },
];

const hostWorkspaceLinks: MegaMenuItem[] = [
  {
    href: "/dashboard/host",
    label: "Host garage",
    hint: "Manage vehicle availability, daily rates & fleet yield",
  },
  {
    href: "/dashboard/add-car",
    label: "Add new vehicle",
    hint: "Publish directly from your authenticated host console",
  },
  {
    href: "/dashboard/bookings",
    label: "Reservation ledger",
    hint: "Track guest handovers, dates & insurance certificates",
  },
];

const accountNav: MegaMenuItem[] = [
  { href: "/dashboard", label: "Overview", hint: "Rider + host at a glance" },
  { href: "/dashboard/rider", label: "Rider & driving test", hint: "Trial, exam, clearance" },
  { href: "/dashboard/host", label: "Host garage", hint: "Fleet & payouts" },
  { href: "/dashboard/bookings", label: "Bookings", hint: "Trips & insurance" },
  { href: "/user/dashboard", label: "Profile", hint: "KYC & certificates" },
];

const Wordmark = () => (
  <Link
    href="/"
    className="group flex items-center gap-2.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    aria-label="Izzac Mobility home"
  >
    <Image src="/logo-mark.svg" alt="" width={28} height={28} priority className="h-7 w-7 rounded-sm" />
    <span className="text-[17px] font-semibold tracking-[-0.03em] text-foreground">Izzac Mobility</span>
  </Link>
);

const CurrencySwitch = ({ className }: { className?: string }) => {
  const { currency, setCurrency } = useCurrency();
  return (
    <Popover className={cn("relative", className)}>
      <PopoverButton
        aria-label={`Display currency: ${currency}`}
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface-elevated px-2.5 font-mono text-xs font-medium text-foreground shadow-subtle transition-colors duration-150 hover:border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[open]:border-input"
      >
        <span>{CURRENCIES[currency].symbol.trim()}</span>
        <span className="text-muted-foreground">{currency}</span>
      </PopoverButton>
      <PopoverPanel
        transition
        anchor="bottom end"
        className="z-50 mt-2 w-44 origin-top-right rounded-md border border-border bg-surface-elevated p-1 shadow-elevated transition duration-150 ease-out-quart data-[closed]:translate-y-1 data-[closed]:scale-[0.985] data-[closed]:opacity-0 [--anchor-gap:8px]"
      >
        {({ close }) => (
          <ul role="listbox" aria-label="Display currency">
            {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
              <li key={code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={currency === code}
                  onClick={() => {
                    setCurrency(code);
                    close();
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-sm px-2.5 py-2 text-left font-mono text-xs transition-colors duration-150",
                    currency === code ? "bg-primary-soft text-primary" : "text-foreground hover:bg-secondary"
                  )}
                >
                  <span>
                    {CURRENCIES[code].flag} {code}
                  </span>
                  <span className="text-muted-foreground">{CURRENCIES[code].symbol.trim()}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </PopoverPanel>
    </Popover>
  );
};

const MegaMenuLinkList = ({
  items,
  onNavigate,
  indexed = false,
}: {
  items: MegaMenuItem[];
  onNavigate: () => void;
  indexed?: boolean;
}) => (
  <ul role="list" className="divide-y divide-border/60 border-y border-border/60">
    {items.map((item, idx) => (
      <li key={`${item.href}-${item.label}`}>
        <Link
          href={item.href}
          onClick={onNavigate}
          className="group flex items-baseline justify-between gap-3 py-2.5 transition-colors duration-150 hover:bg-surface/70 rounded-sm px-2 -mx-2"
        >
          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2">
              {indexed && (
                <span className="font-mono text-2xs text-primary tabular-nums">{pad(idx + 1)}</span>
              )}
              <span className="text-sm font-medium text-foreground transition-colors duration-150 group-hover:text-primary">
                {item.label}
              </span>
              {item.badge && (
                <span className="rounded-full bg-primary-soft px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary tabular-nums">
                  {item.badge}
                </span>
              )}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">{item.hint}</p>
          </div>
          <span
            aria-hidden="true"
            className="font-mono text-xs text-muted-foreground transition-transform duration-150 ease-out-quart group-hover:translate-x-0.5 group-hover:text-primary"
          >
            →
          </span>
        </Link>
      </li>
    ))}
  </ul>
);

const triggerStyles = (active?: boolean) =>
  cn(
    "group relative inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "data-[open]:bg-secondary/80 data-[open]:text-foreground",
    active ? "text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
  );

const Header = () => {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const { formatPrice } = useCurrency();
  const { openOnboarding, startProductTour } = useOnboarding();
  const [open, setOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<"fleet" | "services" | "host" | "account" | null>("fleet");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href ||
    (href !== "/" && pathname?.startsWith(href + "/")) ||
    (href !== "/" && pathname?.startsWith(href) && href !== "/dashboard");
  const inFleet = isActive("/cars") && !pathname?.startsWith("/cars/list-car");
  const inServices = isActive("/services");
  const inHost = isActive("/host") || pathname === "/cars/list-car";
  const inAccount = pathname?.startsWith("/dashboard") || pathname?.startsWith("/user");

  const toggleMobileSection = (key: "fleet" | "services" | "host" | "account") => {
    setMobileSection((prev) => (prev === key ? null : key));
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 transition-[border-color,box-shadow] duration-200",
        scrolled ? "border-border/80 shadow-subtle" : "border-transparent"
      )}
    >
      <Container className="flex h-[var(--header-height)] items-center justify-between gap-6">
        <div className="flex items-center gap-8 lg:gap-10">
          <Wordmark />

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            <PopoverGroup className="flex items-center gap-1">
              {/* 1. Fleet & Hubs Mega Menu */}
              <Popover>
                <PopoverButton className={triggerStyles(inFleet)}>
                  <span>Fleet</span>
                  <span
                    aria-hidden="true"
                    className="font-mono text-[10px] text-muted-foreground transition-transform duration-150 group-data-[open]:rotate-180 group-data-[open]:text-foreground"
                  >
                    ▾
                  </span>
                  {inFleet && <span aria-hidden="true" className="absolute inset-x-3 -bottom-[1px] h-px bg-foreground" />}
                </PopoverButton>
                <PopoverBackdrop
                  transition
                  className="fixed inset-x-0 bottom-0 top-[var(--header-height)] z-40 bg-ink/20 backdrop-blur-[2px] transition duration-150 data-[closed]:opacity-0"
                />
                <PopoverPanel
                  transition
                  className="fixed inset-x-0 top-[var(--header-height)] z-50 border-b border-border bg-surface-elevated shadow-floating transition duration-200 ease-out-quart data-[closed]:-translate-y-1.5 data-[closed]:opacity-0"
                >
                  {({ close }) => (
                    <Container className="py-8">
                      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
                        <div className="space-y-3 lg:col-span-4">
                          <div className="flex items-center justify-between">
                            <Eyebrow index="01">Vehicle classes</Eyebrow>
                            <Link
                              href="/cars"
                              onClick={() => close()}
                              className="font-mono text-2xs text-primary hover:underline"
                            >
                              View all 32+ →
                            </Link>
                          </div>
                          <MegaMenuLinkList items={fleetCategories} onNavigate={() => close()} />
                        </div>

                        <div className="space-y-3 lg:col-span-4">
                          <div className="flex items-center justify-between">
                            <Eyebrow index="02">Nigerian city hubs</Eyebrow>
                            <span className="font-mono text-2xs text-muted-foreground tabular-nums">6 active hubs</span>
                          </div>
                          <MegaMenuLinkList items={fleetHubs} onNavigate={() => close()} />
                        </div>

                        <div className="lg:col-span-4">
                          <div className="flex h-full flex-col justify-between overflow-hidden rounded-xl bg-ink p-5 text-ink-foreground">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between gap-2">
                                <Eyebrow tone="signal">Flagship reserve</Eyebrow>
                                <span className="font-mono text-2xs text-ink-muted tabular-nums">NIID insured</span>
                              </div>
                              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-white/5">
                                <Image
                                  src="/images/cars/toyota-land-cruiser-300-2024.jpg"
                                  alt="2024 Toyota Land Cruiser 300 GR Sport"
                                  fill
                                  sizes="360px"
                                  fetchPriority="low"
                                  loading="lazy"
                                  className="object-cover"
                                />
                              </div>
                              <div className="space-y-1">
                                <p className="text-base font-semibold tracking-[-0.02em] text-white">
                                  2024 Toyota Land Cruiser 300 GR Sport
                                </p>
                                <p className="text-xs leading-relaxed text-ink-muted">
                                  Twin-turbo V6 flagship SUV for diplomatic corridors, airport VIP transfers and interstate convoys.
                                </p>
                              </div>
                            </div>

                            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                              <div>
                                <p className="type-eyebrow text-signal">From</p>
                                <p className="font-mono text-base font-semibold text-white tabular-nums">
                                  {formatPrice(320000)}
                                  <span className="ml-1 font-sans text-xs font-normal text-ink-muted">/day</span>
                                </p>
                              </div>
                              <Button asChild size="sm">
                                <Link href="/cars/14" onClick={() => close()}>
                                  Inspect flagship →
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Container>
                  )}
                </PopoverPanel>
              </Popover>

              {/* 2. Services & B2B Mega Menu */}
              <Popover>
                <PopoverButton className={triggerStyles(inServices)}>
                  <span>Services</span>
                  <span
                    aria-hidden="true"
                    className="font-mono text-[10px] text-muted-foreground transition-transform duration-150 group-data-[open]:rotate-180 group-data-[open]:text-foreground"
                  >
                    ▾
                  </span>
                  {inServices && (
                    <span aria-hidden="true" className="absolute inset-x-3 -bottom-[1px] h-px bg-foreground" />
                  )}
                </PopoverButton>
                <PopoverBackdrop
                  transition
                  className="fixed inset-x-0 bottom-0 top-[var(--header-height)] z-40 bg-ink/20 backdrop-blur-[2px] transition duration-150 data-[closed]:opacity-0"
                />
                <PopoverPanel
                  transition
                  className="fixed inset-x-0 top-[var(--header-height)] z-50 border-b border-border bg-surface-elevated shadow-floating transition duration-200 ease-out-quart data-[closed]:-translate-y-1.5 data-[closed]:opacity-0"
                >
                  {({ close }) => (
                    <Container className="py-8">
                      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
                        <div className="space-y-3 lg:col-span-5">
                          <div className="flex items-center justify-between">
                            <Eyebrow index="01">Mobility service modes</Eyebrow>
                            <Link
                              href="/services"
                              onClick={() => close()}
                              className="font-mono text-2xs text-primary hover:underline"
                            >
                              All 6 pillars →
                            </Link>
                          </div>
                          <MegaMenuLinkList items={serviceModes} onNavigate={() => close()} indexed />
                        </div>

                        <div className="space-y-3 lg:col-span-4">
                          <div className="flex items-center justify-between">
                            <Eyebrow index="02">B2B, insurance & benchmarks</Eyebrow>
                          </div>
                          <MegaMenuLinkList items={serviceResources} onNavigate={() => close()} />
                        </div>

                        <div className="lg:col-span-3">
                          <div className="flex h-full flex-col justify-between rounded-xl bg-ink p-5 text-ink-foreground">
                            <div className="space-y-4">
                              <Eyebrow tone="signal">Corporate SuperFlex</Eyebrow>
                              <div className="grid grid-cols-2 gap-3 border-y border-white/10 py-3.5">
                                <div>
                                  <p className="font-mono text-2xl font-semibold text-signal tabular-nums">−22%</p>
                                  <p className="font-mono text-2xs text-ink-muted">30+ day monthly</p>
                                </div>
                                <div>
                                  <p className="font-mono text-2xl font-semibold text-white tabular-nums">−10%</p>
                                  <p className="font-mono text-2xs text-ink-muted">7+ day weekly</p>
                                </div>
                              </div>
                              <p className="text-xs leading-relaxed text-ink-muted">
                                Consolidated NGN/USD corporate invoicing, dedicated replacement vehicles, and uniformed drivers across Lagos, Abuja and Port Harcourt.
                              </p>
                            </div>

                            <div className="mt-5 flex flex-col gap-2 pt-3">
                              <Button asChild size="sm" className="w-full">
                                <Link href="/services#calculator" onClick={() => close()}>
                                  Open SuperFlex calculator →
                                </Link>
                              </Button>
                              <Button asChild variant="inverse" size="sm" className="w-full">
                                <Link href="/services#benchmark" onClick={() => close()}>
                                  Compare with Europcar
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Container>
                  )}
                </PopoverPanel>
              </Popover>

              {/* 3. Host & Monetize Mega Menu */}
              <Popover>
                <PopoverButton className={triggerStyles(inHost)}>
                  <span>Host</span>
                  <span
                    aria-hidden="true"
                    className="font-mono text-[10px] text-muted-foreground transition-transform duration-150 group-data-[open]:rotate-180 group-data-[open]:text-foreground"
                  >
                    ▾
                  </span>
                  {inHost && <span aria-hidden="true" className="absolute inset-x-3 -bottom-[1px] h-px bg-foreground" />}
                </PopoverButton>
                <PopoverBackdrop
                  transition
                  className="fixed inset-x-0 bottom-0 top-[var(--header-height)] z-40 bg-ink/20 backdrop-blur-[2px] transition duration-150 data-[closed]:opacity-0"
                />
                <PopoverPanel
                  transition
                  className="fixed inset-x-0 top-[var(--header-height)] z-50 border-b border-border bg-surface-elevated shadow-floating transition duration-200 ease-out-quart data-[closed]:-translate-y-1.5 data-[closed]:opacity-0"
                >
                  {({ close }) => (
                    <Container className="py-8">
                      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
                        <div className="space-y-3 lg:col-span-5">
                          <div className="flex items-center justify-between">
                            <Eyebrow index="01">Host platform & protection</Eyebrow>
                            <Link
                              href="/host"
                              onClick={() => close()}
                              className="font-mono text-2xs text-primary hover:underline"
                            >
                              Host overview →
                            </Link>
                          </div>
                          <MegaMenuLinkList items={hostPlatformLinks} onNavigate={() => close()} />
                        </div>

                        <div className="space-y-3 lg:col-span-4">
                          <div className="flex items-center justify-between">
                            <Eyebrow index="02">Host console & payouts</Eyebrow>
                          </div>
                          <MegaMenuLinkList items={hostWorkspaceLinks} onNavigate={() => close()} />
                        </div>

                        <div className="lg:col-span-3">
                          <div className="flex h-full flex-col justify-between overflow-hidden rounded-xl bg-ink p-5 text-ink-foreground">
                            <div className="space-y-3.5">
                              <Eyebrow tone="signal">Host yield · Up to 85%</Eyebrow>
                              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-white/5">
                                <Image
                                  src="/images/feature3.webp"
                                  alt="Host fleet partner handover"
                                  fill
                                  sizes="320px"
                                  fetchPriority="low"
                                  loading="lazy"
                                  className="object-cover"
                                />
                              </div>
                              <p className="text-sm font-semibold tracking-[-0.015em] text-white">
                                Turn idle sedans & SUVs into recurring NGN revenue.
                              </p>
                              <p className="text-xs leading-relaxed text-ink-muted">
                                Every booking is backed by NIID motor insurance, FRSC/NIN rider verification and automated payouts.
                              </p>
                            </div>
                            <div className="mt-4 pt-3">
                              <Button asChild size="sm" className="w-full">
                                <Link href="/cars/list-car" onClick={() => close()}>
                                  List your vehicle →
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Container>
                  )}
                </PopoverPanel>
              </Popover>

              {/* 4. Authenticated Workspace Mega Menu */}
              {isAuthenticated && (
                <Popover>
                  <PopoverButton className={triggerStyles(inAccount)}>
                    <span>Workspace</span>
                    <span
                      aria-hidden="true"
                      className="font-mono text-[10px] text-muted-foreground transition-transform duration-150 group-data-[open]:rotate-180 group-data-[open]:text-foreground"
                    >
                      ▾
                    </span>
                    {inAccount && (
                      <span aria-hidden="true" className="absolute inset-x-3 -bottom-[1px] h-px bg-foreground" />
                    )}
                  </PopoverButton>
                  <PopoverBackdrop
                    transition
                    className="fixed inset-x-0 bottom-0 top-[var(--header-height)] z-40 bg-ink/20 backdrop-blur-[2px] transition duration-150 data-[closed]:opacity-0"
                  />
                  <PopoverPanel
                    transition
                    className="fixed inset-x-0 top-[var(--header-height)] z-50 border-b border-border bg-surface-elevated shadow-floating transition duration-200 ease-out-quart data-[closed]:-translate-y-1.5 data-[closed]:opacity-0"
                  >
                    {({ close }) => (
                      <Container className="py-8">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
                          <div className="space-y-3 lg:col-span-7">
                            <div className="flex items-center justify-between">
                              <Eyebrow index="01">Rider & host workspace</Eyebrow>
                              <Link
                                href="/dashboard"
                                onClick={() => close()}
                                className="font-mono text-2xs text-primary hover:underline"
                              >
                                Open dashboard →
                              </Link>
                            </div>
                            <MegaMenuLinkList items={accountNav} onNavigate={() => close()} indexed />
                          </div>

                          <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-5 lg:col-span-5">
                            <div className="space-y-2.5">
                              <Eyebrow tone="primary">Member tools · {user?.username}</Eyebrow>
                              <p className="text-base font-semibold tracking-[-0.02em] text-foreground">
                                Guided onboarding & interactive tour
                              </p>
                              <p className="text-xs leading-relaxed text-muted-foreground">
                                Review the 4-step platform orientation or launch the 5-stop guided product tour across the fleet and B2B tools.
                              </p>
                            </div>
                            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/70 pt-4">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  close();
                                  openOnboarding();
                                }}
                              >
                                Onboarding guide
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={() => {
                                  close();
                                  startProductTour();
                                }}
                              >
                                Launch product tour
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Container>
                    )}
                  </PopoverPanel>
                </Popover>
              )}
            </PopoverGroup>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <CurrencySwitch className="hidden sm:block" />
          <Button asChild variant="ghost" size="sm" className="hidden lg:inline-flex">
            <Link href="/cars/list-car">List your car</Link>
          </Button>

          {isAuthenticated ? (
            <div className="hidden items-center gap-1.5 md:flex">
              <Link
                href="/user/dashboard"
                className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-surface-elevated px-3 font-mono text-xs text-foreground shadow-subtle transition-colors duration-150 hover:border-input"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {user?.username}
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Log out
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-1.5 md:flex">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Create account</Link>
              </Button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-elevated text-foreground shadow-subtle md:hidden"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="M3 6h14M3 10h14M3 14h14" />
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile sheet with expandable mega-menu sections */}
      <Dialog open={open} onClose={setOpen} className="relative z-50 md:hidden">
        <DialogBackdrop transition className="fixed inset-0 bg-ink/50 backdrop-blur-sm transition duration-200 data-[closed]:opacity-0" />
        <div className="fixed inset-0 flex justify-end">
          <DialogPanel
            transition
            className="flex h-full w-full max-w-sm flex-col bg-background shadow-modal transition duration-250 ease-out-quart data-[closed]:translate-x-6 data-[closed]:opacity-0"
          >
            <div className="flex h-[var(--header-height)] items-center justify-between border-b border-border/70 px-5">
              <Wordmark />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <nav aria-label="Mobile primary" className="divide-y divide-border/70 border-y border-border/70">
                {/* Mobile Fleet section */}
                <div className="py-2">
                  <button
                    type="button"
                    onClick={() => toggleMobileSection("fleet")}
                    aria-expanded={mobileSection === "fleet"}
                    className="flex w-full items-center justify-between py-2.5 text-left text-lg font-semibold tracking-[-0.02em] text-foreground"
                  >
                    <span>Fleet & hubs</span>
                    <span aria-hidden="true" className="font-mono text-xs text-muted-foreground">
                      {mobileSection === "fleet" ? "−" : "+"}
                    </span>
                  </button>
                  {mobileSection === "fleet" && (
                    <div className="space-y-3 pb-3 pt-1">
                      <p className="type-eyebrow text-primary">Vehicle classes</p>
                      <ul role="list" className="space-y-1.5">
                        {fleetCategories.map((item) => (
                          <li key={item.href}>
                            <Link href={item.href} className="block rounded-md px-2.5 py-1.5 hover:bg-surface">
                              <p className="text-sm font-medium text-foreground">{item.label}</p>
                              <p className="text-xs text-muted-foreground">{item.hint}</p>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <p className="type-eyebrow pt-2 text-primary">City hubs</p>
                      <ul role="list" className="grid grid-cols-2 gap-1.5">
                        {fleetHubs.map((hub) => (
                          <li key={hub.href}>
                            <Link
                              href={hub.href}
                              className="block rounded-md border border-border/70 bg-surface px-2.5 py-2 font-mono text-xs font-medium text-foreground"
                            >
                              {hub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Mobile Services section */}
                <div className="py-2">
                  <button
                    type="button"
                    onClick={() => toggleMobileSection("services")}
                    aria-expanded={mobileSection === "services"}
                    className="flex w-full items-center justify-between py-2.5 text-left text-lg font-semibold tracking-[-0.02em] text-foreground"
                  >
                    <span>Services & B2B</span>
                    <span aria-hidden="true" className="font-mono text-xs text-muted-foreground">
                      {mobileSection === "services" ? "−" : "+"}
                    </span>
                  </button>
                  {mobileSection === "services" && (
                    <div className="space-y-2 pb-3 pt-1">
                      <ul role="list" className="space-y-1.5">
                        {[...serviceModes, ...serviceResources].map((item) => (
                          <li key={`${item.href}-${item.label}`}>
                            <Link href={item.href} className="block rounded-md px-2.5 py-1.5 hover:bg-surface">
                              <p className="text-sm font-medium text-foreground">{item.label}</p>
                              <p className="text-xs text-muted-foreground">{item.hint}</p>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Mobile Host section */}
                <div className="py-2">
                  <button
                    type="button"
                    onClick={() => toggleMobileSection("host")}
                    aria-expanded={mobileSection === "host"}
                    className="flex w-full items-center justify-between py-2.5 text-left text-lg font-semibold tracking-[-0.02em] text-foreground"
                  >
                    <span>Host & monetize</span>
                    <span aria-hidden="true" className="font-mono text-xs text-muted-foreground">
                      {mobileSection === "host" ? "−" : "+"}
                    </span>
                  </button>
                  {mobileSection === "host" && (
                    <div className="space-y-2 pb-3 pt-1">
                      <ul role="list" className="space-y-1.5">
                        {[...hostPlatformLinks, ...hostWorkspaceLinks].map((item) => (
                          <li key={`${item.href}-${item.label}`}>
                            <Link href={item.href} className="block rounded-md px-2.5 py-1.5 hover:bg-surface">
                              <p className="text-sm font-medium text-foreground">{item.label}</p>
                              <p className="text-xs text-muted-foreground">{item.hint}</p>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Mobile Authenticated Workspace section */}
                {isAuthenticated && (
                  <div className="py-2">
                    <button
                      type="button"
                      onClick={() => toggleMobileSection("account")}
                      aria-expanded={mobileSection === "account"}
                      className="flex w-full items-center justify-between py-2.5 text-left text-lg font-semibold tracking-[-0.02em] text-foreground"
                    >
                      <span>Workspace</span>
                      <span aria-hidden="true" className="font-mono text-xs text-muted-foreground">
                        {mobileSection === "account" ? "−" : "+"}
                      </span>
                    </button>
                    {mobileSection === "account" && (
                      <div className="space-y-2 pb-3 pt-1">
                        <ul role="list" className="space-y-1.5">
                          {accountNav.map((item) => (
                            <li key={item.href}>
                              <Link href={item.href} className="flex items-baseline justify-between gap-3 rounded-md px-2.5 py-2 hover:bg-surface">
                                <span className="text-sm font-medium text-foreground">{item.label}</span>
                                <span className="font-mono text-2xs text-muted-foreground">{item.hint}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setOpen(false);
                              openOnboarding();
                            }}
                          >
                            Onboarding
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setOpen(false);
                              startProductTour();
                            }}
                          >
                            Product tour
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </nav>

              <div className="mt-6 space-y-2.5">
                <p className="type-eyebrow text-muted-foreground">Display currency</p>
                <MobileCurrency />
              </div>
            </div>

            <div className="border-t border-border/70 p-5">
              {isAuthenticated ? (
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-muted-foreground">Signed in as {user?.username}</span>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  <Button asChild variant="outline">
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Create account</Link>
                  </Button>
                </div>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </header>
  );
};

const MobileCurrency = () => {
  const { currency, setCurrency } = useCurrency();
  return (
    <div className="grid grid-cols-4 gap-1 rounded-md border border-border bg-surface p-1">
      {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setCurrency(code)}
          aria-pressed={currency === code}
          className={cn(
            "rounded-sm py-1.5 font-mono text-xs font-medium transition-colors duration-150",
            currency === code ? "bg-surface-elevated text-foreground shadow-surface" : "text-muted-foreground"
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
};

export default Header;
