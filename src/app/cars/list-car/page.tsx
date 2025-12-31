// src/app/list-car/page.tsx
"use client";

import Link from 'next/link';
import { useRequireAuth } from '../../../hooks/useAuth';
import Loader from '../../../components/Loader';

const ListCarPage = () => {
  const { isAuthenticated, isLoading } = useRequireAuth('/login?next=/cars/list-car');

  if (isLoading) return <Loader />;
  if (!isAuthenticated) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold mb-2">Ready to earn with your car?</h1>
      <p className="text-gray-600">Share your ride on Izzac and connect with trusted drivers.</p>
      <Link href="/dashboard/add-car" className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition">
        Start listing
      </Link>
    </div>
  );
};

export default ListCarPage;
