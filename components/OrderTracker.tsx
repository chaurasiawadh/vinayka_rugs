'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Package, Truck, Home, Box } from 'lucide-react';

interface OrderTrackerProps {
  currentStatus:
    | 'placed'
    | 'packed'
    | 'shipped'
    | 'out_for_delivery'
    | 'delivered';
  history?: any[];
}

const STEPS = [
  { id: 'placed', label: 'Order Placed', icon: Box },
  { id: 'packed', label: 'Packed', icon: Package },
  { id: 'shipped', label: 'Shipped', icon: Truck },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: Home },
];

const OrderTracker: React.FC<OrderTrackerProps> = ({
  currentStatus,
  history = [],
}) => {
  const currentIndex = STEPS.findIndex((step) => step.id === currentStatus);

  return (
    <div className="w-full py-8">
      <div className="relative flex justify-between">
        {/* Background Line */}
        <div className="absolute top-[18px] left-[10%] right-[10%] h-0.5 bg-gray-200" />

        {/* Progress Line */}
        <motion.div
          className="absolute top-[18px] left-[10%] h-0.5 bg-green-500 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: currentIndex / (STEPS.length - 1) }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ width: '80%' }}
        />

        {STEPS.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isActive = index === currentIndex;
          const stepData = history.find((h) => h.status === step.id);

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center flex-1"
            >
              {/* Step Circle */}
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted ? '#22c55e' : '#ffffff',
                  borderColor: isCompleted ? '#22c55e' : '#e5e7eb',
                  scale: isActive ? 1.2 : 1,
                }}
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-shadow ${isActive ? 'shadow-lg shadow-green-100' : ''}`}
              >
                {isCompleted ? (
                  <Check size={18} className="text-white" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                )}
              </motion.div>

              {/* Label */}
              <div className="mt-4 text-center">
                <p
                  className={`text-[10px] font-bold uppercase tracking-tight ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}
                >
                  {step.label}
                </p>
                {stepData?.date && (
                  <p className="text-[9px] text-gray-500 mt-0.5">
                    {new Date(stepData.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                )}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 px-2 py-0.5 bg-green-100 rounded text-[8px] font-bold text-green-700 uppercase"
                  >
                    Current
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracker;
