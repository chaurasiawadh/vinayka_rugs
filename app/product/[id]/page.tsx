import ProductClient from './ProductClient';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export async function generateStaticParams() {
    try {
        // If API keys aren't set (e.g. in CI without secrets), return empty to avoid build fail,
        // or mock data if critical. For now, we try to fetch.
        if (!db.app.options.apiKey) {
            console.warn("No Firebase API key found during build. Returning empty paths.");
            return [];
        }

        const q = query(collection(db, 'products'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
        }));
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

export default function Page({ params }: { params: { id: string } }) {
    return <ProductClient id={params.id} />;
}
