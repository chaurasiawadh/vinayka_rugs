'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit2, ChevronUp, ChevronDown } from 'lucide-react';
import { HeroMediaItem } from '@/types/hero-media.types';
import { HERO_MEDIA_ERRORS } from '@/constants';

interface HeroMediaCardProps {
  item: HeroMediaItem;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  canDelete: boolean;
  isReordering: boolean;
  onEdit: (item: HeroMediaItem) => void;
  onDelete: (id: string) => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
  isNew?: boolean;
}

const HeroMediaCard: React.FC<HeroMediaCardProps> = ({
  item,
  index,
  isFirst,
  isLast,
  canDelete,
  isReordering,
  onEdit,
  onDelete,
  onReorder,
  isNew = false,
}) => {
  return (
    <motion.div
      layout
      initial={isNew ? { opacity: 0, scale: 0.96 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group relative rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg min-h-[280px] flex flex-col"
    >
      <div className="aspect-video relative bg-black flex-shrink-0">
        {item.type === 'video' ? (
          <video
            src={item.url}
            className="w-full h-full object-cover"
            muted
            playsInline
            poster={item.thumbnail}
          />
        ) : (
          <img src={item.url} alt="" className="w-full h-full object-cover" />
        )}
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm ${
            item.type === 'video'
              ? 'bg-purple-600 text-white'
              : 'bg-terracotta text-white'
          }`}
        >
          {item.type}
        </span>
      </div>

      <div className="p-4 flex flex-wrap gap-2 items-center justify-between mt-auto border-t border-gray-100">
        <span className="text-xs font-medium text-gray-500">
          Order #{index + 1}
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onReorder(item.id, 'up')}
            disabled={isFirst || isReordering}
            className="p-2 rounded-lg border border-gray-200 hover:bg-cream hover:border-terracotta/30 disabled:opacity-40 transition-colors"
            aria-label="Move up"
          >
            <ChevronUp size={16} />
          </button>
          <button
            type="button"
            onClick={() => onReorder(item.id, 'down')}
            disabled={isLast || isReordering}
            className="p-2 rounded-lg border border-gray-200 hover:bg-cream hover:border-terracotta/30 disabled:opacity-40 transition-colors"
            aria-label="Move down"
          >
            <ChevronDown size={16} />
          </button>
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="p-2 rounded-lg border border-gray-200 hover:bg-cream hover:border-terracotta/30 transition-colors"
            aria-label="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            disabled={!canDelete}
            title={!canDelete ? HERO_MEDIA_ERRORS.cannotDeleteLast : 'Delete'}
            className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroMediaCard;
