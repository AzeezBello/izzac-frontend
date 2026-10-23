"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Eyebrow } from "./layout/Eyebrow";
import { Ledger } from "./layout/Ledger";

type Booking = {
  id: number;
  car: { make: string; model: string };
  start_date: string;
  end_date: string;
};

const UserBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get<Booking[]>("/bookings/");
        setBookings(response.data);
      } catch {
        setError("Failed to fetch bookings.");
      }
    };
    fetchBookings();
  }, []);

  return (
    <section className="space-y-4">
      <div className="space-y-1.5">
        <Eyebrow>Your trips</Eyebrow>
        <h2 className="text-h2 text-foreground">Bookings</h2>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {bookings.length > 0 ? (
        <Ledger>
          {bookings.map((booking) => (
            <div key={booking.id} className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {booking.car.make} {booking.car.model}
                </p>
                <p className="font-mono text-xs text-muted-foreground tabular-nums">
                  {booking.start_date} → {booking.end_date}
                </p>
              </div>
              <Badge variant="emerald" dot>
                Active
              </Badge>
            </div>
          ))}
        </Ledger>
      ) : (
        <p className="text-sm text-muted-foreground">No bookings found.</p>
      )}
    </section>
  );
};

export default UserBookings;
