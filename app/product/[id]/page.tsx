import React from 'react';
import { notFound } from 'next/navigation';
import { MOCK_PRODUCTS } from '@/constants';
import ProductClient from './ProductClient';

export function generateStaticParams() {
    return MOCK_PRODUCTS.map((product) => ({
        id: product.id,
    }));
}

interface PageProps {
    params: {
        id: string;
    };
}

const ProductPage = ({ params }: PageProps) => {
    const id = params.id;
    const product = MOCK_PRODUCTS.find(p => p.id === id);

    if (!product) {
        notFound();
    }

    return <ProductClient product={product} />;
};

export default ProductPage;
