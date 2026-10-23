"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "../../../lib/api";
import FallbackImage from "../../../components/FallbackImage";
import DashboardShell from "../../../components/DashboardShell";
import EmptyStateGuide from "../../../components/EmptyStateGuide";
import Loader from "../../../components/Loader";
import { useAuth } from "../../../context/AuthContext";
import { useCurrency } from "../../../context/CurrencyContext";
import { resolveCarImage } from "../../../lib/carCatalogue";
import { useRequireAuth } from "../../../hooks/useAuth";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Stat, StatStrip } from "../../../components/layout/Stat";
import { Ledger } from "../../../components/layout/Ledger";
import { ArrowLink } from "../../../components/layout/ArrowLink";

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
  self_drive: "Self-drive",
  chauffeur: "Chauffeur-driven",
  airport_transfer: "Airport VIP",
  corporate_flex: "Corporate SuperFlex",
};

const PICKUP_LABELS: Record<string, string> = {
  hub_station: "Hub pickup",
  airport_desk: "Airport curbside",
  doorstep_delivery: "Doorstep delivery",
  intercity_one_way: "One-way drop-off",
};

const PROTECTION_LABELS: Record<string, string> = {
  basic: "Basic waiver",
  medium: "Road & tyre shield",
  premium: "Zero-excess + standby",
};

const INSURANCE_LABELS: Record<string, string> = {
  third_party_niid: "Third-party (NIID)",
  comprehensive_shield: "Comprehensive",
  zero_excess_all_risk: "All-risk zero-excess",
};

const ADDON_LABELS: Record<string, string> = {
  security_escort: "Security escort",
  prepaid_fuel: "Prepaid fuel",
  wifi_hotspot: "5G Wi-Fi",
  interstate_pass: "Interstate pass",
  extra_driver: "Relief driver",
  child_seat: "Child seat",
};

