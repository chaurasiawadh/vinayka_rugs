import React from 'react';
import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title:
    'Our Story & Craftsmanship | Heirloom Hand-Knotted Rugs | Vinayka Rugs',
  description:
    'Since 1982, Vinayka Rugs has been preserving the ancient art of hand-knotted rugs. Learn about our heritage, artisans from Varanasi, and premium craftsmanship.',
  openGraph: {
    title:
      'Our Story & Craftsmanship | Heirloom Hand-Knotted Rugs | Vinayka Rugs',
    description:
      'Since 1982, Vinayka Rugs has been preserving the ancient art of hand-knotted rugs. Learn about our heritage and artisans from Varanasi.',
    images: [{ url: '/images/hero-model-rug-final.png' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Our Story & Craftsmanship | Heirloom Hand-Knotted Rugs | Vinayka Rugs',
    description: 'Preserving the ancient art of hand-knotted rugs since 1982.',
    images: ['/images/hero-model-rug-final.png'],
  },
};

export default function About() {
  return <AboutClient />;
}
