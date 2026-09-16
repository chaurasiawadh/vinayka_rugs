import React, { useState, memo, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Star, Loader2 } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { PLACEHOLDER_IMAGE } from '../constants';

interface ProductCardProps {
  product: Product;
}

const parsePrice = (price: number | string | undefined): number => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') return parseFloat(price.replace(/,/g, ''));
  return 0;
};

const getPriceData = (product: Product) => {
  let price = 0;
  let mrp = 0;

  if (product.sizes?.length > 0) {
    const firstSize = product.sizes[0];

    if (product.sizePrices?.[firstSize]) {
      price = parsePrice(product.sizePrices[firstSize]);
    } else if (product.sizePrices) {
      const prices = Object.values(product.sizePrices)
        .map((p) => parsePrice(p))
        .filter((p) => p > 0);
      if (prices.length > 0) price = Math.min(...prices);
    }

    if (product.sizeOriginalPrices?.[firstSize]) {
      mrp = parsePrice(product.sizeOriginalPrices[firstSize]);
    }
  }

  if (price === 0) price = parsePrice(product.price);
  if (mrp === 0) mrp = parsePrice(product.mrp);

  return { price, mrp };
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { price: displayPrice, mrp: displayMrp } = useMemo(
    () => getPriceData(product),
    [product]
  );
  const discount = useMemo(
    () =>
      displayMrp > displayPrice
        ? Math.round(((displayMrp - displayPrice) / displayMrp) * 100)
        : 0,
    [displayMrp, displayPrice]
  );
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.sizes?.length > 0) {
      addToCart(product, product.sizes[0], 1);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleCardClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('button')) return;
      e.preventDefault();
      setIsNavigating(true);
      router.push(`/product/${product.id}`);
    },
    [router, product.id]
  );

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 min-w-0 flex flex-col h-full">
      {/* Image Area */}
      <div
        onClick={handleCardClick}
        className="block relative aspect-[4/5] overflow-hidden bg-gray-100 cursor-pointer"
      >
        <img
          src={product.images?.[0] || PLACEHOLDER_IMAGE}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        {product.images?.[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 object-cover w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {/* Navigation Loader Overlay */}
        {isNavigating && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-30 flex items-center justify-center animate-fade-in">
            <Loader2 className="animate-spin text-terracotta" size={36} />
          </div>
        )}

        {/* Product Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="badge badge-info text-[9px] sm:text-[11px] px-1.5 py-0.5 sm:px-2 sm:py-1">
              New
            </span>
          )}
          {product.isSale && (
            <span className="badge badge-warning text-[9px] sm:text-[11px] px-1.5 py-0.5 sm:px-2 sm:py-1">
              Sale
            </span>
          )}
          {!product.inStock && (
            <span className="badge badge-neutral text-[9px] sm:text-[11px] px-1.5 py-0.5 sm:px-2 sm:py-1">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute right-2 top-2 sm:right-3 sm:top-3 md:translate-x-10 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handleWishlist}
            aria-label={
              isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'
            }
            className={`p-1.5 sm:p-2 rounded-full shadow-md transition-all active:scale-90 ${
              isWishlisted
                ? 'bg-error text-white'
                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-error'
            }`}
          >
            <Heart
              size={15}
              fill={isWishlisted ? 'currentColor' : 'none'}
              className="transition-transform duration-200 sm:w-[17px] sm:h-[17px]"
            />
          </button>
        </div>

        {/* Quick Add */}
        <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 md:translate-y-full md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300">
          {product.inStock ? (
            <button
              onClick={handleQuickAdd}
              className="w-full bg-terracotta/90 hover:bg-terracotta text-white text-[10px] sm:text-xs font-semibold py-2 px-2 sm:py-2.5 sm:px-4 rounded-md sm:rounded-lg shadow-md backdrop-blur-sm active:scale-95 transition-all flex items-center justify-center gap-1 sm:gap-2"
            >
              <ShoppingBag size={12} className="sm:w-3.5 sm:h-3.5" />
              <span className="truncate">Quick Add</span>
            </button>
          ) : (
            <button
              disabled
              className="w-full bg-white/80 text-gray-400 text-[10px] sm:text-xs font-semibold py-2 px-2 sm:py-2.5 sm:px-4 rounded-md sm:rounded-lg backdrop-blur-sm cursor-not-allowed"
            >
              Notify Me
            </button>
          )}
        </div>
      </div>

      {/* Card Info */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 min-w-0">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-serif text-sm sm:text-lg leading-snug text-text-body group-hover:text-terracotta transition-colors duration-200 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {product.rating > 0 && (
          <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
            <Star size={10} className="fill-amber text-amber sm:w-3 sm:h-3" />
            <span className="text-[10px] sm:text-xs font-semibold text-gray-700">
              {product.rating}
            </span>
            <span className="text-[10px] sm:text-xs text-text-subtle">
              ({product.reviews || 0})
            </span>
          </div>
        )}

        <p className="text-[10px] sm:text-xs text-text-muted mt-1 mb-2 sm:mb-2.5 line-clamp-1 leading-relaxed">
          {product.shortDescription}
        </p>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span className="font-semibold text-text-body text-sm sm:text-base">
            ₹{displayPrice.toLocaleString('en-IN')}
          </span>
          {displayMrp > displayPrice && (
            <>
              <span className="text-[10px] sm:text-sm text-text-subtle line-through">
                ₹{displayMrp.toLocaleString('en-IN')}
              </span>
              <span className="badge badge-success text-[9px] sm:text-[10px] px-1 py-0.5">
                {discount}% OFF
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCard);
