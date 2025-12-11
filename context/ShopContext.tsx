import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, WatchlistItem, BespokeRequest } from '../types';
import { FREE_SHIPPING_THRESHOLD } from '../constants';

interface ShopContextType {
  cart: CartItem[];
  wishlist: WatchlistItem[]; 
  orders: Order[];
  bespokeRequests: BespokeRequest[];
  
  addToCart: (product: Product, selectedSize: string, quantity: number) => void;
  removeFromCart: (productId: string, selectedSize: string) => void;
  updateQuantity: (productId: string, selectedSize: string, quantity: number) => void;
  
  // New Watchlist methods
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  updateWishlistPreferences: (productId: string, prefs: Partial<WatchlistItem['preferences']>) => void;
  
  clearCart: () => void;
  placeOrder: (order: Order) => void;
  submitBespokeRequest: (request: BespokeRequest) => void;

  cartTotal: number;
  cartCount: number;
  shippingDiff: number;
  
  // UI States
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  
  isBespokeOpen: boolean;
  openBespokeModal: (source?: string) => void;
  closeBespokeModal: () => void;
  bespokeSource: string; // Tracks where the user clicked "Bespoke"

  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  notify: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WatchlistItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bespokeRequests, setBespokeRequests] = useState<BespokeRequest[]>([]);
  
  // UI State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBespokeOpen, setIsBespokeOpen] = useState(false);
  const [bespokeSource, setBespokeSource] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const addToCart = (product: Product, selectedSize: string, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.selectedSize === selectedSize);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, selectedSize, quantity }];
    });
    setIsCartOpen(true);
    notify(`Added ${product.name} to cart`, 'success');
  };

  const removeFromCart = (productId: string, selectedSize: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === productId && item.selectedSize === selectedSize)));
  };

  const updateQuantity = (productId: string, selectedSize: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId && item.selectedSize === selectedSize ? { ...item, quantity } : item
      )
    );
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.productId === productId);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.some(item => item.productId === productId)) {
        notify('Removed from watchlist', 'info');
        return prev.filter((item) => item.productId !== productId);
      }
      notify('Added to watchlist', 'success');
      return [...prev, {
        productId,
        addedAt: new Date().toISOString(),
        preferences: { priceDrop: true, backInStock: true, onSale: true }
      }];
    });
  };

  const updateWishlistPreferences = (productId: string, prefs: Partial<WatchlistItem['preferences']>) => {
    setWishlist(prev => prev.map(item => {
      if (item.productId === productId) {
        return { ...item, preferences: { ...item.preferences, ...prefs } };
      }
      return item;
    }));
    notify('Alert preferences updated', 'success');
  };

  const clearCart = () => setCart([]);

  const placeOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    clearCart();
  };

  const submitBespokeRequest = (request: BespokeRequest) => {
    setBespokeRequests(prev => [request, ...prev]);
  };

  const openBespokeModal = (source: string = 'General') => {
    setBespokeSource(source);
    setIsBespokeOpen(true);
  };

  const closeBespokeModal = () => {
    setIsBespokeOpen(false);
    setBespokeSource('');
  };

  const notify = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const shippingDiff = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        orders,
        bespokeRequests,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        isInWishlist,
        updateWishlistPreferences,
        clearCart,
        placeOrder,
        submitBespokeRequest,
        cartTotal,
        cartCount,
        shippingDiff,
        isCartOpen,
        setIsCartOpen,
        isBespokeOpen,
        openBespokeModal,
        closeBespokeModal,
        bespokeSource,
        notify,
        notification,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};