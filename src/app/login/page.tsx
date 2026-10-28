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
import { Card } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Container } from "../../components/layout/Container";
import { Eyebrow } from "../../components/layout/Eyebrow";
import { InkPanel } from "../../components/layout/InkPanel";
import { Ledger, LedgerRow } from "../../components/layout/Ledger";
import { ArrowLink } from "../../components/layout/ArrowLink";

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
    <Container className="space-y-8 py-10 md:py-16 animate-enter-subtle">
      <Breadcrumbs items={[{ label: "Log in" }]} />

      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
        <Card className="flex flex-col justify-between shadow-elevated lg:col-span-5">
          <div className="space-y-6 p-7 md:p-8">
            <div className="flex items-center justify-between">
              <Eyebrow tone="muted">Sign in</Eyebrow>
              <Image src="/logo-mark.svg" alt="Izzac Mobility" width={28} height={28} className="h-7 w-7 rounded-sm" />
            </div>
            <div className="space-y-2">
              <h1 className="text-h1 text-foreground">Welcome back</h1>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Your rider trips, host garage, bookings and insurance certificates in one account.
              </p>
            </div>

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

              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </div>

          <div className="flex items-center justify-between border-t border-border/70 px-7 py-4 text-xs text-muted-foreground md:px-8">
            <span>New to Izzac Mobility?</span>
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Create an account →
            </Link>
          </div>
        </Card>

        <InkPanel className="flex flex-col justify-between lg:col-span-7">
          <div className="space-y-4">
            <Eyebrow tone="signal">One account, two roles</Eyebrow>
            <h2 className="text-h1 text-ink-foreground">
              Pick up where you left off, from chauffeur trial to self-drive clearance.
            </h2>
            <p className="max-w-[56ch] text-[15px] leading-relaxed text-ink-muted">
              Every new rider starts chauffeur-driven, passes a short driving test to unlock self-drive, and carries a verified
              motor insurance certificate on every trip. Hosts manage their fleet from the same login.
            </p>
          </div>

          <Ledger inverted className="my-8">
            <LedgerRow
              inverted
              index="01"
              title="Chauffeur trial"
              description="Your first trip is driven by a vetted executive chauffeur while we verify your profile."
            />
            <LedgerRow
              inverted
              index="02"
              title="Driving test"
              description="Verify your licence and ID, then score 80% or more on a five-question highway and flood-corridor test."
            />
            <LedgerRow
              inverted
              index="03"
              title="Motor insurance"
              description="Choose statutory third-party, comprehensive, or zero-excess all-risk cover at checkout."
            />
          </Ledger>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <ArrowLink href="/cars" tone="signal">
              Browse the fleet
            </ArrowLink>
            <ArrowLink href="/services" tone="inverse">
              Services and insurance
            </ArrowLink>
          </div>
        </InkPanel>
      </div>
    </Container>
  );
};

export default LoginPage;
