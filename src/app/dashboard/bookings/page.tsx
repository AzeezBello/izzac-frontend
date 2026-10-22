"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../../lib/api";
import FallbackImage from "../../../components/FallbackImage";
import Breadcrumbs from "../../../components/Breadcrumbs";
import EmptyStateGuide from "../../../components/EmptyStateGuide";
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
  self_drive: "Verified Self-Drive",
  chauffeur: "Chauffeur-Driven Executive",
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
  basic: "Basic Statutory Third-Party",
  medium: "Naija Road & Tyre Shield",
  premium: "Executive Zero-Excess + Standby Car",
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

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16 space-y-8 animate-enter-subtle">
      <Breadcrumbs
        items={[
          { label: "My Garage", href: "/dashboard" },
          { label: "Bookings" },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border/80">
        <div className="space-y-2">
          <Badge variant="emerald">Trips & Service Ledger</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em]">
            Your bookings
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Review confirmed trips, chauffeur/self-drive modes, protection tiers, and host-side demand.
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
          title="Sign in to view your Rider & Host Bookings"
          description="Track confirmed chauffeur trips, airport VIP handovers, and reservations placed on your listed fleet."
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
              title: "Full Add-On & Protection Breakdown",
              description:
                "Every reservation records your selected drive mode, Naija Road Shield tier, and prepaid fuel or MOPOL add-ons.",
            },
            {
              title: "Instant Online Cancellation",
              description:
                "Need to adjust your schedule? Cancel active trips directly from your bookings workspace.",
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
                  className="w-full md:w-44 h-32 object-cover rounded-xl border border-border/60 shrink-0"
                />
                <div className="flex-1 space-y-2">
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
                  </div>

                  <p className="text-muted-foreground text-sm">
                    {booking.car.location} ·{" "}
                    <span className="font-mono text-xs tabular-nums">
                      {booking.start_date} → {booking.end_date}
                    </span>
                  </p>

                  <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
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
                        total
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
                    ? "You haven’t booked your first trip yet"
                    : "No reservations have been placed on your cars yet"
                }
                description={
                  viewMode === "rider"
                    ? "Choose any executive sedan, SUV, EV, or 4x4 pickup and configure your preferred drive mode, protection tier, and dates."
                    : "Make sure your vehicles are published in My Garage with competitive NGN daily tariffs and clear hub descriptions."
                }
                primaryAction={
                  viewMode === "rider"
                    ? { label: "Browse 32+ Vehicles", href: "/cars" }
                    : { label: "Add a Car to Garage", href: "/dashboard/add-car" }
                }
                secondaryAction={{
                  label: "Explore Services & B2B",
                  href: "/services",
                }}
                tips={[
                  {
                    title: "Toggle Chauffeur or Self-Drive",
                    description:
                      "Select Vetted Corporate Chauffeur (+₦25k/day) or NIN/FRSC-verified Self-Drive on any car dossier.",
                  },
                  {
                    title: "Add Airport VIP or Prepaid Fuel",
                    description:
                      "Skip filling station queues with Prepaid Full-Tank Fuel and book terminal pickup at LOS, ABV, or PHC.",
                  },
                  {
                    title: "Unlock 10%–22% SuperFlex Savings",
                    description:
                      "Bookings of 7+ days receive 10% off automatically; 30+ days unlock 22% Corporate SuperFlex pricing.",
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
