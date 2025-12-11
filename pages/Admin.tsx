import React from 'react';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { MOCK_PRODUCTS } from '../constants';

const Admin: React.FC = () => {
  const { orders } = useShop();

  const stats = [
    { title: 'Total Sales', value: '₹4.2M', icon: <TrendingUp size={20} className="text-success" /> },
    { title: 'Orders', value: orders.length.toString(), icon: <ShoppingCart size={20} className="text-terracotta" /> },
    { title: 'Products', value: MOCK_PRODUCTS.length.toString(), icon: <Package size={20} className="text-teal" /> },
    { title: 'Customers', value: '1,204', icon: <Users size={20} className="text-amber" /> },
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
           <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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
                       {/* Mock Rows */}
                       <tr className="opacity-60">
                          <td className="py-4 font-medium">ORD-9921</td>
                          <td className="py-4">Rajesh Kumar</td>
                          <td className="py-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium uppercase">Shipped</span></td>
                          <td className="py-4">₹125,000</td>
                       </tr>
                       <tr className="opacity-60">
                          <td className="py-4 font-medium">ORD-9920</td>
                          <td className="py-4">Sarah Jenkins</td>
                          <td className="py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium uppercase">Delivered</span></td>
                          <td className="py-4">₹45,000</td>
                       </tr>
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Inventory Alert */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-serif text-xl mb-6">Low Stock Alert</h2>
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
                 Manage Inventory
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;