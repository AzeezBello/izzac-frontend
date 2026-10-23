"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import publicApi from "../lib/publicApi";
import FallbackImage from "../components/FallbackImage";
import EmptyStateGuide from "../components/EmptyStateGuide";
import DrivingEvaluationPanel from "../components/DrivingEvaluationPanel";
import { useCurrency } from "../context/CurrencyContext";
import { useOnboarding } from "../context/OnboardingContext";
import {
  hostJourney,
  riderJourney,
  SERVICE_PILLARS,
} from "../lib/productContent";
import {
  CAR_CATEGORIES,
  CarCategory,
  DETAILED_CAR_CATALOGUE,
  DetailedCar,
  mergeWithDetailedCatalogue,
  MOBILITY_SERVICE_MODES,
  MobilityServiceMode,
  NIGERIAN_CITY_HUBS,
  NigerianCityHub,
  resolveCarImage,
} from "../lib/carCatalogue";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Tooltip } from "../components/ui/tooltip";
import { Alert, AlertDescription } from "../components/ui/alert";
import { SplitText } from "../components/reactbits/SplitText";
import { ClickSpark } from "../components/reactbits/ClickSpark";
import { GlassRefraction } from "../components/canvasui/GlassRefraction";
import { ScrollWorldStage } from "../components/scrollworld/ScrollWorldStage";

