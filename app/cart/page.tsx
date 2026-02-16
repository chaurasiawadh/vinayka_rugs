'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Minus, Plus, Trash2, ArrowLeft, Check } from 'lucide-react';
import { Suspense } from 'react';

import Button from '@/components/Button';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import { Address } from '@/types';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader } from 'lucide-react';
import Script from 'next/script';

const CartContent: React.FC = () => {
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get('buyNow') === 'true';

  const {
    cart,
    directPurchaseItem,
    updateQuantity,
    removeFromCart,
    placeOrder,
  } = useShop();

  const displayItems =
    isBuyNow && directPurchaseItem ? [directPurchaseItem] : cart;

  const displaySubtotal = displayItems.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  const displayShippingDiff = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - displaySubtotal
  );

  const { user, userProfile } = useAuth();

  const router = useRouter();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment'>('cart');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>(
    'razorpay'
  );

  // Address Selection State
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [saveToAccount, setSaveToAccount] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  // Form State for new address
  const [address, setAddress] = useState<Address>({
    id: '',
    fullName: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });

  // Load last used address or default
  React.useEffect(() => {
    if (userProfile?.addresses && userProfile.addresses.length > 0) {
      const lastUsed = userProfile.lastUsedAddressId
        ? userProfile.addresses.find(
            (a) => a.id === userProfile.lastUsedAddressId
          )
        : userProfile.addresses[0];

      if (lastUsed) {
        setSelectedAddressId(lastUsed.id);
        setAddress(lastUsed);
      }
    }
  }, [userProfile]);

  const handleSaveNewAddress = async () => {
    if (!user || !userProfile) return;
    if (
      !address.fullName ||
      !address.line1 ||
      !address.city ||
      !address.pincode ||
      !address.phone
    ) {
      alert('Please fill in all required address fields.');
      return;
    }

    setSavingAddress(true);
    try {
      const newAddressWithId = {
        ...address,
        id: Math.random().toString(36).substr(2, 9),
      };

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        addresses: arrayUnion(newAddressWithId),
        lastUsedAddressId: newAddressWithId.id,
      });

      setSelectedAddressId(newAddressWithId.id);
      setAddress(newAddressWithId);
      setSaveToAccount(false);
    } catch (error) {
      alert('Failed to save address.');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode === 'WELCOME10') {
      setDiscount(displaySubtotal * 0.1);
    } else {
      alert('Invalid coupon');
    }
  };

  const isFreeShipping = displaySubtotal >= FREE_SHIPPING_THRESHOLD;
  const finalShipping = isFreeShipping ? 0 : SHIPPING_COST;
  const finalTotal = displaySubtotal + finalShipping - discount;

  const handlePayment = async () => {
    setLoading(true);

    try {
      // If user is logged in, handle address saving and tracking
      if (user && userProfile) {
        const userRef = doc(db, 'users', user.uid);
        const updates: any = {
          lastUsedAddressId:
            selectedAddressId === 'new' ? '' : selectedAddressId,
        };

        if (selectedAddressId === 'new' && saveToAccount) {
          const newAddressWithId = {
            ...address,
            id: Math.random().toString(36).substr(2, 9),
          };
          updates.addresses = [
            ...(userProfile.addresses || []),
            newAddressWithId,
          ];
          updates.lastUsedAddressId = newAddressWithId.id;
        }

        await updateDoc(userRef, updates);
      }

      if (paymentMethod === 'cod') {
        // Handle Cash on Delivery
        const orderData = {
          id: 'ORD-' + Math.floor(Math.random() * 1000000),
          items: displayItems,
          total: finalTotal,
          status: 'placed' as const,
          date: new Date().toISOString(),
          shippingAddress: address,
          paymentMethod: 'COD',
          paymentId: 'PENDING',
        };

        const placedOrder = await placeOrder(orderData, isBuyNow);

        if (placedOrder) {
          setLoading(false);
          router.push(`/order-success?orderId=${placedOrder.id}`);
        } else {
          setLoading(false);
          alert('Order placement failed. Please contact support.');
        }
        return;
      }

      // Create Razorpay Order on Server
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalTotal,
          currency: 'INR',
          receipt: 'order_rcptid_' + Date.now(),
        }),
      });

      const order = await res.json();

      if (!order.id) {
        throw new Error('Server error: Could not create order');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Vinayka Rugs',
        description: 'Payment for your order',
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.status === 'success') {
              const orderData = {
                id: order.id,
                items: displayItems,
                total: finalTotal,
                status: 'placed' as const,
                date: new Date().toISOString(),
                shippingAddress: address,
                paymentId: response.razorpay_payment_id,
                paymentMethod: 'Razorpay',
              };

              const placedOrder = await placeOrder(orderData, isBuyNow);

              if (placedOrder) {
                setLoading(false);
                router.push(`/order-success?orderId=${placedOrder.id}`);
              } else {
                setLoading(false);
                alert(
                  'Order placement failed locally but payment was successful. Please contact support.'
                );
              }
            } else {
              alert('Payment verification failed');
              setLoading(false);
            }
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Verification Error:', err);
            alert('Payment verification error');
            setLoading(false);
          }
        },
        prefill: {
          name: address.fullName,
          email: user?.email || 'customer@example.com',
          contact: address.phone,
        },
        theme: {
          color: '#D2691E',
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Payment Error:', error);
      alert('Error processing payment. Please try again.');
      setLoading(false);
    }
  };

  if (displayItems.length === 0 && step === 'cart') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif mb-4">Your bag is empty</h2>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-12">
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stepper */}
        <div className="flex items-center justify-center mb-12 text-sm font-medium">
          <span
            className={`${step === 'cart' ? 'text-terracotta' : 'text-gray-500'}`}
          >
            Bag
          </span>
          <span className="mx-4 text-gray-300">/</span>
          <span
            className={`${step === 'shipping' ? 'text-terracotta' : 'text-gray-500'}`}
          >
            Shipping
          </span>
          <span className="mx-4 text-gray-300">/</span>
          <span
            className={`${step === 'payment' ? 'text-terracotta' : 'text-gray-500'}`}
          >
            Payment
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {step === 'cart' && (
              <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-in">
                <h2 className="font-serif text-2xl mb-6">
                  {isBuyNow ? 'Checkout' : 'Shopping Bag'}
                </h2>
                <div className="space-y-6">
                  {displayItems.map((item) => (
                    <div
                      key={`${item.id}-${item.selectedSize}`}
                      className="flex gap-4 border-b border-gray-100 pb-6 last:border-0"
                    >
                      <img
                        src={item.images?.[0] || '/placeholder-rug.jpg'}
                        alt={item.name}
                        className="w-24 h-32 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-lg">{item.name}</h3>
                          <button
                            onClick={() =>
                              removeFromCart(item.id, item.selectedSize)
                            }
                            className="text-gray-400 hover:text-error"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <p className="text-text-muted text-sm">
                          {item.selectedSize}
                        </p>
                        <div className="flex justify-between items-end mt-4">
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.selectedSize,
                                  item.quantity - 1
                                )
                              }
                              className="p-2 hover:bg-gray-50"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.selectedSize,
                                  item.quantity + 1
                                )
                              }
                              className="p-2 hover:bg-gray-50"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="font-medium">
                            ₹
                            {(
                              Number(item.price) * item.quantity
                            ).toLocaleString('en-IN')}
                          </span>
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

                {userProfile?.addresses && userProfile.addresses.length > 0 && (
                  <div className="mb-8 border-b border-gray-100 pb-8">
                    <h3 className="text-sm font-bold uppercase text-gray-400 mb-4 tracking-wider">
                      Select Saved Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userProfile.addresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => {
                            setSelectedAddressId(addr.id);
                            setAddress(addr);
                          }}
                          className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                            selectedAddressId === addr.id
                              ? 'border-terracotta bg-cream/20'
                              : 'border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          {selectedAddressId === addr.id && (
                            <div className="absolute top-2 right-2 text-terracotta">
                              <Check size={18} />
                            </div>
                          )}
                          <p className="font-bold text-sm">{addr.fullName}</p>
                          <p className="text-xs text-text-muted mt-1">
                            {addr.line1}
                            {addr.line2 ? `, ${addr.line2}` : ''}
                          </p>
                          <p className="text-xs text-text-muted">
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>
                      ))}
                      <div
                        onClick={() => {
                          setSelectedAddressId('new');
                          setAddress({
                            id: '',
                            fullName: '',
                            line1: '',
                            line2: '',
                            city: '',
                            state: '',
                            pincode: '',
                            phone: '',
                          });
                        }}
                        className={`p-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 cursor-pointer transition-all ${
                          selectedAddressId === 'new'
                            ? 'border-terracotta bg-cream/20'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Plus
                          size={18}
                          className={
                            selectedAddressId === 'new'
                              ? 'text-terracotta'
                              : 'text-gray-400'
                          }
                        />
                        <span
                          className={`text-sm font-medium ${selectedAddressId === 'new' ? 'text-terracotta' : 'text-gray-500'}`}
                        >
                          Add New Address
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {(selectedAddressId === 'new' || !user) && (
                  <form className="grid grid-cols-1 gap-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={address.fullName}
                          onChange={(e) =>
                            setAddress({ ...address, fullName: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={address.phone}
                          onChange={(e) =>
                            setAddress({ ...address, phone: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        value={address.line1}
                        onChange={(e) =>
                          setAddress({ ...address, line1: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        value={address.line2 || ''}
                        onChange={(e) =>
                          setAddress({ ...address, line2: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={address.city}
                          onChange={(e) =>
                            setAddress({ ...address, city: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          value={address.state}
                          onChange={(e) =>
                            setAddress({ ...address, state: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                          Pincode
                        </label>
                        <input
                          type="text"
                          value={address.pincode}
                          onChange={(e) =>
                            setAddress({ ...address, pincode: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-1 focus:ring-terracotta focus:border-terracotta outline-none"
                        />
                      </div>
                    </div>

                    {user && (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 py-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="saveAddress"
                            checked={saveToAccount}
                            onChange={(e) => setSaveToAccount(e.target.checked)}
                            className="h-4 w-4 text-terracotta border-gray-300 rounded"
                          />
                          <label
                            htmlFor="saveAddress"
                            className="text-sm text-gray-600 cursor-pointer"
                          >
                            Save this address to my account
                          </label>
                        </div>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={handleSaveNewAddress}
                          disabled={savingAddress}
                          className="!py-2"
                        >
                          {savingAddress ? (
                            <Loader size={16} className="animate-spin" />
                          ) : (
                            'Save Address'
                          )}
                        </Button>
                      </div>
                    )}
                  </form>
                )}
              </div>
            )}

            {step === 'payment' && (
              <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-in">
                <h2 className="font-serif text-2xl mb-6">Payment</h2>
                <div className="space-y-4">
                  <div
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`p-4 border rounded-lg flex justify-between items-center cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-terracotta bg-cream/30' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <span className="font-medium">
                      Pay with Razorpay (Cards, UPI, NetBanking)
                    </span>
                    <div
                      className={`h-4 w-4 rounded-full border ${paymentMethod === 'razorpay' ? 'bg-terracotta border-terracotta' : 'border-gray-300'}`}
                    ></div>
                  </div>
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 border rounded-lg flex justify-between items-center cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-terracotta bg-cream/30' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <span className="font-medium">Cash on Delivery</span>
                    <div
                      className={`h-4 w-4 rounded-full border ${paymentMethod === 'cod' ? 'bg-terracotta border-terracotta' : 'border-gray-300'}`}
                    ></div>
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
                  <span>₹{displaySubtotal.toLocaleString('en-IN')}</span>
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
                  <Button
                    onClick={handleApplyCoupon}
                    variant="outline"
                    size="sm"
                  >
                    Apply
                  </Button>
                </div>
              )}

              <div className="flex justify-between font-medium text-lg mb-6">
                <span>Total</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>

              {displayShippingDiff > 0 && (
                <div className="bg-cream p-3 rounded text-xs text-center mb-6">
                  Add{' '}
                  <span className="font-bold">
                    ₹{displayShippingDiff.toLocaleString('en-IN')}
                  </span>{' '}
                  more for free shipping.
                </div>
              )}

              <div className="space-y-3">
                {step === 'cart' && (
                  <Button
                    fullWidth
                    size="lg"
                    onClick={() => setStep('shipping')}
                  >
                    Proceed to Checkout
                  </Button>
                )}
                {step === 'shipping' && (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep('cart')}>
                      <ArrowLeft size={18} />
                    </Button>
                    <Button
                      fullWidth
                      size="lg"
                      onClick={() => setStep('payment')}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                )}
                {step === 'payment' && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setStep('shipping')}
                    >
                      <ArrowLeft size={18} />
                    </Button>
                    <Button
                      fullWidth
                      size="lg"
                      onClick={handlePayment}
                      disabled={loading}
                    >
                      {loading
                        ? 'Processing...'
                        : paymentMethod === 'cod'
                          ? 'Place Order'
                          : `Pay ₹${finalTotal.toLocaleString('en-IN')}`}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Bespoke Services Promo */}
            {/* <div className="bg-teal text-white rounded-xl p-6 mt-6 shadow-sm sticky top-[500px]">
                            <div className="flex items-start gap-3">
                                <PenTool size={24} className="mt-1 text-amber" />
                                <div>
                                    <h3 className="font-serif text-lg mb-2">Go Bespoke</h3>
                                    <p className="text-sm text-white/80 mb-4 leading-relaxed">
                                        Need a specific size or color match? Create your own
                                        masterpiece with our design team.
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-white text-white !hover:bg-white !hover:text-teal w-full"
                                        onClick={() => openBespokeModal('Cart Sidebar')}
                                    >
                                        Start Custom Request
                                    </Button>
                                </div>
                            </div>
                        </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const Cart: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-cream">
          <Loader className="animate-spin text-terracotta" size={48} />
        </div>
      }
    >
      <CartContent />
    </Suspense>
  );
};

export default Cart;
