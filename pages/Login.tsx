import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { Lock } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err: any) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-cream px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-terracotta/10 p-4 rounded-full text-terracotta">
            <Lock size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-serif text-center mb-2">Admin Access</h2>
        <p className="text-center text-text-muted mb-6 text-sm">Please login to manage the dashboard</p>
        
        {error && <div className="bg-error/10 text-error text-sm p-3 rounded mb-4 text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-terracotta outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-terracotta outline-none"
            />
          </div>
          <Button fullWidth size="lg" className="mt-4">Login to Dashboard</Button>
        </form>
      </div>
    </div>
  );
};

export default Login;