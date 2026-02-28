'use client';

import React from 'react';
import { motion } from 'framer-motion';

const AnnouncementBar = () => {
  const content = [
    'Join the Vinaykarugs Family – To Get Upto 25% OFF on Holi Sale!',
    'Free Shipping, PAN India – Delivered with Care to Your Doorstep.',
  ];

  return (
    <div className="bg-[#966f51] text-[#faf7f5] py-2 px-4 border-b border-gray-100 overflow-hidden relative z-[60]">
      <div className="max-w-full mx-auto flex whitespace-nowrap overflow-hidden">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 20,
          }}
          className="flex items-center gap-12 font-medium text-[10px] sm:text-xs uppercase tracking-widest leading-none w-max"
        >
          {/* Output the text multiple times to create a seamless infinite scroll effect */}
          {[...Array(4)].map((_, i) => (
            <React.Fragment key={i}>
              {content.map((text, index) => (
                <div key={`${i}-${index}`} className="flex items-center">
                  <span className="opacity-80 hover:opacity-100 transition-opacity">
                    {text}
                  </span>
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
