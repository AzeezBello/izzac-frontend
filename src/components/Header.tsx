"use client";

// src/components/Header.tsx
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/images/feature1.webp" alt="Izzac" width={36} height={36} className="rounded-md object-cover" />
          <span className="text-xl font-extrabold text-emerald-700">Izzac</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-4 text-sm font-semibold text-gray-700">
          <Link href="/cars" className="hover:text-emerald-700">Browse cars</Link>
          <Link href="/dashboard" className="hover:text-emerald-700">My garage</Link>
          <Link href="/dashboard/bookings" className="hover:text-emerald-700">Bookings</Link>
          <Link href="/dashboard/add-car" className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition">List your car</Link>
        </nav>

        <div className="flex items-center space-x-3 text-sm">
          {isAuthenticated ? (
            <>
              <span className="text-gray-700 hidden sm:inline">Hi, {user?.username}</span>
              <button
                onClick={logout}
                className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="font-semibold text-gray-700 hover:text-emerald-700">Log in</Link>
              <Link
                href="/signup"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
