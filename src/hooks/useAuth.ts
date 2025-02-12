// src/hooks/useAuth.ts
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useAuth = (requiredRole: 'host' | 'rider' | 'admin') => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('role'); // Assume role is stored after login

    if (token && userRole === requiredRole) {
      setIsAuthorized(true);
    } else {
      router.push('/login');
    }
  }, [requiredRole, router]);

  return isAuthorized;
};
