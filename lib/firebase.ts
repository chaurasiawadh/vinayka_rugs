import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB5KVEDkLam_Zdz0bW9P-8sJ3EdtyaneD8',
  authDomain: 'vinaykarugs.firebaseapp.com',
  projectId: 'vinaykarugs',
  storageBucket: 'vinaykarugs.firebasestorage.app',
  messagingSenderId: '1020806689038',
  appId: '1:1020806689038:web:75a9a08364f7d66f8fe75f',
  measurementId: 'G-440D6NNYKP',
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics safely
export const analytics =
  typeof window !== 'undefined'
    ? (async () => {
        if (await isSupported()) {
          return getAnalytics(app);
        }
        return null;
      })()
    : null;

export default app;
