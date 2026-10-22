"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";

const SignupPage = () => {
  const router = useRouter();
  const { register, isAuthenticated, isLoading } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setRole(params.get("role"));
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await register(username, email, password);

    if (result.success) {
      router.push(role === "host" ? "/dashboard/host" : "/dashboard/rider");
    } else {
      setError(result.message || "Unable to sign you up right now.");
    }
  };

  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-10 md:py-16 space-y-6 animate-enter-subtle">
      <Breadcrumbs items={[{ label: "Create Account" }]} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        <div className="lg:col-span-5">
          <Card className="shadow-elevated h-full flex flex-col justify-between">
            <div>
              <CardHeader className="space-y-2 pb-5">
                <div className="flex items-center justify-between">
                  <Badge variant="emerald">
                    {role === "host" ? "Host Onboarding" : "Unified Account"}
                  </Badge>
                  <Image
                    src="/logo-mark.svg"
                    alt="Izzac Mobility crest logo"
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-md shadow-surface"
                  />
                </div>
                <h1 className="text-3xl font-bold tracking-[-0.03em] text-card-foreground leading-tight">
                  Create your account
                </h1>
                <CardDescription>
                  {role === "host"
                    ? "List your car and start earning recurring payouts with full guest vetting and motor insurance."
                    : "Start with your Chauffeur-Driven Trial, complete the Driving Test Evaluation, and unlock Self-Drive."}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      placeholder="e.g. chinedu_fleet"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create unified account"}
                  </Button>
                </form>
              </CardContent>
            </div>

            <CardFooter className="border-t border-border/70 pt-4 text-xs text-muted-foreground justify-between">
              <span>Already have an account?</span>
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Sign in →
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Right 7-Column Onboarding & Trial-to-Self-Drive Progression Dossier */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0d1713] text-stone-100 p-7 md:p-10 border border-emerald-950 shadow-elevated flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="dark">New User Onboarding Policy</Badge>
              <Badge variant="emerald">Chauffeur Trial → Driving Test → Self-Drive</Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-stone-50">
              How your new Izzac account progresses from Chauffeur Trial to Self-Drive
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed max-w-2xl">
              To protect our executive fleet and keep insurance rates low, every new rider account begins in Chauffeur-Driven Trial mode before completing our digital Driving Test Evaluation to unlock Self-Drive.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-1.5">
              <p className="font-mono text-xs font-semibold text-emerald-300">
                Stage 01 · Chauffeur Trial
              </p>
              <p className="text-sm font-bold text-stone-50">
                Complete 1 Chauffeur Trip
              </p>
              <p className="text-xs text-stone-300 leading-relaxed">
                Your first trip is chauffeured by a vetted executive driver to verify your account and handover profile.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-1.5">
              <p className="font-mono text-xs font-semibold text-emerald-300">
                Stage 02 · Driving Test
              </p>
              <p className="text-sm font-bold text-stone-50">
                License + 80% Exam Pass
              </p>
              <p className="text-xs text-stone-300 leading-relaxed">
                Verify your Driver’s License and 11-digit ID and score 80%+ on the 5-question Highway & Flood-Corridor test.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-1.5">
              <p className="font-mono text-xs font-semibold text-emerald-300">
                Stage 03 · Motor Insurance
              </p>
              <p className="text-sm font-bold text-stone-50">
                Self-Drive + NIID Cover
              </p>
              <p className="text-xs text-stone-300 leading-relaxed">
                Receive your Digital Self-Drive Clearance Certificate and choose from 3 verified motor insurance policies.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-300">
            <span>Host accounts can publish vehicles immediately upon registration.</span>
            <Link href="/host" className="font-mono font-semibold text-emerald-300 hover:underline">
              Explore Host Fleet Program →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
