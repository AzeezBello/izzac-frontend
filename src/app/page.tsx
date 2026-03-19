"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import publicApi from '../lib/publicApi';
import FallbackImage from '../components/FallbackImage';
import { resolveApiAssetUrl } from '../lib/config';
import { hostJourney, platformFeatureCards, riderJourney } from '../lib/productContent';

type Car = {
  id: number;
  make: string;
  model: string;
  year: number;
  price_per_day: number;
  image: string;
  location: string;
  description: string;
};

const imageUrl = (path?: string) => {
  return resolveApiAssetUrl(path, '/images/hero-bg.webp');
};

const HomePage = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await publicApi.get('/cars/', { params: { available: 'true' } });
        setCars(response.data);
      } catch (err) {
        console.error('Failed to fetch cars:', err);
        setError('Could not load car listings. Please try again later.');
      }
    };

    fetchCars();
  }, []);

  const filteredCars = useMemo(() => {
    if (!search) return cars;
    const term = search.toLowerCase();
    return cars.filter((car) =>
      `${car.make} ${car.model} ${car.location}`.toLowerCase().includes(term)
    );
  }, [cars, search]);

  return (
    <div className="bg-gradient-to-b from-emerald-50 via-white to-white">
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16 flex flex-col md:flex-row items-center gap-8">
        <div className="space-y-5 md:w-1/2">
          <p className="text-emerald-700 font-semibold uppercase tracking-[0.24em] text-xs">Peer-to-peer rides</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Browse, book, host, and manage every trip from one Izzac account.
          </h1>
          <p className="text-gray-600">
            Izzac brings the full rental loop together: discover live listings, open detailed car pages, confirm bookings,
            publish your own cars, and monitor trips as both rider and host.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/cars" className="px-5 py-3 rounded-lg bg-emerald-600 text-white font-semibold text-center hover:bg-emerald-700 transition">
              Browse cars
            </Link>
            <Link href="/dashboard/bookings" className="px-5 py-3 rounded-lg border border-gray-300 text-gray-900 font-semibold text-center hover:bg-gray-50 transition">
              View bookings
            </Link>
            <Link href="/dashboard/add-car" className="px-5 py-3 rounded-lg border border-emerald-600 text-emerald-700 font-semibold text-center hover:bg-emerald-50 transition">
              List your car
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-700 font-semibold">Search</p>
              <p className="text-sm text-gray-600 mt-1">Featured listings plus full cars catalogue.</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-700 font-semibold">Book</p>
              <p className="text-sm text-gray-600 mt-1">Date-based booking form with live trip estimate.</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-700 font-semibold">Host</p>
              <p className="text-sm text-gray-600 mt-1">Garage and booking tools for car owners.</p>
            </div>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="rounded-[2rem] bg-gradient-to-br from-emerald-100 via-white to-emerald-50 p-4 shadow-xl">
            <Image
              src="/images/hero-bg.webp"
              alt="Drivers on the road"
              width={1200}
              height={900}
              className="rounded-[1.5rem] w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-12">
        <div className="mb-6">
          <p className="text-emerald-700 font-semibold uppercase tracking-[0.22em] text-xs mb-2">Platform features</p>
          <h2 className="text-3xl font-bold text-gray-900">Everything the app already lets you do</h2>
          <p className="text-gray-600 mt-2 max-w-3xl">
            Every static route now points back to the live parts of the product: catalogue browsing, booking creation,
            account access, host listing tools, and dual rider-host dashboards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {platformFeatureCards.map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-700 font-semibold">{feature.eyebrow}</p>
              <h3 className="text-xl font-semibold text-gray-900 mt-3">{feature.title}</h3>
              <p className="text-sm text-gray-600 mt-2 leading-6">{feature.description}</p>
              <Link href={feature.href} className="inline-flex mt-4 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                {feature.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-12">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="rounded-[2rem] bg-gray-900 text-white p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-300 font-semibold mb-3">Rider journey</p>
            <h2 className="text-3xl font-bold">From discovery to confirmed trip</h2>
            <div className="space-y-4 mt-6">
              {riderJourney.map((step, index) => (
                <div key={step.title} className="border border-white/10 rounded-2xl p-4 bg-white/5">
                  <p className="text-sm font-semibold text-emerald-300">Step {index + 1}</p>
                  <h3 className="text-lg font-semibold mt-1">{step.title}</h3>
                  <p className="text-sm text-gray-200 mt-2">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-emerald-50 border border-emerald-100 p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-700 font-semibold mb-3">Host journey</p>
            <h2 className="text-3xl font-bold text-gray-900">Launch a listing and manage it end to end</h2>
            <div className="space-y-4 mt-6">
              {hostJourney.map((step, index) => (
                <div key={step.title} className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-emerald-700">Step {index + 1}</p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-1">{step.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Available cars</h2>
            <p className="text-gray-600 text-sm">Search by make, model, or location and jump into booking-ready car pages.</p>
          </div>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search e.g. Toyota Lagos"
            className="w-full sm:w-64 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        {error ? (
          <p className="text-red-600 font-semibold">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <Link href={`/cars/${car.id}`} key={car.id} className="block">
                <div className="border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden h-full bg-white">
                  <FallbackImage
                    src={imageUrl(car.image)}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">{car.make} {car.model}</h3>
                    <p className="text-gray-600 text-sm">{car.year} • {car.location}</p>
                    <p className="text-emerald-700 font-bold">${car.price_per_day} <span className="text-sm font-medium text-gray-500">/day</span></p>
                    <p className="text-sm text-gray-500 max-h-12 overflow-hidden">{car.description}</p>
                  </div>
                </div>
              </Link>
            ))}
            {!error && filteredCars.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-10">
                No cars match your search yet. Try a different city or make.
              </div>
            )}
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-16">
        <div className="rounded-[2rem] bg-gradient-to-r from-emerald-700 to-emerald-600 text-white p-8 md:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-100 font-semibold mb-3">Ready to use the full app?</p>
            <h2 className="text-3xl font-bold">Choose your next action based on how you want to use Izzac.</h2>
            <p className="text-emerald-50 mt-3">
              Riders can browse and book immediately, while hosts can move straight into listing creation, garage management,
              and booking oversight from the same account.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/signup" className="px-5 py-3 rounded-lg bg-white text-emerald-700 font-semibold text-center hover:bg-emerald-50 transition">
              Create an account
            </Link>
            <Link href="/host" className="px-5 py-3 rounded-lg border border-white/40 text-white font-semibold text-center hover:bg-white/10 transition">
              Explore host tools
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
