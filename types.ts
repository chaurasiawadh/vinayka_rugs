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