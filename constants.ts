// import { Product } from './types';

export const CATEGORIES = ['Modern', 'Traditional', 'Transitional', 'Tribal'];
export const COLLECTIONS = [
  'Viraasat',
  'Aether',
  'Silk Route',
  'Cryptographic',
  'Landscapes',
];
export const MATERIALS = [
  'Wool',
  'Bamboo Silk',
  'Viscose',
  'Cotton',
  'Jute',
  'Silk & Wool Blend',
  'Micro Silk Fiber',
];
export const CONSTRUCTIONS = [
  'Hand-knotted',
  'Hand-tufted',
  'Flat Weave',
  'Hand-loomed',
];
export const WEAVE_TYPES = [
  'Flat Woven',
  'High Pile',
  'Low Pile',
  'Loop Pile',
  'Cut Pile',
];
export const SIZES = [
  '2x2 ft',
  '2x4 ft',
  '3x5 ft',
  '4x4 ft',
  '4x6 ft',
  '5x7 ft',
  '5x8 ft',
  '6x6 ft',
  '6x9 ft',
  '8x10 ft',
  '9x12 ft',
  '10x14 ft',
  'Custom',
];
export const REVIEW_TAGS = [
  'Quality',
  'Softness',
  'Value for money',
  'Looks good',
  'Comfort',
  'Durability',
  'Thickness',
  'Color quality',
];

export const CONTACT_PHONE = '9936169852';
export const WHATSAPP_NUMBER = '919936169852';
export const ADMIN_EMAIL = 'info@vinaykarugs.com';

export const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

export const FREE_SHIPPING_THRESHOLD = 50000;
export const SHIPPING_COST = 0;

export const ROOMS = [
  'Living Room',
  'Bedroom',
  'Dining Room',
  'Kitchen',
  'Office',
  'Outdoor',
];
export const SHAPES = ['Square', 'Runner', 'Round', 'Rectangle'];

export const HERO_MEDIA_COLLECTION = 'heroMedia';
export const HERO_MEDIA_STORAGE_IMAGE_PREFIX = 'hero-media/images';
export const HERO_MEDIA_STORAGE_VIDEO_PREFIX = 'hero-media/videos';
export const HERO_MEDIA_STORAGE_THUMBNAIL_PREFIX = 'hero-media/thumbnails';
export const HERO_MEDIA_MIN_ITEMS = 1;
export const HERO_MEDIA_SESSION_KEY = 'vinayka_last_hero_media_id';
export const HERO_MEDIA_FALLBACK_VIDEO = '/hero-video.mp4';

export const ADMIN_PRODUCTS_PAGE_SIZE = 10;
export const SHOP_PRODUCTS_PAGE_SIZE = 12;
export const GALLERY_PAGE_SIZE = 10;

export const HERO_MEDIA_ERRORS = {
  cannotDeleteLast:
    'At least one hero media item must remain. Add another item before deleting this one.',
  uploadFailed: 'Upload failed. Please try again or paste a URL.',
  corsUpload: "CORS Error: Please use 'Paste URL' or configure bucket CORS.",
  mediaRequired: 'Please upload or provide a media URL first.',
  emptyHero: 'No hero media configured. Please add items in the admin panel.',
} as const;
