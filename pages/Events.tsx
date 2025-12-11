import React from 'react';
import Button from '../components/Button';
import { Calendar, MapPin, Clock } from 'lucide-react';

const Events: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Event Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img 
            src="https://images.unsplash.com/photo-1558618007-d4008cc0d4e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80" 
            alt="Art Gallery" 
            className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white px-4">
            <span className="uppercase tracking-[0.2em] mb-4 block animate-slide-up">Exhibition</span>
            <h1 className="text-5xl md:text-7xl font-serif mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>India Design ID 2025</h1>
            <p className="text-xl font-light mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
                Join Vinayka Rugs at the country's most definitive design week.
            </p>
            <Button size="lg" className="bg-white text-black hover:bg-gray-200">Get Tickets</Button>
        </div>
      </section>

      {/* Info Bar */}
      <section className="bg-teal text-white py-12">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
             <div className="flex flex-col items-center gap-3">
                <Calendar size={32} className="text-amber" />
                <h3 className="text-xl font-serif">Feb 15 - 18, 2025</h3>
             </div>
             <div className="flex flex-col items-center gap-3">
                <MapPin size={32} className="text-amber" />
                <h3 className="text-xl font-serif">NSIC Grounds, Okhla, New Delhi</h3>
                <span className="text-sm opacity-80">Booth #A12, Pavilion 3</span>
             </div>
             <div className="flex flex-col items-center gap-3">
                <Clock size={32} className="text-amber" />
                <h3 className="text-xl font-serif">11:00 AM - 8:00 PM</h3>
             </div>
          </div>
      </section>

      {/* Highlights */}
      <section className="py-20">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
               <div className="space-y-6">
                  <h2 className="text-4xl font-serif text-text-body">The 'Manchaha' Installation</h2>
                  <p className="text-text-muted leading-relaxed text-lg">
                      For the first time in Delhi, experience our award-winning 'Manchaha' (My Heart's Desire) collection. This initiative empowers weavers to create their own designs, resulting in raw, unscripted art pieces that tell personal stories of village life, dreams, and culture.
                  </p>
                  <p className="text-text-muted leading-relaxed text-lg">
                      Visit our interactive booth to meet the artisans behind the looms and try your hand at tying a knot.
                  </p>
                  <Button>Download Press Kit</Button>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <img src="https://picsum.photos/id/106/600/800" className="rounded-lg translate-y-8" alt="Installation 1" />
                  <img src="https://picsum.photos/id/111/600/800" className="rounded-lg" alt="Installation 2" />
               </div>
            </div>
         </div>
      </section>

      {/* RSVP Form */}
      <section className="bg-cream py-20">
         <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-serif mb-4">Book a Private Viewing</h2>
            <p className="text-text-muted mb-8">Schedule a dedicated time with our consultants at the event for B2B enquiries or bespoke consultations.</p>
            <form className="bg-white p-8 rounded-xl shadow-sm text-left space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input type="text" className="w-full border border-gray-300 rounded p-2" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium mb-1">Company (Optional)</label>
                      <input type="text" className="w-full border border-gray-300 rounded p-2" />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" className="w-full border border-gray-300 rounded p-2" />
               </div>
               <div>
                  <label className="block text-sm font-medium mb-1">Preferred Date</label>
                  <select className="w-full border border-gray-300 rounded p-2">
                      <option>Feb 15, 2025</option>
                      <option>Feb 16, 2025</option>
                      <option>Feb 17, 2025</option>
                      <option>Feb 18, 2025</option>
                  </select>
               </div>
               <Button fullWidth>Request Appointment</Button>
            </form>
         </div>
      </section>
    </div>
  );
};

export default Events;