"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { useRequireAuth } from '../../../hooks/useAuth';
import Loader from '../../../components/Loader';

const AddCarPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useRequireAuth('/login?next=/dashboard/add-car');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    const formData = new FormData();
    formData.append('make', make);
    formData.append('model', model);
    formData.append('year', year);
    formData.append('price_per_day', price);
    formData.append('location', location);
    formData.append('description', description);
    formData.append('available', 'true');
    if (image) formData.append('image', image);

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await api.post('/cars/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Car listed successfully!');
      router.push('/dashboard');
    } catch (err: any) {
      const message = err?.response?.data?.detail || 'Failed to add car. Please check required fields.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <Loader />;
  if (!isAuthenticated) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">List your car</h1>
      <p className="text-gray-600 mb-6">Share a few details and set your daily rate.</p>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-gray-100 rounded-2xl shadow-sm p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="make">Make</label>
            <input id="make" type="text" value={make} onChange={(e) => setMake(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="model">Model</label>
            <input id="model" type="text" value={model} onChange={(e) => setModel(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="year">Year</label>
            <input id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="price">Price per day ($)</label>
            <input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="location">Location</label>
          <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="description">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200" rows={4} required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="image">Photo</label>
          <input id="image" type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="w-full" required />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-emerald-700 font-semibold">{success}</p>}
        <button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-60" disabled={submitting}>
          {submitting ? 'Posting...' : 'Publish listing'}
        </button>
      </form>
    </div>
  );
};

export default AddCarPage;
