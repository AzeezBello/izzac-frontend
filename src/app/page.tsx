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
  Eyebrow,
  InkPanel,
  Ledger,
  LedgerRow,
  Section,
  SectionHeading,
  Stat,
  StatStrip,
} from "../components/layout";
import { pad } from "@/lib/utils";

const FEATURED_LIMIT = 8;

const HomePage = () => {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const { openOnboarding } = useOnboarding();
  const [cars, setCars] = useState<DetailedCar[]>(DETAILED_CAR_CATALOGUE);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FleetFilterState>(DEFAULT_FLEET_FILTERS);

  // Quick-search panel state (hero)
  const [quickHub, setQuickHub] = useState<NigerianCityHub>("All Hubs");
  const [quickMode, setQuickMode] = useState<MobilityServiceMode | "All Modes">("Chauffeur & Protocol");
  const [quickDate, setQuickDate] = useState("");

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

  return (
    <div className="bg-background">
      {/* ------------------------------------------------------------ Hero */}
      <Section spacing="sm" className="pt-10 md:pt-16 lg:pt-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col justify-between lg:col-span-7">
            <div className="space-y-7">
              <Eyebrow index="01">Executive mobility · Lagos, Abuja, Port Harcourt</Eyebrow>
              <h1 className="text-display-xl max-w-[12ch] text-foreground">
                Executive mobility, on your terms.
              </h1>
              <p className="type-lede max-w-[52ch]">
                Chauffeur-driven sedans, verified self-drive, airport protocol and monthly corporate fleets.
                Every trip carries NIID motor insurance. One account, rider or host.
              </p>
            </div>

            <form
              onSubmit={handleQuickSearch}
              className="mt-10 grid grid-cols-1 gap-3 rounded-lg border border-border/80 bg-surface-elevated p-3 shadow-card sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end"
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

          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-xl bg-secondary">
              <Image
                src="/images/hero-bg.webp"
                alt="Executive SUV and luxury sedan parked at a contemporary Lagos residence"
                width={1600}
                height={1000}
                sizes="(max-width: 1024px) 100vw, 42vw"
                priority
                fetchPriority="high"
                className="aspect-[4/3] w-full object-cover lg:aspect-[4/5]"
              />
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 rounded-md border border-white/10 bg-ink/85 px-4 py-3 text-ink-foreground backdrop-blur-md">
                <div className="space-y-0.5">
                  <p className="type-eyebrow text-signal">From</p>
                  <p className="font-mono text-xl font-semibold tabular-nums leading-none">
                    {Number.isFinite(lowestRate) ? formatPrice(lowestRate) : "—"}
                    <span className="ml-1 font-sans text-xs font-normal text-ink-muted">/day</span>
                  </p>
                </div>
                <p className="text-right font-mono text-2xs text-ink-muted tabular-nums">
                  {cars.length} vehicles
                  <br />
                  Chauffeur · Self-drive
                </p>
              </div>
            </div>
          </div>
        </div>

        <StatStrip columns={4} className="mt-14 md:mt-20">
          <Stat label="Live fleet" value={`${cars.length}`} detail="Sedans, SUVs, EVs and 4x4 pickups" />
          <Stat label="City hubs" value={`${hubCount || 6}`} detail="LOS · ABV · PHC · KAN · IBA · ENU" />
          <Stat label="Motor insurance" value="NIID" detail="Verified certificate on every booking" />
          <Stat label="SuperFlex" value="−22%" tone="primary" detail="Monthly rate · −10% weekly" />
        </StatStrip>
      </Section>

      {/* -------------------------------------------------------- Services */}
      <Section rule="top">
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
          lede={`${filteredCars.length} of ${cars.length} vehicles match. Filter by hub or class, or search by model.`}
          action={
            <div className="w-full md:w-72">
              <Label htmlFor="home-search" className="sr-only">
                Search vehicles
              </Label>
              <Input
                id="home-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Prado, Hilux, Abuja…"
              />
            </div>
          }
        />

        <FleetFilters
          className="mt-8"
          value={filters}
          onChange={setFilters}
          counts={categoryCounts}
          show={{ hub: true, category: true, service: false }}
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
              secondaryAction={{ label: "Open onboarding", onClick: openOnboarding }}
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
