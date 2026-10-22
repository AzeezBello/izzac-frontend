"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "../../../lib/api";
import FallbackImage from "../../../components/FallbackImage";
import Breadcrumbs from "../../../components/Breadcrumbs";
import DashboardNav from "../../../components/DashboardNav";
import EmptyStateGuide from "../../../components/EmptyStateGuide";
import { useCurrency } from "../../../context/CurrencyContext";
import { resolveCarImage } from "../../../lib/carCatalogue";
import { INSURANCE_PLAN_OPTIONS } from "../../../lib/productContent";
import { useRequireAuth } from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Tooltip } from "../../../components/ui/tooltip";
import { Alert, AlertDescription } from "../../../components/ui/alert";

type Car = {
  id: number;
  make: string;
  model: string;
  year: number;
  price_per_day: number;
  image: string;
  location: string;
  description?: string;
};

type HostBooking = {
  id: number;
  start_date: string;
  end_date: string;
  total_price: string;
  status: string;
  service_type?: string;
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
  chauffeur: "Chauffeur-Driven Executive",
  airport_transfer: "Airport VIP Meet & Greet",
  corporate_flex: "Corporate SuperFlex",
};

const INSURANCE_LABELS: Record<string, string> = {
  third_party_niid: "Statutory Third-Party (NIID)",
  comprehensive_shield: "Comprehensive Motor Insurance",
  zero_excess_all_risk: "All-Risk Zero-Excess + SRCC",
};

