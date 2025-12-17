
import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ImageSmart from '../components/ImageSmart';
import { Lock, Mail, User as UserIcon, Eye, EyeOff, Briefcase, MapPin, Phone, Building, CheckCircle, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';

const PROFESSIONS = [
  'Architect',
  'Interior Designer',
  'Home Owner',
  'Art Collector',
  'Real Estate Developer',
  'Student',
  'Other'
];

// InputField moved outside to prevent re-mounting on state change
const InputField = ({ 
  label, name, type = 'text', value, onChange, error, placeholder, icon: Icon, showPassword, togglePassword 
}: any) => (
  <div className="mb-4">
    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">{label}</label>
    <div className="relative">
      <input 
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border rounded-lg py-3 pl-10 pr-4 text-sm outline-none transition-all bg-white text-text-body placeholder-gray-400 ${error ? 'border-error focus:border-error focus:ring-1 focus:ring-error' : 'border-gray-300 focus:border-terracotta focus:ring-1 focus:ring-terracotta'}`}
      />
      {Icon && <Icon size={18} className="absolute left-3 top-3 text-gray-400" />}
      {name.toLowerCase().includes('password') && type !== 'hidden' && togglePassword && (
         <button 
           type="button" 
           onClick={togglePassword}
           className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
         >
           {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
         </button>
      )}
    </div>
    {error && <span className="text-xs text-error mt-1 flex items-center gap-1"><AlertCircle size={12}/> {error}</span>}
  </div>
);

const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const navigate = useNavigate();

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [regData, setRegData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profession: '',
    city: '',
    companyName: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const [regErrors, setRegErrors] = useState<Record<string, string>>({});

  // Helper to clear notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // --- Validation Logic ---
  const validateRegister = () => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    // Min 8 chars, 1 Uppercase, 1 Number
    const passRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!regData.firstName) errors.firstName = 'First Name is required';
    if (!regData.lastName) errors.lastName = 'Last Name is required';
    
    if (!regData.email) errors.email = 'Email is required';
    else if (!emailRegex.test(regData.email)) errors.email = 'Invalid email format';

    if (!regData.phone) errors.phone = 'Phone is required';
    else if (!phoneRegex.test(regData.phone)) errors.phone = 'Invalid phone number';

    if (!regData.profession) errors.profession = 'Please select a profession';
    if (!regData.city) errors.city = 'City is required';

    if (!regData.password) errors.password = 'Password is required';
    else if (!passRegex.test(regData.password)) errors.password = 'Must have 8+ chars, 1 uppercase, 1 number';

    if (regData.password !== regData.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    setRegErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // --- Handlers ---

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      // Determine redirect based on email or claim (simple check for now)
      if (loginEmail.includes('admin') || loginEmail.includes('vinayka')) {
        navigate('/admin');
      } else {
        navigate('/account'); // Default to account/dashboard
      }
    } catch (err: any) {
      let msg = 'Failed to login.';
      if (err.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
      showNotification('error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;

    setLoading(true);
    try {
      // 1. Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, regData.email, regData.password);
      const user = userCredential.user;

      // 2. Update Display Name
      await updateProfile(user, {
        displayName: `${regData.firstName} ${regData.lastName}`
      });

      // 3. Store Profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        firstName: regData.firstName,
        lastName: regData.lastName,
        email: regData.email,
        phone: regData.phone,
        profession: regData.profession,
        city: regData.city,
        companyName: regData.companyName,
        address: regData.address,
        createdAt: serverTimestamp(),
        role: 'customer'
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);

      showNotification('success', 'Account created successfully!');
      // Navigate to profile or home
      navigate('/account');

    } catch (err: any) {
      let msg = 'Registration failed.';
      if (err.code === 'auth/email-already-in-use') msg = 'Email is already registered.';
      showNotification('error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!loginEmail) {
      showNotification('error', 'Please enter your email address first.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, loginEmail);
      showNotification('success', 'Password reset link sent to your email.');
    } catch (err) {
      showNotification('error', 'Failed to send reset email. Check if email is correct.');
    }
  };

  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRegData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (regErrors[name]) {
      setRegErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row animate-fade-in">
      
      {/* LEFT SIDE: Brand / Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 relative items-center justify-center overflow-hidden">
        <ImageSmart 
          src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80" 
          alt="Luxury Carpet Texture"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 text-center text-white px-8">
          <h1 className="font-serif text-5xl mb-4">Vinayka<span className="font-light text-terracotta">Rugs</span></h1>
          <p className="text-lg font-light opacity-90 max-w-md mx-auto">
            Join our exclusive community of connoisseurs, architects, and design enthusiasts.
          </p>
          <div className="mt-8 flex justify-center gap-4">
             <div className="text-center">
                <div className="text-2xl font-bold text-terracotta">40+</div>
                <div className="text-xs uppercase tracking-wider">Years of Legacy</div>
             </div>
             <div className="w-px bg-white/20 h-10"></div>
             <div className="text-center">
                <div className="text-2xl font-bold text-terracotta">2k+</div>
                <div className="text-xs uppercase tracking-wider">Artisans</div>
             </div>
             <div className="w-px bg-white/20 h-10"></div>
             <div className="text-center">
                <div className="text-2xl font-bold text-terracotta">Global</div>
                <div className="text-xs uppercase tracking-wider">Shipping</div>
             </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Form Container */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-12 lg:p-16 overflow-y-auto">
        
        {/* Mobile Brand Header */}
        <div className="lg:hidden text-center mb-8">
           <h2 className="font-serif text-3xl font-bold">Vinayka<span className="font-light text-terracotta">Rugs</span></h2>
        </div>

        {/* Notifications */}
        {notification && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 text-sm font-medium animate-slide-up ${notification.type === 'success' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
             {notification.type === 'success' ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
             {notification.message}
          </div>
        )}

        {/* Toggle Mode */}
        <div className="max-w-md w-full mx-auto mb-8 bg-gray-100 p-1 rounded-lg flex">
           <button 
             onClick={() => { setIsRegister(false); setNotification(null); }} 
             className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isRegister ? 'bg-white shadow-sm text-text-body' : 'text-gray-500 hover:text-gray-700'}`}
           >
             Sign In
           </button>
           <button 
             onClick={() => { setIsRegister(true); setNotification(null); }} 
             className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isRegister ? 'bg-white shadow-sm text-text-body' : 'text-gray-500 hover:text-gray-700'}`}
           >
             Create Account
           </button>
        </div>

        <div className="max-w-md w-full mx-auto">
          {/* LOGIN FORM */}
          {!isRegister ? (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-serif font-bold mb-2">Welcome Back</h2>
                <p className="text-text-muted text-sm">Sign in to access your orders, watchlist, and bespoke requests.</p>
              </div>
              
              <form onSubmit={handleLogin}>
                <InputField 
                  label="Email Address" 
                  name="loginEmail" 
                  type="email" 
                  value={loginEmail} 
                  onChange={(e: any) => setLoginEmail(e.target.value)} 
                  icon={Mail}
                  placeholder="name@example.com"
                />
                
                <div className="mb-2">
                   <InputField 
                    label="Password" 
                    name="loginPassword" 
                    type={showPassword ? 'text' : 'password'} 
                    value={loginPassword} 
                    onChange={(e: any) => setLoginPassword(e.target.value)} 
                    icon={Lock}
                    placeholder="Enter your password"
                    showPassword={showPassword}
                    togglePassword={() => setShowPassword(!showPassword)}
                  />
                </div>

                <div className="flex justify-end mb-6">
                   <button type="button" onClick={handleForgotPassword} className="text-xs font-medium text-terracotta hover:underline">
                      Forgot Password?
                   </button>
                </div>

                <Button fullWidth size="lg" disabled={loading}>
                   {loading ? 'Authenticating...' : 'Sign In'}
                </Button>
              </form>
            </div>
          ) : (
            /* REGISTER FORM */
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-2xl font-serif font-bold mb-2">Create Account</h2>
                <p className="text-text-muted text-sm">Fill in your details to get started.</p>
              </div>

              <form onSubmit={handleRegister}>
                 <div className="grid grid-cols-2 gap-4">
                    <InputField 
                      label="First Name" name="firstName" value={regData.firstName} 
                      onChange={handleRegChange} error={regErrors.firstName} icon={UserIcon} placeholder="John"
                    />
                    <InputField 
                      label="Last Name" name="lastName" value={regData.lastName} 
                      onChange={handleRegChange} error={regErrors.lastName} placeholder="Doe"
                    />
                 </div>

                 <InputField 
                    label="Email Address" name="email" type="email" value={regData.email} 
                    onChange={handleRegChange} error={regErrors.email} icon={Mail} placeholder="john@example.com"
                 />

                 <div className="grid grid-cols-2 gap-4">
                    <InputField 
                      label="Phone Number" name="phone" type="tel" value={regData.phone} 
                      onChange={handleRegChange} error={regErrors.phone} icon={Phone} placeholder="+91 9999999999"
                    />
                    <div className="mb-4">
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Profession</label>
                      <div className="relative">
                        <select 
                          name="profession"
                          value={regData.profession}
                          onChange={handleRegChange}
                          className={`w-full border rounded-lg py-3 pl-10 pr-4 text-sm outline-none bg-white text-text-body appearance-none ${regErrors.profession ? 'border-error' : 'border-gray-300 focus:border-terracotta'}`}
                        >
                          <option value="">-- Select --</option>
                          {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <Briefcase size={18} className="absolute left-3 top-3 text-gray-400" />
                      </div>
                      {regErrors.profession && <span className="text-xs text-error mt-1">{regErrors.profession}</span>}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <InputField 
                      label="City" name="city" value={regData.city} 
                      onChange={handleRegChange} error={regErrors.city} icon={MapPin} placeholder="Mumbai"
                    />
                    <InputField 
                      label="Company (Optional)" name="companyName" value={regData.companyName} 
                      onChange={handleRegChange} icon={Building} placeholder="Studio Name"
                    />
                 </div>

                 <div className="mb-4">
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">Address</label>
                    <textarea 
                      name="address"
                      value={regData.address}
                      onChange={handleRegChange}
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta resize-none bg-white text-text-body placeholder-gray-400"
                      placeholder="Street address, Pincode..."
                    />
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField 
                      label="Password" name="password" type={showPassword ? 'text' : 'password'}
                      value={regData.password} onChange={handleRegChange} error={regErrors.password} icon={Lock}
                      showPassword={showPassword}
                      togglePassword={() => setShowPassword(!showPassword)}
                    />
                    <InputField 
                      label="Confirm Password" name="confirmPassword" type={showPassword ? 'text' : 'password'}
                      value={regData.confirmPassword} onChange={handleRegChange} error={regErrors.confirmPassword} icon={Lock}
                      showPassword={showPassword}
                      togglePassword={() => setShowPassword(!showPassword)}
                    />
                 </div>
                 
                 <div className="mb-6">
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                      By registering, you agree to our Terms of Service and Privacy Policy. Password must contain at least 8 characters, one uppercase letter, and one number.
                    </p>
                 </div>

                 <Button fullWidth size="lg" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Register'}
                 </Button>
              </form>
            </div>
          )}
        </div>
        
        {/* Footer Links */}
        <div className="mt-12 text-center text-xs text-text-muted">
           <p>&copy; 2026 Vinayka Rugs. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
