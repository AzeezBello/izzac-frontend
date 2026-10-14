// src/components/HostPage/ProtectionComparison.tsx
import Link from 'next/link';
import { hostWorkflow } from '../../lib/productContent';

const ProtectionComparison = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
        <div>
          <p className="text-emerald-700 font-semibold uppercase tracking-[0.22em] text-xs mb-3">Host workflow</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How hosting works across the actual app</h2>
          <p className="text-gray-600 mt-3 max-w-3xl">
            These are the live capabilities hosts can use today, from protected listing creation to host-side bookings visibility.
          </p>
        </div>
        <Link href="/dashboard/bookings" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
          Open bookings workspace
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {hostWorkflow.map((stage) => (
          <div key={stage.title} className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">{stage.title}</h3>
            <p className="text-sm text-gray-600 mt-3 leading-6">{stage.description}</p>
            <div className="space-y-3 mt-5">
              {stage.items.map((item) => (
                <div key={item} className="rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-gray-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[2rem] bg-gray-900 text-white p-6 md:p-8 mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold">Use one account across the full platform</h3>
          <p className="text-gray-300 mt-2 max-w-2xl">
            Hosts can still browse and book cars as riders, while the same account powers garage management and host-side bookings.
          </p>
        </div>
        <Link href="/signup?role=host" className="px-5 py-3 rounded-lg bg-emerald-500 text-white font-semibold text-center hover:bg-emerald-400 transition">
          Create a host account
        </Link>
      </div>
    </section>
  );
};

export default ProtectionComparison;
