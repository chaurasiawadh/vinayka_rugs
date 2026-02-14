'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  category?: string;
  collection?: string;
  productName: string;
}

export default function Breadcrumb({
  category,
  collection,
  productName,
}: BreadcrumbProps) {
  return (
    <nav className="mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm text-gray-500">
        {/* Home */}
        <li>
          <Link
            href="/"
            className="hover:text-gray-900 transition-colors underline-offset-4 hover:underline"
          >
            Home
          </Link>
        </li>

        {/* Category */}
        {category && (
          <>
            <li>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </li>
            <li>
              <Link
                href={`/shop?category=${encodeURIComponent(category)}`}
                className="hover:text-gray-900 transition-colors underline-offset-4 hover:underline"
              >
                {category}
              </Link>
            </li>
          </>
        )}

        {/* Collection (only if not empty) */}
        {collection && collection.trim() !== '' && collection !== '-' && (
          <>
            <li>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </li>
            <li>
              <Link
                href={`/shop?collection=${encodeURIComponent(collection)}`}
                className="hover:text-gray-900 transition-colors underline-offset-4 hover:underline"
              >
                {collection}
              </Link>
            </li>
          </>
        )}

        {/* Current Product (not clickable) */}
        <li>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </li>
        <li className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">
          {productName}
        </li>
      </ol>
    </nav>
  );
}
