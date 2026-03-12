import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './views/Home';
import ProductDetail from './views/ProductDetail';
import CategoryView from './views/CategoryView';
import CartView from './views/CartView';
import CheckoutView from './views/CheckoutView';
import SizingGuide from './views/SizingGuide';
import About from './views/About';
import Contact from './views/Contact';
import { Product } from './types';
import { PRODUCTS } from './constants';
import { CartProvider } from './context/CartContext';
import { getLogo } from './services/logoService';

type View = 'home' | 'product' | 'chains' | 'bracelets' | 'best-sellers' | 'cart' | 'checkout' | 'sizing-guide' | 'about' | 'contact';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      const logoUrl = await getLogo();
      setLogo(logoUrl);
    };
    fetchLogo();
  }, []);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view, selectedProduct]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setView('product');
  };

  const handleHomeClick = () => {
    setView('home');
    setSelectedProduct(null);
  };

  const handleCategoryClick = (category: 'chains' | 'bracelets' | 'best-sellers') => {
    setView(category);
    setSelectedProduct(null);
  };

  const getFilteredProducts = () => {
    if (view === 'chains') return PRODUCTS.filter(p => p.category === 'chains');
    if (view === 'bracelets') return PRODUCTS.filter(p => p.category === 'bracelets');
    if (view === 'best-sellers') return PRODUCTS.filter(p => p.isBestSeller);
    return [];
  };

  const getTitle = () => {
    if (view === 'chains') return 'Chains';
    if (view === 'bracelets') return 'Bracelets';
    if (view === 'best-sellers') return 'Best Sellers';
    return '';
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar 
          onHome={handleHomeClick} 
          onNavigate={handleCategoryClick} 
          onCart={() => setView('cart')} 
          onAbout={() => setView('about')}
          logo={logo}
        />
        
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {view === 'home' ? (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Home 
                  onProductClick={handleProductClick} 
                  onNavigate={handleCategoryClick}
                />
              </motion.div>
            ) : view === 'product' && selectedProduct ? (
              <motion.div
                key="product"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ProductDetail 
                  product={selectedProduct} 
                  onBack={handleHomeClick} 
                />
              </motion.div>
            ) : view === 'cart' ? (
              <motion.div
                key="cart"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CartView 
                  onCheckout={() => setView('checkout')} 
                  onBack={handleHomeClick}
                  onProductClick={handleProductClick}
                />
              </motion.div>
            ) : view === 'checkout' ? (
              <motion.div
                key="checkout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CheckoutView 
                  onBack={() => setView('cart')}
                  onSuccess={handleHomeClick}
                />
              </motion.div>
            ) : view === 'sizing-guide' ? (
              <motion.div
                key="sizing-guide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <SizingGuide 
                  onBack={handleHomeClick}
                />
              </motion.div>
            ) : view === 'about' ? (
              <motion.div
                key="about"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <About onBack={handleHomeClick} />
              </motion.div>
            ) : view === 'contact' ? (
              <motion.div
                key="contact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Contact onBack={handleHomeClick} />
              </motion.div>
            ) : (
              <motion.div
                key={view}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CategoryView 
                  title={getTitle()}
                  products={getFilteredProducts()}
                  onProductClick={handleProductClick}
                  onBack={handleHomeClick}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Footer 
          logo={logo} 
          onNavigate={(v) => setView(v as View)}
        />
      </div>
    </CartProvider>
  );
}
