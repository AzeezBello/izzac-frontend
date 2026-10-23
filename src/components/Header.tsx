"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Dialog, DialogBackdrop, DialogPanel, Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useAuth } from "../context/AuthContext";
import { CURRENCIES, CurrencyCode, useCurrency } from "../context/CurrencyContext";
import { Button } from "./ui/button";
import { Container } from "./layout/Container";
import { cn } from "@/lib/utils";

const primaryNav = [
  { href: "/cars", label: "Fleet" },
  { href: "/services", label: "Services" },
  { href: "/host", label: "Host" },
];

const accountNav = [
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
    <span className="text-[17px] font-semibold tracking-[-0.03em] text-foreground">Izzac</span>
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

const Header = () => {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
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

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname?.startsWith(href + "/")) || (href !== "/" && pathname?.startsWith(href) && href !== "/dashboard");
  const inAccount = pathname?.startsWith("/dashboard") || pathname?.startsWith("/user");

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 transition-[border-color,box-shadow] duration-200",
        scrolled ? "border-border/80 shadow-subtle" : "border-transparent"
      )}
    >
      <Container className="flex h-[var(--header-height)] items-center justify-between gap-6">
        <div className="flex items-center gap-10">
          <Wordmark />
          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "relative rounded-sm px-3 py-1.5 text-sm font-medium transition-colors duration-150",
                  isActive(item.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <span aria-hidden="true" className="absolute inset-x-3 -bottom-[1px] h-px bg-foreground" />
                )}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                href="/dashboard"
                aria-current={inAccount ? "page" : undefined}
                className={cn(
                  "relative rounded-sm px-3 py-1.5 text-sm font-medium transition-colors duration-150",
                  inAccount ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Dashboard
                {inAccount && <span aria-hidden="true" className="absolute inset-x-3 -bottom-[1px] h-px bg-foreground" />}
              </Link>
            )}
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
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M3 6h14M3 10h14M3 14h14" />
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile sheet */}
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
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <nav aria-label="Mobile primary" className="space-y-1">
                {primaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between rounded-md px-3 py-3 text-xl font-medium tracking-[-0.02em]",
                      isActive(item.href) ? "bg-surface text-foreground" : "text-foreground/80"
                    )}
                  >
                    {item.label}
                    <span aria-hidden="true" className="font-mono text-sm text-muted-foreground">→</span>
                  </Link>
                ))}
                <Link href="/cars/list-car" className="flex items-center justify-between rounded-md px-3 py-3 text-xl font-medium tracking-[-0.02em] text-foreground/80">
                  List your car
                  <span aria-hidden="true" className="font-mono text-sm text-muted-foreground">→</span>
                </Link>
              </nav>

              {isAuthenticated && (
                <div className="mt-8 space-y-1">
                  <p className="type-eyebrow px-3 text-muted-foreground">Your account</p>
                  {accountNav.map((item) => (
                    <Link key={item.href} href={item.href} className="flex items-baseline justify-between gap-3 rounded-md px-3 py-2.5 hover:bg-surface">
                      <span className="text-[15px] font-medium text-foreground">{item.label}</span>
                      <span className="font-mono text-2xs text-muted-foreground">{item.hint}</span>
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-8 space-y-2.5 px-3">
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
