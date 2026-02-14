import { Review, Order } from '@/types';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Calculate average rating from reviews
 */
export const calculateAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10; // Round to 1 decimal
};

/**
 * Calculate rating distribution (1-5 stars)
 */
export const calculateRatingDistribution = (
  reviews: Review[]
): {
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
} => {
  const distribution = {
    fiveStar: 0,
    fourStar: 0,
    threeStar: 0,
    twoStar: 0,
    oneStar: 0,
  };

  reviews.forEach((review) => {
    switch (review.rating) {
      case 5:
        distribution.fiveStar++;
        break;
      case 4:
        distribution.fourStar++;
        break;
      case 3:
        distribution.threeStar++;
        break;
      case 2:
        distribution.twoStar++;
        break;
      case 1:
        distribution.oneStar++;
        break;
    }
  });

  return distribution;
};

/**
 * Check if a user has purchased a specific product
 * @param userId - User's Firebase UID
 * @param productId - Product ID to check
 * @returns true if user has purchased this product
 */
export const hasUserPurchasedProduct = async (
  userId: string,
  productId: string
): Promise<boolean> => {
  try {
    // Query orders collection for this user
    const ordersRef = collection(db, 'users', userId, 'orders');
    const ordersSnapshot = await getDocs(ordersRef);

    // Check if any order contains this product
    for (const orderDoc of ordersSnapshot.docs) {
      const orderData = orderDoc.data() as Order;
      const hasPurchased = orderData.items.some(
        (item) => item.id === productId
      );
      if (hasPurchased) {
        return true;
      }
    }

    return false;
  } catch (error) {
    // Error checking purchase history
    return false;
  }
};

/**
 * Check if user has already reviewed a product
 * @param userId - User's Firebase UID
 * @param productId - Product ID to check
 * @returns true if user has already reviewed this product
 */
export const hasUserReviewedProduct = async (
  userId: string,
  productId: string
): Promise<boolean> => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(
      reviewsRef,
      where('productId', '==', productId),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    // Error checking review status
    return false;
  }
};

/**
 * Get all reviews for a product
 * @param productId - Product ID
 * @returns Array of reviews
 */
export const getProductReviews = async (
  productId: string
): Promise<Review[]> => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('productId', '==', productId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Review
    );
  } catch (error) {
    // Error fetching reviews
    return [];
  }
};

/**
 * Get review statistics for a product
 */
export const getReviewStats = async (
  productId: string
): Promise<{
  averageRating: number;
  totalReviews: number;
  distribution: {
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
  };
}> => {
  const reviews = await getProductReviews(productId);
  return {
    averageRating: calculateAverageRating(reviews),
    totalReviews: reviews.length,
    distribution: calculateRatingDistribution(reviews),
  };
};
