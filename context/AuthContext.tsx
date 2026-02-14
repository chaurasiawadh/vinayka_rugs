import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  User,
  signOut,
  signInWithPopup,
} from 'firebase/auth';
import {
  doc,
  onSnapshot,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let snapshotUnsubscribe: (() => void) | null = null;

    const authUnsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      // Clean up previous listener if it exists (e.g. switching users)
      if (snapshotUnsubscribe) {
        snapshotUnsubscribe();
        snapshotUnsubscribe = null;
      }

      if (currentUser) {
        setLoading(true); // Set loading while we fetch/listen to profile
        try {
          // Listen to user profile in real-time
          snapshotUnsubscribe = onSnapshot(
            doc(db, 'users', currentUser.uid),
            (docSnap) => {
              if (docSnap.exists()) {
                setUserProfile(docSnap.data() as UserProfile);
              } else {
                setUserProfile(null);
              }
              setLoading(false); // Done loading initial data
            },
            (_error) => {
              // console.error('Error listening to user profile:', error);
              setLoading(false);
            }
          );
        } catch (error) {
          // console.error('Error setting up profile listener:', error);
          setLoading(false);
        }
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      authUnsubscribe();
      if (snapshotUnsubscribe) snapshotUnsubscribe();
    };
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Handle profile creation if it doesn't exist
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        const [firstName, ...lastNameParts] = (user.displayName || '').split(
          ' '
        );
        const profile: UserProfile = {
          uid: user.uid,
          firstName: firstName || 'User',
          lastName: lastNameParts.join(' ') || '',
          email: user.email || '',
          phone: '',
          profession: '',
          city: '',
          companyName: '',
          address: '',
          createdAt: serverTimestamp(),
          role: 'customer',
        };
        await setDoc(docRef, profile);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, userProfile, loading, logout, signInWithGoogle }}
    >
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-[#faf8f6] z-[9999]">
          <div className="w-8 h-8 border-4 border-[#2874f0] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
