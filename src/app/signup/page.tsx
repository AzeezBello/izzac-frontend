// src/app/signup/page.tsx
"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const SignupPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role'); // Retrieve role from URL query params
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    // Implement signup logic here, including sending role to the backend

    // Example role-based redirect after signup
    if (role === 'host') {
      router.push('/dashboard/host');
    } else {
      router.push('/dashboard/rider');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sign Up {role === 'host' && 'as a Host'}</h1>
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="block w-full p-2 border rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full p-2 border rounded-md"
        />
        <button type="submit" className="w-full py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-lg">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
