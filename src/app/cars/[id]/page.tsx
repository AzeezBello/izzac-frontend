// src/app/cars/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import BookCarForm from '@/components/BookCarForm';

interface Car {
  id: string;
  make: string;
  model: string;
  image: string;
  year: number;
  price_per_day: number;
  description: string;
}

const CarDetailsPage = () => {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cars/${id}/`);
        setCar(response.data);
      } catch (err) {
        console.error('Failed to fetch car details:', err);
        setError('Car not found or an error occurred.');
      }
    };

    fetchCar();
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!car) return <p>Loading...</p>;

  return (
    <div className="bg-white text-gray-800 min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">
        {car.make} {car.model}
      </h1>
      <div className="flex flex-col md:flex-row items-start md:items-center ">
        <img
          src={car.image}
          alt={`${car.make} ${car.model}`}
          className="w-full md:w-1/2 h-auto rounded-lg mb-4"
        />
        
        <div className="md:ml-8">
          <p className="text-gray-600 mb-2">Year: {car.year}</p>
          <p className="text-gray-600 mb-2">Price per Day: ${car.price_per_day}</p>
          <p className="text-gray-600 mb-2">Description: {car.description}</p>
          <BookCarForm carId={car.id} pricePerDay={car.price_per_day} />
        </div>
      </div>
      <div className="mt-8">
        
      </div>
    </div>
  );
};

export default CarDetailsPage;
