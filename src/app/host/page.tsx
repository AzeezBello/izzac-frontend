// src/app/host/page.tsx
"use client";

import HostFeatures from '../../components/HostPage/HostFeatures';
import ProtectionComparison from '../../components/HostPage/ProtectionComparison';
import HostFaq from '../../components/HostPage/HostFaq';

const HostPage = () => {
  return (
    <div className="bg-gradient-to-b from-emerald-50 via-white to-white">
      <HostFeatures />
      <ProtectionComparison />
      <HostFaq />
    </div>
  );
};

export default HostPage;

