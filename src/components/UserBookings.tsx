"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";

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
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Failed to fetch bookings.");
      }
    };
    fetchBookings();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Your Bookings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {bookings.length > 0 ? (
          <ul className="divide-y divide-border/80">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <div>
                  <p className="font-semibold text-foreground">
                    Car: {booking.car.make} {booking.car.model}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground tabular-nums">
                    Start Date: {booking.start_date} · End Date: {booking.end_date}
                  </p>
                </div>
                <Badge variant="emerald">Active</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No bookings found.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default UserBookings;
