import { useState, useMemo, type FormEvent } from 'react';
import { PRODUCTS, JERSEY_CATEGORIES, REVIEWS, INTERNATIONAL_CATEGORY_IDS, FEATURED_PRODUCT_IDS, WC_2026_FEATURED_IDS } from '../constants';

const WC_2026_PRODUCTS = WC_2026_FEATURED_IDS
  .map(id => PRODUCTS.find(p => p.id === id))
  .filter(Boolean) as import('../types').Product[];

const SPECIAL_PRODUCTS = PRODUCTS.filter(p => p.name.toLowerCase().includes('special') && p.category.startsWith('jersey-'));
import ProductCard from '../components/ProductCard';
import GlowButton from '../components/GlowButton';
import ReviewCard from '../components/ReviewCard';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface HomeProps {
  onProductClick: (product: Product) => void;
  onNavigate: (cat: string) => void;
}


export default function Home({ onProductClick, onNavigate }: HomeProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [jerseyFilter, setJerseyFilter] = useState<'all' | 'international' | 'club'>('all');

  const filteredCategories = useMemo(() => {
    if (jerseyFilter === 'international') return JERSEY_CATEGORIES.filter(c => INTERNATIONAL_CATEGORY_IDS.has(c.id));
    if (jerseyFilter === 'club') return JERSEY_CATEGORIES.filter(c => !INTERNATIONAL_CATEGORY_IDS.has(c.id));
    return JERSEY_CATEGORIES;
  }, [jerseyFilter]);

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setSubscribed(true);
    setEmail('');
  };

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative flex items-center overflow-hidden bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6">
              Wear The <br />
              <span className="text-brand-gray-dark">Game</span>
            </h1>
            <p className="text-lg text-brand-gray-dark mb-10 max-w-md mx-auto leading-relaxed">
              Premium football jerseys from every club and country. 600+ kits, delivered worldwide.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <GlowButton onClick={() => onNavigate('jerseys')}>Shop Jerseys</GlowButton>
              <GlowButton variant="outline" onClick={() => onNavigate('club-jerseys')}>Shop by Club</GlowButton>
              <GlowButton variant="outline" onClick={() => onNavigate('country-jerseys')}>Shop by Country</GlowButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Urgency Banner */}
      <section className="bg-brand-black text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">🔥 Flash Sale — Limited Time Only</span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/70">Free Shipping on All Orders</span>
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/90">Mystery Discount — Up to 10% Off</span>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl mb-4">Featured Jerseys</h2>
              <p className="text-brand-gray-dark">Our most sought-after kits.</p>
            </div>
            <button
              onClick={() => onNavigate('jerseys')}
              className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:gap-4 transition-all group shrink-0"
            >
              View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Horizontal scroll row */}
        <div className="flex gap-6 overflow-x-auto px-6 md:px-12 pb-4 scrollbar-hide snap-x snap-mandatory">
          {FEATURED_PRODUCT_IDS.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean).map((product) => (
            <div key={product.id} className="snap-start shrink-0 w-[280px] sm:w-[320px]">
              <ProductCard
                product={product}
                onClick={onProductClick}
              />
            </div>
          ))}
        </div>
      </section>


      {/* Special Jerseys Section */}
      <section className="py-12 bg-brand-gray-light/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold mb-3 text-brand-gray-dark">Exclusive Editions</p>
              <h2 className="text-3xl">Special Jerseys</h2>
            </div>
            <button
              onClick={() => onNavigate('special-jerseys')}
              className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:gap-4 transition-all group shrink-0"
            >
              View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto px-6 md:px-12 pb-4 scrollbar-hide snap-x snap-mandatory">
          {SPECIAL_PRODUCTS.map((product) => (
            <div key={product.id} className="snap-start shrink-0 w-[260px] sm:w-[300px]">
              <ProductCard product={product} onClick={onProductClick} />
            </div>
          ))}
          <div className="snap-start shrink-0 w-[200px] flex items-center justify-center">
            <button onClick={() => onNavigate('special-jerseys')} className="flex flex-col items-center gap-3 group">
              <div className="w-16 h-16 rounded-full border-2 border-brand-black flex items-center justify-center group-hover:bg-brand-black transition-colors">
                <ArrowRight size={20} className="group-hover:text-white transition-colors" />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-center">View All<br />Specials</span>
            </button>
          </div>
        </div>
      </section>

      {/* World Cup 2026 Section */}
      <section className="py-12 bg-brand-gray-light/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold mb-3 text-brand-gray-dark">FIFA World Cup</p>
              <h2 className="text-3xl">2026 World Cup Kits</h2>
            </div>
            <button
              onClick={() => onNavigate('world-cup-2026')}
              className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:gap-4 transition-all group shrink-0"
            >
              View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto px-6 md:px-12 pb-4 scrollbar-hide snap-x snap-mandatory">
          {WC_2026_PRODUCTS.map((product) => (
            <div key={product.id} className="snap-start shrink-0 w-[260px] sm:w-[300px]">
              <ProductCard product={product} onClick={onProductClick} />
            </div>
          ))}
          <div className="snap-start shrink-0 w-[200px] flex items-center justify-center">
            <button
              onClick={() => onNavigate('world-cup-2026')}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-16 h-16 rounded-full border-2 border-brand-black flex items-center justify-center group-hover:bg-brand-black transition-colors">
                <ArrowRight size={20} className="group-hover:text-white transition-colors" />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-center">View All<br />Kits</span>
            </button>
          </div>
        </div>
      </section>

      {/* Retro Jerseys Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold mb-3 text-brand-gray-dark">Classic Kits</p>
              <h2 className="text-3xl">Retro Jerseys</h2>
            </div>
            <button
              onClick={() => onNavigate('retro-jerseys')}
              className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:gap-4 transition-all group shrink-0"
            >
              View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto px-6 md:px-12 pb-4 scrollbar-hide snap-x snap-mandatory">
          {PRODUCTS.filter(p => p.name.toLowerCase().includes('retro') && p.category.startsWith('jersey-')).map((product) => (
            <div key={product.id} className="snap-start shrink-0 w-[260px] sm:w-[300px]">
              <ProductCard product={product} onClick={onProductClick} />
            </div>
          ))}
          <div className="snap-start shrink-0 w-[200px] flex items-center justify-center">
            <button onClick={() => onNavigate('retro-jerseys')} className="flex flex-col items-center gap-3 group">
              <div className="w-16 h-16 rounded-full border-2 border-brand-black flex items-center justify-center group-hover:bg-brand-black transition-colors">
                <ArrowRight size={20} className="group-hover:text-white transition-colors" />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-center">View All<br />Retro</span>
            </button>
          </div>
        </div>
      </section>

      {/* Brand Section */}
      <section className="py-16 bg-white border-y border-brand-gray-light">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold mb-8 text-brand-gray-dark">Our Philosophy</p>
            <h2 className="text-4xl md:text-5xl mb-10 leading-tight">Simplicity is the <br /> Ultimate Sophistication</h2>
            <p className="text-lg text-brand-gray-dark leading-relaxed">
              Virenza is a dedicated football jersey store. Every club. Every country. Every era. Premium quality kits, delivered to your door.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl mb-8 text-center">What They Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {REVIEWS.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 bg-brand-gray-light/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl mb-4">Stay Updated</h2>
          <p className="text-brand-gray-dark mb-10">Get updates on new releases and restocks.</p>
          {subscribed ? (
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">Thanks for subscribing!</p>
          ) : (
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-6 py-4 bg-white border border-brand-gray-light rounded-md focus:outline-none focus:border-brand-black transition-colors"
              />
              <GlowButton type="submit">Subscribe</GlowButton>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
