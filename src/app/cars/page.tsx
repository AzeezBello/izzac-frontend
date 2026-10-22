"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import publicApi from "../../lib/publicApi";
import FallbackImage from "../../components/FallbackImage";
import Breadcrumbs from "../../components/Breadcrumbs";
import EmptyStateGuide from "../../components/EmptyStateGuide";
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
  resolveCarImage,
} from "../../lib/carCatalogue";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Tooltip } from "../../components/ui/tooltip";
import { Alert, AlertDescription } from "../../components/ui/alert";

const CarsPage = () => {
  const { formatPrice, currencyMeta } = useCurrency();
  const { startProductTour } = useOnboarding();
  const [cars, setCars] = useState<DetailedCar[]>(DETAILED_CAR_CATALOGUE);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [selectedCategory, setSelectedCategory] = useState<CarCategory | "All">(
    "All"
  );
  const [selectedHub, setSelectedHub] = useState<NigerianCityHub>("All Hubs");
  const [selectedServiceMode, setSelectedServiceMode] = useState<
    MobilityServiceMode | "All Modes"
  >("All Modes");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const hubParam = params.get("hub") as NigerianCityHub | null;
      const serviceParam = params.get("service") as MobilityServiceMode | null;
      const categoryParam = params.get("category") as CarCategory | null;

      if (hubParam && NIGERIAN_CITY_HUBS.includes(hubParam)) {
        setSelectedHub(hubParam);
      }
      if (serviceParam && MOBILITY_SERVICE_MODES.includes(serviceParam)) {
        setSelectedServiceMode(serviceParam);
      }
      if (categoryParam && CAR_CATEGORIES.includes(categoryParam)) {
        setSelectedCategory(categoryParam);
      }
    }
  }, []);

  useEffect(() => {
    const loadCars = async () => {
      try {
        const { data } = await publicApi.get("/cars/", {
          params: { available: "true" },
        });
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
      const withinBudget = maxPrice
        ? Number(car.price_per_day) <= Number(maxPrice)
        : true;
      return (
        matchesCategory &&
        matchesHub &&
        matchesService &&
        matchesSearch &&
        withinBudget
      );
    });
  }, [
    cars,
    search,
    maxPrice,
    selectedCategory,
    selectedHub,
    selectedServiceMode,
  ]);

  const hasFilters = Boolean(
    search ||
      maxPrice ||
      selectedCategory !== "All" ||
      selectedHub !== "All Hubs" ||
      selectedServiceMode !== "All Modes"
  );

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
    <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-10 md:py-16 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <Breadcrumbs items={[{ label: "Browse Fleet" }]} />

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-6 border-b border-border/80">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="emerald">
              Browse · {filteredCars.length} of {cars.length} Cars
            </Badge>
            <Badge variant="secondary">
              Chauffeur Trial · Self-Drive · Motor Insurance · SuperFlex
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em]">
            Available Executive & Commercial Fleet
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-[68ch]">
            Filter live listings by city hub (Lagos, Abuja, Port Harcourt, Kano), mobility service mode, or NGN budget, then configure your Chauffeur-Driven Trial, Self-Drive mode, and NIID Motor Insurance on the vehicle page.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 w-full lg:w-auto">
          <div className="space-y-1.5 flex-1 sm:w-64">
            <Label htmlFor="search-cars" className="sr-only">
              Search make, model, city, airport
            </Label>
            <Input
              id="search-cars"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search make, model, city, LOS/ABV"
            />
          </div>
          <div className="space-y-1.5 sm:w-44">
            <Label htmlFor="max-price" className="sr-only">
              Max NGN/day
            </Label>
            <Input
              id="max-price"
              type="number"
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(e.target.value ? Number(e.target.value) : "")
              }
              placeholder={`Max ₦/day (${currencyMeta.code})`}
              className="font-mono tabular-nums"
            />
          </div>
          {hasFilters && (
            <Tooltip content="Clear all search, budget, hub & category filters">
              <Button
                type="button"
                variant="ghost"
                size="default"
                onClick={() => {
                  setSearch("");
                  setMaxPrice("");
                  setSelectedCategory("All");
                  setSelectedHub("All Hubs");
                  setSelectedServiceMode("All Modes");
                }}
              >
                Reset
              </Button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* City Hub Filter Strip */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground mr-1">
          City Hub:
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
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground mr-1 shrink-0">
          Service Mode:
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
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
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
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCars.map((car, index) => {
            const superFlexDaily = Math.round(car.price_per_day * 0.78);
            return (
              <Link
                key={car.id}
                href={`/cars/${car.id}`}
                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl stagger-item"
              >
                <Card className="overflow-hidden h-full flex flex-col hover:-translate-y-0.5 hover:shadow-elevated hover:border-stone-300">
                  <div className="relative overflow-hidden bg-secondary aspect-[16/10]">
                    <FallbackImage
                      src={resolveCarImage(car)}
                      alt={`${car.year} ${car.make} ${car.model} available in ${car.location}`}
                      fetchPriority={index === 0 ? "high" : undefined}
                      loading={index >= 3 ? "lazy" : undefined}
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
                        <h2 className="text-lg font-semibold text-foreground tracking-[-0.02em] group-hover:text-primary transition-colors duration-150">
                          {car.make} {car.model}
                        </h2>
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
                      <span>Open dossier & configure services</span>
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
              eyebrow="Empty Search Result"
              title="No available vehicles match your current filters"
              description="Adjust your NGN daily budget, select 'All Hubs', or launch the Guided Product Tour to explore our fleet categories."
              primaryAction={{
                label: "Reset Filters",
                onClick: () => {
                  setSearch("");
                  setMaxPrice("");
                  setSelectedCategory("All");
                  setSelectedHub("All Hubs");
                  setSelectedServiceMode("All Modes");
                },
              }}
              secondaryAction={{
                label: "Take Product Tour",
                onClick: startProductTour,
              }}
              tips={[
                {
                  title: "Expand Your NGN Budget",
                  description:
                    "City commuters start around ₦68,000/day while armoured-ready and executive SUVs range up to ₦650,000/day.",
                },
                {
                  title: "Check Nearby Airport Hubs",
                  description:
                    "We operate dedicated desks at MMIA Lagos (LOS), Nnamdi Azikiwe Abuja (ABV), and Port Harcourt (PHC).",
                },
                {
                  title: "List Your Own Vehicle",
                  description:
                    "Have a car in this category? Publish it in My Garage to earn recurring NGN payouts.",
                },
              ]}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CarsPage;
