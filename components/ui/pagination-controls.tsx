'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  pageIndex: number;
  pageSize: number;
  totalItems?: number;
  totalOnPage: number;
  hasMore: boolean;
  hasPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  loading?: boolean;
  className?: string;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  pageIndex,
  pageSize,
  totalItems,
  totalOnPage,
  hasMore,
  hasPrevious,
  onNext,
  onPrevious,
  loading = false,
  className = '',
}) => {
  const start = pageIndex * pageSize + (totalOnPage > 0 ? 1 : 0);
  const end = pageIndex * pageSize + totalOnPage;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
    >
      <p className="text-sm text-text-muted">
        {totalOnPage === 0 ? (
          'No items'
        ) : (
          <>
            Showing {start}–{end}
            {typeof totalItems === 'number' ? ` of ${totalItems}` : ''}
          </>
        )}
      </p>
      <div className="flex items-center gap-2 pr-20 sm:pr-0 max-w-full">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!hasPrevious || loading}
          className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        <span className="text-sm text-gray-600 min-w-[80px] text-center">
          Page {pageIndex + 1}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={!hasMore || loading}
          className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
