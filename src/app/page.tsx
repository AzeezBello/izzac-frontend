"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import publicApi from "../lib/publicApi";
import EmptyStateGuide from "../components/EmptyStateGuide";
import DrivingEvaluationPanel from "../components/DrivingEvaluationPanel";
import VehicleCard from "../components/VehicleCard";
import FleetFilters, { DEFAULT_FLEET_FILTERS, type FleetFilterState } from "../components/FleetFilters";
import { ScrollWorldStage } from "../components/scrollworld/ScrollWorldStage";
import { Reveal } from "../components/motion/Reveal";
import { useAuth } from "../context/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import { useOnboarding } from "../context/OnboardingContext";
import { hostJourney, riderJourney, SERVICE_PILLARS } from "../lib/productContent";
import {
  CAR_CATEGORIES,
  DETAILED_CAR_CATALOGUE,
  DetailedCar,
  mergeWithDetailedCatalogue,
  MOBILITY_SERVICE_MODES,
  MobilityServiceMode,
  NIGERIAN_CITY_HUBS,
  NigerianCityHub,
} from "../lib/carCatalogue";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  ArrowLink,
  Container,
  Eyebrow,
  InkPanel,
  Ledger,
  LedgerRow,
  Section,
  SectionHeading,
  Stat,
  StatStrip,
} from "../components/layout";
import { cn, pad } from "@/lib/utils";

const FEATURED_LIMIT = 8;
const SLIDE_INTERVAL_MS = 6000;

interface HeroSlide {
  id: number;
  image: string;
  alt: string;
  tag: string;
  vehicle: string;
  hub: string;
  mode: string;
  rateNgn: number;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 14,
    image: "/images/hero-bg.webp",
    alt: "Executive SUV and luxury saloon parked at a contemporary Lagos residence",
    tag: "Executive Residence · Ikoyi",
    vehicle: "Land Cruiser 300 GR Sport",
    hub: "Lagos · LOS",
    mode: "Chauffeur & Protocol",
    rateNgn: 320000,
  },
  {
    id: 11,
    image: "/images/cars/mercedes-gle450-2024.jpg",
    alt: "2024 Mercedes-Benz GLE 450 4MATIC staged for VIP corporate transfer",
    tag: "Diplomatic Corridor · Maitama",
    vehicle: "Mercedes-Benz GLE 450 4MATIC",
    hub: "Abuja · ABV",
    mode: "Executive Chauffeur",
    rateNgn: 260000,
  },
  {
    id: 12,
    image: "/images/cars/range-rover-velar-2023.jpg",
    alt: "2023 Range Rover Velar R-Dynamic available for verified self-drive and chauffeur",
    tag: "Coastal Reserve · Victoria Island",
    vehicle: "Range Rover Velar R-Dynamic",
    hub: "Lagos · LOS",
    mode: "Verified Self-Drive",
    rateNgn: 245000,
  },
  {
    id: 16,
    image: "/images/cars/porsche-cayenne-coupe-2023.jpg",
    alt: "2023 Porsche Cayenne Coupe parked for executive weekend reserve",
    tag: "Weekend & Protocol · Lekki Phase 1",
    vehicle: "Porsche Cayenne Coupe",
    hub: "Lagos · LOS",
    mode: "Self-Drive & Chauffeur",
    rateNgn: 310000,
  },
  {
    id: 14,
    image: "/images/cars/toyota-land-cruiser-300-2024.jpg",
    alt: "2024 Toyota Land Cruiser 300 GR Sport engineered for interstate federal highways",
    tag: "Interstate Authority · Asokoro",
    vehicle: "Toyota Land Cruiser 300 GR Sport",
    hub: "Abuja · ABV",
    mode: "Security Escort Ready",
    rateNgn: 320000,
  },
];

