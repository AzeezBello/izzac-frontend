"use client";

import Link from "next/link";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { useRequireAuth } from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";
import { riderJourney } from "../../../lib/productContent";
import { Badge } from "../../../components/ui/badge";
import { Card } from "../../../components/ui/card";

const RiderDashboard = () => {
  const { isLoading } = useRequireAuth(
    "/login?next=/dashboard/rider"
  );

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-16 space-y-8 animate-enter-subtle">
      <Breadcrumbs
        items={[
          { label: "My Garage", href: "/dashboard" },
          { label: "Rider Workspace" },
        ]}
      />
      <div className="space-y-2 pb-6 border-b border-border/80">
        <Badge variant="emerald">Rider</Badge>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em]">
          Rider mobility workspace
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-[58ch]">
          Review your bookings, browse more cars, and move through the full rider flow from one place.
        </p>
      </div>
      {isLoading && <Loader />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link
          href="/dashboard/bookings"
          className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Card className="p-6 h-full hover:-translate-y-0.5 hover:shadow-elevated hover:border-stone-300">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground tracking-[-0.02em] group-hover:text-primary transition-colors duration-150">
                Your bookings
              </h2>
              <span
                aria-hidden="true"
                className="font-mono text-sm text-muted-foreground transition-transform duration-150 ease-out-quart group-hover:translate-x-0.5 group-hover:text-primary"
              >
                →
              </span>
            </div>
            <p className="text-muted-foreground text-sm mt-2">
              See every trip you have planned.
            </p>
          </Card>
        </Link>

        <Link
          href="/cars"
          className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Card className="p-6 h-full hover:-translate-y-0.5 hover:shadow-elevated hover:border-stone-300">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground tracking-[-0.02em] group-hover:text-primary transition-colors duration-150">
                Browse cars
              </h2>
              <span
                aria-hidden="true"
                className="font-mono text-sm text-muted-foreground transition-transform duration-150 ease-out-quart group-hover:translate-x-0.5 group-hover:text-primary"
              >
                →
              </span>
            </div>
            <p className="text-muted-foreground text-sm mt-2">
              Find a ride that fits your needs.
            </p>
          </Card>
        </Link>
      </div>

      {/* Impeccable: Flattened 4-column rider flow ledger without card-in-card nesting */}
      <div className="rounded-2xl border border-border/90 bg-card shadow-surface overflow-hidden">
        <div className="px-6 py-4 border-b border-border/80 bg-secondary/40 flex items-center justify-between">
          <Badge variant="emerald">Rider flow</Badge>
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            01 — 04
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border/80">
          {riderJourney.map((step, index) => (
            <div key={step.title} className="p-6 space-y-2">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-primary tabular-nums">
                Step {index + 1}
              </p>
              <h3 className="text-base font-semibold text-foreground tracking-[-0.015em]">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link
          href="/cars/list-car"
          className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Card className="p-6 h-full hover:-translate-y-0.5 hover:shadow-elevated hover:border-stone-300">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground tracking-[-0.02em] group-hover:text-primary transition-colors duration-150">
                Become a host too
              </h2>
              <span
                aria-hidden="true"
                className="font-mono text-sm text-muted-foreground transition-transform duration-150 ease-out-quart group-hover:translate-x-0.5 group-hover:text-primary"
              >
                →
              </span>
            </div>
            <p className="text-muted-foreground text-sm mt-2">
              Use the same account to publish your own car when you are ready.
            </p>
          </Card>
        </Link>

        <Link
          href="/dashboard"
          className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Card className="p-6 h-full hover:-translate-y-0.5 hover:shadow-elevated hover:border-stone-300">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground tracking-[-0.02em] group-hover:text-primary transition-colors duration-150">
                Open your garage
              </h2>
              <span
                aria-hidden="true"
                className="font-mono text-sm text-muted-foreground transition-transform duration-150 ease-out-quart group-hover:translate-x-0.5 group-hover:text-primary"
              >
                →
              </span>
            </div>
            <p className="text-muted-foreground text-sm mt-2">
              Jump into the host-side dashboard if you also list vehicles on Izzac.
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default RiderDashboard;
