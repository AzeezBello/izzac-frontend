"use client";

import Link from "next/link";
import DashboardShell from "../../../components/DashboardShell";
import DrivingEvaluationPanel from "../../../components/DrivingEvaluationPanel";
import EmptyStateGuide from "../../../components/EmptyStateGuide";
import Loader from "../../../components/Loader";
import { useAuth } from "../../../context/AuthContext";
import { CURRENCIES, CurrencyCode, useCurrency } from "../../../context/CurrencyContext";
import { useOnboarding } from "../../../context/OnboardingContext";
import { useRequireAuth } from "../../../hooks/useAuth";
import { INSURANCE_PLAN_OPTIONS, IZZAC_PRIVILEGE_TIERS } from "../../../lib/productContent";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Eyebrow } from "../../../components/layout/Eyebrow";
import { InkPanel } from "../../../components/layout/InkPanel";
import { Stat } from "../../../components/layout/Stat";
import { cn } from "@/lib/utils";

const ProfileRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4 py-2.5 font-mono text-xs">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-right font-medium text-foreground tabular-nums">{value}</span>
  </div>
);

const UserProfileDashboard = () => {
  const { isAuthenticated, isLoading } = useRequireAuth("/login?next=/user/dashboard");
  const { user, qualification } = useAuth();
  const { currency, setCurrency, formatPrice } = useCurrency();
  const { openOnboarding, startProductTour } = useOnboarding();

  return (
    <DashboardShell
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Profile" }]}
      eyebrow="Account"
      title="Profile & certificates"
      description="Identity credentials, chauffeur trial record, driving test score, self-drive clearance and the insurance tiers available at checkout."
      actions={
        <>
          <Button type="button" variant="outline" onClick={openOnboarding}>
            Onboarding guide
          </Button>
          <Button type="button" variant="ghost" onClick={startProductTour}>
            Product tour
          </Button>
        </>
      }
    >
      {isLoading ? (
        <Loader label="Loading profile" />
      ) : !isAuthenticated ? (
        <EmptyStateGuide
          eyebrow="Sign in required"
          title="Sign in to view your profile"
          description="Your profile stores your trial status, driving test certificate, insurance options and loyalty tier."
          primaryAction={{ label: "Sign in", href: "/login?next=/user/dashboard" }}
          secondaryAction={{ label: "Create account", href: "/signup" }}
          tips={[
            { title: "Clearance certificate", description: "Issued once you complete the chauffeur trial and score 80%+ on the driving test." },
            { title: "Insurance tiers", description: "Compare third-party, comprehensive and all-risk zero-excess cover." },
            { title: "Currency & loyalty", description: "Switch display currency and track your Privilege tier." },
          ]}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
            <Card className="flex flex-col justify-between p-6 lg:col-span-4">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <Badge variant="emerald" dot>
                    Verified member
                  </Badge>
                  <span className="font-mono text-2xs text-muted-foreground tabular-nums">ID #{user?.id || "—"}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-[-0.025em] text-foreground">{user?.username || "Member"}</h2>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{user?.email || "—"}</p>
                </div>
                <div className="divide-y divide-border/70 border-t border-border/70">
                  <ProfileRow label="Role" value="Rider + host" />
                  <ProfileRow label="Driver's licence" value={qualification.frsc_license_number || "Not verified"} />
                  <ProfileRow
                    label="National ID"
                    value={qualification.nin_number ? `•••••••${qualification.nin_number.slice(-4)}` : "Not verified"}
                  />
                  <ProfileRow label="Experience" value={`${qualification.years_experience} yrs`} />
                </div>
              </div>

              <div className="mt-6 space-y-2.5 border-t border-border/70 pt-5">
                <p className="type-eyebrow text-muted-foreground">Display currency</p>
                <div className="grid grid-cols-4 gap-1 rounded-md border border-border bg-surface p-1" role="group" aria-label="Display currency">
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setCurrency(code)}
                      aria-pressed={currency === code}
                      className={cn(
                        "rounded-sm py-1.5 font-mono text-xs font-medium transition-colors duration-150",
                        currency === code ? "bg-ink text-ink-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            <InkPanel className="lg:col-span-8">
              <div className="flex h-full flex-col justify-between gap-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <Eyebrow tone="signal">Self-drive clearance certificate</Eyebrow>
                    <p className="font-mono text-2xl font-semibold tracking-tight tabular-nums text-ink-foreground md:text-3xl">
                      {qualification.clearance_certificate || "PENDING-EVALUATION"}
                    </p>
                  </div>
                  <Badge variant={qualification.self_drive_eligible ? "signal" : "dark"} dot>
                    {qualification.self_drive_eligible ? "Active & verified" : "Chauffeur trial mode"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-6 border-y border-white/10 py-6 sm:grid-cols-3 sm:divide-x sm:divide-white/10 sm:[&>*:not(:first-child)]:pl-6">
                  <Stat
                    inverted
                    size="sm"
                    label="01 · Chauffeur trial"
                    value={qualification.chauffeur_trial_completed ? "Complete" : "Pending"}
                    tone={qualification.chauffeur_trial_completed ? "signal" : "default"}
                    detail="Mandatory before evaluation"
                  />
                  <Stat
                    inverted
                    size="sm"
                    label="02 · Driving test"
                    value={`${qualification.driving_test_score}%`}
                    tone={qualification.driving_test_status === "passed" ? "signal" : "default"}
                    detail="Pass mark 80%"
                  />
                  <Stat inverted size="sm" label="03 · Motor insurance" value="NIID" tone="signal" detail="Verified on every trip" />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p className="max-w-[48ch] text-xs leading-relaxed text-ink-muted">
                    {qualification.self_drive_eligible
                      ? "Cleared to book any vehicle in self-drive or chauffeur-driven mode."
                      : "Complete stages one and two below to issue your certificate."}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button asChild size="sm">
                      <a href="#evaluation">{qualification.self_drive_eligible ? "Review evaluation" : "Complete evaluation"}</a>
                    </Button>
                    <Button asChild variant="inverse" size="sm">
                      <Link href="/cars">Browse fleet</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </InkPanel>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <section className="space-y-5 lg:col-span-7">
              <div className="space-y-2">
                <Eyebrow>Motor insurance</Eyebrow>
                <h2 className="text-h2 text-foreground">Policies available at checkout</h2>
                <p className="text-sm text-muted-foreground">Every booking issues a digital certificate reference.</p>
              </div>
              <div className="grid grid-cols-1 divide-y divide-border/70 border-y border-border/70 md:grid-cols-3 md:divide-x md:divide-y-0">
                {INSURANCE_PLAN_OPTIONS.map((plan) => (
                  <div key={plan.code} className="space-y-2 py-5 md:px-5 md:first:pl-0 md:last:pr-0">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant={plan.code === "comprehensive_shield" ? "emerald" : "secondary"}>{plan.badge}</Badge>
                      <span className="font-mono text-xs font-semibold text-primary tabular-nums">
                        {plan.dailyRateNgn === 0 ? "Included" : `+${formatPrice(plan.dailyRateNgn)}/d`}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-foreground">{plan.name}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">{plan.summary}</p>
                    <p className="font-mono text-2xs text-muted-foreground tabular-nums">
                      {plan.underwriter} · up to {formatPrice(plan.coverageLimitNgn)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-5 lg:col-span-5">
              <div className="space-y-2">
                <Eyebrow>Izzac Privilege</Eyebrow>
                <h2 className="text-h2 text-foreground">Loyalty tiers</h2>
                <p className="text-sm text-muted-foreground">Discounts and priority upgrades as you complete bookings.</p>
              </div>
              <div className="divide-y divide-border/70 border-y border-border/70">
                {IZZAC_PRIVILEGE_TIERS.map((tier, idx) => (
                  <div key={tier.tier} className="grid grid-cols-[2rem_1fr_auto] items-baseline gap-3 py-4">
                    <span className="font-mono text-xs text-primary tabular-nums">0{idx + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{tier.tier}</p>
                      <p className="font-mono text-2xs text-muted-foreground">{tier.threshold}</p>
                    </div>
                    <Badge variant="emerald">{tier.discount}</Badge>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <DrivingEvaluationPanel />
        </>
      )}
    </DashboardShell>
  );
};

export default UserProfileDashboard;
