'use client';

import React from 'react';
import Button from '@/components/Button';
import { useShop } from '@/context/ShopContext';
import ImageSmart from '@/components/ImageSmart';
import { PenTool, Palette, Scissors, Truck, MessageCircle } from 'lucide-react';

const Bespoke: React.FC = () => {
  const { openBespokeModal } = useShop();

  return (
    <div className="bg-cream animate-fade-in pt-20">
      {/* Hero */}
      <section className="relative h-[80vh] overflow-hidden">
        <ImageSmart
          src="https://images.unsplash.com/photo-1629033333649-16e680512128?ixlib=rb-4.0.3&auto=format&fit=crop&w=1800&q=80"
          alt="Artisan sketching design"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
          <span className="text-white/90 text-sm tracking-[0.3em] uppercase mb-4 animate-slide-up">
            The Atelier
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 animate-slide-up">
            Your Vision, <br />{' '}
            <span className="italic font-light">Handcrafted</span>
          </h1>
          <p className="text-xl text-gray-100 max-w-2xl mb-8 font-light animate-slide-up">
            Collaborate with our master weavers to create a rug that is uniquely
            yours. From color matching to custom dimensions, the possibilities
            are infinite.
          </p>
          <div className="animate-slide-up">
            <Button
              size="lg"
              onClick={() => openBespokeModal('Bespoke Landing Hero')}
            >
              Start Your Custom Project
            </Button>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif mb-4">The Custom Journey</h2>
          <p className="text-text-muted">Four steps to your masterpiece.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-0.5 bg-gray-200 -z-10"></div>

          {[
            {
              icon: <MessageCircle size={24} />,
              title: 'Consultation',
              desc: 'Share your inspiration, color palette, and requirements with our design team.',
            },
            {
              icon: <Palette size={24} />,
              title: 'Design & Artwork',
              desc: 'Receive digital renderings and material swatches for approval.',
            },
            {
              icon: <Scissors size={24} />,
              title: 'Weaving',
              desc: 'Our artisans hand-knot your rug using age-old techniques. Updates provided.',
            },
            {
              icon: <Truck size={24} />,
              title: 'Delivery',
              desc: 'White-glove delivery and installation in your home.',
            },
          ].map((step, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center bg-cream"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm mb-6 text-terracotta">
                {step.icon}
              </div>
              <h3 className="font-serif text-xl mb-3">{step.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Split Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative h-[600px] lg:h-auto">
          <ImageSmart
            src="https://images.unsplash.com/photo-1617346850873-1f19d083424d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="Wool Textures"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="bg-white p-12 lg:p-24 flex flex-col justify-center">
          <span className="text-terracotta uppercase tracking-widest text-xs font-bold mb-4">
            Materials
          </span>
          <h2 className="text-4xl font-serif mb-6">Uncompromising Quality</h2>
          <p className="text-text-muted text-lg leading-relaxed mb-8">
            We source only the finest materials for our bespoke creations.
            Choose from high-altitude Himalayan wool, lustrous bamboo silk, or
            durable natural jute. Our dyeing process allows for over 2,000 color
            variations, ensuring a perfect match for your interior.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <PenTool size={14} />
              </div>
              <span className="font-medium">Custom Shapes</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Palette size={14} />
              </div>
              <span className="font-medium">Pantone Matching</span>
            </div>
          </div>
          <div>
            <Button
              variant="outline"
              onClick={() => openBespokeModal('Materials Section')}
            >
              Request Sample Kit
            </Button>
          </div>
        </div>
      </section>

      {/* Inspiration Gallery */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-serif mb-12 text-center">
          Recent Commissions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            'https://images.unsplash.com/photo-1594040226829-7f251ab46d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1574635537920-d8d479383e5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1564078516393-cf04bd966897?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          ].map((src, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-lg aspect-[3/4]"
            >
              <ImageSmart
                src={src}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Bespoke;
