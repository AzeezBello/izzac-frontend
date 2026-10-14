// src/app/list-car/page.tsx
"use client";

import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { hostFeatureCards, hostJourney } from '../../../lib/productContent';

const ListCarPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const primaryHref = !isLoading && isAuthenticated ? '/dashboard/add-car' : '/signup?role=host';
  const primaryLabel = !isLoading && isAuthenticated ? 'Go to add car' : 'Create host account';

  return (
    <div className="bg-gradient-to-b from-emerald-50 via-white to-white">
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-3xl">
          <p className="text-emerald-700 font-semibold uppercase tracking-[0.22em] text-xs mb-3">List a car</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Launch your listing with the same tools hosts use across the full app.
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            This page now acts as the public entry to hosting: it explains listing creation, garage management,
            and host-side bookings before sending you into the protected add-car flow.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link href={primaryHref} className="px-5 py-3 rounded-lg bg-emerald-600 text-white font-semibold text-center hover:bg-emerald-700 transition">
              {primaryLabel}
            </Link>
            <Link href="/host" className="px-5 py-3 rounded-lg border border-emerald-600 text-emerald-700 font-semibold text-center hover:bg-emerald-50 transition">
              Explore host features
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {hostFeatureCards.map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-700 font-semibold">{feature.eyebrow}</p>
              <h2 className="text-xl font-semibold text-gray-900 mt-3">{feature.title}</h2>
              <p className="text-sm text-gray-600 mt-2 leading-6">{feature.description}</p>
              <Link href={feature.href} className="inline-flex mt-4 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                {feature.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-12">
        <div className="rounded-[2rem] bg-gray-900 text-white p-6 md:p-8">
          <p className="text-emerald-300 font-semibold uppercase tracking-[0.22em] text-xs mb-3">Host journey</p>
          <h2 className="text-3xl font-bold">What happens after you decide to list</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
            {hostJourney.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-emerald-300">Step {index + 1}</p>
                <h3 className="text-lg font-semibold mt-2">{step.title}</h3>
                <p className="text-sm text-gray-200 mt-2">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-16">
        <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-6 md:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Ready to move from interest to inventory?</h2>
            <p className="text-gray-600 mt-3">
              If you are signed in, head straight to the add-car page. If not, create a host account first and then publish your listing.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={primaryHref} className="px-5 py-3 rounded-lg bg-emerald-600 text-white font-semibold text-center hover:bg-emerald-700 transition">
              {primaryLabel}
            </Link>
            <Link href="/dashboard/bookings" className="px-5 py-3 rounded-lg border border-gray-300 text-gray-900 font-semibold text-center hover:bg-white transition">
              See host bookings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ListCarPage;
