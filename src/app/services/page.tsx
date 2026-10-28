"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "../../components/Breadcrumbs";
import DrivingEvaluationPanel from "../../components/DrivingEvaluationPanel";
import { Reveal } from "../../components/motion/Reveal";
import { useCurrency } from "../../context/CurrencyContext";
import { SITE_NAME, SITE_URL } from "../../lib/seo";
import {
  AFRICAN_REGIONAL_HUBS,
  BOOKING_ADDON_OPTIONS,
  EUROPCAR_COMPETITOR_BENCHMARK,
  INSURANCE_PLAN_OPTIONS,
  IZZAC_PRIVILEGE_TIERS,
  PROTECTION_PLAN_OPTIONS,
  SERVICE_PILLARS,
} from "../../lib/productContent";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  ArrowLink,
  Chip,
  Container,
  Eyebrow,
  InkPanel,
  Ledger,
  LedgerRow,
  OptionCard,
  Section,
  SectionHeading,
  Stat,
  StatStrip,
} from "../../components/layout";
import { cn, pad } from "@/lib/utils";

const FLEET_BENCHMARK_TIERS = [
  { id: "commuter", label: "City commuter", example: "Corolla · Civic", dailyRateNgn: 78000, href: "/cars?category=City+Commuter" },
  { id: "sedan", label: "Executive sedan", example: "C300 · ES 350", dailyRateNgn: 165000, href: "/cars?category=Executive+Sedan" },
  { id: "pickup", label: "Field 4x4 & shuttle", example: "Hilux · Ranger", dailyRateNgn: 135000, href: "/cars?category=Pickup+%26+Shuttle" },
  { id: "suv", label: "Luxury & escort SUV", example: "Prado · GLE 450 · LC300", dailyRateNgn: 260000, href: "/cars?category=Luxury+SUV" },
];

const DURATION_PRESETS = [
  { days: 3, label: "Short term", discountPct: 0 },
  { days: 7, label: "Weekly saver", discountPct: 10 },
  { days: 30, label: "Monthly SuperFlex", discountPct: 22 },
  { days: 90, label: "Quarterly", discountPct: 22 },
];

const PAGE_NAV = [
  { href: "#pillars", label: "Services" },
  { href: "#calculator", label: "Calculator" },
  { href: "#insurance", label: "Insurance" },
  { href: "#protection", label: "Protection" },
  { href: "#benchmark", label: "Compare" },
  { href: "#hubs", label: "Hubs" },
];

