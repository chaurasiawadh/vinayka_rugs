import React from 'react';
import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Luxury Hand-Knotted Rugs & Premium Carpets | Vinayka Rugs',
  description:
    'Discover exquisite hand-knotted rugs blending tradition and modern luxury. Premium artisan craftsmanship from Varanasi, India. Bespoke designs available.',
  openGraph: {
    title: 'Luxury Hand-Knotted Rugs & Premium Carpets | Vinayka Rugs',
    description:
      'Discover exquisite hand-knotted rugs blending tradition and modern luxury. Premium artisan craftsmanship from Varanasi, India.',
  },
};

export default function Home() {
  return <HomeClient />;
}