const HomePage = () => {
  const { formatPrice } = useCurrency();
  const { openOnboarding, startProductTour } = useOnboarding();
  const [cars, setCars] = useState<DetailedCar[]>(DETAILED_CAR_CATALOGUE);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CarCategory | "All">(
    "All"
  );
  const [selectedHub, setSelectedHub] = useState<NigerianCityHub>("All Hubs");
  const [selectedServiceMode, setSelectedServiceMode] = useState<
    MobilityServiceMode | "All Modes"
  >("All Modes");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await publicApi.get("/cars/", {
          params: { available: "true" },
        });
        setCars(mergeWithDetailedCatalogue(response.data));
        setError(null);
      } catch {
        setCars(DETAILED_CAR_CATALOGUE);
      }
    };

    fetchCars();
  }, []);

  const filteredCars = useMemo(() => {
    const term = search.toLowerCase().trim();
    return cars.filter((car) => {
      const matchesCategory =
        selectedCategory === "All" || car.category === selectedCategory;
      const matchesHub =
        selectedHub === "All Hubs" || car.cityHub === selectedHub;
      const matchesService =
        selectedServiceMode === "All Modes" ||
        (car.serviceModes && car.serviceModes.includes(selectedServiceMode));
      const matchesSearch =
        !term ||
        `${car.make} ${car.model} ${car.location} ${car.category || ""} ${car.hubAirport || ""} ${car.description}`
          .toLowerCase()
          .includes(term);
      return matchesCategory && matchesHub && matchesService && matchesSearch;
    });
  }, [cars, search, selectedCategory, selectedHub, selectedServiceMode]);

  return (
    <div className="bg-background">
      {/* Taste-Skill Hero Discipline: Asymmetric 12-col split within initial viewport */}
      <section className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-10 pb-14 md:pt-16 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="emerald">Executive Mobility & Fleet OS</Badge>
              <Badge variant="secondary">
                Chauffeur Trial · Self-Drive Exam · Motor Insurance · SuperFlex
              </Badge>
            </div>
            <SplitText
              text="Book executive rides, airport protocol, or corporate fleets from one Izzac account."
              className="text-4xl sm:text-5xl lg:text-[3.3rem] font-bold text-foreground tracking-[-0.035em] leading-[1.06]"
              tag="h1"
            />
            <p className="text-muted-foreground text-base md:text-lg max-w-[66ch] leading-relaxed">
              Engineered to outperform traditional car rentals: new riders start with a Chauffeur-Driven Trial before passing our Driving Test Evaluation to unlock Self-Drive, with NAICOM/NIID Motor Insurance and up to 22% off monthly SuperFlex subscriptions included.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Tooltip content="Inspect all 32+ executive sedans, SUVs, EVs & Hilux 4x4 pickups">
                <ClickSpark>
                  <Button asChild size="lg">
                    <Link href="/cars">Browse fleet</Link>
                  </Button>
                </ClickSpark>
              </Tooltip>
              <Tooltip content="Compare our 6 mobility services, motor insurance & SuperFlex rates vs. Europcar">
                <Button asChild variant="secondary" size="lg">
                  <Link href="/services">Explore services & B2B</Link>
                </Button>
              </Tooltip>
              <Tooltip content="Walk through Izzac's main features in 60 seconds">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={startProductTour}
                >
                  Take Product Tour
                </Button>
              </Tooltip>
            </div>

            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-border/80">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Drive Modes
                </p>
                <p className="font-mono text-sm font-semibold text-foreground mt-0.5 tabular-nums">
                  Chauffeur → Self
                </p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Motor Insurance
                </p>
                <p className="font-mono text-sm font-semibold text-foreground mt-0.5 tabular-nums">
                  NIID Verified
                </p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  SuperFlex
                </p>
                <p className="font-mono text-sm font-semibold text-primary mt-0.5 tabular-nums">
                  -10% Wk / -22% Mo
                </p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Inventory
                </p>
                <p className="font-mono text-sm font-semibold text-primary mt-0.5 tabular-nums">
                  {cars.length} Live Cars
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <GlassRefraction className="p-2.5 shadow-elevated">
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src="/images/hero-bg.webp"
                  alt="Executive SUV and luxury sedan parked at a contemporary Lagos residence"
                  width={1600}
                  height={1000}
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="w-full h-72 sm:h-80 md:h-[22rem] object-cover transition-transform duration-500 ease-out-expo hover:scale-[1.02]"
                  priority
                  fetchPriority="high"
                />
                <div className="absolute inset-x-3 bottom-3 rounded-lg border border-white/15 bg-[#0d1713]/90 px-3.5 py-2.5 text-xs text-stone-100 backdrop-blur-md space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono uppercase tracking-[0.14em] text-emerald-300">
                      Direct Executive Mobility Loop
                    </span>
                    <span className="font-mono tabular-nums text-stone-200">
                      {cars.length} Verified Vehicles
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-300">
                    Lagos · Abuja · Port Harcourt · Kano · Ibadan · Enugu
                  </p>
                </div>
              </div>
            </GlassRefraction>
          </div>
        </div>
      </section>

      {/* Executive Mobility Products Strip (Outperforming Europcar) */}
      <section className="border-t border-border/80 bg-secondary/25 py-14 md:py-20">
        <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="emerald">Products & Services Rendered</Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-[-0.03em]">
                Built for executive & corporate mobility—beyond standard car hire
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-[66ch]">
                Benchmarked against Europcar and upgraded with corporate chauffeurs, self-drive qualification exams, NIID motor insurance, road protection, and prepaid full-tank fuel delivery.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/services">Compare all services vs. Europcar →</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 rounded-2xl border border-border/90 bg-card shadow-surface divide-y md:divide-y-0 md:divide-x divide-border/80 overflow-hidden">
            {SERVICE_PILLARS.slice(0, 3).map((service) => (
              <div
                key={service.code}
                className="p-6 md:p-7 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                      {service.eyebrow}
                    </span>
                    <Badge variant="secondary">{service.priceTag}</Badge>
                  </div>
                  <h3 className="text-lg font-bold text-foreground tracking-[-0.02em]">
                    {service.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-border/60">
                  <Link
                    href={service.href}
                    className="group inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-emerald-900"
                  >
                    <span>{service.cta}</span>
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-150 ease-out-quart group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 rounded-2xl border border-border/90 bg-card shadow-surface divide-y md:divide-y-0 md:divide-x divide-border/80 overflow-hidden">
            {SERVICE_PILLARS.slice(3, 6).map((service) => (
              <div
                key={service.code}
                className="p-6 md:p-7 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                      {service.eyebrow}
                    </span>
                    <Badge variant="secondary">{service.priceTag}</Badge>
                  </div>
                  <h3 className="text-lg font-bold text-foreground tracking-[-0.02em]">
                    {service.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-border/60">
                  <Link
                    href={service.href}
                    className="group inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-emerald-900"
                  >
                    <span>{service.cta}</span>
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-150 ease-out-quart group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Catalogue Section with Hub, Service Mode & Category Filters */}
      <section className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div className="space-y-2">
            <Badge variant="secondary">
              Live Catalogue · {filteredCars.length} of {cars.length} Vehicles
            </Badge>
            <h2 className="text-3xl font-bold text-foreground tracking-[-0.03em]">
              Available cars across major hubs
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Filter by city hub, service mode (Chauffeur, Self-Drive, Airport VIP), or vehicle category.
            </p>
          </div>
          <div className="w-full md:w-72">
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search e.g. Prado Abuja, Hilux, Lagos"
              aria-label="Search available cars"
            />
          </div>
        </div>

        {/* City Hub Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 pb-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground mr-1">
            Hub:
          </span>
          {NIGERIAN_CITY_HUBS.map((hub) => (
            <button
              key={hub}
              type="button"
              onClick={() => setSelectedHub(hub)}
              className={`px-2.5 py-1 rounded-md font-mono text-xs font-medium transition-colors duration-150 ${
                selectedHub === hub
                  ? "bg-[#0d1713] text-stone-50"
                  : "bg-secondary/70 text-muted-foreground hover:text-foreground"
              }`}
            >
              {hub}
            </button>
          ))}
        </div>

        {/* Service Mode Filter Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground mr-1 shrink-0">
            Service:
          </span>
          <button
            type="button"
            onClick={() => setSelectedServiceMode("All Modes")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors duration-150 ${
              selectedServiceMode === "All Modes"
                ? "bg-primary/15 text-primary font-semibold border border-primary/30"
                : "bg-secondary/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            All Modes
          </button>
          {MOBILITY_SERVICE_MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setSelectedServiceMode(mode)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors duration-150 ${
                selectedServiceMode === mode
                  ? "bg-primary/15 text-primary font-semibold border border-primary/30"
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Category Filter Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-border/70">
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-[transform,background-color,color] duration-150 ease-out-quart active:scale-[0.98] ${
              selectedCategory === "All"
                ? "bg-primary text-primary-foreground shadow-surface"
                : "bg-secondary/70 text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({cars.length})
          </button>
          {CAR_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-[transform,background-color,color] duration-150 ease-out-quart active:scale-[0.98] ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground shadow-surface"
                  : "bg-secondary/70 text-muted-foreground hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertDescription className="font-semibold">{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCars.map((car) => {
              const superFlexDaily = Math.round(car.price_per_day * 0.78);
              return (
                <Link
                  href={`/cars/${car.id}`}
                  key={car.id}
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl stagger-item"
                >
                  <Card className="overflow-hidden h-full flex flex-col hover:-translate-y-0.5 hover:shadow-elevated hover:border-stone-300">
                    <div className="relative overflow-hidden bg-secondary aspect-[16/10]">
                      <FallbackImage
                        src={resolveCarImage(car)}
                        alt={`${car.year} ${car.make} ${car.model} available in ${car.location}`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className="bg-card/90 backdrop-blur-sm tabular-nums"
                        >
                          {car.year}
                        </Badge>
                        {car.category && (
                          <Badge
                            variant="emerald"
                            className="bg-card/90 backdrop-blur-sm"
                          >
                            {car.category}
                          </Badge>
                        )}
                      </div>
                      {car.hubAirport && (
                        <div className="absolute bottom-2.5 left-3 rounded bg-[#0d1713]/85 px-2 py-0.5 font-mono text-[10px] text-emerald-300 backdrop-blur-sm">
                          {car.hubAirport}
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="text-lg font-semibold text-foreground tracking-[-0.02em] group-hover:text-primary transition-colors duration-150">
                            {car.make} {car.model}
                          </h3>
                          <div className="text-right shrink-0">
                            <p className="font-mono text-base font-bold text-primary tabular-nums">
                              {formatPrice(car.price_per_day)}{" "}
                              <span className="font-sans text-xs font-normal text-muted-foreground">
                                /day
                              </span>
                            </p>
                            <p className="font-mono text-[10px] text-muted-foreground tabular-nums">
                              SuperFlex: {formatPrice(superFlexDaily)}/d
                            </p>
                          </div>
                        </div>
                        <p className="font-mono text-xs text-muted-foreground tabular-nums">
                          {car.location} ·{" "}
                          {car.chauffeurRecommended
                            ? "Chauffeur / Self-Drive"
                            : "Self-Drive / Chauffeur"}
                        </p>
                        {(car.transmission || car.drivetrain || car.seats) && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5 font-mono text-[11px] text-muted-foreground tabular-nums">
                            {car.transmission && (
                              <span className="rounded bg-secondary/80 px-2 py-0.5">
                                {car.transmission}
                              </span>
                            )}
                            {car.drivetrain && (
                              <span className="rounded bg-secondary/80 px-2 py-0.5">
                                {car.drivetrain}
                              </span>
                            )}
                            {car.seats && (
                              <span className="rounded bg-secondary/80 px-2 py-0.5">
                                {car.seats} Seats
                              </span>
                            )}
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-2 pt-1 leading-relaxed">
                          {car.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-foreground/80 group-hover:text-primary transition-colors duration-150">
                        <span>Configure chauffeur, shield & dates</span>
                        <span
                          aria-hidden="true"
                          className="transition-transform duration-150 ease-out-quart group-hover:translate-x-0.5"
                        >
                          →
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
            {!error && filteredCars.length === 0 && (
              <EmptyStateGuide
                eyebrow="No Matching Fleet Units"
                title="No vehicles match your current hub or category filter"
                description="Try broadening your search across all city hubs or explore our 6 mobility service pillars."
                primaryAction={{
                  label: "Reset All Filters",
                  onClick: () => {
                    setSearch("");
                    setSelectedCategory("All");
                    setSelectedHub("All Hubs");
                    setSelectedServiceMode("All Modes");
                  },
                }}
                secondaryAction={{
                  label: "Open Onboarding Guide",
                  onClick: openOnboarding,
                }}
                tips={[
                  {
                    title: "Switch to All Hubs",
                    description:
                      "View all 32+ executive sedans, luxury SUVs, EVs, and Hilux 4x4 pickups across Lagos, Abuja, and PH.",
                  },
                  {
                    title: "Try Chauffeur or Self-Drive",
                    description:
                      "Every vehicle supports both Vetted Corporate Chauffeur and NIN-verified Self-Drive modes.",
                  },
                  {
                    title: "Explore Corporate SuperFlex",
                    description:
                      "Bookings of 7+ days save 10% automatically, and 30+ days unlock 22% off daily tariffs.",
                  },
                ]}
              />
            )}
          </div>
        )}
      </section>

      {/* Mandatory Chauffeur-Driven Trial, Self-Drive Evaluation & Motor Insurance */}
      <section className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pb-16">
        <DrivingEvaluationPanel compact />
      </section>

      {/* Scroll World Architecture: 4 Stages of Verified Mobility */}
      <ScrollWorldStage />

      {/* Impeccable + Taste-Skill: Architectural Dual-Ledger (Zero card-in-card nesting) */}
      <section className="border-y border-border/80 bg-secondary/35 py-16 md:py-24">
        <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Dark Pine Ledger: Rider Journey */}
            <div className="lg:col-span-6 rounded-2xl bg-[#0d1713] text-stone-100 p-7 md:p-9 border border-emerald-950 shadow-elevated flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <Badge variant="dark">Rider & Corporate Journey</Badge>
                  <span className="font-mono text-xs text-emerald-300/80 tabular-nums">
                    01 — 04
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-[-0.03em] text-stone-50">
                  From Chauffeur Trial to certified Self-Drive & NIID motor insurance
                </h2>

                <div className="mt-7 divide-y divide-white/10 border-t border-white/10">
                  {riderJourney.map((step, index) => (
                    <div
                      key={step.title}
                      className="py-4 first:pt-4 last:pb-0 grid grid-cols-12 gap-3 items-baseline"
                    >
                      <p className="col-span-3 sm:col-span-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-emerald-300 tabular-nums">
                        Step {index + 1}
                      </p>
                      <div className="col-span-9 sm:col-span-10">
                        <h3 className="text-base font-semibold text-stone-50 tracking-[-0.015em]">
                          {step.title}
                        </h3>
                        <p className="text-sm text-stone-300/90 mt-1 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Warm Stone Ledger: Host Journey */}
            <div className="lg:col-span-6 rounded-2xl bg-card text-foreground p-7 md:p-9 border border-border/90 shadow-surface flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <Badge variant="emerald">Host & Fleet Partner Journey</Badge>
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    01 — 04
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-[-0.03em] text-foreground">
                  Monetize single cars or commercial fleets across major hubs
                </h2>

                <div className="mt-7 divide-y divide-border/80 border-t border-border/80">
                  {hostJourney.map((step, index) => (
                    <div
                      key={step.title}
                      className="py-4 first:pt-4 last:pb-0 grid grid-cols-12 gap-3 items-baseline"
                    >
                      <p className="col-span-3 sm:col-span-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-primary tabular-nums">
                        Step {index + 1}
                      </p>
                      <div className="col-span-9 sm:col-span-10">
                        <h3 className="text-base font-semibold text-foreground tracking-[-0.015em]">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA Banner */}
      <section className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-16 md:py-20">
        <div className="rounded-2xl bg-[#0d1713] text-stone-100 p-8 md:p-12 border border-emerald-950 shadow-elevated flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <Badge variant="dark">Ready for Executive Mobility?</Badge>
            <h2 className="text-2xl md:text-3xl font-bold tracking-[-0.03em] text-stone-50">
              Experience enterprise rental standards tailored for Lagos, Abuja, Port Harcourt & beyond.
            </h2>
            <p className="text-stone-300 text-sm md:text-base leading-relaxed">
              Book immediate airport pickups, chauffeur-driven executive sedans, or monthly corporate fleets—or list your own vehicle to earn recurring NGN revenue.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button asChild size="lg">
              <Link href="/services">Compare services & B2B</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/20 bg-white/5 text-stone-100 hover:bg-white/10 hover:text-white"
            >
              <Link href="/host">Explore host tools</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
