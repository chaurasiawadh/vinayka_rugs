import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useProducts } from '../../hooks/useFirestore';
import { mockAutocomplete } from '../../utils/mockSearch';
import { SearchSuggestion } from '../../types';
import SearchAutocomplete from './SearchAutocomplete';

const SearchBar: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { products } = useProducts();

  // Debounce Autocomplete
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        setSuggestions(mockAutocomplete(query, products));
      } else {
        setSuggestions([]);
      }
      setActiveIndex(-1);
    }, 200);

    return () => clearTimeout(timer);
  }, [query, products]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        setIsFocused(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        router.push(suggestions[activeIndex].url);
        setIsFocused(false);
        setQuery('');
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsFocused(false);
      setQuery('');
    }
  };

  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products, collections..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-terracotta rounded-lg py-2 pl-10 pr-10 text-sm transition-all outline-none"
        />
        <button
          type="submit"
          className="absolute left-3 top-2.5 text-gray-400 hover:text-terracotta"
        >
          <Search size={18} />
        </button>
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </form>

      <SearchAutocomplete
        suggestions={suggestions}
        isOpen={isFocused && suggestions.length > 0}
        onClose={() => setIsFocused(false)}
        activeIndex={activeIndex}
      />
    </div>
  );
};

export default SearchBar;
