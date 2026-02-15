import ProductClient from './ProductClient';
import { collection, getDocs, query, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const productDoc = await getDoc(doc(db, 'products', params.id));
    if (!productDoc.exists()) {
      return {
        title: 'Product Not Found | Vinayka Rugs',
      };
    }

    const product = productDoc.data();
    const title = `${product.name} | ${product.category?.[0] || 'Handmade Rug'} | Vinayka Rugs`;
    const description =
      product.shortDescription ||
      `Discover the exquisite ${product.name}, a luxury hand-knotted rug from Vinayka Rugs. Artisan crafted in Varanasi.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: product.images?.[0] ? [{ url: product.images[0] }] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Luxury Rug | Vinayka Rugs',
    };
  }
}

export async function generateStaticParams() {
  try {
    // If API keys aren't set (e.g. in CI without secrets), return empty to avoid build fail,
    // or mock data if critical. For now, we try to fetch.
    if (!db.app.options.apiKey) {
      // eslint-disable-next-line no-console
      console.warn(
        'No Firebase API key found during build. Returning empty paths.'
      );
      return [];
    }

    const q = query(collection(db, 'products'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
    }));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error generating static params:', error);
    return [];
  }
}

export default function Page({ params }: { params: { id: string } }) {
  return <ProductClient id={params.id} />;
}
