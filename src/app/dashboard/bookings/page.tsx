"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "../../../lib/api";
import FallbackImage from "../../../components/FallbackImage";
import Breadcrumbs from "../../../components/Breadcrumbs";
import DashboardNav from "../../../components/DashboardNav";
import EmptyStateGuide from "../../../components/EmptyStateGuide";
import { useAuth } from "../../../context/AuthContext";
import { useCurrency } from "../../../context/CurrencyContext";
import { resolveCarImage } from "../../../lib/carCatalogue";
import { useRequireAuth } from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Tooltip } from "../../../components/ui/tooltip";
import { Alert, AlertDescription } from "../../../components/ui/alert";

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
  addons?: string[];
  flight_or_notes?: string;
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

const PICKUP_LABELS: Record<string, string> = {
  hub_station: "City Hub Pickup",
  airport_desk: "Airport Terminal Curbside",
  doorstep_delivery: "Doorstep / Hotel Delivery",
  intercity_one_way: "Inter-City One-Way Drop-Off",
};

const PROTECTION_LABELS: Record<string, string> = {
  basic: "Basic Statutory Waiver",
  medium: "Road, Tyre & Flood Shield",
  premium: "Executive Zero-Excess + Standby Car",
};

const INSURANCE_LABELS: Record<string, string> = {
  third_party_niid: "Statutory Third-Party (NIID)",
  comprehensive_shield: "Comprehensive Motor Insurance",
  zero_excess_all_risk: "All-Risk Zero-Excess + SRCC",
};

const ADDON_LABELS: Record<string, string> = {
  security_escort: "MOPOL / Security Escort",
  prepaid_fuel: "Prepaid Full Tank",
  wifi_hotspot: "5G Cabin Wi-Fi",
  interstate_pass: "Interstate Corridor Pass",
  extra_driver: "Relief Driver",
  child_seat: "ISOFIX Child Seat",
};

