
export interface Product {
  id: string;
  name: string;
  brand: string; // New
  sku: string;
  description: string;
  shortDescription: string;
  category: string;
  collection: string;
  
  // Pricing & Offers
  price: number; // Current selling price
  mrp: number; // New
  discount: number; // New (calculated)
  taxInclusive: boolean; // New
  emiAvailable: boolean; // New
  
  // Media & Variants
  images: string[];
  sizes: string[];
  defaultSize?: string; // New
  colors: string[];
  
  // Specifications
  specifications: {
    material: string;
    weaveType: string;
    pileHeight: string;
    itemWeight: string;
    construction: string;
    origin: string;
  };

  // About This Item (Dynamic Bullets)
  aboutItems: string[]; 

  // Admin Controlled Review Data
  rating: number;
  reviews: number;
  reviewSummary: string; // "Customers say..."
  reviewTags: string[]; // ["Quality", "Softness"]
  reviewDistribution: {
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
  };

  // Delivery & Stock
  inStock: boolean;
  stockCount?: number;
  deliveryText: string;
  returnPolicy: string;
  warranty: string;

  // Flags
  isNew?: boolean;
  isSale?: boolean;
  isTrending?: boolean;
  
  createdAt?: any; 
  updatedAt?: any;
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
  source?: string;
  createdAt: string;
}

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
  id: string; 
  label: string; 
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
