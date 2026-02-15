'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface PolicyLink {
  href: string;
  label: string;
}

interface PolicyLayoutProps {
  title: string;
  lastUpdated?: string;
  currentPath: string;
  children: React.ReactNode;
}

const policyLinks: PolicyLink[] = [
  { href: '/customer-service', label: 'Customer Service' },
  { href: '/shipping-returns-exchange', label: 'Shipping, Returns & Exchange' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-and-conditions', label: 'Terms and Conditions' },
  {
    href: '/return-cancellation-policy',
    label: 'Return & Cancellation Policy',
  },
];

const PolicyLayout: React.FC<PolicyLayoutProps> = ({
  title,
  lastUpdated,
  currentPath,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-terracotta/90 to-terracotta py-16 md:py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">
            {title}
          </h1>
          {lastUpdated && (
            <p className="text-white/90 text-sm">Last updated: {lastUpdated}</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center gap-2 text-text-body font-medium mb-4 border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            <span>Policy Navigation</span>
          </button>

          {/* Sidebar Navigation */}
          <aside
            className={`${
              mobileMenuOpen ? 'block' : 'hidden'
            } lg:block w-full lg:w-64 shrink-0`}
          >
            <div className="lg:sticky lg:top-24 bg-gray-50 rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-4">
                Policies
              </h3>
              <nav className="space-y-1">
                {policyLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-2.5 rounded-lg text-sm transition-all ${
                      currentPath === link.href
                        ? 'bg-terracotta text-white font-medium shadow-sm'
                        : 'text-text-body hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content Area */}
          <main className="flex-1 min-w-0">
            <div className="prose prose-lg max-w-none">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PolicyLayout;
