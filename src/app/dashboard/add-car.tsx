// src/app/dashboard/add-car.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../lib/api';

const AddCarPage = () => {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('make', make);
    formData.append('model', model);
    formData.append('year', year);
    formData.append('price_per_day', price);
    if (image) formData.append('image', image);

    try {
      await api.post('/cars/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      router.push('/dashboard'); // Redirect to host dashboard after adding
    } catch (error) {
      console.error('Failed to add car:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border">
      <h1 className="text-2xl font-bold mb-4">List Your Car</h1>
      <input type="text" placeholder="Make" value={make} onChange={(e) => setMake(e.target.value)} className="mb-2 p-2 border rounded w-full" />
      <input type="text" placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} className="mb-2 p-2 border rounded w-full" />
      <input type="text" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} className="mb-2 p-2 border rounded w-full" />
      <input type="text" placeholder="Price per day" value={price} onChange={(e) => setPrice(e.target.value)} className="mb-2 p-2 border rounded w-full" />
      <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} className="mb-4" />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">List Car</button>
    </form>
  );
};

export default AddCarPage;
