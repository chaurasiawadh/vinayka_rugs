'use client';

import React from 'react';
import { useVisualizer } from '@/context/VisualizerContext';
import { useShop } from '@/context/ShopContext';
import { Search } from 'lucide-react';

export default function ProductSidebar() {
  const { setSelectedRug, selectedRug } = useVisualizer();
  const { products } = useShop(); // Use global shop products
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-gray-900 border-r border-gray-800 w-full md:w-80">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-white font-serif font-bold text-lg mb-1">
          Rugs Collection
        </h2>
        <p className="text-xs text-gray-400">Drag or click to place in room</p>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-800">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search rugs..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-terracotta"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => setSelectedRug(product)}
            className={`
              flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors border
              ${selectedRug?.id === product.id ? 'bg-gray-800 border-terracotta' : 'border-transparent hover:bg-gray-800'}
            `}
          >
            <div className="w-12 h-12 rounded bg-white overflow-hidden shrink-0">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-200 truncate">
                {product.name}
              </h4>
              <p className="text-xs text-gray-500 truncate">
                ₹{Number(product.price).toLocaleString()}
              </p>
            </div>
            <button className="text-xs bg-gray-800 hover:bg-terracotta px-2 py-1 rounded text-gray-400 hover:text-white transition-colors">
              Add
            </button>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No rugs found.
          </div>
        )}
      </div>
    </div>
  );
}
