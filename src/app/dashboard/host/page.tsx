"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "../../../lib/api";
import DashboardShell from "../../../components/DashboardShell";
import EmptyStateGuide from "../../../components/EmptyStateGuide";
import Loader from "../../../components/Loader";
import VehicleCard from "../../../components/VehicleCard";
import { useCurrency } from "../../../context/CurrencyContext";
import { INSURANCE_PLAN_OPTIONS } from "../../../lib/productContent";
import { useRequireAuth } from "../../../hooks/useAuth";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { ArrowLink, Eyebrow, InkPanel, Ledger, LedgerRow, Stat, StatStrip } from "../../../components/layout";

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

const statusVariant = (status: string) =>
  status === "canceled" ? "secondary" : status === "pending" ? "amber" : "emerald";

const HostFleetDashboard = () => {
  const { formatPrice } = useCurrency();
  const [cars, setCars] = useState<Car[]>([]);
  const [hostBookings, setHostBookings] = useState<HostBooking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading } = useRequireAuth("/login?next=/dashboard/host");

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadHostData = async () => {
      try {
        const [carsRes, bookingsRes] = await Promise.allSettled([
          api.get("/cars/my/"),
          api.get("/bookings/", { params: { as_host: true } }),
        ]);

        if (carsRes.status === "fulfilled") setCars(carsRes.value.data || []);
        if (bookingsRes.status === "fulfilled") setHostBookings(bookingsRes.value.data || []);
      } catch {
        setError("Unable to load host fleet data right now.");
      }
    };

    loadHostData();
  }, [isAuthenticated]);

  const stats = useMemo(() => {
    const activeReservations = hostBookings.filter((b) => b.status !== "canceled");
    const confirmedRevenue = activeReservations.reduce((acc, b) => acc + Number(b.total_price || 0), 0);
    const avgDailyRate =
      cars.length > 0
        ? Math.round(cars.reduce((acc, c) => acc + Number(c.price_per_day || 0), 0) / cars.length)
        : 145000;
    const monthlySuperFlexPerFleet =
      cars.length > 0
        ? cars.reduce((acc, c) => acc + Math.round(Number(c.price_per_day || 0) * 0.78 * 22), 0)
        : Math.round(avgDailyRate * 0.78 * 22);

    return {
      activeReservationsCount: activeReservations.length,
      confirmedRevenue,
      avgDailyRate,
      monthlySuperFlexPerFleet,
    };
  }, [cars, hostBookings]);

  return (
    <DashboardShell
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Host garage" }]}
      eyebrow="Host"
      title="Host garage"
      description="Your listed vehicles, SuperFlex projections and incoming reservations. Every self-drive guest has completed a chauffeur trial, passed the driving test at 80% and holds a NIID certificate."
      actions={
        <>
          <Button asChild variant="outline">
            <Link href="/dashboard/bookings">Host bookings</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/add-car">Publish a vehicle</Link>
          </Button>
        </>
      }
    >
      {isLoading ? (
        <Loader />
      ) : !isAuthenticated ? (
        <EmptyStateGuide
          eyebrow="Sign in required"
          title="Sign in to manage your fleet and payouts"
          description="Publish single cars or whole fleets across Lagos, Abuja, Port Harcourt and Kano with insurance and guest vetting built in."
          primaryAction={{ label: "Sign in", href: "/login?next=/dashboard/host" }}
          secondaryAction={{ label: "Create host account", href: "/signup?role=host" }}
          tips={[
            {
              title: "Guests are vetted before self-drive",
              description: "New riders cannot self-drive your car until they finish a chauffeur trial and pass the 5-question test at 80%.",
            },
            {
              title: "NIID cover on every trip",
              description: "Each reservation issues a unique certificate underwritten by Leadway or AXA Mansard.",
            },
            {
              title: "SuperFlex pricing is automatic",
              description: "7-day (-10%) and 30-day (-22%) corporate bookings are priced from your daily rate.",
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
            <Stat
              label="Listed units"
              value={cars.length}
              detail={`Average tariff ${formatPrice(stats.avgDailyRate)}/day`}
            />
            <Stat
              label="SuperFlex potential"
              value={formatPrice(stats.monthlySuperFlexPerFleet)}
              detail="22-day month at the -22% corporate rate"
              tone="primary"
            />
            <Stat
              label="Confirmed revenue"
              value={formatPrice(stats.confirmedRevenue)}
              detail={`${stats.activeReservationsCount} active ${stats.activeReservationsCount === 1 ? "reservation" : "reservations"}`}
            />
            <Stat label="Protection gate" value="Enforced" detail="Trial · test ≥80% · NIID on every booking" tone="primary" />
          </StatStrip>

          {/* Fleet */}
          <section className="space-y-5">
            <div className="flex items-end justify-between gap-4">
              <div className="space-y-1.5">
                <Eyebrow>Fleet</Eyebrow>
                <h2 className="text-h2 text-foreground">
                  Published vehicles <span className="font-mono text-base font-normal tabular-nums text-muted-foreground">({cars.length})</span>
                </h2>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/add-car">Add another car</Link>
              </Button>
            </div>

            {cars.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {cars.map((car, index) => (
                  <VehicleCard key={car.id} car={car} priority={index === 0} href={`/cars/${car.id}`} footer="View live page →" />
                ))}
              </div>
            ) : (
              <EmptyStateGuide
                eyebrow="Empty garage"
                title="You have not published a vehicle yet"
                description="List a sedan, SUV or 4x4 to receive chauffeur-driven, airport VIP and evaluated self-drive bookings."
                primaryAction={{ label: "Publish your first car", href: "/dashboard/add-car" }}
                secondaryAction={{ label: "How hosting works", href: "/host" }}
                tips={[
                  {
                    title: "Set a daily tariff",
                    description: "Enter one base rate. Weekly (-10%) and SuperFlex (-22%) pricing is calculated for you.",
                  },
                  {
                    title: "Guests are vetted",
                    description: "First-time riders complete a chauffeur trial and pass the driving test before self-drive.",
                  },
                  {
                    title: "Insurance is attached",
                    description: "Every booking binds a verified NIID policy to your vehicle.",
                  },
                ]}
              />
            )}
          </section>

          {/* Reservations + protection */}
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <section className="space-y-4 lg:col-span-7">
              <div className="flex items-end justify-between gap-4">
                <div className="space-y-1.5">
                  <Eyebrow>Reservations</Eyebrow>
                  <h2 className="text-h3 text-foreground">
                    Bookings on your vehicles{" "}
                    <span className="font-mono text-sm font-normal tabular-nums text-muted-foreground">({hostBookings.length})</span>
                  </h2>
                </div>
                <ArrowLink href="/dashboard/bookings" size="sm">
                  Full list
                </ArrowLink>
              </div>

              {hostBookings.length === 0 ? (
                <div className="space-y-1.5 rounded-lg border border-dashed border-border bg-surface/60 p-5">
                  <p className="text-sm font-medium text-foreground">No guest reservations yet.</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    When a rider or corporate account books your car, their drive mode, clearance status and NIID certificate will appear here.
                  </p>
                </div>
              ) : (
                <Ledger>
                  {hostBookings.map((booking) => (
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
                        <p className="font-mono text-2xs tabular-nums text-muted-foreground">
                          {booking.start_date} → {booking.end_date} ·{" "}
                          {INSURANCE_LABELS[booking.insurance_plan || "comprehensive_shield"] || booking.insurance_plan}
                        </p>
                        {booking.insurance_certificate_ref && (
                          <p className="font-mono text-2xs tabular-nums text-primary">NIID {booking.insurance_certificate_ref}</p>
                        )}
                      </div>
                      <span className="shrink-0 font-mono text-[15px] font-semibold tabular-nums text-foreground">
                        {formatPrice(booking.total_price)}
                      </span>
                    </div>
                  ))}
                </Ledger>
              )}
            </section>

            <InkPanel className="lg:col-span-5" padding="sm">
              <div className="space-y-2">
                <Eyebrow tone="signal">Asset protection</Eyebrow>
                <h2 className="text-h3 text-ink-foreground">How we protect your vehicle</h2>
                <p className="text-xs leading-relaxed text-ink-muted">
                  No keys go to unverified first-time renters. Three checks run on every booking.
                </p>
              </div>
              <Ledger inverted flush className="mt-4 border-t border-white/10">
                <LedgerRow
                  inverted
                  density="compact"
                  index="01"
                  title="Chauffeur trial"
                  description="Every new user is chauffeured by a vetted Izzac driver before self-drive is available."
                />
                <LedgerRow
                  inverted
                  density="compact"
                  index="02"
                  title="License, ID and driving test"
                  description="Guests verify their license and 11-digit ID and score at least 80% on highway and flood-corridor rules."
                />
                <LedgerRow
                  inverted
                  density="compact"
                  index="03"
                  title="Verified motor insurance"
                  description={`Every trip binds an active NIID policy: ${INSURANCE_PLAN_OPTIONS.map((p) => p.badge).join(" · ")}.`}
                />
              </Ledger>
            </InkPanel>
          </div>
        </>
      )}
    </DashboardShell>
  );
};

export default HostFleetDashboard;
