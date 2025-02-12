// src/components/Footer.tsx
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { HiOutlineGlobe } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        {/* Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-gray-700">
          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <ul>
              <li><Link href="/help-center">Help Centre</Link></li>
              <li><Link href="/anti-discrimination">Anti-discrimination</Link></li>
              <li><Link href="/disability-support">Disability support</Link></li>
              <li><Link href="/cancellation-options">Cancellation options</Link></li>
              <li><Link href="/report-neighborhood-concern">Report neighbourhood concern</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Hosting</h3>
            <ul>
              <li><Link href="/airbnb-your-home">Izzac your home</Link></li>
              <li><Link href="/aircover-for-hosts">AirCover for Hosts</Link></li>
              <li><Link href="/hosting-resources">Hosting resources</Link></li>
              <li><Link href="/community-forum">Community forum</Link></li>
              <li><Link href="/hosting-responsibly">Hosting responsibly</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Izzac</h3>
            <ul>
              <li><Link href="/newsroom">Newsroom</Link></li>
              <li><Link href="/new-features">New features</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/investors">Investors</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-4 flex flex-col md:flex-row md:justify-between text-gray-600 text-sm">
          <div className="flex flex-col md:flex-row md:space-x-4 mb-4 md:mb-0">
            <p>© 2024 Your Brand, Inc.</p>
            <p className="hidden md:block">·</p>
            <Link href="/privacy">Privacy</Link>
            <p>·</p>
            <Link href="/terms">Terms</Link>
            <p>·</p>
            <Link href="/sitemap">Sitemap</Link>
            <p>·</p>
            <Link href="/company-details">Company details</Link>
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
