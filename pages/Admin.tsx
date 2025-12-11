import React from 'react';
import { Package, ShoppingCart, Users, TrendingUp, Bell, PenTool } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { MOCK_PRODUCTS } from '../constants';
import Button from '../components/Button';

const Admin: React.FC = () => {
  const { orders, notify, bespokeRequests } = useShop();

  const handleTriggerNotification = () => {
      notify('Test notification blast sent to 142 subscribers', 'success');
  };

  const stats = [
    { title: 'Total Sales', value: '₹4.2M', icon: <TrendingUp size={20} className="text-success" /> },
    { title: 'Orders', value: orders.length.toString(), icon: <ShoppingCart size={20} className="text-terracotta" /> },
    { title: 'Bespoke Requests', value: bespokeRequests.length.toString(), icon: <PenTool size={20} className="text-teal" /> },
    { title: 'Watchlist Subs', value: '1,204', icon: <Bell size={20} className="text-amber" /> },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
               <div>
                  <p className="text-sm text-text-muted mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
               </div>
               <div className="p-3 bg-gray-50 rounded-full">
                  {stat.icon}
               </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Recent Orders */}
           <div className="lg:col-span-2 space-y-8">
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-serif text-xl mb-6">Recent Orders</h2>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left text-sm">
                        <thead>
                           <tr className="border-b border-gray-100 text-text-muted">
                              <th className="pb-3 font-medium">Order ID</th>
                              <th className="pb-3 font-medium">Customer</th>
                              <th className="pb-3 font-medium">Status</th>
                              <th className="pb-3 font-medium">Total</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                           {orders.length > 0 ? orders.map(order => (
                              <tr key={order.id}>
                                 <td className="py-4 font-medium">{order.id}</td>
                                 <td className="py-4">{order.shippingAddress.fullName}</td>
                                 <td className="py-4">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium uppercase">{order.status}</span>
                                 </td>
                                 <td className="py-4">₹{order.total.toLocaleString('en-IN')}</td>
                              </tr>
                           )) : (
                              <tr>
                                 <td colSpan={4} className="py-4 text-center text-text-muted">No recent orders (Place one in Checkout)</td>
                              </tr>
                           )}
                           <tr className="opacity-60">
                              <td className="py-4 font-medium">ORD-9921</td>
                              <td className="py-4">Rajesh Kumar</td>
                              <td className="py-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium uppercase">Shipped</span></td>
                              <td className="py-4">₹125,000</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>

               {/* Bespoke Requests List */}
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-serif text-xl mb-6">Bespoke Inquiries</h2>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left text-sm">
                        <thead>
                           <tr className="border-b border-gray-100 text-text-muted">
                              <th className="pb-3 font-medium">Client</th>
                              <th className="pb-3 font-medium">Method</th>
                              <th className="pb-3 font-medium">Req Type</th>
                              <th className="pb-3 font-medium">Source</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                           {bespokeRequests.length > 0 ? bespokeRequests.map((req, i) => (
                              <tr key={i}>
                                 <td className="py-4 font-medium">
                                     {req.name}<br/>
                                     <span className="text-xs text-text-muted">{req.phone}</span>
                                 </td>
                                 <td className="py-4">{req.communicationMethod}</td>
                                 <td className="py-4">{req.rugType}</td>
                                 <td className="py-4 text-xs text-text-muted">{req.source}</td>
                              </tr>
                           )) : (
                              <tr>
                                 <td colSpan={4} className="py-4 text-center text-text-muted">No pending bespoke requests.</td>
                              </tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>
           </div>

           {/* Watchlist & Inventory Actions */}
           <div className="space-y-8">
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-serif text-xl mb-4">Watchlist Campaigns</h2>
                    <p className="text-sm text-text-muted mb-4">Notify users about price drops on 'Aether Mist'.</p>
                    <div className="bg-amber/10 text-amber-800 p-3 rounded text-sm mb-4">
                        142 users waiting for price drop on Aether Mist.
                    </div>
                    <Button fullWidth size="sm" onClick={handleTriggerNotification}>
                        Send "Price Drop" Alert
                    </Button>
               </div>

               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-serif text-xl mb-4">Low Stock Alert</h2>
                  <ul className="space-y-4">
                     {MOCK_PRODUCTS.slice(0, 3).map(p => (
                        <li key={p.id} className="flex gap-4 items-center">
                           <img src={p.images[0]} className="w-12 h-12 rounded object-cover" alt={p.name} />
                           <div>
                              <p className="font-medium text-sm">{p.name}</p>
                              <p className="text-xs text-error">Only 2 left in stock</p>
                           </div>
                        </li>
                     ))}
                  </ul>
                  <button className="w-full mt-6 py-2 text-sm text-terracotta border border-terracotta rounded-lg hover:bg-terracotta hover:text-white transition-colors">
                     Restock Now
                  </button>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;