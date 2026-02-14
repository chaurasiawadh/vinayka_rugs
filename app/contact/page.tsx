'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Button from '@/components/Button';
// import { useShop } from '@/context/ShopContext';
import { CONTACT_PHONE, ADMIN_EMAIL } from '@/constants';
import { contactFormSchema } from '@/lib/validations';
// import { z } from 'zod';

const Contact: React.FC = () => {
  // const { openBespokeModal } = useShop();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = contactFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    alert('Thank you for your message. We will get back to you shortly.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-white min-h-screen animate-fade-in">
      {/* Header */}
      <div className="bg-cream py-16 md:py-24 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-serif text-text-body mb-4">
          Get in Touch
        </h1>
        <p className="text-text-muted max-w-2xl mx-auto text-lg font-light">
          Whether you are an architect, interior designer, or a collector, we
          are here to assist you.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-serif mb-6">Concierge Services</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-terracotta shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-lg">Call Us</p>
                    <p className="text-text-muted mb-1">{CONTACT_PHONE}</p>
                    <p className="text-xs text-gray-400">
                      Mon-Sat, 9am - 7pm IST
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-terracotta shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-lg">Email Us</p>
                    <p className="text-text-muted">{ADMIN_EMAIL}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-terracotta shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-lg">Visit Our Studio</p>
                    <p className="text-text-muted">
                      Bhadohi, Varanasi
                      <br />
                      Uttar Pradesh
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
            <h2 className="text-2xl font-serif mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full border rounded-lg p-3 focus:ring-terracotta outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`w-full border rounded-lg p-3 focus:ring-terracotta outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <select
                  className={`w-full border rounded-lg p-3 focus:ring-terracotta outline-none bg-white ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                >
                  <option value="">Select a topic</option>
                  <option value="Order Inquiry">Order Inquiry</option>
                  <option value="Trade Program">Trade Program</option>
                  <option value="Press">Press & Collaborations</option>
                  <option value="Other">Other</option>
                </select>
                {errors.subject && (
                  <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className={`w-full border rounded-lg p-3 focus:ring-terracotta outline-none resize-none ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                )}
              </div>

              <Button fullWidth size="lg">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
