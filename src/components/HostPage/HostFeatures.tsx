// src/components/HostPage/HostFeatures.tsx
import Image from 'next/image';

const HostFeatures = () => {
  return (
    <section className="text-center">
      <h2 className="text-4xl font-bold mb-4">Izzac it easily with Izzac Setup</h2>
      <div className="relative flex justify-center items-center my-10">
        {/* Center Image (Phone with Superhost) */}
        <div className="relative z-10">
          <Image
            src="/images/hero-bg.webp" // Replace with actual phone image path
            alt="Meet your Superhost"
            width={500}
            height={600}
          />
        </div>
      </div>
      <div className="flex justify-around mt-10 text-left">
        <div>
          <h3 className="font-bold text-lg">One-to-one guidance from a Superhost</h3>
          <p>We’ll match you with a Superhost in your area...</p>
        </div>
        <div>
          <h3 className="font-bold text-lg">An experienced guest for your first booking</h3>
          <p>For your first booking, you can choose...</p>
        </div>
        <div>
          <h3 className="font-bold text-lg">Specialised support from Izzac</h3>
          <p>New Hosts get one-tap access to specially...</p>
        </div>
      </div>
    </section>
  );
};

export default HostFeatures;
