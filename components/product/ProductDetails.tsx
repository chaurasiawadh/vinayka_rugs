"use client";

import { useState } from 'react';
import { Minus, Plus, Heart, Share2, Star, ChevronDown, ChevronUp, Check } from 'lucide-react';
import ProductCard from './ProductCard';

interface ProductDetailsProps {
    product: any;
    relatedProducts: any[];
    reviews: any[];
    faqs: any[];
}

export default function ProductDetails({ product, relatedProducts, reviews, faqs }: ProductDetailsProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : null);

    // Accordion states
    const [openSection, setOpenSection] = useState<string | null>('detail');

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div className="bg-[#FAF8F6] min-h-screen pb-20">

            <div className="container mx-auto px-4">
                <div className="bg-white rounded-none p-6 md:p-12 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                        {/* Left: Image Gallery */}
                        <div className="flex flex-col-reverse md:flex-row gap-4">
                            {/* Thumbnails */}
                            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible scrollbar-hide">
                                {product.images.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`w-20 h-20 bg-gray-50 flex-shrink-0 border transition-colors ${selectedImage === idx ? 'border-[#41354D]' : 'border-transparent hover:border-gray-200'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="flex-1 relative">
                                <div className="aspect-[3/4] md:aspect-[4/5] w-full max-h-[600px] bg-[#FAFAFA] rounded-2xl overflow-hidden relative shadow-sm">
                                    <img
                                        src={product.images[selectedImage]}
                                        alt={product.name}
                                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-in-out"
                                    />
                                    {product.tags && (
                                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-gray-100 text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider rounded-full shadow-sm text-gray-900">
                                            {product.tags[0]}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right: Product Info */}
                        <div className="flex flex-col">
                            <h2 className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-2">{product.brand}</h2>
                            <h1 className="text-4xl font-serif text-[#111] mb-4 leading-tight">{product.name}</h1>

                            <div className="flex items-center space-x-4 mb-6">
                                <div className="flex text-[#D4C49D]">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'}`} />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">{product.reviewsCount} reviews</span>
                            </div>

                            <div className="flex items-center space-x-4 mb-8">
                                <span className="text-xl font-medium text-[#111]">${product.price.toFixed(2)}</span>
                                {product.originalPrice && (
                                    <>
                                        <span className="text-lg text-gray-300 line-through">${product.originalPrice.toFixed(2)}</span>
                                        <span className="bg-[#E5F0D0] text-[#5C7030] text-xs font-bold px-2 py-1 rounded-sm">
                                            {product.discount}
                                        </span>
                                    </>
                                )}
                            </div>

                            <p className="text-gray-600 leading-relaxed mb-8 text-sm">
                                {product.description}
                            </p>

                            {/* Size Selector */}
                            <div className="mb-8">
                                <span className="text-sm font-medium text-gray-900 block mb-3">Size:</span>
                                <div className="flex bg-[#F3F3F3] p-1 rounded-full w-full md:w-auto self-start">
                                    {product.sizes.map((size: string) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`flex-1 py-3 px-6 text-sm font-medium rounded-full transition-all ${selectedSize === size
                                                ? 'bg-[#E5F0D0] text-black shadow-sm'
                                                : 'text-gray-500 hover:text-gray-900'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8 pb-8 border-b border-gray-100">
                                <div className="flex items-center border border-gray-200 rounded-full h-12 w-full sm:w-32">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <input
                                        type="text"
                                        value={quantity}
                                        readOnly
                                        className="flex-1 w-full text-center text-sm font-medium focus:outline-none"
                                    />
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                                <button className="flex-1 bg-[#41354D] text-white h-12 rounded-lg font-medium tracking-wide hover:bg-[#2D2435] transition-colors uppercase text-sm">
                                    Add to Cart
                                </button>
                                <button className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                                    <Heart className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="text-xs text-gray-400 flex items-center gap-2 mb-12">
                                <span>Ships for free the week of February 14th.</span>
                                <span>ⓘ</span>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 bg-gray-50 p-6 rounded-lg">
                                {/* Icons would go here, using placeholders for now */}
                                <div className="text-center">
                                    <div className="mb-2 text-[#41354D] font-serif text-lg">⌬</div>
                                    <p className="text-[10px] font-medium text-gray-600 uppercase">Safe &<br />Non-toxic</p>
                                </div>
                                <div className="text-center">
                                    <div className="mb-2 text-[#41354D] font-serif text-lg">⚕</div>
                                    <p className="text-[10px] font-medium text-gray-600 uppercase">Dermatologist<br />Created</p>
                                </div>
                                <div className="text-center">
                                    <div className="mb-2 text-[#41354D] font-serif text-lg">♻</div>
                                    <p className="text-[10px] font-medium text-gray-600 uppercase">Biodegradable<br />Ingredients</p>
                                </div>
                                <div className="text-center">
                                    <div className="mb-2 text-[#41354D] font-serif text-lg">✓</div>
                                    <p className="text-[10px] font-medium text-gray-600 uppercase">Vegan &<br />Cruelty-free</p>
                                </div>
                            </div>

                            {/* Accordions */}
                            <div className="space-y-4">
                                <div className="border-b border-gray-100 pb-4">
                                    <button
                                        onClick={() => toggleSection('detail')}
                                        className="w-full flex items-center justify-between text-sm font-medium text-[#111] mb-2"
                                    >
                                        Detail
                                        {openSection === 'detail' ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    </button>
                                    {openSection === 'detail' && (
                                        <div className="text-sm text-gray-500 leading-relaxed animate-in slide-in-from-top-2 duration-200">
                                            {product.details}
                                        </div>
                                    )}
                                </div>
                                <div className="border-b border-gray-100 pb-4">
                                    <button
                                        onClick={() => toggleSection('benefits')}
                                        className="w-full flex items-center justify-between text-sm font-medium text-[#111] mb-2"
                                    >
                                        Benefits
                                        {openSection === 'benefits' ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    </button>
                                    {openSection === 'benefits' && (
                                        <div className="text-sm text-gray-500 leading-relaxed animate-in slide-in-from-top-2 duration-200">
                                            {product.benefits}
                                        </div>
                                    )}
                                </div>
                                <div className="border-b border-gray-100 pb-4">
                                    <button
                                        onClick={() => toggleSection('usage')}
                                        className="w-full flex items-center justify-between text-sm font-medium text-[#111] mb-2"
                                    >
                                        How To Use
                                        {openSection === 'usage' ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    </button>
                                    {openSection === 'usage' && (
                                        <div className="text-sm text-gray-500 leading-relaxed animate-in slide-in-from-top-2 duration-200">
                                            {product.howToUse}
                                        </div>
                                    )}
                                </div>
                                <div className="border-b border-gray-100 pb-4">
                                    <button
                                        onClick={() => toggleSection('ingredients')}
                                        className="w-full flex items-center justify-between text-sm font-medium text-[#111] mb-2"
                                    >
                                        Ingredients
                                        {openSection === 'ingredients' ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    </button>
                                    {openSection === 'ingredients' && (
                                        <div className="text-sm text-gray-500 leading-relaxed animate-in slide-in-from-top-2 duration-200">
                                            {product.ingredients}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* You May Also Like */}
                <div className="mt-20">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-serif text-[#111]">You May Also Like</h2>
                        <div className="flex gap-2">
                            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">←</button>
                            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">→</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedProducts.map((p) => (
                            <ProductCard
                                key={p.id}
                                id={p.id}
                                name={p.name}
                                brand={p.brand}
                                price={p.price}
                                originalPrice={p.originalPrice}
                                image={p.images[0]}
                                rating={p.rating}
                                reviewsCount={p.reviewsCount}
                                tags={p.tags}
                            />
                        ))}
                    </div>
                </div>

                {/* Reviews */}
                <div className="mt-20">
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                        <div className="flex-1">
                            <h2 className="text-3xl font-serif text-[#111] mb-8">Customer Reviews</h2>
                            <div className="flex items-end gap-4 mb-4">
                                <span className="text-5xl font-serif text-[#111]">{product.rating}</span>
                                <div className="pb-2">
                                    <div className="flex text-[#D4C49D] mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'}`} />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500">Based on {product.reviewsCount} reviews</span>
                                </div>
                            </div>

                            {/* Review Categories - Mock UI */}
                            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                                <button className="px-4 py-2 border border-black text-black rounded-full text-xs font-medium whitespace-nowrap">All reviews</button>
                                <button className="px-4 py-2 border border-gray-200 text-gray-500 rounded-full text-xs font-medium whitespace-nowrap hover:border-gray-300">With images</button>
                                <button className="px-4 py-2 border border-gray-200 text-gray-500 rounded-full text-xs font-medium whitespace-nowrap hover:border-gray-300">Most recent</button>
                            </div>

                            <div className="space-y-8">
                                {reviews.map((review) => (
                                    <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex text-[#D4C49D] text-xs">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-400">{review.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-semibold text-sm">{review.author}</span>
                                            {review.verified && (
                                                <span className="text-[10px] bg-gray-100 px-1 py-0.5 rounded text-gray-600 flex items-center gap-1">
                                                    <Check className="w-3 h-3" /> Verified Buyer
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed mb-4">{review.content}</p>
                                        {review.images && (
                                            <div className="flex gap-2">
                                                {review.images.map((img: string, i: number) => (
                                                    <div key={i} className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* FAQ */}
                        <div className="flex-1 w-full bg-white p-8 rounded-xl shadow-sm">
                            <h2 className="text-2xl font-serif text-[#111] mb-8">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                {faqs.map((faq, idx) => (
                                    <div key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                        <h3 className="font-medium text-sm text-[#111] mb-2">{faq.question}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
