"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
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
  CardTitle,
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
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    const formData = new FormData();
    formData.append("make", make);
    formData.append("model", model);
    formData.append("year", year);
    formData.append("price_per_day", price);
    formData.append("location", location);
    formData.append("description", description);
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

  if (isLoading) return <Loader />;
  if (!isAuthenticated) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-12 md:py-16 animate-enter-subtle">
      <Card className="shadow-elevated">
        <CardHeader className="space-y-2 pb-6 border-b border-border/70">
          <div>
            <Badge variant="emerald">Inventory Builder</Badge>
          </div>
          <CardTitle className="text-3xl font-bold tracking-[-0.03em]">
            List your car
          </CardTitle>
          <CardDescription>
            Share a few details and set your daily rate.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
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
                  placeholder="e.g. Camry"
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
                <Label htmlFor="price">Price per day ($)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="65"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="font-mono tabular-nums"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                placeholder="e.g. Victoria Island, Lagos"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Highlight condition, pickup notes, and key features..."
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCarPage;
