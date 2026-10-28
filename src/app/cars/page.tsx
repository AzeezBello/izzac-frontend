"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import publicApi from "../../lib/publicApi";
import EmptyStateGuide from "../../components/EmptyStateGuide";
import VehicleCard from "../../components/VehicleCard";
import FleetFilters, {
  DEFAULT_FLEET_FILTERS,
  type FleetFilterState,
  type FleetSortOption,
} from "../../components/FleetFilters";
import { useAuth } from "../../context/AuthContext";
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
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Container } from "../../components/layout/Container";
import { PageHeader } from "../../components/layout/PageHeader";
import { ArrowLink } from "../../components/layout/ArrowLink";

const CarsPage = () => {
  const { isAuthenticated } = useAuth();
  const { formatPrice } = useCurrency();
  const { startProductTour } = useOnboarding();
  const [cars, setCars] = useState<DetailedCar[]>(DETAILED_CAR_CATALOGUE);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [sortBy, setSortBy] = useState<FleetSortOption>("featured");
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
    const list = cars.filter((car) => {
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

    if (sortBy === "price-asc") {
      return [...list].sort((a, b) => Number(a.price_per_day) - Number(b.price_per_day));
    }
    if (sortBy === "price-desc") {
      return [...list].sort((a, b) => Number(b.price_per_day) - Number(a.price_per_day));
    }
    if (sortBy === "year-desc") {
      return [...list].sort((a, b) => Number(b.year) - Number(a.year));
    }
    return list;
  }, [cars, search, maxPrice, sortBy, filters]);

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<CarCategory | "All", number>> = { All: cars.length };
    for (const category of CAR_CATEGORIES) {
      counts[category] = cars.filter((c) => c.category === category).length;
    }
    return counts;
  }, [cars]);

  const resetAll = () => {
    setSearch("");
    setMaxPrice("");
    setSortBy("featured");
    setFilters(DEFAULT_FLEET_FILTERS);
  };

  const activeTags: { key: string; label: string; onClear: () => void }[] = [];
  if (filters.hub !== "All Hubs") {
    activeTags.push({
      key: "hub",
      label: `Hub: ${filters.hub}`,
      onClear: () => setFilters((prev) => ({ ...prev, hub: "All Hubs" })),
    });
  }
  if (filters.service !== "All Modes") {
    activeTags.push({
      key: "service",
      label: filters.service,
      onClear: () => setFilters((prev) => ({ ...prev, service: "All Modes" })),
    });
  }
  if (filters.category !== "All") {
    activeTags.push({
      key: "category",
      label: filters.category,
      onClear: () => setFilters((prev) => ({ ...prev, category: "All" })),
    });
  }
  if (maxPrice) {
    activeTags.push({
      key: "budget",
      label: `Max ${formatPrice(maxPrice)}/day`,
      onClear: () => setMaxPrice(""),
    });
  }
  if (search.trim()) {
    activeTags.push({
      key: "search",
      label: `“${search.trim()}”`,
      onClear: () => setSearch(""),
    });
  }
  if (fromDate) {
    activeTags.push({
      key: "from",
      label: `From ${fromDate}`,
      onClear: () => setFromDate(null),
    });
  }

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

  return (
    <Container className="py-10 md:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <PageHeader
        breadcrumbs={[{ label: "Fleet" }]}
        eyebrow="Browse"
        title="The fleet"
        description="Executive sedans, luxury SUVs, crossovers, EVs and 4x4 pickups across Lagos, Abuja, Port Harcourt and Kano. Select a class or filter by hub, mode and budget."
        actions={
          <ArrowLink href="/services" size="sm" tone="foreground">
            Compare service modes
          </ArrowLink>
        }
      />

      {/* Unified compact sticky filter bar */}
      <div className="sticky top-[var(--header-height)] z-20 -mx-4 mt-6 border-y border-border/70 bg-background/95 px-4 py-3 backdrop-blur-md sm:mx-0 sm:px-0">
        <FleetFilters
          value={filters}
          onChange={setFilters}
          counts={categoryCounts}
          search={search}
          onSearchChange={setSearch}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onReset={resetAll}
          show={{ hub: true, service: true, category: true, search: true, budget: true, sort: true }}
        />
      </div>

      {/* Live status & removable active filter pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-mono text-xs text-muted-foreground tabular-nums">
            Showing <span className="font-semibold text-foreground">{filteredCars.length}</span> of {cars.length} vehicles
          </p>
          {activeTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pl-1">
              {activeTags.map((tag) => (
                <button
                  key={tag.key}
                  type="button"
                  onClick={tag.onClear}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-2.5 py-0.5 font-mono text-2xs text-foreground transition-colors hover:border-foreground/40"
                  aria-label={`Remove filter ${tag.label}`}
                >
                  <span>{tag.label}</span>
                  <span aria-hidden="true" className="text-muted-foreground">×</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="font-mono text-2xs text-muted-foreground">
          NIID insured · Chauffeur or verified Self-Drive
        </p>
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
              description={
                isAuthenticated
                  ? "Widen the daily budget, switch to all hubs, or take the product tour to see how the fleet is organised."
                  : "Widen the daily budget, switch to all hubs, or compare our mobility service modes."
              }
              primaryAction={{ label: "Reset filters", onClick: resetAll }}
              secondaryAction={
                isAuthenticated
                  ? { label: "Take the tour", onClick: startProductTour }
                  : { label: "Compare services", href: "/services" }
              }
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
