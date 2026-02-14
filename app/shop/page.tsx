'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, ChevronDown, Check, X } from 'lucide-react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { CATEGORIES, MATERIALS, ROOMS, SHAPES, SIZES } from '@/constants';
import ProductCard from '@/components/ProductCard';
import Button from '@/components/Button';
import { useShop } from '@/context/ShopContext';

const ShopContent: React.FC = () => {
  const searchParams = useSearchParams();

  // Read all potential filters from URL
  const initialCategory =
    searchParams.get('cat') || searchParams.get('category');
  const initialMaterial = searchParams.get('material');
  const initialRoom = searchParams.get('room');
  const initialShape = searchParams.get('shape');
  const initialSize = searchParams.get('size');

  const { products, loading } = useShop();

  // Calculate dynamic price range based on products
  const { minPrice, maxPrice } = useMemo(() => {
    if (products.length === 0) return { minPrice: 0, maxPrice: 100000 };
    const prices = products.map((p) => Number(p.price || 0));
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  }, [products]);

  const [selectedStyles, setSelectedStyles] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(
    initialMaterial ? [initialMaterial] : []
  );
  const [selectedRooms, setSelectedRooms] = useState<string[]>(
    initialRoom ? [initialRoom] : []
  );
  const [selectedShapes, setSelectedShapes] = useState<string[]>(
    initialShape ? [initialShape] : []
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    initialSize ? [initialSize] : []
  );
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({
    min: '',
    max: '',
  });
  const [sortOption, setSortOption] = useState('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('cat') || searchParams.get('category');
    const mat = searchParams.get('material');
    const room = searchParams.get('room');
    const shape = searchParams.get('shape');
    const size = searchParams.get('size');

    setSelectedStyles(cat ? [cat] : []);
    setSelectedMaterials(mat ? [mat] : []);
    setSelectedRooms(room ? [room] : []);
    setSelectedShapes(shape ? [shape] : []);
    setSelectedSizes(size ? [size] : []);
  }, [searchParams]);

  const clearFilters = () => {
    setSelectedStyles([]);
    setSelectedMaterials([]);
    setSelectedRooms([]);
    setSelectedShapes([]);
    setSelectedSizes([]);
    setPriceRange({ min: '', max: '' });
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Helper to normalize data to array (handle legacy string vs new array)
        const toArray = (val: any) =>
          Array.isArray(val) ? val : val ? [val] : [];

        const pStyles = toArray(product.category);
        const pMaterials = toArray(product.specifications?.material);
        const pRooms = toArray(product.specifications?.roomType);
        const pShapes = toArray(product.specifications?.shape);
        const pSizes = toArray(product.sizes);
        const pPrice = Number(product.price || 0);

        // Filtering: OR logic within a filter type, AND logic across filter types
        const matchStyle =
          selectedStyles.length === 0 ||
          pStyles.some((s) => selectedStyles.includes(s));
        const matchMaterial =
          selectedMaterials.length === 0 ||
          pMaterials.some((m) => selectedMaterials.includes(m));
        const matchRoom =
          selectedRooms.length === 0 ||
          pRooms.some((r) => selectedRooms.includes(r));
        const matchShape =
          selectedShapes.length === 0 ||
          pShapes.some((s) => selectedShapes.includes(s));
        const matchSize =
          selectedSizes.length === 0 ||
          pSizes.some((s) => selectedSizes.includes(s));

        const minPrice = priceRange.min ? Number(priceRange.min) : 0;
        const maxPrice = priceRange.max ? Number(priceRange.max) : Infinity;
        const matchPrice = pPrice >= minPrice && pPrice <= maxPrice;

        return (
          matchStyle &&
          matchMaterial &&
          matchRoom &&
          matchShape &&
          matchSize &&
          matchPrice
        );
      })
      .sort((a, b) => {
        const priceA = Number(a.price || 0);
        const priceB = Number(b.price || 0);
        const ratingA = Number(a.rating || 0);
        const ratingB = Number(b.rating || 0);

        if (sortOption === 'price-low-high') return priceA - priceB;
        if (sortOption === 'price-high-low') return priceB - priceA;
        if (sortOption === 'newest')
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        return ratingB - ratingA;
      });
  }, [
    products,
    selectedStyles,
    selectedMaterials,
    selectedRooms,
    selectedShapes,
    selectedSizes,
    priceRange,
    sortOption,
  ]);

  const toggleFilter = (
    item: string,
    current: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (current.includes(item)) {
      setter(current.filter((i) => i !== item));
    } else {
      setter([...current, item]);
    }
  };

  const activeFilters = useMemo(() => {
    const filters: { type: string; value: string; label: string }[] = [];
    selectedStyles.forEach((f) =>
      filters.push({ type: 'cat', value: f, label: f })
    );
    selectedMaterials.forEach((f) =>
      filters.push({ type: 'material', value: f, label: f })
    );
    selectedRooms.forEach((f) =>
      filters.push({ type: 'room', value: f, label: f })
    );
    selectedShapes.forEach((f) =>
      filters.push({ type: 'shape', value: f, label: f })
    );
    selectedSizes.forEach((f) =>
      filters.push({ type: 'size', value: f, label: f })
    );
    return filters;
  }, [
    selectedStyles,
    selectedMaterials,
    selectedRooms,
    selectedShapes,
    selectedSizes,
  ]);

  const removeFilter = (filter: { type: string; value: string }) => {
    switch (filter.type) {
      case 'cat':
        setSelectedStyles((prev) => prev.filter((i) => i !== filter.value));
        break;
      case 'material':
        setSelectedMaterials((prev) => prev.filter((i) => i !== filter.value));
        break;
      case 'room':
        setSelectedRooms((prev) => prev.filter((i) => i !== filter.value));
        break;
      case 'shape':
        setSelectedShapes((prev) => prev.filter((i) => i !== filter.value));
        break;
      case 'size':
        setSelectedSizes((prev) => prev.filter((i) => i !== filter.value));
        break;
    }
  };

  const renderFilterSection = (
    title: string,
    items: string[],
    current: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => (
    <div>
      <h3 className="font-bold text-sm uppercase tracking-wider mb-3 text-gray-800">
        {title}
      </h3>
      <div className="space-y-2">
        {items.map((item) => (
          <label
            key={item}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div
              className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${current.includes(item) ? 'bg-terracotta border-terracotta' : 'border-gray-300 group-hover:border-terracotta'}`}
            >
              {current.includes(item) && (
                <Check size={10} className="text-white" />
              )}
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={current.includes(item)}
              onChange={() => toggleFilter(item, current, setter)}
            />
            <span
              className={`text-sm ${current.includes(item) ? 'text-gray-900 font-medium' : 'text-gray-500'}`}
            >
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

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

            {/* Size Filter Dropdown */}
            <div className="relative group z-30">
              <button className="flex items-center gap-2 text-sm font-medium hover:text-terracotta py-2">
                Size
                {selectedSizes.length > 0 && (
                  <span className="bg-terracotta text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {selectedSizes.length}
                  </span>
                )}
                <ChevronDown size={14} />
              </button>
              <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-gray-100 p-2 transform origin-top-left">
                <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                  {SIZES.map((size) => (
                    <label
                      key={size}
                      className="flex items-center gap-3 cursor-pointer hover:bg-cream/50 p-2 rounded-md transition-colors"
                    >
                      <div
                        className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center transition-colors border ${selectedSizes.includes(size) ? 'bg-terracotta border-terracotta' : 'border-gray-300'}`}
                      >
                        {selectedSizes.includes(size) && (
                          <Check size={10} className="text-white" />
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedSizes.includes(size)}
                        onChange={() =>
                          toggleFilter(size, selectedSizes, setSelectedSizes)
                        }
                      />
                      <span
                        className={`text-sm ${selectedSizes.includes(size) ? 'text-gray-900 font-medium' : 'text-gray-600'}`}
                      >
                        {size}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative group z-20">
              <button className="flex items-center gap-2 text-sm font-medium hover:text-terracotta py-2">
                Sort by:{' '}
                <span className="text-gray-900">
                  {sortOption.replace('-', ' ')}
                </span>{' '}
                <ChevronDown size={14} />
              </button>
              <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-gray-100 py-1 transform origin-top-left">
                {['popular', 'newest', 'price-low-high', 'price-high-low'].map(
                  (opt) => (
                    <button
                      key={opt}
                      onClick={() => setSortOption(opt)}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-cream/50 transition-colors capitalize ${sortOption === opt ? 'text-terracotta font-medium bg-cream/30' : 'text-gray-700'}`}
                    >
                      {opt.replace(/-/g, ' ')}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters (Desktop) */}
          <aside
            className={`w-64 flex-shrink-0 ${isMobileFilterOpen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden md:block'}`}
          >
            {isMobileFilterOpen && (
              <div className="flex justify-between items-center mb-6 md:hidden">
                <h2 className="font-serif text-xl">Filters</h2>
                <button onClick={() => setIsMobileFilterOpen(false)}>
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <h2 className="font-medium text-lg hidden md:block">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-xs text-terracotta hover:underline font-medium"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-8">
              {/* Price Range */}
              {/* Price Range */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-gray-800">
                    Price Range
                  </h3>
                  {(priceRange.min || priceRange.max) && (
                    <button
                      onClick={() => setPriceRange({ min: '', max: '' })}
                      className="text-xs text-terracotta hover:underline font-medium"
                    >
                      Reset Price
                    </button>
                  )}
                </div>
                <div className="px-2">
                  <Slider
                    range
                    min={minPrice}
                    max={maxPrice}
                    defaultValue={[minPrice, maxPrice]}
                    value={[
                      priceRange.min ? Number(priceRange.min) : minPrice,
                      priceRange.max ? Number(priceRange.max) : maxPrice,
                    ]}
                    onChange={(val) => {
                      if (Array.isArray(val)) {
                        setPriceRange({
                          min: val[0].toString(),
                          max: val[1].toString(),
                        });
                      }
                    }}
                    trackStyle={[{ backgroundColor: '#8B5E3C' }]}
                    handleStyle={[
                      {
                        borderColor: '#8B5E3C',
                        backgroundColor: '#fff',
                        opacity: 1,
                        boxShadow: '0 0 0 2px rgba(139, 94, 60, 0.2)',
                      },
                      {
                        borderColor: '#8B5E3C',
                        backgroundColor: '#fff',
                        opacity: 1,
                        boxShadow: '0 0 0 2px rgba(139, 94, 60, 0.2)',
                      },
                    ]}
                    railStyle={{ backgroundColor: '#E5E7EB' }}
                  />
                  <div className="flex justify-between items-center mt-4 text-sm font-medium text-gray-700">
                    <span>
                      ₹{Number(priceRange.min || minPrice).toLocaleString()}
                    </span>
                    <span>
                      ₹{Number(priceRange.max || maxPrice).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {renderFilterSection(
                'Style',
                CATEGORIES,
                selectedStyles,
                setSelectedStyles
              )}
              {renderFilterSection(
                'Material',
                MATERIALS,
                selectedMaterials,
                setSelectedMaterials
              )}
              {renderFilterSection(
                'Room',
                ROOMS,
                selectedRooms,
                setSelectedRooms
              )}
              {renderFilterSection(
                'Shape',
                SHAPES,
                selectedShapes,
                setSelectedShapes
              )}
            </div>

            {isMobileFilterOpen && (
              <div className="mt-8 pt-4 border-t border-gray-100 md:hidden">
                <Button fullWidth onClick={() => setIsMobileFilterOpen(false)}>
                  Show Results
                </Button>
              </div>
            )}
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Active Filters Display */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {activeFilters.map((filter, idx) => (
                  <button
                    key={`${filter.type}-${filter.value}-${idx}`}
                    onClick={() => removeFilter(filter)}
                    className="flex items-center gap-2 bg-white border border-gray-200 hover:border-terracotta px-3 py-1.5 rounded-full text-sm text-gray-700 transition-all group shadow-sm"
                  >
                    <X
                      size={14}
                      className="text-gray-400 group-hover:text-terracotta transition-colors"
                    />
                    <span className="group-hover:text-terracotta transition-colors">
                      {filter.label}
                    </span>
                  </button>
                ))}

                {activeFilters.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-terracotta underline ml-2 font-medium transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-lg border border-dashed border-gray-300">
                  <h3 className="font-serif text-xl mb-2">No products found</h3>
                  <p className="text-text-muted mb-6">
                    Try adjusting your filters.
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
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
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ShopContent />
    </React.Suspense>
  );
}
