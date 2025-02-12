// src/components/Header.tsx
import Link from 'next/link';
import Image from 'next/image';
import { FaHome } from 'react-icons/fa'; // Home icon for the button (replace if needed)

const Header = () => {
  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white shadow-md">
      {/* Logo */}
      <div className="flex items-center">
      <Link href="http://localhost:3000/" >
        <Image
          src="http://127.0.0.1:8000/media/logo.png" // Replace with your logo path
          alt="Logo"
          width={30}
          height={22}
        />
      </Link>
      </div>

      {/* Text and Button */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-800 font-semibold">Ready to Izzac it?</span>
        <Link href="/host" className="flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-lg shadow-md hover:from-pink-600 hover:to-red-600 transition-colors">
          <FaHome className="mr-2" /> Izzac Setup
        </Link>
      </div>
    </header>
  );
};

export default Header;
