'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { DocumentSnapshot } from 'firebase/firestore';
import { Product } from '@/types';
import { fetchProductsPage } from '@/lib/products.service';
import { ADMIN_PRODUCTS_PAGE_SIZE } from '@/constants';

interface UsePaginatedProductsOptions {
  pageSize?: number;
}

export const usePaginatedProducts = ({
  pageSize = ADMIN_PRODUCTS_PAGE_SIZE,
}: UsePaginatedProductsOptions = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  const cursorsRef = useRef<(DocumentSnapshot | null)[]>([null]);

  const loadPage = useCallback(
    async (index: number) => {
      setLoading(true);
      setError(null);
      try {
        const cursor = cursorsRef.current[index] ?? null;
        const result = await fetchProductsPage(pageSize, cursor);
        setProducts(result.products);
        setHasMore(result.hasMore);
        setHasPrevious(index > 0);
        setPageIndex(index);

        if (result.lastDoc && !cursorsRef.current[index + 1]) {
          cursorsRef.current[index + 1] = result.lastDoc;
        }
      } catch {
        setError('Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  const refresh = useCallback(() => {
    cursorsRef.current = [null];
    setPageIndex(0);
    return loadPage(0);
  }, [loadPage]);

  useEffect(() => {
    loadPage(0);
  }, [loadPage]);

  const goToNextPage = useCallback(() => {
    if (!hasMore || loading) return;
    loadPage(pageIndex + 1);
  }, [hasMore, loading, loadPage, pageIndex]);

  const goToPreviousPage = useCallback(() => {
    if (pageIndex <= 0 || loading) return;
    loadPage(pageIndex - 1);
  }, [loading, loadPage, pageIndex]);

  return {
    products,
    loading,
    error,
    hasMore,
    hasPrevious,
    pageIndex,
    pageSize,
    totalOnPage: products.length,
    refresh,
    goToNextPage,
    goToPreviousPage,
  };
};
