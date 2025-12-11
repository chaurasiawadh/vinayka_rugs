import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order } from '../types';
import { FREE_SHIPPING_THRESHOLD } from '../constants';

interface ShopContextType {
  cart: CartItem[];
  wishlist: string[]; // Product IDs
  addToCart: (product: Product, selectedSize: string, quantity: number) => void;
  removeFromCart: (productId: string, selectedSize: string) => void;
  updateQuantity: (productId: string, selectedSize: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  shippingDiff: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  notify: (message: string, type?: 'success' | 'error') => void;
  notification: { message: string; type: 'success' | 'error' } | null;
  orders: Order[];
  placeOrder: (order: Order) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

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

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        notify('Removed from wishlist', 'success');
        return prev.filter((id) => id !== productId);
      }
      notify('Added to wishlist', 'success');
      return [...prev, productId];
    });
  };

  const clearCart = () => setCart([]);

  const placeOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    clearCart();
  };

  const notify = (message: string, type: 'success' | 'error' = 'success') => {
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
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        clearCart,
        cartTotal,
        cartCount,
        shippingDiff,
        isCartOpen,
        setIsCartOpen,
        notify,
        notification,
        orders,
        placeOrder
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