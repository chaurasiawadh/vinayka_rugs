'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader, Package, MapPin, Calendar } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import Button from '@/components/Button';
import Link from 'next/link';

const OrderSuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { orders } = useShop();

  const [stage, setStage] = useState<'loading' | 'success' | 'summary'>(
    'loading'
  );
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    // Find the order in context
    const foundOrder = orders.find((o) => o.id === orderId);
    if (foundOrder) {
      setOrder(foundOrder);
    }

    // Flow Timing
    const timer1 = setTimeout(() => setStage('success'), 1500);
    const timer2 = setTimeout(() => setStage('summary'), 3500);
    const timer3 = setTimeout(() => {
      router.push(`/order/${orderId}`);
    }, 7500); // 1.5 (loading) + 2 (success tick) + 4 (summary) = 7.5s

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [orderId, orders, router]);

  const formattedDate = order?.date
    ? new Date(order.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const estDelivery = order?.estimatedDelivery
    ? new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {stage === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <Loader className="w-12 h-12 text-terracotta animate-spin mb-4" />
            <p className="text-gray-500 font-medium">
              Processing your order...
            </p>
          </motion.div>
        )}

        {stage === 'success' && (
          <motion.div
            key="success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-200"
            >
              <motion.div
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Check className="w-12 h-12 text-white stroke-[3px]" />
              </motion.div>
            </motion.div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2 text-center">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-500 text-center">
              Your masterpiece is being prepared.
            </p>
          </motion.div>
        )}

        {stage === 'summary' && (
          <motion.div
            key="summary"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-green-500 p-6 text-white text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Check className="w-5 h-5 border-2 border-white rounded-full p-0.5" />
                <span className="font-bold tracking-wide uppercase text-sm">
                  Confirmation
                </span>
              </div>
              <h2 className="text-2xl font-serif font-bold">
                Thank You for Your Order!
              </h2>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Order ID
                      </p>
                      <p className="font-mono font-bold text-gray-900">
                        {orderId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Order Date
                      </p>
                      <p className="font-bold text-gray-900">{formattedDate}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Delivery To
                      </p>
                      <p className="font-bold text-gray-100 truncate max-w-[200px] text-gray-900">
                        {order?.shippingAddress.fullName}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">
                        {order?.shippingAddress.line1},{' '}
                        {order?.shippingAddress.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-50 rounded-lg text-green-600">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Estimated Delivery
                      </p>
                      <p className="font-bold text-gray-900">{estDelivery}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                <Link href={`/order/${orderId}`} className="flex-1">
                  <Button fullWidth>View Order Details</Button>
                </Link>
                <Link href="/shop" className="flex-1">
                  <Button fullWidth variant="outline">
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              <div className="mt-8 text-center text-[10px] text-gray-400 uppercase tracking-widest">
                Redirecting to tracking page in a moment...
              </div>
            </div>

            <motion.div
              className="h-1 bg-terracotta origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 4, ease: 'linear', delay: 3.5 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const OrderSuccessPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <OrderSuccessContent />
  </Suspense>
);

export default OrderSuccessPage;
