'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, MessageSquare, MapPin, Package } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import OrderTracker from '@/components/OrderTracker';
import ImageSmart from '@/components/ImageSmart';
import Button from '@/components/Button';
import Link from 'next/link';
import { Order } from '@/types';

const OrderDetailsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const { orders, loading } = useShop();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!loading && orders.length > 0 && orderId) {
      const found = orders.find((o) => o.id === orderId);
      if (found) {
        setOrder(found);
      }
    }
  }, [loading, orders, orderId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!order && !loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-4">Order Not Found</h2>
        <Link href="/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    );

  if (!order) return null;

  return (
    <div className="bg-[#f1f3f6] min-h-screen pb-12 pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Actions */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push('/orders')}
            className="flex items-center text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to My Orders
          </button>
        </div>

        {/* Status Tracker Card */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 mb-4 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-100 pb-4 mb-6">
            <div>
              <h3 className="text-xs font-bold uppercase text-gray-400 mb-1">
                Delivery Address
              </h3>
              <p className="text-sm font-bold text-gray-900">
                {order.shippingAddress.fullName}
              </p>
              <p className="text-[13px] text-gray-600 mt-1 leading-relaxed">
                {order.shippingAddress.line1},{' '}
                {order.shippingAddress.line2 &&
                  order.shippingAddress.line2 + ', '}
                {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                {order.shippingAddress.pincode}
              </p>
              <p className="text-sm font-bold text-gray-900 mt-2">
                Phone: {order.shippingAddress.phone}
              </p>
            </div>
            <div className="md:px-8 mt-6 md:mt-0"></div>
            <div className="md:px-8 mt-6 md:mt-0">
              <div className="flex flex-col items-end">
                <h3 className="text-xs font-bold uppercase text-gray-400 mb-1">
                  Order Summary
                </h3>
                <p className="text-sm font-bold text-gray-900">
                  ₹{order.total.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-gray-500">via Prepaid Mode</p>
              </div>
            </div>
          </div>

          <div className="py-4">
            <OrderTracker
              currentStatus={order.status}
              history={order.trackingHistory}
            />
          </div>
        </div>

        {/* Product List */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          {order.items.map((item: any) => (
            <div
              key={`${item.id}-${item.selectedSize}`}
              className="p-6 border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-colors"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-20 h-24 relative flex-shrink-0 bg-gray-50 rounded overflow-hidden">
                  <ImageSmart
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[15px] font-medium text-gray-900 mb-1 hover:text-blue-600 transition-colors cursor-pointer">
                        {item.name}
                      </h3>
                      <div className="flex wrap gap-4 text-xs text-gray-500">
                        <span>
                          Size: <b>{item.selectedSize}</b>
                        </span>
                        {item.colors && (
                          <span>
                            Color: <b>{item.colors[0]}</b>
                          </span>
                        )}
                        <span>
                          Qty: <b>{item.quantity}</b>
                        </span>
                      </div>
                      <p className="text-sm font-bold text-gray-900 mt-3">
                        ₹{item.price.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="hidden md:block text-right">
                      <p className="text-sm font-bold text-gray-900 mb-2 underline">
                        Rate & Review Product
                      </p>
                      <div className="flex items-center gap-1 text-xs text-blue-600 font-bold mb-4">
                        <MessageSquare size={14} /> <span>Write a Review</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-gray-50/50 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Package className="text-gray-400" />
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">
                  Estimated Delivery
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {order.estimatedDelivery
                    ? new Date(order.estimatedDelivery).toLocaleDateString(
                        'en-US',
                        { weekday: 'long', month: 'short', day: 'numeric' }
                      )
                    : 'TBD'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Link href={`/product/${order.items[0].id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white text-blue-600 hover:bg-gray-800"
                >
                  Buy Again
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Ad / Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Package size={20} />
            </div>
            <p className="text-xs font-bold text-gray-700 leading-tight">
              Authentic Rugs <br /> Direct to you
            </p>
          </div>
          <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
              <MapPin size={20} />
            </div>
            <p className="text-xs font-bold text-gray-700 leading-tight">
              Global <br /> Craftsmanship
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderDetailsPage = () => (
  <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    }
  >
    <OrderDetailsContent />
  </Suspense>
);

export default OrderDetailsPage;
