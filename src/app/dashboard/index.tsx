// src/app/dashboard/index.tsx
"use client";

import { useEffect, useState } from 'react';
import api from '../../lib/api';

const HostDashboard = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get('/user/cars/');
        setCars(response.data);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Your Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cars.map(car => (
          <div key={car.id} className="border rounded p-4">
            <img src={car.image} alt={`${car.make} ${car.model}`} className="w-full h-40 object-cover mb-2" />
            <h2 className="text-xl font-semibold">{car.make} {car.model} ({car.year})</h2>
            <p>${car.price_per_day}/day</p>
            {/* Additional booking management options can go here */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HostDashboard;
