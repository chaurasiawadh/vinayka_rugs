'use client';

import { useState, useEffect } from 'react';
import {
  Star,
  Save,
  X,
  AlertCircle,
  ChevronLeft,
  Plus,
  Trash2,
} from 'lucide-react';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { Review, Product } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

interface ReviewManagerProps {
  productId: string;
  product: Product;
}

export default function ReviewManager({
  productId,
  product,
}: ReviewManagerProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    rating: number;
    reviewText: string;
  } | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Add Review Modal State
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    reviewerName: '',
    reviewText: '',
    reviewTitle: '',
  });
  const [addReviewError, setAddReviewError] = useState('');

  // Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    reviewId: string | null;
  }>({ isOpen: false, reviewId: null });
  const [deleting, setDeleting] = useState(false);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError('');
      try {
        const reviewsRef = collection(db, 'reviews');
        const q = query(reviewsRef, where('productId', '==', productId));
        const snapshot = await getDocs(q);
        const reviewsData = snapshot.docs
          .map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              }) as Review
          )
          .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

        setReviews(reviewsData);
      } catch (err) {
        // Error fetching reviews
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleEdit = (review: Review) => {
    setEditingReview(review.id);
    setEditData({
      rating: review.rating,
      reviewText: review.reviewText,
    });
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditData(null);
    setError('');
  };

  const handleSaveEdit = async (reviewId: string) => {
    if (!editData) return;

    if (editData.rating < 1 || editData.rating > 5) {
      setError('Rating must be between 1 and 5 stars');
      return;
    }

    if (editData.reviewText.trim().length < 10) {
      setError('Review text must be at least 10 characters');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const reviewRef = doc(db, 'reviews', reviewId);
      await updateDoc(reviewRef, {
        rating: editData.rating,
        reviewText: editData.reviewText.trim(),
        isEditedByAdmin: true,
        adminEditedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Update local state
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                rating: editData.rating,
                reviewText: editData.reviewText.trim(),
                isEditedByAdmin: true,
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      );

      setSuccess('Review updated successfully!');
      setEditingReview(null);
      setEditData(null);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      // Error updating review
      setError('Failed to update review. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddReviewError('');

    // Validation
    if (newReview.rating < 1 || newReview.rating > 5) {
      setAddReviewError('Please select a rating between 1 and 5 stars');
      return;
    }

    if (newReview.reviewerName.trim().length < 2) {
      setAddReviewError('Reviewer name must be at least 2 characters');
      return;
    }

    if (newReview.reviewText.trim().length < 10) {
      setAddReviewError('Review description must be at least 10 characters');
      return;
    }

    setSaving(true);

    try {
      const reviewData = {
        productId,
        userId: 'admin', // Mark as admin-created
        userName: newReview.reviewerName.trim(),
        userEmail: 'admin@vinaykarugs.com', // Admin email
        rating: newReview.rating,
        reviewTitle: newReview.reviewTitle.trim() || null,
        reviewText: newReview.reviewText.trim(),
        isPurchaseVerified: true, // Admin reviews are considered verified
        createdAt: serverTimestamp(),
        isEditedByAdmin: false,
      };

      const docRef = await addDoc(collection(db, 'reviews'), reviewData);

      // Add to local state
      const newReviewWithId: Review = {
        id: docRef.id,
        ...reviewData,
        createdAt: new Date().toISOString(),
      } as Review;

      setReviews((prev) => [newReviewWithId, ...prev]);

      setSuccess('Review added successfully!');
      setShowAddReviewModal(false);

      // Reset form
      setNewReview({
        rating: 0,
        reviewerName: '',
        reviewText: '',
        reviewTitle: '',
      });

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      // Error adding review
      setAddReviewError('Failed to add review. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!deleteConfirm.reviewId) return;

    setDeleting(true);
    setError('');

    try {
      await deleteDoc(doc(db, 'reviews', deleteConfirm.reviewId));

      // Remove from local state
      setReviews((prev) => prev.filter((r) => r.id !== deleteConfirm.reviewId));

      setSuccess('Review deleted successfully!');
      setDeleteConfirm({ isOpen: false, reviewId: null });

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      // Error deleting review
      setError('Failed to delete review. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-12 h-12 border-4 border-terracotta border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push('/admin')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Back to Admin"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Manage Reviews</h1>
      </div>

      {/* Product Details Card */}
      <div className="mb-6 bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-6">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-24 h-24 object-cover rounded-lg border border-gray-200"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {product.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Category</p>
                <p className="font-medium text-gray-900">{product.category}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Price</p>
                <p className="font-medium text-gray-900">
                  ₹{product.price.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Average Rating</p>
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-gray-900">
                    {reviews.length > 0
                      ? (
                          reviews.reduce((sum, r) => sum + r.rating, 0) /
                          reviews.length
                        ).toFixed(1)
                      : '0.0'}
                  </p>
                  <Star className="w-4 h-4 fill-[#D4C49D] text-[#D4C49D]" />
                </div>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Total Reviews</p>
                <p className="font-bold text-gray-900">{reviews.length}</p>
              </div>
            </div>
          </div>

          {/* Add Review Button */}
          <div className="flex-shrink-0">
            <button
              onClick={() => setShowAddReviewModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-terracotta text-white rounded-lg font-medium hover:bg-[#6D4A30] transition-colors"
            >
              <Plus size={20} />
              Add Review
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Star className="w-3 h-3 text-white fill-current" />
          </div>
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Reviews List Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold text-gray-900">
            Reviews ({reviews.length})
          </p>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No Reviews Yet
          </h3>
          <p className="text-center text-gray-500 py-12">
            This product has not received any reviews yet.
          </p>
          <button
            onClick={() => setShowAddReviewModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta text-white rounded-lg font-medium hover:bg-[#6D4A30] transition-colors"
          >
            <Plus size={18} />
            Add First Review
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              {editingReview === review.id ? (
                /* Edit Mode */
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setEditData((prev) =>
                              prev ? { ...prev, rating: star } : null
                            )
                          }
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            size={32}
                            className={`${
                              star <= (editData?.rating || 0)
                                ? 'fill-[#D4C49D] text-[#D4C49D]'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Review Text
                    </label>
                    <textarea
                      value={editData?.reviewText || ''}
                      onChange={(e) =>
                        setEditData((prev) =>
                          prev ? { ...prev, reviewText: e.target.value } : null
                        )
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none resize-none"
                      rows={6}
                      required
                      minLength={10}
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(review.id)}
                      disabled={saving}
                      className="flex-1 bg-terracotta text-white py-2.5 rounded-lg font-medium hover:bg-[#6D4A30] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 text-sm font-bold text-white rounded-md flex items-center gap-1.5 bg-[#D4C49D]">
                          {review.rating}{' '}
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </span>
                        {review.reviewTitle && (
                          <h4 className="font-semibold text-gray-900">
                            {review.reviewTitle}
                          </h4>
                        )}
                        {review.isEditedByAdmin && (
                          <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full font-medium">
                            Edited by Admin
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="font-medium">{review.userName}</span>
                        <span>•</span>
                        <span>{review.userEmail}</span>
                        <span>•</span>
                        <span>{formatDate(review.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(review)}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            isOpen: true,
                            reviewId: review.id,
                          })
                        }
                        className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors text-sm flex items-center gap-1.5"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {review.reviewText}
                  </p>

                  {review.isPurchaseVerified && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className="inline-flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full font-medium">
                        <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                          <Star className="w-2 h-2 text-white fill-current" />
                        </div>
                        Verified Purchase
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Review Modal */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Add Review</h2>
                <p className="text-sm text-gray-500 mt-1">{product.name}</p>
              </div>
              <button
                onClick={() => {
                  setShowAddReviewModal(false);
                  setAddReviewError('');
                  setNewReview({
                    rating: 0,
                    reviewerName: '',
                    reviewText: '',
                    reviewTitle: '',
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-6">
              {/* Rating Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setNewReview((prev) => ({ ...prev, rating: star }))
                      }
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={36}
                        className={`${
                          star <= newReview.rating
                            ? 'fill-[#D4C49D] text-[#D4C49D]'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  {newReview.rating > 0 && (
                    <span className="ml-3 text-lg font-semibold text-gray-700">
                      {newReview.rating} Star{newReview.rating !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Reviewer Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reviewer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newReview.reviewerName}
                  onChange={(e) =>
                    setNewReview((prev) => ({
                      ...prev,
                      reviewerName: e.target.value,
                    }))
                  }
                  placeholder="Enter reviewer's name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none"
                  required
                  minLength={2}
                />
              </div>

              {/* Review Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Review Title <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={newReview.reviewTitle}
                  onChange={(e) =>
                    setNewReview((prev) => ({
                      ...prev,
                      reviewTitle: e.target.value,
                    }))
                  }
                  placeholder="Sum up the review in one line"
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
                  value={newReview.reviewText}
                  onChange={(e) =>
                    setNewReview((prev) => ({
                      ...prev,
                      reviewText: e.target.value,
                    }))
                  }
                  placeholder="Write the review..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none resize-none"
                  rows={6}
                  required
                  minLength={10}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 10 characters ({newReview.reviewText.length}/10)
                </p>
              </div>

              {/* Error Message */}
              {addReviewError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{addReviewError}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddReviewModal(false);
                    setAddReviewError('');
                    setNewReview({
                      rating: 0,
                      reviewerName: '',
                      reviewText: '',
                      reviewTitle: '',
                    });
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    saving ||
                    newReview.rating === 0 ||
                    newReview.reviewText.trim().length < 10 ||
                    newReview.reviewerName.trim().length < 2
                  }
                  className="flex-1 bg-terracotta text-white py-3 rounded-lg font-medium hover:bg-[#6D4A30] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Adding Review...' : 'Add Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-start gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-lg mb-2">Delete Review</h3>
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete this review? This action
                  cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setDeleteConfirm({ isOpen: false, reviewId: null })
                }
                disabled={deleting}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteReview}
                disabled={deleting}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
