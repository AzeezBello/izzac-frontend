// src/components/Footer.tsx
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { HiOutlineGlobe } from 'react-icons/hi';

const footerSections = [
  {
    title: 'Explore',
    links: [
      { href: '/cars', label: 'Browse cars' },
      { href: '/host', label: 'Become a host' },
      { href: '/cars/list-car', label: 'List a car' },
      { href: '/signup', label: 'Create account' },
    ],
  },
  {
    title: 'Account',
    links: [
      { href: '/login', label: 'Log in' },
      { href: '/dashboard', label: 'My garage' },
      { href: '/dashboard/bookings', label: 'Bookings' },
      { href: '/dashboard/rider', label: 'Rider dashboard' },
    ],
  },
  {
    title: 'Host tools',
    links: [
      { href: '/signup?role=host', label: 'Host sign up' },
      { href: '/dashboard/add-car', label: 'Add a car' },
      { href: '/dashboard/host', label: 'Host dashboard' },
      { href: '/', label: 'Featured listings' },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-gray-700">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-emerald-700 transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-4 flex flex-col md:flex-row md:justify-between text-gray-600 text-sm">
          <div className="flex flex-col md:flex-row md:space-x-4 mb-4 md:mb-0">
            <p>© 2026 Izzac.</p>
            <p className="hidden md:block">·</p>
            <Link href="/" className="hover:text-emerald-700 transition">Home</Link>
            <p>·</p>
            <Link href="/cars" className="hover:text-emerald-700 transition">Browse cars</Link>
            <p>·</p>
            <Link href="/host" className="hover:text-emerald-700 transition">Host</Link>
            <p>·</p>
            <Link href="/login" className="hover:text-emerald-700 transition">Log in</Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1">
              <HiOutlineGlobe />
              <span>Nigeria (NG)</span>
            </button>
            <span>₦ NGN</span>
            <div className="flex space-x-4">
              <FaFacebookF />
              <FaTwitter />
              <FaInstagram />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
