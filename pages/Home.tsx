import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { MOCK_PRODUCTS, COLLECTIONS } from '../constants';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';

const Home: React.FC = () => {
  const featuredProducts = MOCK_PRODUCTS.slice(0, 4);

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
            <span className="text-white/90 text-sm md:text-base tracking-[0.3em] uppercase">The Art of Flooring</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white font-medium leading-tight">
              Weave Stories Into <br/> <span className="text-terracotta italic">Every Room</span>
            </h1>
            <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto font-light">
              Hand-knotted masterpieces that blend ancient craftsmanship with contemporary vision.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <Button size="lg" className="min-w-[180px]">Shop Collection</Button>
              </Link>
              <Link to="/bespoke">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black min-w-[180px]">
                   Bespoke Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-text-body mb-4">Curated Collections</h2>
            <div className="w-16 h-0.5 bg-terracotta mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="group relative h-[400px] overflow-hidden rounded-lg cursor-pointer">
                <img src="https://picsum.photos/id/103/800/1000" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Modern" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-2xl font-serif mb-2">Modern</h3>
                  <Link to="/shop?cat=Modern" className="inline-flex items-center text-sm uppercase tracking-wider hover:underline">
                    Explore <ArrowRight size={14} className="ml-2" />
                  </Link>
                </div>
             </div>
             <div className="group relative h-[400px] overflow-hidden rounded-lg cursor-pointer md:-mt-8">
                <img src="https://picsum.photos/id/238/800/1000" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Traditional" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-2xl font-serif mb-2">Viraasat</h3>
                  <Link to="/shop?collection=Viraasat" className="inline-flex items-center text-sm uppercase tracking-wider hover:underline">
                    Explore <ArrowRight size={14} className="ml-2" />
                  </Link>
                </div>
             </div>
             <div className="group relative h-[400px] overflow-hidden rounded-lg cursor-pointer">
                <img src="https://picsum.photos/id/60/800/1000" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Silk" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-2xl font-serif mb-2">Silk Route</h3>
                  <Link to="/shop?collection=Silk Route" className="inline-flex items-center text-sm uppercase tracking-wider hover:underline">
                    Explore <ArrowRight size={14} className="ml-2" />
                  </Link>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
             <div>
               <h2 className="text-3xl font-serif text-text-body mb-2">Trending Now</h2>
               <p className="text-text-muted">Most coveted pieces this season.</p>
             </div>
             <Link to="/shop" className="text-terracotta font-medium hover:underline hidden sm:block">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-12 text-center sm:hidden">
             <Button variant="outline">View All Products</Button>
          </div>
        </div>
      </section>

      {/* Event Promo */}
      <section className="py-24 bg-teal relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 text-white">
              <div className="inline-block px-3 py-1 bg-amber text-black text-xs font-bold uppercase tracking-widest mb-4">Upcoming Event</div>
              <h2 className="text-4xl md:text-5xl font-serif mb-6">India Design ID 2025</h2>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                Experience the art of contemporary craft. Join us as we unveil our exclusive 'Manchaha' collection, designed by rural artisans.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/events">
                  <Button className="bg-white text-teal hover:bg-gray-100 border-none">Get Tickets</Button>
                </Link>
                <Link to="/events">
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white">View Booth Details</Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative">
               <div className="relative z-10 rounded-lg overflow-hidden border-8 border-white/10 shadow-2xl">
                 <img src="https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Exhibition Booth" className="w-full h-auto" />
               </div>
               <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Story / Editorial */}
      <section className="py-20 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                 <img src="https://images.unsplash.com/photo-1596238647038-d6c57f7243c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Artisan weaving" className="rounded-lg shadow-xl" />
              </div>
              <div className="order-1 lg:order-2">
                 <h2 className="text-3xl md:text-4xl font-serif mb-6">Hand-Knotted Heritage</h2>
                 <p className="text-text-muted mb-6 leading-relaxed">
                   Every Vinayka rug is a testament to patience and precision. Our artisans in rural India spend months tying millions of knots by hand, translating visionary designs into heirloom-quality textiles.
                 </p>
                 <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-terracotta shrink-0">
                         <Star size={18} />
                       </div>
                       <div>
                         <h4 className="font-serif font-bold text-lg">Ethical Craftsmanship</h4>
                         <p className="text-sm text-text-muted">Fair wages and safe working conditions for our 2,000+ weaver family.</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-terracotta shrink-0">
                         <Star size={18} />
                       </div>
                       <div>
                         <h4 className="font-serif font-bold text-lg">Sustainable Materials</h4>
                         <p className="text-sm text-text-muted">Using only the finest hand-spun wool, bamboo silk, and natural dyes.</p>
                       </div>
                    </div>
                 </div>
                 <Link to="/about" className="text-terracotta font-medium hover:underline inline-flex items-center">
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