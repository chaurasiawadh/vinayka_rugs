'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
  RiUser3Line,
  RiShoppingBag3Line,
  RiHeart3Line,
  RiLogoutBoxRLine,
  RiArrowDownSLine,
} from '@remixicon/react';

const AccountDropdown: React.FC = () => {
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) {
      // Desktop only
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024) {
      // Desktop only
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 150);
    }
  };

  const handleClick = () => {
    if (window.innerWidth < 1024) {
      // Mobile only
      setIsOpen(!isOpen);
    } else {
      // On desktop, click could navigate to account if logged in
      if (user) {
        router.push('/account');
      } else {
        router.push('/login');
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    router.push('/');
  };

  const displayName =
    userProfile?.firstName || user?.displayName?.split(' ')[0] || 'My Account';

  const menuItems = [
    { label: 'My Profile', href: '/account', icon: RiUser3Line },
    { label: 'My Orders', href: '/orders', icon: RiShoppingBag3Line },
    { label: 'Wishlist', href: '/watchlist', icon: RiHeart3Line },
  ];

  if (!user) {
    return (
      <Link
        href="/login"
        className="px-6 py-1.5 bg-white text-[#2874f0] font-bold border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors hidden lg:block text-sm"
      >
        Login
      </Link>
    );
  }

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button
        onClick={handleClick}
        className="flex items-center gap-1 p-2 text-gray-700 hover:text-blue-600 transition-colors focus:outline-none group"
      >
        <div className="flex items-center gap-1.5">
          <RiUser3Line
            size={18}
            className="text-gray-700 group-hover:text-blue-600 transition-colors"
          />
          <span className="text-[14px] font-bold truncate hidden lg:block max-w-[100px]">
            {displayName}
          </span>
          <RiArrowDownSLine
            size={16}
            className={`transition-transform duration-200 hidden lg:block ${isOpen ? 'rotate-180 text-blue-600' : 'text-gray-400'}`}
          />
        </div>
      </button>

      {/* Dropdown Card */}
      <div
        className={`absolute right-[-20px] top-full mt-2 w-56 bg-white rounded-sm shadow-[0_4px_16px_rgba(0,0,0,0.2)] border border-gray-100 z-[100] transition-all duration-200 origin-top
          ${
            isOpen
              ? 'opacity-100 translate-y-0 visible scale-100'
              : 'opacity-0 -translate-y-2 invisible scale-95'
          }
        `}
      >
        {/* Top Notch Pointer */}
        <div className="absolute -top-1.5 right-[34px] w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45 z-0" />

        <div className="relative bg-white z-10 py-1 rounded-sm overflow-hidden">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-[14px] text-gray-700 hover:bg-gray-50 hover:text-[#2874f0] transition-colors border-b border-gray-50 last:border-0"
            >
              <item.icon size={18} className="text-[#2874f0]" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-[14px] text-red-600 hover:bg-gray-50 transition-colors font-medium"
          >
            <RiLogoutBoxRLine size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountDropdown;
