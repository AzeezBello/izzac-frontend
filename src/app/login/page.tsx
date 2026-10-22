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
    <div className="max-w-md mx-auto px-4 md:px-6 py-12 md:py-16 space-y-5 animate-enter-subtle">
      <Breadcrumbs items={[{ label: "Log in" }]} />
      <Card className="shadow-elevated">
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
            Log in to manage your cars, chauffeur trips, and corporate bookings.
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
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>

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
  );
};

export default LoginPage;
