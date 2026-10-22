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

const LoginPage = () => {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [nextPath, setNextPath] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setNextPath(params.get("next"));
    }
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(nextPath || "/dashboard");
    }
  }, [isAuthenticated, isLoading, nextPath, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(username, password);

    if (result.success) {
      router.push(nextPath || "/dashboard");
    } else {
      setError(result.message || "Unable to log in right now.");
    }
  };

  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-10 md:py-16 space-y-6 animate-enter-subtle">
      <Breadcrumbs items={[{ label: "Log in" }]} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        <div className="lg:col-span-5">
          <Card className="shadow-elevated h-full flex flex-col justify-between">
            <div>
              <CardHeader className="space-y-2 pb-5">
                <div className="flex items-center justify-between">
                  <Badge variant="emerald">Session Access</Badge>
                  <Image
                    src="/logo-mark.svg"
                    alt="Izzac Mobility crest logo"
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-md shadow-surface"
                  />
                </div>
                <h1 className="text-3xl font-bold tracking-[-0.03em] text-card-foreground leading-tight">
                  Welcome back
                </h1>
                <CardDescription>
                  Sign in to access your Unified Overview, Rider & Driving Test Center, Host Garage, and Motor Insurance Ledger.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      placeholder="e.g. tunde_executive"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
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
                    {isLoading ? "Signing in..." : "Sign in to workspace"}
                  </Button>
                </form>
              </CardContent>
            </div>

            <CardFooter className="border-t border-border/70 pt-4 text-xs text-muted-foreground justify-between">
              <span>New to Izzac?</span>
              <Link
                href="/signup"
                className="font-semibold text-primary hover:underline"
              >
                Create an account →
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Right 7-Column Executive Workspace Preview */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0d1713] text-stone-100 p-7 md:p-10 border border-emerald-950 shadow-elevated flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="dark">Unified Rider & Host Account</Badge>
              <Badge variant="emerald">6 Specialized Dashboards</Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-stone-50">
              One account for Chauffeur Trials, Self-Drive Evaluation, Motor Insurance & Fleet Hosting
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed max-w-2xl">
              Sign in to pick up where you left off across all six Izzac workspaces—from completing your mandatory Chauffeur-Driven Trial and 5-question Driving Test Evaluation to managing your hosted fleet and active motor insurance certificates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-1.5">
              <p className="font-mono text-xs font-semibold text-emerald-300">
                01 · Chauffeur Trial
              </p>
              <p className="text-sm font-bold text-stone-50">
                Mandatory First Stage
              </p>
              <p className="text-xs text-stone-300 leading-relaxed">
                New riders start with a Chauffeur-Driven Trial before unlocking Self-Drive evaluation.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-1.5">
              <p className="font-mono text-xs font-semibold text-emerald-300">
                02 · Driving Test Exam
              </p>
              <p className="text-sm font-bold text-stone-50">
                80%+ Pass & License Check
              </p>
              <p className="text-xs text-stone-300 leading-relaxed">
                Complete the 5-question Highway Code & Flood-Corridor test to unlock Self-Drive.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-1.5">
              <p className="font-mono text-xs font-semibold text-emerald-300">
                03 · Motor Insurance
              </p>
              <p className="text-sm font-bold text-stone-50">
                3 Verified Policy Tiers
              </p>
              <p className="text-xs text-stone-300 leading-relaxed">
                Statutory Third-Party, Comprehensive, or All-Risk Zero-Excess cover on every trip.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-300">
            <span>Want to inspect the fleet or take the Driving Test preview first?</span>
            <div className="flex items-center gap-3">
              <Link href="/cars" className="font-mono font-semibold text-emerald-300 hover:underline">
                Browse 32+ Cars →
              </Link>
              <Link href="/services" className="font-mono font-semibold text-stone-200 hover:underline">
                Services & Insurance →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
