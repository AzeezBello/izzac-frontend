"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import publicApi from "../../lib/publicApi";
import FallbackImage from "../../components/FallbackImage";
import { resolveApiAssetUrl } from "../../lib/config";
import {
  CAR_CATEGORIES,
  CarCategory,
  DETAILED_CAR_CATALOGUE,
  DetailedCar,
  mergeWithDetailedCatalogue,
} from "../../lib/carCatalogue";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Alert, AlertDescription } from "../../components/ui/alert";

const resolveImage = (path?: string) => {
  if (path?.startsWith("/images/")) return path;
  return resolveApiAssetUrl(path, "/images/hero-bg.webp");
};

const CarsPage = () => {
  const [cars, setCars] = useState<DetailedCar[]>(DETAILED_CAR_CATALOGUE);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [selectedCategory, setSelectedCategory] = useState<CarCategory | "All">(
    "All"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCars = async () => {
      try {
        const { data } = await publicApi.get("/cars/", {
          params: { available: "true" },
        });
        setCars(mergeWithDetailedCatalogue(data));
        setError(null);
      } catch (err) {
        console.error(err);
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
      const matchesSearch =
        !term ||
        `${car.make} ${car.model} ${car.location} ${car.category || ""} ${car.description}`
          .toLowerCase()
          .includes(term);
      const withinBudget = maxPrice
        ? Number(car.price_per_day) <= Number(maxPrice)
        : true;
      return matchesCategory && matchesSearch && withinBudget;
    });
  }, [cars, search, maxPrice, selectedCategory]);

  const hasFilters = Boolean(
    search || maxPrice || selectedCategory !== "All"
  );

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-6 border-b border-border/80">
        <div className="space-y-2">
          <Badge variant="emerald">Browse · {filteredCars.length} of {cars.length} Cars</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em]">
            Available cars
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-[56ch]">
            Filter live listings by location, category, or daily budget and tap a card to view full vehicle specs.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 w-full lg:w-auto">
          <div className="space-y-1.5 flex-1 sm:w-64">
            <Label htmlFor="search-cars" className="sr-only">
              Search make, model, city
            </Label>
            <Input
              id="search-cars"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search make, model, city"
            />
          </div>
          <div className="space-y-1.5 sm:w-40">
            <Label htmlFor="max-price" className="sr-only">
              Max $/day
            </Label>
            <Input
              id="max-price"
              type="number"
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(e.target.value ? Number(e.target.value) : "")
              }
              placeholder="Max $/day"
              className="font-mono tabular-nums"
            />
          </div>
          {hasFilters && (
            <Button
              type="button"
              variant="ghost"
              size="default"
              onClick={() => {
                setSearch("");
                setMaxPrice("");
                setSelectedCategory("All");
              }}
            >
              Reset
            </Button>
          )}
        </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <Link
              key={car.id}
              href={`/cars/${car.id}`}
              className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl stagger-item"
            >
              <Card className="overflow-hidden h-full flex flex-col hover:-translate-y-0.5 hover:shadow-elevated hover:border-stone-300">
                <div className="relative overflow-hidden bg-secondary aspect-[16/10]">
                  <FallbackImage
                    src={resolveImage(car.image)}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
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
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <h2 className="text-lg font-semibold text-foreground tracking-[-0.02em] group-hover:text-primary transition-colors duration-150">
                        {car.make} {car.model}
                      </h2>
                      <p className="font-mono text-base font-bold text-primary tabular-nums shrink-0">
                        ${car.price_per_day}{" "}
                        <span className="font-sans text-xs font-normal text-muted-foreground">
                          /day
                        </span>
                      </p>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground tabular-nums">
                      {car.year} • {car.location}
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
                    <span>Open vehicle dossier</span>
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
          ))}
          {!error && filteredCars.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-border py-14 px-6 text-center text-muted-foreground">
              No available cars found with those filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CarsPage;
