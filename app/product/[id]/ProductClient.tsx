'use client';

import { useState, useEffect } from 'react';
import ProductDetails from '@/components/product/ProductDetails';
import { ProductDetailSkeleton } from '@/components/product/ProductDetailSkeleton';
import { REVIEWS } from '@/lib/product-data';
import { db } from '@/lib/firebase';
import { useShop } from '@/context/ShopContext';
import {
  doc,
  getDoc,
  collection,
  query,
  limit,
  getDocs,
} from 'firebase/firestore';

const productCache = new Map<string, any>();

const mapProductData = (data: any, docId: string) => {
  const mapped = {
    id: docId,
    name: data.name,
    brand: data.brand || 'Vinayka Rugs',
    price: data.price,
    originalPrice: data.mrp || data.originalPrice,
    discount: data.discount ? `Save ${data.discount}%` : null,
    images: data.images || [],
    sizes: data.sizes || [],
    sizePrices: data.sizePrices || {},
    sizeOriginalPrices: data.sizeOriginalPrices || {},
    rating: data.rating || 0,
    reviewsCount: data.reviews || 0,
    reviewSummary: data.reviewSummary || '',
    reviewTags: data.reviewTags || [],
    shortDescription: data.shortDescription || '',
    description: data.description,
    details: data.description,
    material: data.specifications?.material || 'Premium Wool',
    roomType: data.specifications?.roomType || [],
    shape: data.specifications?.shape || [],
    specifications: data.specifications || {},
    careInstructions:
      data.specifications?.careInstructions || 'Professional clean only',
    shipping: data.deliveryText || 'Free shipping worldwide',
    tags: data.specifications?.style ? [data.specifications.style] : [],
    category: data.category || 'Modern',
    collection: data.collection || '-',
    aboutItems: data.aboutItems || [],
    arAssets: data.arAssets || null,
  };
  productCache.set(docId, mapped);
  return mapped;
};

export default function ProductClient({ id }: { id: string }) {
  const { products: shopProducts } = useShop();

  const [product, setProduct] = useState<any>(() => {
    if (productCache.has(id)) return productCache.get(id);
    const existing = shopProducts.find((p) => p.id === id);
    if (existing) return mapProductData(existing, id);
    return null;
  });

  const [relatedProducts, setRelatedProducts] = useState<any[]>(() => {
    if (shopProducts.length > 0) {
      return shopProducts
        .filter((p) => p.id !== id)
        .slice(0, 4)
        .map((p) => ({
          id: p.id,
          name: p.name,
          brand: p.brand || 'Vinayka Rugs',
          price: p.price,
          originalPrice: p.mrp,
          images: p.images || [],
          rating: p.rating || 0,
          reviewsCount: p.reviews || 0,
        }));
    }
    return [];
  });

  const [loading, setLoading] = useState<boolean>(!product);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (productCache.has(id)) {
      setProduct(productCache.get(id));
      setLoading(false);
    } else {
      const existing = shopProducts.find((p) => p.id === id);
      if (existing) {
        setProduct(mapProductData(existing, id));
        setLoading(false);
      }
    }

    if (relatedProducts.length === 0 && shopProducts.length > 0) {
      const related = shopProducts
        .filter((p) => p.id !== id)
        .slice(0, 4)
        .map((p) => ({
          id: p.id,
          name: p.name,
          brand: p.brand || 'Vinayka Rugs',
          price: p.price,
          originalPrice: p.mrp,
          images: p.images || [],
          rating: p.rating || 0,
          reviewsCount: p.reviews || 0,
        }));
      setRelatedProducts(related);
    }
  }, [id, shopProducts]);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const mappedProduct = mapProductData(docSnap.data(), docSnap.id);
          setProduct(mappedProduct);
          setError(false);

          if (relatedProducts.length === 0) {
            const q = query(collection(db, 'products'), limit(5));
            const querySnapshot = await getDocs(q);
            const related: any[] = [];
            querySnapshot.forEach((d) => {
              if (d.id !== id) {
                const dData = d.data();
                related.push({
                  id: d.id,
                  name: dData.name,
                  brand: dData.brand || 'Vinayka Rugs',
                  price: dData.price,
                  originalPrice: dData.mrp,
                  images: dData.images || [],
                  rating: dData.rating || 0,
                  reviewsCount: dData.reviews || 0,
                });
              }
            });
            setRelatedProducts(related.slice(0, 4));
          }
        } else if (!product) {
          setError(true);
        }
      } catch (err) {
        if (!product) setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F6] gap-4">
        <h1 className="text-2xl font-serif">Product Not Found</h1>
        <p className="text-gray-500">
          The rug you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <a href="/shop" className="text-black underline">
          Back to Shop
        </a>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F6] min-h-screen font-sans">
      <main className="pt-8">
        <ProductDetails
          product={product}
          relatedProducts={relatedProducts}
          reviews={REVIEWS}
        />
      </main>
    </div>
  );
}
