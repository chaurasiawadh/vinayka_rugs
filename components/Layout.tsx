import React from 'react';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import { useShop } from '../context/ShopContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { notification } = useShop();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <CartDrawer />
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 right-4 z-50 animate-slide-up">
           <div className={`px-6 py-3 rounded-lg shadow-lg text-white font-medium ${notification.type === 'success' ? 'bg-success' : 'bg-error'}`}>
              {notification.message}
           </div>
        </div>
      )}
      
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;