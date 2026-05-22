import { db, storage } from '@/lib/firebase';
import {
  HERO_MEDIA_COLLECTION,
  HERO_MEDIA_ERRORS,
  HERO_MEDIA_MIN_ITEMS,
  HERO_MEDIA_STORAGE_IMAGE_PREFIX,
  HERO_MEDIA_STORAGE_THUMBNAIL_PREFIX,
  HERO_MEDIA_STORAGE_VIDEO_PREFIX,
} from '@/constants';
import {
  HeroMediaFormData,
  HeroMediaItem,
  HeroMediaType,
} from '@/types/hero-media.types';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const mapDocToItem = (
  id: string,
  data: Record<string, unknown>
): HeroMediaItem => ({
  id,
  type: (data.type as HeroMediaType) ?? 'image',
  url: (data.url as string) ?? '',
  thumbnail: data.thumbnail as string | undefined,
  order: typeof data.order === 'number' ? data.order : 0,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
});

export const sortHeroMediaItems = (items: HeroMediaItem[]): HeroMediaItem[] =>
  [...items].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    const aTime = a.createdAt ? 1 : 0;
    const bTime = b.createdAt ? 1 : 0;
    return bTime - aTime;
  });

export const fetchHeroMedia = async (): Promise<HeroMediaItem[]> => {
  if (!db.app.options.apiKey) return [];

  try {
    const q = query(
      collection(db, HERO_MEDIA_COLLECTION),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((d) =>
      mapDocToItem(d.id, d.data() as Record<string, unknown>)
    );
    return sortHeroMediaItems(items);
  } catch {
    const snapshot = await getDocs(collection(db, HERO_MEDIA_COLLECTION));
    const items = snapshot.docs.map((d) =>
      mapDocToItem(d.id, d.data() as Record<string, unknown>)
    );
    return sortHeroMediaItems(items);
  }
};

export const subscribeHeroMedia = (
  callback: (items: HeroMediaItem[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  if (!db.app.options.apiKey) {
    callback([]);
    return () => {};
  }

  const handleSnapshot = (snapshot: {
    docs: { id: string; data: () => Record<string, unknown> }[];
  }) => {
    const items = snapshot.docs.map((d) => mapDocToItem(d.id, d.data()));
    callback(sortHeroMediaItems(items));
  };

  try {
    const q = query(
      collection(db, HERO_MEDIA_COLLECTION),
      orderBy('order', 'asc')
    );
    return onSnapshot(q, handleSnapshot, (err) => onError?.(err as Error));
  } catch {
    return onSnapshot(
      collection(db, HERO_MEDIA_COLLECTION),
      handleSnapshot,
      (err) => onError?.(err as Error)
    );
  }
};

export const uploadHeroMediaFile = async (
  file: File,
  mediaType: HeroMediaType | 'thumbnail'
): Promise<string> => {
  const prefix =
    mediaType === 'thumbnail'
      ? HERO_MEDIA_STORAGE_THUMBNAIL_PREFIX
      : mediaType === 'video'
        ? HERO_MEDIA_STORAGE_VIDEO_PREFIX
        : HERO_MEDIA_STORAGE_IMAGE_PREFIX;

  const storageRef = ref(storage, `${prefix}/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const resolveMediaUrl = async (
  fileOrUrl: File | string | null,
  mediaType: HeroMediaType | 'thumbnail'
): Promise<string> => {
  if (!fileOrUrl) return '';
  if (typeof fileOrUrl === 'string') return fileOrUrl;
  return uploadHeroMediaFile(fileOrUrl, mediaType);
};

export const getUploadErrorMessage = (err: unknown): string => {
  const message = err instanceof Error ? err.message : '';
  if (message.includes('CORS') || message.includes('preflight')) {
    return HERO_MEDIA_ERRORS.corsUpload;
  }
  return HERO_MEDIA_ERRORS.uploadFailed;
};

export const createHeroMedia = async (
  data: HeroMediaFormData,
  nextOrder: number
): Promise<string> => {
  const docRef = await addDoc(collection(db, HERO_MEDIA_COLLECTION), {
    type: data.type,
    url: data.url,
    thumbnail: data.thumbnail ?? null,
    order: nextOrder,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateHeroMedia = async (
  id: string,
  data: Partial<HeroMediaFormData>
): Promise<void> => {
  const payload: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };
  if (data.type !== undefined) payload.type = data.type;
  if (data.url !== undefined) payload.url = data.url;
  if (data.thumbnail !== undefined) payload.thumbnail = data.thumbnail ?? null;
  if (data.order !== undefined) payload.order = data.order;

  await updateDoc(doc(db, HERO_MEDIA_COLLECTION, id), payload);
};

export const deleteHeroMedia = async (
  id: string,
  currentCount: number
): Promise<void> => {
  if (currentCount <= HERO_MEDIA_MIN_ITEMS) {
    throw new Error(HERO_MEDIA_ERRORS.cannotDeleteLast);
  }
  await deleteDoc(doc(db, HERO_MEDIA_COLLECTION, id));
};

export const reorderHeroMedia = async (
  items: HeroMediaItem[]
): Promise<void> => {
  const batch = writeBatch(db);
  items.forEach((item, index) => {
    batch.update(doc(db, HERO_MEDIA_COLLECTION, item.id), {
      order: index,
      updatedAt: serverTimestamp(),
    });
  });
  await batch.commit();
};

export const moveHeroMediaItem = (
  items: HeroMediaItem[],
  id: string,
  direction: 'up' | 'down'
): HeroMediaItem[] => {
  const sorted = sortHeroMediaItems(items);
  const index = sorted.findIndex((item) => item.id === id);
  if (index === -1) return sorted;

  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= sorted.length) return sorted;

  const next = [...sorted];
  [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
  return next.map((item, i) => ({ ...item, order: i }));
};

export const pickRandomHeroMedia = (
  items: HeroMediaItem[],
  lastId: string | null
): HeroMediaItem | null => {
  if (items.length === 0) return null;
  if (items.length === 1) return items[0];

  const pool =
    lastId && items.length > 1
      ? items.filter((item) => item.id !== lastId)
      : items;

  const candidates = pool.length > 0 ? pool : items;
  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index] ?? null;
};

export const preloadHeroMedia = (item: HeroMediaItem | null): Promise<void> => {
  if (!item?.url) return Promise.resolve();

  return new Promise((resolve) => {
    if (item.type === 'image') {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = item.url;
      return;
    }

    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    const done = () => resolve();
    video.onloadeddata = done;
    video.onerror = done;
    video.src = item.url;
    if (item.thumbnail) {
      const poster = new Image();
      poster.src = item.thumbnail;
    }
  });
};
