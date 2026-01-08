import { PRODUCTS } from '@/lib/product-data';
import ProductClient from './ProductClient';

// This is a Server Component by default (no 'use client')
// It runs at build time to generate static params
export async function generateStaticParams() {
    return PRODUCTS.map((product) => ({
        id: product.id,
    }));
}

export default function Page({ params }: { params: { id: string } }) {
    // Generate static pages for known IDs, but allow client-side handling for others (SPA mode)
    // Note: With 'output: export', checking params is static.

    return <ProductClient id={params.id} />;
}
