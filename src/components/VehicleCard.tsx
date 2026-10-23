"use client";

import Link from "next/link";
import FallbackImage from "./FallbackImage";
import { useCurrency } from "../context/CurrencyContext";
import { resolveCarImage, type DetailedCar } from "../lib/carCatalogue";
import { cn } from "@/lib/utils";

export interface VehicleCardProps {
  car: Pick<DetailedCar, "id" | "make" | "model" | "year" | "price_per_day" | "image" | "location"> &
    Partial<DetailedCar>;
  priority?: boolean;
  /** `default` for grids; `wide` for horizontal rows; `compact` for sidebars. */
  layout?: "default" | "wide" | "compact";
  /** Overrides the footer label (e.g. "Chauffeur trial ready"). */
  footer?: React.ReactNode;
  className?: string;
  href?: string;
}

const SpecChip = ({ children }: { children: React.ReactNode }) => (
  <span className="font-mono text-2xs text-muted-foreground tabular-nums">{children}</span>
);

/** Editorial vehicle tile: image, name, hub line, price. Minimal chrome. */
export function VehicleCard({ car, priority, layout = "default", footer, className, href }: VehicleCardProps) {
  const { formatPrice } = useCurrency();
  const superFlex = Math.round(Number(car.price_per_day) * 0.78);
  const hub = car.cityHub || car.location?.split(",").pop()?.trim() || car.location;
  const link = href ?? `/cars/${car.id}`;

  if (layout === "compact") {
    return (
      <Link
        href={link}
        className={cn(
          "group flex items-center gap-4 rounded-md py-3 transition-colors duration-150 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
      >
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-sm bg-secondary">
          <FallbackImage src={resolveCarImage(car)} alt={`${car.make} ${car.model}`} loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-150">
            {car.make} {car.model}
          </p>
          <p className="font-mono text-2xs text-muted-foreground tabular-nums">
            {car.year} · {hub}
          </p>
        </div>
        <p className="font-mono text-sm font-semibold tabular-nums text-foreground">{formatPrice(car.price_per_day)}</p>
      </Link>
    );
  }

  return (
    <Link
      href={link}
      className={cn(
        "group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        layout === "wide" && "sm:grid sm:grid-cols-12 sm:gap-6",
        className
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-lg bg-secondary",
          layout === "wide" ? "aspect-[4/3] sm:col-span-5 sm:aspect-auto sm:h-full sm:min-h-[180px]" : "aspect-[4/3]"
        )}
      >
        <FallbackImage
          src={resolveCarImage(car)}
          alt={`${car.year} ${car.make} ${car.model} available in ${car.location}`}
          fetchPriority={priority ? "high" : undefined}
          loading={priority ? undefined : "lazy"}
          className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          {car.category && (
            <span className="rounded-full bg-surface-elevated/90 px-2.5 py-1 font-mono text-2xs font-medium text-foreground backdrop-blur-sm">
              {car.category}
            </span>
          )}
        </div>
        {car.hubAirport && (
          <span className="absolute bottom-3 left-3 rounded-full bg-ink/85 px-2.5 py-1 font-mono text-2xs text-signal backdrop-blur-sm">
            {car.hubAirport.split(" · ")[0]}
          </span>
        )}
      </div>

      <div className={cn("flex flex-col justify-between", layout === "wide" ? "sm:col-span-7 pt-4 sm:pt-1" : "pt-4")}>
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-[17px] font-medium leading-snug tracking-[-0.015em] text-foreground group-hover:text-primary transition-colors duration-150">
              {car.make} {car.model}
            </h3>
            <p className="shrink-0 text-right font-mono text-[15px] font-semibold tabular-nums text-foreground">
              {formatPrice(car.price_per_day)}
              <span className="ml-0.5 font-sans text-xs font-normal text-muted-foreground">/day</span>
            </p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-2xs text-muted-foreground tabular-nums truncate">
              {car.year} · {hub}
              {car.chauffeurRecommended ? " · Chauffeur-first" : ""}
            </p>
            <p className="shrink-0 font-mono text-2xs text-primary tabular-nums">SuperFlex {formatPrice(superFlex)}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3">
          <div className="flex items-center gap-3">
            {car.transmission && <SpecChip>{car.transmission}</SpecChip>}
            {car.drivetrain && <SpecChip>{car.drivetrain}</SpecChip>}
            {car.seats && <SpecChip>{car.seats} seats</SpecChip>}
          </div>
          <span className="text-xs font-medium text-foreground/70 group-hover:text-primary transition-colors duration-150">
            {footer ?? (
              <>
                Configure{" "}
                <span aria-hidden="true" className="inline-block transition-transform duration-200 ease-out-quart group-hover:translate-x-0.5">
                  →
                </span>
              </>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default VehicleCard;
