'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';
// import { COLLECTIONS } from '../constants';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { useShop } from '../context/ShopContext';
import { useCollection } from '@/hooks/useFirestore';
import { GalleryItem } from '@/types';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const { products, openBespokeModal } = useShop();
  const galleryItems = useCollection('gallery') as GalleryItem[];
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo =
        direction === 'left'
          ? scrollLeft - clientWidth / 2
          : scrollLeft + clientWidth / 2;

      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth',
      });
    }
  };

  // Filter for trending products, or fall back to first 4
  const featuredProducts = products.filter((p) => p.isTrending).slice(0, 4);
  const displayProducts =
    featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full bg-gray-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600166898405-da9535204843?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Luxury Rug Living Room"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl space-y-6 animate-slide-up">
            <span className="text-white/90 text-sm md:text-base tracking-[0.3em] uppercase">
              The Art of Flooring
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white font-medium leading-tight">
              Weave Stories Into <br />{' '}
              <span className="text-terracotta italic">Every Room</span>
            </h1>
            <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto font-light">
              Hand-knotted masterpieces that blend ancient craftsmanship with
              contemporary vision.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button size="lg" className="min-w-[180px]">
                  Shop Collection
                </Button>
              </Link>
              <Link href="/bespoke">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white !hover:bg-white !hover:text-black min-w-[180px]"
                >
                  Bespoke Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Carousel */}
      {galleryItems.length > 0 && (
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-serif text-text-body mb-4">
                  Curated Collections
                </h2>
                <div className="w-20 h-1 bg-terracotta mx-auto md:mx-0"></div>
              </div>

              {/* Carousel Controls */}
              <div className="flex gap-4">
                <button
                  onClick={() => scroll('left')}
                  className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-terracotta hover:border-terracotta hover:text-white transition-all duration-300 group shadow-sm"
                  aria-label="Previous"
                >
                  <ChevronLeft
                    size={24}
                    className="group-active:scale-90 transition-transform"
                  />
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-terracotta hover:border-terracotta hover:text-white transition-all duration-300 group shadow-sm"
                  aria-label="Next"
                >
                  <ChevronRight
                    size={24}
                    className="group-active:scale-90 transition-transform"
                  />
                </button>
              </div>
            </div>

            <div
              ref={scrollContainerRef}
              className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {galleryItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -10 }}
                  className="min-w-[280px] md:min-w-[400px] h-[500px] relative rounded-2xl overflow-hidden snap-start cursor-pointer group shadow-lg"
                >
                  <img
                    src={item.image}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    alt={item.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-10 left-10 right-10 text-white">
                    <h3 className="text-3xl font-serif mb-4 leading-tight">
                      {item.title}
                    </h3>
                    {item.link ? (
                      <Link
                        href={item.link}
                        className="inline-flex items-center text-sm font-bold uppercase tracking-[0.2em] border-b-2 border-terracotta pb-1 hover:text-terracotta transition-colors"
                      >
                        Explore Collection{' '}
                        <ArrowRight size={16} className="ml-3" />
                      </Link>
                    ) : (
                      <span className="inline-flex items-center text-sm font-bold uppercase tracking-[0.2em] opacity-60">
                        Available Soon
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-serif text-text-body mb-2">
                Trending Now
              </h2>
              <p className="text-text-muted">
                Most coveted pieces this season.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-terracotta font-medium hover:underline hidden sm:block"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-12 text-center sm:hidden">
            <Button variant="outline">View All Products</Button>
          </div>
        </div>
      </section>

      {/* NEW: Bespoke Section on Home */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-text-body text-white rounded-2xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-12 lg:p-20 flex flex-col justify-center">
                <span className="text-terracotta uppercase tracking-widest text-sm font-bold mb-6">
                  Bespoke Services
                </span>
                <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
                  Create a Rug That Is <br /> Uniquely Yours
                </h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  From custom sizes to color matching and completely new
                  designs, our master artisans bring your vision to life.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => openBespokeModal('Home Page Section')}
                    className="bg-white text-text-body hover:bg-gray-100"
                  >
                    Start Custom Project
                  </Button>
                  <Link href="/bespoke">
                    <Button
                      variant="outline"
                      className="border-gray-600 text-white hover:border-white"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative h-[400px] lg:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Custom Rug Design"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story / Editorial */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1599303000936-1cf21eac4456?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80"
                alt="Artisan weaving"
                className="rounded-lg shadow-xl object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6">
                Hand-Knotted Heritage
              </h2>
              <p className="text-text-muted mb-6 leading-relaxed">
                Every Vinayka rug is a testament to patience and precision. Our
                artisans in rural India spend months tying millions of knots by
                hand, translating visionary designs into heirloom-quality
                textiles.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-terracotta shrink-0">
                    <Star size={18} />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-lg">
                      Ethical Craftsmanship
                    </h4>
                    <p className="text-sm text-text-muted">
                      Fair wages and safe working conditions for our 2,000+
                      weaver family.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-terracotta shrink-0">
                    <Star size={18} />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-lg">
                      Sustainable Materials
                    </h4>
                    <p className="text-sm text-text-muted">
                      Using only the finest hand-spun wool, bamboo silk, and
                      natural dyes.
                    </p>
                  </div>
                </div>
              </div>
              <Link
                href="/about"
                className="text-terracotta font-medium hover:underline inline-flex items-center"
              >
                Read Our Story <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
