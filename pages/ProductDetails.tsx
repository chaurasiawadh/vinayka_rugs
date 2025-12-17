
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, Minus, Plus, Heart, Share2, 
  ChevronDown, ChevronUp, Truck, ShieldCheck, RefreshCcw
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ImageSmart from '../components/ImageSmart';
import Button from '../components/Button';
import { MOCK_PRODUCTS } from '../constants'; 
import { Product } from '../types';

// --- Helper Components ---

interface AccordionItemProps {
  title: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}

const AccordionItem = ({ title, children, defaultOpen = false }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-gray-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-5 text-left group focus:outline-none"
      >
        <span className="font-serif text-lg text-text-body font-medium group-hover:text-terracotta transition-colors">{title}</span>
        {isOpen ? 
          <ChevronUp size={20} className="text-gray-400 group-hover:text-terracotta transition-colors" /> : 
          <ChevronDown size={20} className="text-gray-400 group-hover:text-terracotta transition-colors" />
        }
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
      >
        {children}
      </div>
    </div>
  );
};

const SpecRow = ({ label, value }: { label: string, value?: string }) => {
   if (!value) return null;
   return (
     <div className="flex py-3 text-sm border-b border-gray-100 last:border-0">
       <span className="w-1/3 text-text-muted font-medium pr-4">{label}</span>
       <span className="w-2/3 text-text-body">{value}</span>
     </div>
   );
};

interface SpecGroupProps {
  title: string;
  children?: React.ReactNode;
}

const SpecGroup = ({ title, children }: SpecGroupProps) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="mb-6 last:mb-0">
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full mb-3 group focus:outline-none"
            >
                <h4 className="font-medium text-terracotta text-sm uppercase tracking-wider group-hover:text-text-body transition-colors">{title}</h4>
                {isOpen ? 
                    <ChevronUp size={16} className="text-terracotta" /> : 
                    <ChevronDown size={16} className="text-gray-400 group-hover:text-terracotta" />
                }
            </button>
            {isOpen && (
                <div className="bg-gray-50 rounded-lg px-4 border border-gray-100 animate-fade-in">
                    {children}
                </div>
            )}
        </div>
    );
};

