import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft, PenTool } from 'lucide-react';
import Button from '../components/Button';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '../constants';

const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, shippingDiff, placeOrder, openBespokeModal } = useShop();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment'>('cart');
  const [loading, setLoading] = useState(false);

  // Mock Form State
  const [address, setAddress] = useState({ fullName: '', line1: '', city: '', pincode: '', phone: '' });

  const handleApplyCoupon = () => {
    if (couponCode === 'WELCOME10') {
      setDiscount(cartTotal * 0.1);
    } else {
      alert('Invalid coupon');
    }
  };

  const isFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD;
  const finalShipping = isFreeShipping ? 0 : SHIPPING_COST;
  const finalTotal = cartTotal + finalShipping - discount;

  const handlePayment = async () => {
    setLoading(true);
    // Simulate Stripe API call
    setTimeout(() => {
        setLoading(false);
        const order = {
            id: 'ORD-' + Math.floor(Math.random() * 10000),
            items: cart,
            total: finalTotal,
            status: 'confirmed' as const,
            date: new Date().toISOString(),
            shippingAddress: { ...address, state: '' }
        };
        placeOrder(order);
        alert('Order Placed Successfully! Mock Payment Processed.');
        navigate('/'); // Redirect home or to success page
    }, 2000);
  };

  if (cart.length === 0 && step === 'cart') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif mb-4">Your bag is empty</h2>
        <Link to="/shop"><Button>Continue Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Stepper */}
        <div className="flex items-center justify-center mb-12 text-sm font-medium">
           <span className={`${step === 'cart' ? 'text-terracotta' : 'text-gray-500'}`}>Bag</span>
           <span className="mx-4 text-gray-300">/</span>
           <span className={`${step === 'shipping' ? 'text-terracotta' : 'text-gray-500'}`}>Shipping</span>
           <span className="mx-4 text-gray-300">/</span>
           <span className={`${step === 'payment' ? 'text-terracotta' : 'text-gray-500'}`}>Payment</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {step === 'cart' && (
              <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-in">
                 <h2 className="font-serif text-2xl mb-6">Shopping Bag</h2>
                 <div className="space-y-6">
                    {cart.map(item => (
                       <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 border-b border-gray-100 pb-6 last:border-0">
                          <img src={item.images[0]} alt={item.name} className="w-24 h-32 object-cover rounded-md" />
                          <div className="flex-1">
                             <div className="flex justify-between">
                                <h3 className="font-medium text-lg">{item.name}</h3>
                                <button onClick={() => removeFromCart(item.id, item.selectedSize)} className="text-gray-400 hover:text-error"><Trash2 size={18} /></button>
                             </div>
                             <p className="text-text-muted text-sm">{item.selectedSize}</p>
                             <div className="flex justify-between items-end mt-4">
                                <div className="flex items-center border rounded-lg">
                                   <button onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)} className="p-2 hover:bg-gray-50"><Minus size={14} /></button>
                                   <span className="w-8 text-center text-sm">{item.quantity}</span>
                                   <button onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)} className="p-2 hover:bg-gray-50"><Plus size={14} /></button>
                                </div>
                                <span className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
            )}

            {step === 'shipping' && (
               <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-in">
                  <h2 className="font-serif text-2xl mb-6">Shipping Address</h2>
                  <form className="grid grid-cols-1 gap-6">
                     <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input 
                           type="text" 
                           value={address.fullName}
                           onChange={e => setAddress({...address, fullName: e.target.value})}
                           className="w-full border border-gray-300 rounded-lg p-3 focus:ring-terracotta focus:border-terracotta"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">Address Line 1</label>
                        <input 
                           type="text" 
                           value={address.line1}
                           onChange={e => setAddress({...address, line1: e.target.value})}
                           className="w-full border border-gray-300 rounded-lg p-3"
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">City</label>
                            <input 
                              type="text" 
                              value={address.city}
                              onChange={e => setAddress({...address, city: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg p-3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Pincode</label>
                            <input 
                              type="text" 
                              value={address.pincode}
                              onChange={e => setAddress({...address, pincode: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg p-3"
                            />
                        </div>
                     </div>
                  </form>
               </div>
            )}

            {step === 'payment' && (
               <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-in">
                  <h2 className="font-serif text-2xl mb-6">Payment</h2>
                  <div className="space-y-4">
                     <div className="p-4 border border-terracotta bg-cream/30 rounded-lg flex justify-between items-center cursor-pointer">
                        <span className="font-medium">Credit / Debit Card (Stripe Test)</span>
                        <div className="h-4 w-4 rounded-full bg-terracotta"></div>
                     </div>
                     <div className="p-4 border border-gray-200 rounded-lg flex justify-between items-center opacity-50 cursor-not-allowed">
                        <span className="font-medium">UPI / Netbanking</span>
                        <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                     </div>
                     <div className="p-4 border border-gray-200 rounded-lg flex justify-between items-center opacity-50 cursor-not-allowed">
                         <span className="font-medium">Cash on Delivery</span>
                         <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                     </div>
                  </div>
               </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h3 className="font-serif text-lg mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm border-b border-gray-100 pb-4 mb-4">
                   <div className="flex justify-between">
                      <span className="text-text-muted">Subtotal</span>
                      <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-text-muted">Shipping</span>
                      <span>{isFreeShipping ? 'Free' : `₹${SHIPPING_COST}`}</span>
                   </div>
                   {discount > 0 && (
                      <div className="flex justify-between text-success">
                         <span>Discount</span>
                         <span>- ₹{discount.toLocaleString('en-IN')}</span>
                      </div>
                   )}
                </div>
                
                {/* Coupon */}
                {step === 'cart' && (
                   <div className="flex gap-2 mb-6">
                      <input 
                        type="text" 
                        placeholder="Coupon Code" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase"
                      />
                      <Button onClick={handleApplyCoupon} variant="outline" size="sm">Apply</Button>
                   </div>
                )}

                <div className="flex justify-between font-medium text-lg mb-6">
                   <span>Total</span>
                   <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>

                {shippingDiff > 0 && (
                   <div className="bg-cream p-3 rounded text-xs text-center mb-6">
                      Add <span className="font-bold">₹{shippingDiff.toLocaleString('en-IN')}</span> more for free shipping.
                   </div>
                )}

                <div className="space-y-3">
                   {step === 'cart' && (
                     <Button fullWidth size="lg" onClick={() => setStep('shipping')}>Proceed to Checkout</Button>
                   )}
                   {step === 'shipping' && (
                     <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setStep('cart')}><ArrowLeft size={18} /></Button>
                        <Button fullWidth size="lg" onClick={() => setStep('payment')}>Continue to Payment</Button>
                     </div>
                   )}
                   {step === 'payment' && (
                     <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setStep('shipping')}><ArrowLeft size={18} /></Button>
                        <Button fullWidth size="lg" onClick={handlePayment} disabled={loading}>
                            {loading ? 'Processing...' : `Pay ₹${finalTotal.toLocaleString('en-IN')}`}
                        </Button>
                     </div>
                   )}
                </div>
             </div>

             {/* Bespoke Services Promo */}
             <div className="bg-teal text-white rounded-xl p-6 mt-6 shadow-sm sticky top-[500px]">
                <div className="flex items-start gap-3">
                    <PenTool size={24} className="mt-1 text-amber" />
                    <div>
                        <h3 className="font-serif text-lg mb-2">Go Bespoke</h3>
                        <p className="text-sm text-white/80 mb-4 leading-relaxed">
                            Need a specific size or color match? Create your own masterpiece with our design team.
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-white text-white hover:bg-white hover:text-teal w-full"
                            onClick={() => openBespokeModal('Cart Sidebar')}
                        >
                            Start Custom Request
                        </Button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;