import React from 'react';
import type { Metadata } from 'next';
import StoreLocatorClient from './StoreLocatorClient';

export const metadata: Metadata = {
  title: 'Visit Our Showrooms | Luxury Rug Store Locator | Vinayka Rugs',
  description:
    'Visit the Vinayka Rugs showroom in Bhadohi, Varanasi. Experience the texture and artistry of hand-knotted luxury rugs in person. Walk-ins welcome.',
  openGraph: {
    title: 'Visit Our Showrooms | Luxury Rug Store Locator | Vinayka Rugs',
    description:
      'Visit our showroom to experience the texture and artistry of hand-knotted luxury rugs in person.',
    images: [
      {
        url: '/images/seo-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Vinayka Rugs Showroom',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Visit Our Showrooms | Luxury Rug Store Locator | Vinayka Rugs',
    description:
      'Experience the texture and artistry of hand-knotted luxury rugs in person.',
    images: ['/images/seo-og-image.jpg'],
  },
};

export default function StoreLocator() {
  return <StoreLocatorClient />;
}
