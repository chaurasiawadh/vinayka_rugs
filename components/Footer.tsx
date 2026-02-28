import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1C1C1C] text-white pt-8 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-1">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="Vinayka Rugs"
                width={134}
                height={96}
                priority
                className="w-auto h-20 object-contain bg-white p-2 rounded-md"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Crafting legacy since 1982. We weave stories into every knot,
              bringing the timeless art of handmade luxury to your modern home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif mb-6">Explore</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link
                  href="/shop"
                  className="hover:text-terracotta transition-colors"
                >
                  All Rugs
                </Link>
              </li>
              <li>
                <Link
                  href="/bespoke"
                  className="hover:text-terracotta transition-colors"
                >
                  Bespoke Services
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?cat=Traditional"
                  className="hover:text-terracotta transition-colors"
                >
                  Traditional & Vintage
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-serif mb-6">Customer Service</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link
                  href="/customer-service"
                  className="hover:text-terracotta transition-colors"
                >
                  Help & Support
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-terracotta transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-terracotta transition-colors"
                >
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Newsletter */}
          <div>
            <h3 className="text-lg font-serif mb-6">Visit Us</h3>
            <ul className="space-y-3 text-sm text-gray-400 mb-6">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 mt-0.5 text-terracotta" />
                <span>
                  SHYAMA EXPORTS Chauri Bazar (Main Road), Parsipur Bhadohi,
                  Uttar Pradesh
                </span>
              </li>
              <li className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="currentColor"
                    className="text-terracotta"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  <a href="tel:9936169852" className="hover:text-terracotta">
                    9936169852
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-terracotta" />
                <a
                  href="mailto:info@vinaykarugs.com"
                  className="hover:text-terracotta break-all"
                >
                  info@vinaykarugs.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; 2026 Vinayka Rugs. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link
              href="/privacy-policy"
              className="hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="hover:text-gray-300 transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
