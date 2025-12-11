import { Product } from './types';

export const CATEGORIES = ['Modern', 'Traditional', 'Transitional', 'Tribal'];
export const COLLECTIONS = ['Viraasat', 'Aether', 'Silk Route', 'Cryptographic', 'Landscapes'];
export const MATERIALS = ['Wool', 'Bamboo Silk', 'Viscose', 'Cotton', 'Jute'];
export const CONSTRUCTIONS = ['Hand-knotted', 'Hand-tufted', 'Flat Weave'];
export const SIZES = ['5x8 ft', '8x10 ft', '9x12 ft', '10x14 ft', 'Custom'];

export const CONTACT_PHONE = '+91 9936169852';
export const WHATSAPP_NUMBER = '919936169852';
export const ADMIN_EMAIL = 'concierge@vinaykarugs.com';

export const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; // Neutral texture

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Aether Mist',
    sku: 'AE-001',
    price: 125000,
    shortDescription: 'A dreamy abstract landscape in hand-knotted wool and silk.',
    description: 'Inspired by the ephemeral nature of morning mist, the Aether Mist rug combines high-altitude wool with pure bamboo silk accents to create a shimmering, textured surface that changes with the light.',
    category: 'Modern',
    collection: 'Aether',
    material: 'Wool & Bamboo Silk',
    construction: 'Hand-knotted',
    images: ['https://picsum.photos/id/103/800/1000', 'https://picsum.photos/id/104/800/1000'],
    sizes: ['8x10 ft', '9x12 ft'],
    colors: ['Grey', 'Blue'],
    inStock: true,
    isNew: true,
    rating: 4.8,
    reviews: 12,
    artisanStory: 'Woven by master artisan Rahim in Jaipur, this piece took 4 months to complete.'
  },
  {
    id: '2',
    name: 'Royal Kashan',
    sku: 'TR-055',
    price: 245000,
    shortDescription: 'Timeless Persian motifs reimagined for the modern manor.',
    description: 'A tribute to the classical gardens of Kashan, featuring intricate floral vines and a central medallion. Using the finest New Zealand wool.',
    category: 'Traditional',
    collection: 'Viraasat',
    material: '100% Wool',
    construction: 'Hand-knotted',
    images: ['https://picsum.photos/id/238/800/1000', 'https://picsum.photos/id/239/800/1000'],
    sizes: ['8x10 ft', '10x14 ft', '12x15 ft'],
    colors: ['Red', 'Cream', 'Navy'],
    inStock: true,
    isSale: false,
    rating: 5.0,
    reviews: 8
  },
  {
    id: '3',
    name: 'Geo Tides',
    sku: 'MO-022',
    price: 85000,
    shortDescription: 'Bold geometric patterns meeting coastal vibes.',
    description: 'Sharp lines meet soft textures in this contemporary piece designed for high-traffic living spaces.',
    category: 'Modern',
    collection: 'Cryptographic',
    material: 'Viscose & Wool',
    construction: 'Hand-tufted',
    images: ['https://picsum.photos/id/34/800/1000', 'https://picsum.photos/id/35/800/1000'],
    sizes: ['5x8 ft', '8x10 ft'],
    colors: ['Teal', 'Beige'],
    inStock: true,
    rating: 4.5,
    reviews: 24
  },
  {
    id: '4',
    name: 'Silk Road Mirage',
    sku: 'SR-101',
    price: 310000,
    shortDescription: 'Pure silk masterpiece reflecting desert dunes.',
    description: 'A luxury statement piece made entirely of pure silk, offering an incredibly soft hand and a luminous sheen.',
    category: 'Transitional',
    collection: 'Silk Route',
    material: '100% Silk',
    construction: 'Hand-knotted',
    images: ['https://picsum.photos/id/60/800/1000', 'https://picsum.photos/id/61/800/1000'],
    sizes: ['6x9 ft', '9x12 ft'],
    colors: ['Gold', 'Sand'],
    inStock: false,
    rating: 4.9,
    reviews: 5
  },
  {
    id: '5',
    name: 'Abstract Horizon',
    sku: 'LA-009',
    price: 145000,
    shortDescription: 'Painterly strokes inspired by sunsets.',
    description: 'Like a watercolor painting for your floor, this rug brings warmth and artistic expression to any room.',
    category: 'Modern',
    collection: 'Landscapes',
    material: 'Wool',
    construction: 'Hand-knotted',
    images: ['https://picsum.photos/id/80/800/1000', 'https://picsum.photos/id/81/800/1000'],
    sizes: ['8x10 ft', '10x14 ft'],
    colors: ['Orange', 'Pink', 'Grey'],
    inStock: true,
    isSale: true,
    rating: 4.7,
    reviews: 18
  },
  {
    id: '6',
    name: 'Nomad Weave',
    sku: 'TR-88',
    price: 45000,
    shortDescription: 'Rustic charm with a durable flat weave.',
    description: 'Perfect for casual spaces, this kilim-style rug brings tribal aesthetics into the modern home.',
    category: 'Tribal',
    collection: 'Viraasat',
    material: 'Jute & Cotton',
    construction: 'Flat Weave',
    images: ['https://picsum.photos/id/111/800/1000', 'https://picsum.photos/id/112/800/1000'],
    sizes: ['5x8 ft', '8x10 ft'],
    colors: ['Brown', 'Tan'],
    inStock: true,
    rating: 4.2,
    reviews: 30
  }
];

export const FREE_SHIPPING_THRESHOLD = 50000;
export const SHIPPING_COST = 2500;