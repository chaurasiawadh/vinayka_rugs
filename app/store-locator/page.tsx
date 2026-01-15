'use client';

import React from 'react';
// import Button from '../../components/Button';
import { Phone, Clock, Mail, FileText } from 'lucide-react';

interface StoreLocation {
  id: string;
  type: string;
  city: string;
  name: string;
  address: string[];
  hours: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  gstin?: string;
  image: string;
  mapLink: string;
}

const LOCATIONS: StoreLocation[] = [
  {
    id: '1',
    type: 'Vinayka Rugs',
    city: 'Bhadohi | Varanasi',
    name: 'Vinayka Rugs',
    address: ['Bhadohi , Varanasi', 'Uttar Pradesh'],
    hours: 'Mon - Sun : 10am - 8pm',
    phone: '+91 9250491858',
    whatsapp: '9250491858',
    image:
      'https://f5ub3ywvhr.ufs.sh/f/Hmsrx7gap6B2jLi3qs0Mm7rGDItZJY2vQCpbxHc1KdPXgko4',
    mapLink: 'https://maps.google.com/?q=Vinayka+Gallery+Bhadohi',
  },
  {
    id: '2',
    type: 'Manufacturer & Exporter',
    city: 'Bhadohi',
    name: 'SHYAMA EXPORTS',
    address: [
      'Chauri Bazar (Main Road), Parsipur',
      'Bhadohi-221 402, (U.P.) INDIA',
    ],
    hours: 'Mon - Sat : 9am - 7pm',
    phone: '+91-9580122122',
    email: 'mailtoshyamaexports@gmail.com',
    gstin: '09APJPJ3572L1ZE',
    image:
      'https://f5ub3ywvhr.ufs.sh/f/Hmsrx7gap6B2tLkK1mCB0YgcxnrQpOvMLloCya1skduSKPF2',
    mapLink: 'https://maps.google.com/?q=Shyama+Exports+Bhadohi',
  },
];

const StoreLocator = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Simple Header */}
      <div className="bg-cream py-12 md:py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-serif text-text-body mb-4">
          Visit Our Stores
        </h1>
        <p className="text-text-muted max-w-2xl mx-auto">
          Experience the texture and artistry of our hand-knotted rugs in
          person.
        </p>
      </div>

      <div className="flex flex-col">
        {LOCATIONS.map((location, index) => (
          <section
            key={location.id}
            className={`flex flex-col md:flex-row items-center w-full min-h-[600px] ${index % 2 !== 0 ? 'bg-cream/30' : 'bg-white'}`}
          >
            {/* Image Side */}
            <div
              className={`w-full md:w-1/2 h-[400px] md:h-[600px] relative overflow-hidden ${index % 2 !== 0 ? 'md:order-2' : ''}`}
            >
              <img
                src={location.image}
                alt={`${location.city} Store`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Content Side */}
            <div
              className={`w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center ${index % 2 !== 0 ? 'md:order-1 items-end text-right' : 'items-start text-left'}`}
            >
              <div
                className={`max-w-md ${index % 2 !== 0 ? 'mr-auto md:mr-0 md:ml-auto' : ''}`}
              >
                <span className="text-xs font-bold tracking-[0.2em] text-text-muted uppercase mb-4 block">
                  {location.type}
                </span>

                <h2 className="text-3xl md:text-4xl font-serif text-text-body mb-6">
                  {location.city}
                </h2>

                <div className="space-y-6 text-text-muted mb-8 font-light leading-relaxed">
                  <div>
                    <h3 className="font-medium text-text-body mb-1">
                      {location.name}
                    </h3>
                    {location.address.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>

                  <div
                    className={`flex items-center gap-3 ${index % 2 !== 0 ? 'flex-row-reverse md:flex-row-reverse' : ''}`}
                  >
                    <Clock size={18} className="text-terracotta shrink-0" />
                    <p>{location.hours}</p>
                  </div>

                  <div
                    className={`flex items-center gap-3 ${index % 2 !== 0 ? 'flex-row-reverse md:flex-row-reverse' : ''}`}
                  >
                    <Phone size={18} className="text-terracotta shrink-0" />
                    <div
                      className={`flex flex-col ${index % 2 !== 0 ? 'items-end' : 'items-start'}`}
                    >
                      {location.phone.split(',').map((p, i) => (
                        <a
                          key={i}
                          href={`tel:${p.trim()}`}
                          className="hover:text-terracotta transition-colors underline decoration-1 underline-offset-4 block"
                        >
                          {p.trim()}
                        </a>
                      ))}
                    </div>
                  </div>

                  {location.whatsapp && (
                    <div
                      className={`flex items-center gap-3 ${index % 2 !== 0 ? 'flex-row-reverse md:flex-row-reverse' : ''}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-terracotta shrink-0"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.304-5.252l.002-.005a9.88 9.88 0 019.897-9.875c2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      <a
                        href={`https://wa.me/${location.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-terracotta transition-colors underline decoration-1 underline-offset-4"
                      >
                        {location.whatsapp}
                      </a>
                    </div>
                  )}

                  {location.email && (
                    <div
                      className={`flex items-center gap-3 ${index % 2 !== 0 ? 'flex-row-reverse md:flex-row-reverse' : ''}`}
                    >
                      <Mail size={18} className="text-terracotta shrink-0" />
                      <a
                        href={`mailto:${location.email}`}
                        className="hover:text-terracotta transition-colors underline decoration-1 underline-offset-4 break-all"
                      >
                        {location.email}
                      </a>
                    </div>
                  )}

                  {location.gstin && (
                    <div
                      className={`flex items-center gap-3 ${index % 2 !== 0 ? 'flex-row-reverse md:flex-row-reverse' : ''}`}
                    >
                      <FileText
                        size={18}
                        className="text-terracotta shrink-0"
                      />
                      <span className="text-text-muted text-sm">
                        GSTIN: {location.gstin}
                      </span>
                    </div>
                  )}
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
