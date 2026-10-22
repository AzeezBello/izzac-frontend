"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import Breadcrumbs from "../../../components/Breadcrumbs";
import DashboardNav from "../../../components/DashboardNav";
import EmptyStateGuide from "../../../components/EmptyStateGuide";
import { useCurrency } from "../../../context/CurrencyContext";
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
  const { formatPrice } = useCurrency();
  const { isAuthenticated, isLoading } = useRequireAuth(
    "/login?next=/dashboard/add-car"
  );
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("2024");
  const [price, setPrice] = useState("135000");
  const [location, setLocation] = useState("");
  const [driveAvailability, setDriveAvailability] = useState(
    "Chauffeur-Driven Trial & Evaluated Self-Drive"
  );
  const [niidPolicyStatus, setNiidPolicyStatus] = useState(
    "NIID Comprehensive Fleet Cover Active"
  );
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const numericPrice = Number(price) > 0 ? Number(price) : 135000;
  const weeklyRate = Math.round(numericPrice * 0.9);
  const superFlexRate = Math.round(numericPrice * 0.78);
  const estimatedMonthlySuperFlex = superFlexRate * 22;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    const enrichedDescription = `[${driveAvailability} · ${niidPolicyStatus}] ${description.trim()}`;

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
      router.push("/dashboard/host");
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
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 md:py-12 space-y-8 animate-enter-subtle">
      <Breadcrumbs
        items={[
          { label: "My Garage & Dashboards", href: "/dashboard" },
          { label: "Host Fleet Garage", href: "/dashboard/host" },
          { label: "Publish Vehicle" },
        ]}
      />

      <DashboardNav />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <Card className="shadow-elevated">
            <CardHeader className="space-y-2 pb-6 border-b border-border/70">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="emerald">Host Fleet Inventory Studio</Badge>
                <Badge variant="secondary">
                  Guest Chauffeur-Trial Gate + Motor Insurance
                </Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-[-0.03em] text-card-foreground leading-tight">
                List your car or commercial fleet vehicle
              </h1>
              <CardDescription>
                Publish your vehicle for Chauffeur-Driven Trial, Evaluated Self-Drive (≥80% Driving Test required), Airport VIP, and Monthly SuperFlex corporate bookings.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {isLoading ? (
                <Loader />
              ) : !isAuthenticated ? (
                <EmptyStateGuide
                  eyebrow="Host Authentication"
                  title="Sign in to publish your vehicle"
                  description="Once signed in, your listing appears immediately in the live fleet catalogue with full guest vetting and NIID insurance enforcement."
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
                      title: "Set Daily Rates",
                      description:
                        "Specify your daily tariff; weekly (-10%) and monthly SuperFlex (-22%) rates are calculated automatically.",
                    },
                    {
                      title: "Mandatory Guest Chauffeur-Trial Gate",
                      description:
                        "First-time riders must complete a Chauffeur-Driven Trial and pass the ≥80% Driving Test before booking Self-Drive.",
                    },
                    {
                      title: "Verified Motor Insurance",
                      description:
                        "Every booking binds a verified NIID motor insurance policy for complete host protection.",
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
                        placeholder="135000"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="font-mono tabular-nums"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <Label htmlFor="drive-availability">
                        Supported Drive Mode & Self-Drive Gate
                      </Label>
                      <select
                        id="drive-availability"
                        value={driveAvailability}
                        onChange={(e) => setDriveAvailability(e.target.value)}
                        className="w-full h-10 rounded-lg border border-input bg-card px-3 text-xs font-medium text-foreground shadow-surface focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="Chauffeur-Driven Trial & Evaluated Self-Drive">
                          Chauffeur-Driven Trial & Evaluated Self-Drive
                        </option>
                        <option value="Chauffeur-Driven Only (Driver Supplied)">
                          Chauffeur-Driven Only (Driver Supplied)
                        </option>
                        <option value="Evaluated Self-Drive & Corporate SuperFlex">
                          Evaluated Self-Drive & Corporate SuperFlex
                        </option>
                        <option value="Interstate 4x4 & Security Convoy Ready">
                          Interstate 4x4 & Security Convoy Ready
                        </option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="niid-policy">
                        Host Motor Insurance Baseline
                      </Label>
                      <select
                        id="niid-policy"
                        value={niidPolicyStatus}
                        onChange={(e) => setNiidPolicyStatus(e.target.value)}
                        className="w-full h-10 rounded-lg border border-input bg-card px-3 text-xs font-medium text-foreground shadow-surface focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="NIID Comprehensive Fleet Cover Active">
                          NIID Comprehensive Fleet Cover Active
                        </option>
                        <option value="NIID All-Risk + SRCC Fleet Cover">
                          NIID All-Risk + SRCC Fleet Cover
                        </option>
                        <option value="Statutory Third-Party NIID + Guest Upgrade">
                          Statutory Third-Party NIID + Guest Upgrade
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="description">
                      Description, Road Readiness & Specifications
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Highlight AC condition, ground clearance, leather cabin, airport handover readiness (LOS/ABV/PHC), and key features..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="image">Vehicle Photo</Label>
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
                    {submitting ? "Posting..." : "Publish listing to live fleet"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Tariff Preview & Host Protection Guarantee */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl bg-[#0d1713] text-stone-100 p-6 border border-emerald-950 shadow-elevated space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <Badge variant="dark">Live Tariff & Revenue Preview</Badge>
              <span className="font-mono text-xs text-emerald-300 tabular-nums">
                {year || "2024"}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-stone-50">
                {make || "Vehicle Make"} {model || "Model"}
              </h2>
              <p className="font-mono text-xs text-stone-400 mt-1">
                {location || "Lagos / Abuja / Port Harcourt Hub"}
              </p>
            </div>

            <div className="space-y-2.5 font-mono text-xs tabular-nums border-y border-white/10 py-4">
              <div className="flex items-center justify-between text-stone-200">
                <span>1–6 Days (Standard Daily Rate)</span>
                <span className="font-bold text-emerald-300">
                  {formatPrice(numericPrice)} /day
                </span>
              </div>
              <div className="flex items-center justify-between text-stone-300">
                <span>7–29 Days (Weekly Saver -10%)</span>
                <span>{formatPrice(weeklyRate)} /day</span>
              </div>
              <div className="flex items-center justify-between text-stone-300">
                <span>30+ Days (SuperFlex -22%)</span>
                <span>{formatPrice(superFlexRate)} /day</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-stone-300">
                Est. 22-Day Monthly SuperFlex Host Payout:
              </p>
              <p className="font-mono text-2xl font-bold text-emerald-300 tabular-nums">
                {formatPrice(estimatedMonthlySuperFlex)} /month
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-1.5 text-xs text-stone-300">
              <p className="font-mono font-semibold text-emerald-300">
                Active Host Safeguards on This Listing:
              </p>
              <p>✓ {driveAvailability}</p>
              <p>✓ {niidPolicyStatus}</p>
              <p>
                ✓ Untested new users must complete Chauffeur Trial + score ≥80% on Driving Test before Self-Drive.
              </p>
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full border-white/20 bg-white/5 text-stone-100 hover:bg-white/10"
            >
              <Link href="/dashboard/host">Return to Host Fleet Garage →</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCarPage;
