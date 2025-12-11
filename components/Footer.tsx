import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, MapPin, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1C1C1C] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-white">Vinayka<span className="font-light text-terracotta">Rugs</span></h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Crafting legacy since 1982. We weave stories into every knot, bringing the timeless art of handmade luxury to your modern home.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif mb-6">Explore</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/shop" className="hover:text-terracotta transition-colors">All Rugs</Link></li>
              <li><Link to="/shop?cat=Modern" className="hover:text-terracotta transition-colors">Modern Collection</Link></li>
              <li><Link to="/shop?cat=Traditional" className="hover:text-terracotta transition-colors">Traditional & Vintage</Link></li>
              <li><Link to="/events" className="hover:text-terracotta transition-colors">Events & Exhibitions</Link></li>
              <li><Link to="/lookbook" className="hover:text-terracotta transition-colors">Lookbook</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-lg font-serif mb-6">Support</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/contact" className="hover:text-terracotta transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-terracotta transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/care" className="hover:text-terracotta transition-colors">Rug Care Guide</Link></li>
              <li><Link to="/trade" className="hover:text-terracotta transition-colors">Trade Program</Link></li>
              <li><Link to="/admin" className="hover:text-terracotta transition-colors">Admin Login</Link></li>
            </ul>
          </div>

          {/* Contact / Newsletter */}
          <div>
             <h3 className="text-lg font-serif mb-6">Visit Us</h3>
             <ul className="space-y-3 text-sm text-gray-400 mb-6">
               <li className="flex items-start gap-3">
                 <MapPin size={18} className="shrink-0 mt-0.5 text-terracotta" />
                 <span>Lanka BHU,<br/>Varanasi, India</span>
               </li>
               <li className="flex items-center gap-3">
                 <Phone size={18} className="text-terracotta" />
                 <span>+91 9936169852</span>
               </li>
               <li className="flex items-center gap-3">
                 <Mail size={18} className="text-terracotta" />
                 <span>info@vinaykarugs.com</span>
               </li>
             </ul>
             <div className="relative">
               <input 
                 type="email" 
                 placeholder="Join our newsletter" 
                 className="w-full bg-white/10 border border-white/20 rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-terracotta placeholder-gray-500"
               />
               <button className="absolute right-2 top-2 text-xs font-bold text-terracotta uppercase tracking-wider hover:text-white transition-colors">
                 Subscribe
               </button>
             </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; 2026 Vinayka Rugs. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             <Link to="/privacy">Privacy Policy</Link>
             <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;