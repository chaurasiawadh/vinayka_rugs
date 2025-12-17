
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, WatchlistItem, BespokeRequest } from '../types';
import { FREE_SHIPPING_THRESHOLD } from '../constants';
import { useProducts } from '../hooks/useFirestore';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc, deleteDoc, collection, onSnapshot, serverTimestamp } from 'firebase/firestore';

interface ShopContextType {
  products: Product[]; 
  loading: boolean;
  cart: CartItem[];
  wishlist: WatchlistItem[]; 
  orders: Order[];
  bespokeRequests: BespokeRequest[];
  
  addToCart: (product: Product, selectedSize: string, quantity: number) => void;
  removeFromCart: (productId: string, selectedSize: string) => void;
  updateQuantity: (productId: string, selectedSize: string, quantity: number) => void;
  
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  updateWishlistPreferences: (productId: string, prefs: Partial<WatchlistItem['preferences']>) => void;
  
  clearCart: () => void;
  placeOrder: (order: Order) => void;
  submitBespokeRequest: (request: BespokeRequest) => void;

  cartTotal: number;
  cartCount: number;
  shippingDiff: number;
  
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  
  isBespokeOpen: boolean;
  openBespokeModal: (source?: string) => void;
  closeBespokeModal: () => void;
  bespokeSource: string;

  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;

  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  notify: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { products, loading } = useProducts(); 
  const { user } = useAuth(); // Integrate Auth
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WatchlistItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bespokeRequests, setBespokeRequests] = useState<BespokeRequest[]>([]);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBespokeOpen, setIsBespokeOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [bespokeSource, setBespokeSource] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Firestore Real-time Watchlist Listener
  useEffect(() => {
    if (!user) {
      setWishlist([]); // Clear wishlist if logged out
      return;
    }

    const watchlistRef = collection(db, 'users', user.uid, 'watchlist');
    const unsubscribe = onSnapshot(watchlistRef, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        productId: doc.id,
        ...doc.data()
      })) as WatchlistItem[];
      setWishlist(items);
    }, (error) => {
      console.error("Error fetching watchlist:", error);
    });

    return () => unsubscribe();
  }, [user]);

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

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    const isAdded = isInWishlist(productId);
    const itemRef = doc(db, 'users', user.uid, 'watchlist', productId);

    try {
      if (isAdded) {
        await deleteDoc(itemRef);
        notify('Removed from watchlist', 'info');
      } else {
        await setDoc(itemRef, {
          productId,
          addedAt: serverTimestamp(),
          preferences: { priceDrop: true, backInStock: true, onSale: true }
        });
        notify('Added to watchlist', 'success');
      }
    } catch (error) {
      console.error("Error updating watchlist:", error);
      notify('Failed to update watchlist', 'error');
    }
  };

  const updateWishlistPreferences = async (productId: string, prefs: Partial<WatchlistItem['preferences']>) => {
    if (!user) return;
    try {
      const itemRef = doc(db, 'users', user.uid, 'watchlist', productId);
      // We need to merge, but setDoc with merge is safer if doc doesn't exist (though it should)
      // Since we are updating specific fields inside a map 'preferences', we need dot notation for updateDoc
      // But simplifying here by updating local state optimistic or waiting for snapshot. 
      // Let's rely on setDoc merge.
      const currentItem = wishlist.find(i => i.productId === productId);
      if(currentItem) {
          await setDoc(itemRef, {
              preferences: { ...currentItem.preferences, ...prefs }
          }, { merge: true });
          notify('Alert preferences updated', 'success');
      }
    } catch (error) {
        notify('Could not update preferences', 'error');
    }
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

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

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
        products,
        loading,
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
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
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
