"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "../../components/Loader";
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
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";

const LoginContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams?.get("next");
  const { login, isAuthenticated, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

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
    <div className="max-w-md mx-auto px-4 md:px-6 py-14 md:py-20 animate-enter-subtle">
      <Card className="shadow-elevated">
        <CardHeader className="space-y-2 pb-5">
          <div>
            <Badge variant="emerald">Session Access</Badge>
          </div>
          <CardTitle className="text-3xl font-bold tracking-[-0.03em]">
            Welcome back
          </CardTitle>
          <CardDescription>
            Log in to manage your cars and bookings.
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
                placeholder="yourusername"
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

const LoginPage = () => (
  <Suspense fallback={<Loader />}>
    <LoginContent />
  </Suspense>
);

export default LoginPage;
