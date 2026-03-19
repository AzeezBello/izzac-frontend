// src/components/HostPage/HostFaq.tsx
import { useState } from 'react';
import Link from 'next/link';
import { hostFaqs } from '../../lib/productContent';

const HostFaq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:pb-16 text-gray-900">
      <div className="rounded-[2rem] bg-gray-50 p-6 md:p-8 shadow-md">
        <p className="text-emerald-700 font-semibold uppercase tracking-[0.22em] text-xs mb-3">Host FAQ</p>
        <h2 className="text-3xl font-bold mb-8">Questions hosts usually ask before they publish</h2>
      <div className="space-y-4">
          {hostFaqs.map((faq, index) => (
          <div key={index}>
            <button
              onClick={() => toggleFaq(index)}
              className="w-full text-left font-semibold text-lg flex justify-between items-center py-2 border-b border-gray-300"
            >
              {faq.question}
              <span className="text-gray-500">{openIndex === index ? '-' : '+'}</span>
            </button>
            {openIndex === index && (
              <p className="mt-2 text-gray-700">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
      
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/cars/list-car" className="rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold">Review the listing flow</h3>
            <p className="text-sm text-gray-600 mt-2">See the exact host steps before you open the add-car form.</p>
          </Link>
          <Link href="/dashboard/add-car" className="rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold">Jump to add car</h3>
            <p className="text-sm text-gray-600 mt-2">If you are already signed in, move straight into listing creation.</p>
          </Link>
          <Link href="/dashboard/bookings" className="rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold">Open bookings</h3>
            <p className="text-sm text-gray-600 mt-2">Switch into the host view to monitor reservations on your cars.</p>
          </Link>
        </div>

        <div className="mt-10 p-6 bg-white rounded-[1.5rem] shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">Ready to publish your first listing?</h3>
            <p className="text-gray-600">Create your host account, add a car, and manage the full lifecycle from Izzac.</p>
          </div>
          <Link href="/signup?role=host" className="px-6 py-3 border border-gray-800 text-gray-800 rounded-lg font-semibold hover:bg-gray-800 hover:text-white transition">
            Start hosting
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HostFaq;
