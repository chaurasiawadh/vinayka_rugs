'use client';

import React from 'react';
import ImageSmart from '@/components/ImageSmart';

const AboutClient: React.FC = () => {
  return (
    <div className="bg-white min-h-screen animate-fade-in">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        <ImageSmart
          src="https://images.unsplash.com/photo-1596238647038-d6c57f7243c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Artisan Weaving"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative h-full flex flex-col justify-center items-center text-center px-4">
          <span className="text-white/80 uppercase tracking-widest text-sm font-bold mb-4 animate-slide-up">
            Est. 1982
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 animate-slide-up">
            Woven Stories
          </h1>
          <p className="text-xl text-white/90 font-light max-w-2xl animate-slide-up">
            Preserving the ancient art of hand-knotted rugs while embracing the
            future of design.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-serif mb-8 text-text-body">
              From Varanasi to the World
            </h2>
            <div className="space-y-6 text-lg text-text-muted leading-relaxed font-light">
              <p>
                Vinayka Rugs began as a small family initiative in the historic
                city of Varanasi. For over four decades, we have remained
                committed to a singular vision: creating textiles that are not
                just floor coverings, but heirloom art pieces.
              </p>
              <p>
                We work directly with over 2,000 artisans across rural India,
                ensuring that the intricate skill of hand-knotting is passed
                down through generations. By eliminating middlemen, we ensure
                fair wages for our weavers and exceptional value for our
                patrons.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ImageSmart
              src="https://images.unsplash.com/photo-1605218427368-35b81a3dd6b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              className="rounded-lg translate-y-8"
            />
            <ImageSmart
              src="https://images.unsplash.com/photo-1617104424032-b91a938c7126?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              className="rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* The Craft */}
      <section className="bg-cream py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif mb-4">The Craftsmanship</h2>
            <div className="w-16 h-0.5 bg-terracotta mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="aspect-[4/3] rounded-lg overflow-hidden mb-6">
                <ImageSmart
                  src="https://images.unsplash.com/photo-1615529162924-f8605388461d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="text-xl font-serif mb-3">Material Selection</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                We use only the finest long-staple New Zealand wool and pure
                bamboo silk, hand-carded and hand-spun to create unique
                textures.
              </p>
            </div>
            <div className="text-center">
              <div className="aspect-[4/3] rounded-lg overflow-hidden mb-6">
                <ImageSmart
                  src="https://images.unsplash.com/photo-1590437508092-c07a0f68d6c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="text-xl font-serif mb-3">The Knot</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                A single rug can contain up to a million individual knots. This
                labor-intensive process ensures durability that lasts a
                lifetime.
              </p>
            </div>
            <div className="text-center">
              <div className="aspect-[4/3] rounded-lg overflow-hidden mb-6">
                <ImageSmart
                  src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="text-xl font-serif mb-3">Finishing</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Washed, sheared, and stretched by hand. Every rug undergoes
                rigorous quality checks before it earns the Vinayka seal.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutClient;
