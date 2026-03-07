import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import GlowButton from '../components/GlowButton';
import Modal from '../components/Modal';
import SizingGuideContent from '../components/SizingGuideContent';
import { ChevronLeft, ChevronRight, ShieldCheck, Truck, RefreshCw, Star, Check, Ruler } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export default function ProductDetail({ product, onBack }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedThickness, setSelectedThickness] = useState(product.thickness[0]);
  const [selectedLength, setSelectedLength] = useState(product.lengths[0]);
  const [isAdded, setIsAdded] = useState(false);
  const [isSizingModalOpen, setIsSizingModalOpen] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, selectedThickness, selectedLength);
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
            <p className="text-2xl font-medium text-brand-gray-dark">£{product.price.toFixed(2)}</p>
          </div>

          <div className="mb-10">
            <p className="text-brand-gray-dark leading-relaxed mb-8">
              {product.description}
            </p>
            
            <div className="space-y-8">
              {/* Thickness Selector */}
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

              {/* Length Selector */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[10px] uppercase tracking-widest font-bold">Length</p>
                  <button 
                    onClick={() => setIsSizingModalOpen(true)}
                    className="text-[10px] uppercase tracking-widest font-bold text-brand-gray-dark hover:text-brand-black transition-colors flex items-center gap-2"
                  >
                    <Ruler size={12} /> Sizing Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.lengths.map((l) => (
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
