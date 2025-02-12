// src/app/list-car/page.tsx
"use client";

import { useAuth } from '../../hooks/useAuth';

const ListCarPage = () => {
  const isAuthenticated = true; // Replace with actual auth logic
  useAuth(isAuthenticated);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">List Your Car</h1>
      {/* Car listing form goes here */}
    </div>
  );
};

export default ListCarPage;
