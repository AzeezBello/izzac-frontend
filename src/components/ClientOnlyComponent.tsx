// src/components/ClientOnlyComponent.tsx
"use client";

import { useEffect } from 'react';

const ClientOnlyComponent = () => {
  useEffect(() => {
    console.log('Client-side only code can run here.');
  }, []);

  return <div>Client-side content only.</div>;
};

export default ClientOnlyComponent;
