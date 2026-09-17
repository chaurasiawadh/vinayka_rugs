'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import {
  getDocs,
  doc,
  updateDoc,
  query,
  collectionGroup,
} from 'firebase/firestore';
import { Order, OrderTrackingStep } from '@/types';
import {
  Search,
  Loader,
  Eye,
  ArrowLeft,
  Truck,
  CheckCircle,
  Package,
  Calendar,
  User,
  MapPin,
} from 'lucide-react';
import Image from 'next/image';

const STATUS_OPTIONS = [
  { value: 'placed', label: 'Placed' },
  { value: 'packed', label: 'Packed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
];

const OrderManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status updating state
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<Order['status']>('placed');
  const [trackingMessage, setTrackingMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collectionGroup(db, 'orders'));
      const querySnapshot = await getDocs(q);
      const ordersData: Order[] = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({
          id: doc.id,
          _path: doc.ref.path,
          ...doc.data(),
        } as any);
      });

      // Sort locally to avoid needing a Firestore composite index
      ordersData.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setOrders(ordersData);
    } catch (error) {
      // console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setUpdating(true);

    try {
      const orderPath = (selectedOrder as any)._path;
      if (!orderPath) throw new Error('Order path not found');
      const orderRef = doc(db, orderPath);

      const newHistoryStep: OrderTrackingStep = {
        status: newStatus,
        date: new Date().toISOString(),
        isCompleted: true,
        message: trackingMessage,
      };

      const updatedHistory = [
        ...(selectedOrder.trackingHistory || []),
        newHistoryStep,
      ];

      await updateDoc(orderRef, {
        status: newStatus,
        trackingHistory: updatedHistory,
      });

      // Update local state
      const updatedOrder = {
        ...selectedOrder,
        status: newStatus,
        trackingHistory: updatedHistory,
      };
      setSelectedOrder(updatedOrder);
      setOrders(
        orders.map((o) => (o.id === selectedOrder.id ? updatedOrder : o))
      );
      setTrackingMessage('');
    } catch (error) {
      // console.error('Error updating order:', error);
      alert('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.shippingAddress?.fullName.toLowerCase().includes(searchLower) ||
      (order.shippingAddress as any)?.email
        ?.toLowerCase()
        .includes(searchLower) ||
      order.shippingAddress?.phone.includes(searchLower)
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
        return 'bg-blue-100 text-blue-800';
      case 'packed':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'out_for_delivery':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-terracotta" size={40} />
      </div>
    );
  }

  // --- ORDER DETAILS VIEW ---
  if (selectedOrder) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedOrder(null);
              setTrackingMessage('');
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-terracotta transition-colors"
          >
            <ArrowLeft size={20} /> Back to Orders
          </button>
          <div className="text-sm text-gray-500">
            Order Date: {formatDate(selectedOrder.date)}
          </div>
        </div>

        <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h2 className="text-2xl font-bold font-playfair mb-1">
              Order #{selectedOrder.id}
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedOrder.status)}`}
              >
                {selectedOrder.status.replace('_', ' ')}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${selectedOrder.paymentMethod === 'COD' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}
              >
                {selectedOrder.paymentMethod === 'COD'
                  ? 'COD'
                  : 'Paid (Razorpay)'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Grand Total</div>
            <div className="text-2xl font-bold text-terracotta">
              {formatCurrency(selectedOrder.total)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Package size={20} /> Items Ordered (
                {selectedOrder.items.length})
              </h3>
              <div className="space-y-4">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 border rounded-lg">
                    <div className="w-20 h-20 relative rounded-md overflow-hidden flex-shrink-0 bg-gray-50">
                      <Image
                        src={item.images?.[0] || '/images/placeholder.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {item.name}
                      </h4>
                      <div className="text-sm text-gray-500 mt-1 space-y-1">
                        <p>Size: {item.selectedSize}</p>
                        <p>Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatCurrency(Number(item.price) * item.quantity)}
                      </div>
                      <div className="text-sm text-gray-500 line-through">
                        {formatCurrency(Number(item.mrp) * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking History */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Truck size={20} /> Fulfillment & Tracking
              </h3>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                <h4 className="font-semibold mb-3 text-sm uppercase text-gray-500">
                  Update Status
                </h4>
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      New Status
                    </label>
                    <select
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-terracotta focus:border-terracotta"
                      value={newStatus}
                      onChange={(e) =>
                        setNewStatus(e.target.value as Order['status'])
                      }
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-[2]">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Tracking Info / Message
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-terracotta focus:border-terracotta"
                      placeholder="e.g. Tracking ID: 123456789 (FedEx)"
                      value={trackingMessage}
                      onChange={(e) => setTrackingMessage(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleUpdateStatus}
                    disabled={updating}
                    className="bg-terracotta text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-terracotta/90 disabled:opacity-50 transition-colors"
                  >
                    {updating ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </div>

              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gray-200">
                {(selectedOrder.trackingHistory || []).map((step, index) => (
                  <div
                    key={index}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-6"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-terracotta text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
                      <CheckCircle size={18} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-gray-900 capitalize">
                          {step.status.replace('_', ' ')}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                          {formatDate(step.date)}
                        </div>
                      </div>
                      {step.message && (
                        <div className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                          {step.message}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {(!selectedOrder.trackingHistory ||
                  selectedOrder.trackingHistory.length === 0) && (
                  <p className="text-sm text-gray-500 py-4">
                    No tracking history available yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Customer Details */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <User size={20} /> Customer Details
              </h3>
              <div className="space-y-3 text-sm">
                <p className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Name:</span>
                  <span className="text-gray-600">
                    {selectedOrder.shippingAddress?.fullName}
                  </span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Phone:</span>
                  <span className="text-gray-600">
                    {selectedOrder.shippingAddress?.phone}
                  </span>
                </p>
                {/* Fallback if email is in shipping address, otherwise not available directly without fetching user */}
                {(selectedOrder.shippingAddress as any)?.email && (
                  <p className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Email:</span>
                    <span className="text-gray-600">
                      {(selectedOrder.shippingAddress as any)?.email}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin size={20} /> Shipping Address
              </h3>
              <div className="text-sm text-gray-600 leading-relaxed">
                <p className="font-medium text-gray-900 mb-1">
                  {selectedOrder.shippingAddress?.fullName}
                </p>
                <p>{selectedOrder.shippingAddress?.line1}</p>
                {selectedOrder.shippingAddress?.line2 && (
                  <p>{selectedOrder.shippingAddress?.line2}</p>
                )}
                <p>
                  {selectedOrder.shippingAddress?.city},{' '}
                  {selectedOrder.shippingAddress?.state}
                </p>
                <p>PIN: {selectedOrder.shippingAddress?.pincode}</p>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4">Financial Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(selectedOrder.total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (Included)</span>
                  <span>--</span>
                </div>
                <div className="pt-3 border-t flex justify-between font-bold text-gray-900 text-base">
                  <span>Grand Total</span>
                  <span className="text-terracotta">
                    {formatCurrency(selectedOrder.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- ORDER LIST VIEW ---
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-playfair">
            Orders Management
          </h1>
          <p className="text-gray-500 text-sm">
            View and manage customer orders.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent text-sm"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs border-b">
              <tr>
                <th className="px-6 py-4">Order ID & Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4 text-right">Total Amount</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        #{order.id.slice(0, 8)}...
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Calendar size={12} /> {formatDate(order.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {order.shippingAddress?.fullName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.shippingAddress?.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize inline-block ${getStatusColor(order.status)}`}
                      >
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">{order.items.length} item(s)</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 text-terracotta hover:bg-terracotta/10 px-3 py-1.5 rounded-lg transition-colors font-medium"
                      >
                        <Eye size={16} /> View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No orders found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderManager;
