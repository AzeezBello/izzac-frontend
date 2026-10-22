"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../../context/AuthContext";
import { hostFeatureCards, hostJourney } from "../../../lib/productContent";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";

const bentoSpans = [
  "md:col-span-7",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-7",
];

const ListCarPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const primaryHref =
    !isLoading && isAuthenticated ? "/dashboard/add-car" : "/signup?role=host";
  const primaryLabel =
    !isLoading && isAuthenticated ? "Go to add car" : "Create host account";

  return (
    <div className="bg-background">
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-12 pb-14 md:pt-16 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            <Badge variant="emerald">List a car</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-[-0.035em] leading-[1.08]">
              Launch your listing with the same tools hosts use across the full app.
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-[60ch] leading-relaxed">
              This page acts as the public entry to hosting: it explains listing creation, garage management,
              and host-side bookings before sending you into the protected add-car flow.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild size="lg">
                <Link href={primaryHref}>{primaryLabel}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/host">Explore host features</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-2.5 shadow-elevated">
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src="/images/feature3.webp"
                  alt="Host handing over vehicle key fob to an executive rider"
                  width={1600}
                  height={1000}
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  priority
                  fetchPriority="high"
                  className="w-full h-72 md:h-80 object-cover transition-transform duration-500 ease-out-expo hover:scale-[1.02]"
                />
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-lg border border-white/15 bg-[#0d1713]/85 px-3.5 py-2.5 text-xs text-stone-100 backdrop-blur-md">
                  <span className="font-mono uppercase tracking-[0.14em] text-emerald-300">
                    Direct host handover
                  </span>
                  <span className="font-mono tabular-nums text-stone-200">
                    Instant Publishing
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Taste-Skill: Asymmetric 12-col Bento Grid */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {hostFeatureCards.map((feature, index) => (
            <Card
              key={feature.title}
              className={`${bentoSpans[index % bentoSpans.length]} p-6 md:p-7 flex flex-col justify-between hover:border-stone-300 hover:shadow-elevated stagger-item`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{feature.eyebrow}</Badge>
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    0{index + 1}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-foreground tracking-[-0.02em] pt-1">
                  {feature.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[54ch]">
                  {feature.description}
                </p>
              </div>
              <div className="pt-5">
                <Link
                  href={feature.href}
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-emerald-900 transition-colors duration-150"
                >
                  <span>{feature.cta}</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-150 ease-out-quart group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Impeccable: Flattened architectural dark ledger (no card-in-card nesting) */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-16">
        <div className="rounded-2xl bg-[#0d1713] text-stone-100 p-7 md:p-10 border border-emerald-950 shadow-elevated">
          <div className="space-y-2 pb-8 border-b border-white/10">
            <Badge variant="dark">Host journey</Badge>
            <h2 className="text-2xl md:text-3xl font-bold tracking-[-0.03em] text-stone-50 pt-1">
              What happens after you decide to list
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10 pt-6">
            {hostJourney.map((step, index) => (
              <div
                key={step.title}
                className="py-5 md:py-2 md:px-6 first:pt-0 md:first:pl-0 last:pb-0 md:last:pr-0 space-y-2"
              >
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300 tabular-nums">
                  Step {index + 1}
                </p>
                <h3 className="text-lg font-semibold text-stone-50 tracking-[-0.015em]">
                  {step.title}
                </h3>
                <p className="text-sm text-stone-300/90 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
        <div className="rounded-2xl border border-border/90 bg-secondary/50 p-7 md:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-[-0.025em]">
              Ready to move from interest to inventory?
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              If you are signed in, head straight to the add-car page. If not, create a host account first and then publish your listing.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button asChild size="lg">
              <Link href={primaryHref}>{primaryLabel}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard/bookings">See host bookings</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ListCarPage;
