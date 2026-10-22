"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useCurrency } from "../../context/CurrencyContext";
import { SITE_NAME, SITE_URL } from "../../lib/seo";
import {
  AFRICAN_REGIONAL_HUBS,
  BOOKING_ADDON_OPTIONS,
  EUROPCAR_COMPETITOR_BENCHMARK,
  IZZAC_PRIVILEGE_TIERS,
  PROTECTION_PLAN_OPTIONS,
  SERVICE_PILLARS,
} from "../../lib/productContent";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Tooltip } from "../../components/ui/tooltip";

const FLEET_BENCHMARK_TIERS = [
  {
    id: "commuter",
    label: "City Commuter (Corolla / Civic)",
    dailyRateNgn: 78000,
    href: "/cars?category=City+Commuter",
  },
  {
    id: "sedan",
    label: "Executive Sedan (C300 / ES 350)",
    dailyRateNgn: 165000,
    href: "/cars?category=Executive+Sedan",
  },
  {
    id: "pickup",
    label: "Field 4x4 & Shuttle (Hilux / Ranger)",
    dailyRateNgn: 135000,
    href: "/cars?category=Pickup+%26+Shuttle",
  },
  {
    id: "suv",
    label: "Luxury & Escort SUV (Prado / GLE 450 / LC300)",
    dailyRateNgn: 260000,
    href: "/cars?category=Luxury+SUV",
  },
];

const DURATION_PRESETS = [
  { days: 3, label: "3 Days · Short-Term", discountPct: 0 },
  { days: 7, label: "7 Days · Weekly Saver (-10%)", discountPct: 10 },
  { days: 30, label: "30 Days · Monthly SuperFlex (-22%)", discountPct: 22 },
  { days: 90, label: "90 Days · Quarterly Corporate (-22%)", discountPct: 22 },
];

const bentoSpans = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-7",
  "lg:col-span-7",
  "lg:col-span-5",
];

