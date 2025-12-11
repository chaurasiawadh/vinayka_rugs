export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  description: string;
  shortDescription: string;
  category: string;
  collection: string;
  material: string;
  construction: string; // e.g., Hand-knotted, Hand-tufted
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
  rating: number;
  reviews: number;
  artisanStory?: string;
}

export interface CartItem extends Product {
  selectedSize: string;
  quantity: number;
}

export interface FilterState {
  category: string[];
  material: string[];
  color: string[];
  priceRange: [number, number];
  sort: 'newest' | 'price-low-high' | 'price-high-low' | 'popular';
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  date: string;
  shippingAddress: Address;
}

export interface Address {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface Appointment {
  id?: string;
  eventName: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  message?: string;
  consent: boolean;
  createdAt: string;
}

export interface BespokeRequest {
  id?: string;
  name: string;
  email: string;
  phone: string;
  communicationMethod: 'WhatsApp' | 'Email' | 'Call';
  preferredDate: string;
  rugType: string;
  material: string;
  size: string;
  budget: string;
  colors: string[];
  message?: string;
  source?: string; // e.g., "Product Page: Aether Mist"
  createdAt: string;
}

// --- NEW TYPES FOR SEARCH & WATCHLIST ---

export interface WatchlistItem {
  productId: string;
  addedAt: string;
  preferences: {
    priceDrop: boolean;
    backInStock: boolean;
    onSale: boolean;
  };
}

export interface SearchSuggestion {
  id: string;
  title: string;
  type: 'product' | 'collection' | 'event' | 'blog' | 'page';
  image?: string;
  url: string;
  subtitle?: string;
}

export interface Facet {
  id: string; // e.g., 'material'
  label: string; // e.g., 'Material'
  options: {
    value: string;
    label: string;
    count: number;
  }[];
}

export interface SearchResult {
  products: Product[];
  facets: Facet[];
  totalCount: number;
}