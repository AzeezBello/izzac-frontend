"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import publicApi from "../lib/publicApi";
import FallbackImage from "../components/FallbackImage";
import { hostJourney, riderJourney } from "../lib/productContent";
import {
  CAR_CATEGORIES,
  CarCategory,
  DETAILED_CAR_CATALOGUE,
  DetailedCar,
  mergeWithDetailedCatalogue,
  resolveCarImage,
} from "../lib/carCatalogue";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Alert, AlertDescription } from "../components/ui/alert";

const HomePage = () => {
  const [cars, setCars] = useState<DetailedCar[]>(DETAILED_CAR_CATALOGUE);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CarCategory | "All">(
    "All"
  );

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await publicApi.get("/cars/", {
          params: { available: "true" },
        });
        setCars(mergeWithDetailedCatalogue(response.data));
        setError(null);
      } catch (err) {
        console.error("Failed to fetch cars:", err);
        // Keep the 32 curated listings available if offline
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
      const matchesSearch =
        !term ||
        `${car.make} ${car.model} ${car.location} ${car.category || ""} ${car.description}`
          .toLowerCase()
          .includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [cars, search, selectedCategory]);

  return (
    <div className="bg-background">
      {/* Taste-Skill Hero Discipline: Asymmetric 12-col split within initial viewport */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <Badge variant="emerald">Peer-to-peer rides</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.35rem] font-bold text-foreground tracking-[-0.035em] leading-[1.06]">
              Browse, book, host, and manage every trip from one Izzac account.
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-[58ch] leading-relaxed">
              Izzac brings the full rental loop together: discover live listings, open detailed car pages, confirm bookings,
              publish your own cars, and monitor trips as both rider and host.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button asChild size="lg">
                <Link href="/cars">Browse cars</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/dashboard/bookings">View bookings</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard/add-car">List your car</Link>
              </Button>
            </div>

            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-border/80 max-w-lg">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Mode
                </p>
                <p className="font-mono text-sm font-semibold text-foreground mt-0.5 tabular-nums">
                  Rider + Host
                </p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Pricing
                </p>
                <p className="font-mono text-sm font-semibold text-foreground mt-0.5 tabular-nums">
                  Instant / Day
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
            <div className="relative rounded-2xl border border-border/90 bg-card p-2.5 shadow-elevated">
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
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-lg border border-white/15 bg-[#0d1713]/85 px-3.5 py-2.5 text-xs text-stone-100 backdrop-blur-md">
                  <span className="font-mono uppercase tracking-[0.14em] text-emerald-300">
                    Direct booking loop
                  </span>
                  <span className="font-mono tabular-nums text-stone-200">
                    {cars.length} Verified Vehicles
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impeccable + Taste-Skill: Architectural Dual-Ledger (Zero card-in-card nesting) */}
      <section className="border-y border-border/80 bg-secondary/35 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Dark Pine Ledger: Rider Journey */}
            <div className="lg:col-span-6 rounded-2xl bg-[#0d1713] text-stone-100 p-7 md:p-9 border border-emerald-950 shadow-elevated flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <Badge variant="dark">Rider journey</Badge>
                  <span className="font-mono text-xs text-emerald-300/80 tabular-nums">
                    01 — 04
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-[-0.03em] text-stone-50">
                  From discovery to confirmed trip
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
                  <Badge variant="emerald">Host journey</Badge>
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    01 — 04
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-[-0.03em] text-foreground">
                  Launch a listing and manage it end to end
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

      {/* Live Catalogue Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div className="space-y-2">
            <Badge variant="secondary">Live Catalogue · {cars.length} Vehicles</Badge>
            <h2 className="text-3xl font-bold text-foreground tracking-[-0.03em]">
              Available cars
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Search by make, model, or location and jump into booking-ready car pages.
            </p>
          </div>
          <div className="w-full md:w-72">
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search e.g. Toyota Lagos"
              aria-label="Search available cars"
            />
          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <Link
                href={`/cars/${car.id}`}
                key={car.id}
                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl stagger-item"
              >
                <Card className="overflow-hidden h-full flex flex-col hover:-translate-y-0.5 hover:shadow-elevated hover:border-stone-300">
                  <div className="relative overflow-hidden bg-secondary aspect-[16/10]">
                    <FallbackImage
                      src={resolveCarImage(car)}
                      alt={`${car.make} ${car.model}`}
                      loading="lazy"
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
                        <h3 className="text-lg font-semibold text-foreground tracking-[-0.02em] group-hover:text-primary transition-colors duration-150">
                          {car.make} {car.model}
                        </h3>
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
                      <span>Inspect vehicle & dates</span>
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
                No cars match your search yet. Try a different city or make.
              </div>
            )}
          </div>
        )}
      </section>

      {/* Closing CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
        <div className="rounded-2xl bg-[#0d1713] text-stone-100 p-8 md:p-12 border border-emerald-950 shadow-elevated flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <Badge variant="dark">Ready to use the full app?</Badge>
            <h2 className="text-2xl md:text-3xl font-bold tracking-[-0.03em] text-stone-50">
              Choose your next action based on how you want to use Izzac.
            </h2>
            <p className="text-stone-300 text-sm md:text-base leading-relaxed">
              Riders can browse and book immediately, while hosts can move straight into listing creation, garage management,
              and booking oversight from the same account.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button asChild size="lg">
              <Link href="/signup">Create an account</Link>
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
