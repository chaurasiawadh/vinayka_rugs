"use client";

import React, { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Authenticate
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Check Admin Role
            const userDoc = await getDoc(doc(db, 'users', user.uid));

            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.role === 'admin') {
                    // Success
                    router.push('/admin');
                    return;
                }
            }

            // If we reach here, user is not an admin
            await signOut(auth);
            setError("Unauthorized Access: You do not have admin privileges.");

        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/invalid-credential') {
                setError('Invalid email or password.');
            } else {
                setError('Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gray-50 px-8 py-8 border-b border-gray-100 flex flex-col items-center">
                    <div className="h-16 w-16 bg-terracotta/10 rounded-full flex items-center justify-center mb-4 text-terracotta">
                        <Shield size={32} />
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">Admin<span className="text-terracotta">Portal</span></h1>
                    <p className="text-sm text-gray-500 mt-2">Secure Restricted Access</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-sm text-red-600">
                            <AlertCircle size={18} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-500 ml-1">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-sm outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-all"
                                    placeholder="Enter your email"
                                    required
                                />
                                <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-500 ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 text-sm outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-all"
                                    placeholder="••••••••••••"
                                    required
                                />
                                <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
                        >
                            {loading ? (
                                <>Processing...</>
                            ) : (
                                <>Authenticate <Lock size={16} /></>
                            )}
                        </button>
                    </form>
                </div>

                <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Vinayka Rugs Internal System</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
