"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../lib/errors";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";

type BookCarFormProps = {
  carId: number;
  pricePerDay: number;
};

const BookCarForm = ({ carId, pricePerDay }: BookCarFormProps) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const dayCount = useMemo(() => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days =
      Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return days > 0 ? days : null;
  }, [startDate, endDate]);

  const estimatedTotal = useMemo(() => {
    if (!dayCount) return null;
    return dayCount * Number(pricePerDay);
  }, [dayCount, pricePerDay]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push(`/login?next=/cars/${carId}`);
      return;
    }

    const days =
      Math.floor(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;
    if (days <= 0) {
      setError("End date must be after start date.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const { data } = await api.post("/bookings/", {
        car_id: carId,
        start_date: startDate,
        end_date: endDate,
      });
      setMessage(`Booking confirmed! Total $${data.total_price}`);
    } catch (error: unknown) {
      setError(getApiErrorMessage(error, "Could not complete your booking."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-border/90 shadow-elevated">
      <CardHeader className="pb-4">
        <div className="flex items-baseline justify-between gap-2">
          <CardTitle className="text-lg">Reserve this vehicle</CardTitle>
          <p className="font-mono text-lg font-bold text-primary tabular-nums">
            ${pricePerDay}{" "}
            <span className="font-sans text-xs font-normal text-muted-foreground">
              /day
            </span>
          </p>
        </div>
        <CardDescription>
          Select trip dates for instant fare calculation and confirmation.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleBooking} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="start">Start date</Label>
              <Input
                id="start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="font-mono text-xs tabular-nums"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="end">End date</Label>
              <Input
                id="end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="font-mono text-xs tabular-nums"
                required
              />
            </div>
          </div>

          {estimatedTotal && dayCount && (
            <div className="rounded-xl bg-secondary/70 px-4 py-3 space-y-2 animate-enter-subtle">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-mono tabular-nums">
                <span>
                  ${pricePerDay} × {dayCount} {dayCount === 1 ? "day" : "days"}
                </span>
                <span>${estimatedTotal}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm font-semibold text-foreground tabular-nums">
                <span>Estimated total</span>
                <span className="font-mono text-primary">${estimatedTotal}</span>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert variant="emerald">
              <AlertDescription className="font-semibold text-primary">
                {message}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={submitting}
            size="lg"
            className="w-full"
          >
            {submitting ? "Booking..." : "Book now"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookCarForm;
