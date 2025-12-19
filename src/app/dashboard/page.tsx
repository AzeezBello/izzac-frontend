"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';
import { useRequireAuth } from '../../hooks/useAuth';
import Loader from '../../components/Loader';

type Car = {
  id: number;
  make: string;
  model: string;
  year: number;
  price_per_day: number;
  image: string;
  location: string;
};

const HostDashboard = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading } = useRequireAuth('/login?next=/dashboard');

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCars = async () => {
      try {
        const response = await api.get('/cars/my/');
        setCars(response.data);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
        setError('Unable to load your cars right now.');
      }
    };

    fetchCars();
  }, [isAuthenticated]);

  if (isLoading) return <Loader />;
  if (!isAuthenticated) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="uppercase text-emerald-700 font-semibold text-xs">Host</p>
          <h1 className="text-3xl font-bold text-gray-900">Your garage</h1>
          <p className="text-gray-600 text-sm">Manage the cars you share on Izzac.</p>
        </div>
        <Link href="/dashboard/add-car" className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition">
          Add a car
        </Link>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div key={car.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <img src={car.image?.startsWith('http') ? car.image : `${process.env.NEXT_PUBLIC_API_URL}${car.image}`} alt={`${car.make} ${car.model}`} className="w-full h-44 object-cover" />
            <div className="p-4 space-y-1">
              <h2 className="text-xl font-semibold text-gray-900">{car.make} {car.model}</h2>
              <p className="text-gray-600 text-sm">{car.year} • {car.location}</p>
              <p className="text-emerald-700 font-bold">${car.price_per_day} <span className="text-sm text-gray-500 font-medium">/day</span></p>
            </div>
          </div>
        ))}
        {cars.length === 0 && !error && (
          <div className="col-span-full text-center text-gray-500 py-10">
            You have not listed any cars yet. <Link href="/dashboard/add-car" className="text-emerald-700 font-semibold">Add your first car.</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostDashboard;
