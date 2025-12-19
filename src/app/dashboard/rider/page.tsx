"use client";

import Link from 'next/link';
import { useRequireAuth } from '../../../hooks/useAuth';
import Loader from '../../../components/Loader';

const RiderDashboard = () => {
  const { isAuthenticated, isLoading } = useRequireAuth('/login?next=/dashboard/rider');

  if (isLoading) return <Loader />;
  if (!isAuthenticated) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 space-y-6">
      <div>
        <p className="uppercase text-emerald-700 font-semibold text-xs">Rider</p>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-gray-600 text-sm">Review your bookings or find your next ride.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/dashboard/bookings" className="border border-gray-100 rounded-2xl shadow-sm p-4 hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Your bookings</h2>
          <p className="text-gray-600 text-sm">See every trip you have planned.</p>
        </Link>
        <Link href="/cars" className="border border-gray-100 rounded-2xl shadow-sm p-4 hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Browse cars</h2>
          <p className="text-gray-600 text-sm">Find a ride that fits your needs.</p>
        </Link>
      </div>
    </div>
  );
};

export default RiderDashboard;
