import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen, wishlist } = useShop();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'Collections', path: '/shop?filter=collections' },
    { name: 'Events', path: '/events' },
    { name: 'Lookbook', path: '/lookbook' },
    { name: 'Bespoke', path: '/bespoke' }, // Placeholder
  ];

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur shadow-sm py-3' : 'bg-cream py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 -ml-2 text-text-body"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center justify-center lg:justify-start flex-1 lg:flex-none">
            <span className={`font-serif text-2xl md:text-3xl font-bold tracking-tight text-text-body transition-colors ${isScrolled ? 'text-terracotta' : ''}`}>
              Vinayka<span className="font-light">Rugs</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 mx-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="text-sm uppercase tracking-widest font-medium text-text-body hover:text-terracotta transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-terracotta transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-text-body hover:text-terracotta transition-colors hidden sm:block">
              <Search size={20} />
            </button>
            <Link to="/account" className="p-2 text-text-body hover:text-terracotta transition-colors hidden sm:block">
              <User size={20} />
            </Link>
             <button className="p-2 text-text-body hover:text-terracotta transition-colors relative hidden sm:block">
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
              )}
            </button>
            <button 
              className="p-2 text-text-body hover:text-terracotta transition-colors relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-terracotta text-white text-[10px] flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
               <span className="font-serif text-xl font-bold">Menu</span>
               <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
            </div>
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className="text-lg font-medium text-text-body border-b border-gray-100 pb-2"
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-4">
                <Link to="/account" className="flex items-center gap-2 text-text-muted">
                    <User size={18} /> My Account
                </Link>
                 <Link to="/search" className="flex items-center gap-2 text-text-muted">
                    <Search size={18} /> Search
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;