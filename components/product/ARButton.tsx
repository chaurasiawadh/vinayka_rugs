'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, ScanLine, Smartphone } from 'lucide-react';
import '@google/model-viewer';
import { Product } from '@/types';

// Declare the custom element to appease TypeScript
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          'ios-src'?: string;
          alt?: string;
          ar?: boolean;
          'ar-modes'?: string;
          'ar-scale'?: string;
          'ar-placement'?: string;
          'camera-controls'?: boolean;
          poster?: string;
          exposure?: string;
          loading?: 'auto' | 'lazy' | 'eager';
          reveal?: 'auto' | 'interaction' | 'manual';
        },
        HTMLElement
      >;
    }
  }
}

interface ARButtonProps {
  product: Product;
}

const ARButton: React.FC<ARButtonProps> = ({ product }) => {
  const modelViewerRef = React.useRef<any>(null);
  const [showQR, setShowQR] = React.useState(false);
  const [currentUrl, setCurrentUrl] = React.useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleARClick = () => {
    // Determine if mobile (simple width check or user agent)
    // We use a simple breakpoint check here for simplicity
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      if (modelViewerRef.current) {
        modelViewerRef.current.activateAR();
      }
    } else {
      setShowQR(true);
    }
  };

  if (!product.arAssets) return null;

  return (
    <div className="w-full mt-4">
      {/* 
        Hidden Model Viewer (Engine).
        We keep it mounted so mobile users get AR instantly.
      */}
      <model-viewer
        ref={modelViewerRef}
        src={product.arAssets.glbUrl}
        ios-src={product.arAssets.usdzUrl || undefined}
        alt={`View ${product.name} in your space`}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        ar-placement={product.arAssets.placement}
        ar-scale="auto"
        loading="eager"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      <button
        onClick={handleARClick}
        className="w-full bg-white border-2 border-terracotta text-terracotta hover:bg-terracotta hover:text-white transition-all duration-300 py-3 rounded-full flex items-center justify-center gap-2 font-medium text-sm sm:text-base mb-4 group"
      >
        <Smartphone
          size={20}
          className="group-hover:scale-110 transition-transform"
        />
        <span>View in your space (AR)</span>
      </button>

      {/* Fallback/Explanation for Desktop Users */}
      <div className="text-center text-xs text-text-muted mt-1 hidden md:block">
        Click to scan QR code
      </div>

      {/* QR Code Modal for Desktop */}
      {showQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full relative shadow-2xl text-center">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>

            <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4 text-terracotta">
              <ScanLine size={32} />
            </div>

            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
              View in Augmented Reality
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Scan this QR code with your mobile camera to view this rug in your
              room.
            </p>

            <div className="bg-white p-4 rounded-xl border-2 border-gray-100 inline-block mb-4 shadow-inner">
              <QRCodeSVG value={currentUrl} size={180} level="M" />
            </div>

            <p className="text-xs text-gray-400">
              Only works on AR-compatible iOS & Android devices.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARButton;
