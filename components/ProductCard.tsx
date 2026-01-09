import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import Button from './Button';
import { PLACEHOLDER_IMAGE } from '../constants';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
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

  // Helper to parse price
  const parsePrice = (price: any): number => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') return parseFloat(price.replace(/,/g, ''));
    return 0;
  };

  const getPriceData = () => {
    let price = 0;
    let mrp = 0;

    // Try to find for the first size (matching default selection)
    if (product.sizes?.length > 0) {
      const firstSize = product.sizes[0];

      // Calculate Price
      if (product.sizePrices?.[firstSize]) {
        price = parsePrice(product.sizePrices[firstSize]);
      } else if (product.sizePrices) {
        // Fallback to lowest price
        const prices = Object.values(product.sizePrices)
          .map((p) => parsePrice(p))
          .filter((p) => p > 0);
        if (prices.length > 0) price = Math.min(...prices);
      }

      // Calculate MRP
      if (product.sizeOriginalPrices?.[firstSize]) {
        mrp = parsePrice(product.sizeOriginalPrices[firstSize]);
      }
    }

    // Fallbacks if not found in sizes
    if (price === 0) price = parsePrice(product.price);
    if (mrp === 0) mrp = parsePrice(product.mrp);

    return { price, mrp };
  };

  const { price: displayPrice, mrp: displayMrp } = getPriceData();
  const discount =
    displayMrp > displayPrice
      ? Math.round(((displayMrp - displayPrice) / displayMrp) * 100)
      : 0;

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <Link
        href={`/product/${product.id}`}
        className="block relative aspect-[4/5] overflow-hidden bg-gray-100"
      >
        <img
          src={product.images?.[0] || PLACEHOLDER_IMAGE}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        {product.images?.[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className="absolute inset-0 object-cover w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-white/90 backdrop-blur text-xs font-semibold px-2 py-1 uppercase tracking-wider text-teal">
              New
            </span>
          )}
          {product.isSale && (
            <span className="bg-amber text-white text-xs font-semibold px-2 py-1 uppercase tracking-wider">
              Sale
            </span>
          )}
          {!product.inStock && (
            <span className="bg-gray-800 text-white text-xs font-semibold px-2 py-1 uppercase tracking-wider">
              Sold Out
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-2">
          <button
            onClick={handleWishlist}
            className={`p-2 rounded-full shadow-md transition-all active:scale-90 ${isWishlisted ? 'bg-error text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            <Heart
              size={18}
              fill={isWishlisted ? 'currentColor' : 'none'}
              className={`transition-transform duration-300 ${isWishlisted ? 'scale-110' : 'scale-100'}`}
            />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 right-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          {product.inStock ? (
            <Button
              onClick={handleQuickAdd}
              variant="primary"
              fullWidth
              size="sm"
              className="shadow-lg backdrop-blur-sm bg-terracotta/90"
            >
              <ShoppingBag size={16} className="mr-2" /> Quick Add
            </Button>
          ) : (
            <Button
              variant="ghost"
              fullWidth
              size="sm"
              className="bg-white/90 cursor-not-allowed"
            >
              Notify Me
            </Button>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-serif text-lg text-text-body group-hover:text-terracotta transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-text-muted mt-1 mb-2 line-clamp-1">
          {product.shortDescription}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <span className="font-medium text-text-body text-lg">
            ₹{displayPrice.toLocaleString('en-IN')}
          </span>
          {displayMrp > displayPrice && (
            <>
              <span className="text-sm text-gray-400 line-through">
                ₹{displayMrp.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">
                {discount}% OFF
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
