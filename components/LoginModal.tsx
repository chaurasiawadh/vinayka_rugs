
import React, { useState } from 'react';
import { X, Mail, Lock, Loader } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import Button from './Button';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, notify } = useShop();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isLoginModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      notify('Welcome back!', 'success');
      closeLoginModal();
    } catch (err: any) {
      notify('Invalid credentials. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const navigateToFullLogin = () => {
      closeLoginModal();
      navigate('/login');
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={closeLoginModal}
      ></div>

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-slide-up overflow-hidden">
        <button 
            onClick={closeLoginModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
        >
            <X size={20} />
        </button>

        <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-text-body mb-2">Sign In</h2>
            <p className="text-text-muted text-sm">Login to save items to your watchlist.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
                <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input 
                    type="email" 
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 focus:ring-terracotta focus:border-terracotta outline-none transition-all"
                />
            </div>
            <div className="relative">
                <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input 
                    type="password" 
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 focus:ring-terracotta focus:border-terracotta outline-none transition-all"
                />
            </div>

            <Button fullWidth size="lg" disabled={loading} className="mt-2">
                {loading ? <Loader className="animate-spin mr-2" size={18} /> : 'Login'}
            </Button>
        </form>

        <div className="mt-6 text-center text-sm text-text-muted">
            <p>Don't have an account?</p>
            <button onClick={navigateToFullLogin} className="text-terracotta font-medium hover:underline mt-1">
                Create an account
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
