import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { Product } from '@/types';
import { ADMIN_PRODUCTS_PAGE_SIZE } from '@/constants';

const PRODUCTS_COLLECTION = 'products';

export const mapProductDoc = (docSnap: QueryDocumentSnapshot): Product =>
  ({ id: docSnap.id, ...docSnap.data() }) as Product;

const productsQuery = (pageSize: number, cursor?: DocumentSnapshot | null) => {
  const base = query(
    collection(db, PRODUCTS_COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  );
  if (cursor) {
    return query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy('createdAt', 'desc'),
      startAfter(cursor),
      limit(pageSize)
    );
  }
  return base;
};

export interface ProductsPageResult {
  products: Product[];
  firstDoc: QueryDocumentSnapshot | null;
  lastDoc: QueryDocumentSnapshot | null;
  hasMore: boolean;
}

export const fetchProductsPage = async (
  pageSize: number = ADMIN_PRODUCTS_PAGE_SIZE,
  cursor?: DocumentSnapshot | null
): Promise<ProductsPageResult> => {
  const q = productsQuery(pageSize, cursor ?? null);
  const snapshot = await getDocs(q);
  const products = snapshot.docs.map(mapProductDoc);

  return {
    products,
    firstDoc: snapshot.docs[0] ?? null,
    lastDoc: snapshot.docs[snapshot.docs.length - 1] ?? null,
    hasMore: snapshot.docs.length === pageSize,
  };
};

export const fetchAllProducts = async (): Promise<Product[]> => {
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapProductDoc);
};

export const fetchFeaturedProducts = async (
  count: number = 4
): Promise<Product[]> => {
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(Math.max(count * 3, 12))
  );
  const snapshot = await getDocs(q);
  const products = snapshot.docs.map(mapProductDoc);
  const trending = products.filter((p) => p.isTrending).slice(0, count);
  if (trending.length >= count) return trending;
  return products.slice(0, count);
};

export const fetchGalleryItems = async <T>(): Promise<T[]> => {
  const snapshot = await getDocs(collection(db, 'gallery'));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
};