// --- Main Component ---

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart, toggleWishlist, isInWishlist } = useShop();
  
  const product = products.find(p => p.id === id) || MOCK_PRODUCTS.find(p => p.id === id);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
        setSelectedSize(product.sizes?.[0] || 'Standard');
    }
  }, [product]);

  if (!product) return <div className="min-h-screen flex items-center justify-center text-xl font-serif">Product not found</div>;

  const isWishlisted = isInWishlist(product.id);
  const specs = product.specifications || {} as Partial<Product['specifications']>;
  
  const handleAddToCart = () => addToCart(product, selectedSize, qty);
  const handleBuyNow = () => {
      addToCart(product, selectedSize, qty);
      window.location.hash = '#/cart';
  };

  return (
    <div className="bg-white min-h-screen font-sans text-text-body animate-fade-in">
      
      {/* Breadcrumb */}
      <nav className="border-b border-gray-100 py-3">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-xs text-text-muted flex items-center gap-2">
             <Link to="/" className="hover:text-terracotta transition-colors">Home</Link> 
             <span className="text-gray-300">/</span>
             <Link to="/shop" className="hover:text-terracotta transition-colors">{product.category}</Link>
             <span className="text-gray-300">/</span>
             {product.collection && (
                 <>
                    <Link to={`/shop?collection=${product.collection}`} className="hover:text-terracotta transition-colors">{product.collection}</Link>
                    <span className="text-gray-300">/</span>
                 </>
             )}
             <span className="font-medium text-text-body truncate">{product.name}</span>
          </div>
      </nav>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
          
          {/* LEFT COLUMN: Image Gallery (Vertical Stack for Luxury Feel) */}
          <div className="lg:col-span-7 space-y-4">
             {/* Main Images - Stacked on Desktop, Carousel on Mobile could be implemented but Stacked is good for luxury */}
             <div className="space-y-4">
                {product.images?.map((img, idx) => (
                    <div key={idx} className="bg-gray-50 w-full rounded-xl overflow-hidden aspect-[4/5] lg:aspect-[3/4] shadow-sm relative group">
                        <ImageSmart 
                            src={img} 
                            alt={`${product.name} view ${idx + 1}`} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-zoom-in" 
                        />
                    </div>
                ))}
             </div>
          </div>

          {/* RIGHT COLUMN: Product Info (Sticky) */}
          <div className="lg:col-span-5">
              <div className="sticky top-24 space-y-8">
                  
                  {/* Header */}
                  <div>
                      <h2 className="text-xs font-bold tracking-[0.2em] text-terracotta uppercase mb-3">
                          {product.brand || 'Vinayka Rugs'}
                      </h2>
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium leading-tight mb-4 text-gray-900">
                          {product.name}
                      </h1>
                      <div className="flex items-center gap-4">
                          <p className="text-2xl font-light text-gray-900">
                              ₹{product.price?.toLocaleString('en-IN')}
                          </p>
                          {product.mrp > product.price && (
                              <div className="flex items-center gap-2">
                                  <span className="text-lg text-gray-400 line-through font-light">₹{product.mrp?.toLocaleString()}</span>
                                  <span className="text-xs font-bold text-white bg-error px-2 py-1 rounded">
                                      {product.discount}% OFF
                                  </span>
                              </div>
                          )}
                      </div>
                      <p className="text-xs text-text-muted mt-2">Inclusive of all taxes. Free shipping on this item.</p>

                      <div className="flex items-center gap-2 mt-4">
                          <div className="flex text-amber">
                              {[1,2,3,4,5].map(star => (
                                  <Star key={star} size={16} fill={product.rating >= star ? "currentColor" : "none"} className={product.rating >= star ? "" : "text-gray-300"} />
                              ))}
                          </div>
                          <span className="text-sm text-text-muted border-b border-gray-300 pb-0.5 hover:text-terracotta hover:border-terracotta cursor-pointer transition-all">
                              Read {product.reviews} Reviews
                          </span>
                      </div>
                  </div>

                  {/* Description */}
                  <div className="prose prose-sm text-text-muted leading-relaxed">
                      <p>{product.description}</p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-100 w-full"></div>

                  {/* Selectors */}
                  <div className="space-y-6">
                      {/* Size */}
                      <div>
                          <div className="flex justify-between items-center mb-3">
                              <span className="font-medium text-sm">Select Size</span>
                              <button className="text-xs text-terracotta underline hover:text-gray-900">Size Guide</button>
                          </div>
                          <div className="flex flex-wrap gap-3">
                              {product.sizes?.map(size => (
                                  <button 
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-4 py-3 text-sm rounded border transition-all duration-200 ${
                                        selectedSize === size 
                                        ? 'border-terracotta bg-terracotta text-white shadow-md' 
                                        : 'border-gray-200 text-text-body hover:border-gray-400 bg-white'
                                    }`}
                                  >
                                      {size}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-4">
                          <div className="flex gap-4">
                              <div className="flex items-center border border-gray-300 rounded-lg w-32 shrink-0">
                                  <button 
                                    onClick={() => setQty(q => Math.max(1, q - 1))}
                                    className="w-10 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500"
                                  >
                                      <Minus size={16} />
                                  </button>
                                  <span className="flex-1 text-center font-medium">{qty}</span>
                                  <button 
                                    onClick={() => setQty(q => Math.min(10, q + 1))}
                                    className="w-10 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500"
                                  >
                                      <Plus size={16} />
                                  </button>
                              </div>
                              <Button 
                                onClick={handleAddToCart}
                                size="lg" 
                                fullWidth
                                disabled={!product.inStock}
                                className={!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}
                              >
                                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                              </Button>
                          </div>
                          
                          <div className="flex gap-4">
                              <button 
                                  onClick={handleBuyNow}
                                  disabled={!product.inStock}
                                  className="flex-1 border-2 border-gray-900 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-900 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                  Buy Now
                              </button>
                              <button 
                                onClick={() => toggleWishlist(product.id)}
                                className={`w-14 shrink-0 flex items-center justify-center border-2 rounded-lg transition-colors ${isWishlisted ? 'border-error text-error bg-error/5' : 'border-gray-200 text-gray-400 hover:border-gray-400'}`}
                              >
                                  <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                              </button>
                          </div>
                      </div>

                      {/* Trust Badges */}
                      <div className="grid grid-cols-3 gap-2 text-center text-xs text-text-muted bg-gray-50 p-4 rounded-xl">
                          <div className="flex flex-col items-center gap-2">
                              <Truck size={20} className="text-terracotta" />
                              <span>Free Shipping</span>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                              <ShieldCheck size={20} className="text-terracotta" />
                              <span>Authentic</span>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                              <RefreshCcw size={20} className="text-terracotta" />
                              <span>Easy Returns</span>
                          </div>
                      </div>
                  </div>

                  {/* Accordion Sections */}
                  <div className="border-b border-gray-200 mt-8">
                      
                      <AccordionItem title="Product Details" defaultOpen={true}>
                          <div className="space-y-1">
                              {/* 1. Key Specs Group */}
                              <SpecGroup title="Features">
                                  <SpecRow label="Material" value={specs.material} />
                                  <SpecRow label="Weave Type" value={specs.weaveType} />
                                  <SpecRow label="Pile Height" value={specs.pileHeight} />
                                  <SpecRow label="Construction" value={specs.construction} />
                                  <SpecRow label="Origin" value={specs.origin} />
                              </SpecGroup>

                              {/* 2. Style Group */}
                              <SpecGroup title="Style & Design">
                                  <SpecRow label="Color" value={specs.color} />
                                  <SpecRow label="Pattern" value={specs.pattern} />
                                  <SpecRow label="Style" value={specs.style} />
                                  <SpecRow label="Shape" value={specs.shape} />
                              </SpecGroup>

                              {/* 3. Measurements Group */}
                              <SpecGroup title="Dimensions">
                                  <SpecRow label="Size" value={specs.size} />
                                  <SpecRow label="Dimensions" value={specs.dimensionsLxW} />
                                  <SpecRow label="Weight" value={specs.itemWeight} />
                                  <SpecRow label="Thickness" value={specs.itemThickness} />
                              </SpecGroup>

                              {/* 4. Care Group */}
                              <SpecGroup title="Care & Warranty">
                                  <SpecRow label="Care" value={specs.careInstructions} />
                                  <SpecRow label="Stain Resistant" value={specs.stainResistant} />
                                  <SpecRow label="Warranty" value={specs.warranty} />
                              </SpecGroup>
                          </div>
                      </AccordionItem>

                      <AccordionItem title="Shipping & Returns">
                          <div className="text-sm text-text-muted space-y-3 leading-relaxed">
                              <p><strong className="text-text-body">Dispatch:</strong> Items are usually dispatched within 24-48 hours.</p>
                              <p><strong className="text-text-body">Delivery:</strong> {product.deliveryText || 'Expected delivery in 7-10 business days.'}</p>
                              <p><strong className="text-text-body">Returns:</strong> We offer a {product.returnPolicy || '7-day'} return policy for all standard items. Bespoke or custom-sized rugs are not eligible for return unless defective.</p>
                          </div>
                      </AccordionItem>

                      <AccordionItem title="About The Collection">
                          <div className="text-sm text-text-muted space-y-2">
                              <p>Part of the <strong>{product.collection || product.category}</strong> collection.</p>
                              <ul className="list-disc pl-5 space-y-1 mt-2">
                                  {product.aboutItems?.map((item, i) => (
                                      <li key={i}>{item}</li>
                                  ))}
                              </ul>
                          </div>
                      </AccordionItem>

                  </div>
                  
                  <div className="flex items-center gap-4 pt-4">
                      <button className="flex items-center gap-2 text-sm text-text-muted hover:text-terracotta transition-colors">
                          <Share2 size={16} /> Share
                      </button>
                  </div>

              </div>
          </div>

        </div>

        {/* REVIEWS SECTION */}
        <div className="max-w-[1200px] mx-auto mt-24 pt-12 border-t border-gray-200">
             <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-serif font-bold">Customer Reviews</h2>
                 <Button variant="outline">Write a Review</Button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                 <div className="md:col-span-1 bg-gray-50 p-8 rounded-xl text-center">
                     <div className="text-5xl font-serif font-bold text-gray-900 mb-2">{product.rating}</div>
                     <div className="flex justify-center text-amber mb-2">
                        {[1,2,3,4,5].map(s => <Star key={s} size={20} fill={product.rating >= s ? "currentColor" : "none"} />)}
                     </div>
                     <p className="text-text-muted text-sm">Based on {product.reviews} reviews</p>
                 </div>
                 
                 <div className="md:col-span-2 space-y-6">
                     {product.reviewSummary && (
                         <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
                             <div className="flex items-start gap-3">
                                 <div className="bg-green-100 p-2 rounded-full text-green-700 mt-1">
                                     <ShieldCheck size={20} />
                                 </div>
                                 <div>
                                     <h4 className="font-bold text-lg mb-2">Verdict</h4>
                                     <p className="text-text-muted leading-relaxed">{product.reviewSummary}</p>
                                     <div className="flex flex-wrap gap-2 mt-4">
                                         {product.reviewTags?.map(tag => (
                                             <span key={tag} className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{tag}</span>
                                         ))}
                                     </div>
                                 </div>
                             </div>
                         </div>
                     )}
                 </div>
             </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
