import React from 'react';
import { Facet } from '../../types';
import { Check } from 'lucide-react';

interface FilterPanelProps {
  facets: Facet[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (facetId: string, value: string) => void;
  className?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ facets, selectedFilters, onFilterChange, className = '' }) => {
  return (
    <div className={`space-y-8 ${className}`}>
      {facets.map(facet => (
        <div key={facet.id}>
          <h3 className="font-medium mb-4 text-text-body">{facet.label}</h3>
          <div className="space-y-2">
            {facet.options.map(option => {
              const isSelected = selectedFilters[facet.id]?.includes(option.value);
              return (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${isSelected ? 'bg-terracotta border-terracotta' : 'border-gray-300 group-hover:border-terracotta'}`}>
                     {isSelected && <Check size={10} className="text-white" />}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={!!isSelected}
                    onChange={() => onFilterChange(facet.id, option.value)}
                  />
                  <div className="flex-1 flex justify-between text-sm">
                      <span className={`${isSelected ? 'text-text-body font-medium' : 'text-text-muted'}`}>{option.label}</span>
                      <span className="text-gray-400 text-xs">({option.count})</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilterPanel;