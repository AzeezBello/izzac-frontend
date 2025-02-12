// src/app/host/page.tsx
"use client";

import HostFeatures from '../../components/HostPage/HostFeatures';
import ProtectionComparison from '../../components/HostPage/ProtectionComparison';
import HostFaq from '../../components/HostPage/HostFaq';

import { useRouter } from 'next/navigation';

const HostPage = () => {
  const router = useRouter();

  return (
    <div >
      <HostFeatures />
      <ProtectionComparison />
      <HostFaq />
    </div>
  );
};

export default HostPage;

