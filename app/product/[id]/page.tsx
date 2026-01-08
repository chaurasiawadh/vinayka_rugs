import ProductDetails from '@/components/product/ProductDetails';
import { PRODUCTS, REVIEWS, FAQS } from '@/lib/product-data';

export async function generateStaticParams() {
    const params = PRODUCTS.map((product) => ({
        id: product.id,
    }));
    // Add legacy/demo ID support
    params.push({ id: 'YnNJlJxcZwqUvHd8Ya8y' });
    return params;
}

export default function Page({ params }: { params: { id: string } }) {
    // In a real app, we would fetch data based on params.id
    // For this demo, we'll just use the first product as the main one, 
    // or find it if we expanded the data.
    const product = PRODUCTS.find(p => p.id === params.id) || PRODUCTS[0];
    const relatedProducts = PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);

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
