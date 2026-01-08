
import { Product } from './types';

export const CATEGORIES = ['Modern', 'Traditional', 'Transitional', 'Tribal'];
export const COLLECTIONS = ['Viraasat', 'Aether', 'Silk Route', 'Cryptographic', 'Landscapes'];
export const MATERIALS = ['Wool', 'Bamboo Silk', 'Viscose', 'Cotton', 'Jute', 'Silk & Wool Blend', 'Micro Silk Fiber'];
export const CONSTRUCTIONS = ['Hand-knotted', 'Hand-tufted', 'Flat Weave', 'Hand-loomed'];
export const WEAVE_TYPES = ['Flat Woven', 'High Pile', 'Low Pile', 'Loop Pile', 'Cut Pile'];
export const SIZES = ['2x4 ft', '3x5 ft', '4x6 ft', '5x7 ft', '5x8 ft', '6x9 ft', '8x10 ft', '9x12 ft', '10x14 ft', 'Custom'];
export const REVIEW_TAGS = ['Quality', 'Softness', 'Value for money', 'Looks good', 'Comfort', 'Durability', 'Thickness', 'Color quality'];

export const CONTACT_PHONE = '+91 9936169852';
export const WHATSAPP_NUMBER = '919936169852';
export const ADMIN_EMAIL = 'concierge@vinaykarugs.com';

export const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

// Minimal mock data to prevent crash if DB is empty, updated to match new interface partially
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Aether Mist',
    brand: 'Vinayka Rugs',
    sku: 'AE-001',
    price: 125000,
    mrp: 180000,
    discount: 30,
    taxInclusive: true,
    emiAvailable: true,
    shortDescription: 'A dreamy abstract landscape in hand-knotted wool and silk.',
    description: 'Inspired by the ephemeral nature of morning mist, the Aether Mist rug combines high-altitude wool with pure bamboo silk accents.',
    category: 'Modern',
    collection: 'Aether',
    images: ['https://picsum.photos/id/103/800/1000'],
    sizes: ['8x10 ft', '9x12 ft'],
    colors: ['Grey', 'Blue'],
    inStock: true,
    rating: 4.8,
    reviews: 12,
    specifications: {
      weaveType: 'Cut Pile',
      pileHeight: 'Medium',
      construction: 'Hand-knotted',
      indoorOutdoor: 'Indoor',
      stainResistant: 'No',
      specialFeatures: 'Anti-static, Soft Touch',
      roomType: 'Living Room',
      waterResistance: 'No',
      material: 'Wool & Bamboo Silk',
      backMaterial: 'Cotton Canvas',
      careInstructions: 'Professional Clean Only',
      brand: 'Vinayka Rugs',
      origin: 'India',
      includedComponents: 'Rug',
      itemHeight: '1 cm',
      manufacturer: 'Vinayka Rugs Ltd',
      manufacturerContact: 'contact@vinayka.com',
      unitCount: '1',
      warranty: '1 Year Manufacturing',
      color: 'Grey/Blue',
      theme: 'Abstract',
      pattern: 'Abstract',
      shape: 'Rectangular',
      rugForm: 'Area Rug',
      style: 'Modern',
      occasion: 'Home Decor',
      size: '8x10 Feet',
      itemWeight: '15 Kg',
      dimensionsLxW: '240 x 300 cm',
      numberOfPieces: '1',
      itemThickness: '12 mm'
    },
    aboutItems: ['Luxurious appearance', 'Handmade in India', 'Premium Wool'],
    reviewSummary: 'Customers love the soft texture.',
    reviewTags: ['Quality', 'Softness'],
    reviewDistribution: { fiveStar: 80, fourStar: 10, threeStar: 5, twoStar: 0, oneStar: 5 },
    deliveryText: 'Tue, 25 Dec',
    returnPolicy: '30 Days',
  },
  {
    id: 'YnNJlJxcZwqUvHd8Ya8y',
    name: 'Legacy Item',
    brand: 'Vinayka Rugs',
    sku: 'LEGACY-001',
    price: 100000,
    mrp: 150000,
    discount: 33,
    taxInclusive: true,
    emiAvailable: true,
    shortDescription: 'Legacy item short description',
    description: 'Legacy item description',
    category: 'Modern',
    collection: 'Landscapes',
    images: ['https://picsum.photos/id/104/800/1000'],
    sizes: ['8x10 ft'],
    colors: ['Red'],
    inStock: true,
    rating: 4.5,
    reviews: 5,
    specifications: {
      weaveType: 'Cut Pile',
      pileHeight: 'Medium',
      construction: 'Hand-knotted',
      indoorOutdoor: 'Indoor',
      stainResistant: 'No',
      specialFeatures: 'Legacy',
      roomType: 'Living Room',
      waterResistance: 'No',
      material: 'Wool',
      backMaterial: 'Cotton',
      careInstructions: 'Clean',
      brand: 'Vinayka',
      origin: 'India',
      includedComponents: 'Rug',
      itemHeight: '1 cm',
      manufacturer: 'Vinayka',
      manufacturerContact: 'contact@vinayka.com',
      unitCount: '1',
      warranty: '1 Year',
      color: 'Red',
      theme: 'Legacy',
      pattern: 'Legacy',
      shape: 'Rectangular',
      rugForm: 'Area Rug',
      style: 'Modern',
      occasion: 'Home',
      size: '8x10 ft',
      itemWeight: '10 kg',
      dimensionsLxW: '200x300 cm',
      numberOfPieces: '1',
      itemThickness: '10 mm'
    },
    aboutItems: ['Legacy item'],
    reviewSummary: 'Good',
    reviewTags: ['Quality'],
    reviewDistribution: { fiveStar: 5, fourStar: 0, threeStar: 0, twoStar: 0, oneStar: 0 },
    deliveryText: 'Tue, 25 Dec',
    returnPolicy: '30 Days',
  }
];

export const FREE_SHIPPING_THRESHOLD = 50000;
export const SHIPPING_COST = 2500;