const BookingsPage = () => {
  const { isAuthenticated, isLoading } = useRequireAuth("/login?next=/dashboard/bookings");
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
      setBookings((prev) => prev.map((item) => (item.id === bookingId ? data : item)));
    } catch {
      setError("Could not cancel this booking right now.");
    } finally {
      setCancelingId(null);
    }
  };

  const summary = useMemo(() => {
    const active = bookings.filter((b) => b.status !== "canceled");
    const totalValue = active.reduce((acc, b) => acc + Number(b.total_price || 0), 0);
    const chauffeurCount = active.filter((b) => b.service_type !== "self_drive").length;
    const selfDriveCount = active.filter((b) => b.service_type === "self_drive").length;
    return { activeCount: active.length, totalValue, chauffeurCount, selfDriveCount };
  }, [bookings]);

  return (
    <DashboardShell
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Bookings" }]}
      eyebrow="Trips & insurance"
      title="Bookings"
      description="Every reservation you make as a rider, and every one placed on your listed cars, with its insurance certificate and protection tier."
      actions={
        <Button asChild>
          <Link href="/cars">Book a car</Link>
        </Button>
      }
    >
      {isLoading ? (
        <Loader label="Loading bookings" />
      ) : !isAuthenticated ? (
        <EmptyStateGuide
          eyebrow="Sign in required"
          title="Sign in to see your bookings"
          description="Rider trips, host reservations, and NIID insurance references live in one ledger."
          primaryAction={{ label: "Sign in", href: "/login?next=/dashboard/bookings" }}
          secondaryAction={{ label: "Browse the fleet", href: "/cars" }}
          tips={[
            { title: "Dual-role ledger", description: "Switch between trips you booked and reservations on your cars without logging out." },
            { title: "Insurance on every trip", description: "Each reservation carries a verifiable NIID certificate reference." },
            { title: "Trial to self-drive", description: "Your first chauffeur booking unlocks the driving test evaluation." },
          ]}
        />
      ) : (
        <>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <Tabs value={viewMode} onValueChange={(val) => setViewMode(val as "rider" | "host")} className="w-auto">
              <TabsList variant="underline" className="border-b-0">
                <TabsTrigger value="rider">As rider</TabsTrigger>
                <TabsTrigger value="host">For my cars</TabsTrigger>
              </TabsList>
            </Tabs>
            <p className="font-mono text-2xs uppercase tracking-[0.1em] text-muted-foreground tabular-nums">
              {bookings.length} {bookings.length === 1 ? "record" : "records"}
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <StatStrip columns={4}>
            <Stat
              label={viewMode === "rider" ? "Active trips" : "Active reservations"}
              value={summary.activeCount}
              detail={`${summary.chauffeurCount} chauffeur · ${summary.selfDriveCount} self-drive`}
            />
            <Stat label="Ledger volume" value={formatPrice(summary.totalValue)} tone="primary" detail="Tariff, protection, insurance and extras" />
            <Stat label="Insurance" value="NIID" size="sm" detail="Certificate issued on every reservation" />
            <Stat
              label="Self-drive"
              value={qualification.self_drive_eligible ? "Unlocked" : "Locked"}
              size="sm"
              tone={qualification.self_drive_eligible ? "primary" : "default"}
              detail={
                qualification.self_drive_eligible ? (
                  <span className="font-mono tabular-nums">{qualification.clearance_certificate}</span>
                ) : (
                  <ArrowLink href="/dashboard/rider#evaluation" size="sm">
                    Complete trial & test
                  </ArrowLink>
                )
              }
            />
          </StatStrip>

          {bookings.length > 0 ? (
            <Ledger>
              {bookings.map((booking) => {
                const canceled = booking.status === "canceled";
                return (
                  <article key={booking.id} className="grid grid-cols-1 gap-4 py-5 md:grid-cols-[6rem_1fr_auto] md:gap-6">
                    <FallbackImage
                      src={resolveCarImage(booking.car)}
                      alt={`${booking.car.make} ${booking.car.model}`}
                      loading="lazy"
                      className="h-16 w-24 rounded-sm border border-border/60 object-cover"
                    />
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-medium tracking-[-0.01em] text-foreground">
                          {booking.car.make} {booking.car.model}
                        </h2>
                        <Badge variant={canceled ? "secondary" : "emerald"} dot>
                          {booking.status}
                        </Badge>
                        {booking.service_type && (
                          <Badge variant="outline">{SERVICE_LABELS[booking.service_type] || booking.service_type}</Badge>
                        )}
                      </div>
                      <p className="font-mono text-xs text-muted-foreground tabular-nums">
                        {booking.start_date} → {booking.end_date} · {booking.car.location}
                      </p>
                      <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-2xs text-muted-foreground">
                        <span className="text-primary">
                          {INSURANCE_LABELS[booking.insurance_plan || "comprehensive_shield"] || booking.insurance_plan}
                        </span>
                        {booking.insurance_certificate_ref && <span className="tabular-nums">{booking.insurance_certificate_ref}</span>}
                        {booking.pickup_mode && <span>{PICKUP_LABELS[booking.pickup_mode] || booking.pickup_mode}</span>}
                        {booking.protection_plan && <span>{PROTECTION_LABELS[booking.protection_plan] || booking.protection_plan}</span>}
                        {(booking.addons || []).map((code) => (
                          <span key={code}>+{ADDON_LABELS[code] || code}</span>
                        ))}
                      </p>
                      {booking.flight_or_notes && (
                        <p className="text-xs text-muted-foreground">Note: {booking.flight_or_notes}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-4 md:flex-col md:items-end md:justify-start">
                      <p className="font-mono text-lg font-semibold tabular-nums text-foreground">{formatPrice(booking.total_price)}</p>
                      <div className="flex items-center gap-1.5">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/cars/${booking.car.id}`}>View car</Link>
                        </Button>
                        {!canceled && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={cancelingId === booking.id}
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            {cancelingId === booking.id ? "Canceling…" : "Cancel"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </Ledger>
          ) : (
            !error && (
              <EmptyStateGuide
                eyebrow={viewMode === "rider" ? "No trips yet" : "No reservations yet"}
                title={viewMode === "rider" ? "You haven't booked your first trip" : "No one has booked your cars yet"}
                description={
                  viewMode === "rider"
                    ? "New riders start with a chauffeur-driven trial. It includes motor insurance and unlocks the self-drive evaluation."
                    : "Make sure your vehicles are published with a competitive daily rate and a clear hub description."
                }
                primaryAction={
                  viewMode === "rider" ? { label: "Browse the fleet", href: "/cars" } : { label: "Publish a vehicle", href: "/dashboard/add-car" }
                }
                secondaryAction={{ label: "Driving test evaluation", href: "/dashboard/rider#evaluation" }}
                tips={[
                  { title: "Start chauffeur-driven", description: "One chauffeur, airport or corporate booking completes stage one." },
                  { title: "Pass the driving test", description: "Verify your licence and ID and score 80% or more on five questions." },
                  { title: "Insurance included", description: "Third-party cover is free; comprehensive and zero-excess are optional upgrades." },
                ]}
              />
            )
          )}
        </>
      )}
    </DashboardShell>
  );
};

export default BookingsPage;
