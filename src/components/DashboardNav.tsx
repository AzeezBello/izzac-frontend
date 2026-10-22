"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

const DASHBOARD_LINKS = [
  {
    href: "/dashboard",
    label: "Overview Hub",
    exact: true,
    badge: "Command",
  },
  {
    href: "/dashboard/rider",
    label: "Rider & Driving Test",
    exact: false,
    badge: "Trial + Eval",
  },
  {
    href: "/dashboard/host",
    label: "Host Fleet Garage",
    exact: false,
    badge: "Host",
  },
  {
    href: "/dashboard/bookings",
    label: "Bookings & Insurance",
    exact: false,
    badge: "NIID",
  },
  {
    href: "/dashboard/add-car",
    label: "Publish Vehicle",
    exact: false,
    badge: "+ Car",
  },
  {
    href: "/user/dashboard",
    label: "Profile & Certificates",
    exact: false,
    badge: "KYC",
  },
];

export const DashboardNav = () => {
  const pathname = usePathname();
  const { user, qualification } = useAuth();

  return (
    <div className="rounded-2xl border border-border/90 bg-card shadow-surface overflow-hidden">
      {/* Top Identity & Qualification Telemetry Strip */}
      <div className="px-4 sm:px-6 py-3.5 bg-[#0d1713] text-stone-100 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-950">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant="dark">Izzac Mobility Workspace</Badge>
          <span className="font-mono text-xs text-stone-200">
            Account:{" "}
            <strong className="text-emerald-300">
              {user?.username || "Guest Session"}
            </strong>
          </span>
          {user?.email && (
            <span className="hidden md:inline font-mono text-xs text-stone-400">
              · {user.email}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] tabular-nums">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 border",
              qualification.chauffeur_trial_completed
                ? "border-emerald-500/40 bg-emerald-950/70 text-emerald-300"
                : "border-amber-400/40 bg-amber-950/60 text-amber-200"
            )}
          >
            <span>01 Chauffeur Trial:</span>
            <strong>
              {qualification.chauffeur_trial_completed
                ? "Completed ✓"
                : "Required"}
            </strong>
          </span>

          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 border",
              qualification.driving_test_status === "passed"
                ? "border-emerald-500/40 bg-emerald-950/70 text-emerald-300"
                : "border-white/15 bg-white/5 text-stone-300"
            )}
          >
            <span>02 Driving Test:</span>
            <strong>
              {qualification.driving_test_status === "passed"
                ? `Passed (${qualification.driving_test_score}%) ✓`
                : qualification.driving_test_status === "failed"
                ? `Retry (${qualification.driving_test_score}%)`
                : "Pending"}
            </strong>
          </span>

          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 border",
              qualification.self_drive_eligible
                ? "border-emerald-400 bg-emerald-500/20 text-emerald-200 font-semibold"
                : "border-white/15 bg-white/5 text-stone-300"
            )}
          >
            <span>03 Self-Drive:</span>
            <strong>
              {qualification.self_drive_eligible
                ? "Unlocked ✓"
                : "Locked (Chauffeur Mode)"}
            </strong>
          </span>
        </div>
      </div>

      {/* Navigation Tabs across all 6 User Dashboards */}
      <nav
        aria-label="User dashboards navigation"
        className="px-3 sm:px-5 py-2.5 bg-secondary/40 flex items-center gap-1.5 overflow-x-auto"
      >
        {DASHBOARD_LINKS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-surface"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              )}
            >
              <span>{item.label}</span>
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em]",
                  isActive
                    ? "bg-black/20 text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {item.badge}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default DashboardNav;
