'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { useAuth } from '@/context/AuthContext';
import {
  Search as SearchIcon,
  ChevronRight,
  Star,
  ChevronDown,
  ChevronUp,
  Loader,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import ImageSmart from '@/components/ImageSmart';
import { Order, CartItem } from '@/types';

// --- Constants ---
const PRIMARY_BLUE = '#2874F0';
const SUCCESS_GREEN = '#388E3C';

const ORDER_STATUS_FILTERS = [
  { id: 'on_the_way', label: 'On the way' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'returned', label: 'Returned' },
];

const ORDER_TIME_FILTERS = [
  { id: 'last_30_days', label: 'Last 30 days' },
  { id: '2025', label: '2025' },
  { id: '2024', label: '2024' },
  { id: 'older', label: 'Older' },
];

const OrdersPage = () => {
  const router = useRouter();
  const { orders, loading: shopLoading } = useShop();
  const { user, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [timeFilters, setTimeFilters] = useState<string[]>([]);
  const [isFiltersOpenMobile, setIsFiltersOpenMobile] = useState(false);

  const loading = shopLoading || authLoading;

  // Handle dynamic filtering
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Search filter (by product titles)
      const matchesSearch = order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (!matchesSearch) return false;

      // 2. Status filter
      if (statusFilters.length > 0) {
        // Map order.status to our filter IDs if necessary
        // Current status is 'pending' | 'confirmed' | 'shipped' | 'delivered'
        const mappedStatus = order.status;
        const normalizedStatusMap: { [key: string]: string } = {
          placed: 'on_the_way',
          packed: 'on_the_way',
          shipped: 'on_the_way',
          out_for_delivery: 'on_the_way',
          delivered: 'delivered',
          cancelled: 'cancelled',
          returned: 'returned',
        };
        const filterId = normalizedStatusMap[mappedStatus] || 'on_the_way';
        if (!statusFilters.includes(filterId)) return false;
      }

      // 3. Time filter
      if (timeFilters.length > 0) {
        const orderDate = new Date(order.date);
        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);

        const year = orderDate.getFullYear().toString();

        let match = false;
        if (timeFilters.includes('last_30_days') && orderDate >= thirtyDaysAgo)
          match = true;
        if (timeFilters.includes('2025') && year === '2025') match = true;
        if (timeFilters.includes('2024') && year === '2024') match = true;
        if (timeFilters.includes('older') && parseInt(year) < 2024)
          match = true;

        if (!match) return false;
      }

      return true;
    });
  }, [orders, searchQuery, statusFilters, timeFilters]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1f3f6]">
        <Loader className="animate-spin text-terracotta" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f1f3f6] p-4">
        <h2 className="text-2xl font-serif mb-4">
          Please login to view your orders
        </h2>
        <Link
          href="/login"
          className="bg-terracotta text-white px-8 py-3 rounded-lg font-medium hover:bg-black transition-colors"
        >
          Login Now
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f1f3f6] min-h-screen pb-12">
      {/* Breadcrumb - Top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center text-xs text-gray-500 gap-2">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <ChevronRight size={10} />
          <Link href="/account" className="hover:text-blue-600">
            My Account
          </Link>
          <ChevronRight size={10} />
          <span className="text-gray-900 font-medium">My Orders</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Section */}
        <div className="flex flex-col sm:flex-row gap-0 mb-4 shadow-sm rounded-sm">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search your orders here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 px-4 py-2 border border-gray-200 outline-none text-sm placeholder:text-gray-400"
            />
          </div>
          <button
            style={{ backgroundColor: PRIMARY_BLUE }}
            className="flex items-center justify-center gap-2 px-8 h-12 text-white font-medium text-sm transition-opacity hover:opacity-90"
          >
            <SearchIcon size={18} />
            <span>Search Orders</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Sidebar Filters - Desktop */}
          <div className="lg:w-1/4">
            <div className="lg:hidden mb-2">
              <button
                onClick={() => setIsFiltersOpenMobile(!isFiltersOpenMobile)}
                className="w-full bg-white px-4 py-3 flex justify-between items-center shadow-sm rounded-sm border border-gray-100"
              >
                <span className="font-bold text-gray-800">Filters</span>
                {isFiltersOpenMobile ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
            </div>

            <div
              className={`bg-white shadow-sm rounded-sm border border-gray-100 transition-all duration-300 overflow-hidden ${isFiltersOpenMobile ? 'max-h-[1000px] mb-4' : 'max-h-0 lg:max-h-none opacity-0 lg:opacity-100'}`}
            >
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Filters</h2>
              </div>

              <div className="p-4 space-y-6">
                {/* Status Section */}
                <section>
                  <h3 className="text-xs font-bold uppercase text-gray-900 mb-4 tracking-wider">
                    Order Status
                  </h3>
                  <div className="space-y-3">
                    {ORDER_STATUS_FILTERS.map((filter) => (
                      <label
                        key={filter.id}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            checked={statusFilters.includes(filter.id)}
                            onChange={() => {
                              setStatusFilters((prev) =>
                                prev.includes(filter.id)
                                  ? prev.filter((f) => f !== filter.id)
                                  : [...prev, filter.id]
                              );
                            }}
                            className="w-4 h-4 border-gray-300 rounded focus:ring-blue-500 checked:bg-blue-600 transition-colors"
                          />
                        </div>
                        <span className="text-sm text-gray-700 font-normal group-hover:text-black">
                          {filter.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </section>

                {/* Time Section */}
                <section>
                  <h3 className="text-xs font-bold uppercase text-gray-900 mb-4 tracking-wider">
                    Order Time
                  </h3>
                  <div className="space-y-3">
                    {ORDER_TIME_FILTERS.map((filter) => (
                      <label
                        key={filter.id}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            checked={timeFilters.includes(filter.id)}
                            onChange={() => {
                              setTimeFilters((prev) =>
                                prev.includes(filter.id)
                                  ? prev.filter((f) => f !== filter.id)
                                  : [...prev, filter.id]
                              );
                            }}
                            className="w-4 h-4 border-gray-300 rounded focus:ring-blue-500 checked:bg-blue-600 transition-colors"
                          />
                        </div>
                        <span className="text-sm text-gray-700 font-normal group-hover:text-black">
                          {filter.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="lg:w-3/4 space-y-4 pb-12">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) =>
                order.items.map((item, index) => (
                  <OrderCard
                    key={`${order.id}-${item.id}-${index}`}
                    order={order}
                    item={item}
                    router={router}
                  />
                ))
              )
            ) : (
              <EmptyOrders />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderCard = ({
  order,
  item,
  router,
}: {
  order: Order;
  item: CartItem;
  router: any;
}) => {
  const isDelivered = order.status === 'delivered';
  const statusColor = isDelivered ? SUCCESS_GREEN : PRIMARY_BLUE;

  const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      onClick={() => router.push(`/order/${order.id}`)}
      className="bg-white p-5 rounded-sm shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Left: Thumbnail & Details */}
        <div className="sm:flex-[0.5] flex gap-4">
          <div className="w-[100px] h-[100px] relative flex-shrink-0 bg-gray-50 rounded-sm overflow-hidden">
            <ImageSmart
              src={item.images[0]}
              alt={item.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-[15px] mb-1 leading-snug group-hover:text-blue-600 transition-colors truncate">
              {item.name}
            </h3>
            <div className="text-xs text-gray-500 space-y-1">
              {item.colors && item.colors.length > 0 && (
                <p>Color: {item.colors[0]}</p>
              )}
              <p>Size: {item.selectedSize}</p>
            </div>
          </div>
        </div>

        {/* Center: Price */}
        <div className="sm:flex-[0.15] sm:text-center flex sm:block items-center justify-between border-t sm:border-t-0 pt-3 sm:pt-0">
          <span className="text-sm font-bold text-gray-900">
            ₹{Number(item.price).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Right: Status */}
        <div className="sm:flex-[0.35] space-y-2 border-t sm:border-t-0 pt-3 sm:pt-0">
          <div className="flex items-start gap-3">
            <div
              className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
              style={{ backgroundColor: statusColor }}
            />
            <div>
              <p className="text-sm font-bold text-gray-900">
                {isDelivered
                  ? `Delivered on ${formattedDate}`
                  : order.status
                      .split('_')
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(' ')}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {isDelivered
                  ? 'Your item has been delivered'
                  : 'Your order is in progress'}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <div
              className="flex items-center gap-2 text-xs font-bold transition-colors"
              style={{ color: PRIMARY_BLUE }}
            >
              <Star size={14} fill={PRIMARY_BLUE} />
              <span>Rate & Review Product</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyOrders = () => (
  <div className="bg-white py-16 px-4 rounded-sm shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
    <div className="w-48 h-48 mb-6">
      <img
        src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/myorders-empty_832627.png"
        alt="No orders"
        className="w-full h-full object-contain opacity-80"
      />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">
      You have no orders yet.
    </h3>
    <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
      Rugs are the soul of a room. Start your collection today!
    </p>
    <Link
      href="/shop"
      className="bg-terracotta text-white px-8 py-2.5 rounded shadow-sm font-medium transition-colors hover:bg-black"
    >
      Shop Now
    </Link>
  </div>
);

export default OrdersPage;
