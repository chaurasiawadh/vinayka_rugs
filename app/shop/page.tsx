import React from 'react';
import type { Metadata } from 'next';
import ShopClient from './ShopClient';

export const metadata: Metadata = {
  title:
    'Shop Luxury Rugs & Carpets Online | Handmade Collections | Vinayka Rugs',
  description:
    'Browse our curated collection of luxury hand-knotted rugs. Filter by style, material, and room to find the perfect artisan flooring for your home.',
  openGraph: {
    title:
      'Shop Luxury Rugs & Carpets Online | Handmade Collections | Vinayka Rugs',
    description:
      'Browse our curated collection of luxury hand-knotted rugs. Find the perfect artisan flooring for your home.',
  },
};

export default function Shop() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ShopClient />
    </React.Suspense>
  );
}