const BookingsPage = () => {
  const { isAuthenticated, isLoading } = useRequireAuth(
    "/login?next=/dashboard/bookings"
  );
  const { qualification } = useAuth();
  const { formatPrice } = useCurrency();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"rider" | "host">("rider");
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadBookings = async () => {
      setError(null);
      try {
        const params = viewMode === "host" ? { as_host: true } : {};
        const { data } = await api.get("/bookings/", { params });
        setBookings(data);
      } catch {
        setError("Could not load bookings right now.");
      }
    };

    loadBookings();
  }, [isAuthenticated, viewMode]);

  const handleCancelBooking = async (bookingId: number) => {
    setCancelingId(bookingId);
    setError(null);
    try {
      const { data } = await api.post(`/bookings/${bookingId}/cancel/`);
      setBookings((prev) =>
        prev.map((item) => (item.id === bookingId ? data : item))
      );
    } catch {
      setError("Could not cancel this booking right now.");
    } finally {
      setCancelingId(null);
    }
  };

  const summary = useMemo(() => {
    const active = bookings.filter((b) => b.status !== "canceled");
    const totalValue = active.reduce(
      (acc, b) => acc + Number(b.total_price || 0),
      0
    );
    const chauffeurCount = active.filter(
      (b) => b.service_type !== "self_drive"
    ).length;
    const selfDriveCount = active.filter(
      (b) => b.service_type === "self_drive"
    ).length;

    return {
      activeCount: active.length,
      totalValue,
      chauffeurCount,
      selfDriveCount,
    };
  }, [bookings]);

  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 md:py-12 space-y-8 animate-enter-subtle">
      <Breadcrumbs
        items={[
          { label: "My Garage & Dashboards", href: "/dashboard" },
          { label: "Bookings & NIID Insurance Ledger" },
        ]}
      />

      <DashboardNav />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border/80">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="emerald">Trips & Motor Insurance Ledger</Badge>
            <Badge variant="secondary">
              Chauffeur Trial · Evaluated Self-Drive · Airport VIP
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em]">
            Your bookings & insurance certificates
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-[72ch]">
            Review confirmed trips, chauffeur/self-drive modes, Road & Tyre Shield waivers, verified motor insurance certificates, and host-side demand.
          </p>
        </div>

        <Tabs
          value={viewMode}
          onValueChange={(val) => setViewMode(val as "rider" | "host")}
          className="w-auto"
        >
          <TabsList>
            <Tooltip content="Trips you reserved as a rider or corporate account">
              <TabsTrigger value="rider">As rider</TabsTrigger>
            </Tooltip>
            <Tooltip content="Reservations placed by riders on your listed vehicles">
              <TabsTrigger value="host">For my cars</TabsTrigger>
            </Tooltip>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <Loader />
      ) : !isAuthenticated ? (
        <EmptyStateGuide
          eyebrow="Authentication Required"
          title="Sign in to view your Rider & Host Bookings Ledger"
          description="Track confirmed Chauffeur-Driven Trial trips, Evaluated Self-Drive reservations, motor insurance certificates, and reservations placed on your listed fleet."
          primaryAction={{
            label: "Sign in to Bookings",
            href: "/login?next=/dashboard/bookings",
          }}
          secondaryAction={{
            label: "Browse Available Fleet",
            href: "/cars",
          }}
          tips={[
            {
              title: "Dual-Role Bookings Ledger",
              description:
                "Switch between 'As rider' and 'For my cars' using the top tabs without logging out.",
            },
            {
              title: "Verified Motor Insurance Certificates",
              description:
                "Every reservation generates a verifiable NIID-NG-2026 policy reference alongside your selected road protection tier.",
            },
            {
              title: "Chauffeur Trial to Self-Drive Progression",
              description:
                "Complete your first Chauffeur-Driven Trial booking to unlock the 5-question Driving Test Evaluation for Self-Drive.",
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

          {/* 4-Column Bookings & Insurance Telemetry Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <Card className="p-5 space-y-1.5">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Active {viewMode === "rider" ? "Rider" : "Host"} Trips
              </span>
              <p className="font-mono text-2xl font-bold text-foreground tabular-nums">
                {summary.activeCount} Confirmed
              </p>
              <p className="text-xs text-muted-foreground">
                {summary.chauffeurCount} Chauffeur/VIP · {summary.selfDriveCount}{" "}
                Self-Drive
              </p>
            </Card>

            <Card className="p-5 space-y-1.5">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Total Ledger Volume
              </span>
              <p className="font-mono text-2xl font-bold text-primary tabular-nums">
                {formatPrice(summary.totalValue)}
              </p>
              <p className="text-xs text-muted-foreground">
                Includes vehicle tariff, protection, insurance & extras.
              </p>
            </Card>

            <Card className="p-5 space-y-1.5">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Motor Insurance
              </span>
              <p className="text-xl font-bold text-foreground">
                100% NIID Verified
              </p>
              <p className="text-xs text-muted-foreground">
                Active policy certificate issued on every reservation.
              </p>
            </Card>

            <Card className="p-5 space-y-1.5">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Self-Drive Clearance
              </span>
              <p className="text-xl font-bold text-foreground">
                {qualification.self_drive_eligible
                  ? "Self-Drive Unlocked ✓"
                  : "Chauffeur Trial Mode"}
              </p>
              <Link
                href="/dashboard/rider#evaluation"
                className="inline-block font-mono text-xs font-semibold text-primary hover:underline"
              >
                {qualification.self_drive_eligible
                  ? `Cert: ${qualification.clearance_certificate}`
                  : "Complete Trial & Driving Test →"}
              </Link>
            </Card>
          </div>

          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <Card
                key={booking.id}
                className="p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-5 hover:border-stone-300 hover:shadow-elevated stagger-item"
              >
                <FallbackImage
                  src={resolveCarImage(booking.car)}
                  alt={`${booking.car.make} ${booking.car.model} booked in ${booking.car.location}`}
                  loading={index >= 2 ? "lazy" : undefined}
                  className="w-full md:w-48 h-36 object-cover rounded-xl border border-border/60 shrink-0"
                />
                <div className="flex-1 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold text-foreground tracking-[-0.02em]">
                      {booking.car.make} {booking.car.model}
                    </h2>
                    <Badge
                      variant={
                        booking.status === "canceled" ? "secondary" : "emerald"
                      }
                      className="capitalize"
                    >
                      {booking.status}
                    </Badge>
                    {booking.service_type && (
                      <Badge variant="outline">
                        {SERVICE_LABELS[booking.service_type] ||
                          booking.service_type}
                      </Badge>
                    )}
                    <Badge variant="emerald">
                      {INSURANCE_LABELS[
                        booking.insurance_plan || "comprehensive_shield"
                      ] || booking.insurance_plan}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground text-sm">
                    {booking.car.location} ·{" "}
                    <span className="font-mono text-xs tabular-nums">
                      {booking.start_date} → {booking.end_date}
                    </span>
                  </p>

                  <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
                    {booking.insurance_certificate_ref && (
                      <span className="rounded bg-[#0d1713] text-emerald-300 px-2.5 py-0.5 font-semibold tabular-nums">
                        NIID Cert: {booking.insurance_certificate_ref}
                      </span>
                    )}
                    {booking.pickup_mode && (
                      <span className="rounded bg-secondary/80 px-2 py-0.5">
                        {PICKUP_LABELS[booking.pickup_mode] ||
                          booking.pickup_mode}
                      </span>
                    )}
                    {booking.protection_plan && (
                      <span className="rounded bg-secondary/80 px-2 py-0.5">
                        {PROTECTION_LABELS[booking.protection_plan] ||
                          booking.protection_plan}
                      </span>
                    )}
                    {(booking.addons || []).map((addonCode) => (
                      <span
                        key={addonCode}
                        className="rounded bg-primary/10 text-primary px-2 py-0.5 font-semibold"
                      >
                        +{ADDON_LABELS[addonCode] || addonCode}
                      </span>
                    ))}
                  </div>

                  {booking.flight_or_notes && (
                    <p className="text-xs text-muted-foreground italic">
                      Note / Flight: {booking.flight_or_notes}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <p className="font-mono text-base font-bold text-primary tabular-nums">
                      {formatPrice(booking.total_price)}{" "}
                      <span className="font-sans text-xs font-normal text-muted-foreground">
                        total (incl. insurance & protection)
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/cars/${booking.car.id}`}>View car</Link>
                  </Button>
                  {booking.status !== "canceled" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={cancelingId === booking.id}
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      {cancelingId === booking.id ? "Canceling..." : "Cancel"}
                    </Button>
                  )}
                </div>
              </Card>
            ))}

            {bookings.length === 0 && !error && (
              <EmptyStateGuide
                eyebrow={
                  viewMode === "rider"
                    ? "No Rider Trips Yet"
                    : "No Host Reservations Yet"
                }
                title={
                  viewMode === "rider"
                    ? "You haven’t booked your Chauffeur-Driven Trial or first trip yet"
                    : "No reservations have been placed on your cars yet"
                }
                description={
                  viewMode === "rider"
                    ? "New riders start with a Chauffeur-Driven Trial booking (which includes Verified Motor Insurance) before unlocking the Self-Drive Driving Test Evaluation."
                    : "Make sure your vehicles are published in Host Garage with competitive daily tariffs and clear hub descriptions."
                }
                primaryAction={
                  viewMode === "rider"
                    ? { label: "Browse 32+ Vehicles", href: "/cars" }
                    : { label: "Add a Car to Garage", href: "/dashboard/add-car" }
                }
                secondaryAction={{
                  label: "Open Driving Test Evaluation",
                  href: "/dashboard/rider#evaluation",
                }}
                tips={[
                  {
                    title: "Start with Chauffeur-Driven Trial",
                    description:
                      "Complete 1 Chauffeur-Driven, Airport VIP, or Corporate booking to complete Stage 01 of Self-Drive qualification.",
                  },
                  {
                    title: "Pass the ≥80% Driving Test Evaluation",
                    description:
                      "Verify your Driver's License + 11-digit ID and pass the 5-question Highway & Flood test to unlock Self-Drive.",
                  },
                  {
                    title: "Verified Motor Insurance Included",
                    description:
                      "Choose Statutory Third-Party (₦0), Comprehensive (+₦15k/d), or All-Risk Zero-Excess + SRCC (+₦28k/d) on every booking.",
                  },
                ]}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BookingsPage;