const HostFleetDashboard = () => {
  const { formatPrice } = useCurrency();
  const [cars, setCars] = useState<Car[]>([]);
  const [hostBookings, setHostBookings] = useState<HostBooking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading } = useRequireAuth(
    "/login?next=/dashboard/host"
  );

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadHostData = async () => {
      try {
        const [carsRes, bookingsRes] = await Promise.allSettled([
          api.get("/cars/my/"),
          api.get("/bookings/", { params: { as_host: true } }),
        ]);

        if (carsRes.status === "fulfilled") {
          setCars(carsRes.value.data || []);
        }
        if (bookingsRes.status === "fulfilled") {
          setHostBookings(bookingsRes.value.data || []);
        }
      } catch {
        setError("Unable to load host fleet telemetry right now.");
      }
    };

    loadHostData();
  }, [isAuthenticated]);

  const stats = useMemo(() => {
    const activeReservations = hostBookings.filter(
      (b) => b.status !== "canceled"
    );
    const confirmedRevenue = activeReservations.reduce(
      (acc, b) => acc + Number(b.total_price || 0),
      0
    );
    const avgDailyRate =
      cars.length > 0
        ? Math.round(
            cars.reduce((acc, c) => acc + Number(c.price_per_day || 0), 0) /
              cars.length
          )
        : 145000;
    const monthlySuperFlexPerFleet =
      cars.length > 0
        ? cars.reduce(
            (acc, c) =>
              acc + Math.round(Number(c.price_per_day || 0) * 0.78 * 22),
            0
          )
        : Math.round(avgDailyRate * 0.78 * 22);

    return {
      activeReservationsCount: activeReservations.length,
      confirmedRevenue,
      avgDailyRate,
      monthlySuperFlexPerFleet,
    };
  }, [cars, hostBookings]);

  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 md:py-12 space-y-8 animate-enter-subtle">
      <Breadcrumbs
        items={[
          { label: "My Garage & Dashboards", href: "/dashboard" },
          { label: "Host & Fleet Partner Command Center" },
        ]}
      />

      <DashboardNav />

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-border/80">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="emerald">Host & Commercial Fleet Partner</Badge>
            <Badge variant="secondary">
              Guest Chauffeur-Trial Gate · ≥80% Driving Test · Motor Insurance
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em]">
            Host & fleet partner command center
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-[74ch]">
            Monitor your listed vehicles, track SuperFlex corporate utilization, and verify that every self-drive guest has completed their mandatory Chauffeur-Driven Trial, passed the ≥80% Driving Test Evaluation, and holds an active NIID motor insurance certificate.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Tooltip content="Inspect reservations placed on your listed cars">
            <Button asChild variant="outline">
              <Link href="/dashboard/bookings">Host bookings ledger</Link>
            </Button>
          </Tooltip>
          <Tooltip content="Publish a new sedan, SUV, or Hilux 4x4 to the fleet">
            <Button asChild>
              <Link href="/dashboard/add-car">+ Publish new vehicle</Link>
            </Button>
          </Tooltip>
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : !isAuthenticated ? (
        <EmptyStateGuide
          eyebrow="Host Authentication"
          title="Sign in to manage your Host Fleet & Partner Revenue"
          description="Publish single cars or commercial fleets across Lagos, Abuja, Port Harcourt, and Kano with full motor insurance and guest driving evaluation enforcement."
          primaryAction={{
            label: "Sign in to Host Command Center",
            href: "/login?next=/dashboard/host",
          }}
          secondaryAction={{
            label: "Create Host Account",
            href: "/signup?role=host",
          }}
          tips={[
            {
              title: "Mandatory Guest Chauffeur-Trial Gate",
              description:
                "New riders cannot book your car for Self-Drive until they complete a Chauffeur-Driven Trial and pass the 5-question Driving Test (≥80%).",
            },
            {
              title: "Verified Motor Insurance",
              description:
                "Every reservation generates a unique NIID-NG-2026 certificate underwritten by Leadway or AXA Mansard.",
            },
            {
              title: "Automatic Corporate SuperFlex Pricing",
              description:
                "Capture 7-day (-10%) and 30-day (-22%) corporate fleet bookings automatically from your daily rate.",
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

          {/* 4-Column Host Fleet KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <Card className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Listed Fleet Units
                </span>
                <Badge variant="emerald">{cars.length} Active</Badge>
              </div>
              <p className="font-mono text-2xl font-bold text-foreground tabular-nums">
                {cars.length} {cars.length === 1 ? "Vehicle" : "Vehicles"}
              </p>
              <p className="font-mono text-xs text-muted-foreground tabular-nums">
                Avg Tariff: {formatPrice(stats.avgDailyRate)} /day
              </p>
            </Card>

            <Card className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  SuperFlex Revenue Potential
                </span>
                <Badge variant="secondary">22 Days / Mo</Badge>
              </div>
              <p className="font-mono text-2xl font-bold text-primary tabular-nums">
                {formatPrice(stats.monthlySuperFlexPerFleet)}
              </p>
              <p className="text-xs text-muted-foreground">
                Estimated monthly payout at -22% Corporate SuperFlex rate.
              </p>
            </Card>

            <Card className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Confirmed Host Bookings
                </span>
                <Badge variant="emerald">
                  {stats.activeReservationsCount} Trips
                </Badge>
              </div>
              <p className="font-mono text-2xl font-bold text-foreground tabular-nums">
                {formatPrice(stats.confirmedRevenue)}
              </p>
              <p className="text-xs text-muted-foreground">
                Total confirmed reservation volume on your listed vehicles.
              </p>
            </Card>

            <Card className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Self-Drive Protection Gate
                </span>
                <Badge variant="emerald">Enforced ✓</Badge>
              </div>
              <p className="text-xl font-bold text-foreground">
                Trial + ≥80% Exam + NIID
              </p>
              <p className="text-xs text-muted-foreground">
                Untested new users are restricted to Chauffeur-Driven bookings only.
              </p>
            </Card>
          </div>

          {/* Listed Vehicles Grid */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-foreground tracking-[-0.02em]">
                  Published Fleet Inventory ({cars.length})
                </h2>
                <p className="text-xs text-muted-foreground">
                  All listed vehicles automatically enforce verified motor insurance and Self-Drive guest evaluation rules.
                </p>
              </div>
              <Button asChild size="sm">
                <Link href="/dashboard/add-car">+ Add another car</Link>
              </Button>
            </div>

            {cars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cars.map((car, index) => (
                  <Card
                    key={car.id}
                    className="overflow-hidden flex flex-col hover:border-stone-300 hover:shadow-elevated stagger-item"
                  >
                    <div className="relative overflow-hidden bg-secondary aspect-[16/10]">
                      <FallbackImage
                        src={resolveCarImage(car)}
                        alt={`${car.year} ${car.make} ${car.model} listed in ${car.location}`}
                        fetchPriority={index === 0 ? "high" : undefined}
                        loading={index >= 4 ? "lazy" : undefined}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
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
                          NIID Protected
                        </Badge>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="text-lg font-semibold text-foreground tracking-[-0.02em]">
                            {car.make} {car.model}
                          </h3>
                          <p className="font-mono text-base font-bold text-primary tabular-nums">
                            {formatPrice(car.price_per_day)}{" "}
                            <span className="font-sans text-xs font-normal text-muted-foreground">
                              /day
                            </span>
                          </p>
                        </div>
                        <p className="font-mono text-xs text-muted-foreground tabular-nums">
                          {car.location} · SuperFlex:{" "}
                          {formatPrice(Math.round(car.price_per_day * 0.78))}
                          /day
                        </p>
                      </div>
                      <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                        <span className="font-mono text-[11px] text-muted-foreground">
                          Chauffeur + Vetted Self-Drive
                        </span>
                        <Link
                          href={`/cars/${car.id}`}
                          className="font-semibold text-primary hover:underline"
                        >
                          View live page →
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyStateGuide
                eyebrow="Empty Host Garage"
                title="You haven’t published any vehicles in your Host Garage yet"
                description="Publish your sedan, SUV, or Hilux 4x4 pickup to start receiving Chauffeur-Driven, Airport VIP, and Evaluated Self-Drive bookings."
                primaryAction={{
                  label: "Publish Your First Car",
                  href: "/dashboard/add-car",
                }}
                secondaryAction={{
                  label: "Explore Host Program",
                  href: "/host",
                }}
                tips={[
                  {
                    title: "Set Your Daily Tariff",
                    description:
                      "Enter your base daily rate; Izzac automatically calculates weekly (-10%) and SuperFlex (-22%) corporate pricing.",
                  },
                  {
                    title: "Mandatory Self-Drive Guest Vetting",
                    description:
                      "First-time riders must complete a Chauffeur-Driven Trial and pass our ≥80% Driving Test before they can book Self-Drive.",
                  },
                  {
                    title: "Verified Motor Insurance",
                    description:
                      "Every booking attaches a verified NIID motor insurance policy for complete host peace of mind.",
                  },
                ]}
              />
            )}
          </div>

          {/* Incoming Host Reservations & Guest Insurance Verification */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 rounded-2xl border border-border/90 bg-card shadow-surface overflow-hidden">
              <div className="px-6 py-4 border-b border-border/80 bg-secondary/40 flex items-center justify-between">
                <div>
                  <Badge variant="emerald">Host Reservations Queue</Badge>
                  <h2 className="text-base font-bold text-foreground mt-1">
                    Bookings Placed on Your Vehicles ({hostBookings.length})
                  </h2>
                </div>
                <Link
                  href="/dashboard/bookings"
                  className="font-mono text-xs font-semibold text-primary hover:underline"
                >
                  Open full ledger →
                </Link>
              </div>

              {hostBookings.length === 0 ? (
                <div className="p-6 text-sm text-muted-foreground space-y-2">
                  <p className="font-semibold text-foreground">
                    No guest reservations on your listed cars yet.
                  </p>
                  <p className="text-xs">
                    Once riders or corporate accounts book your vehicle, their Drive Mode, Self-Drive Clearance status, and NIID Motor Insurance certificate reference will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/70">
                  {hostBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-foreground">
                            {booking.car.make} {booking.car.model}
                          </span>
                          <Badge variant="emerald">{booking.status}</Badge>
                          {booking.service_type && (
                            <Badge variant="outline">
                              {SERVICE_LABELS[booking.service_type] ||
                                booking.service_type}
                            </Badge>
                          )}
                        </div>
                        <p className="font-mono text-xs text-muted-foreground tabular-nums">
                          {booking.start_date} → {booking.end_date} ·{" "}
                          {INSURANCE_LABELS[
                            booking.insurance_plan || "comprehensive_shield"
                          ] || booking.insurance_plan}
                        </p>
                        {booking.insurance_certificate_ref && (
                          <p className="font-mono text-[11px] text-primary">
                            NIID Policy: {booking.insurance_certificate_ref}
                          </p>
                        )}
                      </div>
                      <span className="font-mono text-base font-bold text-primary tabular-nums">
                        {formatPrice(booking.total_price)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Host Asset Protection & Motor Insurance Guarantee */}
            <div className="lg:col-span-5 rounded-2xl bg-[#0d1713] text-stone-100 p-6 md:p-7 border border-emerald-950 shadow-elevated space-y-4">
              <div className="space-y-1.5">
                <Badge variant="dark">Host Asset Protection Architecture</Badge>
                <h2 className="text-xl font-bold text-stone-50">
                  How Izzac Protects Your Vehicle from Untested Self-Drive Risk
                </h2>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Unlike generic P2P platforms that hand keys to unverified first-time renters, Izzac enforces a strict 3-layer security & insurance protocol on every booking:
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-white/10 text-xs">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-1">
                  <p className="font-mono font-semibold text-emerald-300">
                    Layer 01 · Mandatory Chauffeur-Driven Trial
                  </p>
                  <p className="text-stone-300 leading-relaxed">
                    Every new user is locked out of Self-Drive until they complete a Chauffeur-Driven Trial trip with a vetted Izzac driver.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-1">
                  <p className="font-mono font-semibold text-emerald-300">
                    Layer 02 · License/ID + ≥80% Driving Test Evaluation
                  </p>
                  <p className="text-stone-300 leading-relaxed">
                    Guests must verify their Driver’s License and 11-digit ID and score at least 80% on Highway Code & Flood-Corridor protocols.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-1">
                  <p className="font-mono font-semibold text-emerald-300">
                    Layer 03 · Verified Motor Insurance
                  </p>
                  <p className="text-stone-300 leading-relaxed">
                    Every trip binds an active NIID policy ({INSURANCE_PLAN_OPTIONS.map((p) => p.badge).join(" · ")}).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HostFleetDashboard;
