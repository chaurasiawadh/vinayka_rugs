'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Heart,
  ChevronRight,
  PenTool,
} from 'lucide-react';
import Image from 'next/image';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import SearchBar from './Search/SearchBar';
import MegaMenu from './MegaMenu';
import AccountDropdown from './AccountDropdown';

import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopHovered, setIsShopHovered] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const {
    cartCount,
    setIsCartOpen,
    wishlist,
    openBespokeModal,
    searchQuery,
    setSearchQuery,
  } = useShop();
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsShopHovered(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop', hasMegaMenu: true },
    { name: 'Bespoke', path: '/bespoke' },
    { name: 'Store Locator', path: '/store-locator' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${
          isScrolled
            ? 'bg-white shadow-md border-b border-gray-100'
            : 'bg-transparent backdrop-blur-[2px] border-b border-white/20 shadow-none'
        }`}
        onMouseLeave={() => setIsShopHovered(false)}
      >
        <div
          className={`w-full transition-all duration-500 ${isScrolled ? 'py-1' : 'py-2'}`}
        >
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
            <div className="flex items-center justify-between">
              {/* Logo - Left aligned */}
              {/* <div className="flex-shrink-0 w-1/4">
                <Link
                  href="/"
                  className="inline-flex items-center group transition-all duration-300 hover:opacity-80 active:scale-95"
                >
                  <Image
                    src="/images/logo.png"
                    alt="Vinayka Rugs"
                    width={240}
                    height={80}
                    priority
                    className="w-auto h-20 object-contain"
                  />
                </Link>
              </div> */}

              {/* Desktop Nav - Centered */}
              <div className="hidden lg:flex flex-1 justify-center">
                <nav className="flex items-center gap-10 xl:gap-14">
                  {navLinks.map((link) => (
                    <div
                      key={link.name}
                      className="relative py-2"
                      onMouseEnter={() => setIsShopHovered(!!link.hasMegaMenu)}
                    >
                      <Link
                        href={link.path}
                        className={`text-[12px] tracking-[0.15em] uppercase font-semibold transition-colors duration-500 relative group whitespace-nowrap ${
                          isScrolled
                            ? 'text-gray-800 hover:text-black'
                            : 'text-[#FAF9F6] hover:text-white'
                        }`}
                      >
                        {link.name}
                        {/* Luxury underline effect */}
                        <span
                          className={`absolute -bottom-1 left-0 w-0 h-[1.5px] transition-all duration-300 group-hover:w-full ${
                            isScrolled ? 'bg-black' : 'bg-white'
                          }`}
                        ></span>
                      </Link>
                    </div>
                  ))}
                </nav>
              </div>

              {/* Icons - Right aligned */}
              <div className="flex items-center justify-end w-1/4 gap-6">
                <button
                  className={`p-2 transition-colors duration-500 ${
                    isScrolled
                      ? 'text-gray-800 hover:text-black'
                      : 'text-[#FAF9F6] hover:text-white'
                  }`}
                  aria-label="Search"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                  <Search size={22} strokeWidth={1.5} />
                </button>

                <div className="hidden sm:block transition-colors duration-500">
                  <AccountDropdown isScrolled={isScrolled} />
                </div>

                <button
                  className={`p-2 transition-colors duration-500 relative group ${
                    isScrolled
                      ? 'text-gray-800 hover:text-black'
                      : 'text-[#FAF9F6] hover:text-white'
                  }`}
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingBag size={22} strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-terracotta text-white text-[10px] flex items-center justify-center rounded-full shadow-lg">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Mobile Menu Button */}
                <div className="lg:hidden">
                  <button
                    className={`p-2 -mr-2 transition-colors duration-500 ${
                      isScrolled
                        ? 'text-black'
                        : 'text-[#FAF9F6] hover:text-white'
                    }`}
                    onClick={() => setIsMobileMenuOpen(true)}
                    aria-label="Open Menu"
                  >
                    <Menu size={24} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full left-0 w-full bg-white z-50 shadow-sm border-t border-gray-100"
            >
              <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-4">
                <div className="flex items-center gap-4">
                  <Search
                    size={20}
                    className="text-gray-400"
                    strokeWidth={1.5}
                  />
                  <input
                    type="text"
                    placeholder="Search for..."
                    value={searchQuery}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSearchQuery(val);
                      if (pathname !== '/shop') {
                        router.push('/shop');
                      }
                    }}
                    className="flex-1 text-lg font-light outline-none text-gray-500 placeholder:text-gray-300 bg-transparent font-serif"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                  >
                    <X
                      size={24}
                      className="text-gray-400 hover:text-black"
                      strokeWidth={1}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mega Menu */}
        <MegaMenu
          isOpen={isShopHovered}
          onMouseEnter={() => setIsShopHovered(true)}
          onMouseLeave={() => setIsShopHovered(false)}
        />

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>

            {/* Menu Drawer */}
            <div className="absolute inset-y-0 left-0 w-[85vw] max-w-xs bg-white shadow-2xl flex flex-col animate-slide-in-left h-[100dvh]">
              {/* Drawer Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-cream flex-shrink-0">
                <div>
                  <Image
                    src="/images/logo.png"
                    alt="Vinayka Rugs"
                    width={160}
                    height={48}
                    className="w-auto h-12 object-contain"
                  />
                  <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted mt-1">
                    Luxury Hand-Knotted
                  </p>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-gray-500 hover:text-black hover:bg-black/5 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                <div className="pb-4 border-b border-gray-50">
                  <SearchBar className="w-full" />
                </div>

                <nav className="flex flex-col space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-3 px-2 rounded-lg text-lg font-serif text-text-body hover:bg-gray-50 hover:text-terracotta transition-colors group"
                    >
                      {link.name}
                      <ChevronRight
                        size={16}
                        className="text-gray-300 group-hover:text-terracotta transition-colors"
                      />
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto space-y-2 pt-6 border-t border-gray-100">
                  <Link
                    href={user ? '/account' : '/login'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-text-muted hover:text-text-body p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <User size={20} />
                    <span className="font-medium">
                      {user ? 'My Account' : 'Login / Register'}
                    </span>
                  </Link>
                  <Link
                    href="/watchlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-text-muted hover:text-text-body p-3 rounded-lg hover:bg-gray-50 transition-colors justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Heart size={20} />
                      <span className="font-medium">Watchlist</span>
                    </div>
                    {wishlist.length > 0 && (
                      <span className="bg-terracotta text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex-shrink-0">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openBespokeModal('Mobile Menu');
                  }}
                  className="w-full bg-text-body text-white py-3.5 rounded-lg font-medium shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-black"
                >
                  <PenTool size={18} className="text-terracotta" /> Request
                  Bespoke Design
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
      {/* Spacer to prevent content jump - removed for transparent hero */}
      {/* <div className="h-20 w-full" /> */}
    </>
  );
};

export default Header;
