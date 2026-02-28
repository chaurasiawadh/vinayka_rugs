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
} from '@remixicon/react';

const AccountDropdown: React.FC<{ isScrolled?: boolean }> = ({
  isScrolled = true,
}) => {
  const { user, logout } = useAuth();
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

  const menuItems = [
    { label: 'My Profile', href: '/account', icon: RiUser3Line },
    { label: 'My Orders', href: '/orders', icon: RiShoppingBag3Line },
    { label: 'Wishlist', href: '/watchlist', icon: RiHeart3Line },
  ];

  if (!user) {
    return (
      <Link
        href="/login"
        className={`p-2 transition-colors rounded-full flex items-center justify-center group ${
          isScrolled
            ? 'text-gray-500 hover:text-black'
            : 'text-[#FAF9F6] hover:text-white'
        }`}
        aria-label="Login"
      >
        <RiUser3Line
          size={22}
          strokeWidth={1.5}
          className="transition-colors group-hover:currentColor"
        />
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
        className={`p-2 transition-colors focus:outline-none flex items-center justify-center group ${
          isScrolled
            ? 'text-gray-500 hover:text-black'
            : 'text-[#FAF9F6] hover:text-white'
        }`}
        aria-label="Account Menu"
      >
        <RiUser3Line
          size={22}
          strokeWidth={1.5}
          className="transition-colors group-hover:currentColor"
        />
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
