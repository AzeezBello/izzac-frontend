"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import publicApi from "../../lib/publicApi";
import EmptyStateGuide from "../../components/EmptyStateGuide";
import VehicleCard from "../../components/VehicleCard";
import FleetFilters, { DEFAULT_FLEET_FILTERS, type FleetFilterState } from "../../components/FleetFilters";
import { useCurrency } from "../../context/CurrencyContext";
import { useOnboarding } from "../../context/OnboardingContext";
import { SITE_URL } from "../../lib/seo";
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
} from "../../lib/carCatalogue";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Container } from "../../components/layout/Container";
import { PageHeader } from "../../components/layout/PageHeader";
import { ArrowLink } from "../../components/layout/ArrowLink";

const CarsPage = () => {
  const { currencyMeta } = useCurrency();
  const { startProductTour } = useOnboarding();
  const [cars, setCars] = useState<DetailedCar[]>(DETAILED_CAR_CATALOGUE);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [filters, setFilters] = useState<FleetFilterState>(DEFAULT_FLEET_FILTERS);
  const [error, setError] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const fromParam = params.get("from");
    if (fromParam && /^\d{4}-\d{2}-\d{2}$/.test(fromParam)) setFromDate(fromParam);
    const hubParam = params.get("hub") as NigerianCityHub | null;
    const serviceParam = params.get("service") as MobilityServiceMode | null;
    const categoryParam = params.get("category") as CarCategory | null;

    setFilters((prev) => ({
      hub: hubParam && NIGERIAN_CITY_HUBS.includes(hubParam) ? hubParam : prev.hub,
      service: serviceParam && MOBILITY_SERVICE_MODES.includes(serviceParam) ? serviceParam : prev.service,
      category: categoryParam && CAR_CATEGORIES.includes(categoryParam) ? categoryParam : prev.category,
    }));
  }, []);

  useEffect(() => {
    const loadCars = async () => {
      try {
        const { data } = await publicApi.get("/cars/", { params: { available: "true" } });
        setCars(mergeWithDetailedCatalogue(data));
        setError(null);
      } catch {
        setCars(DETAILED_CAR_CATALOGUE);
      }
    };
    loadCars();
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
      const withinBudget = maxPrice ? Number(car.price_per_day) <= Number(maxPrice) : true;
      return matchesCategory && matchesHub && matchesService && matchesSearch && withinBudget;
    });
  }, [cars, search, maxPrice, filters]);

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<CarCategory | "All", number>> = { All: cars.length };
    for (const category of CAR_CATEGORIES) {
      counts[category] = cars.filter((c) => c.category === category).length;
    }
    return counts;
  }, [cars]);

  const hasFilters = Boolean(
    search || maxPrice || filters.category !== "All" || filters.hub !== "All Hubs" || filters.service !== "All Modes"
  );

  const resetAll = () => {
    setSearch("");
    setMaxPrice("");
    setFilters(DEFAULT_FLEET_FILTERS);
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Izzac Mobility Executive Vehicle Fleet",
    numberOfItems: filteredCars.length,
    itemListElement: filteredCars.slice(0, 12).map((car, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${SITE_URL}/cars/${car.id}`,
      name: `${car.year} ${car.make} ${car.model} (${car.location})`,
    })),
  };

  const scopeLine = [
    filters.hub !== "All Hubs" ? filters.hub : "All hubs",
    filters.service !== "All Modes" ? filters.service : null,
    filters.category !== "All" ? filters.category : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Container className="py-10 md:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <PageHeader
        breadcrumbs={[{ label: "Fleet" }]}
        eyebrow="Browse"
        title="The fleet"
        description="Executive sedans, luxury SUVs, crossovers, EVs and 4x4 pickups across Lagos, Abuja, Port Harcourt and Kano. Filter by hub, mode or budget, then configure chauffeur, insurance and dates on the vehicle page."
        actions={
          <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:items-end lg:w-auto">
            <div className="w-full sm:w-64">
              <Label htmlFor="search-cars" className="sr-only">
                Search make, model, city or airport
              </Label>
              <Input
                id="search-cars"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search make, model, hub…"
              />
            </div>
            <div className="w-full sm:w-44">
              <Label htmlFor="max-price" className="sr-only">
                Maximum daily rate
              </Label>
              <Input
                id="max-price"
                type="number"
                inputMode="numeric"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
                placeholder={`Max ₦/day (${currencyMeta.code})`}
                className="font-mono tabular-nums"
              />
            </div>
            {hasFilters && (
              <Button type="button" variant="ghost" onClick={resetAll}>
                Reset
              </Button>
            )}
          </div>
        }
      />

      <div className="sticky top-[var(--header-height)] z-20 -mx-4 mt-8 border-y border-border/70 bg-background/90 px-4 py-4 backdrop-blur-md sm:mx-0 sm:px-0">
        <FleetFilters value={filters} onChange={setFilters} counts={categoryCounts} />
      </div>

      <div className="flex items-baseline justify-between gap-4 py-6">
        <p className="font-mono text-xs text-muted-foreground tabular-nums">
          <span className="text-foreground">{filteredCars.length}</span> of {cars.length} vehicles · {scopeLine}
        </p>
        <ArrowLink href="/services" size="sm" tone="foreground">
          Compare services
        </ArrowLink>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCars.map((car, index) => (
            <VehicleCard
              key={car.id}
              car={car}
              priority={index < 4}
              className="stagger-item"
              href={fromDate ? `/cars/${car.id}?from=${fromDate}` : undefined}
            />
          ))}
          {filteredCars.length === 0 && (
            <EmptyStateGuide
              eyebrow="No matches"
              title="No vehicles match these filters"
              description="Widen the daily budget, switch to all hubs, or take the product tour to see how the fleet is organised."
              primaryAction={{ label: "Reset filters", onClick: resetAll }}
              secondaryAction={{ label: "Take the tour", onClick: startProductTour }}
              tips={[
                {
                  title: "Widen the budget",
                  description: "City commuters start around ₦68,000 a day; executive and escort SUVs reach ₦650,000.",
                },
                {
                  title: "Check nearby airports",
                  description: "Dedicated desks operate at MMIA Lagos (LOS), Nnamdi Azikiwe Abuja (ABV) and Port Harcourt (PHC).",
                },
                {
                  title: "List your own vehicle",
                  description: "Have a car in this class? Publish it from your garage and earn recurring payouts.",
                },
              ]}
            />
          )}
        </div>
      )}

      <div className="mt-16 flex flex-col gap-4 border-y border-border/70 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-lg font-medium tracking-[-0.015em] text-foreground">Have a car that belongs here?</p>
          <p className="text-sm text-muted-foreground">
            Publish it once. Weekly and SuperFlex pricing, guest vetting and insurance are handled for you.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/cars/list-car">List your car</Link>
        </Button>
      </div>
    </Container>
  );
};

export default CarsPage;
