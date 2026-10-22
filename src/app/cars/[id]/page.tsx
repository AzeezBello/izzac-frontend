"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import BookCarForm from "@/components/BookCarForm";
import FallbackImage from "@/components/FallbackImage";
import Loader from "@/components/Loader";
import publicApi from "@/lib/publicApi";
import { resolveApiAssetUrl } from "@/lib/config";
import {
  DetailedCar,
  getCatalogueCarById,
} from "@/lib/carCatalogue";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

const resolveImage = (path?: string) => {
  if (path?.startsWith("/images/")) return path;
  return resolveApiAssetUrl(path, "/images/hero-bg.webp");
};

const CarDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const [car, setCar] = useState<DetailedCar | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    const numericId = Number(params.id);
    const catalogueMatch = getCatalogueCarById(numericId);

    const fetchCar = async () => {
      try {
        const response = await publicApi.get(`/cars/${params.id}/`);
        const apiCar = response.data;
        setCar({
          ...catalogueMatch,
          ...apiCar,
          price_per_day: Number(apiCar.price_per_day),
          description:
            apiCar.description && apiCar.description.length > 40
              ? apiCar.description
              : catalogueMatch?.description || apiCar.description,
        });
        setError(null);
      } catch (err) {
        if (catalogueMatch) {
          setCar(catalogueMatch);
          setError(null);
        } else {
          console.error("Failed to fetch car details:", err);
          setError("Car not found or an error occurred.");
        }
      }
    };

    fetchCar();
  }, [params]);

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!car) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14 space-y-8 animate-enter-subtle">
      <div>
        <Link
          href="/cars"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground transition-colors duration-150"
        >
          <span aria-hidden="true">←</span>
          <span>Back to live catalogue</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-card p-2 shadow-surface">
            <FallbackImage
              src={resolveImage(car.image)}
              alt={`${car.make} ${car.model}`}
              className="w-full h-80 sm:h-96 object-cover rounded-xl"
            />
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
                Year
              </p>
              <p className="font-mono text-sm font-semibold text-foreground mt-1 tabular-nums">
                <span className="sr-only">Year: </span>
                {car.year}
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
                ${car.price_per_day}{" "}
                <span className="font-sans text-xs font-normal text-muted-foreground">
                  /day
                </span>
              </p>
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
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em]">
              {car.make} {car.model}
            </h1>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              {car.description}
            </p>
          </div>

          <BookCarForm carId={car.id} pricePerDay={car.price_per_day} />
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;
