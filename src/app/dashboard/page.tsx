"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../lib/api";
import FallbackImage from "../../components/FallbackImage";
import { resolveApiAssetUrl } from "../../lib/config";
import { useRequireAuth } from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
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
      } catch (error) {
        console.error("Failed to fetch cars:", error);
        setError("Unable to load your cars right now.");
      }
    };

    fetchCars();
  }, [isAuthenticated]);

  if (isLoading) return <Loader />;
  if (!isAuthenticated) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-8 animate-enter-subtle">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border/80">
        <div className="space-y-2">
          <Badge variant="emerald">Host</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em]">
            Your garage
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage the cars you share on Izzac.
          </p>
        </div>
        <Button asChild size="default">
          <Link href="/dashboard/add-car">Add a car</Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <Card
            key={car.id}
            className="overflow-hidden flex flex-col hover:border-stone-300 hover:shadow-elevated stagger-item"
          >
            <div className="relative overflow-hidden bg-secondary aspect-[16/10]">
              <FallbackImage
                src={resolveApiAssetUrl(car.image)}
                alt={`${car.make} ${car.model}`}
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
                  ${car.price_per_day}{" "}
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
          <div className="col-span-full rounded-2xl border border-dashed border-border py-14 px-6 text-center text-muted-foreground">
            You have not listed any cars yet.{" "}
            <Link
              href="/dashboard/add-car"
              className="text-primary font-semibold hover:underline"
            >
              Add your first car.
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostDashboard;
