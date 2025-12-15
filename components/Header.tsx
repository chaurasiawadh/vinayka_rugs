
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, Heart, ChevronRight, PenTool } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import SearchBar from './Search/SearchBar';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen, wishlist, openBespokeModal } = useShop();
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

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
    { name: 'Shop', path: '/shop' },
    { name: 'Collections', path: '/shop?filter=collections' },
    { name: 'Bespoke', path: '/bespoke' }, 
  ];

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur shadow-sm py-3' : 'bg-cream py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          <button 
            className="lg:hidden p-2 -ml-2 text-text-body hover:bg-black/5 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={24} />
          </button>

          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className={`font-serif text-2xl md:text-3xl font-bold tracking-tight text-text-body transition-colors ${isScrolled ? 'text-terracotta' : ''}`}>
              Vinayka<span className="font-light">Rugs</span>
            </span>
          </Link>

          {/* Desktop Nav & Search */}
          <div className="hidden lg:flex flex-1 items-center justify-between ml-8 gap-8">
            <nav className="flex items-center gap-6 xl:gap-8">
                {navLinks.map((link) => (
                <Link 
                    key={link.name} 
                    to={link.path} 
                    className="text-sm uppercase tracking-widest font-medium text-text-body hover:text-terracotta transition-colors relative group whitespace-nowrap"
                >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-terracotta transition-all group-hover:w-full"></span>
                </Link>
                ))}
            </nav>
            {/* Global Search Bar */}
            <div className="flex-1 max-w-sm">
                <SearchBar />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to={user ? "/account" : "/login"} className="p-2 text-text-body hover:text-terracotta transition-colors hidden sm:block">
              <User size={20} />
            </Link>
             
            <Link to="/watchlist" className="p-2 text-text-body hover:text-terracotta transition-colors relative">
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full ring-2 ring-white"></span>
              )}
            </Link>

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
                  <span className="font-serif text-2xl font-bold text-text-body">Vinayka<span className="font-light text-terracotta">Rugs</span></span>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted mt-1">Luxury Hand-Knotted</p>
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
                      to={link.path} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-3 px-2 rounded-lg text-lg font-serif text-text-body hover:bg-gray-50 hover:text-terracotta transition-colors group"
                    >
                      {link.name}
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-terracotta transition-colors" />
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto space-y-2 pt-6 border-t border-gray-100">
                    <Link 
                        to={user ? "/account" : "/login"} 
                        onClick={() => setIsMobileMenuOpen(false)} 
                        className="flex items-center gap-3 text-text-muted hover:text-text-body p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <User size={20} />
                        <span className="font-medium">{user ? "My Account" : "Login / Register"}</span>
                    </Link>
                    <Link 
                        to="/watchlist" 
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
                  onClick={() => { setIsMobileMenuOpen(false); openBespokeModal('Mobile Menu'); }} 
                  className="w-full bg-text-body text-white py-3.5 rounded-lg font-medium shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-black"
                >
                    <PenTool size={18} className="text-terracotta" /> Request Bespoke Design
                </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
