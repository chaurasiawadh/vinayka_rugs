'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Image as ImageIcon } from 'lucide-react';

interface HeroMediaAddCardProps {
  onClick: () => void;
  isEmpty: boolean;
}

const HeroMediaAddCard: React.FC<HeroMediaAddCardProps> = ({
  onClick,
  isEmpty,
}) => {
  return (
    <motion.button
      type="button"
      layout
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative min-h-[280px] w-full rounded-2xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-white to-cream/50 flex flex-col items-center justify-center gap-4 p-6 cursor-pointer transition-colors duration-300 hover:border-terracotta hover:bg-terracotta/5 group"
    >
      <div className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-terracotta group-hover:text-terracotta group-hover:bg-terracotta/10 transition-all duration-300 shadow-sm">
        <Plus size={28} strokeWidth={2} />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-700 group-hover:text-terracotta transition-colors">
          Add New
        </p>
        {isEmpty && (
          <>
            <p className="text-xs text-gray-500 mt-2 max-w-[200px] leading-relaxed">
              Add your first hero image or video. It will appear randomly on the
              home page.
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-gray-400 uppercase tracking-wider">
              <ImageIcon size={12} />
              Image or Video URL
            </div>
          </>
        )}
      </div>
    </motion.button>
  );
};

export default HeroMediaAddCard;
