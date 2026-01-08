
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import BespokeModal from './BespokeModal';
import LoginModal from './LoginModal';
import { useShop } from '../context/ShopContext';

interface LayoutProps {
  children: React.ReactNode;
}

import { usePathname } from 'next/navigation';

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { notification } = useShop();
  const pathname = usePathname();
  const isAdminRequest = pathname?.startsWith('/admin');

  if (isAdminRequest) {
    return (
      <>
        {children}
        {notification && (
          <div className="fixed top-24 right-4 z-[70] animate-slide-up">
            <div className={`px-6 py-3 rounded-lg shadow-lg text-white font-medium ${notification.type === 'success' ? 'bg-success' : notification.type === 'error' ? 'bg-error' : 'bg-gray-800'}`}>
              {notification.message}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <CartDrawer />
      <BespokeModal />
      <LoginModal />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 right-4 z-[70] animate-slide-up">
          <div className={`px-6 py-3 rounded-lg shadow-lg text-white font-medium ${notification.type === 'success' ? 'bg-success' : notification.type === 'error' ? 'bg-error' : 'bg-gray-800'}`}>
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
