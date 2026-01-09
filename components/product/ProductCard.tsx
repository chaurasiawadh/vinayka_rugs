import Link from 'next/link';
import { Star } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  tags?: string[];
  rating: number;
  reviewsCount: number;
}

export default function ProductCard({
  id,
  name,
  brand,
  price,
  originalPrice,
  image,
  tags,
  rating,
  reviewsCount,
}: ProductCardProps) {
  return (
    <div className="group relative bg-white p-4">
      {/* Image */}
      <div className="relative aspect-square mb-4 overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {tags && tags.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-white border border-gray-200 text-[10px] font-medium px-2 py-1 uppercase tracking-wider rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-2">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest">
          {brand}
        </p>
        <h3 className="text-sm font-serif text-[#111] group-hover:underline decoration-gray-300 underline-offset-4 line-clamp-2 min-h-[40px]">
          <Link href={`/product/${id}`}>{name}</Link>
        </h3>

        <div className="flex items-center space-x-2 text-xs">
          <div className="flex text-[#D4C49D]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-current' : 'text-gray-200'}`}
              />
            ))}
          </div>
          <span className="text-gray-400">({reviewsCount})</span>
        </div>

        <div className="flex items-center space-x-2 text-sm font-medium">
          <span>₹{price.toLocaleString('en-IN')}</span>
          {originalPrice && (
            <span className="text-gray-300 line-through text-xs">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>

      <button className="w-full mt-4 py-2 bg-[#41354D] text-white text-xs font-medium uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
        Add to Cart
      </button>
    </div>
  );
}
