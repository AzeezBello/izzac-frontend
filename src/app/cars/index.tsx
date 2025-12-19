"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import publicApi from '../../lib/publicApi';

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

const resolveImage = (path?: string) => {
  if (!path) return '/window.svg';
  return path.startsWith('http') ? path : `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

const CarsPage = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCars = async () => {
      try {
        const { data } = await publicApi.get('/cars/');
        setCars(data);
      } catch (err) {
        console.error(err);
        setError('Could not load cars right now.');
      }
    };

    loadCars();
  }, []);

  const filteredCars = useMemo(() => {
    const term = search.toLowerCase();
    return cars.filter((car) => {
      const matchesSearch = `${car.make} ${car.model} ${car.location}`.toLowerCase().includes(term);
      const withinBudget = maxPrice ? Number(car.price_per_day) <= Number(maxPrice) : true;
      return matchesSearch && withinBudget;
    });
  }, [cars, search, maxPrice]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="uppercase text-emerald-700 font-semibold text-xs">Browse</p>
          <h1 className="text-3xl font-bold text-gray-900">All cars</h1>
          <p className="text-gray-600 text-sm">Filter by location or budget and tap a card to view details.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search make, model, city"
            className="w-full sm:w-64 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
            placeholder="Max $/day"
            className="w-full sm:w-40 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>
      </div>

      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <Link key={car.id} href={`/cars/${car.id}`} className="block">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden h-full">
                <img src={resolveImage(car.image)} alt={`${car.make} ${car.model}`} className="w-full h-48 object-cover" />
                <div className="p-4 space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">{car.make} {car.model}</h2>
                  <p className="text-gray-600 text-sm">{car.year} • {car.location}</p>
                  <p className="text-emerald-700 font-bold">${car.price_per_day} <span className="text-sm text-gray-500 font-medium">/day</span></p>
                  <p className="text-sm text-gray-500 max-h-12 overflow-hidden">{car.description}</p>
                </div>
              </div>
            </Link>
          ))}
          {!error && filteredCars.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-8">No cars found with those filters.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CarsPage;
