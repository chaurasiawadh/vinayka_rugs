import React, { useState, useEffect } from 'react';
import { X, Check, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import Button from './Button';
import ImageInput from './ImageInput';
import { WHATSAPP_NUMBER } from '../constants';
import { BespokeRequest } from '../types';

const RUG_TYPES = ['Hand-knotted', 'Hand-tufted', 'Flatweave / Dhurrie', 'Shag / High Pile', 'Other'];
const MATERIALS = ['New Zealand Wool', 'Bamboo Silk', 'Pure Silk', 'Jute / Natural Fibers', 'Wool & Silk Blend', 'Viscose'];
const BUDGET_RANGES = ['Under ₹50,000', '₹50,000 - ₹1,00,000', '₹1,00,000 - ₹3,00,000', 'Above ₹3,00,000'];

const BespokeModal: React.FC = () => {
  const { isBespokeOpen, closeBespokeModal, bespokeSource, notify, submitBespokeRequest } = useShop();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [inspirationImage, setInspirationImage] = useState<File | string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    communicationMethod: 'WhatsApp',
    preferredDate: '',
    rugType: 'Hand-knotted',
    material: '',
    size: '',
    colors: '',
    budget: '',
    message: '',
    consent: false
  });

  // Reset form when opened
  useEffect(() => {
    if (isBespokeOpen) {
      setStep(1);
      document.body.style.overflow = 'hidden';
      setInspirationImage(null);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isBespokeOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleNextStep = () => {
    // Basic validation for step 1
    if (step === 1) {
        if (!formData.rugType || !formData.material) {
            notify('Please select Rug Type and Material', 'error');
            return;
        }
    }
    setStep(prev => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.phone || !formData.email) {
        notify('Please fill in all required contact details.', 'error');
        setLoading(false);
        return;
    }
    if (!formData.consent) {
        notify('Please agree to the privacy consent.', 'error');
        setLoading(false);
        return;
    }

    const request: BespokeRequest = {
        ...formData,
        colors: formData.colors.split(',').map(c => c.trim()),
        communicationMethod: formData.communicationMethod as any,
        source: bespokeSource || 'Website Global',
        createdAt: new Date().toISOString()
    };

    // 1. Submit to "Backend"
    submitBespokeRequest(request);

    // 2. Determine Image Message
    let imageMsg = 'None';
    if (inspirationImage) {
        if (typeof inspirationImage === 'string') {
            imageMsg = `Image URL: ${inspirationImage}`;
        } else {
            imageMsg = `Image: [User will attach file in chat]`;
        }
    }

    // 3. Generate WhatsApp Link
    const message = `*New Bespoke Design Request*
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Preferred Date: ${formData.preferredDate}
Comm Method: ${formData.communicationMethod}
----------------
Rug Type: ${formData.rugType}
Material: ${formData.material}
Size: ${formData.size}
Budget: ${formData.budget}
Colors: ${formData.colors}
Inspiration: ${imageMsg}
----------------
Message: ${formData.message || 'N/A'}
Source: ${bespokeSource || 'Website Global'}`;

    try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        const encodedMessage = encodeURIComponent(message);
        const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(waLink, '_blank');
        
        notify('Request submitted! Opening WhatsApp...', 'success');
        closeBespokeModal();
    } catch (error) {
        notify('Error submitting request.', 'error');
    } finally {
        setLoading(false);
    }
  };

  if (!isBespokeOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeBespokeModal}
      ></div>

      {/* Drawer */}
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-slide-up md:animate-none md:transition-transform overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-cream">
          <div>
              <span className="text-xs font-bold text-terracotta uppercase tracking-widest">Bespoke Service</span>
              <h2 className="font-serif text-2xl text-text-body mt-1">Create Your Custom Rug</h2>
          </div>
          <button onClick={closeBespokeModal} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {bespokeSource && (
                <div className="bg-teal/5 border border-teal/20 p-4 rounded-lg mb-8 flex items-start gap-3">
                    <Check size={18} className="text-teal mt-0.5" />
                    <div className="text-sm">
                        <p className="font-medium text-teal-900">Contextual Request</p>
                        <p className="text-teal-700">Referring page: <span className="font-semibold">{bespokeSource}</span></p>
                    </div>
                </div>
            )}

            {/* Progress */}
            <div className="flex items-center gap-2 mb-8">
                <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-terracotta' : 'bg-gray-200'}`}></div>
                <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-terracotta' : 'bg-gray-200'}`}></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* STEP 1: Rug Details */}
                {step === 1 && (
                    <div className="space-y-6 animate-fade-in">
                        <h3 className="font-serif text-xl">1. Design Preferences</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">Rug Type <span className="text-error">*</span></label>
                                <select 
                                    name="rugType" 
                                    value={formData.rugType} 
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-terracotta focus:border-terracotta bg-white"
                                >
                                    {RUG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Material Preference <span className="text-error">*</span></label>
                                <select 
                                    name="material" 
                                    value={formData.material} 
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-terracotta focus:border-terracotta bg-white"
                                >
                                    <option value="">Select Material</option>
                                    {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">Estimated Size</label>
                                <input 
                                    type="text" 
                                    name="size"
                                    placeholder="e.g. 8x10 ft or 240x300 cm"
                                    value={formData.size}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-terracotta outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Budget Range</label>
                                <select 
                                    name="budget" 
                                    value={formData.budget} 
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-terracotta focus:border-terracotta bg-white"
                                >
                                    <option value="">Select Range</option>
                                    {BUDGET_RANGES.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Color Palette</label>
                            <input 
                                type="text" 
                                name="colors"
                                placeholder="e.g. Earthy tones, Sage Green, Navy and Gold"
                                value={formData.colors}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-terracotta outline-none"
                            />
                        </div>

                        <div>
                            <ImageInput 
                                label="Inspiration / Room Photos"
                                onChange={(val) => setInspirationImage(val)}
                            />
                        </div>
                    </div>
                )}

                {/* STEP 2: Personal Details */}
                {step === 2 && (
                    <div className="space-y-6 animate-fade-in">
                        <h3 className="font-serif text-xl">2. Your Details</h3>

                        <div>
                             <label className="block text-sm font-medium mb-1">Full Name <span className="text-error">*</span></label>
                             <input 
                                type="text" 
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-terracotta outline-none"
                             />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone Number <span className="text-error">*</span></label>
                                <input 
                                    type="tel" 
                                    name="phone"
                                    required
                                    placeholder="+91"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-terracotta outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email Address <span className="text-error">*</span></label>
                                <input 
                                    type="email" 
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-terracotta outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">Preferred Communication</label>
                                <select 
                                    name="communicationMethod"
                                    value={formData.communicationMethod}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-3 bg-white"
                                >
                                    <option value="WhatsApp">WhatsApp</option>
                                    <option value="Email">Email</option>
                                    <option value="Call">Phone Call</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Preferred Consultation Date</label>
                                <input 
                                    type="date" 
                                    name="preferredDate"
                                    min={getMinDate()}
                                    value={formData.preferredDate}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-terracotta outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Additional Notes</label>
                            <textarea 
                                name="message"
                                rows={3}
                                placeholder="Tell us more about your vision..."
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-terracotta outline-none resize-none"
                            ></textarea>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <input 
                                type="checkbox" 
                                id="bespoke-consent" 
                                name="consent"
                                checked={formData.consent}
                                onChange={(e) => setFormData(prev => ({...prev, consent: e.target.checked}))}
                                className="mt-1 h-4 w-4 text-terracotta focus:ring-terracotta border-gray-300 rounded"
                            />
                            <label htmlFor="bespoke-consent" className="text-xs text-gray-600">
                                I agree to receive communications regarding my bespoke request. I understand that my design ideas will be shared with the design team.
                            </label>
                        </div>
                    </div>
                )}
            </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-white">
            {step === 1 ? (
                <Button fullWidth size="lg" onClick={handleNextStep} className="flex items-center justify-between group">
                    <span>Continue to Details</span>
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
            ) : (
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(1)} className="px-6">Back</Button>
                    <Button fullWidth size="lg" onClick={handleSubmit} disabled={loading} className="flex-1">
                        {loading ? 'Submitting...' : 'Send Request'}
                    </Button>
                </div>
            )}
            <p className="text-xs text-center text-text-muted mt-3">
                Expert consultation provided free of charge.
            </p>
        </div>
      </div>
    </div>
  );
};

export default BespokeModal;