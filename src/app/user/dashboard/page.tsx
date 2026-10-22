"use client";

import Link from "next/link";
import Breadcrumbs from "../../../components/Breadcrumbs";
import DashboardNav from "../../../components/DashboardNav";
import DrivingEvaluationPanel from "../../../components/DrivingEvaluationPanel";
import EmptyStateGuide from "../../../components/EmptyStateGuide";
import { useAuth } from "../../../context/AuthContext";
import {
  CURRENCIES,
  CurrencyCode,
  useCurrency,
} from "../../../context/CurrencyContext";
import { useOnboarding } from "../../../context/OnboardingContext";
import { useRequireAuth } from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";
import {
  INSURANCE_PLAN_OPTIONS,
  IZZAC_PRIVILEGE_TIERS,
} from "../../../lib/productContent";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";

const UserProfileDashboard = () => {
  const { isAuthenticated, isLoading } = useRequireAuth(
    "/login?next=/user/dashboard"
  );
  const { user, qualification } = useAuth();
  const { currency, setCurrency, formatPrice } = useCurrency();
  const { openOnboarding, startProductTour } = useOnboarding();

  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 md:py-12 space-y-8 animate-enter-subtle">
      <Breadcrumbs
        items={[
          { label: "My Garage & Dashboards", href: "/dashboard" },
          { label: "Account, KYC & Clearance Certificates" },
        ]}
      />

      <DashboardNav />

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-border/80">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="emerald">Account, KYC & Clearance Dossier</Badge>
            <Badge variant="secondary">
              Chauffeur Trial · Driving Test · Motor Insurance · Privilege Tier
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em]">
            Account profile, self-drive certificate & insurance dossier
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-[74ch]">
            Inspect your identity credentials, Chauffeur-Driven Trial completion record, Driving Test Evaluation score, Self-Drive Clearance Certificate, and active motor insurance coverage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button type="button" variant="outline" onClick={openOnboarding}>
            Onboarding Guide
          </Button>
          <Button type="button" variant="secondary" onClick={startProductTour}>
            Guided Product Tour
          </Button>
          <Button asChild>
            <Link href="/dashboard/bookings">Open Bookings Ledger</Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : !isAuthenticated ? (
        <EmptyStateGuide
          eyebrow="Authentication Required"
          title="Sign in to view your Account, KYC & Self-Drive Clearance Dossier"
          description="Your unified profile stores your Chauffeur-Driven Trial status, Driving Test Evaluation certificate, motor insurance policies, and Privilege rewards."
          primaryAction={{
            label: "Sign in to Account Dossier",
            href: "/login?next=/user/dashboard",
          }}
          secondaryAction={{
            label: "Create Account",
            href: "/signup",
          }}
          tips={[
            {
              title: "Digital Self-Drive Clearance Certificate",
              description:
                "Once you complete your Chauffeur Trial and score ≥80% on the Driving Test Evaluation, your certificate is stored here permanently.",
            },
            {
              title: "Verified Motor Insurance",
              description:
                "Compare Statutory Third-Party, Comprehensive Motor Insurance, and All-Risk Zero-Excess coverage tiers.",
            },
            {
              title: "Multi-Currency & Loyalty Controls",
              description:
                "Switch your active display currency and track your Izzac Privilege tier progression.",
            },
          ]}
        />
      ) : (
        <>
          {/* 12-Column Identity, Clearance Certificate & Currency Dossier */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <Card className="lg:col-span-4 p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="emerald">Verified Member Profile</Badge>
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    ID #{user?.id || "101"}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground tracking-[-0.02em]">
                    {user?.username || "Executive Member"}
                  </h2>
                  <p className="font-mono text-xs text-muted-foreground mt-1">
                    {user?.email || "member@izzac.com"}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-border/70 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Account Role:</span>
                    <span className="font-semibold text-foreground">
                      Unified Rider + Host
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Driver’s License:
                    </span>
                    <span className="font-semibold text-foreground">
                      {qualification.frsc_license_number || "Not yet verified"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">National ID:</span>
                    <span className="font-semibold text-foreground">
                      {qualification.nin_number
                        ? `•••••••${qualification.nin_number.slice(-4)}`
                        : "Not yet verified"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Driving Experience:
                    </span>
                    <span className="font-semibold text-foreground tabular-nums">
                      {qualification.years_experience} Years
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/70 space-y-2.5">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  Preferred Display Currency
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setCurrency(code)}
                      className={`rounded-lg border px-2.5 py-1.5 font-mono text-xs font-semibold transition-colors ${
                        currency === code
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-secondary/40 text-foreground hover:bg-secondary"
                      }`}
                    >
                      {CURRENCIES[code].label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Digital Self-Drive Clearance Certificate Card */}
            <div className="lg:col-span-8 rounded-2xl bg-[#0d1713] text-stone-100 p-6 md:p-8 border border-emerald-950 shadow-elevated flex flex-col justify-between space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="dark">
                    Digital Self-Drive Clearance Certificate
                  </Badge>
                  <Badge
                    variant={
                      qualification.self_drive_eligible ? "emerald" : "secondary"
                    }
                  >
                    {qualification.self_drive_eligible
                      ? "ACTIVE & VERIFIED ✓"
                      : "CHAUFFEUR TRIAL MODE"}
                  </Badge>
                </div>
                <span className="font-mono text-xs text-emerald-300 tabular-nums">
                  {qualification.clearance_certificate || "PENDING-EVALUATION"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-1">
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-stone-400">
                    Stage 01 · Chauffeur Trial
                  </p>
                  <p className="text-lg font-bold text-stone-50">
                    {qualification.chauffeur_trial_completed
                      ? "Completed ✓"
                      : "Pending Trial Trip"}
                  </p>
                  <p className="text-xs text-stone-300">
                    Mandatory trial period before Self-Drive evaluation.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-1">
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-stone-400">
                    Stage 02 · Driving Test Score
                  </p>
                  <p className="font-mono text-lg font-bold text-emerald-300 tabular-nums">
                    {qualification.driving_test_score}% (Pass ≥ 80%)
                  </p>
                  <p className="text-xs text-stone-300">
                    5-question Highway Code & Flood-Corridor assessment.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-1">
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-stone-400">
                    Stage 03 · Motor Insurance
                  </p>
                  <p className="text-lg font-bold text-stone-50">
                    NIID Active ✓
                  </p>
                  <p className="text-xs text-stone-300">
                    Third-Party, Comprehensive, or Zero-Excess All-Risk.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
                <p className="text-xs text-stone-300">
                  {qualification.self_drive_eligible
                    ? "Your account is cleared to book any vehicle in Evaluated Self-Drive or Chauffeur-Driven mode."
                    : "Complete Stage 01 & Stage 02 below to issue your Digital Self-Drive Clearance Certificate."}
                </p>
                <div className="flex items-center gap-2">
                  <Button asChild size="sm">
                    <a href="#evaluation">
                      {qualification.self_drive_eligible
                        ? "Review Evaluation"
                        : "Complete Evaluation Now"}
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-white/20 bg-white/5 text-stone-100 hover:bg-white/10"
                  >
                    <Link href="/cars">Browse Fleet →</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Motor Insurance Policy Comparison & Izzac Privilege Tiers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 rounded-2xl border border-border/90 bg-card p-6 space-y-5 shadow-surface">
              <div className="space-y-1">
                <Badge variant="emerald">Motor Insurance Schedule</Badge>
                <h2 className="text-xl font-bold text-foreground">
                  Verified Motor Insurance Policies Available at Checkout
                </h2>
                <p className="text-xs text-muted-foreground">
                  Every booking automatically issues a digital insurance certificate reference (`NIID-NG-2026-...`).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {INSURANCE_PLAN_OPTIONS.map((plan) => (
                  <div
                    key={plan.code}
                    className="rounded-xl border border-border/80 bg-secondary/25 p-4 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1">
                        <Badge variant="secondary">{plan.badge}</Badge>
                        <span className="font-mono text-xs font-bold text-primary tabular-nums">
                          {plan.dailyRateNgn === 0
                            ? "Included"
                            : `+${formatPrice(plan.dailyRateNgn)}/d`}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-foreground">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {plan.summary}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-border/60 font-mono text-[10px] text-muted-foreground space-y-0.5">
                      <p>Limit: {formatPrice(plan.coverageLimitNgn)}</p>
                      <p>{plan.underwriter}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-border/90 bg-card p-6 space-y-5 shadow-surface">
              <div className="space-y-1">
                <Badge variant="secondary">Izzac Privilege Program</Badge>
                <h2 className="text-xl font-bold text-foreground">
                  Executive Loyalty Tiers & Perks
                </h2>
                <p className="text-xs text-muted-foreground">
                  Automatic discounts and priority upgrades as you complete Chauffeur and Self-Drive bookings.
                </p>
              </div>

              <div className="space-y-3">
                {IZZAC_PRIVILEGE_TIERS.map((tier) => (
                  <div
                    key={tier.tier}
                    className="rounded-xl border border-border/80 bg-secondary/25 p-3.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">
                        {tier.tier}
                      </span>
                      <Badge variant="emerald">{tier.discount}</Badge>
                    </div>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {tier.threshold}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Driving Test & Chauffeur Trial Evaluation Panel */}
          <DrivingEvaluationPanel />
        </>
      )}
    </div>
  );
};

export default UserProfileDashboard;
