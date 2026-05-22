export type HeroMediaType = 'video' | 'image';

export interface HeroMediaItem {
  id: string;
  type: HeroMediaType;
  url: string;
  thumbnail?: string;
  order: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface HeroMediaFormData {
  id?: string;
  type: HeroMediaType;
  url: string;
  thumbnail?: string;
  order?: number;
}

export type HeroMediaLoadStatus = 'idle' | 'loading' | 'loaded' | 'error';
