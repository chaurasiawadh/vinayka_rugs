import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { memo, useState } from 'react';
import { Skeleton } from '../ui/Skeleton';

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  tags?: string[];
  rating?: number;
  reviewsCount?: number;
  priority?: boolean;
}

const ProductCard = ({
  id,
  name,
  brand,
  price,
  originalPrice,
  image,
  tags,
  rating = 0,
  reviewsCount = 0,
  priority = false,
}: ProductCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const displayRating = Math.floor(rating);

  return (
    <Link
      href={`/product/${id}`}
      className="group block bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative overflow-hidden bg-stone-100 aspect-square">
        {!isImageLoaded && (
          <Skeleton className="absolute inset-0 w-full h-full z-10" />
        )}
        <Image
          src={image}
          alt={name || 'Product Image'}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onLoad={() => setIsImageLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
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

        {rating > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < displayRating ? 'fill-current text-[#D4C49D]' : 'text-gray-200'}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">({reviewsCount})</span>
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
};

export default memo(ProductCard);
