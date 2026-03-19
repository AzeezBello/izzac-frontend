"use client";

import Link from 'next/link';
import { useRequireAuth } from '../../../hooks/useAuth';
import Loader from '../../../components/Loader';
import { riderJourney } from '../../../lib/productContent';

const RiderDashboard = () => {
  const { isAuthenticated, isLoading } = useRequireAuth('/login?next=/dashboard/rider');

  if (isLoading) return <Loader />;
  if (!isAuthenticated) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 space-y-6">
      <div>
        <p className="uppercase text-emerald-700 font-semibold text-xs">Rider</p>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-gray-600 text-sm">Review your bookings, browse more cars, and move through the full rider flow from one place.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/dashboard/bookings" className="border border-gray-100 rounded-2xl shadow-sm p-5 hover:shadow-md transition bg-white">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Your bookings</h2>
          <p className="text-gray-600 text-sm">See every trip you have planned.</p>
        </Link>
        <Link href="/cars" className="border border-gray-100 rounded-2xl shadow-sm p-5 hover:shadow-md transition bg-white">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Browse cars</h2>
          <p className="text-gray-600 text-sm">Find a ride that fits your needs.</p>
        </Link>
      </div>

      <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-6">
        <p className="uppercase text-emerald-700 font-semibold text-xs tracking-[0.22em] mb-3">Rider flow</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {riderJourney.map((step, index) => (
            <div key={step.title} className="rounded-2xl bg-white border border-emerald-100 p-4 shadow-sm">
              <p className="text-sm font-semibold text-emerald-700">Step {index + 1}</p>
              <h3 className="text-lg font-semibold text-gray-900 mt-2">{step.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/cars/list-car" className="border border-gray-100 rounded-2xl shadow-sm p-5 hover:shadow-md transition bg-white">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Become a host too</h2>
          <p className="text-gray-600 text-sm">Use the same account to publish your own car when you are ready.</p>
        </Link>
        <Link href="/dashboard" className="border border-gray-100 rounded-2xl shadow-sm p-5 hover:shadow-md transition bg-white">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Open your garage</h2>
          <p className="text-gray-600 text-sm">Jump into the host-side dashboard if you also list vehicles on Izzac.</p>
        </Link>
      </div>
    </div>
  );
};

export default RiderDashboard;
