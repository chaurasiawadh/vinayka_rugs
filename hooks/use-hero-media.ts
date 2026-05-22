'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  fetchHeroMedia,
  pickRandomHeroMedia,
  preloadHeroMedia,
} from '@/lib/hero-media.service';
import { HERO_MEDIA_SESSION_KEY } from '@/constants';
import { HeroMediaItem, HeroMediaLoadStatus } from '@/types/hero-media.types';

export interface UseHeroMediaResult {
  selected: HeroMediaItem | null;
  isReady: boolean;
  mediaStatus: HeroMediaLoadStatus;
  isFetching: boolean;
  error: string | null;
  retry: () => void;
  onMediaError: () => void;
  onMediaLoaded: () => void;
}

export const useHeroMedia = (): UseHeroMediaResult => {
  const [selected, setSelected] = useState<HeroMediaItem | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [mediaStatus, setMediaStatus] = useState<HeroMediaLoadStatus>('idle');
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadHero = useCallback(async (signal: { cancelled: boolean }) => {
    setIsFetching(true);
    setIsReady(false);
    setMediaStatus('loading');
    setError(null);

    try {
      const items = await fetchHeroMedia();
      if (signal.cancelled) return;

      const lastId =
        typeof window !== 'undefined'
          ? sessionStorage.getItem(HERO_MEDIA_SESSION_KEY)
          : null;

      const picked = pickRandomHeroMedia(items, lastId);
      setSelected(picked);

      if (picked && typeof window !== 'undefined') {
        sessionStorage.setItem(HERO_MEDIA_SESSION_KEY, picked.id);
      }

      await preloadHeroMedia(picked);
      if (signal.cancelled) return;

      setIsReady(true);
      setMediaStatus(picked ? 'loaded' : 'idle');
    } catch (err) {
      if (signal.cancelled) return;
      setError(
        err instanceof Error ? err.message : 'Failed to load hero media'
      );
      setMediaStatus('error');
      setIsReady(true);
    } finally {
      if (!signal.cancelled) {
        setIsFetching(false);
      }
    }
  }, []);

  useEffect(() => {
    const signal = { cancelled: false };
    loadHero(signal);
    return () => {
      signal.cancelled = true;
    };
  }, [loadHero, retryCount]);

  const retry = useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);

  const onMediaError = useCallback(() => {
    setMediaStatus('error');
  }, []);

  const onMediaLoaded = useCallback(() => {
    setMediaStatus('loaded');
  }, []);

  return {
    selected,
    isReady,
    mediaStatus,
    isFetching,
    error,
    retry,
    onMediaError,
    onMediaLoaded,
  };
};
