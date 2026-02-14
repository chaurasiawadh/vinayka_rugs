import { useState, useEffect } from 'react';
import { Review } from '@/types';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import {
  calculateAverageRating,
  calculateRatingDistribution,
} from '@/lib/reviewUtils';

/**
 * Hook to fetch and subscribe to product reviews
 */
export const useProductReviews = (productId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [distribution, setDistribution] = useState({
    fiveStar: 0,
    fourStar: 0,
    threeStar: 0,
    twoStar: 0,
    oneStar: 0,
  });

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('productId', '==', productId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const reviewsData = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as Review
        );

        // Sort by date descending (newest first)
        reviewsData.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });

        setReviews(reviewsData);
        setTotalReviews(reviewsData.length);
        setAverageRating(calculateAverageRating(reviewsData));
        setDistribution(calculateRatingDistribution(reviewsData));
        setLoading(false);
      },
      (_error) => {
        // Error fetching reviews
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [productId]);

  return {
    reviews,
    loading,
    averageRating,
    totalReviews,
    distribution,
  };
};
