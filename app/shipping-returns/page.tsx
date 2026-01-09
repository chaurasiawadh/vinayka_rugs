'use client';

import React from 'react';
import { Package, RefreshCw, Clock, MapPin } from 'lucide-react';

export default function ShippingReturns() {
  return (
    <div className="min-h-screen bg-cream py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl md:text-5xl text-center mb-4">
          Shipping & Returns
        </h1>
        <p className="text-center text-text-muted mb-12">
          Your satisfaction is our priority
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <Package className="w-12 h-12 text-terracotta mb-4" />
            <h2 className="font-serif text-2xl mb-4">Shipping Policy</h2>
            <div className="space-y-4 text-text-muted">
              <p>
                <strong className="text-text-body">Free Shipping:</strong> On
                orders above ₹50,000
              </p>
              <p>
                <strong className="text-text-body">Delivery Time:</strong> 7-10
                business days for in-stock items
              </p>
              <p>
                <strong className="text-text-body">Bespoke Orders:</strong> 4-8
                weeks depending on customization
              </p>
              <p>
                <strong className="text-text-body">Tracking:</strong>{' '}
                You&apos;ll receive tracking information via email once your
                order ships
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm">
            <RefreshCw className="w-12 h-12 text-terracotta mb-4" />
            <h2 className="font-serif text-2xl mb-4">Return Policy</h2>
            <div className="space-y-4 text-text-muted">
              <p>
                <strong className="text-text-body">Return Window:</strong> 10
                days from delivery
              </p>
              <p>
                <strong className="text-text-body">Condition:</strong> Items
                must be unused, in original packaging
              </p>
              <p>
                <strong className="text-text-body">Refund:</strong> Full refund
                issued within 7-10 business days
              </p>
              <p>
                <strong className="text-text-body">Custom Orders:</strong>{' '}
                Bespoke items are non-returnable unless defective
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="font-serif text-2xl mb-6 flex items-center gap-3">
            <Clock className="w-8 h-8 text-terracotta" />
            How to Return
          </h2>
          <ol className="space-y-4 text-text-muted list-decimal list-inside">
            <li>
              Contact our customer service team at{' '}
              <a
                href="mailto:vinaykarugs@gmail.com"
                className="text-terracotta hover:underline"
              >
                vinaykarugs@gmail.com
              </a>
            </li>
            <li>Provide your order number and reason for return</li>
            <li>
              Pack the item securely in its original packaging with all tags
              attached
            </li>
            <li>
              Ship to the address provided by our team (return shipping costs
              may apply)
            </li>
            <li>Once received and inspected, your refund will be processed</li>
          </ol>
        </div>

        <div className="bg-teal/10 border border-teal/20 p-6 rounded-lg">
          <h3 className="font-serif text-xl mb-3 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-teal" />
            Questions?
          </h3>
          <p className="text-text-muted mb-4">
            Our customer service team is here to help with any shipping or
            return inquiries.
          </p>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Email:</strong>{' '}
              <a
                href="mailto:vinaykarugs@gmail.com"
                className="text-terracotta hover:underline"
              >
                vinaykarugs@gmail.com
              </a>
            </p>
            <p>
              <strong>WhatsApp:</strong>{' '}
              <a
                href="https://wa.me/919999999999"
                className="text-terracotta hover:underline"
              >
                +91 99999 99999
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
