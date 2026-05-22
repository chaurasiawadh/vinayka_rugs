'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';

interface UseClientPaginationOptions<T> {
  items: T[];
  pageSize: number;
  resetDeps?: unknown[];
}

export const useClientPagination = <T>({
  items,
  pageSize,
  resetDeps = [],
}: UseClientPaginationOptions<T>) => {
  const [pageIndex, setPageIndex] = useState(0);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    setPageIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, pageSize, ...resetDeps]);

  useEffect(() => {
    if (pageIndex > totalPages - 1) {
      setPageIndex(Math.max(0, totalPages - 1));
    }
  }, [pageIndex, totalPages]);

  const paginatedItems = useMemo(() => {
    const start = pageIndex * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, pageIndex, pageSize]);

  const goToNextPage = useCallback(() => {
    setPageIndex((prev) => Math.min(prev + 1, totalPages - 1));
  }, [totalPages]);

  const goToPreviousPage = useCallback(() => {
    setPageIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  return {
    paginatedItems,
    pageIndex,
    pageSize,
    totalItems: items.length,
    totalPages,
    hasMore: pageIndex < totalPages - 1,
    hasPrevious: pageIndex > 0,
    goToNextPage,
    goToPreviousPage,
  };
};
