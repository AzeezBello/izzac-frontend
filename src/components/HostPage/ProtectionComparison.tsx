// src/components/HostPage/ProtectionComparison.tsx
import Link from 'next/link';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ProtectionComparison = () => {
  return (
    <section className="text-center p-8">
      <h2 className="text-4xl font-bold mb-8">Izzac it with top-to-bottom protection</h2>
      <div className="grid grid-cols-3 gap-6 text-left">
        
        {/* Existing Rows */}
        <div>
          <h3 className="font-bold text-lg">Rider identity verification</h3>
          <p>Our comprehensive verification system checks details such as name, address, government ID, and more to confirm the identity of Riders who book on Izzac.</p>
        </div>
        <div className="flex items-center justify-center text-green-500">
          <FaCheckCircle className="h-6 w-6" />
        </div>
        <div className="flex items-center justify-center text-green-500">
          <FaCheckCircle className="h-6 w-6" />
        </div>

        <div>
          <h3 className="font-bold text-lg">Reservation screening</h3>
          <p>Our proprietary technology analyses hundreds of factors in each reservation and blocks certain bookings that show a high risk for disruptive parties and property damage.</p>
        </div>
        <div className="flex items-center justify-center text-green-500">
          <FaCheckCircle className="h-6 w-6" />
        </div>
        <div className="flex items-center justify-center text-red-500">
          <FaTimesCircle className="h-6 w-6" />
        </div>

        <div>
          <h3 className="font-bold text-lg">$3m damage protection</h3>
          <p>Izzac reimburses you for damage caused by riders to your car</p>
        </div>
        <div className="flex items-center justify-center text-green-500">
          <FaCheckCircle className="h-6 w-6" />
        </div>
        <div className="flex items-center justify-center text-red-500">
          <FaTimesCircle className="h-6 w-6" />
        </div>

        <div>
          <h3 className="font-bold text-lg">Income loss</h3>
        </div>
        <div className="flex items-center justify-center text-green-500">
          <FaCheckCircle className="h-6 w-6" />
        </div>
        <div className="flex items-center justify-center text-red-500">
          <FaTimesCircle className="h-6 w-6" />
        </div>

        <div>
          <h3 className="font-bold text-lg">Deep cleaning</h3>
        </div>
        <div className="flex items-center justify-center text-green-500">
          <FaCheckCircle className="h-6 w-6" />
        </div>
        <div className="flex items-center justify-center text-red-500">
          <FaTimesCircle className="h-6 w-6" />
        </div>

        <div>
          <h3 className="font-bold text-lg">24-hour safety line</h3>
          <p>If you ever feel unsafe, our app provides one-tap access to specially trained safety agents, day or night.</p>
        </div>
        <div className="flex items-center justify-center text-green-500">
          <FaCheckCircle className="h-6 w-6" />
        </div>
        <div className="flex items-center justify-center text-red-500">
          <FaTimesCircle className="h-6 w-6" />
        </div>
      </div>

      <p className="text-sm mt-6 text-gray-500">
        Comparison is based on public information and free offerings by top competitors as of 22/10.{' '}
        <a href="#" className="text-blue-500 underline">Find details and exclusions here.</a>
      </p>

      <Link href="/signup?role=host">
        <button className="mt-8 px-4 py-2 border border-gray-800 text-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition">
          Learn more
        </button>
      </Link>
    </section>
  );
};

export default ProtectionComparison;
