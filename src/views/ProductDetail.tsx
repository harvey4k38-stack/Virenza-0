import { useState, useEffect, useRef, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import GlowButton from '../components/GlowButton';
import Modal from '../components/Modal';
import { ChevronLeft, ChevronRight, ShieldCheck, Truck, RefreshCw, Star, Check, Ruler, Lock, Users, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { usePostHog } from 'posthog-js/react';
import { JERSEY_REVIEWS, REVIEWS, PRODUCTS } from '../constants';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onNavigate?: (view: string) => void;
  onBuyNow?: (clientSecret: string, cartItems?: any[], total?: number) => void;
  onProductClick?: (product: Product) => void;
}

export default function ProductDetail({ product, onBack, onNavigate, onBuyNow, onProductClick }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedThickness, setSelectedThickness] = useState(product.thickness[0]);
  const [selectedLength, setSelectedLength] = useState(product.lengths[0]);
  const [selectedVariant, setSelectedVariant] = useState(product.nameVariants?.[0]?.label ?? null);
  const [customName, setCustomName] = useState('');
  const [customNumber, setCustomNumber] = useState<number | ''>(1);
  const isJersey = product.category.startsWith('jersey-');
  const isPalaceJersey = product.id === 'j-palace-wc';
  const reviewViewMap: Record<string, string> = {
    'j-palace-wc': 'palace-reviews',
    'j-nike-away-2026': 'jersey-reviews-nike-away',
    'j-retro-saka': 'jersey-reviews-retro-saka',
    'j-retro-gazza': 'jersey-reviews-retro-gazza',
    'jg-england-2026-world-cup-home-shirt': 'jersey-reviews-england-home-2026',
  };
  const reviewView = reviewViewMap[product.id];
  const [isAdded, setIsAdded] = useState(false);
  const [isSizingModalOpen, setIsSizingModalOpen] = useState(false);
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const compareAtPrice = product.compareAtPrice ?? (Math.ceil(product.price * 1.2) - 0.01);

  const [soldCount, setSoldCount] = useState(() => Math.floor(Math.random() * 9) + 9);

  useEffect(() => {
    if (!isPalaceJersey) return;
    const interval = setInterval(() => {
      setSoldCount(Math.floor(Math.random() * 15) + 8);
    }, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isPalaceJersey]);

  const [stock, setStock] = useState<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    ['S','M','L','XL','XXL'].forEach(s => { counts[s] = Math.floor(Math.random() * 4) + 4; });
    return counts;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStock(prev => {
        const sizes = Object.keys(prev).filter(s => prev[s] > 1);
        if (sizes.length === 0) return prev;
        const pick = sizes[Math.floor(Math.random() * sizes.length)];
        return { ...prev, [pick]: Math.max(1, prev[pick] - 1) };
      });
    }, Math.random() * 30000 + 30000);
    return () => clearInterval(interval);
  }, []);

  const KIDS_SIZES = ['Kids S', 'Kids M', 'Kids L'];
  const isKidsSize = KIDS_SIZES.includes(selectedLength);
  const PALACE_FREE_VARIANTS = ['No Name / Number', 'PALACE 7'];
  const personalisationSurcharge = isPalaceJersey && selectedVariant && !PALACE_FREE_VARIANTS.includes(selectedVariant) ? 7.99 : 0;
  const displayPrice = product.price + personalisationSurcharge;

  const adultSizes = product.lengths.filter(l => !KIDS_SIZES.includes(l));
  const kidsSizes = product.lengths.filter(l => KIDS_SIZES.includes(l));

  const buildNameLabel = () => {
    if (selectedVariant === 'Customize Name') {
      const n = customName.trim();
      const num = customNumber !== '' ? customNumber : '';
      return [n, num].filter(Boolean).join(' ') || undefined;
    }
    if (selectedVariant && selectedVariant !== 'No Name / Number') return selectedVariant;
    return undefined;
  };

  const isEnglandJersey = product.category === 'jersey-england';
  const [showMysteryPopup, setShowMysteryPopup] = useState(false);
  const [mysteryEmail, setMysteryEmail] = useState('');
  const [mysteryStatus, setMysteryStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [mysteryEmailError, setMysteryEmailError] = useState('');
  const MYSTERY_CODE = 'VIRENZA10';
  const USED_EMAILS_KEY = 'virenza_discount_emails';

  const handleMysterySubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMysteryEmailError('');
    const usedEmails: string[] = JSON.parse(localStorage.getItem(USED_EMAILS_KEY) ?? '[]');
    if (usedEmails.includes(mysteryEmail.trim().toLowerCase())) {
      setMysteryEmailError('This email has already claimed a discount.');
      return;
    }
    setMysteryStatus('loading');
    fetch('/api/discount-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: mysteryEmail, code: MYSTERY_CODE }),
    }).catch(() => {});
    usedEmails.push(mysteryEmail.trim().toLowerCase());
    localStorage.setItem(USED_EMAILS_KEY, JSON.stringify(usedEmails));
    sessionStorage.setItem('virenza_discount_captured', '1');
    setMysteryStatus('success');
  };

  const posthog = usePostHog();
  const ctaRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // TikTok ViewContent
  useEffect(() => {
    (window as any).ttq?.track('ViewContent', {
      content_id: product.id,
      content_name: product.name,
      content_type: 'product',
      currency: 'GBP',
      value: product.price,
    });
  }, [product.id]);

  const [viewerCount] = useState(() => Math.floor(Math.random() * 12) + 12);

  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const [buyNowError, setBuyNowError] = useState('');

  const handleBuyNow = async () => {
    if (!onBuyNow) return;
    setBuyNowLoading(true);
    setBuyNowError('');
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: displayPrice }),
      });
      const data = await res.json();
      if (!data.clientSecret) throw new Error('No client secret');
      addToCart(product, selectedThickness, selectedLength, buildNameLabel(), displayPrice);
      onBuyNow(data.clientSecret, [{ id: product.id, name: product.name, quantity: 1, price: displayPrice }], displayPrice);
    } catch {
      setBuyNowError('Please add to cart and checkout.');
    }
    setBuyNowLoading(false);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedThickness, selectedLength, buildNameLabel(), displayPrice);
    posthog?.capture('add_to_cart', { product_id: product.id, product_name: product.name, price: displayPrice, size: selectedLength });
    (window as any).ttq?.track('AddToCart', {
      content_id: product.id,
      content_name: product.name,
      content_type: 'product',
      currency: 'GBP',
      value: displayPrice,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold mb-12 hover:opacity-60 transition-opacity"
      >
        <ChevronLeft size={14} /> Back to Collection
      </button>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Left: Images */}
        <div className="space-y-6">
          <div className="aspect-[4/5] bg-brand-gray-light/20 overflow-hidden relative group">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            
            {product.images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setSelectedImage(prev => (prev === 0 ? product.images.length - 1 : prev - 1))}
                  className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setSelectedImage(prev => (prev === product.images.length - 1 ? 0 : prev + 1))}
                  className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`aspect-square border-2 transition-all ${
                  selectedImage === idx ? 'border-brand-black' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={12} 
                    className={i < Math.floor(product.rating) ? "fill-brand-black text-brand-black" : "text-brand-gray-light"} 
                  />
                ))}
              </div>
              <span className="text-xs font-bold">{product.rating}</span>
              <span
                onClick={() => reviewView && onNavigate?.(reviewView)}
                className={`text-xs text-brand-gray-dark ml-1 underline decoration-brand-gray-light underline-offset-4 transition-colors ${reviewView ? 'cursor-pointer hover:text-brand-black' : ''}`}
              >
                {product.reviewCount} Reviews
              </span>
            </div>
            {reviewView && (
              <button
                onClick={() => onNavigate?.(reviewView)}
                className="flex items-center gap-3 w-full border border-brand-gray-light px-4 py-3 mb-4 hover:border-brand-black transition-colors group"
              >
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-brand-black"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest">Read all {product.reviewCount} customer reviews</span>
                <svg className="ml-auto w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            )}
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gray-dark mb-4">
              {product.category}
            </p>
            <h1 className="text-4xl md:text-5xl mb-4">{product.name}</h1>
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-3">
                <p className="text-2xl font-bold text-brand-black">{formatPrice(displayPrice)}</p>
                <p className="text-base line-through text-brand-gray-dark/50">{formatPrice(compareAtPrice)}</p>
                <span className="text-[9px] uppercase tracking-widest font-bold text-red-600 border border-red-300 px-2 py-0.5">Sale</span>
              </div>
              {personalisationSurcharge > 0 && (
                <p className="text-[10px] text-brand-gray-dark uppercase tracking-widest">Includes £7.99 personalisation</p>
              )}
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">You save {formatPrice(compareAtPrice - product.price)}</p>
            </div>
          </div>

          <div className="mb-10">
            <p className="text-brand-gray-dark leading-relaxed mb-8 whitespace-pre-line">
              {product.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Users size={12} className="text-emerald-500" />
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-gray-dark">
                  <span className="text-emerald-600">{viewerCount} people</span> viewing this now
                </p>
              </div>
              {isPalaceJersey && (
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-brand-gray-dark">
                    <span className="text-brand-black">{soldCount} sold</span> in the last hour
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-8">
              {/* Name Variants (jerseys only) */}
              {product.nameVariants && product.nameVariants.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold mb-4">Player Name</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                    {product.nameVariants.map((v) => {
                      const isFree = !isPalaceJersey || PALACE_FREE_VARIANTS.includes(v.label);
                      return (
                        <button
                          key={v.label}
                          onClick={() => setSelectedVariant(v.label)}
                          className={`px-3 py-2 border-2 transition-all text-left ${
                            selectedVariant === v.label
                              ? 'border-brand-black bg-brand-black text-white'
                              : 'border-brand-gray-light hover:border-brand-black'
                          }`}
                        >
                          <span className="text-[9px] uppercase tracking-wider font-bold leading-tight block">{v.label}</span>
                          {isPalaceJersey && (
                            <span className={`text-[8px] font-bold ${selectedVariant === v.label ? 'text-white/70' : 'text-brand-gray-dark'}`}>
                              {isFree ? 'Free' : '+£7.99'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {selectedVariant === 'Customize Name' && (
                    <div className="space-y-4 mt-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold mb-2">
                          Custom Name <span className="text-brand-gray-dark font-normal normal-case tracking-normal">({customName.length}/12)</span>
                        </p>
                        <input
                          type="text"
                          maxLength={12}
                          value={customName}
                          onChange={e => setCustomName(e.target.value.toUpperCase())}
                          placeholder="E.G. SMITH"
                          className="w-full border border-brand-gray-light px-4 py-3 text-sm uppercase tracking-widest focus:outline-none focus:border-brand-black"
                        />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold mb-2">Number (1–99)</p>
                        <input
                          type="number"
                          min={1}
                          max={99}
                          value={customNumber}
                          onChange={e => setCustomNumber(e.target.value === '' ? '' : Math.min(99, Math.max(1, Number(e.target.value))))}
                          className="w-24 border border-brand-gray-light px-4 py-3 text-sm text-center focus:outline-none focus:border-brand-black"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Thickness Selector (chains/bracelets only) */}
              {!isJersey && product.thickness.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold mb-4">Thickness</p>
                  <div className="flex flex-wrap gap-3">
                    {product.thickness.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedThickness(t)}
                        className={`px-6 py-2 text-xs uppercase tracking-widest font-bold border transition-all ${
                          selectedThickness === t
                            ? 'bg-brand-black text-white border-brand-black'
                            : 'bg-white text-brand-black border-brand-gray-light hover:border-brand-black'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[10px] uppercase tracking-widest font-bold">
                    {isJersey ? 'Size' : 'Length'}
                  </p>
                  <div className="flex items-center gap-3">
                    {isJersey && (
                      <span className="text-[10px] uppercase tracking-widest font-bold text-brand-gray-dark">
                        Fits True to Size
                      </span>
                    )}
                    <button
                      onClick={() => setIsSizingModalOpen(true)}
                      className="text-[10px] uppercase tracking-widest font-bold text-brand-gray-dark hover:text-brand-black transition-colors flex items-center gap-2"
                    >
                      <Ruler size={12} /> Sizing Guide
                    </button>
                  </div>
                </div>
                {adultSizes.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-3">
                    {adultSizes.map((l) => (
                      <div key={l} className="flex flex-col items-center gap-1">
                        <button
                          onClick={() => setSelectedLength(l)}
                          className={`px-6 py-2 text-xs uppercase tracking-widest font-bold border transition-all ${
                            selectedLength === l
                              ? 'bg-brand-black text-white border-brand-black'
                              : 'bg-white text-brand-black border-brand-gray-light hover:border-brand-black'
                          }`}
                        >
                          {l}
                        </button>
                        {stock[l] !== undefined && l !== 'XXXL' && l !== 'XXXXL' && (
                          <span className="text-[9px] font-bold uppercase tracking-wide text-red-500">
                            Only {stock[l]} left
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {kidsSizes.length > 0 && (
                  <div>
                    <p className="text-[9px] uppercase tracking-widest font-bold text-brand-gray-dark mb-2">
                      Kids Sizes
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {kidsSizes.map((l) => (
                        <button
                          key={l}
                          onClick={() => setSelectedLength(l)}
                          className={`px-6 py-2 text-xs uppercase tracking-widest font-bold border transition-all ${
                            selectedLength === l
                              ? 'bg-brand-black text-white border-brand-black'
                              : 'bg-white text-brand-black border-brand-gray-light hover:border-brand-black'
                          }`}
                        >
                          {l.replace('Kids ', '')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isJersey && (
            <div className="flex items-start gap-3 mb-6 p-4 border border-brand-gray-light bg-brand-gray-light/10">
              <Truck size={14} className="text-brand-gray-dark mt-0.5 flex-shrink-0" />
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-gray-dark leading-relaxed">
                Estimated delivery: 10-15 working days
              </p>
            </div>
          )}

          {/* Mystery discount nudge — England jerseys only */}
          {isEnglandJersey && (
            <button
              type="button"
              onClick={() => setShowMysteryPopup(true)}
              className="w-full flex items-center justify-between px-4 py-3 mb-4 border border-dashed border-brand-gray-light hover:border-brand-black transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">🎁</span>
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-widest font-bold">Unlock a mystery discount</p>
                  <p className="text-[9px] text-brand-gray-dark uppercase tracking-widest">Up to 10% off — enter your email</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-brand-gray-dark group-hover:text-brand-black transition-colors" />
            </button>
          )}

          <div ref={ctaRef} className="flex flex-col gap-3 mb-6">
            <GlowButton
              onClick={handleAddToCart}
              className={`w-full py-5 text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${
                isAdded ? 'bg-emerald-600 border-emerald-600' : ''
              }`}
            >
              {isAdded ? (
                <>
                  <Check size={18} /> Added to Cart
                </>
              ) : (
                'Add to Cart'
              )}
            </GlowButton>
            {onBuyNow && (
              <div>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={buyNowLoading}
                  className="w-full py-5 text-sm uppercase tracking-[0.2em] border-2 border-brand-black bg-white text-brand-black font-bold hover:bg-brand-black hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {buyNowLoading ? 'Please wait...' : 'Checkout Now'}
                </button>
                {buyNowError && <p className="text-red-500 text-xs mt-2 text-center">{buyNowError}</p>}
              </div>
            )}
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-3 border-t border-b border-brand-gray-light mb-12">
            <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold text-brand-gray-dark">
              <Lock size={10} /> 256-Bit SSL Secured
            </span>
            <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold text-brand-gray-dark">
              <ShieldCheck size={10} /> 4,000+ Orders Shipped
            </span>
          </div>

          {/* Buy now pay later */}
          <div className="flex items-center gap-3 p-3 border border-brand-gray-light mb-6 bg-brand-gray-light/5">
            <div className="text-[10px] uppercase tracking-widest font-bold text-brand-gray-dark">Buy now, pay later with</div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold tracking-wide bg-[#00D64F] text-white px-2 py-0.5 rounded-sm">Clearpay</span>
              <span className="text-xs font-bold tracking-wide text-[#FFB3C7]" style={{fontStyle:'italic'}}>Klarna</span>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-brand-gray-light">
            <div className="flex flex-col items-center text-center gap-3">
              <Truck size={20} className="text-brand-gray-dark" />
              <p className="text-[10px] uppercase tracking-widest font-bold">Free Shipping</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <ShieldCheck size={20} className="text-brand-gray-dark" />
              <p className="text-[10px] uppercase tracking-widest font-bold">Lifetime Warranty</p>
            </div>
            <button
              onClick={() => onNavigate?.('returns-policy')}
              className="flex flex-col items-center text-center gap-3 hover:opacity-70 transition-opacity"
            >
              <RefreshCw size={20} className="text-brand-gray-dark" />
              <p className="text-[10px] uppercase tracking-widest font-bold">30-Day Returns</p>
            </button>
          </div>

          {/* Giveaway banner */}
          {isJersey && (
            <button
              onClick={() => onNavigate?.('giveaway')}
              className="w-full mt-8 border border-dashed border-brand-gray-light py-4 px-6 flex items-center justify-between hover:border-black transition-colors"
            >
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-brand-gray-dark mb-0.5">Out of your price range?</p>
                <p className="text-xs font-bold uppercase tracking-widest">Enter the weekly giveaway — tickets from £1.99 →</p>
              </div>
              <span className="text-xl">🏆</span>
            </button>
          )}
        </div>
      </div>

      {/* Customers Also Bought */}
      {(() => {
        const ALSO_BOUGHT_IDS = ['j-mystery', 'j-nike-away-2026'];
        const others = PRODUCTS.filter(p => ALSO_BOUGHT_IDS.includes(p.id) && p.id !== product.id);
        if (others.length === 0) return null;
        return (
          <div className="mt-24 pt-16 border-t border-brand-gray-light">
            <h2 className="text-2xl md:text-3xl mb-10">Customers Also Bought</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {others.map(p => (
                <button
                  key={p.id}
                  onClick={() => onProductClick?.(p)}
                  className="text-left group"
                >
                  <div className="aspect-square bg-brand-gray-light/10 overflow-hidden mb-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-[11px] uppercase tracking-widest font-bold leading-tight mb-1">{p.name}</p>
                  <p className="text-sm font-bold">{formatPrice(p.price)}</p>
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Reviews Section — accessories only */}
      {!isJersey && (
        <div className="mt-24 pt-16 border-t border-brand-gray-light">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="text-2xl md:text-3xl">Customer Reviews</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(product.rating) ? 'fill-brand-black text-brand-black' : 'text-brand-gray-light'} />
                ))}
              </div>
              <span className="text-sm font-bold">{product.rating} out of 5</span>
              <span className="text-sm text-brand-gray-dark">({product.reviewCount} reviews)</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {REVIEWS.map((review) => (
              <div key={review.id} className="border border-brand-gray-light p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} className={i < review.rating ? 'fill-brand-black text-brand-black' : 'text-brand-gray-light'} />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold">{review.author}</span>
                </div>
                <p className="text-sm text-brand-gray-dark leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        isOpen={isSizingModalOpen}
        onClose={() => setIsSizingModalOpen(false)}
        title="Sizing Guide"
      >
        <div className="flex flex-col gap-6">
          <img src="/size-guide-v7.png" alt="Jersey Size Guide" className="w-full rounded-xl" />
          <img src="/size-guide-v9.png" alt="Extended Sizes Guide" className="w-full rounded-xl" />
          <img src="/size-guide-v8.png" alt="Size & Delivery Info" className="w-full rounded-xl" />
        </div>
      </Modal>

      {/* Sticky mobile CTA */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-brand-gray-light p-3 flex gap-2"
          >
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 py-4 text-xs uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center gap-2 ${
                isAdded ? 'bg-emerald-600 text-white' : 'bg-brand-black text-white'
              }`}
            >
              {isAdded ? <><Check size={14} /> Added</> : 'Add to Cart'}
            </button>
            {onBuyNow && (
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={buyNowLoading}
                className="flex-1 py-4 text-xs uppercase tracking-[0.2em] font-bold border-2 border-brand-black bg-white text-brand-black hover:bg-brand-black hover:text-white transition-all disabled:opacity-50"
              >
                {buyNowLoading ? '...' : 'Buy Now'}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mystery discount popup — England jerseys */}
      <AnimatePresence>
        {showMysteryPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0"
            onClick={() => setShowMysteryPopup(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white w-full max-w-md relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-brand-black text-white px-8 py-5 text-center">
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold">Exclusive Offer</p>
                <p className="text-2xl font-bold mt-1 tracking-wide">Mystery Discount</p>
                <p className="text-xs mt-1 opacity-70">Up to 10% off — revealed instantly</p>
              </div>
              <button
                type="button"
                onClick={() => setShowMysteryPopup(false)}
                className="absolute top-4 right-4 text-white hover:opacity-70 transition-opacity"
              >
                <X size={18} />
              </button>
              <div className="px-8 py-8">
                {mysteryStatus === 'success' ? (
                  <div className="text-center py-4">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-brand-gray-dark mb-1">You unlocked</p>
                    <p className="text-4xl font-bold mb-3">10% Off</p>
                    <p className="text-[10px] uppercase tracking-widest text-brand-gray-dark mb-2">Your code</p>
                    <div className="border-2 border-dashed border-brand-gray-light py-4 px-6 mb-3">
                      <span className="text-2xl font-bold tracking-[0.3em] uppercase">{MYSTERY_CODE}</span>
                    </div>
                    <p className="text-xs text-brand-gray-dark mb-6">We've also sent it to your email. Enter it at checkout.</p>
                    <button
                      type="button"
                      onClick={() => setShowMysteryPopup(false)}
                      className="w-full py-4 bg-brand-black text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:opacity-80 transition-opacity"
                    >
                      Shop Now
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-brand-gray-dark text-center mb-6">
                      Enter your email to unlock a mystery discount of up to 10% off your order.
                    </p>
                    <form onSubmit={handleMysterySubmit} className="space-y-3">
                      <input
                        type="email"
                        required
                        value={mysteryEmail}
                        onChange={e => { setMysteryEmail(e.target.value); setMysteryEmailError(''); }}
                        placeholder="Your email address"
                        className="w-full border border-brand-gray-light px-4 py-3.5 text-sm focus:outline-none focus:border-brand-black transition-colors"
                      />
                      {mysteryEmailError && <p className="text-red-500 text-xs">{mysteryEmailError}</p>}
                      <button
                        type="submit"
                        disabled={mysteryStatus === 'loading'}
                        className="w-full py-4 bg-brand-black text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:opacity-80 transition-opacity disabled:opacity-50"
                      >
                        {mysteryStatus === 'loading' ? 'Revealing...' : 'Reveal My Discount'}
                      </button>
                    </form>
                    <button
                      type="button"
                      onClick={() => setShowMysteryPopup(false)}
                      className="w-full mt-3 text-[10px] uppercase tracking-widest text-brand-gray-dark hover:text-brand-black transition-colors"
                    >
                      No thanks
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
