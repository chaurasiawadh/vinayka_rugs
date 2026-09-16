'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Image as ImageIcon,
  LogOut,
  Loader,
  Film,
  ClipboardList,
  ChevronRight,
  LayoutDashboard,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ProductManager from '@/components/admin/ProductManager';
import GalleryManager from '@/components/admin/GalleryManager';
import HeroMediaAdmin from '@/components/admin/hero-media-admin';
import Link from 'next/link';
import Image from 'next/image';

type TabKey = 'products' | 'gallery' | 'hero' | 'orders';

const navItems: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: 'products', label: 'Products', icon: ShoppingBag },
  { key: 'orders', label: 'Orders', icon: ClipboardList },
  { key: 'gallery', label: 'Gallery', icon: ImageIcon },
  { key: 'hero', label: 'Hero Banner', icon: Film },
];

const Admin: React.FC = () => {
  const { user, userProfile, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('orders');

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/admin/login');
      } else if (userProfile && userProfile.role !== 'admin') {
        router.replace('/');
      }
    }
  }, [user, userProfile, loading, router]);

  if (loading || !user || userProfile?.role !== 'admin') {
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-4 bg-gray-50">
        <Loader className="animate-spin text-terracotta" size={36} />
        <p className="text-sm text-gray-400 tracking-wide">Verifying access…</p>
      </div>
    );
  }

  const initials =
    `${userProfile?.firstName?.[0] ?? ''}${userProfile?.lastName?.[0] ?? ''}`.toUpperCase() ||
    'A';

  const activeLabel = navItems.find((n) => n.key === activeTab)?.label ?? '';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── DESKTOP SIDEBAR ─────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-60 xl:w-64 bg-[#1a1a1a] text-white fixed inset-y-0 left-0 z-30 shadow-sidebar">
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="bg-white rounded-md p-1 flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Vinayka Rugs"
              width={36}
              height={36}
              className="w-9 h-9 object-contain"
            />
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold leading-none truncate">
              Vinayka Rugs
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`admin-nav-item ${activeTab === key ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
              {activeTab === key && (
                <ChevronRight size={14} className="ml-auto opacity-60" />
              )}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-2">
            <div className="w-8 h-8 rounded-full bg-terracotta flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {userProfile?.firstName} {userProfile?.lastName}
              </p>
              <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="admin-nav-item text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
          <Link
            href="/"
            className="admin-nav-item text-gray-400 hover:text-white mt-0.5"
          >
            <LayoutDashboard size={16} />
            <span>Back to Website</span>
          </Link>
        </div>
      </aside>

      {/* ── MOBILE TOP BAR ──────────────────────────── */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-[#1a1a1a] shadow-md">
        {/* Header row */}
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2.5">
            <div className="bg-white rounded p-0.5">
              <Image
                src="/images/logo.png"
                alt="Vinayka Rugs"
                width={28}
                height={28}
                className="w-7 h-7 object-contain"
              />
            </div>
            <div>
              <p className="text-white text-xs font-semibold leading-none">
                Vinayka Rugs
              </p>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest">
                Admin
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-terracotta flex items-center justify-center text-white text-[10px] font-bold">
              {initials}
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
              aria-label="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex overflow-x-auto no-scrollbar border-t border-white/10">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                activeTab === key
                  ? 'text-terracotta border-b-2 border-terracotta bg-white/5'
                  : 'text-gray-400 border-b-2 border-transparent hover:text-gray-200'
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────── */}
      <main className="flex-1 lg:ml-60 xl:ml-64 min-h-screen pt-[86px] lg:pt-0">
        {/* Desktop page header */}
        <div className="hidden lg:flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {activeLabel}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <Link
            href="/"
            className="text-xs font-medium text-gray-500 hover:text-terracotta flex items-center gap-1 transition-colors"
          >
            View Website →
          </Link>
        </div>

        {/* Tab content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === 'products' && <ProductManager />}
          {activeTab === 'orders' && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ClipboardList size={48} className="text-gray-200 mb-4" />
              <h2 className="text-lg font-semibold text-gray-400">
                Orders module loading…
              </h2>
              <p className="text-sm text-gray-300 mt-1">
                OrderManager is on the orders-page branch.
              </p>
            </div>
          )}
          {activeTab === 'gallery' && <GalleryManager />}
          {activeTab === 'hero' && <HeroMediaAdmin />}
        </div>
      </main>
    </div>
  );
};

export default Admin;
