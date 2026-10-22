"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import BookCarForm from "@/components/BookCarForm";
import FallbackImage from "@/components/FallbackImage";
import Breadcrumbs from "@/components/Breadcrumbs";
import Loader from "@/components/Loader";
import { useCurrency } from "@/context/CurrencyContext";
import publicApi from "@/lib/publicApi";
import { SITE_URL } from "@/lib/seo";
import {
  DetailedCar,
  enrichCarWithAfricanMobility,
  findCatalogueMatch,
  getCatalogueCarById,
  resolveCarImage,
} from "@/lib/carCatalogue";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CarDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const { formatPrice } = useCurrency();
  const initialId = Number(params?.id);
  const initialCatalogueCar = !Number.isNaN(initialId)
    ? getCatalogueCarById(initialId)
    : undefined;

  const [car, setCar] = useState<DetailedCar | null>(
    initialCatalogueCar || null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    const numericId = Number(params.id);
    const catalogueMatch = getCatalogueCarById(numericId);
    if (catalogueMatch) {
      setCar((prev) => prev || catalogueMatch);
    }

    const fetchCar = async () => {
      try {
        const response = await publicApi.get(`/cars/${params.id}/`);
        const apiCar = response.data;
        const matched = findCatalogueMatch(apiCar) || catalogueMatch;
        setCar(
          enrichCarWithAfricanMobility({
            ...matched,
            ...apiCar,
            image: resolveCarImage(apiCar, matched?.image),
            price_per_day: Number(apiCar.price_per_day),
            description:
              apiCar.description && apiCar.description.length > 40
                ? apiCar.description
                : matched?.description || apiCar.description,
          })
        );
        setError(null);
      } catch {
        if (catalogueMatch) {
          setCar(catalogueMatch);
          setError(null);
        } else {
          setError("Car not found or an error occurred.");
        }
      }
    };

    fetchCar();
  }, [params]);

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 space-y-6">
        <Breadcrumbs
          items={[
            { label: "Browse Fleet", href: "/cars" },
            { label: "Vehicle Not Found" },
          ]}
        />
        <h1 className="text-3xl font-bold text-foreground tracking-[-0.03em]">
          Vehicle dossier unavailable
        </h1>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!car) return <Loader />;

  const weeklyDailyRate = Math.round(car.price_per_day * 0.9);
  const monthlyDailyRate = Math.round(car.price_per_day * 0.78);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${car.year} ${car.make} ${car.model}`,
    description: car.description,
    image: `${SITE_URL}${resolveCarImage(car)}`,
    brand: {
      "@type": "Brand",
      name: car.make,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/cars/${car.id}`,
      priceCurrency: "NGN",
      price: car.price_per_day,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14 space-y-6 animate-enter-subtle">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Breadcrumbs
          items={[
            { label: "Browse Fleet", href: "/cars" },
            { label: `${car.make} ${car.model}` },
          ]}
        />
        <Link
          href="/services"
          className="font-mono text-xs text-primary hover:underline"
        >
          View Chauffeur Trial, Self-Drive Exam & Motor Insurance details →
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-card p-2 shadow-surface">
            <div className="relative">
              <FallbackImage
                src={resolveCarImage(car)}
                alt={`${car.year} ${car.make} ${car.model} available in ${car.location}`}
                fetchPriority="high"
                className="w-full h-80 sm:h-96 object-cover rounded-xl"
              />
              {car.hubAirport && (
                <div className="absolute bottom-3 left-3 rounded-lg border border-white/15 bg-[#0d1713]/85 px-3 py-1.5 font-mono text-xs text-stone-100 backdrop-blur-md">
                  Hub: <span className="text-emerald-300">{car.hubAirport}</span>
                </div>
              )}
            </div>
          </div>

          {/* Architectural tabular telemetry strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 rounded-2xl border border-border/80 bg-card divide-y sm:divide-y-0 sm:divide-x divide-border/80 shadow-surface overflow-hidden">
            <div className="p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Location
              </p>
              <p className="text-sm font-semibold text-foreground mt-1">
                <span className="sr-only">Location: </span>
                {car.location}
              </p>
            </div>
            <div className="p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Year & Spec
              </p>
              <p className="font-mono text-sm font-semibold text-foreground mt-1 tabular-nums">
                {car.year} · {car.seats || 5} Seats
              </p>
            </div>
            <div className="p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Powertrain
              </p>
              <p className="font-mono text-sm font-semibold text-foreground mt-1">
                {car.drivetrain || "FWD"} · {car.fuelType || "Petrol"}
              </p>
            </div>
            <div className="p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Daily Rate
              </p>
              <p className="font-mono text-sm font-bold text-primary mt-1 tabular-nums">
                {formatPrice(car.price_per_day)}{" "}
                <span className="font-sans text-xs font-normal text-muted-foreground">
                  /day
                </span>
              </p>
            </div>
          </div>

          {/* Duration Subscription Tiers Strip (Daily vs Weekly -10% vs Monthly SuperFlex -22%) */}
          <div className="rounded-2xl border border-border/80 bg-secondary/45 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
                Flexible Duration & Corporate SuperFlex Pricing
              </span>
              <Badge variant="emerald">Auto-Applied by Dates</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs tabular-nums">
              <div className="rounded-xl border border-border/80 bg-card p-3">
                <p className="text-muted-foreground">1–6 Days (Standard)</p>
                <p className="text-sm font-bold text-foreground mt-1">
                  {formatPrice(car.price_per_day)} /day
                </p>
              </div>
              <div className="rounded-xl border border-border/80 bg-card p-3">
                <p className="text-primary font-semibold">7–29 Days (-10% Weekly)</p>
                <p className="text-sm font-bold text-foreground mt-1">
                  {formatPrice(weeklyDailyRate)} /day
                </p>
              </div>
              <div className="rounded-xl border border-primary/40 bg-card p-3">
                <p className="text-primary font-semibold">30+ Days (-22% SuperFlex)</p>
                <p className="text-sm font-bold text-primary mt-1">
                  {formatPrice(monthlyDailyRate)} /day
                </p>
              </div>
            </div>
          </div>

          {/* Mobility Readiness Ledger */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-surface space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                Supported Executive Mobility Modes
              </h2>
              {car.terrainReadiness && (
                <Badge variant="secondary">{car.terrainReadiness}</Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {(car.serviceModes || []).map((mode) => (
                <span
                  key={mode}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-secondary/60 px-3 py-1.5 font-mono text-xs font-medium text-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {mode}
                </span>
              ))}
            </div>
          </div>

          {car.features && car.features.length > 0 && (
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-surface space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                  Vehicle Equipment & Specifications
                </h2>
                {car.transmission && (
                  <span className="font-mono text-xs text-muted-foreground">
                    {car.transmission} · {car.seats || 5} Seats
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {car.features.map((feature, idx) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2.5 text-sm text-foreground/90"
                  >
                    <span className="font-mono text-xs font-semibold text-primary tabular-nums">
                      0{idx + 1}
                    </span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="emerald">Car detail</Badge>
              {car.category && (
                <Badge variant="secondary">{car.category}</Badge>
              )}
              {car.chauffeurRecommended && (
                <Badge variant="outline">Chauffeur Recommended</Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em]">
              {car.make} {car.model}
            </h1>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              {car.description}
            </p>
          </div>

          <BookCarForm
            carId={car.id}
            pricePerDay={car.price_per_day}
            defaultChauffeur={car.chauffeurRecommended}
            hubAirport={car.hubAirport}
          />
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;
