"use client";

import React, { useState } from 'react';
import Button from '@/components/Button';
import { Calendar, MapPin, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import ImageSmart from '@/components/ImageSmart';
import AppointmentModal from '@/components/AppointmentModal';
import { useShop } from '@/context/ShopContext';

const Events: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeEventName, setActiveEventName] = useState('India Design ID 2025');
    const { openBespokeModal } = useShop();

    const openAppointment = (eventName: string) => {
        setActiveEventName(eventName);
        setIsModalOpen(true);
    };

    const galleryImages = [
        'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1560457079-9a6532ccb118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Intentionally using a working image, but smart component will handle errors if url breaks
        'https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1596238647038-d6c57f7243c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ];

    return (
        <div className="bg-white">
            {/* Appointment Modal */}
            <AppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                eventName={activeEventName}
            />

            {/* Hero Section */}
            <section className="relative h-[70vh] w-full bg-gray-900 overflow-hidden">
                <ImageSmart
                    src="https://images.unsplash.com/photo-1558618007-d4008cc0d4e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80"
                    alt="Exhibition Hall"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-20">
                    <div className="animate-slide-up max-w-3xl">
                        <span className="inline-block px-3 py-1 bg-amber text-black text-xs font-bold uppercase tracking-widest mb-6 rounded-sm">
                            Flagship Event
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight">
                            India Design ID <br />
                            <span className="text-white/70">2025</span>
                        </h1>
                        <p className="text-xl text-gray-200 font-light mb-8 max-w-2xl leading-relaxed">
                            Join Vinayka Rugs at the country's most definitive design week. Experience the launch of our 'Manchaha' collection.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                onClick={() => openAppointment('India Design ID 2025')}
                                className="bg-terracotta border-terracotta hover:bg-[#7a5233]"
                            >
                                Request Appointment
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="text-white border-white hover:bg-white hover:text-black"
                                onClick={() => document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                View Details
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Info Bar */}
            <div className="bg-teal text-white relative z-20 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
                    <div className="p-6 flex items-center gap-4 justify-center md:justify-start">
                        <Calendar size={28} className="text-amber shrink-0" />
                        <div>
                            <h3 className="font-serif text-lg">Feb 15 - 18, 2025</h3>
                            <p className="text-sm text-white/70">Save the date</p>
                        </div>
                    </div>
                    <div className="p-6 flex items-center gap-4 justify-center md:justify-start">
                        <MapPin size={28} className="text-amber shrink-0" />
                        <div>
                            <h3 className="font-serif text-lg">NSIC Grounds, Okhla</h3>
                            <p className="text-sm text-white/70">Booth #A12, Pavilion 3</p>
                        </div>
                    </div>
                    <div className="p-6 flex items-center gap-4 justify-center md:justify-start">
                        <Clock size={28} className="text-amber shrink-0" />
                        <div>
                            <h3 className="font-serif text-lg">11:00 AM - 8:00 PM</h3>
                            <p className="text-sm text-white/70">Daily Access</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <section id="details" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Content */}
                    <div className="lg:col-span-8 space-y-12">
                        <div>
                            <h2 className="text-3xl font-serif text-text-body mb-6">The 'Manchaha' Installation</h2>
                            <p className="text-text-muted leading-relaxed text-lg mb-6">
                                For the first time in Delhi, experience our award-winning 'Manchaha' (My Heart's Desire) collection. This initiative empowers weavers to create their own designs, resulting in raw, unscripted art pieces that tell personal stories of village life, dreams, and culture.
                            </p>
                            <p className="text-text-muted leading-relaxed text-lg">
                                Our booth at Pavilion 3 is designed as an immersive journey through the rural landscapes of Rajasthan. Visitors will have the opportunity to interact with the master weavers and understand the zero-waste philosophy behind these unique rugs.
                            </p>
                        </div>

                        {/* Gallery Grid */}
                        <div>
                            <h3 className="font-serif text-xl mb-6 flex items-center gap-2">
                                <span className="w-8 h-px bg-terracotta"></span> Gallery
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {galleryImages.map((src, i) => (
                                    <ImageSmart
                                        key={i}
                                        src={src}
                                        alt={`Event Gallery ${i + 1}`}
                                        className={`rounded-lg hover:opacity-90 transition-opacity cursor-pointer ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar (Sticky) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-28 space-y-8">
                            {/* Appointment Card */}
                            <div className="bg-cream rounded-xl p-8 border border-gray-100 shadow-sm">
                                <h3 className="font-serif text-2xl mb-2">Book a Viewing</h3>
                                <p className="text-sm text-text-muted mb-6">
                                    Schedule a dedicated time with our consultants at the event for B2B enquiries or bespoke consultations.
                                </p>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-start gap-3 text-sm text-text-body">
                                        <CheckCircle2 size={16} className="text-success mt-0.5" />
                                        <span>Skip the queue with priority access</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-text-body">
                                        <CheckCircle2 size={16} className="text-success mt-0.5" />
                                        <span>Personalized collection walkthrough</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-text-body">
                                        <CheckCircle2 size={16} className="text-success mt-0.5" />
                                        <span>Exclusive trade catalog preview</span>
                                    </li>
                                </ul>
                                <Button fullWidth onClick={() => openAppointment('India Design ID 2025')}>
                                    Request Appointment
                                </Button>
                                <p className="text-xs text-center text-text-muted mt-3">
                                    Instant confirmation via WhatsApp
                                </p>

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <p className="text-sm font-medium mb-3 text-center">Looking for custom work?</p>
                                    <Button
                                        fullWidth
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openBespokeModal('Event Page Sidebar')}
                                    >
                                        Book Bespoke Consultation
                                    </Button>
                                </div>
                            </div>

                            {/* Location Map Placeholder */}
                            <div className="bg-gray-100 rounded-xl overflow-hidden h-64 relative group">
                                <ImageSmart
                                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                                    alt="Map Location"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Button variant="secondary" size="sm" className="pointer-events-none">
                                        <MapPin size={16} className="mr-2" /> View on Map
                                    </Button>
                                </div>
                                <a
                                    href="https://maps.google.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 z-10"
                                    aria-label="View location on Google Maps"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* More Events List */}
            <section className="bg-gray-50 py-20 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-serif mb-12 text-center">Upcoming Exhibitions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {/* Event Card 1 */}
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                            <div className="h-48 overflow-hidden relative">
                                <ImageSmart
                                    src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    alt="Maison"
                                />
                                <div className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">Sep 2025</div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-serif text-xl mb-2">Maison & Objet</h3>
                                <p className="text-text-muted text-sm mb-4 line-clamp-2">
                                    Paris Design Week. Discover our new Silk Route edit inspired by the dunes of Jaisalmer.
                                </p>
                                <div className="flex items-center text-sm text-text-muted mb-6">
                                    <MapPin size={16} className="mr-2" /> Paris, France
                                </div>
                                <Button
                                    variant="outline"
                                    fullWidth
                                    size="sm"
                                    onClick={() => openAppointment('Maison & Objet Paris')}
                                >
                                    Request Appointment
                                </Button>
                            </div>
                        </div>

                        {/* Event Card 2 */}
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                            <div className="h-48 overflow-hidden relative">
                                <ImageSmart
                                    src="https://images.unsplash.com/photo-1531835551805-16d864c8d311?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    alt="Salone"
                                />
                                <div className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">Apr 2026</div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-serif text-xl mb-2">Salone del Mobile</h3>
                                <p className="text-text-muted text-sm mb-4 line-clamp-2">
                                    The world's most important furniture fair. We will be showcasing large format installations.
                                </p>
                                <div className="flex items-center text-sm text-text-muted mb-6">
                                    <MapPin size={16} className="mr-2" /> Milan, Italy
                                </div>
                                <Button
                                    variant="outline"
                                    fullWidth
                                    size="sm"
                                    onClick={() => openAppointment('Salone del Mobile Milan')}
                                >
                                    Request Appointment
                                </Button>
                            </div>
                        </div>

                        {/* Event Card 3 */}
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                            <div className="h-48 overflow-hidden relative">
                                <ImageSmart
                                    src="https://plus.unsplash.com/premium_photo-1661281350976-59b9514e5364?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    alt="Dubai"
                                />
                                <div className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">Nov 2025</div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-serif text-xl mb-2">Downtown Design</h3>
                                <p className="text-text-muted text-sm mb-4 line-clamp-2">
                                    Middle East's leading design fair. Exploring the intersection of traditional craft and modern luxury.
                                </p>
                                <div className="flex items-center text-sm text-text-muted mb-6">
                                    <MapPin size={16} className="mr-2" /> Dubai, UAE
                                </div>
                                <Button
                                    variant="outline"
                                    fullWidth
                                    size="sm"
                                    onClick={() => openAppointment('Downtown Design Dubai')}
                                >
                                    Request Appointment
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default Events;
