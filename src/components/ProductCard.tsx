import { useState, type FormEvent, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { ShoppingBag, Star, X, Check } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  key?: string | number;
}

function getCategoryLabel(category: string) {
  if (category === 'chains') return 'Premium Silver Chain';
  if (category === 'bracelets') return 'Refined Wristwear';
  if (category.startsWith('jersey-')) return 'England Football Jersey';
  return '';
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const [showNotify, setShowNotify] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { formatPrice } = useCurrency();

  const handleNotifyClick = (e: MouseEvent) => {
    e.stopPropagation();
    setShowNotify(true);
    setEmail('');
    setStatus('idle');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus('loading');
    try {
      const res = await fetch('/api/notify-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, productName: product.name }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const handleModalClick = (e: MouseEvent) => e.stopPropagation();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -8 }}
        className="group relative bg-white border border-brand-gray-light rounded-sm overflow-hidden transition-all duration-500 hover:shadow-xl"
        onClick={() => !product.outOfStock && onClick(product)}
      >
        <div className="aspect-[4/5] overflow-hidden bg-brand-gray-light/20 relative">
          <motion.img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${product.outOfStock ? 'brightness-75' : ''}`}
          />
          {product.outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/85 text-white text-[9px] uppercase tracking-[0.25em] font-bold px-4 py-2 text-center w-full">
                Temporarily Out of Stock
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className={i < Math.floor(product.rating) ? "fill-brand-black text-brand-black" : "text-brand-gray-light"}
                />
              ))}
            </div>
            <span className="text-[10px] font-bold tracking-tighter">{product.rating}</span>
            <span className="text-[10px] text-brand-gray-dark ml-1">({product.reviewCount})</span>
          </div>

          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-bold tracking-widest uppercase text-brand-black">
              {product.name}
            </h3>
            <div className="text-right flex-shrink-0 ml-2">
              <span className="block text-sm font-bold text-brand-black">{formatPrice(product.price)}</span>
              <span className="block text-[10px] line-through text-brand-gray-dark/60">{formatPrice(product.compareAtPrice ?? (Math.ceil(product.price * 1.2) - 0.01))}</span>
            </div>
          </div>

          <p className="text-xs text-brand-gray-dark mb-4 line-clamp-1">
            {getCategoryLabel(product.category)}
          </p>

          <button
            onClick={product.outOfStock ? handleNotifyClick : undefined}
            className="w-full py-2 bg-brand-black text-white text-[10px] uppercase tracking-[0.2em] font-bold opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 flex items-center justify-center gap-2"
          >
            <ShoppingBag size={12} />
            {product.outOfStock ? 'Notify Me' : 'View Details'}
          </button>
        </div>

        {product.isBestSeller && !product.outOfStock && (
          <div className="absolute top-4 left-4 bg-brand-black text-white text-[10px] uppercase tracking-widest px-3 py-1 font-bold">
            Best Seller
          </div>
        )}
      </motion.div>

      {/* Notify Modal */}
      <AnimatePresence>
        {showNotify && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
            onClick={() => setShowNotify(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.25 }}
              className="bg-white w-full max-w-md p-8 relative"
              onClick={handleModalClick}
            >
              <button
                onClick={() => setShowNotify(false)}
                className="absolute top-4 right-4 hover:opacity-60 transition-opacity"
              >
                <X size={18} />
              </button>

              {status === 'success' ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={24} />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-2">You're on the list</h3>
                  <p className="text-sm text-brand-gray-dark">We'll email you as soon as <span className="font-bold">{product.name}</span> is back in stock.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-1">Notify Me</h3>
                  <p className="text-xs text-brand-gray-dark mb-6">
                    Enter your email and we'll let you know when <span className="font-bold text-brand-black">{product.name}</span> is back in stock.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="w-full border border-brand-gray-light px-4 py-3 text-sm focus:outline-none focus:border-brand-black"
                    />
                    {status === 'error' && (
                      <p className="text-red-500 text-xs">Something went wrong. Please try again.</p>
                    )}
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-3 bg-brand-black text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:opacity-80 transition-opacity disabled:opacity-50"
                    >
                      {status === 'loading' ? 'Sending...' : 'Notify Me When Back'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
