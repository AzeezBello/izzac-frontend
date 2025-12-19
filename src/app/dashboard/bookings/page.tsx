"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../../lib/api';
import { useRequireAuth } from '../../../hooks/useAuth';
import Loader from '../../../components/Loader';

type Booking = {
  id: number;
  start_date: string;
  end_date: string;
  total_price: string;
  status: string;
  car: {
    id: number;
    make: string;
    model: string;
    location: string;
    image: string;
  };
};

const BookingsPage = () => {
  const { isAuthenticated, isLoading } = useRequireAuth('/login?next=/dashboard/bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'rider' | 'host'>('rider');

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadBookings = async () => {
      setError(null);
      try {
        const params = viewMode === 'host' ? { as_host: true } : {};
        const { data } = await api.get('/bookings/', { params });
        setBookings(data);
      } catch (err) {
        console.error(err);
        setError('Could not load bookings right now.');
      }
    };

    loadBookings();
  }, [isAuthenticated, viewMode]);

  if (isLoading) return <Loader />;
  if (!isAuthenticated) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 space-y-6">
      <div>
        <p className="uppercase text-emerald-700 font-semibold text-xs">Trips</p>
        <h1 className="text-3xl font-bold text-gray-900">Your bookings</h1>
        <p className="text-gray-600 text-sm">Toggle to see trips you booked or bookings made on your cars.</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setViewMode('rider')}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${viewMode === 'rider' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-200 text-gray-700'}`}
        >
          As rider
        </button>
        <button
          onClick={() => setViewMode('host')}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${viewMode === 'host' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-200 text-gray-700'}`}
        >
          For my cars
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4">
            <img
              src={booking.car.image?.startsWith('http') ? booking.car.image : `${process.env.NEXT_PUBLIC_API_URL}${booking.car.image}`}
              alt={`${booking.car.make} ${booking.car.model}`}
              className="w-full md:w-40 h-32 object-cover rounded-lg"
            />
            <div className="flex-1 space-y-1">
              <h2 className="text-xl font-semibold text-gray-900">{booking.car.make} {booking.car.model}</h2>
              <p className="text-gray-600 text-sm">{booking.car.location}</p>
              <p className="text-gray-700 text-sm">From {booking.start_date} to {booking.end_date}</p>
              <p className="text-emerald-700 font-bold">${booking.total_price} <span className="text-sm text-gray-500 font-medium">total</span></p>
              <p className="text-sm text-gray-500">Status: <span className="font-semibold capitalize">{booking.status}</span></p>
            </div>
            <Link href={`/cars/${booking.car.id}`} className="text-emerald-700 font-semibold text-sm underline">
              View car
            </Link>
          </div>
        ))}
        {bookings.length === 0 && !error && (
          <div className="text-center text-gray-500 py-10">
            No bookings yet. <Link href="/cars" className="text-emerald-700 font-semibold">Browse cars to start your first trip.</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
