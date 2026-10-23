"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import DashboardShell from "../../../components/DashboardShell";
import EmptyStateGuide from "../../../components/EmptyStateGuide";
import Loader from "../../../components/Loader";
import { useCurrency } from "../../../context/CurrencyContext";
import { useRequireAuth } from "../../../hooks/useAuth";
import { getApiErrorMessage } from "../../../lib/errors";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Eyebrow } from "../../../components/layout/Eyebrow";
import { InkPanel } from "../../../components/layout/InkPanel";
import { Stat } from "../../../components/layout/Stat";
import { Ledger } from "../../../components/layout/Ledger";

const DRIVE_MODES = [
  "Chauffeur-Driven Trial & Evaluated Self-Drive",
  "Chauffeur-Driven Only (Driver Supplied)",
  "Evaluated Self-Drive & Corporate SuperFlex",
  "Interstate 4x4 & Security Convoy Ready",
];

const INSURANCE_BASELINES = [
  "NIID Comprehensive Fleet Cover Active",
  "NIID All-Risk + SRCC Fleet Cover",
  "Statutory Third-Party NIID + Guest Upgrade",
];

const FormStep = ({ index, title, children }: { index: string; title: string; children: React.ReactNode }) => (
  <div className="space-y-5 border-t border-border/70 pt-6 first:border-t-0 first:pt-0">
    <Eyebrow index={index}>{title}</Eyebrow>
    {children}
  </div>
);

