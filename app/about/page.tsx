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
  },
};

export default function About() {
  return <AboutClient />;
}
