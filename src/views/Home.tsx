import { useState, useMemo, type FormEvent } from 'react';
import { PRODUCTS, CATEGORIES, JERSEY_CATEGORIES, REVIEWS, INTERNATIONAL_CATEGORY_IDS, FEATURED_PRODUCT_IDS } from '../constants';
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
      <section className="relative flex items-center overflow-hidden bg-white py-24">
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
              <GlowButton variant="outline" onClick={() => onNavigate('best-sellers')}>Best Sellers</GlowButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-3xl mb-4">Featured Jerseys</h2>
            <p className="text-brand-gray-dark">Our most sought-after kits.</p>
          </div>
          <button
            onClick={() => onNavigate('jerseys')}
            className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:gap-4 transition-all group"
          >
            View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_PRODUCT_IDS.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={onProductClick}
            />
          ))}
        </div>
      </section>

      {/* Jersey Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-12">
            <div>
              <h2 className="text-3xl mb-4">Shop by Club & Country</h2>
              <div className="flex gap-1 bg-brand-gray-light/30 rounded-sm p-1 w-fit">
                {(['all', 'international', 'club'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setJerseyFilter(f)}
                    className={`px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-bold rounded-sm transition-all ${
                      jerseyFilter === f
                        ? 'bg-brand-black text-white'
                        : 'text-brand-gray-dark hover:text-brand-black'
                    }`}
                  >
                    {f === 'all' ? 'All' : f === 'international' ? 'International' : 'Club'}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => onNavigate('jerseys')}
              className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:gap-4 transition-all group self-start sm:self-auto"
            >
              View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {filteredCategories.map((cat) => (
              <motion.div
                key={cat.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                onClick={() => onNavigate(cat.id)}
                className="flex flex-col items-center gap-2 cursor-pointer group"
              >
                <div className="w-full aspect-square rounded-xl bg-[#f0f0f0] flex items-center justify-center overflow-hidden p-3 group-hover:shadow-md transition-shadow duration-200">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight group-hover:text-brand-gray-dark transition-colors">{cat.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Accessories — subtle subcategory strip */}
      <section className="py-8 border-t border-brand-gray-light">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gray-dark">Accessories</p>
          <div className="flex gap-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onNavigate(cat.id)}
                className="text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-2 hover:gap-4 transition-all group"
              >
                {cat.name} <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Section */}
      <section className="py-32 bg-white border-y border-brand-gray-light">
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

      {/* Best Sellers Slider (Static Grid for now) */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl mb-16 text-center">Best Sellers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.filter(p => p.isBestSeller && p.category.startsWith('jersey-')).map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={onProductClick} 
            />
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-brand-gray-light/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl mb-16 text-center">What They Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {REVIEWS.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-brand-gray-light/30">
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
