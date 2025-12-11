import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Truck, ShieldCheck, RefreshCcw, Info } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';
import { useShop } from '../context/ShopContext';
import Button from '../components/Button';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = MOCK_PRODUCTS.find(p => p.id === id);
  const { addToCart } = useShop();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeImage, setActiveImage] = useState<string>('');
  
  useEffect(() => {
    if (product) {
        setSelectedSize(product.sizes[0]);
        setActiveImage(product.images[0]);
    }
  }, [product]);

  if (!product) return <div className="p-20 text-center">Product not found</div>;

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Breadcrumbs */}
        <div className="text-sm text-text-muted mb-8">
          Home / Shop / {product.category} / <span className="text-text-body">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden relative">
               <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
               {product.images.map((img, idx) => (
                 <button 
                   key={idx} 
                   onClick={() => setActiveImage(img)}
                   className={`w-20 h-24 shrink-0 rounded-md overflow-hidden border-2 transition-colors ${activeImage === img ? 'border-terracotta' : 'border-transparent'}`}
                 >
                   <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                 </button>
               ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-8">
             <div>
                <h1 className="text-3xl md:text-4xl font-serif mb-2">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-medium text-terracotta">₹{product.price.toLocaleString('en-IN')}</span>
                  <div className="flex items-center gap-1 text-sm text-amber">
                    <Star size={14} fill="currentColor" />
                    <span className="font-medium">{product.rating}</span>
                    <span className="text-text-muted">({product.reviews} reviews)</span>
                  </div>
                </div>
                <p className="text-text-muted leading-relaxed">{product.description}</p>
             </div>

             {/* Variants */}
             <div>
                <h3 className="text-sm font-medium mb-3">Size</h3>
                <div className="flex flex-wrap gap-3">
                   {product.sizes.map(size => (
                     <button
                       key={size}
                       onClick={() => setSelectedSize(size)}
                       className={`px-4 py-2 border rounded-md text-sm transition-all ${selectedSize === size ? 'border-terracotta bg-terracotta text-white' : 'border-gray-200 hover:border-gray-400 text-text-body'}`}
                     >
                       {size}
                     </button>
                   ))}
                </div>
                <div className="mt-2 text-xs text-text-muted flex items-center gap-1 cursor-pointer hover:text-terracotta">
                   <Info size={12} /> Size Guide
                </div>
             </div>

             {/* Actions */}
             <div className="pt-4 border-t border-gray-100 space-y-4">
                {product.inStock ? (
                  <div className="flex gap-4">
                     <Button 
                       size="lg" 
                       fullWidth 
                       onClick={() => addToCart(product, selectedSize, 1)}
                     >
                       Add to Cart
                     </Button>
                     <Button variant="outline" size="lg" className="px-6">
                        <Star size={20} />
                     </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                     <p className="text-error font-medium">Currently Out of Stock</p>
                     <div className="flex gap-2">
                       <input type="email" placeholder="Enter your email" className="flex-1 border border-gray-300 rounded-lg px-4 py-2" />
                       <Button>Notify Me</Button>
                     </div>
                  </div>
                )}
                <div className="flex items-center justify-center gap-2 text-sm text-text-muted bg-cream p-3 rounded-lg">
                   <Truck size={16} /> Free shipping on orders over ₹50,000
                </div>
             </div>

             {/* Specs */}
             <div className="grid grid-cols-2 gap-4 text-sm pt-6">
                <div>
                   <span className="text-text-muted block">Collection</span>
                   <span className="font-medium">{product.collection}</span>
                </div>
                <div>
                   <span className="text-text-muted block">Construction</span>
                   <span className="font-medium">{product.construction}</span>
                </div>
                <div>
                   <span className="text-text-muted block">Material</span>
                   <span className="font-medium">{product.material}</span>
                </div>
                <div>
                   <span className="text-text-muted block">Origin</span>
                   <span className="font-medium">India</span>
                </div>
             </div>

             {/* Features Accordion (simplified) */}
             <div className="space-y-4 pt-6 border-t border-gray-100">
                <div className="flex gap-4 text-sm text-text-body">
                   <div className="flex items-center gap-2">
                      <ShieldCheck size={18} className="text-teal" /> 2 Year Warranty
                   </div>
                   <div className="flex items-center gap-2">
                      <RefreshCcw size={18} className="text-teal" /> 30 Day Returns
                   </div>
                </div>
             </div>

             {/* Artisan Story Card */}
             {product.artisanStory && (
               <div className="bg-cream p-6 rounded-lg mt-8">
                 <h3 className="font-serif text-lg mb-2">Artisan Story</h3>
                 <p className="text-sm italic text-text-muted">"{product.artisanStory}"</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;