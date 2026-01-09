'use client';

import React from 'react';
import { ShopProvider } from '../context/ShopContext';
import { AuthProvider } from '../context/AuthContext';
import Layout from '../components/Layout';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ShopProvider>
        <Layout>{children}</Layout>
      </ShopProvider>
    </AuthProvider>
  );
}
