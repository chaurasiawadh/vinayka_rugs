'use client';

import React from 'react';
import { Briefcase, Award, Percent, HeadphonesIcon } from 'lucide-react';
import Button from '@/components/Button';
import { useShop } from '@/context/ShopContext';

export default function TradeProgram() {
  const { openBespokeModal } = useShop();

  return (
    <div className="min-h-screen bg-cream py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl md:text-5xl text-center mb-4">
          Trade Program
        </h1>
        <p className="text-center text-text-muted mb-12">
          Exclusive benefits for interior designers, architects, and trade
          professionals
        </p>

        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="font-serif text-2xl mb-6">
            Why Join Our Trade Program?
          </h2>
          <p className="text-text-muted mb-6">
            At Vinayka Rugs, we value our partnerships with design
            professionals. Our Trade Program offers exclusive pricing,
            personalized service, and access to our full collection of
            handcrafted rugs to help you create stunning spaces for your
            clients.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <Percent className="w-12 h-12 text-terracotta mb-4" />
            <h3 className="font-serif text-xl mb-3">Trade Pricing</h3>
            <p className="text-text-muted">
              Enjoy competitive trade discounts on our entire collection,
              including custom and bespoke orders. Pricing varies based on order
              volume and partnership level.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm">
            <HeadphonesIcon className="w-12 h-12 text-terracotta mb-4" />
            <h3 className="font-serif text-xl mb-3">Dedicated Support</h3>
            <p className="text-text-muted">
              Work directly with our trade team for personalized assistance,
              product recommendations, and project consultation. We&apos;re here
              to make your design process seamless.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm">
            <Award className="w-12 h-12 text-terracotta mb-4" />
            <h3 className="font-serif text-xl mb-3">Priority Access</h3>
            <p className="text-text-muted">
              Get early access to new collections, exclusive designs, and
              priority production scheduling for your bespoke orders. Your
              projects come first.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm">
            <Briefcase className="w-12 h-12 text-terracotta mb-4" />
            <h3 className="font-serif text-xl mb-3">Flexible Terms</h3>
            <p className="text-text-muted">
              Benefit from flexible payment terms, net 30 invoicing for
              established accounts, and streamlined ordering processes for
              multiple projects.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="font-serif text-2xl mb-6">Membership Requirements</h2>
          <ul className="space-y-3 text-text-muted">
            <li className="flex gap-3">
              <span className="text-terracotta font-bold">✓</span>
              <span>
                Valid business license or professional credentials (interior
                designer, architect, etc.)
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-terracotta font-bold">✓</span>
              <span>Business tax ID or resale certificate</span>
            </li>
            <li className="flex gap-3">
              <span className="text-terracotta font-bold">✓</span>
              <span>
                Professional website or portfolio showcasing your work
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-terracotta font-bold">✓</span>
              <span>
                Commitment to representing Vinayka Rugs with integrity and
                professionalism
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-teal/10 border border-teal/20 p-8 rounded-lg text-center">
          <h3 className="font-serif text-2xl mb-4">Ready to Join?</h3>
          <p className="text-text-muted mb-6">
            Apply now to become a Vinayka Rugs trade partner and start enjoying
            exclusive benefits.
          </p>
          <Button
            size="lg"
            onClick={() => openBespokeModal('Trade Program')}
            className="mx-auto"
          >
            Apply for Trade Program
          </Button>
          <p className="text-sm text-text-muted mt-4">
            Questions? Email us at{' '}
            <a
              href="mailto:vinaykarugs@gmail.com"
              className="text-terracotta hover:underline"
            >
              vinaykarugs@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
