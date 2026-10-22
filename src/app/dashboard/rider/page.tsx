"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../../lib/api";
import Breadcrumbs from "../../../components/Breadcrumbs";
import DashboardNav from "../../../components/DashboardNav";
import DrivingEvaluationPanel from "../../../components/DrivingEvaluationPanel";
import FallbackImage from "../../../components/FallbackImage";
import { useAuth } from "../../../context/AuthContext";
import { useCurrency } from "../../../context/CurrencyContext";
import { useRequireAuth } from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";
import { DETAILED_CAR_CATALOGUE, resolveCarImage } from "../../../lib/carCatalogue";
import { riderJourney } from "../../../lib/productContent";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";

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

const RiderDashboard = () => {
  const { isAuthenticated, isLoading } = useRequireAuth(
    "/login?next=/dashboard/rider"
  );
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

  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 md:py-12 space-y-8 animate-enter-subtle">
      <Breadcrumbs
        items={[
          { label: "My Garage & Dashboards", href: "/dashboard" },
          { label: "Rider & Driving Test Evaluation" },
        ]}
      />

      <DashboardNav />

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-border/80">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="emerald">Rider & Self-Drive Qualification Hub</Badge>
            <Badge variant="secondary">
              Chauffeur Trial → Driving Test → Self-Drive + Motor Insurance
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em]">
            Rider mobility & self-drive evaluation workspace
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-[74ch]">
            All new riders start with a Chauffeur-Driven Trial period before taking the License/ID Driving Test Evaluation to unlock Self-Drive. Every trip is backed by a verified motor insurance certificate.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button asChild variant="secondary">
            <a href="#evaluation">Take Driving Test Evaluation</a>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/bookings">Bookings & NIID Certificates</Link>
          </Button>
          <Button asChild>
            <Link href="/cars">Browse 32+ Cars</Link>
          </Button>
        </div>
      </div>

      {isLoading && <Loader />}

      {/* 4-Column Rider Qualification & Insurance KPI Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Stage 01 · Trial Period
            </span>
            <Badge
              variant={
                qualification.chauffeur_trial_completed ? "emerald" : "secondary"
              }
            >
              {qualification.chauffeur_trial_completed
                ? "Completed ✓"
                : "Mandatory First Step"}
            </Badge>
          </div>
          <p className="text-xl font-bold text-foreground">
            {qualification.chauffeur_trial_completed
              ? "Chauffeur Trial Verified"
              : "Chauffeur Trial Pending"}
          </p>
          <p className="text-xs text-muted-foreground">
            Complete 1 Chauffeur-Driven, Airport VIP, or Corporate trip to unlock Stage 02.
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Stage 02 · Driving Test
            </span>
            <Badge
              variant={
                qualification.driving_test_status === "passed"
                  ? "emerald"
                  : "secondary"
              }
            >
              {qualification.driving_test_status === "passed"
                ? `Passed (${qualification.driving_test_score}%)`
                : "80% Pass Required"}
            </Badge>
          </div>
          <p className="text-xl font-bold text-foreground">
            {qualification.driving_test_status === "passed"
              ? "Highway & Flood Exam Passed"
              : "5-Question Evaluation"}
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            License: {qualification.frsc_license_number || "Not yet submitted"}
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Stage 03 · Self-Drive Gate
            </span>
            <Badge
              variant={qualification.self_drive_eligible ? "emerald" : "outline"}
            >
              {qualification.self_drive_eligible
                ? "Unlocked ✓"
                : "Locked (Chauffeur Only)"}
            </Badge>
          </div>
          <p className="text-xl font-bold text-foreground">
            {qualification.self_drive_eligible
              ? "Self-Drive Active"
              : "Chauffeur Mode Active"}
          </p>
          <p className="font-mono text-xs text-primary">
            {qualification.clearance_certificate ||
              "Pass Stage 01 + 02 to issue certificate"}
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Motor Insurance
            </span>
            <Badge variant="emerald">NIID Verified</Badge>
          </div>
          <p className="text-xl font-bold text-foreground">
            {bookings.length} Insured{" "}
            {bookings.length === 1 ? "Trip" : "Trips"}
          </p>
          <p className="text-xs text-muted-foreground">
            Statutory Third-Party, Comprehensive, or All-Risk Zero-Excess + SRCC.
          </p>
        </Card>
      </div>

      {/* Main Interactive Chauffeur Trial, Driving Test & Motor Insurance Center */}
      <DrivingEvaluationPanel />

      {/* Flattened 4-column rider flow ledger */}
      <div className="rounded-2xl border border-border/90 bg-card shadow-surface overflow-hidden">
        <div className="px-6 py-4 border-b border-border/80 bg-secondary/40 flex items-center justify-between">
          <Badge variant="emerald">
            Rider Progression: Chauffeur Trial → Driving Test → Self-Drive
          </Badge>
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            01 — 04
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border/80">
          {riderJourney.map((step, index) => (
            <div key={step.title} className="p-6 space-y-2">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-primary tabular-nums">
                Step 0{index + 1}
              </p>
              <h2 className="text-base font-semibold text-foreground tracking-[-0.015em]">
                {step.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Rider Bookings & Recommended Vehicles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 rounded-2xl border border-border/90 bg-card p-6 space-y-4 shadow-surface">
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="emerald">Your Rider Trips</Badge>
              <h2 className="text-lg font-bold text-foreground mt-1">
                Active Bookings & NIID Policies ({bookings.length})
              </h2>
            </div>
            <Link
              href="/dashboard/bookings"
              className="font-mono text-xs font-semibold text-primary hover:underline"
            >
              Full Ledger →
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="rounded-xl border border-border/80 bg-secondary/35 p-4 space-y-3">
              <p className="text-sm font-semibold text-foreground">
                Start with a Chauffeur-Driven Trial Trip
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Select any vehicle on the right to book your Chauffeur-Driven Trial with verified Motor Insurance included.
              </p>
              <Button asChild size="sm">
                <Link href="/cars?service=Chauffeur+%26+Protocol">
                  Browse Chauffeur Trial Fleet →
                </Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border/70">
              {bookings.slice(0, 4).map((b) => (
                <div key={b.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      {b.car.make} {b.car.model}
                    </span>
                    <span className="font-mono text-xs font-bold text-primary tabular-nums">
                      {formatPrice(b.total_price)}
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
                    {b.start_date} → {b.end_date} ·{" "}
                    {INSURANCE_LABELS[b.insurance_plan || "comprehensive_shield"]}
                  </p>
                  {b.insurance_certificate_ref && (
                    <p className="font-mono text-[10px] text-primary">
                      NIID Cert: {b.insurance_certificate_ref}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Recommended Chauffeur Trial & Self-Drive Fleet
              </h2>
              <p className="text-xs text-muted-foreground">
                Ready for immediate Chauffeur-Driven Trial or Evaluated Self-Drive across Lagos, Abuja & PH.
              </p>
            </div>
            <Link
              href="/cars"
              className="font-mono text-xs font-semibold text-primary hover:underline"
            >
              All 32+ cars →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendedCars.map((car) => (
              <Link
                key={car.id}
                href={`/cars/${car.id}`}
                className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Card className="overflow-hidden h-full flex flex-col hover:-translate-y-0.5 hover:shadow-elevated">
                  <div className="relative aspect-[16/9] bg-secondary">
                    <FallbackImage
                      src={resolveCarImage(car)}
                      alt={`${car.year} ${car.make} ${car.model} in ${car.location}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                      <Badge
                        variant="emerald"
                        className="bg-card/90 backdrop-blur-sm"
                      >
                        {qualification.self_drive_eligible
                          ? "Self-Drive Ready"
                          : "Chauffeur Trial"}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary">
                        {car.make} {car.model}
                      </h3>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {car.location}
                      </p>
                    </div>
                    <span className="font-mono text-sm font-bold text-primary tabular-nums">
                      {formatPrice(car.price_per_day)}/d
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;
