'use client';

import { useState } from 'react';
import { Star, X, AlertCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import {
  hasUserPurchasedProduct,
  hasUserReviewedProduct,
} from '@/lib/reviewUtils';

interface ReviewFormProps {
  productId: string;
  productName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewForm({
  productId,
  productName,
  onClose,
  onSuccess,
}: ReviewFormProps) {
  const { user, userProfile } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [canReview, setCanReview] = useState<boolean | null>(null);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  // Check if user can review on mount
  useState(() => {
    const checkEligibility = async () => {
      if (!user) {
        setCanReview(false);
        setError('Please log in to submit a review.');
        return;
      }

      const [hasPurchased, hasReviewed] = await Promise.all([
        hasUserPurchasedProduct(user.uid, productId),
        hasUserReviewedProduct(user.uid, productId),
      ]);

      if (hasReviewed) {
        setAlreadyReviewed(true);
        setError('You have already reviewed this product.');
        setCanReview(false);
        return;
      }

      if (!hasPurchased) {
        setCanReview(false);
        setError('Only verified purchasers can submit reviews.');
        return;
      }

      setCanReview(true);
    };

    checkEligibility();
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !userProfile) {
      setError('You must be logged in to submit a review.');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }

    if (reviewText.trim().length < 10) {
      setError('Review description must be at least 10 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const reviewData = {
        productId,
        userId: user.uid,
        userName:
          `${userProfile.firstName} ${userProfile.lastName}`.trim() ||
          userProfile.email,
        userEmail: userProfile.email,
        rating,
        reviewTitle: reviewTitle.trim() || null,
        reviewText: reviewText.trim(),
        isPurchaseVerified: true,
        createdAt: serverTimestamp(),
        isEditedByAdmin: false,
      };

      await addDoc(collection(db, 'reviews'), reviewData);

      onSuccess();
      onClose();
    } catch (err) {
      // Error submitting review
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (canReview === null) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <p className="text-center text-gray-600">Checking eligibility...</p>
        </div>
      </div>
    );
  }

  if (!canReview) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-start gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-lg mb-2">
                {alreadyReviewed ? 'Already Reviewed' : 'Cannot Submit Review'}
              </h3>
              <p className="text-gray-600 text-sm">{error}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-gray-800 text-white py-2.5 rounded-lg font-medium hover:bg-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Rate Product</h2>
            <p className="text-sm text-gray-500 mt-1">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Your Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={36}
                    className={`${
                      star <= (hoverRating || rating)
                        ? 'fill-[#D4C49D] text-[#D4C49D]'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-3 text-lg font-semibold text-gray-700">
                  {rating} Star{rating !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Review Title <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="text"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              placeholder="Sum up your experience in one line"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none"
              maxLength={100}
            />
          </div>

          {/* Review Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Review Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this product..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none resize-none"
              rows={6}
              required
              minLength={10}
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 10 characters ({reviewText.length}/10)
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                loading || rating === 0 || reviewText.trim().length < 10
              }
              className="flex-1 bg-terracotta text-white py-3 rounded-lg font-medium hover:bg-[#6D4A30] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
