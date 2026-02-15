import React from 'react';
import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title:
    'Contact Our Concierge | Luxury Rug Showroom & Inquiries | Vinayka Rugs',
  description:
    'Reach out to the Vinayka Rugs team for inquiries, appointments, or trade program details. We are here to help you find your perfect piece.',
  openGraph: {
    title:
      'Contact Our Concierge | Luxury Rug Showroom & Inquiries | Vinayka Rugs',
    description:
      'Reach out to the Vinayka Rugs team for inquiries, appointments, or trade program details.',
    images: [{ url: '/images/seo-og-image.png' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Contact Our Concierge | Luxury Rug Showroom & Inquiries | Vinayka Rugs',
    description: 'Reach out to the Vinayka Rugs team for inquiries.',
    images: ['/images/seo-og-image.png'],
  },
};

export default function Contact() {
  return <ContactClient />;
}
