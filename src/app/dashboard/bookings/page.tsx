"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../../lib/api";
import FallbackImage from "../../../components/FallbackImage";
import { resolveCarImage } from "../../../lib/carCatalogue";
import { useRequireAuth } from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Alert, AlertDescription } from "../../../components/ui/alert";

type Booking = {
  id: number;
  start_date: string;
  end_date: string;
  total_price: string;
  status: string;
  car: {
    id: number;
    make: string;
    model: string;
    location: string;
    image: string;
  };
};

const BookingsPage = () => {
  const { isAuthenticated, isLoading } = useRequireAuth(
    "/login?next=/dashboard/bookings"
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"rider" | "host">("rider");

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadBookings = async () => {
      setError(null);
      try {
        const params = viewMode === "host" ? { as_host: true } : {};
        const { data } = await api.get("/bookings/", { params });
        setBookings(data);
      } catch (err) {
        console.error(err);
        setError("Could not load bookings right now.");
      }
    };

    loadBookings();
  }, [isAuthenticated, viewMode]);

  if (isLoading) return <Loader />;
  if (!isAuthenticated) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-8 animate-enter-subtle">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border/80">
        <div className="space-y-2">
          <Badge variant="emerald">Trips</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em]">
            Your bookings
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Toggle to see trips you booked or bookings made on your cars.
          </p>
        </div>

        <Tabs
          value={viewMode}
          onValueChange={(val) => setViewMode(val as "rider" | "host")}
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger value="rider">As rider</TabsTrigger>
            <TabsTrigger value="host">For my cars</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

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
              alt={`${booking.car.make} ${booking.car.model}`}
              loading={index >= 2 ? "lazy" : undefined}
              className="w-full md:w-44 h-32 object-cover rounded-xl border border-border/60"
            />
            <div className="flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-semibold text-foreground tracking-[-0.02em]">
                  {booking.car.make} {booking.car.model}
                </h2>
                <Badge variant="emerald" className="capitalize">
                  {booking.status}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                {booking.car.location}
              </p>
              <p className="font-mono text-xs text-foreground/85 tabular-nums">
                From {booking.start_date} to {booking.end_date}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <p className="font-mono text-base font-bold text-primary tabular-nums">
                  ${booking.total_price}{" "}
                  <span className="font-sans text-xs font-normal text-muted-foreground">
                    total
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Status:{" "}
                  <span className="font-semibold text-foreground capitalize">
                    {booking.status}
                  </span>
                </p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="shrink-0">
              <Link href={`/cars/${booking.car.id}`}>View car</Link>
            </Button>
          </Card>
        ))}

        {bookings.length === 0 && !error && (
          <div className="rounded-2xl border border-dashed border-border py-14 px-6 text-center text-muted-foreground">
            No bookings yet.{" "}
            <Link
              href="/cars"
              className="text-primary font-semibold hover:underline"
            >
              Browse cars to start your first trip.
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
