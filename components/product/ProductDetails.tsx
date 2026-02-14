'use client';

import { useState, useRef, MouseEvent, useEffect } from 'react';
import {
  Minus,
  Plus,
  Heart,
  Star,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Diamond,
  Cloud,
  Infinity as InfinityIcon,
  RotateCcw,
  Layers,
  Ruler,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import ProductCard from './ProductCard';
import ARButton from './ARButton';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';

interface ProductDetailsProps {
  product: any;
  relatedProducts: any[];
  reviews: any[];
  faqs: any[];
}

export default function ProductDetails({
  product,
  relatedProducts,
  reviews,
  faqs,
}: ProductDetailsProps) {
  const { addToCart, setDirectPurchaseItem } = useShop();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes ? product.sizes[0] : null
  );

  // Accordion states
  const [openSection, setOpenSection] = useState<string | null>('detail');

  // Specs Expansion State
  const [isSpecsExpanded, setIsSpecsExpanded] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Lightbox Logic
  const [showLightbox, setShowLightbox] = useState(false);

  const nextImage = (e?: MouseEvent) => {
    e?.stopPropagation();
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e?: MouseEvent) => {
    e?.stopPropagation();
    setSelectedImage(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };

  // Zoom Logic
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Close zoom on scroll to prevent stuck magnifier (Amazon behavior)
  useEffect(() => {
    const handleScroll = () => {
      setShowZoom(false);
    };

    if (showZoom) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showZoom]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();

    // Calculate cursor position relative to the image
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Constrain x and y to be within the image bounds
    const constrainedX = Math.max(0, Math.min(x, rect.width));
    const constrainedY = Math.max(0, Math.min(y, rect.height));

    // Store dimensions for lens constraints
    setImgDimensions({ width: rect.width, height: rect.height });
    setCursorPos({ x: constrainedX, y: constrainedY });

    // Calculate position as percentage for background-position
    const xPercent = (constrainedX / rect.width) * 100;
    const yPercent = (constrainedY / rect.height) * 100;

    setZoomPosition({ x: xPercent, y: yPercent });
  };

  // Lens Size
  const lensSize = 180;

  // Calculate constrained lens position
  const lensX = Math.max(
    0,
    Math.min(cursorPos.x - lensSize / 2, imgDimensions.width - lensSize)
  );
  const lensY = Math.max(
    0,
    Math.min(cursorPos.y - lensSize / 2, imgDimensions.height - lensSize)
  );

  return (
    <div className="bg-[#FAF8F6] min-h-screen pb-20">
      <div className="w-full pl-8 pr-8">
        <div className="bg-white rounded-none p-6 md:p-12 shadow-sm ">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(auto,700px)_1fr] gap-12 lg:gap-16 items-start ">
            {/* Left Column: Sticky Images (Thumbnails + Main) */}
            <div className="lg:sticky lg:top-[110px] self-start flex flex-col lg:flex-row gap-8 z-30 ">
              {/* Vertical Thumbnails (Desktop Sticky) */}
              <div className="hidden lg:flex flex-col gap-3 w-20 flex-shrink-0 rounded-md">
                {product.images.slice(0, 8).map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square w-full bg-gray-50 border-2 rounded-sm overflow-hidden transition-all duration-200 ${
                      selectedImage === idx
                        ? 'border-[#41354D] shadow-sm'
                        : 'border-transparent hover:border-gray-200 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumb ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
                {product.images.length > 8 && (
                  <button
                    onClick={() => setShowLightbox(true)}
                    className="aspect-square w-full bg-white border border-gray-200 rounded-sm flex items-center justify-center text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    +{product.images.length - 8}
                  </button>
                )}
              </div>

              {/* Main Image Display */}
              <div className="flex-1 min-w-0 ">
                <div className="w-full relative">
                  <div
                    ref={imageContainerRef}
                    onMouseEnter={() => setShowZoom(true)}
                    onMouseLeave={() => setShowZoom(false)}
                    onMouseMove={handleMouseMove}
                    className="aspect-[3/4] md:aspect-[4/5] w-full max-h-[670px] bg-[#FAFAFA] rounded-md overflow-hidden relative shadow-sm cursor-crosshair border border-gray-100"
                  >
                    <img
                      src={product.images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.tags && (
                      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-gray-100 text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider rounded-full shadow-sm text-gray-900 pointer-events-none">
                        {product.tags[0]}
                      </span>
                    )}

                    {/* Lens Overlay */}
                    {showZoom && (
                      <div
                        className="absolute pointer-events-none z-10 border border-blue-200 hidden lg:block"
                        style={{
                          left: lensX,
                          top: lensY,
                          width: lensSize,
                          height: lensSize,
                          backgroundImage:
                            'radial-gradient(circle, #93c5fd 1px, transparent 1px)',
                          backgroundSize: '4px 4px',
                          backgroundColor: 'rgba(147, 197, 253, 0.15)',
                        }}
                      />
                    )}
                  </div>

                  {/* Zoom Window - Appearing on the RIGHT of the main image */}
                  {showZoom && (
                    <div
                      className="hidden lg:block absolute left-[103%] top-0 w-[650px] h-[670px] bg-white border border-gray-200 shadow-2xl z-50 overflow-hidden pointer-events-none"
                      style={{
                        backgroundImage: `url(${product.images[selectedImage]})`,
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        backgroundSize: '300%',
                        backgroundRepeat: 'no-repeat',
                      }}
                    ></div>
                  )}
                </div>

                {/* Mobile Thumbnails (Horizontal) */}
                <div className="flex lg:hidden gap-3 mt-4 overflow-x-auto pb-4 scrollbar-hide">
                  {product.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-none w-20 h-20 bg-gray-50 border transition-all rounded-sm overflow-hidden ${
                        selectedImage === idx
                          ? 'border-[#41354D]'
                          : 'border-transparent'
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Scrolling Product Content */}
            <div className="flex flex-col">
              <h2 className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-2">
                {product.brand}
              </h2>
              <h1 className="text-4xl font-serif text-[#111] mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-gray-600 text-base mb-4 leading-relaxed">
                  {product.shortDescription}
                </p>
              )}

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex text-[#D4C49D]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {product.reviewsCount} reviews
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-8">
                {(() => {
                  const parsePrice = (price: any): number => {
                    if (typeof price === 'number') return price;
                    if (typeof price === 'string')
                      return parseFloat(price.replace(/,/g, ''));
                    return 0;
                  };

                  const rawPrice =
                    selectedSize &&
                    product.sizePrices &&
                    product.sizePrices[selectedSize]
                      ? product.sizePrices[selectedSize]
                      : product.price;

                  const rawMrp =
                    selectedSize &&
                    product.sizeOriginalPrices &&
                    product.sizeOriginalPrices[selectedSize]
                      ? product.sizeOriginalPrices[selectedSize]
                      : product.originalPrice;

                  const currentPrice = parsePrice(rawPrice);
                  const currentMrp = parsePrice(rawMrp);

                  const discount =
                    currentMrp > currentPrice
                      ? `Save ${Math.round(((currentMrp - currentPrice) / currentMrp) * 100)}%`
                      : null;

                  return (
                    <>
                      <span className="text-xl font-medium text-[#111]">
                        ₹{currentPrice.toLocaleString('en-IN')}
                      </span>
                      {currentMrp > 0 && currentMrp > currentPrice && (
                        <>
                          <span className="text-lg text-gray-300 line-through">
                            ₹{currentMrp.toLocaleString('en-IN')}
                          </span>
                          {discount && (
                            <span className="bg-[#E5F0D0] text-[#5C7030] text-xs font-bold px-2 py-1 rounded-sm">
                              {discount}
                            </span>
                          )}
                        </>
                      )}
                    </>
                  );
                })()}
              </div>

              <p className="text-gray-600 leading-relaxed mb-8 text-sm">
                {product.description}
              </p>

              {/* Size Selector */}
              <div className="mb-6">
                <h3 className="text-base font-semibold text-[#111] mb-3">
                  Size
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all border ${
                        selectedSize === size
                          ? 'bg-[#111] text-white border-[#111] shadow-sm'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-[#111]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Specifications Table */}
              <div className="mb-8 border-t border-gray-100 pt-6">
                <div className="grid grid-cols-1 gap-y-2 text-sm">
                  {(() => {
                    const allSpecs = [
                      { label: 'Brand', value: product.brand },
                      { label: 'Category', value: product.category },
                      { label: 'Collection', value: product.collection },
                      {
                        label: 'Size',
                        value: selectedSize || product.sizes?.[0] || '-',
                      },
                      {
                        label: 'Material',
                        value: product.specifications?.material,
                      },
                      {
                        label: 'Room',
                        value: product.specifications?.roomType,
                      },
                      {
                        label: 'Shape',
                        value: product.specifications?.shape,
                      },
                      {
                        label: 'Weave Type',
                        value: product.specifications?.weaveType,
                      },
                      {
                        label: 'Item Weight',
                        value: product.specifications?.itemWeight,
                      },
                      {
                        label: 'Pile Height',
                        value: product.specifications?.pileHeight,
                      },
                      {
                        label: 'Construction',
                        value: product.specifications?.construction,
                      },
                      {
                        label: 'Back Material',
                        value: product.specifications?.backMaterial,
                      },
                      {
                        label: 'Color',
                        value: product.specifications?.color,
                      },
                      {
                        label: 'Quality',
                        value: product.specifications?.quality,
                      },
                      {
                        label: 'Usage',
                        value: product.specifications?.indoorOutdoor,
                      },
                    ].filter((row) => row.value);

                    const visibleSpecs = isSpecsExpanded
                      ? allSpecs
                      : allSpecs.slice(0, 4);

                    return (
                      <>
                        {visibleSpecs.map((row, i) => (
                          <div
                            key={i}
                            className="grid grid-cols-[140px_1fr] gap-4"
                          >
                            <span className="font-bold text-[#111]">
                              {row.label}
                            </span>
                            <span className="text-gray-600">
                              {(() => {
                                const val = row.value;
                                if (Array.isArray(val)) {
                                  const singleChars = val.filter(
                                    (v: any) =>
                                      typeof v === 'string' && v.length === 1
                                  );
                                  const words = val.filter(
                                    (v: any) =>
                                      typeof v === 'string' && v.length > 1
                                  );
                                  if (singleChars.length > 0) {
                                    const reconstructed = singleChars
                                      .join('')
                                      .replace(/^,/, '')
                                      .replace(/,$/, '');
                                    if (reconstructed.trim().length > 0) {
                                      words.push(reconstructed);
                                    }
                                  }
                                  return Array.from(new Set(words))
                                    .map((w: any) =>
                                      w.toString().replace(/^]/, '').trim()
                                    )
                                    .filter((w) => w.length > 0)
                                    .join(', ');
                                }
                                return val;
                              })()}
                            </span>
                          </div>
                        ))}
                        {allSpecs.length > 4 && (
                          <button
                            onClick={() => setIsSpecsExpanded(!isSpecsExpanded)}
                            className="flex items-center gap-1 text-terracotta font-semibold text-sm mt-2 hover:text-black transition-colors text-left w-fit"
                          >
                            {isSpecsExpanded ? (
                              <>
                                <ChevronUp size={16} /> See Less
                              </>
                            ) : (
                              <>
                                <ChevronDown size={16} /> See More
                              </>
                            )}
                          </button>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* About This Item */}
              {product.aboutItems && product.aboutItems.length > 0 && (
                <div className="mb-8 pt-4 border-t border-gray-100">
                  <h3 className="text-xl font-bold text-[#111] mb-4 font-serif">
                    About this item
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed marker:text-gray-400">
                    {product.aboutItems.map((item: string, idx: number) => (
                      <li key={idx} className="pl-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center border border-gray-200 rounded-full h-12 w-full sm:w-32">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className={`w-10 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors ${quantity <= 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="flex-1 w-full text-center text-sm font-medium focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(5, quantity + 1))}
                    disabled={quantity >= 5}
                    className={`w-10 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors ${quantity >= 5 ? 'opacity-30 cursor-not-allowed' : ''}`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <button
                  onClick={() =>
                    addToCart(product, selectedSize || 'Standard', quantity)
                  }
                  className="flex-1 bg-[#41354D] text-white h-12 rounded-lg font-medium tracking-wide hover:bg-[#2D2435] transition-colors uppercase text-sm"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    const buyNowItem = {
                      ...product,
                      selectedSize: selectedSize || 'Standard',
                      quantity: quantity,
                    };
                    setDirectPurchaseItem(buyNowItem);
                    router.push('/cart?buyNow=true');
                  }}
                  className="flex-1 bg-terracotta text-white h-12 rounded-lg font-medium tracking-wide hover:bg-[#724D31] transition-colors uppercase text-sm"
                >
                  Buy Now
                </button>
                <button className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* AR Live View Button */}
              <div className="mb-8">
                <ARButton product={product} />
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 bg-gray-50 p-6 rounded-lg">
                <div className="text-center flex flex-col items-center">
                  <div className="mb-3 p-3 bg-amber-50 rounded-full">
                    <Diamond
                      size={32}
                      className="text-amber-700 fill-amber-100"
                    />
                  </div>
                  <p className="text-[10px] font-medium text-gray-600 uppercase tracking-wider">
                    Hand
                    <br />
                    Knotted
                  </p>
                </div>
                <div className="text-center flex flex-col items-center">
                  <div className="mb-3 p-3 bg-blue-50 rounded-full">
                    <Cloud size={32} className="text-blue-600 fill-blue-50" />
                  </div>
                  <p className="text-[10px] font-medium text-gray-600 uppercase tracking-wider">
                    Pure
                    <br />
                    Wool
                  </p>
                </div>
                <div className="text-center flex flex-col items-center">
                  <div className="mb-3 p-3 bg-indigo-50 rounded-full">
                    <InfinityIcon size={32} className="text-indigo-600" />
                  </div>
                  <p className="text-[10px] font-medium text-gray-600 uppercase tracking-wider">
                    Heirloom
                    <br />
                    Quality
                  </p>
                </div>
                <div className="text-center flex flex-col items-center">
                  <div className="mb-3 p-3 bg-emerald-50 rounded-full">
                    <RotateCcw size={32} className="text-emerald-600" />
                  </div>
                  <p className="text-[10px] font-medium text-gray-600 uppercase tracking-wider">
                    Easy
                    <br />
                    Returns
                  </p>
                </div>
              </div>

              {/* Accordions */}
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-4">
                  <button
                    onClick={() => toggleSection('detail')}
                    className="w-full flex items-center justify-between text-sm font-medium text-[#111] mb-2"
                  >
                    Product Details
                    {openSection === 'detail' ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                  {openSection === 'detail' && (
                    <div className="text-sm text-gray-500 leading-relaxed animate-in slide-in-from-top-2 duration-200 whitespace-pre-line">
                      {product.details}
                    </div>
                  )}
                </div>
                <div className="border-b border-gray-100 pb-4">
                  <button
                    onClick={() => toggleSection('material')}
                    className="w-full flex items-center justify-between text-sm font-medium text-[#111] mb-2"
                  >
                    Material
                    {openSection === 'material' ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                  {openSection === 'material' && (
                    <div className="text-sm text-gray-500 leading-relaxed animate-in slide-in-from-top-2 duration-200">
                      {product.material}
                    </div>
                  )}
                </div>
                <div className="border-b border-gray-100 pb-4">
                  <button
                    onClick={() => toggleSection('care')}
                    className="w-full flex items-center justify-between text-sm font-medium text-[#111] mb-2"
                  >
                    Care Instructions
                    {openSection === 'care' ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                  {openSection === 'care' && (
                    <div className="text-sm text-gray-500 leading-relaxed animate-in slide-in-from-top-2 duration-200">
                      {product.careInstructions}
                    </div>
                  )}
                </div>
                <div className="border-b border-gray-100 pb-4">
                  <button
                    onClick={() => toggleSection('shipping')}
                    className="w-full flex items-center justify-between text-sm font-medium text-[#111] mb-2"
                  >
                    Shipping & Returns
                    {openSection === 'shipping' ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                  {openSection === 'shipping' && (
                    <div className="text-sm text-gray-500 leading-relaxed animate-in slide-in-from-top-2 duration-200">
                      {product.shipping}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif text-[#111]">
              You May Also Like
            </h2>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                ←
              </button>
              <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                →
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                brand={p.brand}
                price={p.price}
                originalPrice={p.originalPrice}
                image={p.images[0]}
                rating={p.rating}
                reviewsCount={p.reviewsCount}
                tags={p.tags}
              />
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-20">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[#212121]">
                  Ratings & Reviews
                </h2>
                <button className="px-8 py-3 bg-white border border-gray-300 shadow-sm text-sm font-medium text-[#212121] rounded-sm hover:shadow-md transition-shadow">
                  Rate Product
                </button>
              </div>

              {/* Summary & Breakdown */}
              <div className="flex flex-col md:flex-row gap-12 mb-10 border-b border-gray-200 pb-10">
                <div className="flex-none flex flex-col items-center justify-center min-w-[150px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-4xl font-medium text-[#212121]">
                      {product.rating}
                    </span>
                    <Star className="w-6 h-6 fill-[#D4C49D] text-[#D4C49D]" />
                  </div>
                  <p className="text-sm text-gray-400 text-center font-medium">
                    {product.reviewsCount} Verified Ratings
                  </p>
                </div>

                {/* Rating Bars - EXACT STYLE */}
                <div className="flex-1 w-full max-w-md space-y-2.5">
                  {[
                    { star: 5, count: 2450, color: '#D4C49D' },
                    { star: 4, count: 850, color: '#D4C49D' },
                    { star: 3, count: 420, color: '#D4C49D' },
                    { star: 2, count: 120, color: '#D4C49D' },
                    { star: 1, count: 80, color: '#D4C49D' },
                  ].map((row) => (
                    <div
                      key={row.star}
                      className="flex items-center gap-4 text-xs font-medium"
                    >
                      <span className="w-3 text-[#212121]">
                        {row.star}{' '}
                        <div className="w-3 h-3 fill-[#D4C49D] text-[#D4C49D]">
                          ★
                        </div>
                      </span>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(row.count / 3000) * 100}%`,
                            backgroundColor: row.color,
                          }}
                        />
                      </div>
                      <span className="w-8 text-right text-gray-400">
                        {row.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customers Say Summary */}
              {(product.reviewSummary ||
                (product.reviewTags && product.reviewTags.length > 0)) && (
                <div className="mb-10 p-6 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="font-bold text-[#212121] mb-2 font-serif text-lg">
                    Customers Say
                  </h3>
                  {product.reviewSummary && (
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed italic">
                      &quot;{product.reviewSummary}&quot;
                    </p>
                  )}
                  {product.reviewTags && product.reviewTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {product.reviewTags.map((tag: string) => (
                        <span
                          key={tag}
                          className="bg-white border border-gray-200 px-3 py-1 rounded-sm text-xs font-medium text-gray-700 shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Customer Photos Strip */}
              <div className="mb-10">
                <h3 className="text-lg font-bold text-[#212121] mb-4">
                  Customer Photos
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                  {reviews
                    .flatMap((r) => r.images || [])
                    .slice(0, 8)
                    .map((img: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex-none w-24 h-24 relative cursor-pointer hover:opacity-90 transition-opacity border border-gray-200 rounded-sm"
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover rounded-sm"
                        />
                        {idx === 7 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium text-lg">
                            +12
                          </div>
                        )}
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
                        {review.rating}{' '}
                        <Star className="w-2.5 h-2.5 fill-current" />
                      </span>
                      <h4 className="font-medium text-[#212121] text-sm">
                        Mind-blowing purchase
                      </h4>
                    </div>

                    <p className="text-sm text-[#212121] leading-relaxed mb-4">
                      {review.content} 👌😍
                    </p>

                    {review.images && (
                      <div className="flex gap-2 mb-4">
                        {review.images.map((img: string, i: number) => (
                          <div
                            key={i}
                            className="w-16 h-16 border border-gray-200 p-0.5 rounded-sm"
                          >
                            <img
                              src={img}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">{review.author}</span>
                        {review.verified && (
                          <span className="flex items-center gap-1 text-gray-400">
                            <span className="w-3 h-3 bg-gray-400 rounded-full flex items-center justify-center">
                              <Check className="w-2 h-2 text-white" />
                            </span>{' '}
                            Certified Buyer, Mumbai
                          </span>
                        )}
                        <span>{review.date}</span>
                      </div>

                      <div className="flex items-center gap-6">
                        <button className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
                          <ThumbsUp className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400 font-medium">60</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-gray-600 transition-colors">
                          <ThumbsDown className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400 font-medium">12</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions Section - Reference Style */}
        <div className="mt-24 mb-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-[#111] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 font-medium tracking-wide">
              Need Help? We&apos;ve Got You Covered
            </p>
          </div>

          <div className="max-w-4xl mx-auto divide-y divide-gray-100 px-4 md:px-0">
            {faqs.map((faq, idx) => {
              const getIcon = (index: number) => {
                const icons = [
                  <Ruler key="1" size={20} className="text-[#111]" />,
                  <Layers key="2" size={20} className="text-[#111]" />,
                  <RotateCcw key="3" size={20} className="text-[#111]" />,
                  <ShieldCheck key="4" size={20} className="text-[#111]" />,
                  <Globe key="5" size={20} className="text-[#111]" />,
                ];
                return icons[index % icons.length];
              };

              return (
                <div key={idx} className="py-8 first:pt-0 last:pb-0">
                  <div className="flex gap-6 items-start">
                    {/* Icon Box */}
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-gray-200 rounded-lg shadow-sm bg-white">
                      {getIcon(idx)}
                    </div>

                    {/* Question & Answer Content */}
                    <div className="flex-1">
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full flex items-center justify-between text-left group pt-2"
                      >
                        <h3
                          className={`text-sm md:text-lg font-semibold transition-colors ${
                            openFaq === idx ? 'text-black' : 'text-[#111]'
                          }`}
                        >
                          {faq.question}
                        </h3>
                        <div className="flex-shrink-0 ml-4">
                          {openFaq === idx ? (
                            <ChevronUp
                              size={22}
                              className="text-gray-400 group-hover:text-black transition-colors"
                            />
                          ) : (
                            <ChevronDown
                              size={22}
                              className="text-gray-400 group-hover:text-black transition-colors"
                            />
                          )}
                        </div>
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          openFaq === idx
                            ? 'max-h-96 mt-4 opacity-100'
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        <p className="text-lg text-gray-500 leading-relaxed max-w-2xl">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox Overlay */}
      {showLightbox && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[90vw] h-[90vh] rounded-lg shadow-2xl flex flex-col relative overflow-hidden">
            {/* Header Tabs & Close */}
            <div className="flex items-center justify-between px-6 border-b border-gray-200">
              <div className="flex gap-8">
                <button className="py-4 text-sm font-bold text-[#41354D] border-b-2 border-[#41354D] uppercase tracking-wide">
                  Images
                </button>
              </div>
              <button
                onClick={() => setShowLightbox(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Main Image Area */}
              <div className="flex-1 bg-white flex items-center justify-center p-8 relative group">
                <button
                  onClick={prevImage}
                  className="absolute left-4 p-2 bg-white/80 hover:bg-white shadow-md rounded-full text-gray-700 opacity-0 group-hover:opacity-100 transition-all border border-gray-100"
                >
                  <ChevronLeft size={24} />
                </button>

                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />

                <button
                  onClick={nextImage}
                  className="absolute right-4 p-2 bg-white/80 hover:bg-white shadow-md rounded-full text-gray-700 opacity-0 group-hover:opacity-100 transition-all border border-gray-100"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Sidebar Info */}
              <div className="w-[350px] bg-white border-l border-gray-100 p-6 flex flex-col gap-6 overflow-y-auto">
                <div>
                  <h2 className="font-serif text-xl text-[#111] mb-2 leading-tight">
                    {product.name}
                  </h2>
                  {product.size && (
                    <p className="text-xs text-gray-500 mb-1">
                      Size: {product.size}
                    </p>
                  )}
                  {product.color && (
                    <p className="text-xs text-gray-500">
                      Color: {product.color}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {product.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative aspect-square border-2 rounded-sm overflow-hidden transition-all ${selectedImage === idx ? 'border-[#41354D] ring-1 ring-[#41354D]/20' : 'border-transparent hover:border-gray-200'}`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
