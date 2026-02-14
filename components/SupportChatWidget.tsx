'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { RiWhatsappLine, RiCloseLine } from '@remixicon/react';
import { AnimatePresence, motion } from 'framer-motion';

const SupportChatWidget: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  useEffect(() => {
    setIsMounted(true);

    // Show welcome bubble after 5s if not closed before
    const hasClosedWelcome = localStorage.getItem('hide_support_welcome');
    if (!hasClosedWelcome) {
      const timer = setTimeout(() => setShowWelcome(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const getWhatsAppMessage = useCallback(() => {
    const baseUrl = window.location.origin;
    const currentUrl = `${baseUrl}${pathname}`;

    if (pathname === '/') {
      return 'Hello VinaykaRugs, I want to know about your rugs collection';
    }

    if (pathname.includes('/product/')) {
      const productName = document.querySelector('h1')?.innerText || 'this rug';
      return `Hello VinaykaRugs, I have a question about this rug: ${productName} - ${currentUrl}`;
    }

    if (pathname === '/cart') {
      return 'Hello VinaykaRugs, I need help with my order';
    }

    return 'Hi VinaykaRugs, I have a query about your collection';
  }, [pathname]);

  const handleStartChat = () => {
    const message = getWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isMounted || !whatsappNumber) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999]" ref={widgetRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute bottom-20 right-0 w-[calc(100vw-48px)] sm:w-[360px] bg-white rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.15)] overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-[#2874f0] p-6 text-white relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <RiCloseLine size={24} />
              </button>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-serif">
                    VR
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#2874f0] rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">
                    VinaykaRugs
                  </h3>
                  <p className="text-white/80 text-sm">
                    Typically replies instantly
                  </p>
                </div>
              </div>
            </div>

            {/* Message Area */}
            <div className="p-6 bg-gray-50 min-h-[140px] space-y-4">
              <div className="flex flex-col gap-2">
                <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm text-gray-700 text-[15px] leading-relaxed max-w-[85%]">
                  Hi there 👋
                  <br />
                  How can we help you today?
                </div>
                <span className="text-[10px] text-gray-400 font-medium px-1">
                  Just now
                </span>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="p-6 bg-white border-t border-gray-100">
              <button
                onClick={handleStartChat}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-green-100"
              >
                <RiWhatsappLine size={24} />
                <span>Start Chat</span>
              </button>
              <p className="text-center text-[11px] text-gray-400 mt-4 uppercase tracking-widest font-bold">
                Powered by WhatsApp Business
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bubble */}
      <div className="relative group">
        {/* Welcome Notification Bubble */}
        <AnimatePresence>
          {showWelcome && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              className="absolute bottom-20 right-0 w-64 bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 flex items-start gap-3 pointer-events-auto"
            >
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-800">Hi there! 👋</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Need help picking the perfect rug for your home?
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowWelcome(false);
                  localStorage.setItem('hide_support_welcome', 'true');
                }}
                className="text-gray-400 hover:text-gray-600 p-0.5"
              >
                <RiCloseLine size={18} />
              </button>
              {/* Bubble Pointer */}
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-gray-100 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tooltip */}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with us
          <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-gray-900 rotate-45" />
        </div>

        {/* Pulse Effect */}
        {!isOpen && (
          <div
            className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20 pointer-events-none"
            style={{ animationDuration: '8s' }}
          />
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl active:scale-90 relative z-10 ${
            isOpen
              ? 'bg-gray-100 text-gray-600 rotate-90'
              : 'bg-[#25D366] text-white hover:scale-105'
          }`}
        >
          {isOpen ? <RiCloseLine size={32} /> : <RiWhatsappLine size={32} />}
        </button>
      </div>
    </div>
  );
};

export default SupportChatWidget;
