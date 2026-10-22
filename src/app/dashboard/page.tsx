"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../lib/api";
import FallbackImage from "../../components/FallbackImage";
import Breadcrumbs from "../../components/Breadcrumbs";
import EmptyStateGuide from "../../components/EmptyStateGuide";
import { useCurrency } from "../../context/CurrencyContext";
import { resolveCarImage } from "../../lib/carCatalogue";
import { useRequireAuth } from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Tooltip } from "../../components/ui/tooltip";
import { Alert, AlertDescription } from "../../components/ui/alert";

type Car = {
  id: number;
  make: string;
  model: string;
  year: number;
  price_per_day: number;
  image: string;
  location: string;
};

const HostDashboard = () => {
  const { formatPrice } = useCurrency();
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading } = useRequireAuth(
    "/login?next=/dashboard"
  );

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCars = async () => {
      try {
        const response = await api.get("/cars/my/");
        setCars(response.data);
      } catch {
        setError("Unable to load your cars right now.");
      }
    };

    fetchCars();
  }, [isAuthenticated]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16 space-y-8 animate-enter-subtle">
      <Breadcrumbs items={[{ label: "My Garage" }]} />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border/80">
        <div className="space-y-2">
          <Badge variant="emerald">Host & Fleet Partner</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em]">
            Your garage
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage the vehicles you share across Izzac’s Chauffeur, Self-Drive, Airport VIP, and Corporate SuperFlex channels.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Tooltip content="Inspect reservations placed on your vehicles">
            <Button asChild variant="outline" size="default">
              <Link href="/dashboard/bookings">Host bookings</Link>
            </Button>
          </Tooltip>
          <Tooltip content="Publish a new vehicle to the live Nigerian & African fleet">
            <Button asChild size="default">
              <Link href="/dashboard/add-car">Add a car</Link>
            </Button>
          </Tooltip>
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : !isAuthenticated ? (
        <EmptyStateGuide
          eyebrow="Authentication Required"
          title="Sign in to access your Host Garage"
          description="Your garage lets you publish vehicles, set NGN daily rates, and monitor corporate or chauffeur bookings."
          primaryAction={{
            label: "Sign in to My Garage",
            href: "/login?next=/dashboard",
          }}
          secondaryAction={{
            label: "Create Host Account",
            href: "/signup?role=host",
          }}
          tips={[
            {
              title: "List Single Cars or Commercial Fleets",
              description:
                "Publish executive sedans, SUVs, or Hilux 4x4 units in Lagos, Abuja, Port Harcourt, and Kano.",
            },
            {
              title: "Choose Chauffeur or Self-Drive",
              description:
                "Specify whether your vehicle is Chauffeur-Only (driver supplied) or open to NIN-verified Self-Drive.",
            },
            {
              title: "Earn Monthly SuperFlex Revenue",
              description:
                "Capture high-utilization 30-day corporate subscriptions alongside daily airport transfers.",
            },
          ]}
        />
      ) : (
        <>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car, index) => (
              <Card
                key={car.id}
                className="overflow-hidden flex flex-col hover:border-stone-300 hover:shadow-elevated stagger-item"
              >
                <div className="relative overflow-hidden bg-secondary aspect-[16/10]">
                  <FallbackImage
                    src={resolveCarImage(car)}
                    alt={`${car.year} ${car.make} ${car.model} listed in ${car.location}`}
                    fetchPriority={index === 0 ? "high" : undefined}
                    loading={index >= 3 ? "lazy" : undefined}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge
                      variant="outline"
                      className="bg-card/90 backdrop-blur-sm tabular-nums"
                    >
                      {car.year}
                    </Badge>
                  </div>
                </div>
                <div className="p-5 space-y-1.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="text-lg font-semibold text-foreground tracking-[-0.02em]">
                      {car.make} {car.model}
                    </h2>
                    <p className="font-mono text-base font-bold text-primary tabular-nums">
                      {formatPrice(car.price_per_day)}{" "}
                      <span className="font-sans text-xs font-normal text-muted-foreground">
                        /day
                      </span>
                    </p>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground tabular-nums">
                    {car.year} • {car.location}
                  </p>
                </div>
              </Card>
            ))}

            {cars.length === 0 && !error && (
              <EmptyStateGuide
                eyebrow="Empty Host Garage"
                title="You haven’t published any vehicles in your garage yet"
                description="Follow these three steps to turn your sedan, SUV, or pickup into a bookable asset on Izzac."
                primaryAction={{
                  label: "Add Your First Car",
                  href: "/dashboard/add-car",
                }}
                secondaryAction={{
                  label: "Review Host Guide",
                  href: "/host",
                }}
                tips={[
                  {
                    title: "Set Your NGN Daily Tariff",
                    description:
                      "Enter your base daily rate in Naira; Izzac automatically calculates weekly (-10%) and SuperFlex (-22%) corporate pricing.",
                  },
                  {
                    title: "Select Supported Drive Mode",
                    description:
                      "Choose whether your car is Chauffeur-Only (with your driver) or available for NIN/FRSC-verified Self-Drive.",
                  },
                  {
                    title: "Highlight Nigerian Readiness",
                    description:
                      "Mention ice-cold AC, ground clearance, and airport handover proximity (LOS, ABV, PHC) to boost bookings.",
                  },
                ]}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HostDashboard;
