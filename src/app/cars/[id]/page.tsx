"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import BookCarForm from "@/components/BookCarForm";
import FallbackImage from "@/components/FallbackImage";
import Breadcrumbs from "@/components/Breadcrumbs";
import Loader from "@/components/Loader";
import { useCurrency } from "@/context/CurrencyContext";
import publicApi from "@/lib/publicApi";
import { SITE_URL } from "@/lib/seo";
import { pad } from "@/lib/utils";
import {
  DetailedCar,
  enrichCarWithAfricanMobility,
  findCatalogueMatch,
  getCatalogueCarById,
  resolveCarImage,
} from "@/lib/carCatalogue";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/layout/Eyebrow";
import { Stat, StatStrip } from "@/components/layout/Stat";
import { ArrowLink } from "@/components/layout/ArrowLink";
import { cn } from "@/lib/utils";

const CarDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const fromParam = searchParams?.get("from") || "";
  const defaultStartDate = /^\d{4}-\d{2}-\d{2}$/.test(fromParam) ? fromParam : undefined;
  const { formatPrice } = useCurrency();
  const initialId = Number(params?.id);
  const initialCatalogueCar = !Number.isNaN(initialId) ? getCatalogueCarById(initialId) : undefined;

  const [car, setCar] = useState<DetailedCar | null>(initialCatalogueCar || null);
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
      <Container size="narrow" className="space-y-6 py-12">
        <Breadcrumbs items={[{ label: "Fleet", href: "/cars" }, { label: "Vehicle not found" }]} />
        <h1 className="text-h1 text-foreground">This vehicle isn&apos;t available</h1>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <ArrowLink href="/cars">Back to the fleet</ArrowLink>
      </Container>
    );
  }

  if (!car) {
    return (
      <Container className="py-12">
        <Loader label="Loading vehicle" />
      </Container>
    );
  }

  const weeklyDailyRate = Math.round(car.price_per_day * 0.9);
  const monthlyDailyRate = Math.round(car.price_per_day * 0.78);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${car.year} ${car.make} ${car.model}`,
    description: car.description,
    image: `${SITE_URL}${resolveCarImage(car)}`,
    brand: { "@type": "Brand", name: car.make },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/cars/${car.id}`,
      priceCurrency: "NGN",
      price: car.price_per_day,
      availability: "https://schema.org/InStock",
    },
  };

  const rateTiers = [
    { label: "1–6 days", note: "Standard", value: car.price_per_day, emphasis: false },
    { label: "7–29 days", note: "Weekly −10%", value: weeklyDailyRate, emphasis: false },
    { label: "30+ days", note: "SuperFlex −22%", value: monthlyDailyRate, emphasis: true },
  ];

  return (
    <Container className="py-8 md:py-12 animate-enter-subtle">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Breadcrumbs items={[{ label: "Fleet", href: "/cars" }, { label: `${car.make} ${car.model}` }]} />
        <ArrowLink href="/services" size="sm" tone="foreground">
          How trial, driving test and insurance work
        </ArrowLink>
      </div>

      <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Left: imagery, telemetry, rates, specs */}
        <div className="space-y-10 lg:col-span-7">
          <div className="relative overflow-hidden rounded-xl bg-secondary">
            <FallbackImage
              src={resolveCarImage(car)}
              alt={`${car.year} ${car.make} ${car.model} available in ${car.location}`}
              fetchPriority="high"
              className="aspect-[16/10] w-full object-cover"
            />
            {car.hubAirport && (
              <span className="absolute bottom-4 left-4 rounded-full bg-ink/85 px-3 py-1.5 font-mono text-2xs text-ink-foreground backdrop-blur-sm">
                Hub · <span className="text-signal">{car.hubAirport}</span>
              </span>
            )}
            {car.category && (
              <span className="absolute left-4 top-4 rounded-full bg-surface-elevated/90 px-3 py-1.5 font-mono text-2xs font-medium text-foreground backdrop-blur-sm">
                {car.category}
              </span>
            )}
          </div>

          <StatStrip columns={4}>
            <Stat label="Location" value={<span className="font-sans text-base font-medium">{car.location}</span>} size="sm" />
            <Stat label="Year · seats" value={`${car.year} · ${car.seats || 5}`} size="sm" />
            <Stat
              label="Powertrain"
              value={<span className="text-base">{`${car.drivetrain || "FWD"} · ${car.fuelType || "Petrol"}`}</span>}
              size="sm"
            />
            <Stat label="Daily rate" value={formatPrice(car.price_per_day)} size="sm" tone="primary" />
          </StatStrip>

          <section aria-labelledby="rates-heading" className="space-y-4">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="rates-heading" className="text-h3 text-foreground">
                Rates by duration
              </h2>
              <span className="font-mono text-2xs text-muted-foreground">Applied automatically from your dates</span>
            </div>
            <div className="grid grid-cols-1 divide-y divide-border/70 rounded-lg border border-border/80 bg-surface-elevated sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {rateTiers.map((tier) => (
                <div key={tier.label} className={cn("space-y-2 p-5", tier.emphasis && "bg-primary-soft/50")}>
                  <p className="font-mono text-2xs uppercase tracking-[0.1em] text-muted-foreground tabular-nums">{tier.label}</p>
                  <p className={cn("font-mono text-xl font-semibold tabular-nums tracking-tight", tier.emphasis ? "text-primary" : "text-foreground")}>
                    {formatPrice(tier.value)}
                    <span className="ml-1 font-sans text-xs font-normal text-muted-foreground">/day</span>
                  </p>
                  <p className={cn("text-xs", tier.emphasis ? "font-medium text-primary" : "text-muted-foreground")}>{tier.note}</p>
                </div>
              ))}
            </div>
          </section>

          {(car.serviceModes?.length || car.terrainReadiness) && (
            <section aria-labelledby="modes-heading" className="space-y-4">
              <div className="flex items-baseline justify-between gap-3">
                <h2 id="modes-heading" className="text-h3 text-foreground">
                  Supported modes
                </h2>
                {car.terrainReadiness && (
                  <span className="font-mono text-2xs text-muted-foreground">{car.terrainReadiness}</span>
                )}
              </div>
              <ul className="flex flex-wrap gap-2">
                {(car.serviceModes || []).map((mode) => (
                  <li
                    key={mode}
                    className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-surface-elevated px-3.5 text-[13px] font-medium text-foreground/85"
                  >
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {mode}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {car.features && car.features.length > 0 && (
            <section aria-labelledby="features-heading" className="space-y-4">
              <div className="flex items-baseline justify-between gap-3">
                <h2 id="features-heading" className="text-h3 text-foreground">
                  Equipment
                </h2>
                {car.transmission && (
                  <span className="font-mono text-2xs text-muted-foreground tabular-nums">
                    {car.transmission} · {car.seats || 5} seats
                  </span>
                )}
              </div>
              <ol className="grid grid-cols-1 border-t border-border/70 sm:grid-cols-2 sm:gap-x-10">
                {car.features.map((feature, idx) => (
                  <li key={feature} className="flex items-baseline gap-4 border-b border-border/70 py-3">
                    <span className="w-6 shrink-0 font-mono text-xs text-primary tabular-nums">{pad(idx + 1)}</span>
                    <span className="text-[15px] text-foreground/90">{feature}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        {/* Right: identity + booking */}
        <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-5">
          <div className="space-y-3">
            <Eyebrow>{car.chauffeurRecommended ? "Chauffeur-first vehicle" : "Chauffeur or self-drive"}</Eyebrow>
            <h1 className="text-h1 text-foreground">
              {car.make} {car.model}
            </h1>
            <p className="text-[15px] leading-relaxed text-muted-foreground">{car.description}</p>
          </div>

          <BookCarForm
            carId={car.id}
            pricePerDay={car.price_per_day}
            defaultChauffeur={car.chauffeurRecommended}
            hubAirport={car.hubAirport}
            defaultStartDate={defaultStartDate}
          />
        </div>
      </div>
    </Container>
  );
};

export default CarDetailsPage;
