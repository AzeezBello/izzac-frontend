// src/app/user/dashboard.tsx
"use client";

import { useEffect, useState } from 'react';
import api from '../../lib/api';

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/user/bookings/');
        setBookings(response.data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Your Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul>
          {bookings.map(booking => (
            <li key={booking.id} className="border p-4 mb-2">
              <p>Car: {booking.car}</p>
              <p>Start Date: {booking.start_date}</p>
              <p>End Date: {booking.end_date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserDashboard;
