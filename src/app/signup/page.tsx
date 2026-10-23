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

  const isHost = role === "host";

  return (
    <Container className="space-y-8 py-10 md:py-16 animate-enter-subtle">
      <Breadcrumbs items={[{ label: "Create account" }]} />

      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
        <Card className="flex flex-col justify-between shadow-elevated lg:col-span-5">
          <div className="space-y-6 p-7 md:p-8">
            <div className="flex items-center justify-between">
              <Eyebrow tone="muted">{isHost ? "Host onboarding" : "Rider onboarding"}</Eyebrow>
              <Image src="/logo-mark.svg" alt="Izzac Mobility" width={28} height={28} className="h-7 w-7 rounded-sm" />
            </div>
            <div className="space-y-2">
              <h1 className="text-h1 text-foreground">Create your account</h1>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                {isHost
                  ? "List your car, set a daily rate, and start receiving vetted, insured bookings."
                  : "Start with a chauffeur-driven trial, pass the driving test, and unlock self-drive."}
              </p>
            </div>

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
                <Label htmlFor="password" hint="8+ characters">
                  Password
                </Label>
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

              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account…" : "Create account"}
              </Button>
            </form>
          </div>

          <div className="flex items-center justify-between border-t border-border/70 px-7 py-4 text-xs text-muted-foreground md:px-8">
            <span>Already have an account?</span>
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in →
            </Link>
          </div>
        </Card>

        <InkPanel className="flex flex-col justify-between lg:col-span-7">
          <div className="space-y-4">
            <Eyebrow tone="signal">How a new account progresses</Eyebrow>
            <h2 className="text-h1 text-ink-foreground">Chauffeur trial first, then the driving test, then self-drive.</h2>
            <p className="max-w-[56ch] text-[15px] leading-relaxed text-ink-muted">
              To protect the fleet and keep insurance rates low, every new rider begins chauffeur-driven. Hosts can publish
              vehicles immediately after registering.
            </p>
          </div>

          <Ledger inverted className="my-8">
            <LedgerRow
              inverted
              index="01"
              title="Complete one chauffeur trip"
              description="A vetted executive driver handles your first booking while we verify your identity and handover profile."
            />
            <LedgerRow
              inverted
              index="02"
              title="Pass the driving test"
              description="Verify your licence and 11-digit ID, then score 80% or more on the five-question highway and flood-corridor test."
            />
            <LedgerRow
              inverted
              index="03"
              title="Drive with verified cover"
              description="Receive your digital self-drive clearance certificate and choose from three verified motor insurance policies."
            />
          </Ledger>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <ArrowLink href="/host" tone="signal">
              Explore the host programme
            </ArrowLink>
            <ArrowLink href="/cars" tone="inverse">
              Browse the fleet
            </ArrowLink>
          </div>
        </InkPanel>
      </div>
    </Container>
  );
};

export default SignupPage;
