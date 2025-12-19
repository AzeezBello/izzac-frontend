"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import publicApi from '../lib/publicApi';

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
  if (!path) return '/images/hero-bg.webp';
  return path.startsWith('http') ? path : `${process.env.NEXT_PUBLIC_API_URL}${path}`;
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
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 flex flex-col md:flex-row items-center gap-8">
        <div className="space-y-4 md:w-1/2">
          <p className="text-emerald-700 font-semibold uppercase">Peer-to-peer rides</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Find the perfect ride or share yours with Izzac.
          </h1>
          <p className="text-gray-600">
            Browse verified listings, book with confidence, and earn by sharing your car with trusted riders.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/cars" className="px-5 py-3 rounded-lg bg-emerald-600 text-white font-semibold text-center hover:bg-emerald-700 transition">
              Browse cars
            </Link>
            <Link href="/dashboard/add-car" className="px-5 py-3 rounded-lg border border-emerald-600 text-emerald-700 font-semibold text-center hover:bg-emerald-50 transition">
              List your car
            </Link>
          </div>
        </div>
        <div className="md:w-1/2">
          <img src="/images/hero-bg.webp" alt="Drivers on the road" className="rounded-2xl shadow-xl w-full object-cover" />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Available cars</h2>
            <p className="text-gray-600 text-sm">Search by make, model, or location.</p>
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
                  <img
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
    </div>
  );
};

export default HomePage;
