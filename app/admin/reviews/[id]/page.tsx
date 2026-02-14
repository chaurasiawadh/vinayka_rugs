import AdminReviewsClient from './AdminReviewsClient';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function generateStaticParams() {
  try {
    // If API keys aren't set (e.g. in CI without secrets), return empty to avoid build fail
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
  return <AdminReviewsClient productId={params.id} />;
}
