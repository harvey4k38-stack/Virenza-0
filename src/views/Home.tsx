import { PRODUCTS, CATEGORIES, REVIEWS } from '../constants';
import ProductCard from '../components/ProductCard';
import GlowButton from '../components/GlowButton';
import ReviewCard from '../components/ReviewCard';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface HomeProps {
  onProductClick: (product: Product) => void;
  onNavigate: (cat: 'chains' | 'bracelets' | 'best-sellers') => void;
}

export default function Home({ onProductClick, onNavigate }: HomeProps) {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 items-center gap-12 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10"
          >
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6">
              Jewelry That <br />
              <span className="text-brand-gray-dark">Speaks Quietly</span>
            </h1>
            <p className="text-lg text-brand-gray-dark mb-10 max-w-md leading-relaxed">
              Minimal chains and bracelets designed for everyday wear. Refined aesthetics for the modern man.
            </p>
            <div className="flex flex-wrap gap-4">
              <GlowButton onClick={() => onNavigate('chains')}>Shop Chains</GlowButton>
              <GlowButton variant="outline" onClick={() => onNavigate('bracelets')}>Shop Bracelets</GlowButton>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative h-[60vh] md:h-[80vh]"
          >
            <img
              src="/asset-8.png"
              alt="Model wearing premium chain"
              className="w-full h-full object-cover rounded-sm shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-3xl mb-4">Featured Collection</h2>
            <p className="text-brand-gray-dark">Our most sought-after essentials.</p>
          </div>
          <button 
            onClick={() => onNavigate('best-sellers')}
            className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:gap-4 transition-all group"
          >
            View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.slice(0, 6).map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={onProductClick} 
            />
          ))}
        </div>
      </section>

      {/* Category Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-8">
          {CATEGORIES.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover="hover"
              onClick={() => onNavigate(cat.id as 'chains' | 'bracelets')}
              className="relative h-[500px] overflow-hidden group cursor-pointer"
            >
              <motion.img
                variants={{ hover: { scale: 1.05 } }}
                transition={{ duration: 0.8 }}
                src={cat.image}
                alt={cat.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h3 className="text-4xl mb-6 tracking-[0.3em]">{cat.name}</h3>
                <GlowButton variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white hover:text-black">
                  Shop {cat.name}
                </GlowButton>
              </div>
            </motion.div>
          ))}
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
              Virenza was created for men who prefer simplicity. No loud designs, no unnecessary details — just well-made chains and bracelets that work with anything you wear.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Best Sellers Slider (Static Grid for now) */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl mb-16 text-center">Best Sellers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.filter(p => p.isBestSeller).map((product) => (
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
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-6 py-4 bg-white border border-brand-gray-light rounded-md focus:outline-none focus:border-brand-black transition-colors"
            />
            <GlowButton type="submit">Subscribe</GlowButton>
          </form>
        </div>
      </section>
    </main>
  );
}
