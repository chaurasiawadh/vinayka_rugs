
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, MapPin, Lock, ChevronDown, Share2, 
  ShieldCheck, ArrowRight, RotateCcw
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ImageSmart from '../components/ImageSmart';
import { MOCK_PRODUCTS } from '../constants'; 

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart, toggleWishlist, isInWishlist } = useShop();
  
  // Find product from context or fallback to mock (only if DB is empty/loading fails)
  const product = products.find(p => p.id === id) || MOCK_PRODUCTS.find(p => p.id === id);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeImage, setActiveImage] = useState<string>('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
        setSelectedSize(product.sizes?.[0] || 'Standard');
        setActiveImage(product.images?.[0] || '');
    }
  }, [product]);

  if (!product) return <div className="p-20 text-center text-xl">Product not found</div>;

  const isWishlisted = isInWishlist(product.id);
  
  // Ensure we have defaults if data is missing
  const dist = product.reviewDistribution || { fiveStar: 0, fourStar: 0, threeStar: 0, twoStar: 0, oneStar: 0 };
  const totalReviews = product.reviews || 0;
  const reviewTags = product.reviewTags || [];

  const handleAddToCart = () => addToCart(product, selectedSize, qty);
  const handleBuyNow = () => {
      addToCart(product, selectedSize, qty);
      window.location.hash = '#/cart';
  };

  return (
    <div className="bg-white min-h-screen font-sans text-[#0F1111]">
      
      {/* Breadcrumb */}
      <div className="bg-[#f7f7f7] border-b border-gray-200 py-2 px-4 text-xs text-[#565959] leading-tight">
          <div className="max-w-[1500px] mx-auto flex items-center gap-1 flex-wrap">
             <Link to="/" className="hover:underline hover:text-[#C7511F]">Home</Link> 
             <span>›</span>
             <Link to="/shop" className="hover:underline hover:text-[#C7511F]">{product.category}</Link>
             <span>›</span>
             {product.collection && <><Link to={`/shop?collection=${product.collection}`} className="hover:underline hover:text-[#C7511F]">{product.collection}</Link><span>›</span></>}
             <span className="font-bold text-[#333] truncate max-w-[200px]">{product.name}</span>
          </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Images */}
          <div className="lg:col-span-5 flex flex-col-reverse lg:flex-row gap-4">
             <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible py-2 lg:py-0 scrollbar-hide">
                {product.images?.map((img, idx) => (
                    <button 
                        key={idx}
                        onMouseEnter={() => setActiveImage(img)}
                        onClick={() => setActiveImage(img)}
                        className={`w-12 h-14 lg:w-12 lg:h-14 shrink-0 border rounded-sm overflow-hidden ${activeImage === img ? 'border-[#007185] ring-2 ring-[#007185]/30 shadow-sm' : 'border-gray-300 hover:border-gray-400'}`}
                    >
                        <ImageSmart src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                ))}
             </div>
             <div className="flex-1 relative bg-white border border-gray-100 rounded-sm overflow-hidden group">
                 <div className="aspect-[4/5] lg:aspect-auto lg:h-[600px] flex items-center justify-center p-4">
                    <ImageSmart src={activeImage} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-110 cursor-zoom-in" />
                 </div>
                 <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Share2 className="text-gray-500 cursor-pointer hover:text-gray-800" size={24} />
                 </div>
             </div>
          </div>

          {/* CENTER COLUMN: Info */}
          <div className="lg:col-span-4 space-y-4">
              <div>
                  <h1 className="text-2xl font-medium leading-tight mb-1">{product.name}</h1>
                  <div className="text-[#007185] text-sm hover:underline cursor-pointer">Visit the {product.brand || 'Vinayka Rugs'} Store</div>
              </div>

              <div className="flex items-center gap-2 group cursor-pointer">
                  <div className="flex text-[#FFA41C]">
                      {[1,2,3,4,5].map(star => (
                          <Star key={star} size={16} fill={product.rating >= star ? "currentColor" : "none"} className={product.rating >= star ? "" : "text-gray-300"} />
                      ))}
                      <ChevronDown size={14} className="text-gray-500 ml-1" />
                  </div>
                  <span className="text-[#007185] text-sm font-medium hover:underline">{product.reviews?.toLocaleString()} ratings</span>
              </div>

              <div className="border-t border-gray-200 my-2"></div>

              {/* Pricing */}
              <div>
                  <div className="flex items-baseline gap-2">
                      <span className="text-[#CC0C39] text-2xl font-light">-{product.discount}%</span>
                      <sup className="text-xs top-[-0.5em] relative">₹</sup>
                      <span className="text-3xl font-medium text-[#0F1111]">{product.price?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-xs text-[#565959] mt-1">
                      M.R.P.: <span className="line-through">₹{product.mrp?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-sm text-[#0F1111] mt-2 font-medium">
                      {product.taxInclusive ? 'Inclusive of all taxes' : 'Excludes taxes'}
                  </div>
                  {product.emiAvailable && (
                      <div className="text-sm text-[#0F1111]">
                          <span className="font-bold">EMI</span> starts at ₹{Math.round(product.price/12).toLocaleString('en-IN')}. No Cost EMI available
                      </div>
                  )}
              </div>

              <div className="border-t border-gray-200 my-2"></div>

              {/* Size Selector */}
              <div>
                  <p className="text-sm font-bold text-[#565959] mb-2">Size: <span className="text-[#0F1111]">{selectedSize}</span></p>
                  <div className="flex flex-wrap gap-2">
                      {product.sizes?.map(size => (
                          <button 
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-3 py-2 text-sm border rounded-sm transition-all ${
                                selectedSize === size 
                                ? 'border-[#C7511F] ring-1 ring-[#C7511F] bg-[#fffcf6] font-bold text-[#0F1111]' 
                                : 'border-gray-300 hover:bg-gray-50 text-[#0F1111]'
                            }`}
                          >
                              {size}
                          </button>
                      ))}
                  </div>
              </div>

              {/* Specs Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm mt-4">
                  {Object.entries(product.specifications || {}).map(([key, value]) => (
                      <React.Fragment key={key}>
                          <div className="font-bold text-[#0F1111] capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                          <div className="text-[#565959]">{value as string}</div>
                      </React.Fragment>
                  ))}
              </div>

              <div className="border-t border-gray-200 my-2"></div>

              {/* About Bullets */}
              <div>
                  <h3 className="font-bold text-base mb-2">About this item</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-[#0F1111]">
                      {product.aboutItems?.map((item, i) => (
                          <li key={i}>{item}</li>
                      ))}
                  </ul>
              </div>
          </div>

          {/* RIGHT COLUMN: Buy Box */}
          <div className="lg:col-span-3">
              <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm sticky top-24">
                  <div className="text-2xl font-medium mb-2">₹{product.price?.toLocaleString('en-IN')}</div>
                  <div className="text-sm text-[#007185] mb-2 hover:underline cursor-pointer">FREE delivery</div>
                  <div className="text-sm font-bold mb-4">{product.deliveryText || '7-10 Days'}.</div>
                  
                  <div className="flex items-center gap-2 text-sm text-[#007600] font-medium mb-4">
                      <MapPin size={16} /> Deliver to India
                  </div>

                  <div className={`text-lg font-medium mb-4 ${product.inStock ? 'text-[#007600]' : 'text-error'}`}>
                      {product.inStock ? 'In Stock' : 'Currently Unavailable'}
                  </div>

                  {product.inStock && (
                      <div className="space-y-3">
                          <select 
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                            className="w-full bg-[#f0f2f2] border border-[#d5d9d9] hover:bg-[#e3e6e6] rounded-lg py-1.5 px-3 text-sm shadow-sm"
                          >
                              {[1,2,3,4,5].map(n => <option key={n} value={n}>Qty: {n}</option>)}
                          </select>
                          <button onClick={handleAddToCart} className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full py-2 text-sm font-medium shadow-sm">Add to Cart</button>
                          <button onClick={handleBuyNow} className="w-full bg-[#FFA41C] hover:bg-[#FA8900] border border-[#FF8F00] rounded-full py-2 text-sm font-medium shadow-sm">Buy Now</button>
                      </div>
                  )}

                  <div className="flex items-center gap-2 text-[#007185] text-sm mt-4 hover:underline cursor-pointer">
                      <Lock size={14} /> Secure transaction
                  </div>

                  <div className="border-t border-gray-200 my-4"></div>
                  <button onClick={() => toggleWishlist(product.id)} className="w-full bg-white border border-gray-300 hover:bg-gray-50 rounded-lg py-1.5 text-sm text-[#0F1111] shadow-sm">
                      {isWishlisted ? 'Remove from Wish List' : 'Add to Wish List'}
                  </button>
              </div>
          </div>

        </div>
      </div>

      <div className="border-t border-gray-200 my-8"></div>

      {/* REVIEWS SECTION */}
      <div className="max-w-[1500px] mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-3 space-y-6">
              <h2 className="text-2xl font-bold text-[#0F1111]">Customer reviews</h2>
              <div className="flex items-center gap-2">
                  <div className="flex text-[#FFA41C]">{[1,2,3,4,5].map(s => <Star key={s} size={20} fill={product.rating >= s ? "currentColor" : "none"} />)}</div>
                  <span className="text-lg font-medium">{product.rating} out of 5</span>
              </div>
              <div className="text-[#565959] text-sm mb-4">{product.reviews} global ratings</div>
              
              <div className="space-y-3">
                  {Object.entries(dist).reverse().map(([key, pct], i) => (
                      <div key={key} className="flex items-center gap-3 text-sm text-[#007185] hover:text-[#C7511F] cursor-pointer group">
                          <span className="w-12 hover:underline">{5-i} star</span>
                          <div className="flex-1 h-5 bg-[#F0F2F2] rounded-sm overflow-hidden border border-[#E3E6E6] shadow-inner">
                              <div className="h-full bg-[#FFA41C]" style={{ width: `${pct}%` }}></div>
                          </div>
                          <span className="w-8 text-right hover:underline">{pct}%</span>
                      </div>
                  ))}
              </div>
          </div>

          <div className="lg:col-span-9">
             {product.reviewSummary && (
                 <div className="mb-8">
                     <h3 className="font-bold text-xl mb-4">Customers say</h3>
                     <p className="text-sm text-[#0F1111] leading-relaxed mb-4">{product.reviewSummary}</p>
                     <div className="flex flex-wrap gap-2">
                         {reviewTags.map(tag => (
                             <div key={tag} className="flex items-center gap-1 text-sm border border-gray-300 rounded-full px-3 py-1 cursor-pointer bg-white hover:border-[#0F1111]">
                                 <ShieldCheck size={14} className="text-green-600" /> {tag}
                             </div>
                         ))}
                     </div>
                 </div>
             )}
          </div>
      </div>
    </div>
  );
};

export default ProductDetails;
