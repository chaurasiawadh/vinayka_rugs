import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#111111] text-white">
      {/* Main grid */}
      <div className="max-w-site mx-auto px-5 sm:px-8 lg:px-16 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="Vinayka Rugs"
                width={100}
                height={70}
                priority
                className="w-auto h-16 object-contain bg-white px-3 py-2 rounded-lg"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Crafting legacy since 1982. We weave stories into every knot,
              bringing the timeless art of handmade luxury to your modern home.
            </p>
            {/* Social links placeholder */}
            <div className="flex gap-3 pt-1">
              <a
                href="https://wa.me/919936169852"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
              <a
                href="mailto:info@vinaykarugs.com"
                aria-label="Email"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all"
              >
                <Mail size={15} />
              </a>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-300 mb-5">
              Explore
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {[
                { label: 'All Rugs', href: '/shop' },
                { label: 'Bespoke Services', href: '/bespoke' },
                {
                  label: 'Traditional & Vintage',
                  href: '/shop?cat=Traditional',
                },
                { label: 'About Us', href: '/about' },
                { label: 'Store Locator', href: '/store-locator' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="hover:text-white transition-colors hover:pl-1 duration-200 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-300 mb-5">
              Support
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {[
                { label: 'Help & Support', href: '/customer-service' },
                { label: 'Contact Us', href: '/contact' },
                {
                  label: 'Shipping & Returns',
                  href: '/shipping-returns-exchange',
                },
                { label: 'Return Policy', href: '/return-cancellation-policy' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="hover:text-white transition-colors hover:pl-1 duration-200 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-300 mb-5">
              Visit Us
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="shrink-0 mt-0.5 text-terracotta" />
                <span className="leading-relaxed">
                  SHYAMA EXPORTS, Chauri Bazar (Main Road), Parsipur Bhadohi,
                  Uttar Pradesh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="shrink-0 text-terracotta" />
                <a
                  href="tel:9936169852"
                  className="hover:text-white transition-colors"
                >
                  +91 9936169852
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="shrink-0 text-terracotta" />
                <a
                  href="mailto:info@vinaykarugs.com"
                  className="hover:text-white transition-colors break-all"
                >
                  info@vinaykarugs.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8 px-5 sm:px-8 lg:px-16 py-5">
        <div className="max-w-site mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Vinayka Rugs. All rights reserved.</p>
          <div className="flex items-center gap-5">
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
            <Link
              href="/return-cancellation-policy"
              className="hover:text-gray-300 transition-colors"
            >
              Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
