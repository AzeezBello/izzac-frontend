"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { CURRENCIES, CurrencyCode, useCurrency } from "../context/CurrencyContext";
import { useOnboarding } from "../context/OnboardingContext";
import { Button } from "./ui/button";
import { Tooltip } from "./ui/tooltip";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/cars", label: "Browse fleet" },
  { href: "/services", label: "Services & B2B" },
  { href: "/host", label: "Host" },
  { href: "/dashboard", label: "My garage" },
  { href: "/dashboard/rider", label: "Rider & Driving Test" },
  { href: "/dashboard/bookings", label: "Bookings" },
];

const Header = () => {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const { openOnboarding, startProductTour } = useOnboarding();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="w-full max-w-[1760px] mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10 gap-4">
        <div className="flex items-center gap-7">
          <Link
            href="/"
            className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
          >
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg shadow-surface">
              <Image
                src="/logo-mark.svg"
                alt="Izzac Mobility crest logo"
                width={32}
                height={32}
                priority
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-lg font-bold tracking-[-0.03em] text-foreground">
              Izzac
            </span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-1"
          >
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium",
                    isActive
                      ? "bg-secondary text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Guided Product Tour & Onboarding Triggers with Tooltips */}
          <div className="hidden xl:flex items-center gap-1.5">
            <Tooltip content="Open 4-step executive mobility onboarding">
              <button
                type="button"
                onClick={openOnboarding}
                className="h-8 rounded-lg border border-border/85 bg-secondary/60 px-2.5 font-mono text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                Intro
              </button>
            </Tooltip>
            <Tooltip content="Launch interactive 5-stop product tour">
              <button
                type="button"
                onClick={startProductTour}
                className="h-8 rounded-lg border border-primary/30 bg-primary/10 px-2.5 font-mono text-xs font-semibold text-primary hover:bg-primary/15 transition-colors"
              >
                Tour
              </button>
            </Tooltip>
          </div>

          {/* Multi-Currency Switcher */}
          <div className="hidden sm:flex items-center">
            <Tooltip content="Switch display rates between NGN, USD, GHS & KES">
              <div>
                <label htmlFor="header-currency" className="sr-only">
                  Display currency
                </label>
                <select
                  id="header-currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  aria-label="Select currency"
                  className="h-8 rounded-lg border border-border/85 bg-card px-2 font-mono text-xs font-medium text-foreground shadow-surface focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer tabular-nums"
                >
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                    <option key={code} value={code}>
                      {CURRENCIES[code].flag} {CURRENCIES[code].label}
                    </option>
                  ))}
                </select>
              </div>
            </Tooltip>
          </div>

          <Tooltip content="Publish your car and earn recurring host payouts">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden lg:inline-flex"
            >
              <Link href="/dashboard/add-car">List your car</Link>
            </Button>
          </Tooltip>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href="/user/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-secondary/50 px-2.5 py-1 font-mono text-xs text-foreground hover:bg-secondary transition-colors"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Hi, {user?.username}
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Log out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Compact mobile navigation strip */}
      <div className="flex md:hidden items-center gap-1 overflow-x-auto border-t border-border/60 px-4 py-2 text-xs">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-md px-2.5 py-1 font-medium",
                isActive
                  ? "bg-secondary text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          );
        })}
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
          aria-label="Select mobile currency"
          className="ml-auto rounded-md border border-border/80 bg-card px-1.5 py-1 font-mono text-[11px] text-foreground tabular-nums"
        >
          {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
            <option key={code} value={code}>
              {CURRENCIES[code].label}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
};

export default Header;
