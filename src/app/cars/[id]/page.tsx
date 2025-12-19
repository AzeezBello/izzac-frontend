// src/app/cars/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BookCarForm from '@/components/BookCarForm';
import publicApi from '@/lib/publicApi';

interface Car {
  id: number;
  make: string;
  model: string;
  image: string;
  year: number;
  price_per_day: number;
  description: string;
  location: string;
}

const resolveImage = (path?: string) => {
  if (!path) return '/window.svg';
  return path.startsWith('http') ? path : `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

const CarDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;

    const fetchCar = async () => {
      try {
        const response = await publicApi.get(`/cars/${params.id}/`);
        setCar(response.data);
      } catch (err) {
        console.error('Failed to fetch car details:', err);
        setError('Car not found or an error occurred.');
      }
    };

    fetchCar();
  }, [params]);

  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (!car) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <img
          src={resolveImage(car.image)}
          alt={`${car.make} ${car.model}`}
          className="w-full h-80 object-cover rounded-xl shadow"
        />
        <div className="border border-gray-100 rounded-xl p-4 shadow-sm space-y-2">
          <p className="text-gray-700"><span className="font-semibold">Location:</span> {car.location}</p>
          <p className="text-gray-700"><span className="font-semibold">Year:</span> {car.year}</p>
          <p className="text-emerald-700 font-bold text-lg">${car.price_per_day} <span className="text-sm text-gray-500 font-medium">/day</span></p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <p className="uppercase text-emerald-700 font-semibold text-xs mb-1">Car detail</p>
          <h1 className="text-3xl font-bold text-gray-900">{car.make} {car.model}</h1>
        </div>
        <p className="text-gray-700 leading-relaxed">{car.description}</p>
        <BookCarForm carId={car.id} pricePerDay={car.price_per_day} />
      </div>
    </div>
  );
};

export default CarDetailsPage;