const ServicesPage = () => {
  const { formatPrice } = useCurrency();
  const [selectedTierId, setSelectedTierId] = useState("sedan");
  const [selectedDays, setSelectedDays] = useState(30);
  const [withChauffeur, setWithChauffeur] = useState(true);
  const [withRoadShield, setWithRoadShield] = useState(true);
  const [fleetCount, setFleetCount] = useState(1);

  const activeTier = useMemo(
    () => FLEET_BENCHMARK_TIERS.find((t) => t.id === selectedTierId) || FLEET_BENCHMARK_TIERS[1],
    [selectedTierId]
  );

  const estimate = useMemo(() => {
    const rawVehicleTotal = activeTier.dailyRateNgn * selectedDays * fleetCount;
    const discountRate = selectedDays >= 30 ? 0.22 : selectedDays >= 7 ? 0.1 : 0;
    const discountSavings = Math.round(rawVehicleTotal * discountRate);
    const discountedVehicleTotal = rawVehicleTotal - discountSavings;
    const chauffeurTotal = withChauffeur ? 25000 * selectedDays * fleetCount : 0;
    const shieldTotal = withRoadShield ? 12000 * selectedDays * fleetCount : 0;
    const grandTotal = discountedVehicleTotal + chauffeurTotal + shieldTotal;
    const effectiveDailyPerCar = Math.round(grandTotal / (selectedDays * fleetCount));
    return { rawVehicleTotal, discountRate, discountSavings, discountedVehicleTotal, chauffeurTotal, shieldTotal, grandTotal, effectiveDailyPerCar };
  }, [activeTier, selectedDays, withChauffeur, withRoadShield, fleetCount]);

  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType:
      "Corporate Chauffeur, Self-Drive Car Rental, Motor Insurance, Airport VIP Meet & Greet & SuperFlex Subscriptions",
    provider: { "@type": "AutoRental", name: SITE_NAME, url: SITE_URL },
    areaServed: ["Lagos", "Abuja", "Port Harcourt", "Accra", "Nairobi"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Izzac Mobility Service Pillars",
      itemListElement: SERVICE_PILLARS.map((pillar) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: pillar.title, description: pillar.description },
      })),
    },
  };

  return (
    <div className="bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }} />

      {/* ------------------------------------------------------------ Hero */}
      <Section spacing="sm" className="pt-8 md:pt-12">
        <Breadcrumbs items={[{ label: "Services" }]} />
        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-7 lg:col-span-7">
            <Eyebrow index="01">Services & corporate</Eyebrow>
            <h1 className="text-display max-w-[16ch] text-foreground">Global rental discipline, built for real roads.</h1>
            <p className="type-lede max-w-[54ch]">
              We kept what works in international car hire and rebuilt the rest for Lagos, Abuja and Port Harcourt:
              chauffeur trials, a self-drive test, NIID motor insurance, security escort, prepaid fuel and a monthly
              SuperFlex rate 22% under daily.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Button asChild size="lg">
                <Link href="/cars">Browse the fleet</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#calculator">Corporate calculator</a>
              </Button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-xl bg-secondary">
              <Image
                src="/images/feature1.webp"
                alt="Izzac Mobility executive SUV and sedan fleet staged for corporate and airport protocol service"
                width={1600}
                height={1000}
                sizes="(max-width: 1024px) 100vw, 42vw"
                priority
                fetchPriority="high"
                className="aspect-[4/3] w-full object-cover lg:aspect-[4/5]"
              />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-md border border-white/10 bg-ink/85 px-4 py-3 font-mono text-2xs text-ink-foreground backdrop-blur-md">
                <span className="text-signal">Six services</span>
                <span className="tabular-nums text-ink-muted">LOS · ABV · PHC</span>
              </div>
            </div>
          </div>
        </div>

        <StatStrip columns={4} className="mt-14">
          <Stat label="Drive modes" value="2" detail="Chauffeur-driven or verified self-drive" />
          <Stat label="Airport desks" value="3" detail="LOS · ABV · PHC curbside handover" />
          <Stat label="SuperFlex" value="−22%" tone="primary" detail="Monthly · −10% weekly" />
          <Stat label="Relief SLA" value="2 h" detail="Standby replacement in core hubs" />
        </StatStrip>
      </Section>

      {/* -------------------------------------------------- Sticky anchors */}
      <div className="sticky top-[var(--header-height)] z-30 border-y border-border/70 bg-background/85 backdrop-blur-md">
        <Container>
          <nav aria-label="On this page" className="-mx-4 flex gap-6 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0">
            {PAGE_NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="shrink-0 border-b-2 border-transparent py-3.5 font-mono text-2xs uppercase tracking-[0.12em] text-muted-foreground transition-colors duration-150 hover:border-foreground hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </Container>
      </div>

      {/* --------------------------------------------------------- Pillars */}
      <Section id="pillars" className="scroll-mt-28">
        <SectionHeading
          eyebrow="Services"
          index="02"
          title="Six services. Each one a toggle at checkout."
          lede="Priced per day, applied on the vehicle page. Nothing is quoted offline."
          action={<ArrowLink href="/cars">Open the catalogue</ArrowLink>}
        />
        <div className="mt-12 ledger">
          {SERVICE_PILLARS.map((pillar, index) => {
            const flip = index % 2 === 1;
            return (
              <Reveal key={pillar.code} className="grid grid-cols-1 gap-8 py-10 md:py-14 lg:grid-cols-12 lg:gap-12" selector=":scope > *" stagger={0.1}>
                <div className={cn("lg:col-span-5", flip && "lg:order-2 lg:col-start-8")}>
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs tabular-nums text-primary">{pad(index + 1)}</span>
                    <div className="space-y-2">
                      <h3 className="text-h2 text-foreground">{pillar.title}</h3>
                      <p className="font-mono text-2xs uppercase tracking-[0.1em] text-muted-foreground">{pillar.subtitle}</p>
                    </div>
                  </div>
                  <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground lg:pl-8">{pillar.description}</p>
                  <div className="mt-6 flex items-center gap-5 lg:pl-8">
                    <span className="font-mono text-sm font-semibold tabular-nums text-foreground">{pillar.priceTag}</span>
                    <ArrowLink href={pillar.href}>{pillar.cta}</ArrowLink>
                  </div>
                </div>
                <div className={cn("lg:col-span-6", flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-7")}>
                  <ul className="divide-y divide-border/70 border-t border-border/70">
                    {pillar.highlights.map((item, idx) => (
                      <li key={item} className="grid grid-cols-[2rem_1fr] gap-3 py-3.5 text-sm text-foreground/90">
                        <span className="font-mono text-2xs tabular-nums text-muted-foreground pt-0.5">{pad(idx + 1)}</span>
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    <span className="font-mono uppercase tracking-[0.1em] text-primary">vs. global standard · </span>
                    {pillar.europcarUpgradeNote}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* ------------------------------------------------------ Calculator */}
      <Section id="calculator" rule="top" className="scroll-mt-28">
        <InkPanel padding="lg">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="space-y-8 lg:col-span-7">
              <div className="space-y-4">
                <Eyebrow index="03" tone="signal">
                  Corporate & monthly estimator
                </Eyebrow>
                <h2 className="text-display text-ink-foreground">Price a fleet in seconds.</h2>
                <p className="max-w-[48ch] text-[15px] leading-relaxed text-ink-muted">
                  Weekly bookings take 10% off, monthly take 22%. Add chauffeurs and road shield per vehicle.
                </p>
              </div>

              <fieldset className="space-y-3">
                <legend className="type-eyebrow text-signal">1 · Vehicle class</legend>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {FLEET_BENCHMARK_TIERS.map((tier) => {
                    const active = tier.id === selectedTierId;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setSelectedTierId(tier.id)}
                        aria-pressed={active}
                        className={cn(
                          "rounded-md border p-3.5 text-left transition-[background-color,border-color,transform] duration-150 ease-out-quart active:scale-[0.99]",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal",
                          active ? "border-signal/60 bg-white/[0.08]" : "border-white/10 bg-white/[0.03] hover:border-white/25"
                        )}
                      >
                        <p className="text-sm font-medium text-ink-foreground">{tier.label}</p>
                        <p className="mt-0.5 font-mono text-2xs text-ink-muted">{tier.example}</p>
                        <p className="mt-2 font-mono text-xs tabular-nums text-signal">{formatPrice(tier.dailyRateNgn)} /day</p>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset className="space-y-3">
                <legend className="type-eyebrow text-signal">2 · Duration</legend>
                <div className="flex flex-wrap gap-2">
                  {DURATION_PRESETS.map((preset) => {
                    const active = selectedDays === preset.days;
                    return (
                      <Chip
                        key={preset.days}
                        active={active}
                        onClick={() => setSelectedDays(preset.days)}
                        count={preset.discountPct > 0 ? `−${preset.discountPct}%` : undefined}
                        className={cn(!active && "border-white/15 bg-white/[0.04] text-ink-foreground hover:border-white/30 hover:text-white")}
                      >
                        {preset.days} days · {preset.label}
                      </Chip>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset className="space-y-3">
                <legend className="type-eyebrow text-signal">3 · Options</legend>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <OptionCard
                    kind="checkbox"
                    checked={withChauffeur}
                    onChange={(e) => setWithChauffeur(e.target.checked)}
                    title={<span className="text-ink-foreground">Pro chauffeur</span>}
                    meta={<span className="text-signal">+{formatPrice(25000)}/d</span>}
                    containerClassName="[--option-bg:hsl(0_0%_100%/0.04)] [--option-border:hsl(0_0%_100%/0.12)] hover:[--option-border:hsl(0_0%_100%/0.3)]"
                  />
                  <OptionCard
                    kind="checkbox"
                    checked={withRoadShield}
                    onChange={(e) => setWithRoadShield(e.target.checked)}
                    title={<span className="text-ink-foreground">Road & tyre shield</span>}
                    meta={<span className="text-signal">+{formatPrice(12000)}/d</span>}
                    containerClassName="[--option-bg:hsl(0_0%_100%/0.04)] [--option-border:hsl(0_0%_100%/0.12)] hover:[--option-border:hsl(0_0%_100%/0.3)]"
                  />
                  <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.04] px-3.5 py-3">
                    <div>
                      <p className="text-sm font-medium text-ink-foreground">Fleet units</p>
                      <p className="font-mono text-2xs tabular-nums text-ink-muted">
                        {fleetCount} {fleetCount === 1 ? "vehicle" : "vehicles"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setFleetCount((c) => Math.max(1, c - 1))}
                        aria-label="Decrease fleet count"
                        className="h-8 w-8 rounded-sm border border-white/15 font-mono text-sm text-ink-foreground transition-colors duration-150 hover:bg-white/10 active:scale-[0.96]"
                      >
                        −
                      </button>
                      <span className="w-7 text-center font-mono text-sm tabular-nums text-ink-foreground">{fleetCount}</span>
                      <button
                        type="button"
                        onClick={() => setFleetCount((c) => Math.min(20, c + 1))}
                        aria-label="Increase fleet count"
                        className="h-8 w-8 rounded-sm border border-white/15 font-mono text-sm text-ink-foreground transition-colors duration-150 hover:bg-white/10 active:scale-[0.96]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>

            {/* Live estimate */}
            <div className="lg:col-span-5">
              <div className="rounded-lg border border-white/10 bg-ink/60 p-6 md:p-7 lg:sticky lg:top-[calc(var(--header-height)+5rem)]">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="type-eyebrow text-signal">Live estimate</span>
                  <span className="font-mono text-2xs tabular-nums text-ink-muted">
                    {selectedDays} d × {fleetCount} {fleetCount === 1 ? "car" : "cars"}
                  </span>
                </div>

                <dl className="mt-4 space-y-2.5 font-mono text-xs tabular-nums">
                  <div className="flex items-center justify-between text-ink-muted">
                    <dt>Vehicle tariff</dt>
                    <dd>{formatPrice(estimate.rawVehicleTotal)}</dd>
                  </div>
                  {estimate.discountSavings > 0 && (
                    <div className="flex items-center justify-between text-signal">
                      <dt>SuperFlex −{Math.round(estimate.discountRate * 100)}%</dt>
                      <dd>−{formatPrice(estimate.discountSavings)}</dd>
                    </div>
                  )}
                  {estimate.chauffeurTotal > 0 && (
                    <div className="flex items-center justify-between text-ink-muted">
                      <dt>Chauffeur{fleetCount > 1 ? "s" : ""}</dt>
                      <dd>+{formatPrice(estimate.chauffeurTotal)}</dd>
                    </div>
                  )}
                  {estimate.shieldTotal > 0 && (
                    <div className="flex items-center justify-between text-ink-muted">
                      <dt>Road, tyre & flood shield</dt>
                      <dd>+{formatPrice(estimate.shieldTotal)}</dd>
                    </div>
                  )}
                </dl>

                <div className="mt-5 border-t border-white/10 pt-5">
                  <Stat inverted size="lg" tone="signal" label="Estimated total" value={formatPrice(estimate.grandTotal)} detail={`Effective ${formatPrice(estimate.effectiveDailyPerCar)} per car per day`} />
                </div>

                <p className="mt-5 text-xs leading-relaxed text-ink-muted">
                  Includes consolidated VAT invoice, 2-hour replacement guarantee in Lagos, Abuja and Port Harcourt, and scheduled maintenance.
                </p>

                <Button asChild size="lg" className="mt-6 w-full">
                  <Link href={activeTier.href}>Browse {activeTier.label.toLowerCase()}s</Link>
                </Button>
              </div>
            </div>
          </div>
        </InkPanel>
      </Section>

      {/* ------------------------------------------------------ Evaluation */}
      <Section spacing="sm">
        <DrivingEvaluationPanel compact />
      </Section>

      {/* ------------------------------------------------------- Insurance */}
      <Section id="insurance" rule="top" className="scroll-mt-28">
        <SectionHeading
          eyebrow="Motor insurance"
          index="04"
          title="A NIID certificate on every reservation."
          lede="Third-party is included. Upgrade to comprehensive or zero-excess all-risk at checkout."
        />
        <Reveal className="mt-12 grid grid-cols-1 divide-y divide-border/70 border-y border-border/70 lg:grid-cols-3 lg:divide-x lg:divide-y-0" stagger={0.08}>
          {INSURANCE_PLAN_OPTIONS.map((ins, idx) => {
            const featured = ins.code === "comprehensive_shield";
            return (
              <div key={ins.code} className={cn("flex flex-col justify-between gap-8 py-8 lg:px-8 lg:first:pl-0 lg:last:pr-0", featured && "lg:bg-surface lg:px-8")}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs tabular-nums text-primary">{pad(idx + 1)}</span>
                    {featured ? <Badge variant="emerald">Most chosen</Badge> : <span className="font-mono text-2xs uppercase tracking-[0.1em] text-muted-foreground">{ins.badge}</span>}
                  </div>
                  <h3 className="text-h3 text-foreground">{ins.name}</h3>
                  <p className="font-mono text-2xl font-semibold tabular-nums tracking-tight text-foreground">
                    {ins.dailyRateNgn === 0 ? "Included" : `+${formatPrice(ins.dailyRateNgn)}`}
                    {ins.dailyRateNgn > 0 && <span className="ml-1 font-sans text-xs font-normal text-muted-foreground">/day</span>}
                  </p>
                  <p className="font-mono text-2xs text-muted-foreground tabular-nums">
                    {ins.underwriter} · cover to {formatPrice(ins.coverageLimitNgn)}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{ins.summary}</p>
                </div>
                <ul className="divide-y divide-border/60 border-t border-border/70 text-sm text-foreground/90">
                  {ins.coverageItems.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 py-2.5">
                      <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </Reveal>
      </Section>

      {/* ------------------------------------------------------ Protection */}
      <Section id="protection" rule="top" tone="surface" className="scroll-mt-28">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Protection tiers"
              index="05"
              size="h2"
              title="Waivers that cover potholes, tyres and flood corridors."
              lede="Standard global waivers exclude rims, tyres and flood. Ours do not."
            />
            <Ledger className="mt-8">
              {PROTECTION_PLAN_OPTIONS.map((plan, idx) => (
                <LedgerRow
                  key={plan.code}
                  index={pad(idx + 1)}
                  title={plan.name}
                  description={
                    <>
                      {plan.summary}
                      <span className="mt-2 block font-mono text-2xs text-muted-foreground">{plan.coverageItems.join(" · ")}</span>
                    </>
                  }
                  aside={
                    <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
                      {plan.dailyRateNgn === 0 ? "Included" : `+${formatPrice(plan.dailyRateNgn)}/d`}
                    </span>
                  }
                />
              ))}
            </Ledger>
          </div>
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Extras"
              size="h2"
              title="Add what the trip needs."
              lede="Prepaid fuel, security escort, 5G cabin Wi-Fi, interstate clearance."
            />
            <Ledger className="mt-8">
              {BOOKING_ADDON_OPTIONS.map((addon) => (
                <LedgerRow
                  key={addon.code}
                  density="compact"
                  title={<span className="text-[15px]">{addon.name.split(" (")[0]}</span>}
                  description={<span className="text-xs">{addon.description}</span>}
                  aside={
                    <span className="font-mono text-xs font-semibold tabular-nums text-foreground">
                      +{formatPrice(addon.amountNgn)}
                      <span className="font-normal text-muted-foreground"> {addon.billing === "daily" ? "/d" : "flat"}</span>
                    </span>
                  }
                />
              ))}
            </Ledger>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------- Benchmark */}
      <Section id="benchmark" rule="top" className="scroll-mt-28">
        <SectionHeading
          eyebrow="How we compare"
          index="06"
          title="Where Izzac Mobility departs from the global rental standard."
          lede="We kept transparent tiers, duration discounts and airport desks. We changed what breaks on Nigerian roads."
        />
        <div
          tabIndex={0}
          role="region"
          aria-labelledby="competitor-benchmark-caption"
          className="comparison-table-wrapper mt-10 rounded-lg border border-border/80 bg-surface-elevated"
        >
          <table className="comparison-table text-left text-sm">
            <caption id="competitor-benchmark-caption" className="sr-only">
              Comparison of Izzac Mobility executive services versus the global car rental standard
            </caption>
            <thead>
              <tr className="border-b border-border bg-surface font-mono text-2xs uppercase tracking-[0.12em] text-muted-foreground">
                <th scope="col" className="p-4 font-semibold text-foreground">Capability</th>
                <th scope="col" className="p-4 font-semibold text-primary">Izzac Mobility</th>
                <th scope="col" className="p-4 font-semibold">Global standard</th>
                <th scope="col" className="p-4 font-semibold text-foreground">Why it matters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {EUROPCAR_COMPETITOR_BENCHMARK.map((row) => (
                <tr key={row.capability} className="align-top">
                  <th scope="row" className="p-4 font-medium text-foreground">{row.capability}</th>
                  <td className="bg-primary-soft/30 p-4 font-medium text-foreground">{row.izzacAdvantage}</td>
                  <td className="p-4 text-muted-foreground">{row.europcarStandard}</td>
                  <td className="p-4 text-foreground/85">{row.africanMarketImpact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* -------------------------------------------------------------- Hubs */}
      <Section id="hubs" rule="top" tone="surface" className="scroll-mt-28">
        <SectionHeading eyebrow="Coverage" index="07" title="City and airport hubs." lede="Curbside handover at each airport desk, plus city hubs in every listed metro." />
        <Reveal className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border/80 bg-border/70 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
          {AFRICAN_REGIONAL_HUBS.map((hub) => (
            <div key={hub.city} className="flex flex-col justify-between gap-5 bg-surface-elevated p-6">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-lg font-semibold tracking-tight text-primary">{hub.airportCode}</span>
                  <span className="font-mono text-2xs uppercase tracking-[0.1em] text-muted-foreground">{hub.country}</span>
                </div>
                <h3 className="text-h3 text-foreground">{hub.city}</h3>
                <p className="font-mono text-2xs text-muted-foreground">{hub.airportName}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{hub.corridors}</p>
              </div>
              <p className="border-t border-border/70 pt-3 font-mono text-2xs leading-relaxed text-foreground/75">
                {hub.servicesAvailable.join(" · ")}
              </p>
            </div>
          ))}
        </Reveal>

        <div className="mt-20">
          <SectionHeading
            eyebrow="Izzac Mobility Privilege"
            size="h2"
            title="Loyalty for frequent flyers and fleets."
            lede="Automatic discounts, lounge access, free cabin Wi-Fi and guaranteed December allocation."
          />
          <div className="mt-8 grid grid-cols-1 divide-y divide-border/70 border-y border-border/70 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {IZZAC_PRIVILEGE_TIERS.map((tier, idx) => (
              <div key={tier.tier} className="space-y-4 py-7 lg:px-8 lg:first:pl-0 lg:last:pr-0">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tabular-nums text-primary">Tier {pad(idx + 1)}</span>
                  <span className="font-mono text-sm font-semibold tabular-nums text-foreground">{tier.discount}</span>
                </div>
                <div>
                  <h3 className="text-h3 text-foreground">{tier.tier}</h3>
                  <p className="mt-1 font-mono text-2xs text-muted-foreground">{tier.threshold}</p>
                </div>
                <ul className="space-y-2 border-t border-border/70 pt-4 text-sm text-foreground/85">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5">
                      <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary" />
                      <span className="leading-snug">{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default ServicesPage;
