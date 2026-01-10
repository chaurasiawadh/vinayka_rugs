export interface Product {
  id: string;
  name: string;
  brand: string;
  sku: string;
  description: string;
  shortDescription: string;
  category: string;
  collection: string;

  // Pricing & Offers
  price: number | string;
  mrp: number | string;
  discount: number;
  taxInclusive: boolean;
  emiAvailable: boolean;

  // Media & Variants
  images: string[];
  sizes: string[];
  sizePrices?: { [key: string]: number };
  sizeOriginalPrices?: { [key: string]: number };
  defaultSize?: string;
  colors: string[];

  // Basic Details available in current data
  material?: string;
  careInstructions?: string;

  // Specifications (Expanded for Amazon-style layout)
  specifications?: {
    // Features & Specs
    weaveType: string;
    pileHeight: string;
    construction: string;
    indoorOutdoor: string;
    stainResistant: string; // 'Yes'/'No'
    specialFeatures: string;
    roomType: string | string[];
    waterResistance: string;

    // Materials & Care
    material: string | string[];
    backMaterial: string;
    careInstructions: string;

    // Item Details
    brand: string;
    origin: string;
    includedComponents: string;
    itemHeight: string;
    manufacturer: string;
    manufacturerContact: string;
    unitCount: string;
    warranty: string;

    // Style
    color: string;
    theme: string;
    pattern: string;
    shape: string | string[];
    rugForm: string;
    style: string;
    occasion: string;

    // Measurements
    size: string; // Dimensions string
    itemWeight: string;
    dimensionsLxW: string;
    numberOfPieces: string;
    itemThickness: string;
  };

  // About This Item (Dynamic Bullets)
  aboutItems: string[];

  // Admin Controlled Review Data
  rating: number;
  reviews: number;
  reviewSummary: string;
  reviewTags: string[];
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

  // Flags
  isNew?: boolean;
  isSale?: boolean;
  isTrending?: boolean;

  createdAt?: any;
  updatedAt?: any;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  link?: string;
  description?: string;
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
  id: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profession: string;
  city: string;
  companyName?: string;
  address: string;
  addresses?: Address[];
  lastUsedAddressId?: string;
  createdAt: any;
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
