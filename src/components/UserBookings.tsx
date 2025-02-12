// src/components/UserBookings.tsx
"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/bookings/');
        setBookings(response.data);
      } catch (error) {
        setError('Failed to fetch bookings.');
      }
    };
    fetchBookings();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>
      {error && <p className="text-red-500">{error}</p>}
      {bookings.length > 0 ? (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id} className="p-4 border rounded mb-2">
              Car: {booking.car.make} {booking.car.model}
              <br />
              Start Date: {booking.start_date}
              <br />
              End Date: {booking.end_date}
            </li>
          ))}
        </ul>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default UserBookings;
