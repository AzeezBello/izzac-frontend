"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "../../lib/api";
import FallbackImage from "../../components/FallbackImage";
import Breadcrumbs from "../../components/Breadcrumbs";
import DashboardNav from "../../components/DashboardNav";
import DrivingEvaluationPanel from "../../components/DrivingEvaluationPanel";
import EmptyStateGuide from "../../components/EmptyStateGuide";
import { useAuth } from "../../context/AuthContext";
import { useCurrency } from "../../context/CurrencyContext";
import { resolveCarImage } from "../../lib/carCatalogue";
import { INSURANCE_PLAN_OPTIONS, IZZAC_PRIVILEGE_TIERS } from "../../lib/productContent";
import { useRequireAuth } from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Tooltip } from "../../components/ui/tooltip";
import { Alert, AlertDescription } from "../../components/ui/alert";

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

const OverviewDashboard = () => {
  const { formatPrice } = useCurrency();
  const { qualification } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [riderBookings, setRiderBookings] = useState<Booking[]>([]);
  const [hostBookings, setHostBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading } = useRequireAuth(
    "/login?next=/dashboard"
  );

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchWorkspaceData = async () => {
      try {
        const [carsRes, riderRes, hostRes] = await Promise.allSettled([
          api.get("/cars/my/"),
          api.get("/bookings/"),
          api.get("/bookings/", { params: { as_host: true } }),
        ]);

        if (carsRes.status === "fulfilled") {
          setCars(carsRes.value.data || []);
        }
        if (riderRes.status === "fulfilled") {
          setRiderBookings(riderRes.value.data || []);
        }
        if (hostRes.status === "fulfilled") {
          setHostBookings(hostRes.value.data || []);
        }
      } catch {
        setError("Unable to load all workspace telemetry right now.");
      }
    };

    fetchWorkspaceData();
  }, [isAuthenticated]);

  const metrics = useMemo(() => {
    const activeRiderTrips = riderBookings.filter(
      (b) => b.status !== "canceled"
    );
    const totalRiderSpend = activeRiderTrips.reduce(
      (acc, b) => acc + Number(b.total_price || 0),
      0
    );
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

  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 md:py-12 space-y-8 animate-enter-subtle">
      <Breadcrumbs items={[{ label: "My Garage & Dashboards" }]} />

      <DashboardNav />

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-border/80">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="emerald">Unified Mobility Command Center</Badge>
            <Badge variant="secondary">
              Rider · Self-Drive Evaluation · Host Fleet · Motor Insurance
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em]">
            Your garage & mobility overview
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-[72ch]">
            Manage your Chauffeur-Driven Trial, complete the Driving Test Evaluation to unlock Self-Drive, inspect verified motor insurance certificates, and operate your listed host fleet from one workspace.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Tooltip content="Open the dedicated Rider & Driving Test Evaluation workspace">
            <Button asChild variant="secondary" size="default">
              <Link href="/dashboard/rider">Rider & Driving Test</Link>
            </Button>
          </Tooltip>
          <Tooltip content="Open the dedicated Host & Fleet Partner garage">
            <Button asChild variant="outline" size="default">
              <Link href="/dashboard/host">Host Fleet Garage</Link>
            </Button>
          </Tooltip>
          <Tooltip content="Publish a new vehicle to the live fleet">
            <Button asChild size="default">
              <Link href="/dashboard/add-car">Add a car</Link>
            </Button>
          </Tooltip>
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : !isAuthenticated ? (
        <EmptyStateGuide
          eyebrow="Authentication Required"
          title="Sign in to access your Unified Mobility & Host Dashboards"
          description="One Izzac account powers your Chauffeur-Driven Trial, Self-Drive Driving Test Evaluation, verified motor insurance certificates, and Host Garage."
          primaryAction={{
            label: "Sign in to Dashboard",
            href: "/login?next=/dashboard",
          }}
          secondaryAction={{
            label: "Create Unified Account",
            href: "/signup",
          }}
          tips={[
            {
              title: "Mandatory Chauffeur-Driven Trial Period",
              description:
                "All new users begin with a Chauffeur-Driven Trial trip before unlocking the Self-Drive evaluation.",
            },
            {
              title: "Driving Test & License Evaluation",
              description:
                "Pass the 5-question Highway Code & Flood-Corridor test (≥80%) to earn your Self-Drive Clearance Certificate.",
            },
            {
              title: "Verified Motor Insurance",
              description:
                "Every reservation includes a verified NIID certificate with optional Comprehensive or Zero-Excess SRCC upgrades.",
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

          {/* 4-Column Executive KPI Telemetry Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <Card className="p-5 space-y-2 border-border/90">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  01 · Drive Clearance
                </span>
                <Badge
                  variant={
                    qualification.self_drive_eligible ? "emerald" : "secondary"
                  }
                >
                  {qualification.self_drive_eligible
                    ? "Self-Drive Unlocked"
                    : "Chauffeur Trial Mode"}
                </Badge>
              </div>
              <p className="text-xl font-bold text-foreground tracking-[-0.02em]">
                {qualification.self_drive_eligible
                  ? "Cleared for Self-Drive"
                  : qualification.chauffeur_trial_completed
                  ? "Ready for Driving Test"
                  : "Chauffeur Trial Required"}
              </p>
              <p className="font-mono text-xs text-muted-foreground tabular-nums">
                {qualification.clearance_certificate
                  ? `Cert: ${qualification.clearance_certificate}`
                  : `Test Score: ${qualification.driving_test_score}% (Pass: 80%)`}
              </p>
              <div className="pt-1">
                <a
                  href="#evaluation"
                  className="font-mono text-xs font-semibold text-primary hover:underline"
                >
                  {qualification.self_drive_eligible
                    ? "Inspect clearance certificate →"
                    : "Open Driving Test Evaluation →"}
                </a>
              </div>
            </Card>

            <Card className="p-5 space-y-2 border-border/90">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  02 · Rider Trips & NIID
                </span>
                <Badge variant="emerald">
                  {metrics.activeRiderTripsCount} Active
                </Badge>
              </div>
              <p className="font-mono text-2xl font-bold text-foreground tabular-nums">
                {formatPrice(metrics.totalRiderSpend)}
              </p>
              <p className="text-xs text-muted-foreground">
                Cumulative rider booking volume with verified motor insurance coverage.
              </p>
              <div className="pt-1">
                <Link
                  href="/dashboard/bookings"
                  className="font-mono text-xs font-semibold text-primary hover:underline"
                >
                  Open Bookings & NIID Ledger →
                </Link>
              </div>
            </Card>

            <Card className="p-5 space-y-2 border-border/90">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  03 · Host Garage Fleet
                </span>
                <Badge variant="secondary">
                  {cars.length} {cars.length === 1 ? "Car" : "Cars"} ·{" "}
                  {hostBookings.length} Trips
                </Badge>
              </div>
              <p className="font-mono text-2xl font-bold text-primary tabular-nums">
                {cars.length > 0
                  ? `${formatPrice(metrics.projectedMonthlyHostRevenue)}/mo`
                  : "₦0 /mo"}
              </p>
              <p className="text-xs text-muted-foreground">
                Projected 22-day monthly SuperFlex host payout across listed vehicles.
              </p>
              <div className="pt-1">
                <Link
                  href="/dashboard/host"
                  className="font-mono text-xs font-semibold text-primary hover:underline"
                >
                  Manage Host Garage →
                </Link>
              </div>
            </Card>

            <Card className="p-5 space-y-2 border-border/90">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  04 · Loyalty & Insurance
                </span>
                <Badge variant="emerald">{metrics.privilegeTier.discount}</Badge>
              </div>
              <p className="text-xl font-bold text-foreground tracking-[-0.02em]">
                {metrics.privilegeTier.tier}
              </p>
              <p className="text-xs text-muted-foreground">
                {metrics.privilegeTier.threshold} · Includes NIID-verified motor insurance on every booking.
              </p>
              <div className="pt-1">
                <Link
                  href="/user/dashboard"
                  className="font-mono text-xs font-semibold text-primary hover:underline"
                >
                  View KYC & Loyalty Dossier →
                </Link>
              </div>
            </Card>
          </div>

          {/* 12-Column Split: Active Trips + Host Garage vs. Workspace Switcher & Insurance Tiers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-6">
              {/* Recent Rider Trips & Insurance Certificates */}
              <div className="rounded-2xl border border-border/90 bg-card shadow-surface overflow-hidden">
                <div className="px-6 py-4 border-b border-border/80 bg-secondary/40 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="emerald">Rider Bookings & Insurance</Badge>
                    <h2 className="text-base font-bold text-foreground">
                      Recent Trips & NIID Motor Insurance Certificates
                    </h2>
                  </div>
                  <Link
                    href="/dashboard/bookings"
                    className="font-mono text-xs font-semibold text-primary hover:underline"
                  >
                    View all ({riderBookings.length}) →
                  </Link>
                </div>

                {riderBookings.length === 0 ? (
                  <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        No rider trips booked yet — start with your Chauffeur-Driven Trial
                      </p>
                      <p className="text-xs text-muted-foreground max-w-xl">
                        New users begin with a Chauffeur-Driven Trial trip. Once booked, Stage 01 completes automatically and unlocks the Driving Test Evaluation for Self-Drive.
                      </p>
                    </div>
                    <Button asChild size="sm" className="shrink-0">
                      <Link href="/cars?service=Chauffeur+%26+Protocol">
                        Book Chauffeur Trial →
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-border/70">
                    {riderBookings.slice(0, 3).map((booking) => (
                      <div
                        key={booking.id}
                        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-foreground">
                              {booking.car.make} {booking.car.model}
                            </span>
                            <Badge
                              variant={
                                booking.status === "canceled"
                                  ? "secondary"
                                  : "emerald"
                              }
                            >
                              {booking.status}
                            </Badge>
                            {booking.service_type && (
                              <Badge variant="outline">
                                {SERVICE_LABELS[booking.service_type] ||
                                  booking.service_type}
                              </Badge>
                            )}
                          </div>
                          <p className="font-mono text-xs text-muted-foreground tabular-nums">
                            {booking.car.location} · {booking.start_date} →{" "}
                            {booking.end_date}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                            <span className="rounded bg-emerald-950/10 border border-primary/30 text-primary px-2 py-0.5 font-semibold">
                              Insurance:{" "}
                              {INSURANCE_LABELS[
                                booking.insurance_plan || "comprehensive_shield"
                              ] || booking.insurance_plan}
                            </span>
                            {booking.insurance_certificate_ref && (
                              <span className="rounded bg-secondary px-2 py-0.5 text-foreground/85 tabular-nums">
                                Cert: {booking.insurance_certificate_ref}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono text-base font-bold text-primary tabular-nums">
                            {formatPrice(booking.total_price)}
                          </span>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/cars/${booking.car.id}`}>Dossier</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Listed Host Garage Vehicles */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-foreground tracking-[-0.02em]">
                      Your listed host garage ({cars.length})
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Vehicles you share across Chauffeur-Driven, Evaluated Self-Drive, Airport VIP, and SuperFlex channels.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/dashboard/host">Full Host Dashboard</Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href="/dashboard/add-car">+ Add Car</Link>
                    </Button>
                  </div>
                </div>

                {cars.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {cars.map((car, index) => (
                      <Card
                        key={car.id}
                        className="overflow-hidden flex flex-col hover:border-stone-300 hover:shadow-elevated"
                      >
                        <div className="relative overflow-hidden bg-secondary aspect-[16/10]">
                          <FallbackImage
                            src={resolveCarImage(car)}
                            alt={`${car.year} ${car.make} ${car.model} listed in ${car.location}`}
                            fetchPriority={index === 0 ? "high" : undefined}
                            loading={index >= 3 ? "lazy" : undefined}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <Badge
                              variant="outline"
                              className="bg-card/90 backdrop-blur-sm tabular-nums"
                            >
                              {car.year}
                            </Badge>
                            <Badge
                              variant="emerald"
                              className="bg-card/90 backdrop-blur-sm"
                            >
                              NIID Insured
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4 space-y-2">
                          <div className="flex items-baseline justify-between gap-2">
                            <h3 className="text-base font-semibold text-foreground tracking-[-0.02em]">
                              {car.make} {car.model}
                            </h3>
                            <p className="font-mono text-sm font-bold text-primary tabular-nums">
                              {formatPrice(car.price_per_day)}/d
                            </p>
                          </div>
                          <p className="font-mono text-xs text-muted-foreground tabular-nums">
                            {car.location} · SuperFlex:{" "}
                            {formatPrice(Math.round(car.price_per_day * 0.78))}
                            /d
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-secondary/25">
                    <div className="space-y-1">
                      <Badge variant="secondary">Host Garage Empty</Badge>
                      <h3 className="text-base font-bold text-foreground pt-1">
                        Turn your sedan, SUV, or Hilux 4x4 into recurring host revenue
                      </h3>
                      <p className="text-xs text-muted-foreground max-w-xl">
                        Every host vehicle is protected by Izzac’s mandatory Chauffeur-Trial guest screening, ≥80% Driving Test gate, and verified motor insurance.
                      </p>
                    </div>
                    <Button asChild size="sm" className="shrink-0">
                      <Link href="/dashboard/add-car">Publish First Car →</Link>
                    </Button>
                  </Card>
                )}
              </div>
            </div>

            {/* Right Column: All Dashboards Directory & Motor Insurance Tiers */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="p-6 space-y-4">
                <div className="space-y-1">
                  <Badge variant="emerald">All User Dashboards</Badge>
                  <h2 className="text-lg font-bold text-foreground">
                    Switch Specialized Workspaces
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Jump directly to any role-specific dashboard in your account.
                  </p>
                </div>

                <div className="divide-y divide-border/70 border-t border-border/70">
                  <Link
                    href="/dashboard/rider"
                    className="group py-3 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary">
                        Rider & Self-Drive Evaluation Hub
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Chauffeur Trial tracker, 5-question Driving Test & active trips
                      </p>
                    </div>
                    <span className="font-mono text-xs text-primary">→</span>
                  </Link>

                  <Link
                    href="/dashboard/host"
                    className="group py-3 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary">
                        Host & Fleet Partner Command Center
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Fleet telemetry, SuperFlex projections & guest vetting controls
                      </p>
                    </div>
                    <span className="font-mono text-xs text-primary">→</span>
                  </Link>

                  <Link
                    href="/dashboard/bookings"
                    className="group py-3 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary">
                        Bookings & Motor Insurance Ledger
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Dual-role rider/host reservations & NIID certificate numbers
                      </p>
                    </div>
                    <span className="font-mono text-xs text-primary">→</span>
                  </Link>

                  <Link
                    href="/user/dashboard"
                    className="group py-3 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary">
                        Account, KYC & Clearance Certificates
                      </p>
                      <p className="text-xs text-muted-foreground">
                        License/ID records, Self-Drive certificate & Privilege loyalty tier
                      </p>
                    </div>
                    <span className="font-mono text-xs text-primary">→</span>
                  </Link>
                </div>
              </Card>

              <Card className="p-6 space-y-4 bg-secondary/30">
                <div className="space-y-1">
                  <Badge variant="secondary">Verified Motor Insurance</Badge>
                  <h2 className="text-lg font-bold text-foreground">
                    Motor Insurance Policy Tiers
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Selectable on every vehicle booking with instant NIID policy verification.
                  </p>
                </div>

                <div className="space-y-3">
                  {INSURANCE_PLAN_OPTIONS.map((plan) => (
                    <div
                      key={plan.code}
                      className="rounded-xl border border-border/80 bg-card p-3.5 space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-foreground">
                          {plan.name}
                        </span>
                        <span className="font-mono text-xs font-bold text-primary tabular-nums">
                          {plan.dailyRateNgn === 0
                            ? "Included"
                            : `+${formatPrice(plan.dailyRateNgn)}/d`}
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-muted-foreground">
                        {plan.underwriter} · Up to {formatPrice(plan.coverageLimitNgn)}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Interactive 3-Stage Chauffeur Trial & Driving Test Evaluation Center */}
          <DrivingEvaluationPanel />
        </>
      )}
    </div>
  );
};

export default OverviewDashboard;
