"use client";

import React, { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, ChevronDown, Check, PenTool } from 'lucide-react';
import { CATEGORIES, MATERIALS } from '@/constants';
import ProductCard from '@/components/ProductCard';
import Button from '@/components/Button';
import { useShop } from '@/context/ShopContext';

const ShopContent: React.FC = () => {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('cat');
    const initialCollection = searchParams.get('collection');

    // USE DYNAMIC PRODUCTS
    const { products, openBespokeModal, loading } = useShop();

    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
    const [sortOption, setSortOption] = useState('popular');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchCat = selectedCategories.length === 0 || selectedCategories.includes(product.category);
            const matchMat = selectedMaterials.length === 0 || selectedMaterials.includes(product.specifications.material);
            const matchCol = !initialCollection || product.collection === initialCollection;
            return matchCat && matchMat && matchCol;
        }).sort((a, b) => {
            if (sortOption === 'price-low-high') return a.price - b.price;
            if (sortOption === 'price-high-low') return b.price - a.price;
            if (sortOption === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
            return b.rating - a.rating; // Popular default
        });
    }, [selectedCategories, selectedMaterials, sortOption, initialCollection, products]);

    const toggleFilter = (item: string, current: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        if (current.includes(item)) {
            setter(current.filter(i => i !== item));
        } else {
            setter([...current, item]);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="bg-cream min-h-screen pb-20 pt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-200 pb-6">
                    <div>
                        <span className="text-sm text-text-muted uppercase tracking-wider">Shop</span>
                        <h1 className="text-3xl md:text-4xl font-serif text-text-body mt-2">
                            {initialCollection ? `${initialCollection} Collection` : 'All Rugs'}
                        </h1>
                        <p className="text-text-muted mt-2">{filteredProducts.length} results found</p>
                    </div>

                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <button
                            className="md:hidden flex items-center gap-2 font-medium"
                            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                        >
                            <Filter size={18} /> Filters
                        </button>

                        <div className="relative group">
                            <button className="flex items-center gap-2 text-sm font-medium hover:text-terracotta">
                                Sort by: <span className="text-gray-900">{sortOption.replace('-', ' ')}</span> <ChevronDown size={14} />
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                                {['popular', 'newest', 'price-low-high', 'price-high-low'].map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setSortOption(opt)}
                                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 capitalize"
                                    >
                                        {opt.replace(/-/g, ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar Filters (Desktop) */}
                    <aside className={`w-64 flex-shrink-0 ${isMobileFilterOpen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden md:block'}`}>
                        {isMobileFilterOpen && (
                            <div className="flex justify-between items-center mb-6 md:hidden">
                                <h2 className="font-serif text-xl">Filters</h2>
                                <button onClick={() => setIsMobileFilterOpen(false)}><span className="text-2xl">&times;</span></button>
                            </div>
                        )}

                        <div className="space-y-8">
                            <div>
                                <h3 className="font-medium mb-4">Category</h3>
                                <div className="space-y-2">
                                    {CATEGORIES.map(cat => (
                                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${selectedCategories.includes(cat) ? 'bg-terracotta border-terracotta' : 'border-gray-300 group-hover:border-terracotta'}`}>
                                                {selectedCategories.includes(cat) && <Check size={10} className="text-white" />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={selectedCategories.includes(cat)}
                                                onChange={() => toggleFilter(cat, selectedCategories, setSelectedCategories)}
                                            />
                                            <span className={`text-sm ${selectedCategories.includes(cat) ? 'text-text-body font-medium' : 'text-text-muted'}`}>{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-4">Material</h3>
                                <div className="space-y-2">
                                    {MATERIALS.map(mat => (
                                        <label key={mat} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${selectedMaterials.includes(mat) ? 'bg-terracotta border-terracotta' : 'border-gray-300 group-hover:border-terracotta'}`}>
                                                {selectedMaterials.includes(mat) && <Check size={10} className="text-white" />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={selectedMaterials.includes(mat)}
                                                onChange={() => toggleFilter(mat, selectedMaterials, setSelectedMaterials)}
                                            />
                                            <span className={`text-sm ${selectedMaterials.includes(mat) ? 'text-text-body font-medium' : 'text-text-muted'}`}>{mat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {isMobileFilterOpen && (
                            <div className="mt-8 pt-4 border-t border-gray-100 md:hidden">
                                <Button fullWidth onClick={() => setIsMobileFilterOpen(false)}>Show Results</Button>
                            </div>
                        )}
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                            {/* Bespoke Promo Card */}
                            <div className="sm:col-span-2 lg:col-span-3 bg-teal text-white rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                                <div>
                                    <div className="flex items-center gap-2 mb-2 text-amber font-medium">
                                        <PenTool size={18} />
                                        <span className="text-sm uppercase tracking-wide">Bespoke Services</span>
                                    </div>
                                    <h3 className="font-serif text-2xl mb-1">Can't find the perfect match?</h3>
                                    <p className="text-white/80 text-sm">Customize colors, sizes, and designs to fit your space perfectly.</p>
                                </div>
                                <Button onClick={() => openBespokeModal('Shop Page Banner')} className="bg-white text-teal hover:bg-gray-100 border-none shrink-0">
                                    Create Custom Rug
                                </Button>
                            </div>

                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center bg-white rounded-lg border border-dashed border-gray-300">
                                    <h3 className="font-serif text-xl mb-2">No products found</h3>
                                    <p className="text-text-muted mb-6">Try adjusting your filters.</p>
                                    <Button
                                        variant="outline"
                                        onClick={() => { setSelectedCategories([]); setSelectedMaterials([]); }}
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Shop() {
    return (
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin"></div></div>}>
            <ShopContent />
        </React.Suspense>
    );
}
