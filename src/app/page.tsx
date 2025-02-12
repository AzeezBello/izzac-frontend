"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import publicApi from '../lib/publicApi';

type Car = {
  id: number;
  make: string;
  model: string;
  year: number;
  price_per_day: number;
  image: string;
};

const HomePage = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await publicApi.get('/cars/');
        setCars(response.data);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
        setError('Could not load car listings. Please try again later.');
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Available Cars</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {cars.map((car) => (
            <Link href={`/cars/${car.id}`} key={car.id} passHref>
              <div className="border rounded-lg p-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow">
                <img
                  src={car.image}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h2 className="text-xl font-semibold">
                  {car.make} {car.model} ({car.year})
                </h2>
                <p className="text-gray-600">${car.price_per_day}/day</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
