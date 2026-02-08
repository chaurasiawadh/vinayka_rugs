'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/useFirestore';
import { mockSearchProducts } from '@/utils/mockSearch';
import { SearchResult } from '@/types';
import ProductCard from '@/components/ProductCard';
import FilterPanel from '@/components/Search/FilterPanel';
import Button from '@/components/Button';
import { Filter } from 'lucide-react';

const SearchResults: React.FC = () => {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';

  const { products, loading } = useProducts();
  const [results, setResults] = useState<SearchResult | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [sort, setSort] = useState('relevance');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    // Reset filters when query changes
    setSelectedFilters({});
  }, [q]);

  useEffect(() => {
    if (!loading) {
      const data = mockSearchProducts(products, q, selectedFilters, sort);
      setResults(data);
    }
  }, [q, selectedFilters, sort, products, loading]);

  const handleFilterChange = (facetId: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[facetId] || [];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [facetId]: updated };
    });
  };

  const clearFilters = () => setSelectedFilters({});

  if (loading || !results)
    return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="bg-cream min-h-screen pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-200 pb-6">
          <div>
            <span className="text-sm text-text-muted uppercase tracking-wider">
              Search Results
            </span>
            <h1 className="text-3xl font-serif text-text-body mt-2">
              {q ? `Results for "${q}"` : 'All Products'}
            </h1>
            <p className="text-text-muted mt-2">
              {results.totalCount} items found
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button
              className="md:hidden flex items-center gap-2 font-medium"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            >
              <Filter size={18} /> Filters
            </button>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent text-sm font-medium border-none focus:ring-0 cursor-pointer"
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="popular">Popularity</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
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

            {Object.keys(selectedFilters).some(
              (k) => selectedFilters[k].length > 0
            ) && (
              <div className="mb-6">
                <button
                  onClick={clearFilters}
                  className="text-sm text-terracotta hover:underline"
                >
                  Clear All
                </button>
              </div>
            )}

            <FilterPanel
              facets={results.facets}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />

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
            {results.products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-white rounded-lg border border-dashed border-gray-300">
                <h3 className="font-serif text-xl mb-2">No results found</h3>
                <p className="text-text-muted mb-6">
                  Try adjusting your search or filters.
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
  );
};

export default SearchResults;
