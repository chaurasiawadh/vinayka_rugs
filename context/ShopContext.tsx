
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, WatchlistItem, BespokeRequest } from '../types';
import { FREE_SHIPPING_THRESHOLD } from '../constants';
import { useProducts } from '../hooks/useFirestore';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc, deleteDoc, collection, onSnapshot, serverTimestamp, getDocs, writeBatch, getDoc } from 'firebase/firestore';

// Helper to merge local and remote carts
const mergeCarts = (local: CartItem[], remote: CartItem[]) => {
  const merged = [...remote];
  local.forEach(lItem => {
    const existingIndex = merged.findIndex(rItem => rItem.id === lItem.id && rItem.selectedSize === lItem.selectedSize);
    if (existingIndex > -1) {
      // If item exists, keep the max quantity or add? Let's add them for safety, but cap at some reasonable limit if needed.
      // For now, let's just use the local quantity effectively overruling or adding. 
      // User intent: "I just added this". 
      // Strategy: Add quantities.
      merged[existingIndex].quantity += lItem.quantity;
    } else {
      merged.push(lItem);
    }
  });
  return merged;
};

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

  // Track previous auth state to detect logout
  const [previousUid, setPreviousUid] = useState<string | null>(null);

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

  // Load Cart from LocalStorage on Mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('vinayka_cart');
      if (stored) {
        try {
          setCart(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse cart from local storage");
        }
      }
    }
  }, []);

  // Sync Cart: Local -> Remote on Login, Remote -> Local on Logout/Update
  useEffect(() => {
    // Detect Logout
    if (!user && previousUid) {
      setCart([]); // Clear cart immediately on logout/session end
      localStorage.removeItem('vinayka_cart'); // Ensure clean
    }
    setPreviousUid(user?.uid || null);

    if (!user) {
      // Logic handled in 'Mount' effect for initial load.
      // And we handle manual LS writes in actions.
      return;
    }

    const syncUserCart = async () => {
      // 1. Get current local cart (which might have items added before login)
      const localItems = JSON.parse(localStorage.getItem('vinayka_cart') || '[]');

      // 2. Clear LS to avoid double merging next time if we don't clear
      // Actually, let's wait until we successfully merged.

      if (localItems.length > 0) {
        // Fetch Remote
        const cartRef = collection(db, 'users', user.uid, 'cart');
        const snapshot = await getDocs(cartRef);
        const remoteItems = snapshot.docs.map(d => d.data() as CartItem);

        // Merge
        const merged = mergeCarts(localItems, remoteItems);

        // Update Firestore with Merged
        const batch = writeBatch(db);

        // Delete all existing first? Or just overwrite?
        // Safer to overwrite logic: just set each item. 
        // NOTE: If an item was in remote but NOT in merged (removed locally?), our merge logic keeps remote items so they strictly add.

        for (const item of merged) {
          const docId = `${item.id}_${item.selectedSize}`;
          const ref = doc(db, 'users', user.uid, 'cart', docId);
          batch.set(ref, item);
        }

        await batch.commit();

        // Clear Local Storage
        localStorage.removeItem('vinayka_cart');

        // Update State (though the listener below will catch it too, it's faster to set it now)
        setCart(merged);
      }
    };

    syncUserCart();

    // Subscribe to Firestore Cart
    const cartRef = collection(db, 'users', user.uid, 'cart');
    const unsubscribe = onSnapshot(cartRef, (snapshot) => {
      const items = snapshot.docs.map(d => d.data() as CartItem);
      setCart(items);
    });

    return () => unsubscribe();
  }, [user]);



  const addToCart = async (product: Product, selectedSize: string, quantity: number) => {
    const newItem = { ...product, selectedSize, quantity };

    // Update State
    let nextCart: CartItem[] = [];

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.selectedSize === selectedSize);
      if (existing) {
        nextCart = prev.map((item) =>
          item.id === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        nextCart = [...prev, newItem];
      }
      return nextCart;
    });

    // If User, Write to Firestore
    if (user) {
      const docId = `${product.id}_${selectedSize}`;
      const itemRef = doc(db, 'users', user.uid, 'cart', docId);
      try {
        const docSnap = await getDoc(itemRef);
        if (docSnap.exists()) {
          const existing = docSnap.data() as CartItem;
          await setDoc(itemRef, { ...existing, quantity: existing.quantity + quantity });
        } else {
          await setDoc(itemRef, newItem);
        }
      } catch (e) { console.error(e); }
    } else {
      // Guest: Write to LocalStorage
      // NOTE: We need to use the calculated 'nextCart'. 
      // But setState updater runs asynchronously? No, the calculation we did above returned 'nextCart'. 
      // However the closure above doesn't expose 'nextCart' outside.
      // So let's re-calculate for LS. It's cheap.

      const currentCart = [...cart]; // Use current state from closure
      const existingIndex = currentCart.findIndex(i => i.id === product.id && i.selectedSize === selectedSize);
      if (existingIndex > -1) {
        currentCart[existingIndex].quantity += quantity;
      } else {
        currentCart.push(newItem);
      }
      localStorage.setItem('vinayka_cart', JSON.stringify(currentCart));
    }

    setIsCartOpen(true);
    notify(`Added ${product.name} to cart`, 'success');
  };

  const removeFromCart = async (productId: string, selectedSize: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === productId && item.selectedSize === selectedSize)));

    if (user) {
      const docId = `${productId}_${selectedSize}`;
      await deleteDoc(doc(db, 'users', user.uid, 'cart', docId));
    } else {
      const nextCart = cart.filter((item) => !(item.id === productId && item.selectedSize === selectedSize));
      localStorage.setItem('vinayka_cart', JSON.stringify(nextCart));
    }
  };

  const updateQuantity = async (productId: string, selectedSize: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId && item.selectedSize === selectedSize ? { ...item, quantity } : item
      )
    );

    if (user) {
      const docId = `${productId}_${selectedSize}`;
      await setDoc(doc(db, 'users', user.uid, 'cart', docId), { quantity }, { merge: true });
    } else {
      const nextCart = cart.map((item) =>
        item.id === productId && item.selectedSize === selectedSize ? { ...item, quantity } : item
      );
      localStorage.setItem('vinayka_cart', JSON.stringify(nextCart));
    }
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
      if (currentItem) {
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
