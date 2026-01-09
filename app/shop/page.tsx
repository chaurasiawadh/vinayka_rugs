'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, ChevronDown, Check, PenTool } from 'lucide-react';
import { CATEGORIES, MATERIALS, COLLECTIONS, ROOMS, SHAPES, SIZES } from '@/constants';
import ProductCard from '@/components/ProductCard';
import Button from '@/components/Button';
import { useShop } from '@/context/ShopContext';

const ShopContent: React.FC = () => {
    const searchParams = useSearchParams();
    
    // Read all potential filters from URL
    const initialCategory = searchParams.get('cat') || searchParams.get('category');
    const initialCollection = searchParams.get('collection');
    const initialMaterial = searchParams.get('material');
    const initialRoom = searchParams.get('room');
    const initialShape = searchParams.get('shape');
    const initialSize = searchParams.get('size');

    const { products, loading } = useShop();

    const [selectedCollections, setSelectedCollections] = useState<string[]>(initialCollection ? [initialCollection] : []);
    const [selectedStyles, setSelectedStyles] = useState<string[]>(initialCategory ? [initialCategory] : []);
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>(initialMaterial ? [initialMaterial] : []);
    const [selectedRooms, setSelectedRooms] = useState<string[]>(initialRoom ? [initialRoom] : []);
    const [selectedShapes, setSelectedShapes] = useState<string[]>(initialShape ? [initialShape] : []);
    const [selectedSizes, setSelectedSizes] = useState<string[]>(initialSize ? [initialSize] : []);
    const [priceRange, setPriceRange] = useState<{ min: string, max: string }>({ min: '', max: '' });
    const [sortOption, setSortOption] = useState('popular');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    useEffect(() => {
        const cat = searchParams.get('cat') || searchParams.get('category');
        const col = searchParams.get('collection');
        const mat = searchParams.get('material');
        const room = searchParams.get('room');
        const shape = searchParams.get('shape');
        const size = searchParams.get('size');

        setSelectedStyles(cat ? [cat] : []);
        setSelectedCollections(col ? [col] : []);
        setSelectedMaterials(mat ? [mat] : []);
        setSelectedRooms(room ? [room] : []);
        setSelectedShapes(shape ? [shape] : []);
        setSelectedSizes(size ? [size] : []);
    }, [searchParams]);

    const clearFilters = () => {
        setSelectedCollections([]);
        setSelectedStyles([]);
        setSelectedMaterials([]);
        setSelectedRooms([]);
        setSelectedShapes([]);
        setSelectedSizes([]);
        setPriceRange({ min: '', max: '' });
    };

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Helper to normalize data to array (handle legacy string vs new array)
            const toArray = (val: any) => Array.isArray(val) ? val : (val ? [val] : []);
            
            const pCollections = toArray(product.collection);
            const pStyles = toArray(product.category);
            const pMaterials = toArray(product.specifications?.material);
            const pRooms = toArray(product.specifications?.roomType);
            const pShapes = toArray(product.specifications?.shape);
            const pSizes = toArray(product.sizes);
            const pPrice = Number(product.price || 0);

            // Filtering: OR logic within a filter type, AND logic across filter types
            const matchCollection = selectedCollections.length === 0 || pCollections.some(c => selectedCollections.includes(c));
            const matchStyle = selectedStyles.length === 0 || pStyles.some(s => selectedStyles.includes(s));
            const matchMaterial = selectedMaterials.length === 0 || pMaterials.some(m => selectedMaterials.includes(m));
            const matchRoom = selectedRooms.length === 0 || pRooms.some(r => selectedRooms.includes(r));
            const matchShape = selectedShapes.length === 0 || pShapes.some(s => selectedShapes.includes(s));
            const matchSize = selectedSizes.length === 0 || pSizes.some(s => selectedSizes.includes(s));
            
            const minPrice = priceRange.min ? Number(priceRange.min) : 0;
            const maxPrice = priceRange.max ? Number(priceRange.max) : Infinity;
            const matchPrice = pPrice >= minPrice && pPrice <= maxPrice;

            return matchCollection && matchStyle && matchMaterial && matchRoom && matchShape && matchSize && matchPrice;
        }).sort((a, b) => {
            const priceA = Number(a.price || 0);
            const priceB = Number(b.price || 0);
            const ratingA = Number(a.rating || 0);
            const ratingB = Number(b.rating || 0);

            if (sortOption === 'price-low-high') return priceA - priceB;
            if (sortOption === 'price-high-low') return priceB - priceA;
            if (sortOption === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
            return ratingB - ratingA;
        });
    }, [products, selectedCollections, selectedStyles, selectedMaterials, selectedRooms, selectedShapes, selectedSizes, priceRange, sortOption]);

    const toggleFilter = (item: string, current: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        if (current.includes(item)) {
            setter(current.filter(i => i !== item));
        } else {
            setter([...current, item]);
        }
    };

    const renderFilterSection = (title: string, items: string[], current: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => (
        <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-3 text-gray-800">{title}</h3>
            <div className="space-y-2">
                {items.map(item => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${current.includes(item) ? 'bg-terracotta border-terracotta' : 'border-gray-300 group-hover:border-terracotta'}`}>
                            {current.includes(item) && <Check size={10} className="text-white" />}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={current.includes(item)}
                            onChange={() => toggleFilter(item, current, setter)}
                        />
                        <span className={`text-sm ${current.includes(item) ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{item}</span>
                    </label>
                ))}
            </div>
        </div>
    );

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="bg-cream min-h-screen pb-20 pt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-200 pb-6">
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
                        
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-medium text-lg hidden md:block">Filters</h2>
                            <button onClick={clearFilters} className="text-xs text-terracotta hover:underline font-medium">Clear All</button>
                        </div>

                        <div className="space-y-8">
                            {/* Price Range */}
                            <div>
                                <h3 className="font-bold text-sm uppercase tracking-wider mb-3 text-gray-800">Price Range</h3>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="number" 
                                        placeholder="Min" 
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                        className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-terracotta outline-none"
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input 
                                        type="number" 
                                        placeholder="Max" 
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                        className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-terracotta outline-none"
                                    />
                                </div>
                            </div>

                            {renderFilterSection('Collections', COLLECTIONS, selectedCollections, setSelectedCollections)}
                            {renderFilterSection('Style', CATEGORIES, selectedStyles, setSelectedStyles)}
                            {renderFilterSection('Material', MATERIALS, selectedMaterials, setSelectedMaterials)}
                            {renderFilterSection('Room', ROOMS, selectedRooms, setSelectedRooms)}
                            {renderFilterSection('Shape', SHAPES, selectedShapes, setSelectedShapes)}
                            {renderFilterSection('Size', SIZES, selectedSizes, setSelectedSizes)}
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
                                        onClick={clearFilters}
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
