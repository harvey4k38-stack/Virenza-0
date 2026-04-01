import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { usePostHog } from '@posthog/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './views/Home';
const ProductDetail = lazy(() => import('./views/ProductDetail'));
const CategoryView = lazy(() => import('./views/CategoryView'));
const CartView = lazy(() => import('./views/CartView'));
const CheckoutView = lazy(() => import('./views/CheckoutView'));
const SizingGuide = lazy(() => import('./views/SizingGuide'));
const About = lazy(() => import('./views/About'));
const Contact = lazy(() => import('./views/Contact'));
const ShippingTracking = lazy(() => import('./views/ShippingTracking'));
const LeaguesView = lazy(() => import('./views/LeaguesView'));
const JerseysView = lazy(() => import('./views/JerseysView'));
const LeagueClubsView = lazy(() => import('./views/LeagueClubsView'));
const PalaceReviews = lazy(() => import('./views/PalaceReviews'));
const JerseyReviews = lazy(() => import('./views/JerseyReviews'));
import { Product } from './types';
import { PRODUCTS, LEAGUE_TO_CLUBS, LEAGUE_CATEGORIES, INTERNATIONAL_CATEGORY_IDS, JERSEY_CATEGORIES } from './constants';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { getLogo } from './services/logoService';

type View = 'home' | 'product' | 'cart' | 'checkout' | 'sizing-guide' | 'about' | 'contact' | 'shipping-tracking' | (string & {});

