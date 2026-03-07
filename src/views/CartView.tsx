import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ChevronLeft } from 'lucide-react';
import GlowButton from '../components/GlowButton';
import { Product } from '../types';

interface CartViewProps {
  onCheckout: () => void;
  onBack: () => void;
  onProductClick: (product: Product) => void;
}

export default function CartView({ onCheckout, onBack, onProductClick }: CartViewProps) {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (cartCount === 0) {
    return (
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center min-h-[60vh]">
        <ShoppingBag size={64} className="text-brand-gray-light mb-6" />
        <h2 className="text-2xl font-bold uppercase tracking-widest mb-4">Your basket is empty</h2>
        <p className="text-brand-gray-dark mb-8">Looks like you haven't added anything to your collection yet.</p>
        <GlowButton onClick={onBack} className="px-12 py-4 text-xs uppercase tracking-widest">
          Start Shopping
        </GlowButton>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12">
      <div className="flex items-center justify-between mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold hover:opacity-60 transition-opacity"
        >
          <ChevronLeft size={14} /> Continue Shopping
        </button>
        <h1 className="text-2xl font-bold uppercase tracking-[0.2em]">Your Basket ({cartCount})</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          {cart.map((item) => (
            <motion.div 
              layout
              key={`${item.id}-${item.selectedThickness}-${item.selectedLength}`}
              className="flex gap-6 pb-8 border-b border-brand-gray-light"
            >
              <div 
                className="w-24 h-32 bg-brand-gray-light/20 overflow-hidden cursor-pointer"
                onClick={() => onProductClick(item)}
              >
                <img 
                  src={item.images[0]} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between mb-2">
                  <h3 
                    className="text-sm font-bold uppercase tracking-widest cursor-pointer hover:opacity-70"
                    onClick={() => onProductClick(item)}
                  >
                    {item.name}
                  </h3>
                  <p className="text-sm font-bold">£{(item.price * item.quantity).toFixed(2)}</p>
                </div>
                
                <div className="text-[10px] text-brand-gray-dark uppercase tracking-widest space-y-1 mb-4">
                  {item.selectedThickness && <p>Thickness: {item.selectedThickness}</p>}
                  {item.selectedLength && <p>Length: {item.selectedLength}</p>}
                </div>

                <div className="mt-auto flex justify-between items-center">
                  <div className="flex items-center border border-brand-gray-light">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-brand-gray-light/20 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-4 text-xs font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-brand-gray-light/20 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-brand-gray-dark hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-brand-gray-light/10 p-8 sticky top-32">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-8 border-b border-brand-gray-light pb-4">
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-xs uppercase tracking-widest">
                <span className="text-brand-gray-dark">Subtotal</span>
                <span className="font-bold">£{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs uppercase tracking-widest">
                <span className="text-brand-gray-dark">Shipping</span>
                <span className="font-bold text-emerald-600 uppercase">Free</span>
              </div>
              <div className="flex justify-between text-xs uppercase tracking-widest pt-4 border-t border-brand-gray-light">
                <span className="font-bold">Total</span>
                <span className="text-lg font-bold">£{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <GlowButton 
              onClick={onCheckout}
              className="w-full py-4 text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2"
            >
              Checkout <ArrowRight size={14} />
            </GlowButton>

            <div className="mt-8 space-y-4">
              <p className="text-[10px] text-brand-gray-dark uppercase tracking-widest text-center">
                Secure checkout powered by Stripe
              </p>
              <div className="flex justify-center gap-4 opacity-50 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" alt="Visa" className="h-3" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
