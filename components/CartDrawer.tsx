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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer — slides in from right on all screen sizes */}
      <div className="relative w-full max-w-[400px] bg-white h-full shadow-drawer flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-serif text-xl font-medium">
            Your Bag
            <span className="ml-2 text-sm font-normal text-text-muted">
              ({cart.length})
            </span>
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            <X size={20} strokeWidth={1.5} />
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
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-5">
                <ShoppingBagIcon className="w-7 h-7 text-gray-300" />
              </div>
              <h3 className="font-serif text-lg text-gray-700 mb-1">
                Your bag is empty
              </h3>
              <p className="text-sm text-text-muted mb-6 max-w-[200px]">
                Discover our handcrafted rug collection
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setIsCartOpen(false);
                  router.push('/shop');
                }}
              >
                Browse Collection
              </Button>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  openBespokeModal('Cart Drawer Empty');
                }}
                className="mt-5 text-xs font-semibold text-terracotta hover:underline flex items-center gap-1.5 transition-colors"
              >
                <PenTool size={13} /> Create a Custom Rug
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize}`}
                className="flex gap-3.5 pb-5 border-b border-gray-50 last:border-0 last:pb-0"
              >
                <div className="w-[72px] h-[84px] bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-medium text-sm text-text-body leading-snug line-clamp-2">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.id, item.selectedSize)}
                      aria-label="Remove item"
                      className="p-1 text-gray-300 hover:text-error rounded transition-colors flex-shrink-0 active:scale-90"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    {item.selectedSize}
                    {item.material ? ` · ${item.material}` : ''}
                  </p>
                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => {
                          if (item.quantity === 1) {
                            removeFromCart(item.id, item.selectedSize);
                          } else {
                            updateQuantity(
                              item.id,
                              item.selectedSize,
                              item.quantity - 1
                            );
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors active:bg-gray-100"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="text-sm font-semibold w-7 text-center">
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
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors active:bg-gray-100"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-text-body">
                      ₹
                      {(Number(item.price) * item.quantity).toLocaleString(
                        'en-IN'
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 bg-white space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-muted">Subtotal</span>
              <span className="text-lg font-semibold text-text-body">
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 text-center">
              Shipping &amp; taxes calculated at checkout
            </p>
            <Button
              onClick={handleCheckout}
              fullWidth
              size="lg"
              className="flex items-center justify-between group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight
                size={17}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Button>
            <button
              onClick={() => {
                setIsCartOpen(false);
                openBespokeModal('Cart Drawer Footer');
              }}
              className="w-full text-xs font-medium text-text-muted hover:text-terracotta flex items-center justify-center gap-1.5 py-1.5 transition-colors"
            >
              <PenTool size={12} /> Need a custom size? Request Bespoke
            </button>
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
