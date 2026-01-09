import React from 'react';
import { X, Minus, Plus, Trash2, ArrowRight, PenTool } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { useRouter } from 'next/navigation';
import Button from './Button';
import { FREE_SHIPPING_THRESHOLD } from '../constants';

const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateQuantity,
    removeFromCart,
    cartTotal,
    shippingDiff,
    openBespokeModal,
  } = useShop();
  const { user } = useAuth();
  const router = useRouter();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);

    if (!user) {
      router.push('/login?redirect=/cart');
      return;
    }

    router.push('/cart'); // Navigate to full cart/checkout flow
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-up md:animate-none md:transition-transform">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-serif text-xl">Your Bag ({cart.length})</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="p-4 bg-cream border-b border-gray-100">
          {shippingDiff > 0 ? (
            <p className="text-sm text-center text-text-muted">
              You are{' '}
              <span className="font-bold text-terracotta">
                ₹{shippingDiff.toLocaleString('en-IN')}
              </span>{' '}
              away from free shipping.
            </p>
          ) : (
            <p className="text-sm text-center text-success font-medium">
              You&apos;ve unlocked free shipping!
            </p>
          )}
          <div className="w-full bg-gray-200 h-1.5 mt-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-terracotta transition-all duration-500"
              style={{
                width: `${Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ShoppingBagIcon className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-text-muted">Your bag is empty.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setIsCartOpen(false);
                  router.push('/shop');
                }}
              >
                Start Shopping
              </Button>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  openBespokeModal('Cart Drawer Empty');
                }}
                className="mt-6 text-sm font-medium text-terracotta hover:underline flex items-center gap-2"
              >
                <PenTool size={14} /> Create a Custom Rug
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize}`}
                className="flex gap-4"
              >
                <div className="w-20 h-24 bg-gray-100 rounded-md overflow-hidden shrink-0">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-text-body">{item.name}</h3>
                    <button
                      onClick={() => removeFromCart(item.id, item.selectedSize)}
                      className="text-gray-400 hover:text-error"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-text-muted">
                    {item.selectedSize} | {item.material}
                  </p>
                  <p className="text-sm font-medium mt-1">
                    ₹{item.price.toLocaleString('en-IN')}
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.selectedSize,
                          item.quantity - 1
                        )
                      }
                      className="p-1 rounded hover:bg-gray-100 border border-gray-200"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-medium w-4 text-center">
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
                      className="p-1 rounded hover:bg-gray-100 border border-gray-200"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-text-muted">Subtotal</span>
              <span className="text-xl font-medium">
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4 text-center">
              Shipping & taxes calculated at checkout.
            </p>
            <Button
              onClick={handleCheckout}
              fullWidth
              size="lg"
              className="flex items-center justify-between group"
            >
              <span>Checkout</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Button>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  openBespokeModal('Cart Drawer Footer');
                }}
                className="w-full text-xs font-medium text-text-muted hover:text-terracotta flex items-center justify-center gap-2 py-2"
              >
                <PenTool size={12} /> Need a custom size? Request Bespoke
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for empty state icon
const ShoppingBagIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

export default CartDrawer;
