'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Image as ImageIcon, LogOut, Loader } from 'lucide-react';
import ProductManager from '@/components/admin/ProductManager';
import GalleryManager from '@/components/admin/GalleryManager';

const Admin: React.FC = () => {
  const { user, userProfile, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'products' | 'gallery'>(
    'products'
  );

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/admin/login');
      } else if (userProfile && userProfile.role !== 'admin') {
        router.replace('/'); // Redirect non-admins to home
      }
    }
  }, [user, userProfile, loading, router]);

  if (loading || !user || userProfile?.role !== 'admin') {
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-4">
        <Loader className="animate-spin text-terracotta" size={40} />
        <p className="text-sm text-gray-500 animate-pulse">
          Verifying privileges...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col h-auto md:h-screen sticky top-0 z-20">
        <div className="p-6 border-b border-gray-100">
          <h1 className="font-serif text-2xl font-bold">
            Admin<span className="text-terracotta">Panel</span>
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'products'
                ? 'bg-terracotta text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ShoppingBag size={20} /> Products
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'gallery'
                ? 'bg-terracotta text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ImageIcon size={20} /> Gallery / Showcase
          </button>
        </nav>
        <div className="p-4 border-t">
          <div className="mb-4 px-2">
            <div className="text-xs font-bold text-gray-500 uppercase mb-1">
              Logged In As
            </div>
            <div className="text-sm font-medium truncate">
              {userProfile?.firstName} {userProfile?.lastName}
            </div>
            <div className="text-xs text-gray-400 truncate">{user.email}</div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-error hover:bg-error/5 p-2 rounded w-full transition-colors"
          >
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'products' ? <ProductManager /> : <GalleryManager />}
      </main>
    </div>
  );
};

export default Admin;
