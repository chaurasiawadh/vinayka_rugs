import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-12">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-16" />
        <span className="text-gray-300">/</span>
        <Skeleton className="h-4 w-20" />
        <span className="text-gray-300">/</span>
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Main Grid: Gallery & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <Skeleton className="w-full aspect-square rounded-2xl" />
          <div className="flex space-x-4">
            <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
            <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
            <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
            <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
          </div>
        </div>

        {/* Right Column: Product Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-32" />
          </div>

          <Skeleton className="h-8 w-40" />

          <div className="border-t border-b border-stone-200 py-6 space-y-4">
            <Skeleton className="h-5 w-28" />
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
            </div>
          </div>

          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>

          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
