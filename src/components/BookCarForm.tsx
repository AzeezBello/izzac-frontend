"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Select } from "./ui/select";
import { Card } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Eyebrow } from "./layout/Eyebrow";
import { OptionCard } from "./layout/OptionCard";
import { ArrowLink } from "./layout/ArrowLink";
import { cn } from "@/lib/utils";

type BookCarFormProps = {
  carId: number;
  pricePerDay: number;
  defaultChauffeur?: boolean;
  hubAirport?: string;
  /** ISO date (YYYY-MM-DD) prefilled from the quick search. */
  defaultStartDate?: string;
};

const Step = ({
  index,
  title,
  aside,
  children,
}: {
  index: string;
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="space-y-3 border-t border-border/70 pt-5 first:border-t-0 first:pt-0">
    <div className="flex items-center justify-between gap-3">
      <Eyebrow index={index} tone="default">
        {title}
      </Eyebrow>
      {aside}
    </div>
    {children}
  </div>
);

const ReceiptRow = ({
  label,
  amount,
  tone = "default",
}: {
  label: React.ReactNode;
  amount: React.ReactNode;
  tone?: "default" | "primary";
}) => (
  <div className="flex items-baseline justify-between gap-4 py-2 text-xs">
    <span className={cn(tone === "primary" ? "font-medium text-primary" : "text-muted-foreground")}>{label}</span>
    <span className={cn("font-mono tabular-nums", tone === "primary" ? "font-semibold text-primary" : "text-foreground")}>
      {amount}
    </span>
  </div>
);

const BookCarForm = ({ carId, pricePerDay, defaultChauffeur = true, hubAirport, defaultStartDate }: BookCarFormProps) => {
  const { isAuthenticated, qualification, markChauffeurTrialCompleted } = useAuth();
  const { formatPrice } = useCurrency();
  const router = useRouter();

  const [startDate, setStartDate] = useState(defaultStartDate ?? "");
  const [endDate, setEndDate] = useState("");
  // New users default to chauffeur mode for their mandatory trial period
  const [serviceType, setServiceType] = useState<ServiceTypeCode>(
    qualification.self_drive_eligible && !defaultChauffeur ? "self_drive" : "chauffeur"
  );
  const [pickupMode, setPickupMode] = useState<PickupModeCode>("hub_station");
  const [protectionPlan, setProtectionPlan] = useState<ProtectionPlanCode>("medium");
  const [insurancePlan, setInsurancePlan] = useState<InsurancePlanCode>("comprehensive_shield");
  const [selectedAddons, setSelectedAddons] = useState<AddonCode[]>([]);
  const [flightOrNotes, setFlightOrNotes] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Keep new users in chauffeur mode until self-drive qualification is unlocked
  useEffect(() => {
    if (!qualification.self_drive_eligible && serviceType === "self_drive") {
      setServiceType("chauffeur");
    }
  }, [qualification.self_drive_eligible, serviceType]);

  const toggleAddon = (code: AddonCode) => {
    setSelectedAddons((prev) => (prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code]));
  };

  const dayCount = useMemo(() => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return days > 0 ? days : null;
  }, [startDate, endDate]);

  const fareBreakdown = useMemo(() => {
    const days = dayCount || 1;
    const baseTotal = Number(pricePerDay) * days;
    const discountRate = days >= 30 ? 0.22 : days >= 7 ? 0.1 : 0;
    const discountedBase = Math.round(baseTotal * (1 - discountRate) * 100) / 100;
    const discountSavings = Math.round((baseTotal - discountedBase) * 100) / 100;

    const serviceObj = SERVICE_TYPE_OPTIONS.find((s) => s.code === serviceType) || SERVICE_TYPE_OPTIONS[0];
    const serviceFee = serviceObj.dailyRateNgn * days;

    const pickupObj = PICKUP_MODE_OPTIONS.find((p) => p.code === pickupMode) || PICKUP_MODE_OPTIONS[0];
    const pickupFee = pickupObj.flatFeeNgn;

    const protectionObj = PROTECTION_PLAN_OPTIONS.find((p) => p.code === protectionPlan) || PROTECTION_PLAN_OPTIONS[0];
    const protectionFee = protectionObj.dailyRateNgn * days;

    const insuranceObj = INSURANCE_PLAN_OPTIONS.find((i) => i.code === insurancePlan) || INSURANCE_PLAN_OPTIONS[0];
    const insuranceFee = insuranceObj.dailyRateNgn * days;

    let addonFee = 0;
    for (const code of selectedAddons) {
      const addon = BOOKING_ADDON_OPTIONS.find((a) => a.code === code);
      if (addon) {
        addonFee += addon.billing === "daily" ? addon.amountNgn * days : addon.amountNgn;
      }
    }

    const total =
      Math.round((discountedBase + serviceFee + pickupFee + protectionFee + insuranceFee + addonFee) * 100) / 100;

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
  }, [dayCount, pricePerDay, serviceType, pickupMode, protectionPlan, insurancePlan, selectedAddons]);

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
      Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
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

      if (serviceType === "chauffeur" || serviceType === "airport_transfer" || serviceType === "corporate_flex") {
        markChauffeurTrialCompleted();
      }

      const cert = data.insurance_certificate_ref || `NIID-NG-${new Date().getFullYear()}-${carId}`;
      setMessage(
        `Booking confirmed! Total ${formatPrice(data.total_price)} · Insurance Policy ${cert} (${
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

  const selfDriveLocked = !qualification.self_drive_eligible;

  return (
    <Card className="shadow-elevated">
      <div className="flex items-end justify-between gap-4 border-b border-border/70 p-6 pb-5">
        <div className="space-y-1">
          <Eyebrow tone="muted">Reserve</Eyebrow>
          <p className="font-mono text-2xl font-semibold tabular-nums tracking-tight text-foreground">
            {formatPrice(pricePerDay)}
            <span className="ml-1.5 font-sans text-sm font-normal text-muted-foreground">per day</span>
          </p>
        </div>
        <p className="font-mono text-2xs text-muted-foreground tabular-nums">−10% wk · −22% mo</p>
      </div>

      <form onSubmit={handleBooking} className="space-y-5 p-6">
        <Step
          index="01"
          title="Dates"
          aside={
            dayCount && dayCount >= 7 ? (
              <Badge variant="emerald">{dayCount >= 30 ? "SuperFlex −22%" : "Weekly −10%"}</Badge>
            ) : dayCount ? (
              <span className="font-mono text-2xs text-muted-foreground tabular-nums">
                {dayCount} {dayCount === 1 ? "day" : "days"}
              </span>
            ) : null
          }
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="start">Start</Label>
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
              <Label htmlFor="end">End</Label>
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
        </Step>

        <Step
          index="02"
          title="Drive mode"
          aside={
            <Badge variant={selfDriveLocked ? "amber" : "emerald"}>
              {selfDriveLocked ? "Chauffeur trial" : "Self-drive certified"}
            </Badge>
          }
        >
          {selfDriveLocked && (
            <Alert variant="info">
              <AlertDescription className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span>
                  New accounts start chauffeur-driven. Complete one trial trip, then pass the driving test to unlock self-drive.
                  <span className="ml-1.5 font-mono text-2xs text-muted-foreground tabular-nums">
                    {qualification.chauffeur_trial_completed ? "Step 1 of 2 done" : "Step 0 of 2"}
                  </span>
                </span>
                <ArrowLink href="/dashboard/rider#evaluation" size="sm">
                  {qualification.chauffeur_trial_completed ? "Take the driving test" : "Open trial & test centre"}
                </ArrowLink>
              </AlertDescription>
            </Alert>
          )}
          <fieldset className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <legend className="sr-only">Drive mode</legend>
            {SERVICE_TYPE_OPTIONS.map((option) => {
              const locked = option.code === "self_drive" && selfDriveLocked;
              return (
                <OptionCard
                  key={option.code}
                  kind="radio"
                  size="sm"
                  name="service_type"
                  value={option.code}
                  checked={serviceType === option.code}
                  disabled={locked}
                  onChange={() => handleSelectServiceType(option.code)}
                  title={option.shortLabel}
                  meta={
                    locked
                      ? "Locked"
                      : option.dailyRateNgn === 0
                      ? "Included"
                      : `+${formatPrice(option.dailyRateNgn)}/day`
                  }
                />
              );
            })}
          </fieldset>
        </Step>

        <Step index="03" title={`Handover${hubAirport ? ` · ${hubAirport.split(" · ")[0]}` : ""}`}>
          <Label htmlFor="pickup-mode" className="sr-only">
            Handover and airport logistics
          </Label>
          <Select id="pickup-mode" value={pickupMode} onChange={(e) => setPickupMode(e.target.value as PickupModeCode)}>
            {PICKUP_MODE_OPTIONS.map((mode) => (
              <option key={mode.code} value={mode.code}>
                {mode.name} — {mode.flatFeeNgn === 0 ? "Free hub pickup" : `+${formatPrice(mode.flatFeeNgn)}`}
              </option>
            ))}
          </Select>
        </Step>

        <Step
          index="04"
          title="Motor insurance"
          aside={<span className="font-mono text-2xs text-muted-foreground">NIID certificate issued</span>}
        >
          <fieldset className="space-y-2">
            <legend className="sr-only">Motor insurance policy</legend>
            {INSURANCE_PLAN_OPTIONS.map((ins) => (
              <OptionCard
                key={ins.code}
                kind="radio"
                name="insurance_plan"
                value={ins.code}
                checked={insurancePlan === ins.code}
                onChange={() => setInsurancePlan(ins.code)}
                title={ins.name}
                meta={ins.dailyRateNgn === 0 ? "Included" : `+${formatPrice(ins.dailyRateNgn)}/day`}
                description={
                  <>
                    <span className="font-mono tabular-nums">
                      {ins.underwriter} · up to {formatPrice(ins.coverageLimitNgn)}
                    </span>
                    <span className="block">{ins.summary}</span>
                  </>
                }
              />
            ))}
          </fieldset>
        </Step>

        <Step index="05" title="Road shield">
          <fieldset className="space-y-2">
            <legend className="sr-only">Road, pothole and standby protection</legend>
            {PROTECTION_PLAN_OPTIONS.map((plan) => (
              <OptionCard
                key={plan.code}
                kind="radio"
                name="protection_plan"
                value={plan.code}
                checked={protectionPlan === plan.code}
                onChange={() => setProtectionPlan(plan.code)}
                title={plan.name}
                meta={plan.dailyRateNgn === 0 ? "Included" : `+${formatPrice(plan.dailyRateNgn)}/day`}
                description={plan.summary}
              />
            ))}
          </fieldset>
        </Step>

        <Step index="06" title="Extras" aside={<span className="font-mono text-2xs text-muted-foreground">Optional</span>}>
          <fieldset className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <legend className="sr-only">Executive and local extras</legend>
            {BOOKING_ADDON_OPTIONS.map((addon) => (
              <OptionCard
                key={addon.code}
                kind="checkbox"
                size="sm"
                checked={selectedAddons.includes(addon.code)}
                onChange={() => toggleAddon(addon.code)}
                title={addon.name.split(" (")[0]}
                meta={`+${formatPrice(addon.amountNgn)} ${addon.billing === "daily" ? "/day" : "flat"}`}
              />
            ))}
          </fieldset>
        </Step>

        <Step index="07" title="Notes" aside={<span className="font-mono text-2xs text-muted-foreground">Optional</span>}>
          <Label htmlFor="flight-notes" className="sr-only">
            Flight number, delivery hotel, or corporate LPO reference
          </Label>
          <Input
            id="flight-notes"
            type="text"
            value={flightOrNotes}
            onChange={(e) => setFlightOrNotes(e.target.value)}
            placeholder="Flight number, hotel, or LPO ref — e.g. BA 075 arr. 18:40"
          />
        </Step>

        {/* Receipt */}
        <div className="animate-enter-subtle rounded-md border border-border/80 bg-surface px-4 py-2">
          <div className="divide-y divide-border/60">
            <ReceiptRow
              label={`Vehicle · ${formatPrice(pricePerDay)} × ${fareBreakdown.days} ${fareBreakdown.days === 1 ? "day" : "days"}`}
              amount={formatPrice(fareBreakdown.baseTotal)}
            />
            {fareBreakdown.discountSavings > 0 && (
              <ReceiptRow
                tone="primary"
                label={`Duration discount −${Math.round(fareBreakdown.discountRate * 100)}%`}
                amount={`−${formatPrice(fareBreakdown.discountSavings)}`}
              />
            )}
            {fareBreakdown.serviceFee > 0 && (
              <ReceiptRow label={`Drive mode · ${fareBreakdown.days}d`} amount={`+${formatPrice(fareBreakdown.serviceFee)}`} />
            )}
            {fareBreakdown.pickupFee > 0 && (
              <ReceiptRow label="Handover logistics" amount={`+${formatPrice(fareBreakdown.pickupFee)}`} />
            )}
            <ReceiptRow
              label={`Motor insurance · ${fareBreakdown.insuranceObj.badge}`}
              amount={fareBreakdown.insuranceFee === 0 ? "Included" : `+${formatPrice(fareBreakdown.insuranceFee)}`}
            />
            {fareBreakdown.protectionFee > 0 && (
              <ReceiptRow label={`Road shield · ${fareBreakdown.days}d`} amount={`+${formatPrice(fareBreakdown.protectionFee)}`} />
            )}
            {fareBreakdown.addonFee > 0 && (
              <ReceiptRow label={`Extras · ${selectedAddons.length}`} amount={`+${formatPrice(fareBreakdown.addonFee)}`} />
            )}
            <div className="flex items-baseline justify-between gap-4 py-3">
              <span className="text-sm font-medium text-foreground">
                {dayCount ? "Estimated total" : "Estimated 1-day total"}
              </span>
              <span className="font-mono text-lg font-semibold tabular-nums text-foreground">
                {formatPrice(fareBreakdown.total)}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {message && (
          <Alert variant="emerald">
            <AlertDescription className="font-medium">{message}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={submitting} size="lg" className="w-full">
          {submitting ? "Confirming reservation…" : `Book now · ${formatPrice(fareBreakdown.total)}`}
        </Button>
        {!isAuthenticated && (
          <p className="text-center font-mono text-2xs text-muted-foreground">You&apos;ll be asked to sign in before confirming.</p>
        )}
      </form>
    </Card>
  );
};

export default BookCarForm;
