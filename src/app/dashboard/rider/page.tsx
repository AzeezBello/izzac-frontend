"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../../lib/api";
import DashboardShell from "../../../components/DashboardShell";
import DrivingEvaluationPanel from "../../../components/DrivingEvaluationPanel";
import Loader from "../../../components/Loader";
import VehicleCard from "../../../components/VehicleCard";
import { useAuth } from "../../../context/AuthContext";
import { useCurrency } from "../../../context/CurrencyContext";
import { useRequireAuth } from "../../../hooks/useAuth";
import { DETAILED_CAR_CATALOGUE } from "../../../lib/carCatalogue";
import { riderJourney } from "../../../lib/productContent";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { ArrowLink, Eyebrow, Ledger } from "../../../components/layout";
import { cn } from "@/lib/utils";

type RiderBooking = {
  id: number;
  start_date: string;
  end_date: string;
  total_price: string;
  status: string;
  service_type?: string;
  insurance_plan?: string;
  insurance_certificate_ref?: string;
  car: {
    id: number;
    make: string;
    model: string;
    location: string;
    image: string;
  };
};

const INSURANCE_LABELS: Record<string, string> = {
  third_party_niid: "Statutory Third-Party (NIID)",
  comprehensive_shield: "Comprehensive Motor Insurance",
  zero_excess_all_risk: "All-Risk Zero-Excess + SRCC",
};

type StepState = "done" | "current" | "locked";

const stateBadge: Record<StepState, { variant: "emerald" | "amber" | "secondary"; label: string }> = {
  done: { variant: "emerald", label: "Done" },
  current: { variant: "amber", label: "Current" },
  locked: { variant: "secondary", label: "Locked" },
};

