'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { useShop } from '../context/ShopContext';
import { useCollection } from '@/hooks/useFirestore';
import { GalleryItem } from '@/types';
import { motion } from 'framer-motion';
import UploadPrompt from '../components/visualizer/UploadPrompt';

const HERO_IMAGES = [
  'https://f5ub3ywvhr.ufs.sh/f/Hmsrx7gap6B2Q2MIez8S9sfGP4g5WohVpmUMOQxJqdkLFTcy',
  'https://f5ub3ywvhr.ufs.sh/f/Hmsrx7gap6B2HPyTCIegap6B2L74KthM1CeG0Y9ENXbDOvFS',
  'https://f5ub3ywvhr.ufs.sh/f/Hmsrx7gap6B21hbtJhvY0p3ukrcz4Bo8JlQw5TsevVaWSF1n',
  'https://f5ub3ywvhr.ufs.sh/f/Hmsrx7gap6B2SmHUNeldaI2ulv5ywRb6cpBAWTjkPZ1VE7MD',
];

const HomeClient: React.FC = () => {
  const { products, openBespokeModal } = useShop();
  const galleryItems = useCollection('gallery') as GalleryItem[];
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const [bgImage, setBgImage] = React.useState<string>('');
  const [imageLoaded, setImageLoaded] = React.useState(false);

  React.useEffect(() => {
    // Select a random image on mount
    const randomImg =
      HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)];
    setBgImage(randomImg);
  }, []);

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
    <div className="animate-fade-in relative">
      {/* Hero Section Redesign */}
      <section className="relative h-screen min-h-[700px] w-full flex items-center justify-center overflow-hidden bg-black">
        {/* Background Image */}
        {bgImage && (
          <img
            src={bgImage}
            alt="Luxury Rugs Interior"
            onLoad={() => setImageLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Dark Overlay for Readability */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-20 w-full flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex flex-col space-y-6 items-center max-w-4xl"
          >
            <span className="text-white/90 text-xs md:text-sm font-bold tracking-[0.4em] uppercase drop-shadow-md">
              The Art of Flooring
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white font-medium leading-[1.1] drop-shadow-lg">
              Weave Stories <br />
              Into <span className="italic text-white/90">Every Room</span>
            </h1>

            <p className="text-gray-200 text-lg md:text-xl max-w-2xl font-light leading-relaxed drop-shadow-md mt-6">
              Hand-knotted masterpieces blending tradition and modern luxury for
              timeless interiors.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 mt-10 justify-center">
              <Link href="/shop">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className="min-w-[200px] bg-[#C19A6B] text-white hover:bg-[#A88256] rounded-full py-6 text-sm tracking-widest uppercase font-serif shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    Shop Collection
                  </Button>
                </motion.div>
              </Link>
            </div>

            {/* Trust Indicators - Now centered at the bottom of the hero text block */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-16 flex items-center justify-center gap-12 border-t border-white/20 pt-8"
            >
              <div className="flex flex-col items-center">
                <span className="text-3xl font-serif font-bold text-white drop-shadow-md">
                  2K+
                </span>
                <span className="text-[10px] uppercase tracking-widest text-white/80 mt-1">
                  Master Weavers
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-serif font-bold text-white drop-shadow-md">
                  150+
                </span>
                <span className="text-[10px] uppercase tracking-widest text-white/80 mt-1">
                  Global Awards
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* NEW: Room Visualizer Section */}
      <section className="py-16 bg-[#FAF8F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <span className="text-terracotta uppercase tracking-widest text-xs font-bold mb-4">
                  Try Before You Buy
                </span>
                <h2 className="text-3xl md:text-4xl font-serif mb-4 text-gray-900 leading-tight">
                  Visualize Our Rugs in <br />
                  <span className="italic text-terracotta">Your Own Room</span>
                </h2>
                <p className="text-gray-500 mb-8 max-w-md">
                  Unsure about the size or color? Upload a photo of your space
                  and virtually place our rugs to find the perfect match.
                </p>
                <div className="w-full max-w-md">
                  <UploadPrompt />
                </div>
              </div>
              <div className="relative h-[300px] lg:h-auto bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Room Visualizer Demo"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-xs font-bold shadow-sm">
                  Interactive Demo
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
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

export default HomeClient;
