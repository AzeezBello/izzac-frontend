"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import { getApiErrorMessage } from "../lib/errors";
import {
  AddonCode,
  BOOKING_ADDON_OPTIONS,
  PICKUP_MODE_OPTIONS,
  PickupModeCode,
  PROTECTION_PLAN_OPTIONS,
  ProtectionPlanCode,
  SERVICE_TYPE_OPTIONS,
  ServiceTypeCode,
} from "../lib/productContent";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

type BookCarFormProps = {
  carId: number;
  pricePerDay: number;
  defaultChauffeur?: boolean;
  hubAirport?: string;
};

const BookCarForm = ({
  carId,
  pricePerDay,
  defaultChauffeur = false,
  hubAirport,
}: BookCarFormProps) => {
  const { isAuthenticated } = useAuth();
  const { formatPrice } = useCurrency();
  const router = useRouter();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [serviceType, setServiceType] = useState<ServiceTypeCode>(
    defaultChauffeur ? "chauffeur" : "self_drive"
  );
  const [pickupMode, setPickupMode] = useState<PickupModeCode>("hub_station");
  const [protectionPlan, setProtectionPlan] =
    useState<ProtectionPlanCode>("medium");
  const [selectedAddons, setSelectedAddons] = useState<AddonCode[]>([]);
  const [flightOrNotes, setFlightOrNotes] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const toggleAddon = (code: AddonCode) => {
    setSelectedAddons((prev) =>
      prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code]
    );
  };

  const dayCount = useMemo(() => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days =
      Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return days > 0 ? days : null;
  }, [startDate, endDate]);

  const fareBreakdown = useMemo(() => {
    const days = dayCount || 1;
    const baseTotal = Number(pricePerDay) * days;
    const discountRate = days >= 30 ? 0.22 : days >= 7 ? 0.1 : 0;
    const discountedBase = Math.round(baseTotal * (1 - discountRate) * 100) / 100;
    const discountSavings = Math.round((baseTotal - discountedBase) * 100) / 100;

    const serviceObj =
      SERVICE_TYPE_OPTIONS.find((s) => s.code === serviceType) ||
      SERVICE_TYPE_OPTIONS[0];
    const serviceFee = serviceObj.dailyRateNgn * days;

    const pickupObj =
      PICKUP_MODE_OPTIONS.find((p) => p.code === pickupMode) ||
      PICKUP_MODE_OPTIONS[0];
    const pickupFee = pickupObj.flatFeeNgn;

    const protectionObj =
      PROTECTION_PLAN_OPTIONS.find((p) => p.code === protectionPlan) ||
      PROTECTION_PLAN_OPTIONS[0];
    const protectionFee = protectionObj.dailyRateNgn * days;

    let addonFee = 0;
    for (const code of selectedAddons) {
      const addon = BOOKING_ADDON_OPTIONS.find((a) => a.code === code);
      if (addon) {
        addonFee += addon.billing === "daily" ? addon.amountNgn * days : addon.amountNgn;
      }
    }

    const total =
      Math.round(
        (discountedBase + serviceFee + pickupFee + protectionFee + addonFee) *
          100
      ) / 100;

    return {
      days,
      baseTotal,
      discountRate,
      discountSavings,
      discountedBase,
      serviceFee,
      pickupFee,
      protectionFee,
      addonFee,
      total,
    };
  }, [
    dayCount,
    pricePerDay,
    serviceType,
    pickupMode,
    protectionPlan,
    selectedAddons,
  ]);

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
        service_type: serviceType,
        pickup_mode: pickupMode,
        protection_plan: protectionPlan,
        addons: selectedAddons,
        flight_or_notes: flightOrNotes.trim(),
      });
      setMessage(
        `Booking confirmed! Total ${formatPrice(data.total_price)} (${serviceType.replace("_", " ")})`
      );
    } catch (error: unknown) {
      setError(getApiErrorMessage(error, "Could not complete your booking."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-border/90 shadow-elevated">
      <CardHeader className="pb-4 border-b border-border/70">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <Badge variant="emerald" className="mb-1.5">
              Instant Mobility Configurator
            </Badge>
            <CardTitle className="text-lg">Reserve this vehicle</CardTitle>
          </div>
          <div className="text-right">
            <p className="font-mono text-lg font-bold text-primary tabular-nums">
              {formatPrice(pricePerDay)}{" "}
              <span className="font-sans text-xs font-normal text-muted-foreground">
                /day
              </span>
            </p>
            <p className="font-mono text-[10px] text-muted-foreground tabular-nums">
              -10% Weekly · -22% Monthly
            </p>
          </div>
        </div>
        <CardDescription>
          Configure trip dates, chauffeur/self-drive mode, Nigerian road protection, and airport or fuel extras.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-5">
        <form onSubmit={handleBooking} className="space-y-5">
          {/* Step 1: Trip Dates */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                01 · Rental Dates
              </span>
              {dayCount && dayCount >= 7 && (
                <Badge variant="emerald">
                  {dayCount >= 30
                    ? "22% Monthly SuperFlex Applied"
                    : "10% Weekly Saver Applied"}
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="start" className="text-xs">
                  Start date
                </Label>
                <Input
                  id="start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="font-mono text-xs tabular-nums"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="end" className="text-xs">
                  End date
                </Label>
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
          </div>

          {/* Step 2: Drive & Service Mode (Modern Web Guidance: child-state-based-styling) */}
          <fieldset className="space-y-2">
            <legend className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              02 · Drive & Service Mode
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SERVICE_TYPE_OPTIONS.map((option) => {
                const isSelected = serviceType === option.code;
                return (
                  <label
                    key={option.code}
                    className={`selectable-option-card ${
                      isSelected ? "is-active" : ""
                    } rounded-xl p-2.5 cursor-pointer flex items-start gap-2.5`}
                  >
                    <input
                      type="radio"
                      name="service_type"
                      value={option.code}
                      checked={isSelected}
                      onChange={() => setServiceType(option.code)}
                      className="option-control mt-0.5 h-3.5 w-3.5 shrink-0"
                    />
                    <div className="text-xs leading-snug">
                      <p className="font-semibold text-foreground">
                        {option.shortLabel}
                      </p>
                      <p className="font-mono text-[11px] text-primary tabular-nums">
                        {option.dailyRateNgn === 0
                          ? "Included"
                          : `+${formatPrice(option.dailyRateNgn)}/day`}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Step 3: Pickup / Airport / Delivery Mode */}
          <div className="space-y-1.5">
            <Label
              htmlFor="pickup-mode"
              className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
            >
              03 · Handover & Airport Logistics{" "}
              {hubAirport ? `(${hubAirport.split(" · ")[0]})` : ""}
            </Label>
            <select
              id="pickup-mode"
              value={pickupMode}
              onChange={(e) => setPickupMode(e.target.value as PickupModeCode)}
              className="w-full h-10 rounded-lg border border-input bg-card px-3 text-xs font-medium text-foreground shadow-surface focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {PICKUP_MODE_OPTIONS.map((mode) => (
                <option key={mode.code} value={mode.code}>
                  {mode.name} —{" "}
                  {mode.flatFeeNgn === 0
                    ? "Free Hub Pickup"
                    : `+${formatPrice(mode.flatFeeNgn)}`}
                </option>
              ))}
            </select>
          </div>

          {/* Step 4: Protection Package */}
          <fieldset className="space-y-2">
            <legend className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              04 · Nigerian Road & Liability Protection
            </legend>
            <div className="space-y-2">
              {PROTECTION_PLAN_OPTIONS.map((plan) => {
                const isSelected = protectionPlan === plan.code;
                return (
                  <label
                    key={plan.code}
                    className={`selectable-option-card ${
                      isSelected ? "is-active" : ""
                    } rounded-xl p-3 cursor-pointer flex items-start gap-2.5`}
                  >
                    <input
                      type="radio"
                      name="protection_plan"
                      value={plan.code}
                      checked={isSelected}
                      onChange={() => setProtectionPlan(plan.code)}
                      className="option-control mt-0.5 h-3.5 w-3.5 shrink-0"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-foreground">
                          {plan.name}
                        </span>
                        <span className="font-mono font-bold text-primary tabular-nums">
                          {plan.dailyRateNgn === 0
                            ? "Included"
                            : `+${formatPrice(plan.dailyRateNgn)}/day`}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                        {plan.summary}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Step 5: African Market Add-Ons */}
          <fieldset className="space-y-2">
            <legend className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              05 · Executive & Local Extras (Optional)
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {BOOKING_ADDON_OPTIONS.map((addon) => {
                const checked = selectedAddons.includes(addon.code);
                return (
                  <label
                    key={addon.code}
                    className={`selectable-option-card ${
                      checked ? "is-active" : ""
                    } rounded-xl p-2.5 cursor-pointer flex items-start gap-2`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAddon(addon.code)}
                      className="option-control mt-0.5 h-3.5 w-3.5 rounded shrink-0"
                    />
                    <div className="text-xs leading-tight">
                      <p className="font-semibold text-foreground">
                        {addon.name.split(" (")[0]}
                      </p>
                      <p className="font-mono text-[10px] text-primary mt-0.5 tabular-nums">
                        +{formatPrice(addon.amountNgn)}{" "}
                        {addon.billing === "daily" ? "/day" : "flat"}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Step 6: Flight Number / Corporate LPO Notes */}
          <div className="space-y-1">
            <Label htmlFor="flight-notes" className="text-xs">
              Flight number, delivery hotel, or corporate LPO ref (optional)
            </Label>
            <Input
              id="flight-notes"
              type="text"
              value={flightOrNotes}
              onChange={(e) => setFlightOrNotes(e.target.value)}
              placeholder="e.g. BA 075 arrival 18:40 / Eko Hotel VI"
              className="text-xs"
            />
          </div>

          {/* Itemized Fare Breakdown */}
          <div className="rounded-xl bg-secondary/75 px-4 py-3.5 space-y-2 animate-enter-subtle">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono tabular-nums">
              <span>
                Vehicle ({formatPrice(pricePerDay)} × {fareBreakdown.days}{" "}
                {fareBreakdown.days === 1 ? "day" : "days"})
              </span>
              <span>{formatPrice(fareBreakdown.baseTotal)}</span>
            </div>

            {fareBreakdown.discountSavings > 0 && (
              <div className="flex items-center justify-between text-xs text-primary font-mono font-semibold tabular-nums">
                <span>
                  Duration discount (-
                  {Math.round(fareBreakdown.discountRate * 100)}%)
                </span>
                <span>-{formatPrice(fareBreakdown.discountSavings)}</span>
              </div>
            )}

            {fareBreakdown.serviceFee > 0 && (
              <div className="flex items-center justify-between text-xs text-muted-foreground font-mono tabular-nums">
                <span>Drive / service mode ({fareBreakdown.days}d)</span>
                <span>+{formatPrice(fareBreakdown.serviceFee)}</span>
              </div>
            )}

            {fareBreakdown.pickupFee > 0 && (
              <div className="flex items-center justify-between text-xs text-muted-foreground font-mono tabular-nums">
                <span>Airport / delivery logistics</span>
                <span>+{formatPrice(fareBreakdown.pickupFee)}</span>
              </div>
            )}

            {fareBreakdown.protectionFee > 0 && (
              <div className="flex items-center justify-between text-xs text-muted-foreground font-mono tabular-nums">
                <span>Road & liability protection ({fareBreakdown.days}d)</span>
                <span>+{formatPrice(fareBreakdown.protectionFee)}</span>
              </div>
            )}

            {fareBreakdown.addonFee > 0 && (
              <div className="flex items-center justify-between text-xs text-muted-foreground font-mono tabular-nums">
                <span>Selected mobility extras ({selectedAddons.length})</span>
                <span>+{formatPrice(fareBreakdown.addonFee)}</span>
              </div>
            )}

            <Separator />
            <div className="flex items-center justify-between text-sm font-semibold text-foreground tabular-nums">
              <span>
                {dayCount ? "Estimated trip total" : "Estimated 1-day total"}
              </span>
              <span className="font-mono text-base font-bold text-primary">
                {formatPrice(fareBreakdown.total)}
              </span>
            </div>
          </div>

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
            {submitting
              ? "Confirming reservation..."
              : `Book now · ${formatPrice(fareBreakdown.total)}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookCarForm;
