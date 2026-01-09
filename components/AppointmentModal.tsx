import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import Button from './Button';
import { WHATSAPP_NUMBER } from '../constants';
import { useShop } from '../context/ShopContext';
import { appointmentSchema } from '../lib/validations';
// import { z } from 'zod';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  eventName,
}) => {
  const { notify } = useShop();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    message: '',
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, consent: e.target.checked }));
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation using Zod
    const validationData = { ...formData, type: 'in-store' }; // Defaulting type for now

    // Check for consent manually or add to schema? Schema doesn't have consent.
    // Keeping manual consent check as it's a UI checkbox
    if (!formData.consent) {
      notify('Please agree to the privacy consent', 'error');
      setLoading(false);
      return;
    }

    const result = appointmentSchema.safeParse(validationData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    setErrors({});

    // Prepare Payload
    // Prepare Payload
    // const appointment: Appointment = {
    //   ...formData,
    //   eventName,
    //   createdAt: new Date().toISOString(),
    // };

    // Format WhatsApp Message
    const message = `*New Appointment Request*
Event: ${eventName}
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Preferred Date: ${formData.date}
Preferred Time: ${formData.time || 'Anytime'}
Message: ${formData.message || 'N/A'}
Consent: User agreed to receive messages on WhatsApp & Email
Source: ${window.location.href}`;

    try {
      // 1. Mock Server-side call
      // In a real app: await fetch('/api/appointments', { method: 'POST', body: JSON.stringify(appointment) });
      // console.log('Posting to /api/appointments:', appointment);

      // 2. Fallback to Client-side WhatsApp if Server mocking "succeeds" but we want to simulate the flow
      // or if we decide to use client-side fallback explicitly.

      // Simulating server delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Attempting to open WhatsApp
      const encodedMessage = encodeURIComponent(message);
      const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

      window.open(waLink, '_blank');

      notify('Appointment request initiated via WhatsApp!', 'success');
      onClose();
    } catch (error) {
      // console.error('Submission error', error);
      notify('Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div
        className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-cream">
          <h2 id="modal-title" className="text-xl font-serif text-text-body">
            Request Appointment
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form
            id="appointment-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="bg-teal/5 border border-teal/20 p-3 rounded-lg text-sm text-teal-800 mb-4">
              Booking for: <strong>{eventName}</strong>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Full Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-terracotta focus:border-terracotta outline-none"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="email"
                >
                  Email <span className="text-error">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-terracotta outline-none"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="phone"
                >
                  Phone <span className="text-error">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  placeholder="+91 98765 43210"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-terracotta outline-none"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="date"
                >
                  Preferred Date <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    min={getMinDate()}
                    className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-terracotta outline-none"
                    value={formData.date}
                    onChange={handleChange}
                  />
                  <Calendar
                    size={18}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />
                  {errors.date && (
                    <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                  )}
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="time"
                >
                  Preferred Time
                </label>
                <div className="relative">
                  <select
                    name="time"
                    id="time"
                    className="w-full border border-gray-300 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-terracotta outline-none appearance-none bg-white"
                    value={formData.time}
                    onChange={handleChange}
                  >
                    <option value="">Anytime</option>
                    <option value="09:00 AM">09:00 AM - 10:00 AM</option>
                    <option value="10:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="11:00 AM">11:00 AM - 12:00 PM</option>
                    <option value="12:00 PM">12:00 PM - 01:00 PM</option>
                    <option value="02:00 PM">02:00 PM - 03:00 PM</option>
                    <option value="03:00 PM">03:00 PM - 04:00 PM</option>
                    <option value="04:00 PM">04:00 PM - 05:00 PM</option>
                    <option value="05:00 PM">05:00 PM - 06:00 PM</option>
                  </select>
                  <Clock
                    size={18}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />
                  {errors.time && (
                    <p className="text-red-500 text-xs mt-1">{errors.time}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="message"
              >
                Message (Optional)
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-terracotta outline-none resize-none"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us what you are looking for..."
              ></textarea>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="consent"
                name="consent"
                checked={formData.consent}
                onChange={handleCheckbox}
                className="mt-1 h-4 w-4 text-terracotta focus:ring-terracotta border-gray-300 rounded"
              />
              <label htmlFor="consent" className="text-xs text-gray-600">
                I agree to receive appointment updates and communications via
                WhatsApp & Email. I understand that my data will be handled
                according to the{' '}
                <a href="/privacy" className="underline text-terracotta">
                  Privacy Policy
                </a>
                .
              </label>
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-gray-100 bg-white flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            type="submit"
            form="appointment-form"
            disabled={loading}
            className="min-w-[140px]"
          >
            {loading ? 'Sending...' : 'Request Now'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
