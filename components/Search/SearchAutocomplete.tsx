import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SearchSuggestion } from '../../types';
import ImageSmart from '../ImageSmart';
import { ArrowRight, ShoppingBag } from 'lucide-react';

interface SearchAutocompleteProps {
  suggestions: SearchSuggestion[];
  isOpen: boolean;
  onClose: () => void;
  activeIndex: number;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ suggestions, isOpen, onClose, activeIndex }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!isOpen || suggestions.length === 0) return null;

  return (
    <div 
      ref={ref}
      className="absolute top-full left-0 right-0 bg-white shadow-xl rounded-b-xl border-x border-b border-gray-100 mt-2 z-50 overflow-hidden animate-fade-in"
    >
      <div className="max-h-[60vh] overflow-y-auto">
         {suggestions.map((item, index) => (
           <Link 
             key={item.id} 
             to={item.url}
             className={`flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors ${activeIndex === index ? 'bg-gray-100' : ''}`}
             onClick={onClose}
           >
             {item.image ? (
               <div className="w-12 h-12 rounded overflow-hidden shrink-0">
                 <ImageSmart src={item.image} alt={item.title} className="w-full h-full object-cover" />
               </div>
             ) : (
                <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 text-xs uppercase font-bold">
                    {item.type.slice(0, 3)}
                </div>
             )}
             
             <div className="flex-1 min-w-0">
               <div className="flex justify-between items-center">
                 <h4 className="font-medium text-text-body truncate">{item.title}</h4>
                 <span className="text-xs text-text-muted capitalize border border-gray-200 px-1.5 rounded bg-gray-50">{item.type}</span>
               </div>
               {item.subtitle && <p className="text-sm text-text-muted truncate">{item.subtitle}</p>}
             </div>

             <div className="hidden sm:block">
                {item.type === 'product' ? <ShoppingBag size={16} className="text-gray-300" /> : <ArrowRight size={16} className="text-gray-300" />}
             </div>
           </Link>
         ))}
      </div>
      <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
          <button className="text-sm font-medium text-terracotta hover:underline">View all results</button>
      </div>
    </div>
  );
};

export default SearchAutocomplete;