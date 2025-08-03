import Link from "next/link";
import { IconPhone as Phone, IconMail as Mail } from "@tabler/icons-react";
const Footer = () => {
  return (
    <footer className="bg-[#191A1C] text-gray-300 pt-12 mt-16 border-t border-gray-700">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-4 md:px-6 pb-10 border-b border-gray-700">
        {/* LuxeDiore Description */}
        <div className="md:flex flex-col items-center text-center md:text-left md:items-start">
          <h3 className="text-yellow-400 font-bold text-xl mb-4">LuxeDior</h3>
          <p className="text-sm leading-relaxed">
            Elevating elegance, one fragrance at a time. Discover the essence of
            luxury with our curated collection.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center">
          <h4 className="text-yellow-400 font-semibold text-lg mb-4">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm flex flex-col justify-center items-center">
            <li>
              <Link href="/contact">
                <span className="hover:text-yellow-400 transition cursor-pointer">
                  Contact Us
                </span>
              </Link>
            </li>
            <li>
              <Link href="/terms">
                <span className="hover:text-yellow-400 transition cursor-pointer">
                  Terms & Conditions
                </span>
              </Link>
            </li>
            <li>
              <Link href="/returns-and-refunds">
                <span className="hover:text-yellow-400 transition cursor-pointer">
                  Return & Refunds
                </span>
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy">
                <span className="hover:text-yellow-400 transition cursor-pointer">
                  Privacy Policy
                </span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col items-center  md:items-end">
          <h4 className="text-yellow-400 font-semibold text-lg mb-4">
            Stay Connected
          </h4>
          <a
            href="mailto:perfumes.luxediore@gmail.com"
            className="text-sm flex items-center gap-2 mb-2 space-x-2 hover:text-yellow-400 transition"
          >
            <Mail size={16} className="text-yellow-400" />
            perfumes.luxediore@gmail.com
          </a>
          <p className="text-sm flex items-center gap-2">
            <Phone size={16} className="text-yellow-400" />
            +91-8534000034
          </p>
        </div>
      </div>

      {/* Bottom line */}
      <div className="text-center text-xs text-gray-500 py-6 px-4 md:px-6 max-w-7xl mx-auto">
        © {new Date().getFullYear()} LuxeDior. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
