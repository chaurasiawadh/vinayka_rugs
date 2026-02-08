import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PLACEHOLDER_IMAGE } from '@/constants';

interface ImageSmartProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  priority?: boolean;
}

const ImageSmart: React.FC<ImageSmartProps> = ({
  src,
  alt,
  className,
  fallbackSrc = PLACEHOLDER_IMAGE,
  priority,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(PLACEHOLDER_IMAGE);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof src === 'string' && src) {
      setImgSrc(src);
      setHasError(false);
      setIsLoading(true);
    } else {
      setImgSrc(fallbackSrc);
    }
  }, [src, fallbackSrc]);

  return (
    <div
      className={`relative overflow-hidden w-full h-full bg-gray-100 ${className}`}
    >
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10 animate-pulse">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        </div>
      )}

      <Image
        src={hasError ? fallbackSrc : imgSrc}
        alt={alt || 'Image'}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
        className={`object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        {...(props as any)}
      />
    </div>
  );
};

export default ImageSmart;
