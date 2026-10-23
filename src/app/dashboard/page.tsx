"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "../../lib/api";
import DashboardShell from "../../components/DashboardShell";
import DrivingEvaluationPanel from "../../components/DrivingEvaluationPanel";
import EmptyStateGuide from "../../components/EmptyStateGuide";
import Loader from "../../components/Loader";
import VehicleCard from "../../components/VehicleCard";
import { useAuth } from "../../context/AuthContext";
import { useCurrency } from "../../context/CurrencyContext";
import { INSURANCE_PLAN_OPTIONS, IZZAC_PRIVILEGE_TIERS } from "../../lib/productContent";
import { useRequireAuth } from "../../hooks/useAuth";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { ArrowLink, Eyebrow, Ledger, Stat, StatStrip } from "../../components/layout";

type Car = {
  id: number;
  make: string;
  model: string;
  year: number;
  price_per_day: number;
  image: string;
  location: string;
};

type Booking = {
  id: number;
  start_date: string;
  end_date: string;
  total_price: string;
  status: string;
  service_type?: string;
  pickup_mode?: string;
  protection_plan?: string;
  insurance_plan?: string;
  insurance_certificate_ref?: string;
  car: {
    id: number;
    make: string;
    model: string;
    location: string;
    image: string;
  };
};

const SERVICE_LABELS: Record<string, string> = {
  self_drive: "Evaluated Self-Drive",
  chauffeur: "Chauffeur-Driven Trial / Executive",
  airport_transfer: "Airport VIP Meet & Greet",
  corporate_flex: "Corporate SuperFlex",
};

const INSURANCE_LABELS: Record<string, string> = {
  third_party_niid: "Statutory Third-Party (NIID)",
  comprehensive_shield: "Comprehensive Motor Insurance",
  zero_excess_all_risk: "All-Risk Zero-Excess + SRCC",
};

const WORKSPACES = [
  { href: "/dashboard/rider", label: "Rider & driving test", hint: "Chauffeur trial, 5-question exam, active trips" },
  { href: "/dashboard/host", label: "Host garage", hint: "Listed vehicles, SuperFlex projections, guest vetting" },
  { href: "/dashboard/bookings", label: "Bookings", hint: "Rider and host reservations, NIID certificates" },
  { href: "/user/dashboard", label: "Profile", hint: "License, ID, self-drive certificate, loyalty tier" },
];

const statusVariant = (status: string) =>
  status === "canceled" ? "secondary" : status === "pending" ? "amber" : "emerald";

