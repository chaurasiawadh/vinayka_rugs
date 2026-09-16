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
      <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2 mt-2 sm:mt-0">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!hasPrevious || loading}
          className="inline-flex items-center justify-center gap-1 px-3 sm:px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-w-[44px]"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </button>
        <span className="text-sm font-medium text-gray-600 min-w-[80px] text-center">
          Page {pageIndex + 1}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={!hasMore || loading}
          className="inline-flex items-center justify-center gap-1 px-3 sm:px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-w-[44px]"
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
