import React, { useState, useEffect } from 'react';
import { PLACEHOLDER_IMAGE } from '../constants';

interface ImageSmartProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const ImageSmart: React.FC<ImageSmartProps> = ({ 
  src, 
  alt, 
  className, 
  fallbackSrc = PLACEHOLDER_IMAGE, 
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Reset state when src prop changes
    if (typeof src === 'string') {
      setImgSrc(src);
    } else {
      setImgSrc(undefined);
    }
    setHasError(false);
    setIsLoading(true);
    setRetryCount(0);
  }, [src]);

  const handleError = () => {
    if (retryCount < 1 && src && typeof src === 'string') {
      // Retry logic: try adding a query param to bust cache or just re-set
      setRetryCount(prev => prev + 1);
      setTimeout(() => {
        setImgSrc(`${src}${src.includes('?') ? '&' : '?'}retry=${Date.now()}`);
      }, 1000);
    } else {
      setHasError(true);
      setIsLoading(false);
      // Log error to mock endpoint (console for now)
      console.warn(`[Image Error] Failed to load: ${src}. Falling back to placeholder.`);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10 animate-pulse">
          <svg className="w-10 h-10 text-gray-200" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
        </div>
      )}
      
      <img
        src={hasError ? fallbackSrc : imgSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        {...props}
      />
    </div>
  );
};

export default ImageSmart;