import Link from 'next/link';
import { Star } from 'lucide-react';
import { useProductReviews } from '@/hooks/useReviews';

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  tags?: string[];
  rating: number; // Kept for backward compatibility but not used
  reviewsCount: number; // Kept for backward compatibility but not used
}

export default function ProductCard({
  id,
  name,
  brand,
  price,
  originalPrice,
  image,
  tags,
}: ProductCardProps) {
  const { averageRating, totalReviews, loading } = useProductReviews(id);

  return (
    <Link
      href={`/product/${id}`}
      className="group block bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative overflow-hidden bg-gray-100 aspect-square">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {tags && tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-gray-800 rounded-sm shadow-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-sm">
          {name}
        </h3>
        <p className="text-xs text-gray-500 mb-2">{brand}</p>

        {/* Dynamic Rating */}
        {loading ? (
          <div className="flex items-center gap-1.5 mb-3 h-4">
            <div className="animate-pulse bg-gray-200 h-3 w-16 rounded"></div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(averageRating) ? 'fill-current text-[#D4C49D]' : 'text-gray-200'}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">({totalReviews})</span>
          </div>
        )}

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            ₹{price.toLocaleString()}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-gray-400 line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
