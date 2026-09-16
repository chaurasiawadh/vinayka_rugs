'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Star } from 'lucide-react';

const items = [
  { icon: Truck, text: 'Free Shipping Pan India — Delivered with Care' },
  { icon: Star, text: 'Up to 25% Off — Join the Vinayka Rugs Family' },
  { icon: Truck, text: 'Hand-Knotted Luxury • Crafted Since 1982' },
  { icon: Star, text: 'Free Shipping Pan India — Delivered with Care' },
];

const AnnouncementBar = () => {
  return (
    <div className="bg-terracotta text-white/95 py-2 overflow-hidden relative z-[60]">
      <div className="flex whitespace-nowrap overflow-hidden">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 22,
          }}
          className="flex items-center gap-0 w-max"
        >
          {[...Array(2)].map((_, outer) => (
            <React.Fragment key={outer}>
              {items.map(({ icon: Icon, text }, i) => (
                <div
                  key={`${outer}-${i}`}
                  className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-8"
                >
                  <Icon
                    size={12}
                    className="shrink-0 opacity-75 sm:w-3 sm:h-3"
                  />
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.16em] leading-none">
                    {text}
                  </span>
                  <span className="text-white/30 mx-4 text-sm">|</span>
                </div>
              ))}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
