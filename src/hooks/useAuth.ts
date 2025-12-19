// src/hooks/useAuth.ts
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth as useAuthContext } from '../context/AuthContext';

export const useRequireAuth = (redirectTo = '/login') => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  return { isAuthenticated, isLoading };
};

export default useRequireAuth;
