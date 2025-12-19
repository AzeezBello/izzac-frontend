// src/app/login/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next');
  const { login, isAuthenticated, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(nextPath || '/dashboard');
    }
  }, [isAuthenticated, isLoading, nextPath, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(username, password);

    if (result.success) {
      router.push(nextPath || '/dashboard');
    } else {
      setError(result.message || 'Unable to log in right now.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 md:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
      <p className="text-gray-600 mb-6">Log in to manage your cars and bookings.</p>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="yourusername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
