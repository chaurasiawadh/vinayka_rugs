'use client';

import { useState, useEffect } from 'react';
import ProductDetails from '@/components/product/ProductDetails';
import { REVIEWS, FAQS } from '@/lib/product-data'; // Keeping Reviews/FAQs for layout demo unless requested to remove
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, limit, getDocs } from 'firebase/firestore';

export default function Page({ params }: { params: { id: string } }) {
    const [product, setProduct] = useState<any>(null);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchData() {
            if (!params.id) return;

            try {
                // 1. Fetch Main Product
                const docRef = doc(db, 'products', params.id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const mappedProduct = {
                        id: docSnap.id,
                        name: data.name,
                        brand: data.brand || 'Vinayka Rugs',
                        price: data.price,
                        originalPrice: data.mrp,
                        discount: data.discount ? `Save ${data.discount}%` : null,
                        images: data.images || [],
                        sizes: data.sizes || [],
                        rating: data.rating || 0,
                        reviewsCount: data.reviews || 0,
                        description: data.description,
                        details: data.description,
                        material: data.specifications?.material || 'Premium Wool',
                        careInstructions: data.specifications?.careInstructions || 'Professional clean only',
                        shipping: data.deliveryText || 'Free shipping worldwide',
                        tags: data.specifications?.style ? [data.specifications.style] : []
                    };
                    setProduct(mappedProduct);

                    // 2. Fetch Related Products (Simple: just first 4 other products)
                    // In a real app, query by category/collection
                    const q = query(collection(db, 'products'), limit(5));
                    const querySnapshot = await getDocs(q);
                    const related: any[] = [];
                    querySnapshot.forEach((d) => {
                        if (d.id !== params.id) {
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

                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Error fetching product:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF8F6]">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F6] gap-4">
                <h1 className="text-2xl font-serif">Product Not Found</h1>
                <p className="text-gray-500">The rug you're looking for doesn't exist or has been removed.</p>
                <a href="/shop" className="text-black underline">Back to Shop</a>
            </div>
        );
    }

    return (
        <div className="bg-[#FAF8F6] min-h-screen font-sans">
            <main className="pt-24">
                <ProductDetails
                    product={product}
                    relatedProducts={relatedProducts}
                    reviews={REVIEWS}
                    faqs={FAQS}
                />
            </main>
        </div>
    );
}
