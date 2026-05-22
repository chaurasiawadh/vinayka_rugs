'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ShopProvider } from '../context/ShopContext';
import { AuthProvider } from '../context/AuthContext';
import { VisualizerProvider } from '../context/VisualizerContext';
import Layout from '../components/Layout';

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') ?? false;

  return (
    <AuthProvider>
      <ShopProvider enableProducts={!isAdminRoute}>
        <VisualizerProvider>
          <Layout>{children}</Layout>
        </VisualizerProvider>
      </ShopProvider>
    </AuthProvider>
  );
}
