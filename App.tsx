import React from 'react';
import { HashRouter as Router, Routes, Route, ScrollRestoration } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Events from './pages/Events';
import Admin from './pages/Admin';
import SearchResults from './pages/SearchResults';
import Watchlist from './pages/Watchlist';
import { ShopProvider } from './context/ShopContext';

const ScrollToTop = () => {
    const { pathname } = React.useMemo(() => window.location, []); 
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

const App: React.FC = () => {
  return (
    <ShopProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/events" element={<Events />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<div className="p-20 text-center">Page Not Found</div>} />
          </Routes>
        </Layout>
      </Router>
    </ShopProvider>
  );
};

export default App;