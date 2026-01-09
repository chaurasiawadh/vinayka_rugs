import { Product, SearchResult, SearchSuggestion, Facet } from '../types';

export const mockAutocomplete = (query: string, products: Product[]): SearchSuggestion[] => {
  if (!query || query.length < 2) return [];
  const lowerQ = query.toLowerCase();

  return products
    .filter(p =>
      p.name.toLowerCase().includes(lowerQ) ||
      p.collection.toLowerCase().includes(lowerQ)
    )
    .slice(0, 5)
    .map(p => ({
      id: p.id,
      title: p.name,
      type: 'product' as const,
      subtitle: `₹${p.price.toLocaleString('en-IN')}`,
      image: p.images[0],
      url: `/product/${p.id}`
    }));
};

export const mockSearchProducts = (
  products: Product[],
  query: string,
  filters: Record<string, string[]> = {},
  sort: string = 'relevance'
): SearchResult => {
  let results = products;

  // 1. Text Search
  if (query) {
    const lowerQ = query.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(lowerQ) ||
      p.category.toLowerCase().includes(lowerQ) ||
      p.collection.toLowerCase().includes(lowerQ) ||
      (p.specifications?.material || '').toLowerCase().includes(lowerQ)
    );
  }

  // 2. Filters
  if (filters.category?.length) {
    results = results.filter(p => filters.category.includes(p.category));
  }
  if (filters.material?.length) {
    results = results.filter(p => p.specifications?.material && filters.material.includes(p.specifications.material));
  }
  if (filters.collection?.length) {
    results = results.filter(p => filters.collection.includes(p.collection));
  }

  // 3. Facets Calculation (based on current filtered set)
  const calculateFacet = (key: keyof Product | 'material', label: string): Facet => {
    const counts: Record<string, number> = {};
    results.forEach(p => {
      let val: any;
      if (key === 'material') {
        val = p.specifications?.material;
      } else {
        val = p[key as keyof Product];
      }

      if (typeof val === 'string') {
        counts[val] = (counts[val] || 0) + 1;
      }
    });
    return {
      id: key as string,
      label,
      options: Object.entries(counts).map(([value, count]) => ({ value, label: value, count }))
    };
  };

  const facets: Facet[] = [
    calculateFacet('category', 'Category'),
    calculateFacet('material', 'Material'),
    calculateFacet('collection', 'Collection')
  ];

  // 4. Sorting
  if (sort === 'price-low-high') {
    results.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sort === 'price-high-low') {
    results.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sort === 'newest') {
    results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  } else if (sort === 'popular') {
    results.sort((a, b) => b.rating - a.rating);
  }

  return {
    products: results,
    facets,
    totalCount: results.length
  };
};
