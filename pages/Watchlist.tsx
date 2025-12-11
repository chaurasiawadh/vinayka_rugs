import React from 'react';
import { useShop } from '../context/ShopContext';
import { MOCK_PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';
import { BellRing, Trash2, ShoppingBag } from 'lucide-react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const Watchlist: React.FC = () => {
  const { wishlist, toggleWishlist, updateWishlistPreferences } = useShop();

  // Hydrate watchlist with full product data
  const watchedProducts = wishlist.map(item => {
    const product = MOCK_PRODUCTS.find(p => p.id === item.productId);
    return product ? { ...product, ...item } : null;
  }).filter(Boolean);

  if (watchedProducts.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-cream">
         <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-terracotta">
             <BellRing size={32} />
         </div>
         <h2 className="text-2xl font-serif mb-2">Your Watchlist is Empty</h2>
         <p className="text-text-muted mb-6">Save items you love to get notified about price drops.</p>
         <Link to="/shop"><Button>Explore Collection</Button></Link>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif mb-8">My Watchlist ({watchedProducts.length})</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* List View */}
            <div className="lg:col-span-2 space-y-6">
                {watchedProducts.map((item: any) => (
                    <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm flex flex-col sm:flex-row gap-6">
                         <div className="w-full sm:w-32 h-40 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                             <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1">
                             <div className="flex justify-between items-start">
                                 <div>
                                     <Link to={`/product/${item.id}`} className="font-serif text-xl hover:text-terracotta transition-colors">{item.name}</Link>
                                     <p className="text-text-muted text-sm mt-1">{item.collection}</p>
                                 </div>
                                 <button onClick={() => toggleWishlist(item.id)} className="text-gray-400 hover:text-error">
                                     <Trash2 size={20} />
                                 </button>
                             </div>
                             
                             <div className="mt-4 flex items-baseline gap-2">
                                 <span className="text-lg font-medium">₹{item.price.toLocaleString('en-IN')}</span>
                                 {!item.inStock && <span className="text-xs font-bold text-error bg-error/10 px-2 py-1 rounded">Out of Stock</span>}
                             </div>

                             {/* Alert Preferences */}
                             <div className="mt-6 pt-4 border-t border-gray-100">
                                 <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Notify me when:</p>
                                 <div className="flex flex-wrap gap-4">
                                     <label className="flex items-center gap-2 cursor-pointer">
                                         <input 
                                            type="checkbox" 
                                            checked={item.preferences.priceDrop}
                                            onChange={(e) => updateWishlistPreferences(item.id, { priceDrop: e.target.checked })}
                                            className="accent-terracotta"
                                         />
                                         <span className="text-sm">Price Drops</span>
                                     </label>
                                     <label className="flex items-center gap-2 cursor-pointer">
                                         <input 
                                            type="checkbox" 
                                            checked={item.preferences.backInStock}
                                            onChange={(e) => updateWishlistPreferences(item.id, { backInStock: e.target.checked })}
                                            className="accent-terracotta"
                                         />
                                         <span className="text-sm">Back in Stock</span>
                                     </label>
                                 </div>
                             </div>
                         </div>
                    </div>
                ))}
            </div>

            {/* Recommendations / Summary */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="font-serif text-lg mb-4">Summary</h3>
                    <p className="text-sm text-text-muted mb-6">
                        You have {watchedProducts.length} items saved. Enable notifications to never miss a deal.
                    </p>
                    <div className="bg-teal/5 border border-teal/10 rounded-lg p-4 flex items-start gap-3">
                        <BellRing size={20} className="text-teal mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-teal-900">Notifications Active</p>
                            <p className="text-xs text-teal-700 mt-1">We will email you at user@example.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Watchlist;