const RiderDashboard = () => {
  const { isAuthenticated, isLoading } = useRequireAuth("/login?next=/dashboard/rider");
  const { qualification } = useAuth();
  const { formatPrice } = useCurrency();
  const [bookings, setBookings] = useState<RiderBooking[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    api
      .get("/bookings/")
      .then(({ data }) => setBookings(data || []))
      .catch(() => setBookings([]));
  }, [isAuthenticated]);

  const recommendedCars = DETAILED_CAR_CATALOGUE.slice(0, 4);

  const trialState: StepState = qualification.chauffeur_trial_completed ? "done" : "current";
  const testState: StepState =
    qualification.driving_test_status === "passed" ? "done" : qualification.chauffeur_trial_completed ? "current" : "locked";
  const selfDriveState: StepState = qualification.self_drive_eligible ? "done" : "locked";

  const steps: { index: string; eyebrow: string; title: string; detail: string; state: StepState }[] = [
    {
      index: "01",
      eyebrow: "Chauffeur trial",
      title: qualification.chauffeur_trial_completed ? "Trial completed" : "Trial pending",
      detail: "One chauffeur-driven, airport VIP or corporate trip unlocks the test.",
      state: trialState,
    },
    {
      index: "02",
      eyebrow: "Driving test",
      title:
        qualification.driving_test_status === "passed"
          ? `Passed at ${qualification.driving_test_score}%`
          : "5 questions · 80% to pass",
      detail: qualification.frsc_license_number
        ? `License ${qualification.frsc_license_number}`
        : "License and 11-digit ID verified on submission.",
      state: testState,
    },
    {
      index: "03",
      eyebrow: "Self-drive",
      title: qualification.self_drive_eligible ? "Self-drive unlocked" : "Chauffeur mode",
      detail: qualification.clearance_certificate || "Certificate issued after steps 01 and 02.",
      state: selfDriveState,
    },
  ];

  return (
    <DashboardShell
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Rider & driving test" }]}
      eyebrow="Rider"
      title="Rider & driving test"
      description="New riders start with a chauffeur-driven trial, then pass the driving test at 80% to unlock self-drive. Every trip carries a verified NIID insurance certificate."
      actions={
        <>
          <Button asChild variant="outline">
            <a href="#evaluation">Take the driving test</a>
          </Button>
          <Button asChild>
            <Link href="/cars">Browse the fleet</Link>
          </Button>
        </>
      }
    >
      {isLoading && <Loader />}

      {/* 3-step progress rail */}
      <ol className="grid grid-cols-1 divide-y divide-border/70 border-y border-border/70 md:grid-cols-3 md:divide-x md:divide-y-0">
        {steps.map((step) => {
          const badge = stateBadge[step.state];
          return (
            <li
              key={step.index}
              aria-current={step.state === "current" ? "step" : undefined}
              className={cn("space-y-2.5 px-0 py-5 md:px-6 md:first:pl-0 md:last:pr-0", step.state === "locked" && "opacity-70")}
            >
              <div className="flex items-center justify-between gap-3">
                <Eyebrow index={step.index} tone={step.state === "done" ? "primary" : "muted"}>
                  {step.eyebrow}
                </Eyebrow>
                <Badge variant={badge.variant}>{badge.label}</Badge>
              </div>
              <p className="text-h3 text-foreground">{step.title}</p>
              <p className="font-mono text-2xs tabular-nums text-muted-foreground">{step.detail}</p>
            </li>
          );
        })}
      </ol>

      <DrivingEvaluationPanel />

      {/* Rider journey */}
      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1.5">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="text-h2 text-foreground">From chauffeur trial to self-drive</h2>
          </div>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">01 — 04</span>
        </div>
        <ol className="grid grid-cols-1 divide-y divide-border/70 border-y border-border/70 md:grid-cols-2 md:divide-x xl:grid-cols-4 md:divide-y-0 md:[&>li:nth-child(2n)]:border-r-0 xl:[&>li:nth-child(2n)]:border-r">
          {riderJourney.map((step, index) => (
            <li key={step.title} className="space-y-2 py-5 md:px-6 md:first:pl-0 xl:last:pr-0">
              <span className="font-mono text-2xs tabular-nums text-primary">0{index + 1}</span>
              <h3 className="text-base font-medium tracking-[-0.015em] text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Bookings + recommended */}
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
        <section className="space-y-4 lg:col-span-5">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-1.5">
              <Eyebrow>Your trips</Eyebrow>
              <h2 className="text-h3 text-foreground">
                Bookings <span className="font-mono text-sm font-normal tabular-nums text-muted-foreground">({bookings.length})</span>
              </h2>
            </div>
            <ArrowLink href="/dashboard/bookings" size="sm">
              Full list
            </ArrowLink>
          </div>

          {bookings.length === 0 ? (
            <div className="space-y-3 rounded-lg border border-dashed border-border bg-surface/60 p-5">
              <p className="text-sm font-medium text-foreground">Start with a chauffeur-driven trial.</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Pick any vehicle on the right. Your first booking is chauffeured and includes verified motor insurance.
              </p>
              <Button asChild size="sm">
                <Link href="/cars?service=Chauffeur+%26+Protocol">Browse chauffeur fleet</Link>
              </Button>
            </div>
          ) : (
            <Ledger>
              {bookings.slice(0, 4).map((b) => (
                <div key={b.id} className="space-y-1 py-3.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-medium text-foreground">
                      {b.car.make} {b.car.model}
                    </span>
                    <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-foreground">
                      {formatPrice(b.total_price)}
                    </span>
                  </div>
                  <p className="font-mono text-2xs tabular-nums text-muted-foreground">
                    {b.start_date} → {b.end_date} · {INSURANCE_LABELS[b.insurance_plan || "comprehensive_shield"]}
                  </p>
                  {b.insurance_certificate_ref && (
                    <p className="font-mono text-2xs tabular-nums text-primary">NIID {b.insurance_certificate_ref}</p>
                  )}
                </div>
              ))}
            </Ledger>
          )}
        </section>

        <section className="space-y-4 lg:col-span-7">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-1.5">
              <Eyebrow>Recommended</Eyebrow>
              <h2 className="text-h3 text-foreground">
                {qualification.self_drive_eligible ? "Ready for self-drive" : "Ready for your chauffeur trial"}
              </h2>
            </div>
            <ArrowLink href="/cars" size="sm">
              All vehicles
            </ArrowLink>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {recommendedCars.map((car) => (
              <VehicleCard
                key={car.id}
                car={car}
                footer={qualification.self_drive_eligible ? "Self-drive ready →" : "Chauffeur trial →"}
              />
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
};

export default RiderDashboard;
