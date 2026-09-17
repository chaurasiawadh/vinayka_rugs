import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden flex flex-col h-full animate-pulse">
      {/* Aspect Ratio Box for Image */}
      <div className="relative aspect-square bg-stone-100 w-full overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content Skeleton */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Subtitle / Category */}
          <Skeleton className="h-3 w-1/3" />
          {/* Title */}
          <Skeleton className="h-5 w-4/5" />
        </div>

        {/* Price & Action Button */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    </div>
  );
}