const ServicesPage = () => {
  const { formatPrice } = useCurrency();
  const [selectedTierId, setSelectedTierId] = useState("sedan");
  const [selectedDays, setSelectedDays] = useState(30);
  const [withChauffeur, setWithChauffeur] = useState(true);
  const [withNaijaShield, setWithNaijaShield] = useState(true);
  const [fleetCount, setFleetCount] = useState(1);

  const activeTier = useMemo(
    () =>
      FLEET_BENCHMARK_TIERS.find((t) => t.id === selectedTierId) ||
      FLEET_BENCHMARK_TIERS[1],
    [selectedTierId]
  );

  const estimate = useMemo(() => {
    const rawVehicleTotal = activeTier.dailyRateNgn * selectedDays * fleetCount;
    const discountRate =
      selectedDays >= 30 ? 0.22 : selectedDays >= 7 ? 0.1 : 0;
    const discountSavings = Math.round(rawVehicleTotal * discountRate);
    const discountedVehicleTotal = rawVehicleTotal - discountSavings;
    const chauffeurTotal = withChauffeur ? 25000 * selectedDays * fleetCount : 0;
    const shieldTotal = withNaijaShield ? 12000 * selectedDays * fleetCount : 0;
    const grandTotal = discountedVehicleTotal + chauffeurTotal + shieldTotal;
    const effectiveDailyPerCar = Math.round(
      grandTotal / (selectedDays * fleetCount)
    );

    return {
      rawVehicleTotal,
      discountRate,
      discountSavings,
      discountedVehicleTotal,
      chauffeurTotal,
      shieldTotal,
      grandTotal,
      effectiveDailyPerCar,
    };
  }, [activeTier, selectedDays, withChauffeur, withNaijaShield, fleetCount]);

  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType:
      "Corporate Chauffeur, Self-Drive Car Rental, Airport VIP Meet & Greet & SuperFlex Subscriptions",
    provider: {
      "@type": "AutoRental",
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: ["Nigeria", "Ghana", "Kenya"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Izzac Mobility Service Pillars",
      itemListElement: SERVICE_PILLARS.map((pillar) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: pillar.title,
          description: pillar.description,
        },
      })),
    },
  };

  return (
    <div className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      {/* Asymmetric 12-Col Editorial Hero */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-16 md:pt-14 md:pb-24 space-y-6">
        <Breadcrumbs items={[{ label: "Services & B2B" }]} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="emerald">Nigeria & Pan-African Mobility Suite</Badge>
              <Badge variant="secondary">Europcar Competitive Upgrade</Badge>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-foreground tracking-[-0.035em] leading-[1.06]">
              Global rental discipline, engineered for Nigerian roads & executive realities.
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-[60ch] leading-relaxed">
              We benchmarked global leaders like Europcar and redesigned every product and service around how mobility actually works in Lagos, Abuja, Port Harcourt, Accra, and Nairobi: vetted corporate chauffeurs, MOPOL security protocol, prepaid full-tank fuel, pothole & flood protection, and 22%-off Monthly SuperFlex subscriptions.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Tooltip content="Filter 32+ vehicles by city hub and mobility service">
                <Button asChild size="lg">
                  <Link href="/cars">Browse 32+ live vehicles</Link>
                </Button>
              </Tooltip>
              <Tooltip content="Calculate 10% Weekly & 22% Monthly SuperFlex fleet savings">
                <Button asChild variant="secondary" size="lg">
                  <a href="#calculator">Corporate & monthly calculator</a>
                </Button>
              </Tooltip>
              <Tooltip content="See how Izzac outperforms Europcar on 8 African mobility dimensions">
                <Button asChild variant="outline" size="lg">
                  <a href="#benchmark">Izzac vs. Europcar</a>
                </Button>
              </Tooltip>
            </div>

            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-border/80">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Drive Modes
                </p>
                <p className="font-mono text-sm font-semibold text-foreground mt-0.5 tabular-nums">
                  Chauffeur + Self
                </p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Airport Desks
                </p>
                <p className="font-mono text-sm font-semibold text-foreground mt-0.5 tabular-nums">
                  LOS · ABV · PHC
                </p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  SuperFlex Save
                </p>
                <p className="font-mono text-sm font-semibold text-primary mt-0.5 tabular-nums">
                  Up to 22% Off
                </p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Relief SLA
                </p>
                <p className="font-mono text-sm font-semibold text-foreground mt-0.5 tabular-nums">
                  2-Hr Standby Car
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-border/90 bg-card p-2.5 shadow-elevated">
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src="/images/feature1.webp"
                  alt="Izzac executive SUV and sedan fleet staged for corporate and airport protocol service"
                  width={1600}
                  height={1000}
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  priority
                  fetchPriority="high"
                  className="w-full h-72 sm:h-80 md:h-[22rem] object-cover"
                />
                <div className="absolute inset-x-3 bottom-3 rounded-lg border border-white/15 bg-[#0d1713]/90 p-3.5 text-xs text-stone-100 backdrop-blur-md space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono uppercase tracking-[0.14em] text-emerald-300">
                      African Executive Standard
                    </span>
                    <span className="font-mono tabular-nums text-stone-200">
                      6 Mobility Pillars
                    </span>
                  </div>
                  <p className="text-stone-300 text-[11px] leading-snug">
                    Chauffeur Drive · NIN/FRSC Self-Drive · Airport VIP · SuperFlex B2B · Hilux 4x4 · P2P Fleet Hosting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Mobility Products & Services (Asymmetric 12-Col Bento Grid) */}
      <section className="border-y border-border/80 bg-secondary/35 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="emerald">Products & Services Portfolio</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em]">
                Six mobility products tailored for Nigeria & Africa
              </h2>
              <p className="text-muted-foreground max-w-[62ch] text-sm md:text-base">
                Every service pillar integrates directly into the live vehicle catalogue and checkout configurator—no offline quote forms required.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/cars">Open live vehicle catalogue →</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {SERVICE_PILLARS.map((pillar, index) => (
              <Card
                key={pillar.code}
                className={`${bentoSpans[index % bentoSpans.length]} p-6 md:p-8 flex flex-col justify-between hover:border-stone-300 hover:shadow-elevated stagger-item`}
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="secondary">{pillar.eyebrow}</Badge>
                    <span className="font-mono text-xs font-semibold text-primary tabular-nums">
                      {pillar.priceTag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-[-0.025em]">
                      {pillar.title}
                    </h3>
                    <p className="font-mono text-xs text-muted-foreground mt-1">
                      {pillar.subtitle}
                    </p>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>

                  <ul className="space-y-2 pt-2 border-t border-border/70 text-sm text-foreground/90">
                    {pillar.highlights.map((item, idx) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="font-mono text-xs font-semibold text-primary pt-0.5 tabular-nums">
                          0{idx + 1}
                        </span>
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-border/70 space-y-3">
                  <p className="text-xs text-muted-foreground bg-secondary/60 rounded-lg px-3 py-2 leading-relaxed">
                    <span className="font-mono font-semibold uppercase tracking-[0.1em] text-primary">
                      vs. Europcar:{" "}
                    </span>
                    {pillar.europcarUpgradeNote}
                  </p>
                  <div>
                    <Link
                      href={pillar.href}
                      className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-emerald-900 transition-colors duration-150"
                    >
                      <span>{pillar.cta}</span>
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-150 ease-out-quart group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Corporate & SuperFlex Subscription Calculator */}
      <section
        id="calculator"
        className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24 scroll-mt-20"
      >
        <div className="rounded-2xl bg-[#0d1713] text-stone-100 p-6 sm:p-8 md:p-11 border border-emerald-950 shadow-elevated">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <Badge variant="dark">Interactive Rate Configurator</Badge>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-stone-50">
                  Corporate Fleet & Monthly SuperFlex Estimator
                </h2>
                <p className="text-stone-300 text-sm md:text-base leading-relaxed">
                  Compare short-term daily rentals against Izzac’s automatic Weekly (-10%) and Monthly SuperFlex (-22%) subscription discounts—complete with corporate chauffeur and Naija Road Shield options.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-[0.14em] text-emerald-300 mb-2">
                    1. Select Vehicle Class
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {FLEET_BENCHMARK_TIERS.map((tier) => {
                      const active = tier.id === selectedTierId;
                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setSelectedTierId(tier.id)}
                          className={`text-left rounded-xl border p-3.5 transition-colors duration-150 ${
                            active
                              ? "border-emerald-400 bg-emerald-950/80 text-stone-50"
                              : "border-white/10 bg-white/5 text-stone-300 hover:border-white/25"
                          }`}
                        >
                          <p className="text-sm font-semibold">{tier.label}</p>
                          <p className="font-mono text-xs text-emerald-300 mt-1 tabular-nums">
                            {formatPrice(tier.dailyRateNgn)} /day base
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-[0.14em] text-emerald-300 mb-2">
                    2. Rental Duration & Subscription Tier
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {DURATION_PRESETS.map((preset) => {
                      const active = selectedDays === preset.days;
                      return (
                        <button
                          key={preset.days}
                          type="button"
                          onClick={() => setSelectedDays(preset.days)}
                          className={`rounded-xl border px-3 py-2.5 text-left transition-colors duration-150 ${
                            active
                              ? "border-emerald-400 bg-emerald-950/80 text-stone-50"
                              : "border-white/10 bg-white/5 text-stone-300 hover:border-white/25"
                          }`}
                        >
                          <p className="font-mono text-sm font-bold tabular-nums">
                            {preset.days} Days
                          </p>
                          <p className="text-[11px] text-emerald-300/90 mt-0.5">
                            {preset.discountPct > 0
                              ? `Save ${preset.discountPct}%`
                              : "Standard rate"}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <label className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 text-xs text-stone-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={withChauffeur}
                      onChange={(e) => setWithChauffeur(e.target.checked)}
                      className="h-4 w-4 rounded"
                    />
                    <div>
                      <p className="font-semibold text-stone-100">
                        Pro Chauffeur
                      </p>
                      <p className="font-mono text-[11px] text-emerald-300 tabular-nums">
                        +{formatPrice(25000)}/day
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 text-xs text-stone-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={withNaijaShield}
                      onChange={(e) => setWithNaijaShield(e.target.checked)}
                      className="h-4 w-4 rounded"
                    />
                    <div>
                      <p className="font-semibold text-stone-100">
                        Naija Road Shield
                      </p>
                      <p className="font-mono text-[11px] text-emerald-300 tabular-nums">
                        +{formatPrice(12000)}/day
                      </p>
                    </div>
                  </label>

                  <div className="rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs text-stone-200 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-stone-100">Fleet Units</p>
                      <p className="font-mono text-[11px] text-stone-400 tabular-nums">
                        {fleetCount} {fleetCount === 1 ? "Vehicle" : "Vehicles"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setFleetCount((c) => Math.max(1, c - 1))}
                        className="h-7 w-7 rounded bg-white/10 font-mono text-sm font-bold hover:bg-white/20"
                        aria-label="Decrease fleet count"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => setFleetCount((c) => Math.min(20, c + 1))}
                        className="h-7 w-7 rounded bg-white/10 font-mono text-sm font-bold hover:bg-white/20"
                        aria-label="Increase fleet count"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Tabular-Nums Quote Ledger */}
            <div className="lg:col-span-5 rounded-xl border border-white/15 bg-black/35 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-emerald-300">
                  Live Fleet Estimate
                </span>
                <span className="font-mono text-xs text-stone-300 tabular-nums">
                  {selectedDays} Days × {fleetCount}{" "}
                  {fleetCount === 1 ? "Car" : "Cars"}
                </span>
              </div>

              <div className="space-y-2.5 font-mono text-xs tabular-nums">
                <div className="flex items-center justify-between text-stone-300">
                  <span>Standard vehicle tariff</span>
                  <span>{formatPrice(estimate.rawVehicleTotal)}</span>
                </div>

                {estimate.discountSavings > 0 && (
                  <div className="flex items-center justify-between text-emerald-300">
                    <span>
                      SuperFlex discount (-{Math.round(estimate.discountRate * 100)}%)
                    </span>
                    <span>-{formatPrice(estimate.discountSavings)}</span>
                  </div>
                )}

                {estimate.chauffeurTotal > 0 && (
                  <div className="flex items-center justify-between text-stone-300">
                    <span>Vetted corporate chauffeur(s)</span>
                    <span>+{formatPrice(estimate.chauffeurTotal)}</span>
                  </div>
                )}

                {estimate.shieldTotal > 0 && (
                  <div className="flex items-center justify-between text-stone-300">
                    <span>Naija Road, Tyre & Flood Shield</span>
                    <span>+{formatPrice(estimate.shieldTotal)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-white/15 pt-4 space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-stone-200">
                    Estimated Total
                  </span>
                  <span className="font-mono text-2xl font-bold text-emerald-300 tabular-nums">
                    {formatPrice(estimate.grandTotal)}
                  </span>
                </div>
                <p className="font-mono text-xs text-stone-400 text-right tabular-nums">
                  Effective {formatPrice(estimate.effectiveDailyPerCar)} /car/day
                </p>
              </div>

              <p className="text-xs text-stone-300/90 leading-relaxed pt-1">
                Includes consolidated VAT invoice, 2-hour replacement vehicle guarantee in Lagos/Abuja/PH, and scheduled maintenance.
              </p>

              <Button asChild size="lg" className="w-full">
                <Link href={activeTier.href}>
                  Browse matching {activeTier.label.split(" (")[0]}s →
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tiered Protection Packages & African Mobility Extras */}
      <section className="border-y border-border/80 bg-secondary/30 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-14">
          <div className="space-y-8">
            <div className="space-y-2">
              <Badge variant="emerald">Protection & Risk Mitigation</Badge>
              <h2 className="text-3xl font-bold text-foreground tracking-[-0.03em]">
                Protection tiers built for Nigerian road conditions
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-[62ch]">
                Standard global rental waivers often exclude pothole tyre damage, rims, and flood corridors. Izzac’s protection tiers address real West and East African road risks transparently.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 rounded-2xl border border-border/90 bg-card shadow-surface divide-y lg:divide-y-0 lg:divide-x divide-border/80 overflow-hidden">
              {PROTECTION_PLAN_OPTIONS.map((plan) => (
                <div
                  key={plan.code}
                  className="p-6 md:p-8 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        variant={
                          plan.code === "medium" ? "emerald" : "secondary"
                        }
                      >
                        {plan.badge}
                      </Badge>
                      <span className="font-mono text-sm font-bold text-primary tabular-nums">
                        {plan.dailyRateNgn === 0
                          ? "Included"
                          : `+${formatPrice(plan.dailyRateNgn)} /day`}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground tracking-[-0.02em]">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {plan.summary}
                    </p>
                  </div>

                  <ul className="pt-4 border-t border-border/70 space-y-2.5 text-sm text-foreground/90">
                    {plan.coverageItems.map((item, idx) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="font-mono text-xs font-semibold text-primary tabular-nums">
                          0{idx + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* African Mobility Add-Ons (Replacing European Ski Racks & Snow Chains) */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Badge variant="secondary">Localized Extras & Add-Ons</Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-[-0.03em]">
                Every booking can be equipped with African executive extras
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-[62ch]">
                Instead of snow chains or ski racks, configure your reservation with prepaid fuel, executive security escort, 5G cabin Wi-Fi, or interstate travel clearance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {BOOKING_ADDON_OPTIONS.map((addon) => (
                <Card key={addon.code} className="p-5 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="emerald">{addon.badge}</Badge>
                      <span className="font-mono text-xs font-bold text-primary tabular-nums">
                        +{formatPrice(addon.amountNgn)}{" "}
                        {addon.billing === "daily" ? "/day" : "flat"}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-foreground">
                      {addon.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {addon.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modern Web Guidance (responsive-table): Semantic Competitor Benchmark Table */}
      <section
        id="benchmark"
        className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24 space-y-8 scroll-mt-20"
      >
        <div className="space-y-2">
          <Badge variant="emerald">Competitive Benchmark</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em]">
            How Izzac improves on Europcar for Nigeria & Africa
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-[64ch]">
            We retained the best parts of Europcar’s international structure—transparent protection tiers, multi-duration discounts, and airport hubs—while re-architecting the product for African infrastructure and security realities.
          </p>
        </div>

        <div
          tabIndex={0}
          role="region"
          aria-labelledby="competitor-benchmark-caption"
          className="comparison-table-wrapper rounded-2xl border border-border/90 bg-card shadow-surface"
        >
          <table className="comparison-table text-left text-sm">
            <caption id="competitor-benchmark-caption" className="sr-only">
              Comparison of Izzac Nigeria and Africa mobility services versus Europcar global rental standard
            </caption>
            <thead>
              <tr className="border-b border-border bg-secondary/80 font-mono text-xs uppercase tracking-[0.12em] text-foreground">
                <th scope="col" className="p-4 font-semibold">
                  Capability / Dimension
                </th>
                <th scope="col" className="p-4 font-semibold text-primary">
                  Izzac (Nigeria & Africa OS)
                </th>
                <th scope="col" className="p-4 font-semibold text-muted-foreground">
                  Europcar Global Standard
                </th>
                <th scope="col" className="p-4 font-semibold">
                  African Market Impact
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/80">
              {EUROPCAR_COMPETITOR_BENCHMARK.map((row) => (
                <tr key={row.capability} className="align-top">
                  <th
                    scope="row"
                    className="p-4 font-semibold text-foreground border-b sm:border-b-0 border-border/60"
                  >
                    {row.capability}
                  </th>
                  <td className="p-4 text-foreground font-medium bg-emerald-950/[0.03]">
                    {row.izzacAdvantage}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {row.europcarStandard}
                  </td>
                  <td className="p-4 text-foreground/90">
                    {row.africanMarketImpact}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Regional Hubs & Izzac Privilege Loyalty Program */}
      <section className="border-t border-border/80 bg-secondary/35 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-16">
          <div className="space-y-6">
            <div className="space-y-2">
              <Badge variant="emerald">Regional Coverage & Airport Desks</Badge>
              <h2 className="text-3xl font-bold text-foreground tracking-[-0.03em]">
                Active Nigerian & Pan-African Mobility Hubs
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {AFRICAN_REGIONAL_HUBS.map((hub) => (
                <Card key={hub.city} className="p-6 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary">
                        {hub.airportCode}
                      </span>
                      <Badge variant="outline">{hub.country}</Badge>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                      {hub.city}
                    </h3>
                    <p className="font-mono text-xs text-muted-foreground">
                      {hub.airportName}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                      {hub.corridors}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/70">
                    {hub.servicesAvailable.map((svc) => (
                      <span
                        key={svc}
                        className="rounded bg-secondary px-2 py-0.5 font-mono text-[10px] font-medium text-foreground/85"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Izzac Privilege Loyalty Tiers */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Badge variant="secondary">Izzac Privilege Rewards</Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-[-0.03em]">
                Loyalty perks built for frequent Nigerian & African flyers
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-[62ch]">
                Inspired by Europcar Privilege and upgraded with domestic airport lounge access, free 5G cabin Wi-Fi, and guaranteed December peak-season fleet allocation.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 rounded-2xl border border-border/90 bg-card shadow-surface divide-y lg:divide-y-0 lg:divide-x divide-border/80 overflow-hidden">
              {IZZAC_PRIVILEGE_TIERS.map((tier, idx) => (
                <div key={tier.tier} className="p-6 md:p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                      Tier 0{idx + 1}
                    </span>
                    <Badge variant="emerald">{tier.discount}</Badge>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {tier.tier}
                    </h3>
                    <p className="font-mono text-xs text-muted-foreground mt-1">
                      {tier.threshold}
                    </p>
                  </div>
                  <ul className="space-y-2 pt-3 border-t border-border/70 text-sm text-foreground/90">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2">
                        <span className="text-primary font-bold">✓</span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
