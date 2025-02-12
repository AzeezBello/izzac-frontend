// src/app/dashboard/host/page.tsx
"use client";

import { useAuth } from '../../../hooks/useAuth';

const HostDashboard = () => {
  const isAuthorized = useAuth('host');

  if (!isAuthorized) return null;

  return (
    <div>
      <h1>Welcome to the Host Dashboard</h1>
      {/* Host-specific dashboard content */}
    </div>
  );
};

export default HostDashboard;
