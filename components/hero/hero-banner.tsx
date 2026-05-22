'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { AlertCircle } from 'lucide-react';
import { useHeroMedia } from '@/hooks/use-hero-media';
import { HERO_MEDIA_ERRORS, HERO_MEDIA_FALLBACK_VIDEO } from '@/constants';
import Button from '@/components/Button';

const HeroBanner: React.FC = () => {
  const {
    selected,
    isReady,
    mediaStatus,
    isFetching,
    error,
    retry,
    onMediaError,
    onMediaLoaded,
  } = useHeroMedia();

  const showSkeleton = isFetching || !isReady;
  const showMediaError = isReady && selected && mediaStatus === 'error';
  const showEmpty = isReady && !selected && !error;
  const showFetchError = isReady && !!error && !selected;

  const fallbackPoster = useMemo(
    () => selected?.thumbnail ?? undefined,
    [selected?.thumbnail]
  );

  return (
    <div className="absolute inset-0 z-0">
      {showSkeleton && (
        <div
          className="absolute inset-0 bg-neutral-900 animate-pulse"
          aria-hidden
        />
      )}

      {isReady && selected && mediaStatus !== 'error' && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            mediaStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {selected.type === 'video' ? (
            <video
              key={selected.id}
              autoPlay
              loop
              muted
              playsInline
              poster={selected.thumbnail}
              className="absolute inset-0 w-full h-full object-cover"
              onLoadedData={onMediaLoaded}
              onError={onMediaError}
            >
              <source src={selected.url} type="video/mp4" />
            </video>
          ) : (
            <Image
              key={selected.id}
              src={selected.url}
              alt="Hero background"
              fill
              priority
              sizes="100vw"
              className="object-cover"
              onLoad={onMediaLoaded}
              onError={onMediaError}
            />
          )}
        </div>
      )}

      {(showEmpty || showMediaError || showFetchError) && (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black">
          {showEmpty && (
            <>
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-40"
              >
                <source src={HERO_MEDIA_FALLBACK_VIDEO} type="video/mp4" />
              </video>
              <div className="absolute inset-0 flex items-center justify-center px-6 text-center z-[1]">
                <p className="text-white/60 text-sm max-w-md">
                  {HERO_MEDIA_ERRORS.emptyHero}
                </p>
              </div>
            </>
          )}
          {showMediaError && (
            <>
              {fallbackPoster && (
                <Image
                  src={fallbackPoster}
                  alt=""
                  fill
                  className="object-cover opacity-30"
                  unoptimized
                />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center z-[1]">
                <AlertCircle className="text-white/70" size={32} />
                <p className="text-white/80 text-sm max-w-md">
                  {HERO_MEDIA_ERRORS.uploadFailed}
                </p>
                <Button variant="outline" size="sm" onClick={retry}>
                  Retry
                </Button>
              </div>
            </>
          )}
          {showFetchError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center z-[1]">
              <AlertCircle className="text-white/70" size={32} />
              <p className="text-white/80 text-sm max-w-md">{error}</p>
              <Button variant="outline" size="sm" onClick={retry}>
                Retry
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeroBanner;
