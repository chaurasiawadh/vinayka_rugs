import ProductClient from './ProductClient';

export function generateStaticParams() {
    return [];
}

export default function Page({ params }: { params: { id: string } }) {
    return <ProductClient id={params.id} />;
}
