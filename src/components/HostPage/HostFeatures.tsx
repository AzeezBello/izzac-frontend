// src/components/HostPage/HostFeatures.tsx
import Link from 'next/link';
import Image from 'next/image';
import { hostFeatureCards } from '../../lib/productContent';

const HostFeatures = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
        <div>
          <p className="text-emerald-700 font-semibold uppercase tracking-[0.24em] text-xs mb-3">Host on Izzac</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Turn your car into a bookable listing with rider and host tools built in.
          </h1>
          <p className="text-gray-600 mt-4 max-w-2xl">
            The host experience is not a brochure flow. It connects directly to the app you already have:
            account creation, protected listing creation, photo uploads, garage management, and host-side booking visibility.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link href="/signup?role=host" className="px-5 py-3 rounded-lg bg-emerald-600 text-white font-semibold text-center hover:bg-emerald-700 transition">
              Start hosting
            </Link>
            <Link href="/dashboard/add-car" className="px-5 py-3 rounded-lg border border-emerald-600 text-emerald-700 font-semibold text-center hover:bg-emerald-50 transition">
              Add a car
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            {hostFeatureCards.map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-700 font-semibold">{feature.eyebrow}</p>
                <h3 className="text-lg font-semibold text-gray-900 mt-3">{feature.title}</h3>
                <p className="text-sm text-gray-600 mt-2 leading-6">{feature.description}</p>
                <Link href={feature.href} className="inline-flex mt-4 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                  {feature.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-gradient-to-br from-emerald-100 via-white to-emerald-50 p-4 shadow-xl">
          <Image
            src="/images/hero-bg.webp"
            alt="Host dashboard overview"
            width={900}
            height={900}
            className="rounded-[1.5rem] w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default HostFeatures;
