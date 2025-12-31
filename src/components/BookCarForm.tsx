"use client";

import { useMemo, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

type BookCarFormProps = {
  carId: number;
  pricePerDay: number;
};

const BookCarForm = ({ carId, pricePerDay }: BookCarFormProps) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const estimatedTotal = useMemo(() => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dayCount = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return dayCount > 0 ? dayCount * Number(pricePerDay) : null;
  }, [startDate, endDate, pricePerDay]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push(`/login?next=/cars/${carId}`);
      return;
    }

    const dayCount = Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (dayCount <= 0) {
      setError('End date must be after start date.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const { data } = await api.post('/bookings/', {
        car_id: carId,
        start_date: startDate,
        end_date: endDate,
      });
      setMessage(`Booking confirmed! Total $${data.total_price}`);
    } catch (error: unknown) {
      const errorDetails = axios.isAxiosError<{ detail?: string; non_field_errors?: string[] }>(error)
        ? {
            detail: error.response?.data?.detail ?? null,
            nonField: error.response?.data?.non_field_errors?.[0] ?? null,
            validation: typeof error.response?.data === 'string' ? error.response.data : null,
          }
        : { detail: null, nonField: null, validation: null };
      const { detail, nonField, validation } = errorDetails;
      setError(detail || nonField || validation || 'Could not complete your booking.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleBooking} className="space-y-3 border border-gray-100 p-4 rounded-xl shadow-sm">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="start">Start date</label>
        <input
          id="start"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="end">End date</label>
        <input
          id="end"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          required
        />
      </div>

      {estimatedTotal && (
        <p className="text-sm text-gray-700">
          Estimated total: <span className="font-semibold text-emerald-700">${estimatedTotal}</span>
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-emerald-700 font-semibold">{message}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
      >
        {submitting ? 'Booking...' : 'Book now'}
      </button>
    </form>
  );
};

export default BookCarForm;
