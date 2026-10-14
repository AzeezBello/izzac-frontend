// src/lib/withAuth.tsx
"use client";

import { useRouter } from 'next/navigation';
import { ComponentType, FC, useEffect } from 'react';

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const WithAuthWrapper: FC<P> = (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (!token) {
        router.push('/login');
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  WithAuthWrapper.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthWrapper;
};

export default withAuth;
