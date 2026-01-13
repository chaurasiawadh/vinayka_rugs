'use client';

import React from 'react';
import { Smartphone } from 'lucide-react';
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

  const activateAR = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.activateAR();
    }
  };

  if (!product.arAssets) return null;

  return (
    <div className="w-full mt-4">
      {/* 
        Hidden Model Viewer (Engine)
        Must be 'visible' in DOM for activateAR to work, so we use opacity 0 and absolute positioning
        instead of display: none.
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
        onClick={activateAR}
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
        Scan QR code or click on mobile to view in your room
      </div>
    </div>
  );
};

export default ARButton;
