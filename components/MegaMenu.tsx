'use client';

import React from 'react';
import Link from 'next/link';
import { COLLECTIONS, CATEGORIES, SIZES, MATERIALS, ROOMS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

interface MegaMenuProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({
  isOpen,
  onMouseEnter,
  onMouseLeave,
}) => {
  // Mock collaborations for now as they aren't in constants
  const _COLLABORATIONS = [
    'Vinayka x Designers',
    'Heritage Series',
    'Artist Spotlight',
    'Custom Works',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'linear' }}
          className="absolute top-full left-0 w-full bg-white shadow-xl z-50 border-t border-gray-100"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex gap-12">
              {/* Featured Image Section - Left Side */}
              <div className="w-1/4 flex flex-col gap-6 items-center">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm group cursor-pointer">
                  <img
                    src="https://placehold.co/800x600?text=Vinayka+Gallery" // Artisan weaving
                    alt="Shop All"
                    className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                </div>
                <Link
                  href="/shop"
                  className="text-[11px] uppercase tracking-[0.25em] font-medium text-gray-400 hover:text-terracotta transition-colors inline-flex items-center gap-2 "
                >
                  Shop All
                </Link>
              </div>

              {/* Links Grid - Right Side */}
              {/* Links Grid - Right Side */}
              <div className="flex-1 grid grid-cols-5 gap-6">
                {/* Column 1: Collections */}
                <div className="space-y-6">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">
                    Collection
                  </h4>
                  <ul className="space-y-3">
                    {COLLECTIONS.map((item) => (
                      <li key={item}>
                        <Link
                          href={`/shop?collection=${item}`}
                          className="text-[13px] font-light text-gray-400 hover:text-terracotta transition-colors block"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href="/shop"
                        className="text-[13px] font-light text-gray-400 hover:text-terracotta transition-colors block mt-2"
                      >
                        All Collections
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Styles (was Category) */}
                <div className="space-y-6">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">
                    Style
                  </h4>
                  <ul className="space-y-3">
                    {CATEGORIES.map((item) => (
                      <li key={item}>
                        <Link
                          href={`/shop?cat=${item}`}
                          className="text-[13px] font-light text-gray-400 hover:text-terracotta transition-colors block"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href="/shop"
                        className="text-[13px] font-light text-gray-400 hover:text-terracotta transition-colors block mt-2"
                      >
                        All Styles
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Column 3: Material */}
                <div className="space-y-6">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">
                    Material
                  </h4>
                  <ul className="space-y-3">
                    {MATERIALS.map((item) => (
                      <li key={item}>
                        <Link
                          href={`/shop?material=${item}`}
                          className="text-[13px] font-light text-gray-400 hover:text-terracotta transition-colors block"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 4: Rooms (was Collaborations) */}
                <div className="space-y-6">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">
                    Room
                  </h4>
                  <ul className="space-y-3">
                    {ROOMS.map((item) => (
                      <li key={item}>
                        <Link
                          href={`/shop?room=${item}`}
                          className="text-[13px] font-light text-gray-400 hover:text-terracotta transition-colors block"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 5: Sizes */}
                <div className="space-y-6">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">
                    Size
                  </h4>
                  <ul className="space-y-3">
                    {SIZES.slice(0, 4).map((item) => {
                      const feet = item.replace(' ft', '');
                      const [w, h] = feet.split('x').map(Number);
                      const cmDisplay =
                        w && h ? ` / ${w * 30}x${h * 30} cm` : '';

                      return (
                        <li key={item}>
                          <Link
                            href={`/shop?size=${item}`}
                            className="text-[13px] font-light text-gray-400 hover:text-terracotta transition-colors block"
                          >
                            {item}
                            {cmDisplay}
                          </Link>
                        </li>
                      );
                    })}
                    <li>
                      <Link
                        href="/shop"
                        className="text-[13px] font-light text-gray-400 hover:text-terracotta transition-colors block mt-2"
                      >
                        All Sizes
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MegaMenu;
