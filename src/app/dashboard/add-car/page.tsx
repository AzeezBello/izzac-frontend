"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import Breadcrumbs from "../../../components/Breadcrumbs";
import EmptyStateGuide from "../../../components/EmptyStateGuide";
import { useRequireAuth } from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";
import { getApiErrorMessage } from "../../../lib/errors";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Alert, AlertDescription } from "../../../components/ui/alert";

const AddCarPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useRequireAuth(
    "/login?next=/dashboard/add-car"
  );
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [driveAvailability, setDriveAvailability] = useState(
    "Chauffeur-Driven & Verified Self-Drive"
  );
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    const enrichedDescription = `[${driveAvailability}] ${description.trim()}`;

    const formData = new FormData();
    formData.append("make", make);
    formData.append("model", model);
    formData.append("year", year);
    formData.append("price_per_day", price);
    formData.append("location", location);
    formData.append("description", enrichedDescription);
    formData.append("available", "true");
    if (image) formData.append("image", image);

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await api.post("/cars/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Car listed successfully!");
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(
        getApiErrorMessage(
          error,
          "Failed to add car. Please check required fields."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-10 md:py-16 space-y-6 animate-enter-subtle">
      <Breadcrumbs
        items={[
          { label: "My Garage", href: "/dashboard" },
          { label: "Add a Car" },
        ]}
      />

      <Card className="shadow-elevated">
        <CardHeader className="space-y-2 pb-6 border-b border-border/70">
          <div>
            <Badge variant="emerald">Nigeria & Africa Inventory Builder</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-[-0.03em] text-card-foreground leading-tight">
            List your car or fleet vehicle
          </h1>
          <CardDescription>
            Publish your vehicle for Chauffeur-Driven, Verified Self-Drive, Airport VIP, and Monthly SuperFlex corporate bookings.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {isLoading ? (
            <Loader />
          ) : !isAuthenticated ? (
            <EmptyStateGuide
              eyebrow="Host Authentication"
              title="Sign in to publish your vehicle"
              description="Once signed in, your listing appears immediately in the live Nigerian & Pan-African fleet catalogue."
              primaryAction={{
                label: "Sign in to Add Car",
                href: "/login?next=/dashboard/add-car",
              }}
              secondaryAction={{
                label: "Create Host Account",
                href: "/signup?role=host",
              }}
              tips={[
                {
                  title: "Set NGN Daily Rates",
                  description:
                    "Specify your daily Naira tariff; weekly (-10%) and monthly SuperFlex (-22%) rates are calculated automatically.",
                },
                {
                  title: "Choose Chauffeur or Self-Drive",
                  description:
                    "List with your own vetted driver or open your vehicle to NIN/FRSC-verified self-drive guests.",
                },
                {
                  title: "Upload Clear Vehicle Photos",
                  description:
                    "Show exterior condition and cabin comfort to attract corporate and airport transfer bookings.",
                },
              ]}
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="make">Make</Label>
                <Input
                  id="make"
                  type="text"
                  placeholder="e.g. Toyota"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  type="text"
                  placeholder="e.g. Land Cruiser Prado TXL"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="2024"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="font-mono tabular-nums"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">Price per day (₦ NGN)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="125000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="font-mono tabular-nums"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="location">City Hub & Neighbourhood</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g. Victoria Island, Lagos or Maitama, Abuja"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="drive-availability">Supported Drive Mode</Label>
                <select
                  id="drive-availability"
                  value={driveAvailability}
                  onChange={(e) => setDriveAvailability(e.target.value)}
                  className="w-full h-10 rounded-lg border border-input bg-card px-3 text-xs font-medium text-foreground shadow-surface focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Chauffeur-Driven & Verified Self-Drive">
                    Chauffeur-Driven & Verified Self-Drive
                  </option>
                  <option value="Chauffeur-Driven Only (Driver Supplied)">
                    Chauffeur-Driven Only (Driver Supplied)
                  </option>
                  <option value="Verified Self-Drive & Corporate SuperFlex">
                    Verified Self-Drive & Corporate SuperFlex
                  </option>
                  <option value="Interstate 4x4 & Security Convoy Ready">
                    Interstate 4x4 & Security Convoy Ready
                  </option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description & Specifications</Label>
              <Textarea
                id="description"
                placeholder="Highlight AC condition, ground clearance, leather cabin, airport handover readiness, and key features..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="image">Photo</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert variant="emerald">
                <AlertDescription className="font-semibold text-primary">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? "Posting..." : "Publish listing"}
            </Button>
          </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCarPage;
