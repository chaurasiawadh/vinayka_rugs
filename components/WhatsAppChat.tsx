'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { RiWhatsappLine, RiCloseLine } from '@remixicon/react';

const WhatsAppChat: React.FC = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [isBubbleClosed, setIsBubbleClosed] = useState(false);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  useEffect(() => {
    // Show button immediately if number exists
    if (whatsappNumber) {
      setIsVisible(true);
    }

    // Check localStorage for bubble close state
    const closeState = localStorage.getItem('whatsapp_bubble_closed');
    if (closeState === 'true') {
      setIsBubbleClosed(true);
    }

    // Show bubble after 5 seconds if not closed
    const timer = setTimeout(() => {
      if (closeState !== 'true') {
        setShowBubble(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [whatsappNumber]);

  const handleCloseBubble = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowBubble(false);
    setIsBubbleClosed(true);
    localStorage.setItem('whatsapp_bubble_closed', 'true');
  };

  const getWhatsAppMessage = useCallback(() => {
    const baseUrl = window.location.origin;
    const currentUrl = `${baseUrl}${pathname}`;

    if (pathname === '/') {
      return 'Hi, I want to know about your rugs collection';
    }

    if (pathname.includes('/product/')) {
      const productName = document.querySelector('h1')?.innerText || 'this rug';
      return `Hello, I have a question about this rug: ${productName} - ${currentUrl}`;
    }

    if (pathname === '/cart') {
      return 'I need help with my order';
    }

    return 'Hi, I have a query about your collection';
  }, [pathname]);

  const handleChatClick = () => {
    const message = getWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isVisible || !whatsappNumber) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none">
      {/* Expandable Bubble */}
      {showBubble && !isBubbleClosed && (
        <div className="bg-white px-4 py-3 rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 pointer-events-auto max-w-[240px]">
          <p className="text-sm font-medium text-gray-800 leading-tight">
            Need help choosing a rug?
          </p>
          <button
            onClick={handleCloseBubble}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <RiCloseLine size={16} />
          </button>

          {/* Bubble Pointer */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-gray-100 rotate-45" />
        </div>
      )}

      {/* Main Button */}
      <div className="relative group pointer-events-auto">
        {/* Pulse Effect */}
        <div
          className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25"
          style={{ animationDuration: '6s' }}
        />

        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden lg:block pointer-events-none">
          Chat with us
          <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-gray-900 rotate-45" />
        </div>

        <button
          onClick={handleChatClick}
          className="relative w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          aria-label="Chat with us on WhatsApp"
        >
          <RiWhatsappLine size={32} />
        </button>
      </div>
    </div>
  );
};

export default WhatsAppChat;
