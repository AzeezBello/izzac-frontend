"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/cars", label: "Browse cars" },
  { href: "/host", label: "Host" },
  { href: "/dashboard", label: "My garage" },
  { href: "/dashboard/bookings", label: "Bookings" },
];

const Header = () => {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 md:px-6 gap-4">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
          >
            <div className="relative h-8 w-8 overflow-hidden rounded-lg border border-border/80 shadow-surface">
              <Image
                src="/images/feature1.webp"
                alt="Izzac"
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-lg font-bold tracking-[-0.03em] text-foreground">
              Izzac
            </span>
            <span className="hidden lg:inline-flex items-center rounded border border-border/80 bg-secondary/70 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              P2P Mobility
            </span>
          </Link>

          {/* Emil Kowalski restraint rule: high-frequency nav links avoid sluggish transitions */}
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

        <div className="flex items-center gap-2.5">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex"
          >
            <Link href="/dashboard/add-car">List your car</Link>
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-secondary/50 px-2.5 py-1 font-mono text-xs text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Hi, {user?.username}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Log out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
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
        <Link
          href="/dashboard/add-car"
          className="ml-auto whitespace-nowrap rounded-md bg-primary/10 px-2.5 py-1 font-semibold text-primary"
        >
          + List car
        </Link>
      </div>
    </header>
  );
};

export default Header;
