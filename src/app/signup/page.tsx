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
      router.push(role === "host" ? "/dashboard/host" : "/dashboard");
    } else {
      setError(result.message || "Unable to sign you up right now.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 md:px-6 py-12 md:py-16 space-y-5 animate-enter-subtle">
      <Breadcrumbs items={[{ label: "Create Account" }]} />
      <Card className="shadow-elevated">
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
              ? "List your car and start earning recurring NGN payouts."
              : "Book chauffeur-driven or verified self-drive rides in minutes."}
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
                placeholder="name@company.ng"
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
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>

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
  );
};

export default SignupPage;
