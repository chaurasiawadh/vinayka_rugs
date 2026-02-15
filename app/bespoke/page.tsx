import React from 'react';
import type { Metadata } from 'next';
import BespokeClient from './BespokeClient';

export const metadata: Metadata = {
  title: 'Bespoke Hand-Knotted Rugs | Custom Designer Carpets | Vinayka Rugs',
  description:
    'Create your own masterpiece. Our bespoke service offers custom sizes, color matching, and unique designs handcrafted by master artisans in Varanasi.',
  openGraph: {
    title: 'Bespoke Hand-Knotted Rugs | Custom Designer Carpets | Vinayka Rugs',
    description:
      'Create your own masterpiece. Our bespoke service offers custom sizes, color matching, and unique designs handcrafted by master artisans.',
  },
};

export default function Bespoke() {
  return <BespokeClient />;
}
