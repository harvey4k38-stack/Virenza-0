import { useState } from 'react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { ChevronLeft, ShieldCheck, CreditCard, Smartphone, Globe, Lock, CheckCircle2 } from 'lucide-react';
import GlowButton from '../components/GlowButton';

interface CheckoutViewProps {
  onBack: () => void;
  onSuccess: () => void;
}

type PaymentMethod = 'card' | 'apple' | 'paypal' | 'stripe';

export default function CheckoutView({ onBack, onSuccess }: CheckoutViewProps) {
  const { cart, cartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 2500);
  };

  if (isSuccess) {
    return (
      <main className="pt-32 pb-24 max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-bold uppercase tracking-[0.2em] mb-4">Order Confirmed</h1>
          <p className="text-brand-gray-dark mb-12">
            Thank you for your purchase. Your order has been received and is being processed. 
            A confirmation email will be sent to you shortly.
          </p>
          <GlowButton onClick={onSuccess} className="px-12 py-4 text-xs uppercase tracking-widest">
            Return to Store
          </GlowButton>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12">
      <div className="flex items-center gap-4 mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold hover:opacity-60 transition-opacity"
        >
          <ChevronLeft size={14} /> Back to Basket
        </button>
        <div className="h-px flex-1 bg-brand-gray-light" />
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-brand-gray-dark">
          <Lock size={12} /> Secure Checkout
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Left: Checkout Form */}
        <div className="space-y-12">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-8 flex items-center gap-3">
              <span className="w-6 h-6 bg-brand-black text-white rounded-full flex items-center justify-center text-[10px]">1</span>
              Shipping Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" className="col-span-1 p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm" />
              <input type="text" placeholder="Last Name" className="col-span-1 p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm" />
              <input type="email" placeholder="Email Address" className="col-span-2 p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm" />
              <input type="text" placeholder="Address" className="col-span-2 p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm" />
              <input type="text" placeholder="City" className="col-span-1 p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm" />
              <input type="text" placeholder="Postcode" className="col-span-1 p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm" />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-8 flex items-center gap-3">
              <span className="w-6 h-6 bg-brand-black text-white rounded-full flex items-center justify-center text-[10px]">2</span>
              Payment Method
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setPaymentMethod('card')}
                className={`p-6 border flex flex-col items-center gap-3 transition-all ${paymentMethod === 'card' ? 'border-brand-black bg-brand-black/5' : 'border-brand-gray-light hover:border-brand-black'}`}
              >
                <CreditCard size={24} />
                <span className="text-[10px] uppercase tracking-widest font-bold">Credit Card</span>
              </button>
              <button 
                onClick={() => setPaymentMethod('apple')}
                className={`p-6 border flex flex-col items-center gap-3 transition-all ${paymentMethod === 'apple' ? 'border-brand-black bg-brand-black/5' : 'border-brand-gray-light hover:border-brand-black'}`}
              >
                <Smartphone size={24} />
                <span className="text-[10px] uppercase tracking-widest font-bold">Apple Pay</span>
              </button>
              <button 
                onClick={() => setPaymentMethod('paypal')}
                className={`p-6 border flex flex-col items-center gap-3 transition-all ${paymentMethod === 'paypal' ? 'border-brand-black bg-brand-black/5' : 'border-brand-gray-light hover:border-brand-black'}`}
              >
                <Globe size={24} />
                <span className="text-[10px] uppercase tracking-widest font-bold">PayPal</span>
              </button>
              <button 
                onClick={() => setPaymentMethod('stripe')}
                className={`p-6 border flex flex-col items-center gap-3 transition-all ${paymentMethod === 'stripe' ? 'border-brand-black bg-brand-black/5' : 'border-brand-gray-light hover:border-brand-black'}`}
              >
                <div className="flex items-center gap-1">
                  <Lock size={12} />
                  <span className="text-xs font-bold italic">Stripe</span>
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold">Direct Pay</span>
              </button>
            </div>

            {paymentMethod === 'card' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-4"
              >
                <input type="text" placeholder="Card Number" className="w-full p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="MM/YY" className="p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm" />
                  <input type="text" placeholder="CVC" className="p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm" />
                </div>
              </motion.div>
            )}
          </section>

          <GlowButton 
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-5 text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              `Pay £${cartTotal.toFixed(2)}`
            )}
          </GlowButton>
          
          <div className="flex items-center justify-center gap-2 text-[10px] text-brand-gray-dark uppercase tracking-widest">
            <ShieldCheck size={14} /> 256-bit SSL Encrypted Security
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:pl-16">
          <div className="bg-brand-gray-light/5 p-8 border border-brand-gray-light">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-8 border-b border-brand-gray-light pb-4">
              Your Order
            </h2>
            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-4">
              {cart.map((item) => (
                <div key={`${item.id}-${item.selectedThickness}-${item.selectedLength}`} className="flex gap-4">
                  <div className="w-16 h-20 bg-brand-gray-light/20 flex-shrink-0">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest">{item.name}</h4>
                      <span className="text-[10px] font-bold">£{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <p className="text-[8px] text-brand-gray-dark uppercase tracking-widest mt-1">
                      Qty: {item.quantity} | {item.selectedThickness} | {item.selectedLength}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-4 pt-6 border-t border-brand-gray-light">
              <div className="flex justify-between text-[10px] uppercase tracking-widest">
                <span className="text-brand-gray-dark">Subtotal</span>
                <span className="font-bold">£{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest">
                <span className="text-brand-gray-dark">Shipping</span>
                <span className="font-bold text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between text-xs uppercase tracking-widest pt-4 border-t border-brand-gray-light">
                <span className="font-bold">Total</span>
                <span className="text-xl font-bold">£{cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