export default function App() {
  const [view, setView] = useState<View>('home');
  const [previousView, setPreviousView] = useState<View>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [paypalSuccess, setPaypalSuccess] = useState(false);
  const [checkoutClientSecret, setCheckoutClientSecret] = useState('');

  useEffect(() => {
    const fetchLogo = async () => {
      const logoUrl = await getLogo();
      setLogo(logoUrl);
    };
    fetchLogo();
  }, []);

  // Handle PayPal redirect return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('virenza_order') === 'complete') {
      const saved = localStorage.getItem('virenza_pending_order');
      if (saved) {
        const order = JSON.parse(saved);
        fetch('/api/send-order-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order),
        }).catch(() => {});
        localStorage.removeItem('virenza_pending_order');
      }
      localStorage.removeItem('virenza_cart');
      window.history.replaceState({}, '', window.location.pathname);
      setPaypalSuccess(true);
    }
  }, []);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view, selectedProduct]);

  const posthog = usePostHog();
  const pageEntryTime = useRef<number>(Date.now());

  // Track page views + time on page
  useEffect(() => {
    const pageName = view === 'product' && selectedProduct ? `product:${selectedProduct.id}` : view;
    const timeSpent = Math.round((Date.now() - pageEntryTime.current) / 1000);
    if (timeSpent > 1) posthog?.capture('page_exit', { page: pageName, seconds: timeSpent });
    pageEntryTime.current = Date.now();
    posthog?.capture('$pageview', { page: pageName });
  }, [view, selectedProduct]);

  const handleProductClick = (product: Product) => {
    posthog?.capture('product_viewed', { product_id: product.id, product_name: product.name, price: product.price });
    setPreviousView(view);
    setSelectedProduct(product);
    setView('product');
  };

  const handleHomeClick = () => {
    setView('home');
    setSelectedProduct(null);
    setPaypalSuccess(false);
  };

  const handleCategoryClick = (category: string) => {
    setView(category);
    setSelectedProduct(null);
  };

  const getFilteredProducts = () => {
    if (view === 'chains') return PRODUCTS.filter(p => p.category === 'chains');
    if (view === 'bracelets') return PRODUCTS.filter(p => p.category === 'bracelets');
    if (view === 'best-sellers') return PRODUCTS.filter(p => p.isBestSeller);
    if (view === 'special-jerseys') return PRODUCTS.filter(p => p.name.toLowerCase().includes('special') && p.category.startsWith('jersey-'));
    if (view === 'retro-jerseys') return PRODUCTS.filter(p => p.name.toLowerCase().includes('retro') && p.category.startsWith('jersey-'));
    if (view === 'world-cup-2026') {
      const imgQ = (img: string) => img.includes('cdn.shopify') ? 3 : img.includes('/external/') ? 1 : 2;
      return PRODUCTS
        .filter(p => INTERNATIONAL_CATEGORY_IDS.has(p.category) && p.name.includes('2026'))
        .sort((a, b) => imgQ(b.images[0]) - imgQ(a.images[0]));
    }
    if (view.startsWith('jersey-')) return PRODUCTS.filter(p => p.category === view);
    if (view.startsWith('league-') && LEAGUE_TO_CLUBS[view]) {
      const clubs = new Set(LEAGUE_TO_CLUBS[view]);
      return PRODUCTS.filter(p => clubs.has(p.category));
    }
    return [];
  };

  const getTitle = () => {
    if (view === 'chains') return 'Chains';
    if (view === 'bracelets') return 'Bracelets';
    if (view === 'best-sellers') return 'Best Sellers';
    if (view === 'special-jerseys') return 'Special Jerseys';
    if (view === 'retro-jerseys') return 'Retro Jerseys';
    if (view === 'world-cup-2026') return '2026 World Cup';
    if (view.startsWith('jersey-')) {
      const cat = JERSEY_CATEGORIES.find(c => c.id === view);
      return cat ? cat.name : view;
    }
    if (view.startsWith('league-') && LEAGUE_TO_CLUBS[view]) {
      const league = LEAGUE_CATEGORIES.find(l => l.id === view);
      return league ? league.name : view;
    }
    return '';
  };

  return (
    <CurrencyProvider>
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
          <Suspense fallback={<div className="min-h-screen" />}>
          <>
            {paypalSuccess ? (
              <div key="paypal-success">
                <main className="pt-32 pb-24 max-w-3xl mx-auto px-6 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8 text-4xl">✓</div>
                    <h1 className="text-3xl font-bold uppercase tracking-[0.2em] mb-4">Order Confirmed</h1>
                    <p className="text-brand-gray-dark mb-12">Thank you for your purchase. A confirmation email has been sent to you.</p>
                    <button onClick={() => { setPaypalSuccess(false); handleHomeClick(); }} className="px-12 py-4 bg-brand-black text-white text-xs uppercase tracking-widest hover:opacity-80 transition-opacity">Return to Store</button>
                  </div>
                </main>
              </div>
            ) : view === 'home' ? (
              <div key="home">
                <Home onProductClick={handleProductClick} onNavigate={handleCategoryClick} />
              </div>
            ) : view === 'product' && selectedProduct ? (
              <div key="product">
                <ProductDetail
                  product={selectedProduct}
                  onBack={() => { setView(previousView); setSelectedProduct(null); }}
                  onNavigate={(v) => setView(v as View)}
                  onBuyNow={(cs) => { setCheckoutClientSecret(cs); setView('checkout'); }}
                />
              </div>
            ) : view === 'cart' ? (
              <div key="cart">
                <CartView
                  onCheckout={(cs: string) => { setCheckoutClientSecret(cs); setView('checkout'); }}
                  onBack={handleHomeClick}
                  onProductClick={handleProductClick}
                />
              </div>
            ) : view === 'checkout' ? (
              <div key="checkout">
                <CheckoutView
                  onBack={() => setView('cart')}
                  onSuccess={handleHomeClick}
                  initialClientSecret={checkoutClientSecret}
                />
              </div>
            ) : view === 'sizing-guide' ? (
              <div key="sizing-guide">
                <SizingGuide onBack={handleHomeClick} />
              </div>
            ) : view === 'jerseys' ? (
              <div key="jerseys">
                <JerseysView onCategoryClick={handleCategoryClick} onProductClick={handleProductClick} onBack={handleHomeClick} />
              </div>
            ) : view === 'club-jerseys' ? (
              <div key="club-jerseys">
                <JerseysView filter="club" onCategoryClick={handleCategoryClick} onProductClick={handleProductClick} onBack={handleHomeClick} />
              </div>
            ) : view === 'country-jerseys' ? (
              <div key="country-jerseys">
                <JerseysView filter="international" onCategoryClick={handleCategoryClick} onProductClick={handleProductClick} onBack={handleHomeClick} />
              </div>
            ) : view.startsWith('league-clubs-') ? (
              <div key={view}>
                <LeagueClubsView leagueId={view.replace('league-clubs-', 'league-')} onClubClick={handleCategoryClick} onBack={() => setView('jerseys')} />
              </div>
            ) : view === 'leagues' ? (
              <div key="leagues">
                <LeaguesView onLeagueClick={handleCategoryClick} onBack={handleHomeClick} />
              </div>
            ) : view === 'palace-reviews' ? (
              <div key="palace-reviews">
                <PalaceReviews onBack={() => setView('product')} />
              </div>
            ) : view === 'jersey-reviews-nike-away' ? (
              <div key="jersey-reviews-nike-away">
                <JerseyReviews jerseyId="j-nike-away-2026" onBack={() => setView('product')} />
              </div>
            ) : view === 'jersey-reviews-retro-saka' ? (
              <div key="jersey-reviews-retro-saka">
                <JerseyReviews jerseyId="j-retro-saka" onBack={() => setView('product')} />
              </div>
            ) : view === 'jersey-reviews-retro-gazza' ? (
              <div key="jersey-reviews-retro-gazza">
                <JerseyReviews jerseyId="j-retro-gazza" onBack={() => setView('product')} />
              </div>
            ) : view === 'about' ? (
              <div key="about">
                <About onBack={handleHomeClick} />
              </div>
            ) : view === 'contact' ? (
              <div key="contact">
                <Contact onBack={handleHomeClick} />
              </div>
            ) : view === 'shipping-tracking' ? (
              <div key="shipping-tracking">
                <ShippingTracking onBack={handleHomeClick} />
              </div>
            ) : (
              <div key={view}>
                <CategoryView
                  title={getTitle()}
                  products={getFilteredProducts()}
                  onProductClick={handleProductClick}
                  onBack={handleHomeClick}
                />
              </div>
            )}
          </>
          </Suspense>
        </div>

        <Footer 
          logo={logo} 
          onNavigate={(v) => setView(v as View)}
        />
      </div>
      <Analytics />
    </CartProvider>
    </CurrencyProvider>
  );
}