const AddCarPage = () => {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const { isAuthenticated, isLoading } = useRequireAuth("/login?next=/dashboard/add-car");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("2024");
  const [price, setPrice] = useState("135000");
  const [location, setLocation] = useState("");
  const [driveAvailability, setDriveAvailability] = useState(DRIVE_MODES[0]);
  const [niidPolicyStatus, setNiidPolicyStatus] = useState(INSURANCE_BASELINES[0]);
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
      await api.post("/cars/", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess("Car listed successfully!");
      router.push("/dashboard/host");
    } catch (error: unknown) {
      setError(getApiErrorMessage(error, "Failed to add car. Please check required fields."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Host garage", href: "/dashboard/host" },
        { label: "Publish a vehicle" },
      ]}
      eyebrow="Host garage"
      title="Publish a vehicle"
      description="List a sedan, SUV or 4x4 for chauffeur-driven, evaluated self-drive, airport and SuperFlex bookings. Weekly and monthly rates are derived from your daily tariff."
    >
      {isLoading ? (
        <Loader label="Loading garage" />
      ) : !isAuthenticated ? (
        <EmptyStateGuide
          eyebrow="Sign in required"
          title="Sign in to publish your vehicle"
          description="Your listing appears in the live fleet immediately, with guest vetting and insurance enforced."
          primaryAction={{ label: "Sign in", href: "/login?next=/dashboard/add-car" }}
          secondaryAction={{ label: "Create a host account", href: "/signup?role=host" }}
          tips={[
            { title: "Set a daily rate", description: "Weekly (−10%) and SuperFlex (−22%) rates are calculated for you." },
            { title: "Guest vetting", description: "First-time riders complete a chauffeur trial and pass the driving test before self-drive." },
            { title: "Insurance on every trip", description: "Each booking binds a verified NIID motor policy." },
          ]}
        />
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <Card className="lg:col-span-7 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <FormStep index="01" title="Vehicle">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="make">Make</Label>
                    <Input id="make" type="text" placeholder="Toyota" value={make} onChange={(e) => setMake(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" type="text" placeholder="Land Cruiser Prado TXL" value={model} onChange={(e) => setModel(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" type="number" placeholder="2024" value={year} onChange={(e) => setYear(e.target.value)} className="font-mono tabular-nums" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price" hint="NGN per day">
                      Daily rate
                    </Label>
                    <Input id="price" type="number" placeholder="135000" value={price} onChange={(e) => setPrice(e.target.value)} className="font-mono tabular-nums" required />
                  </div>
                </div>
              </FormStep>

              <FormStep index="02" title="Hub & modes">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location" hint="City hub & neighbourhood">
                      Location
                    </Label>
                    <Input id="location" type="text" placeholder="Victoria Island, Lagos" value={location} onChange={(e) => setLocation(e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="drive-availability">Supported drive modes</Label>
                      <Select id="drive-availability" value={driveAvailability} onChange={(e) => setDriveAvailability(e.target.value)}>
                        {DRIVE_MODES.map((mode) => (
                          <option key={mode} value={mode}>
                            {mode}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="niid-policy">Insurance baseline</Label>
                      <Select id="niid-policy" value={niidPolicyStatus} onChange={(e) => setNiidPolicyStatus(e.target.value)}>
                        {INSURANCE_BASELINES.map((policy) => (
                          <option key={policy} value={policy}>
                            {policy}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
              </FormStep>

              <FormStep index="03" title="Description">
                <div className="space-y-2">
                  <Label htmlFor="description" hint="Condition, clearance, airport readiness">
                    Road readiness & specifications
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="AC condition, ground clearance, leather cabin, airport handover readiness (LOS/ABV/PHC), key features…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
              </FormStep>

              <FormStep index="04" title="Photo">
                <div className="space-y-2">
                  <Label htmlFor="image" hint="JPG, PNG or WebP">
                    Vehicle photo
                  </Label>
                  <Input id="image" type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} required />
                </div>
              </FormStep>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert variant="emerald">
                  <AlertDescription className="font-medium">{success}</AlertDescription>
                </Alert>
              )}

              <div className="flex flex-wrap items-center gap-3 border-t border-border/70 pt-6">
                <Button type="submit" size="lg" disabled={submitting}>
                  {submitting ? "Publishing…" : "Publish to the live fleet"}
                </Button>
                <Button asChild variant="ghost" size="lg">
                  <Link href="/dashboard/host">Cancel</Link>
                </Button>
              </div>
            </form>
          </Card>

          <div className="lg:col-span-5 lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]">
            <InkPanel padding="sm">
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Eyebrow tone="signal">Live preview</Eyebrow>
                    <h2 className="mt-2 truncate text-xl font-semibold tracking-[-0.02em] text-ink-foreground">
                      {make || "Make"} {model || "Model"}
                    </h2>
                    <p className="font-mono text-xs text-ink-muted">{location || "Lagos · Abuja · Port Harcourt"}</p>
                  </div>
                  <span className="font-mono text-xs tabular-nums text-ink-muted">{year || "2024"}</span>
                </div>

                <Ledger inverted>
                  <div className="flex items-center justify-between py-3 font-mono text-xs tabular-nums">
                    <span className="text-ink-muted">1–6 days · standard</span>
                    <span className="font-semibold text-signal">{formatPrice(numericPrice)}/day</span>
                  </div>
                  <div className="flex items-center justify-between py-3 font-mono text-xs tabular-nums">
                    <span className="text-ink-muted">7–29 days · −10%</span>
                    <span className="text-ink-foreground">{formatPrice(weeklyRate)}/day</span>
                  </div>
                  <div className="flex items-center justify-between py-3 font-mono text-xs tabular-nums">
                    <span className="text-ink-muted">30+ days · SuperFlex −22%</span>
                    <span className="text-ink-foreground">{formatPrice(superFlexRate)}/day</span>
                  </div>
                </Ledger>

                <Stat inverted tone="signal" label="Est. monthly payout" value={formatPrice(estimatedMonthlySuperFlex)} detail="22 billable SuperFlex days per month" />

                <ul className="space-y-1.5 border-t border-white/10 pt-4 text-xs text-ink-muted">
                  <li className="flex gap-2">
                    <span className="text-signal">✓</span> {driveAvailability}
                  </li>
                  <li className="flex gap-2">
                    <span className="text-signal">✓</span> {niidPolicyStatus}
                  </li>
                  <li className="flex gap-2">
                    <span className="text-signal">✓</span> Self-drive guests must complete a chauffeur trial and score 80%+ on the driving test.
                  </li>
                </ul>
              </div>
            </InkPanel>
          </div>
        </div>
      )}
    </DashboardShell>
  );
};

export default AddCarPage;
