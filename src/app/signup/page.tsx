"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const SignupPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
  const { register, isAuthenticated, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await register(username, email, password);

    if (result.success) {
      router.push(role === 'host' ? '/dashboard/host' : '/dashboard');
    } else {
      setError(result.message || 'Unable to sign you up right now.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 md:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Create your account</h1>
      <p className="text-gray-600 mb-6">
        {role === 'host' ? 'List your car and start earning.' : 'Book trusted rides in minutes.'}
      </p>
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="yourusername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block w-full p-2 border rounded-md border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full p-2 border rounded-md border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
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
            className="block w-full p-2 border rounded-md border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
