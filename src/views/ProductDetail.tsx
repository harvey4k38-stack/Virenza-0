import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import GlowButton from '../components/GlowButton';
import Modal from '../components/Modal';
import SizingGuideContent from '../components/SizingGuideContent';
import { ChevronLeft, ChevronRight, ShieldCheck, Truck, RefreshCw, Star, Check, Ruler } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { JERSEY_REVIEWS, REVIEWS } from '../constants';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export default function ProductDetail({ product, onBack }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedThickness, setSelectedThickness] = useState(product.thickness[0]);
  const [selectedLength, setSelectedLength] = useState(product.lengths[0]);
  const [selectedVariant, setSelectedVariant] = useState(product.nameVariants?.[0]?.label ?? null);
  const [customName, setCustomName] = useState('');
  const [customNumber, setCustomNumber] = useState<number | ''>(1);
  const isJersey = product.category.startsWith('jersey-');
  const [isAdded, setIsAdded] = useState(false);
  const [isSizingModalOpen, setIsSizingModalOpen] = useState(false);
  const { addToCart } = useCart();

  const compareAtPrice = Math.ceil(product.price * 1.2) - 0.01;

  const KIDS_SIZES = ['Kids S', 'Kids M', 'Kids L'];
  const isKidsSize = KIDS_SIZES.includes(selectedLength);
  const displayPrice = isKidsSize ? product.price * 0.85 : product.price;

  const adultSizes = product.lengths.filter(l => !KIDS_SIZES.includes(l));
  const kidsSizes = product.lengths.filter(l => KIDS_SIZES.includes(l));

  const handleAddToCart = () => {
    const productToAdd = isKidsSize ? { ...product, price: parseFloat((product.price * 0.85).toFixed(2)) } : product;
    addToCart(productToAdd, selectedThickness, selectedLength);
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
              <span className="text-xs text-brand-gray-dark ml-1 underline decoration-brand-gray-light underline-offset-4 cursor-pointer hover:text-brand-black transition-colors">
                {product.reviewCount} Reviews
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gray-dark mb-4">
              {product.category}
            </p>
            <h1 className="text-4xl md:text-5xl mb-4">{product.name}</h1>
            {isKidsSize ? (
              <div className="flex items-baseline gap-3 flex-wrap">
                <p className="text-2xl font-bold text-brand-black">£{displayPrice.toFixed(2)}</p>
                <p className="text-base line-through text-brand-gray-dark/50">£{product.price.toFixed(2)}</p>
                <span className="text-[9px] uppercase tracking-widest font-bold text-emerald-600 border border-emerald-400 px-2 py-0.5">15% Off</span>
              </div>
            ) : (
              <div className="flex items-baseline gap-3">
                <p className="text-2xl font-bold text-brand-black">£{product.price.toFixed(2)}</p>
                <p className="text-base line-through text-brand-gray-dark/50">£{compareAtPrice.toFixed(2)}</p>
                <span className="text-[9px] uppercase tracking-widest font-bold text-red-600 border border-red-300 px-2 py-0.5">Sale</span>
              </div>
            )}
          </div>

          <div className="mb-10">
            <p className="text-brand-gray-dark leading-relaxed mb-8">
              {product.description}
            </p>
            
            <div className="space-y-8">
              {/* Name Variants (jerseys only) */}
              {product.nameVariants && product.nameVariants.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold mb-4">Player Name</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                    {product.nameVariants.map((v) => (
                      <button
                        key={v.label}
                        onClick={() => setSelectedVariant(v.label)}
                        className={`px-3 py-2 border-2 transition-all text-left ${
                          selectedVariant === v.label
                            ? 'border-brand-black bg-brand-black text-white'
                            : 'border-brand-gray-light hover:border-brand-black'
                        }`}
                      >
                        <span className="text-[9px] uppercase tracking-wider font-bold leading-tight">{v.label}</span>
                      </button>
                    ))}
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
                  {!isJersey && (
                    <button
                      onClick={() => setIsSizingModalOpen(true)}
                      className="text-[10px] uppercase tracking-widest font-bold text-brand-gray-dark hover:text-brand-black transition-colors flex items-center gap-2"
                    >
                      <Ruler size={12} /> Sizing Guide
                    </button>
                  )}
                </div>
                {adultSizes.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-4">
                    {adultSizes.map((l) => (
                      <button
                        key={l}
                        onClick={() => setSelectedLength(l)}
                        className={`px-6 py-2 text-xs uppercase tracking-widest font-bold border transition-all ${
                          selectedLength === l
                            ? 'bg-brand-black text-white border-brand-black'
                            : 'bg-white text-brand-black border-brand-gray-light hover:border-brand-black'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                )}
                {kidsSizes.length > 0 && (
                  <div>
                    <p className="text-[9px] uppercase tracking-widest font-bold text-brand-gray-dark mb-2">
                      Kids Sizes <span className="text-emerald-600 font-bold">— 15% Off</span>
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {kidsSizes.map((l) => (
                        <button
                          key={l}
                          onClick={() => setSelectedLength(l)}
                          className={`px-6 py-2 text-xs uppercase tracking-widest font-bold border transition-all ${
                            selectedLength === l
                              ? 'bg-brand-black text-white border-brand-black'
                              : 'bg-white text-brand-black border-emerald-400 hover:border-brand-black'
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

          <GlowButton 
            onClick={handleAddToCart}
            className={`w-full py-5 text-sm uppercase tracking-[0.2em] mb-12 flex items-center justify-center gap-2 transition-all ${
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
            <div className="flex flex-col items-center text-center gap-3">
              <RefreshCw size={20} className="text-brand-gray-dark" />
              <p className="text-[10px] uppercase tracking-widest font-bold">Easy Returns</p>
            </div>
          </div>
        </div>
      </div>

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
        <SizingGuideContent />
      </Modal>
    </main>
  );
}
