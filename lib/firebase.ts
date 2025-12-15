import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// REPLACE WITH YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyB5KVEDkLam_Zdz0bW9P-8sJ3EdtyaneD8",
  authDomain: "vinaykarugs.firebaseapp.com",
  projectId: "vinaykarugs",
  storageBucket: "vinaykarugs.firebasestorage.app",
  messagingSenderId: "1020806689038",
  appId: "1:1020806689038:web:c524176fcec737508fe75f",
  measurementId: "G-2S2V45SXJC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);