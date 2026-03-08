import React from 'react';
import type { Metadata } from 'next';
import EventsClient from './EventsClient';

export const metadata: Metadata = {
  title: 'Exhibitions & Design Events | Vinayka Rugs',
  description:
    'Join Vinayka Rugs at prestigious design exhibitions worldwide. Experience our hand-knotted rug collections at India Design ID, Maison & Objet, Salone del Mobile, and more.',
  openGraph: {
    title: 'Exhibitions & Design Events | Vinayka Rugs',
    description:
      'Join Vinayka Rugs at prestigious design exhibitions worldwide. Experience our hand-knotted rug collections in person.',
    images: [
      {
        url: '/images/seo-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Vinayka Rugs Exhibition Events',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Exhibitions & Design Events | Vinayka Rugs',
    description:
      'Join Vinayka Rugs at prestigious design exhibitions worldwide.',
    images: ['/images/seo-og-image.jpg'],
  },
};

export default function Events() {
  return <EventsClient />;
}
