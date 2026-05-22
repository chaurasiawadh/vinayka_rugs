import { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, query, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import {
  fetchAllProducts,
  fetchFeaturedProducts,
  fetchGalleryItems,
} from '@/lib/products.service';

export const useProducts = (enabled = true) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    if (!enabled) {
      setProducts([]);
      setLoading(false);
      return;
    }

    if (process.env.NODE_ENV === 'development' && !db.app.options.apiKey) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchAllProducts();
      setProducts(data);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Firestore Error:', err);
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return { products, loading, refreshProducts: loadProducts };
};

export const useFeaturedProducts = (count = 4, enabled = true) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchFeaturedProducts(count);
        if (!cancelled) setProducts(data);
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [count, enabled]);

  return { products, loading };
};

/** One-time fetch — use on storefront pages instead of realtime listeners */
export const useCollectionOnce = <T>(
  collectionName: string,
  enabled = true
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled || !db.app.options.apiKey) {
      setData([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        const items = snapshot.docs.map(
          (docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as T
        );
        if (!cancelled) setData(items);
      } catch {
        if (!cancelled) setData([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [collectionName, enabled]);

  return { data, loading };
};

/** Realtime listener — prefer admin panels that need live updates after edits */
export const useCollection = (collectionName: string, enabled = true) => {
  const [data, setData] = useState<unknown[]>([]);

  useEffect(() => {
    if (!enabled || !db.app.options.apiKey) return;

    const q = query(collection(db, collectionName));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setData(items);
    });
    return () => unsubscribe();
  }, [collectionName, enabled]);

  return data;
};

export const useGalleryOnce = (enabled = true) => {
  const [items, setItems] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setItems([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchGalleryItems();
        if (!cancelled) setItems(data);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { items, loading };
};
