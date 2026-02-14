'use client';

import { Star, Check } from 'lucide-react';
import { Review } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface ReviewsListProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  distribution: {
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
  };
}

export default function ReviewsList({
  reviews,
  averageRating,
  totalReviews,
  distribution,
}: ReviewsListProps) {
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const getPercentage = (count: number) => {
    if (totalReviews === 0) return 0;
    return Math.round((count / totalReviews) * 100);
  };

  if (totalReviews === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No Reviews Yet
        </h3>
        <p className="text-sm text-gray-500">
          Be the first to review this product!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary & Breakdown */}
      <div className="flex flex-col md:flex-row gap-12 pb-10 border-b border-gray-200">
        {/* Average Rating */}
        <div className="flex-none flex flex-col items-center justify-center min-w-[150px]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-4xl font-medium text-[#212121]">
              {averageRating.toFixed(1)}
            </span>
            <Star className="w-6 h-6 fill-[#D4C49D] text-[#D4C49D]" />
          </div>
          <p className="text-sm text-gray-400 text-center font-medium">
            {totalReviews} Verified Rating{totalReviews !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Rating Bars */}
        <div className="flex-1 w-full max-w-md space-y-2.5">
          {[
            { star: 5, count: distribution.fiveStar, color: '#D4C49D' },
            { star: 4, count: distribution.fourStar, color: '#D4C49D' },
            { star: 3, count: distribution.threeStar, color: '#D4C49D' },
            { star: 2, count: distribution.twoStar, color: '#D4C49D' },
            { star: 1, count: distribution.oneStar, color: '#D4C49D' },
          ].map((row) => (
            <div
              key={row.star}
              className="flex items-center gap-4 text-xs font-medium"
            >
              <span className="w-3 text-[#212121] flex items-center gap-1">
                {row.star}
                <Star className="w-3 h-3 fill-[#D4C49D] text-[#D4C49D]" />
              </span>
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${getPercentage(row.count)}%`,
                    backgroundColor: row.color,
                  }}
                />
              </div>
              <span className="w-8 text-right text-gray-400">{row.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-8">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-100 pb-8 last:border-0"
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="px-2 py-0.5 text-xs font-bold text-white rounded-sm flex items-center gap-1 bg-[#D4C49D]">
                {review.rating} <Star className="w-2.5 h-2.5 fill-current" />
              </span>
              {review.reviewTitle && (
                <h4 className="font-medium text-[#212121] text-sm">
                  {review.reviewTitle}
                </h4>
              )}
              {review.isEditedByAdmin && (
                <span className="text-xs text-gray-400 italic">
                  (Edited by Admin)
                </span>
              )}
            </div>

            <p className="text-sm text-[#212121] leading-relaxed mb-4">
              {review.reviewText}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{review.userName}</span>
                {review.isPurchaseVerified && (
                  <span className="flex items-center gap-1 text-gray-400">
                    <span className="w-3 h-3 bg-gray-400 rounded-full flex items-center justify-center">
                      <Check className="w-2 h-2 text-white" />
                    </span>{' '}
                    Verified Purchase
                  </span>
                )}
                <span>{formatDate(review.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