const HomePage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { formatPrice } = useCurrency();
  const { openOnboarding } = useOnboarding();
  const [cars, setCars] = useState<DetailedCar[]>(DETAILED_CAR_CATALOGUE);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FleetFilterState>(DEFAULT_FLEET_FILTERS);

  // Fullscreen hero background slider state
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Quick-search panel state (hero)
  const [quickHub, setQuickHub] = useState<NigerianCityHub>("All Hubs");
  const [quickMode, setQuickMode] = useState<MobilityServiceMode | "All Modes">("Chauffeur & Protocol");
  const [quickDate, setQuickDate] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setIsPaused(true);
    }
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await publicApi.get("/cars/", { params: { available: "true" } });
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
      const matchesCategory = filters.category === "All" || car.category === filters.category;
      const matchesHub = filters.hub === "All Hubs" || car.cityHub === filters.hub;
      const matchesService =
        filters.service === "All Modes" || (car.serviceModes && car.serviceModes.includes(filters.service));
      const matchesSearch =
        !term ||
        `${car.make} ${car.model} ${car.location} ${car.category || ""} ${car.hubAirport || ""} ${car.description}`
          .toLowerCase()
          .includes(term);
      return matchesCategory && matchesHub && matchesService && matchesSearch;
    });
  }, [cars, search, filters]);

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<(typeof CAR_CATEGORIES)[number] | "All", number>> = { All: cars.length };
    for (const category of CAR_CATEGORIES) {
      counts[category] = cars.filter((c) => c.category === category).length;
    }
    return counts;
  }, [cars]);

  const lowestRate = useMemo(
    () => cars.reduce((min, c) => Math.min(min, Number(c.price_per_day) || Infinity), Infinity),
    [cars]
  );
  const hubCount = useMemo(() => new Set(cars.map((c) => c.cityHub).filter(Boolean)).size, [cars]);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (quickHub !== "All Hubs") params.set("hub", quickHub);
    if (quickMode !== "All Modes") params.set("service", quickMode);
    if (quickDate) params.set("from", quickDate);
    const query = params.toString();
    router.push(query ? `/cars?${query}` : "/cars");
  };

  const resetFilters = () => {
    setSearch("");
    setFilters(DEFAULT_FLEET_FILTERS);
  };

  const currentSlide = HERO_SLIDES[activeSlide] || HERO_SLIDES[0];
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);

  return (
    <div className="bg-background">
      {/* ------------------------------------------------------------ Hero */}
      <section
        aria-label="Featured fleet showcase"
        className="relative flex min-h-[calc(100svh-var(--header-height))] w-full flex-col justify-between overflow-hidden bg-ink text-ink-foreground"
      >
        {/* Fullscreen background image slider */}
        <div className="absolute inset-0 z-0" aria-hidden="true">
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === activeSlide;
            return (
              <div
                key={`${slide.image}-${index}`}
                className={cn(
                  "absolute inset-0 transition-[opacity,transform] duration-1000 ease-out-quart",
                  isActive ? "z-10 scale-100 opacity-100" : "z-0 scale-[1.04] opacity-0 pointer-events-none"
                )}
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  fetchPriority={index === 0 ? "high" : "low"}
                  loading={index === 0 ? undefined : "lazy"}
                  className="object-cover object-center"
                />
              </div>
            );
          })}

          {/* Minimal directional overlays: protect text & bottom dock while keeping photography vibrant */}
          <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-ink/75 via-ink/35 to-transparent" />
          <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-ink/80 via-ink/15 to-ink/20" />
        </div>

        {/* Foreground hero stage */}
        <Container className="relative z-10 flex flex-1 flex-col justify-between py-10 md:py-14 lg:py-16">
          {/* Top / middle narrative + active vehicle spotlight */}
          <div className="my-auto grid grid-cols-1 items-end gap-10 py-6 lg:grid-cols-12 lg:gap-12">
            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-ink/45 px-3.5 py-1.5 backdrop-blur-md">
                <Eyebrow index="01" tone="signal">
                  Executive mobility · Lagos, Abuja, Port Harcourt
                </Eyebrow>
              </div>

              <h1 className="text-display-xl max-w-[13ch] text-white drop-shadow-[0_2px_16px_rgba(13,23,19,0.5)]">
                Executive mobility, on your terms.
              </h1>

              <p className="max-w-[52ch] text-base leading-relaxed text-white/90 drop-shadow-[0_1px_10px_rgba(13,23,19,0.45)] md:text-lg">
                Chauffeur-driven sedans, verified self-drive, airport protocol and monthly corporate fleets.
                Every trip carries NIID motor insurance. One account, rider or host.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button asChild size="lg" className="shadow-floating">
                  <Link href="/cars">
                    Explore the fleet <span aria-hidden="true">→</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="inverse"
                  size="lg"
                  className="border-white/25 bg-ink/45 text-white backdrop-blur-md hover:border-white/40 hover:bg-ink/65"
                >
                  <Link href="/services">Compare services</Link>
                </Button>
                <Button
                  asChild
                  variant="inverse"
                  size="lg"
                  className="border-white/20 bg-white/10 text-white backdrop-blur-md hover:border-white/35 hover:bg-white/20"
                >
                  <Link href="/host">Become a host</Link>
                </Button>
              </div>
            </div>

            {/* Active slide vehicle telemetry & slider controls */}
            <div className="lg:col-span-5 lg:flex lg:justify-end">
              <div className="w-full max-w-md rounded-xl border border-white/20 bg-ink/55 p-5 text-white shadow-floating backdrop-blur-md">
                <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-3">
                  <span className="type-eyebrow text-signal">{currentSlide.tag}</span>
                  <span className="font-mono text-xs text-white/75 tabular-nums">
                    {pad(activeSlide + 1)} / {pad(HERO_SLIDES.length)}
                  </span>
                </div>

                <div className="mt-3.5 flex items-end justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-lg font-semibold tracking-[-0.02em] text-white">{currentSlide.vehicle}</p>
                    <p className="font-mono text-xs text-white/75 tabular-nums">
                      {currentSlide.hub} · {currentSlide.mode}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="type-eyebrow text-white/70">From</p>
                    <p className="font-mono text-xl font-semibold text-white tabular-nums leading-none">
                      {formatPrice(currentSlide.rateNgn)}
                      <span className="ml-1 font-sans text-xs font-normal text-white/75">/day</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/15 pt-3.5">
                  <div className="flex items-center gap-1.5" role="group" aria-label="Choose hero slide">
                    {HERO_SLIDES.map((slide, idx) => (
                      <button
                        key={`${slide.vehicle}-${idx}`}
                        type="button"
                        onClick={() => setActiveSlide(idx)}
                        aria-label={`Slide ${idx + 1}: ${slide.vehicle}`}
                        aria-current={idx === activeSlide ? "true" : undefined}
                        className="group inline-flex min-h-6 min-w-6 items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                      >
                        <span
                          className={cn(
                            "h-1.5 rounded-full transition-[width,background-color] duration-200 ease-out-quart",
                            idx === activeSlide ? "w-6 bg-signal" : "w-2 bg-white/40 group-hover:bg-white/70"
                          )}
                        />
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={prevSlide}
                      aria-label="Previous slide"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white transition-colors duration-150 hover:bg-white/20 active:scale-[0.98]"
                    >
                      <span aria-hidden="true" className="font-mono text-xs">←</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPaused((prev) => !prev)}
                      aria-pressed={isPaused}
                      aria-label={isPaused ? "Resume background slideshow" : "Pause background slideshow"}
                      className="inline-flex h-8 px-2.5 items-center justify-center rounded-md border border-white/20 bg-white/10 font-mono text-2xs text-white transition-colors duration-150 hover:bg-white/20 active:scale-[0.98]"
                    >
                      {isPaused ? "Play" : "Pause"}
                    </button>
                    <button
                      type="button"
                      onClick={nextSlide}
                      aria-label="Next slide"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white transition-colors duration-150 hover:bg-white/20 active:scale-[0.98]"
                    >
                      <span aria-hidden="true" className="font-mono text-xs">→</span>
                    </button>
                    <Link
                      href={`/cars/${currentSlide.id}`}
                      className="ml-1 inline-flex h-8 items-center gap-1 rounded-md bg-primary px-3 font-mono text-2xs font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary-hover active:scale-[0.98]"
                    >
                      Inspect <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Docked quick-search bar */}
          <div className="pt-4">
            <form
              onSubmit={handleQuickSearch}
              className="grid grid-cols-1 gap-3 rounded-xl border border-white/25 bg-surface-elevated/95 p-3.5 text-foreground shadow-floating backdrop-blur-md sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end"
              aria-label="Find a vehicle"
            >
              <div className="space-y-1.5">
                <Label htmlFor="quick-hub">Hub</Label>
                <Select id="quick-hub" value={quickHub} onChange={(e) => setQuickHub(e.target.value as NigerianCityHub)}>
                  {NIGERIAN_CITY_HUBS.map((hub) => (
                    <option key={hub} value={hub}>
                      {hub}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="quick-mode">Mode</Label>
                <Select
                  id="quick-mode"
                  value={quickMode}
                  onChange={(e) => setQuickMode(e.target.value as MobilityServiceMode | "All Modes")}
                >
                  <option value="All Modes">Any mode</option>
                  {MOBILITY_SERVICE_MODES.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="quick-date">From</Label>
                <Input
                  id="quick-date"
                  type="date"
                  value={quickDate}
                  onChange={(e) => setQuickDate(e.target.value)}
                  className="font-mono text-xs tabular-nums"
                />
              </div>
              <Button type="submit" size="default" className="sm:col-span-2 lg:col-span-1">
                Find a car
              </Button>
            </form>
          </div>
        </Container>
      </section>

      {/* --------------------------------------------------- Telemetry Bar */}
      <Section spacing="sm" rule="bottom">
        <StatStrip columns={4}>
          <Stat
            label="Live fleet"
            value={`${cars.length}`}
            detail={
              Number.isFinite(lowestRate)
                ? `From ${formatPrice(lowestRate)}/day · Sedans, SUVs & EVs`
                : "Sedans, SUVs, EVs and 4x4 pickups"
            }
          />
          <Stat label="City hubs" value={`${hubCount || 6}`} detail="LOS · ABV · PHC · KAN · IBA · ENU" />
          <Stat label="Motor insurance" value="NIID" detail="Verified certificate on every booking" />
          <Stat label="SuperFlex" value="−22%" tone="primary" detail="Monthly rate · −10% weekly" />
        </StatStrip>
      </Section>

      {/* -------------------------------------------------------- Services */}
      <Section>
        <SectionHeading
          eyebrow="What we run"
          index="02"
          title="Six services, one booking flow."
          lede="Every service is a toggle on the vehicle page, priced per day. No quote forms."
          action={<ArrowLink href="/services">Compare all services</ArrowLink>}
        />
        <Reveal className="mt-10" selector=":scope > div > *" stagger={0.06}>
          <Ledger>
            {SERVICE_PILLARS.map((service, index) => (
              <LedgerRow
                key={service.code}
                index={pad(index + 1)}
                title={service.title}
                description={service.description}
                aside={
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-mono text-sm font-semibold tabular-nums text-foreground">{service.priceTag}</span>
                    <ArrowLink href={service.href} size="sm">
                      {service.cta}
                    </ArrowLink>
                  </div>
                }
              />
            ))}
          </Ledger>
        </Reveal>
      </Section>

      {/* ----------------------------------------------------------- Fleet */}
      <Section rule="top" tone="surface">
        <SectionHeading
          eyebrow="Live catalogue"
          index="03"
          title="Available now across the hubs."
          lede={`${filteredCars.length} of ${cars.length} vehicles match. Select a class or filter by hub and model.`}
          action={<ArrowLink href="/cars">Full fleet directory ({cars.length})</ArrowLink>}
        />

        <FleetFilters
          className="mt-8 border-y border-border/70 py-3.5"
          value={filters}
          onChange={setFilters}
          counts={categoryCounts}
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search Prado, Hilux, Abuja…"
          onReset={resetFilters}
          show={{ hub: true, category: true, service: false, search: true }}
        />

        {error ? (
          <Alert variant="destructive" className="mt-8">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : filteredCars.length === 0 ? (
          <div className="mt-8">
            <EmptyStateGuide
              eyebrow="No matches"
              title="No vehicles match these filters."
              description="Widen the hub or class filter, or clear the search."
              primaryAction={{ label: "Reset filters", onClick: resetFilters }}
              secondaryAction={
                isAuthenticated
                  ? { label: "Open onboarding", onClick: openOnboarding }
                  : { label: "Compare services", href: "/services" }
              }
              tips={[
                { title: "Try all hubs", description: "Vehicles are spread across Lagos, Abuja, Port Harcourt and Kano." },
                { title: "Any mode works", description: "Every vehicle supports chauffeur and verified self-drive." },
                { title: "Longer stays save", description: "7+ days takes 10% off, 30+ days takes 22% off." },
              ]}
            />
          </div>
        ) : (
          <>
            <Reveal className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" stagger={0.05}>
              {filteredCars.slice(0, FEATURED_LIMIT).map((car, index) => (
                <VehicleCard key={car.id} car={car} priority={index < 2} />
              ))}
            </Reveal>
            <div className="mt-10 flex items-center justify-between border-t border-border/70 pt-6">
              <p className="font-mono text-xs text-muted-foreground tabular-nums">
                Showing {Math.min(FEATURED_LIMIT, filteredCars.length)} of {filteredCars.length}
              </p>
              <ArrowLink href="/cars">View all {cars.length} vehicles</ArrowLink>
            </div>
          </>
        )}
      </Section>

      {/* ------------------------------------------------------ Evaluation */}
      <Section rule="top">
        <DrivingEvaluationPanel compact />
      </Section>

      {/* ------------------------------------------------------ Narrative */}
      <ScrollWorldStage />

      {/* ------------------------------------------------- Rider vs Host */}
      <Section>
        <InkPanel padding="lg">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Eyebrow index="05" tone="signal">
                Two sides, one account
              </Eyebrow>
              <h2 className="mt-5 text-display text-ink-foreground">Ride it. Or earn from it.</h2>
              <p className="mt-5 max-w-[40ch] text-[15px] leading-relaxed text-ink-muted">
                Riders start chauffeured, pass the driving test, then unlock self-drive. Hosts list a car and
                get paid on every handover.
              </p>
              <div className="mt-8 flex flex-wrap gap-2.5">
                <Button asChild>
                  <Link href="/cars">Book a ride</Link>
                </Button>
                <Button asChild variant="inverse">
                  <Link href="/host">Become a host</Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:col-span-8 md:grid-cols-2 md:gap-12">
              <div>
                <p className="type-eyebrow text-signal">Rider journey</p>
                <Ledger inverted flush className="mt-4 border-t border-white/10">
                  {riderJourney.map((step, index) => (
                    <LedgerRow key={step.title} inverted density="compact" index={pad(index + 1)} title={step.title} description={step.description} className="py-5" />
                  ))}
                </Ledger>
              </div>
              <div>
                <p className="type-eyebrow text-signal">Host journey</p>
                <Ledger inverted flush className="mt-4 border-t border-white/10">
                  {hostJourney.map((step, index) => (
                    <LedgerRow key={step.title} inverted density="compact" index={pad(index + 1)} title={step.title} description={step.description} className="py-5" />
                  ))}
                </Ledger>
              </div>
            </div>
          </div>
        </InkPanel>
      </Section>

      {/* -------------------------------------------------------------- CTA */}
      <Section rule="top" spacing="sm" className="pb-20 md:pb-28">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[40rem] space-y-4">
            <Eyebrow index="06">Get started</Eyebrow>
            <h2 className="text-h1 text-foreground">Enterprise rental standards, built for Nigerian roads.</h2>
            <p className="type-lede">Book an airport pickup, a chauffeured sedan or a monthly fleet. Or list your own car.</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Button asChild size="lg">
              <Link href="/services">Compare services</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/cars/list-car">List your car</Link>
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default HomePage;
