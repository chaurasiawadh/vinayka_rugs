
"use client";

import React from 'react';
import Button from '../../components/Button';
import { MapPin, Phone, Clock } from 'lucide-react';

interface StoreLocation {
  id: string;
  type: string;
  city: string;
  name: string;
  address: string[];
  hours: string;
  phone: string;
  image: string;
  mapLink: string;
}

const LOCATIONS: StoreLocation[] = [
  {
    id: '1',
    type: 'Vinayka Gallery',
    city: 'Noida | Delhi',
    name: 'Vinayka Experiential Centre',
    address: ['E-131, Sector - 63', 'Noida, Uttar Pradesh 201301'],
    hours: 'Mon - Sat : 10am - 6pm',
    phone: '+91 9936169852',
    image: 'https://placehold.co/800x600?text=Vinayka+Gallery',
    mapLink: 'https://maps.google.com/?q=Vinayka+Rugs+Noida'
  },
  {
    id: '2',
    type: 'Partner Store',
    city: 'Bangalore',
    name: 'Vinayka x LVNG Studio',
    address: ['100ft Road, Indiranagar', 'Bangalore, Karnataka 560038'],
    hours: 'Mon - Sun : 11am - 8pm',
    phone: '+91 9936169852',
    image: 'https://placehold.co/800x600?text=Partner+Store',
    mapLink: 'https://maps.google.com'
  }
];

const StoreLocator = () => {
  return (
    <div className="bg-white min-h-screen">
       {/* Simple Header */}
       <div className="bg-cream py-12 md:py-20 text-center px-4">
            <h1 className="text-4xl md:text-5xl font-serif text-text-body mb-4">Visit Our Stores</h1>
            <p className="text-text-muted max-w-2xl mx-auto">Experience the texture and artistry of our hand-knotted rugs in person.</p>
        </div>

      <div className="flex flex-col">
        {LOCATIONS.map((location, index) => (
          <section 
            key={location.id} 
            className={`flex flex-col md:flex-row items-center w-full min-h-[600px] ${index % 2 !== 0 ? 'bg-cream/30' : 'bg-white'}`}
          >
            {/* Image Side */}
            <div className={`w-full md:w-1/2 h-[400px] md:h-[600px] relative overflow-hidden ${index % 2 !== 0 ? 'md:order-2' : ''}`}>
              <img 
                src={location.image} 
                alt={`${location.city} Store`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Content Side */}
            <div className={`w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center ${index % 2 !== 0 ? 'md:order-1 items-end text-right' : 'items-start text-left'}`}>
              <div className={`max-w-md ${index % 2 !== 0 ? 'mr-auto md:mr-0 md:ml-auto' : ''}`}>
                <span className="text-xs font-bold tracking-[0.2em] text-text-muted uppercase mb-4 block">
                  {location.type}
                </span>
                
                <h2 className="text-3xl md:text-4xl font-serif text-text-body mb-6">
                  {location.city}
                </h2>
                
                <div className="space-y-6 text-text-muted mb-8 font-light leading-relaxed">
                  <div>
                    <h3 className="font-medium text-text-body mb-1">{location.name}</h3>
                    {location.address.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                  
                  <div className={`flex items-center gap-3 ${index % 2 !== 0 ? 'flex-row-reverse md:flex-row-reverse' : ''}`}>
                    <Clock size={18} className="text-terracotta shrink-0" />
                    <p>{location.hours}</p>
                  </div>

                  <div className={`flex items-center gap-3 ${index % 2 !== 0 ? 'flex-row-reverse md:flex-row-reverse' : ''}`}>
                    <Phone size={18} className="text-terracotta shrink-0" />
                    <a href={`tel:${location.phone}`} className="hover:text-terracotta transition-colors underline decoration-1 underline-offset-4">
                      {location.phone}
                    </a>
                  </div>
                </div>

                <a 
                  href={location.mapLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <button className="bg-gray-100 hover:bg-gray-200 text-text-body text-xs font-bold py-4 px-8 uppercase tracking-widest transition-colors duration-300">
                    Get Directions
                  </button>
                </a>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default StoreLocator;