const OverviewDashboard = () => {
  const { formatPrice } = useCurrency();
  const { qualification } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [riderBookings, setRiderBookings] = useState<Booking[]>([]);
  const [hostBookings, setHostBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading } = useRequireAuth("/login?next=/dashboard");

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchWorkspaceData = async () => {
      try {
        const [carsRes, riderRes, hostRes] = await Promise.allSettled([
          api.get("/cars/my/"),
          api.get("/bookings/"),
          api.get("/bookings/", { params: { as_host: true } }),
        ]);

        if (carsRes.status === "fulfilled") setCars(carsRes.value.data || []);
        if (riderRes.status === "fulfilled") setRiderBookings(riderRes.value.data || []);
        if (hostRes.status === "fulfilled") setHostBookings(hostRes.value.data || []);
      } catch {
        setError("Unable to load all workspace data right now.");
      }
    };

    fetchWorkspaceData();
  }, [isAuthenticated]);

  const metrics = useMemo(() => {
    const activeRiderTrips = riderBookings.filter((b) => b.status !== "canceled");
    const totalRiderSpend = activeRiderTrips.reduce((acc, b) => acc + Number(b.total_price || 0), 0);
    const projectedMonthlyHostRevenue = cars.reduce(
      (acc, c) => acc + Math.round(Number(c.price_per_day || 0) * 0.78 * 22),
      0
    );
    const privilegeTier =
      activeRiderTrips.length >= 10
        ? IZZAC_PRIVILEGE_TIERS[2]
        : activeRiderTrips.length >= 3
        ? IZZAC_PRIVILEGE_TIERS[1]
        : IZZAC_PRIVILEGE_TIERS[0];

    return {
      activeRiderTripsCount: activeRiderTrips.length,
      totalRiderSpend,
      projectedMonthlyHostRevenue,
      privilegeTier,
    };
  }, [riderBookings, cars]);

  const clearanceLabel = qualification.self_drive_eligible
    ? "Self-drive"
    : qualification.chauffeur_trial_completed
    ? "Test pending"
    : "Trial first";

  const clearanceDetail = qualification.clearance_certificate
    ? `Certificate ${qualification.clearance_certificate}`
    : `Driving test ${qualification.driving_test_score}% · pass mark 80%`;

  return (
    <DashboardShell
      breadcrumbs={[{ label: "Dashboard" }]}
      eyebrow="Your account"
      title="Overview"
      description="Your chauffeur trial, driving test, insurance certificates and listed vehicles in one place."
      actions={
        <>
          <Button asChild variant="outline">
            <Link href="/dashboard/rider">Rider & driving test</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/add-car">Add a car</Link>
          </Button>
        </>
      }
    >
      {isLoading ? (
        <Loader />
      ) : !isAuthenticated ? (
        <EmptyStateGuide
          eyebrow="Sign in required"
          title="Sign in to see your rider and host overview"
          description="One Izzac account covers your chauffeur trial, driving test, insurance certificates and host garage."
          primaryAction={{ label: "Sign in", href: "/login?next=/dashboard" }}
          secondaryAction={{ label: "Create account", href: "/signup" }}
          tips={[
            {
              title: "Chauffeur trial first",
              description: "Every new rider starts with one chauffeur-driven trip before the driving test unlocks.",
            },
            {
              title: "Driving test at 80%",
              description: "Pass the 5-question highway and flood-corridor test to receive a self-drive certificate.",
            },
            {
              title: "NIID insurance included",
              description: "Each reservation issues a verified certificate, with comprehensive or zero-excess upgrades.",
            },
          ]}
        />
      ) : (
        <>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <StatStrip columns={4} variant="rule">
            <Stat label="Drive clearance" value={clearanceLabel} detail={clearanceDetail} tone={qualification.self_drive_eligible ? "primary" : "default"} />
            <Stat
              label="Rider spend"
              value={formatPrice(metrics.totalRiderSpend)}
              detail={`${metrics.activeRiderTripsCount} active ${metrics.activeRiderTripsCount === 1 ? "trip" : "trips"}, NIID insured`}
            />
            <Stat
              label="Host projection"
              value={cars.length > 0 ? `${formatPrice(metrics.projectedMonthlyHostRevenue)}` : "₦0"}
              detail={`${cars.length} listed · ${hostBookings.length} host ${hostBookings.length === 1 ? "trip" : "trips"} · 22-day SuperFlex month`}
              tone="primary"
            />
            <Stat label="Privilege tier" value={metrics.privilegeTier.tier} detail={`${metrics.privilegeTier.threshold} · ${metrics.privilegeTier.discount}`} />
          </StatStrip>

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="space-y-10 lg:col-span-8">
              {/* Recent trips */}
              <section className="space-y-4">
                <div className="flex items-end justify-between gap-4">
                  <div className="space-y-1.5">
                    <Eyebrow>Recent trips</Eyebrow>
                    <h2 className="text-h2 text-foreground">Your bookings & insurance</h2>
                  </div>
                  <ArrowLink href="/dashboard/bookings">View all ({riderBookings.length})</ArrowLink>
                </div>

                {riderBookings.length === 0 ? (
                  <div className="flex flex-col gap-4 rounded-lg border border-dashed border-border bg-surface/60 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">No trips yet. Start with a chauffeur-driven trial.</p>
                      <p className="max-w-[56ch] text-xs leading-relaxed text-muted-foreground">
                        Your first booking is chauffeured. Once complete, the driving test unlocks and you can qualify for self-drive.
                      </p>
                    </div>
                    <Button asChild size="sm" className="shrink-0">
                      <Link href="/cars?service=Chauffeur+%26+Protocol">Book a chauffeur trial</Link>
                    </Button>
                  </div>
                ) : (
                  <Ledger>
                    {riderBookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-foreground">
                              {booking.car.make} {booking.car.model}
                            </span>
                            <Badge variant={statusVariant(booking.status)} className="capitalize">
                              {booking.status}
                            </Badge>
                            {booking.service_type && (
                              <span className="font-mono text-2xs text-muted-foreground">
                                {SERVICE_LABELS[booking.service_type] || booking.service_type}
                              </span>
                            )}
                          </div>
                          <p className="font-mono text-2xs text-muted-foreground tabular-nums">
                            {booking.car.location} · {booking.start_date} → {booking.end_date}
                          </p>
                          <p className="font-mono text-2xs tabular-nums text-primary">
                            {INSURANCE_LABELS[booking.insurance_plan || "comprehensive_shield"] || booking.insurance_plan}
                            {booking.insurance_certificate_ref ? ` · ${booking.insurance_certificate_ref}` : ""}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-4">
                          <span className="font-mono text-[15px] font-semibold tabular-nums text-foreground">
                            {formatPrice(booking.total_price)}
                          </span>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/cars/${booking.car.id}`}>Vehicle</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </Ledger>
                )}
              </section>

              {/* Garage */}
              <section className="space-y-4">
                <div className="flex items-end justify-between gap-4">
                  <div className="space-y-1.5">
                    <Eyebrow>Your garage</Eyebrow>
                    <h2 className="text-h2 text-foreground">
                      Listed vehicles <span className="font-mono text-base font-normal text-muted-foreground tabular-nums">({cars.length})</span>
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/dashboard/host">Host garage</Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href="/dashboard/add-car">Add car</Link>
                    </Button>
                  </div>
                </div>

                {cars.length > 0 ? (
                  <Ledger>
                    {cars.map((car) => (
                      <VehicleCard key={car.id} car={car} layout="compact" />
                    ))}
                  </Ledger>
                ) : (
                  <div className="flex flex-col gap-4 rounded-lg border border-dashed border-border bg-surface/60 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Turn a sedan, SUV or 4x4 into monthly income.</p>
                      <p className="max-w-[56ch] text-xs leading-relaxed text-muted-foreground">
                        Every guest completes a chauffeur trial and passes the driving test at 80% before self-drive. NIID cover is attached to each trip.
                      </p>
                    </div>
                    <Button asChild size="sm" className="shrink-0">
                      <Link href="/dashboard/add-car">Publish your first car</Link>
                    </Button>
                  </div>
                )}
              </section>
            </div>

            <div className="space-y-10 lg:col-span-4">
              <section className="space-y-4">
                <div className="space-y-1.5">
                  <Eyebrow>Workspaces</Eyebrow>
                  <h2 className="text-h3 text-foreground">Jump to a section</h2>
                </div>
                <Ledger>
                  {WORKSPACES.map((item) => (
                    <Link key={item.href} href={item.href} className="group flex items-start justify-between gap-3 py-3.5">
                      <span className="space-y-0.5">
                        <span className="block text-sm font-medium text-foreground transition-colors duration-150 group-hover:text-primary">
                          {item.label}
                        </span>
                        <span className="block text-xs text-muted-foreground">{item.hint}</span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="font-mono text-sm text-muted-foreground transition-transform duration-200 ease-out-quart group-hover:translate-x-0.5 group-hover:text-primary"
                      >
                        →
                      </span>
                    </Link>
                  ))}
                </Ledger>
              </section>

              <section className="space-y-4">
                <div className="space-y-1.5">
                  <Eyebrow>Insurance tiers</Eyebrow>
                  <h2 className="text-h3 text-foreground">Selectable at checkout</h2>
                </div>
                <Ledger>
                  {INSURANCE_PLAN_OPTIONS.map((plan) => (
                    <div key={plan.code} className="space-y-1 py-3.5">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-sm font-medium text-foreground">{plan.name}</span>
                        <span className="shrink-0 font-mono text-xs font-semibold tabular-nums text-primary">
                          {plan.dailyRateNgn === 0 ? "Included" : `+${formatPrice(plan.dailyRateNgn)}/d`}
                        </span>
                      </div>
                      <p className="font-mono text-2xs tabular-nums text-muted-foreground">
                        {plan.underwriter} · up to {formatPrice(plan.coverageLimitNgn)}
                      </p>
                    </div>
                  ))}
                </Ledger>
              </section>
            </div>
          </div>

          <DrivingEvaluationPanel />
        </>
      )}
    </DashboardShell>
  );
};

export default OverviewDashboard;
