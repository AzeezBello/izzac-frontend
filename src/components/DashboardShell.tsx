"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Breadcrumbs, { type BreadcrumbItem } from "./Breadcrumbs";
import { Container } from "./layout/Container";
import { Eyebrow } from "./layout/Eyebrow";
import { cn } from "@/lib/utils";

export const DASHBOARD_LINKS = [
  { href: "/dashboard", label: "Overview", hint: "Rider + host", exact: true },
  { href: "/dashboard/rider", label: "Rider & driving test", hint: "Trial · exam · clearance", exact: false },
  { href: "/dashboard/host", label: "Host garage", hint: "Fleet · payouts", exact: false },
  { href: "/dashboard/bookings", label: "Bookings", hint: "Trips · insurance", exact: false },
  { href: "/dashboard/add-car", label: "Publish a vehicle", hint: "New listing", exact: false },
  { href: "/user/dashboard", label: "Profile", hint: "KYC · certificates", exact: false },
];

export interface DashboardShellProps {
  breadcrumbs?: BreadcrumbItem[];
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  /** Pass `false` to render children full-width without the page header. */
  header?: boolean;
}

const StatusRow = ({ label, value, state }: { label: string; value: string; state: "done" | "current" | "locked" }) => (
  <li className="flex items-center justify-between gap-3 py-2.5">
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          state === "done" ? "bg-primary" : state === "current" ? "bg-amber-500" : "bg-border"
        )}
      />
      <span className="text-[13px] text-foreground/85">{label}</span>
    </span>
    <span
      className={cn(
        "font-mono text-2xs tabular-nums",
        state === "done" ? "text-primary" : state === "current" ? "text-amber-700" : "text-muted-foreground"
      )}
    >
      {value}
    </span>
  </li>
);

/** Operate-mode app shell: sticky sidebar with identity + qualification, main column with page header. */
export function DashboardShell({ breadcrumbs, eyebrow, title, description, actions, children, header = true }: DashboardShellProps) {
  const pathname = usePathname();
  const { user, qualification } = useAuth();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname?.startsWith(`${href}/`);

  const trialState = qualification.chauffeur_trial_completed ? "done" : "current";
  const testState =
    qualification.driving_test_status === "passed" ? "done" : qualification.chauffeur_trial_completed ? "current" : "locked";
  const selfDriveState = qualification.self_drive_eligible ? "done" : "locked";

  const Sidebar = (
    <aside className="space-y-6">
      <div className="rounded-lg border border-border/80 bg-surface-elevated p-4 shadow-subtle">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ink font-mono text-sm font-semibold uppercase text-ink-foreground">
            {(user?.username || "G").slice(0, 1)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{user?.username || "Guest session"}</p>
            <p className="truncate font-mono text-2xs text-muted-foreground">{user?.email || "Not signed in"}</p>
          </div>
        </div>
        <ul className="mt-4 divide-y divide-border/70 border-t border-border/70">
          <StatusRow label="Chauffeur trial" value={qualification.chauffeur_trial_completed ? "Done" : "Required"} state={trialState} />
          <StatusRow
            label="Driving test"
            value={
              qualification.driving_test_status === "passed"
                ? `${qualification.driving_test_score}%`
                : qualification.driving_test_status === "failed"
                ? `Retry · ${qualification.driving_test_score}%`
                : "Pending"
            }
            state={testState}
          />
          <StatusRow label="Self-drive" value={qualification.self_drive_eligible ? "Unlocked" : "Locked"} state={selfDriveState} />
        </ul>
      </div>

      <nav aria-label="Dashboard sections" className="space-y-0.5">
        {DASHBOARD_LINKS.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center justify-between gap-3 rounded-md px-3 py-2.5 transition-colors duration-150",
                active ? "bg-ink text-ink-foreground" : "text-foreground/80 hover:bg-surface hover:text-foreground"
              )}
            >
              <span className="text-sm font-medium">{item.label}</span>
              <span className={cn("font-mono text-2xs", active ? "text-ink-muted" : "text-muted-foreground")}>{item.hint}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );

  return (
    <Container className="py-8 md:py-10">
      {/* Mobile section switcher */}
      <nav aria-label="Dashboard sections" className="-mx-4 mb-6 flex gap-1.5 overflow-x-auto px-4 pb-1 scrollbar-none lg:hidden">
        {DASHBOARD_LINKS.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors duration-150",
                active ? "border-ink bg-ink text-ink-foreground" : "border-border bg-surface-elevated text-foreground/80"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-[calc(var(--header-height)+1.5rem)]">{Sidebar}</div>
        </div>

        <div className="min-w-0 space-y-8 lg:col-span-9 animate-enter-subtle">
          {header && (
            <header className="space-y-5 border-b border-border/70 pb-6">
              {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-[52rem] space-y-2.5">
                  {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
                  <h1 className="text-h1 text-foreground">{title}</h1>
                  {description && <p className="max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground">{description}</p>}
                </div>
                {actions && <div className="flex flex-wrap items-center gap-2.5 shrink-0">{actions}</div>}
              </div>
            </header>
          )}
          {children}
        </div>
      </div>
    </Container>
  );
}

export default DashboardShell;
