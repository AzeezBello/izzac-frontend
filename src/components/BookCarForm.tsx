"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import { getApiErrorMessage } from "../lib/errors";
import {
  AddonCode,
  BOOKING_ADDON_OPTIONS,
  INSURANCE_PLAN_OPTIONS,
  InsurancePlanCode,
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
import { Tooltip } from "./ui/tooltip";

type BookCarFormProps = {
  carId: number;
  pricePerDay: number;
  defaultChauffeur?: boolean;
  hubAirport?: string;
};

const BookCarForm = ({
  carId,
  pricePerDay,
  defaultChauffeur = true,
  hubAirport,
}: BookCarFormProps) => {
  const { isAuthenticated, qualification, markChauffeurTrialCompleted } =
    useAuth();
  const { formatPrice } = useCurrency();
  const router = useRouter();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // New users default to Chauffeur-Driven mode for their mandatory trial period
  const [serviceType, setServiceType] = useState<ServiceTypeCode>(
    qualification.self_drive_eligible && !defaultChauffeur
      ? "self_drive"
      : "chauffeur"
  );
  const [pickupMode, setPickupMode] = useState<PickupModeCode>("hub_station");
  const [protectionPlan, setProtectionPlan] =
    useState<ProtectionPlanCode>("medium");
  const [insurancePlan, setInsurancePlan] = useState<InsurancePlanCode>(
    "comprehensive_shield"
  );
  const [selectedAddons, setSelectedAddons] = useState<AddonCode[]>([]);
  const [flightOrNotes, setFlightOrNotes] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Keep new users in Chauffeur-Driven mode until Self-Drive qualification is unlocked
  useEffect(() => {
    if (!qualification.self_drive_eligible && serviceType === "self_drive") {
      setServiceType("chauffeur");
    }
  }, [qualification.self_drive_eligible, serviceType]);

  const toggleAddon = (code: AddonCode) => {
    setSelectedAddons((prev) =>
      prev.includes(code)
        ? prev.filter((item) => item !== code)
        : [...prev, code]
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
    const discountedBase =
      Math.round(baseTotal * (1 - discountRate) * 100) / 100;
    const discountSavings =
      Math.round((baseTotal - discountedBase) * 100) / 100;

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

    const insuranceObj =
      INSURANCE_PLAN_OPTIONS.find((i) => i.code === insurancePlan) ||
      INSURANCE_PLAN_OPTIONS[0];
    const insuranceFee = insuranceObj.dailyRateNgn * days;

    let addonFee = 0;
    for (const code of selectedAddons) {
      const addon = BOOKING_ADDON_OPTIONS.find((a) => a.code === code);
      if (addon) {
        addonFee +=
          addon.billing === "daily" ? addon.amountNgn * days : addon.amountNgn;
      }
    }

    const total =
      Math.round(
        (discountedBase +
          serviceFee +
          pickupFee +
          protectionFee +
          insuranceFee +
          addonFee) *
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
      insuranceFee,
      insuranceObj,
      addonFee,
      total,
    };
  }, [
    dayCount,
    pricePerDay,
    serviceType,
    pickupMode,
    protectionPlan,
    insurancePlan,
    selectedAddons,
  ]);

  const handleSelectServiceType = (code: ServiceTypeCode) => {
    if (code === "self_drive" && !qualification.self_drive_eligible) {
      setError(
        "New User Policy: You must complete a Chauffeur-Driven trial period and pass the FRSC/NIN Driving Test Evaluation before selecting Self-Drive."
      );
      setServiceType("chauffeur");
      return;
    }
    setError(null);
    setServiceType(code);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push(`/login?next=/cars/${carId}`);
      return;
    }

    if (serviceType === "self_drive" && !qualification.self_drive_eligible) {
      setError(
        "Self-Drive Locked: Please complete your Chauffeur-Driven trial booking first, then pass the Driving Test Evaluation."
      );
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
        insurance_plan: insurancePlan,
        addons: selectedAddons,
        flight_or_notes: flightOrNotes.trim(),
      });

      if (
        serviceType === "chauffeur" ||
        serviceType === "airport_transfer" ||
        serviceType === "corporate_flex"
      ) {
        markChauffeurTrialCompleted();
      }

      const cert =
        data.insurance_certificate_ref ||
        `NIID-NG-${new Date().getFullYear()}-${carId}`;
      setMessage(
        `Booking confirmed! Total ${formatPrice(
          data.total_price
        )} · Insurance Policy ${cert} (${
          serviceType === "chauffeur"
            ? "Chauffeur Trial Completed — You can now take the Driving Test Evaluation!"
            : serviceType.replace("_", " ")
        })`
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
              Instant Mobility & Insurance Configurator
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
          Configure trip dates, chauffeur trial or evaluated self-drive mode, NAICOM/NIID motor insurance, and road protection.
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

          {/* Step 2: Drive & Service Mode (Enforces Chauffeur Trial before Self-Drive Evaluation) */}
          <fieldset className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <legend className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                02 · Drive Mode (Chauffeur Trial vs. Evaluated Self-Drive)
              </legend>
              <Badge
                variant={
                  qualification.self_drive_eligible ? "emerald" : "secondary"
                }
              >
                {qualification.self_drive_eligible
                  ? "Self-Drive Certified ✓"
                  : "Chauffeur Trial Active"}
              </Badge>
            </div>

            {!qualification.self_drive_eligible && (
              <div className="rounded-xl border border-emerald-900/25 bg-[#0d1713] p-3.5 text-xs text-stone-200 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-300">
                    New User Self-Drive Policy
                  </span>
                  <span className="font-mono text-[10px] text-stone-400 tabular-nums">
                    {qualification.chauffeur_trial_completed
                      ? "Step 1/2 Done · Take Driving Test"
                      : "Step 0/2 · Trial Required"}
                  </span>
                </div>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  New accounts must complete a{" "}
                  <strong className="text-stone-100">
                    Chauffeur-Driven trial period
                  </strong>{" "}
                  first, then pass the{" "}
                  <strong className="text-stone-100">
                    5-question FRSC/NIN Driving Test Evaluation
                  </strong>{" "}
                  to unlock Self-Drive.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <Link
                    href="/dashboard/rider#evaluation"
                    className="rounded-md bg-primary px-2.5 py-1 font-mono text-[11px] font-semibold text-primary-foreground hover:bg-emerald-700 transition-colors"
                  >
                    {qualification.chauffeur_trial_completed
                      ? "Take Driving Test Evaluation →"
                      : "Open Trial & Driving Test Center →"}
                  </Link>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SERVICE_TYPE_OPTIONS.map((option) => {
                const isSelfDriveLocked =
                  option.code === "self_drive" &&
                  !qualification.self_drive_eligible;
                const isSelected = serviceType === option.code;
                return (
                  <label
                    key={option.code}
                    className={`selectable-option-card ${
                      isSelected ? "is-active" : ""
                    } ${
                      isSelfDriveLocked ? "opacity-75" : ""
                    } rounded-xl p-2.5 cursor-pointer flex items-start gap-2.5`}
                  >
                    <input
                      type="radio"
                      name="service_type"
                      value={option.code}
                      checked={isSelected}
                      onChange={() => handleSelectServiceType(option.code)}
                      className="option-control mt-0.5 h-3.5 w-3.5 shrink-0"
                    />
                    <div className="text-xs leading-snug flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="font-semibold text-foreground">
                          {option.shortLabel}
                        </p>
                        {option.code === "self_drive" && (
                          <span className="font-mono text-[10px] font-semibold text-primary">
                            {qualification.self_drive_eligible
                              ? "Unlocked ✓"
                              : "Requires Trial + Test"}
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-[11px] text-primary tabular-nums">
                        {option.dailyRateNgn === 0
                          ? "Included after evaluation"
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

          {/* Step 4: Mandatory NAICOM / NIID Motor Insurance */}
          <fieldset className="space-y-2">
            <div className="flex items-center justify-between">
              <legend className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                04 · Motor Insurance Policy (NAICOM / NIID Verified)
              </legend>
              <Tooltip content="Every booking issues a verifiable NIID motor insurance certificate">
                <span className="font-mono text-[10px] font-semibold text-primary cursor-help">
                  NIID Certificate Included ⓘ
                </span>
              </Tooltip>
            </div>
            <div className="space-y-2">
              {INSURANCE_PLAN_OPTIONS.map((ins) => {
                const isSelected = insurancePlan === ins.code;
                return (
                  <label
                    key={ins.code}
                    className={`selectable-option-card ${
                      isSelected ? "is-active" : ""
                    } rounded-xl p-3 cursor-pointer flex items-start gap-2.5`}
                  >
                    <input
                      type="radio"
                      name="insurance_plan"
                      value={ins.code}
                      checked={isSelected}
                      onChange={() => setInsurancePlan(ins.code)}
                      className="option-control mt-0.5 h-3.5 w-3.5 shrink-0"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-foreground">
                          {ins.name}
                        </span>
                        <span className="font-mono font-bold text-primary tabular-nums shrink-0">
                          {ins.dailyRateNgn === 0
                            ? "Included"
                            : `+${formatPrice(ins.dailyRateNgn)}/day`}
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-muted-foreground mt-0.5 tabular-nums">
                        {ins.underwriter} · Up to{" "}
                        {formatPrice(ins.coverageLimitNgn)} cover
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                        {ins.summary}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Step 5: Road & Tyre Protection Package */}
          <fieldset className="space-y-2">
            <legend className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              05 · Road, Pothole & Standby Relief Shield
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

          {/* Step 6: Executive Add-Ons */}
          <fieldset className="space-y-2">
            <legend className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              06 · Executive & Local Extras (Optional)
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

          {/* Step 7: Flight Number / Corporate LPO Notes */}
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

            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono tabular-nums">
              <span>
                Motor insurance ({fareBreakdown.insuranceObj.badge})
              </span>
              <span>
                {fareBreakdown.insuranceFee === 0
                  ? "Included"
                  : `+${formatPrice(fareBreakdown.insuranceFee)}`}
              </span>
            </div>

            {fareBreakdown.protectionFee > 0 && (
              <div className="flex items-center justify-between text-xs text-muted-foreground font-mono tabular-nums">
                <span>Road & tyre shield ({fareBreakdown.days}d)</span>
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
              ? "Confirming reservation & NIID insurance..."
              : `Book now · ${formatPrice(fareBreakdown.total)}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookCarForm;
