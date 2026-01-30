import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  // where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Graceful fallback if keys aren't set yet
    if (process.env.NODE_ENV === 'development' && !db.app.options.apiKey) {
      // console.warn('Firebase not configured.');
      setProducts([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Product
        );
        setProducts(data);
        setLoading(false);
      },
      (err) => {
        // eslint-disable-next-line no-console
        console.error('Firestore Error:', err);
        // Fallback on error
        setProducts([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { products, loading };
};

// Generic hook for other collections (events, gallery, etc)
export const useCollection = (collectionName: string) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!db.app.options.apiKey) return;

    const q = query(collection(db, collectionName));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setData(items);
    });
    return () => unsubscribe();
  }, [collectionName]);

  return data;
};
