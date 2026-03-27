import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import GlowButton from '../components/GlowButton';

interface ShippingTrackingProps {
  onBack: () => void;
}

export default function ShippingTracking({ onBack }: ShippingTrackingProps) {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/tracking-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, email }),
      });

      if (!res.ok) throw new Error('Failed to send request');
      setIsSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-32 pb-24 max-w-4xl mx-auto px-6 md:px-12">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold hover:opacity-60 transition-opacity mb-12"
      >
        <ChevronLeft size={14} /> Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-gray-dark mb-4">Delivery</p>
        <h1 className="text-4xl font-bold uppercase tracking-[0.2em] mb-16">Shipping & Tracking</h1>

        {/* Shipping Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <div className="border border-brand-gray-light p-8">
            <Package size={24} className="mb-6" />
            <h3 className="text-[10px] uppercase tracking-widest font-bold mb-3">Order Processing</h3>
            <p className="text-sm text-brand-gray-dark leading-relaxed">
              All orders are processed within 1–2 business days of payment confirmation.
            </p>
          </div>
          <div className="border border-brand-gray-light p-8">
            <Truck size={24} className="mb-6" />
            <h3 className="text-[10px] uppercase tracking-widest font-bold mb-3">Delivery Time</h3>
            <p className="text-sm text-brand-gray-dark leading-relaxed">
              Standard shipping typically takes <strong>3–5 business days</strong> from dispatch. You will receive tracking information once your order has shipped.
            </p>
          </div>
          <div className="border border-brand-gray-light p-8">
            <Clock size={24} className="mb-6" />
            <h3 className="text-[10px] uppercase tracking-widest font-bold mb-3">Free Shipping</h3>
            <p className="text-sm text-brand-gray-dark leading-relaxed">
              We offer free standard shipping on all orders. No minimum spend required.
            </p>
          </div>
        </div>

        {/* Jersey high demand notice */}
        <div className="flex items-start gap-4 p-6 border border-brand-gray-light bg-brand-gray-light/10 mb-20">
          <Truck size={18} className="text-brand-gray-dark mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold mb-1">Jersey Orders — High Demand</p>
            <p className="text-sm text-brand-gray-dark leading-relaxed">
              Due to a high volume of jersey orders, customers should expect delivery within <strong className="text-brand-black">5–7 working days</strong>. In worse cases, orders can take up to <strong className="text-brand-black">10 working days</strong>. We're working hard to get every order out as quickly as possible and appreciate your patience.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-brand-gray-light mb-20" />

        {/* Tracking Request */}
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold uppercase tracking-[0.2em] mb-4">Track Your Order</h2>
          <p className="text-sm text-brand-gray-dark mb-10 leading-relaxed">
            Enter your order number below and we'll send your tracking information directly to your email address.
          </p>

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-start gap-4"
            >
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-widest">Request Received</h3>
              <p className="text-sm text-brand-gray-dark leading-relaxed">
                We've received your tracking request for order <strong>{orderNumber}</strong>. We'll send your tracking details to <strong>{email}</strong> shortly.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-brand-gray-dark mb-2">
                  Order Number
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g. VRZ-M3K9P2-AB7C"
                  required
                  className="w-full p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-brand-gray-dark mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="The email used at checkout"
                  required
                  className="w-full p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm"
                />
              </div>

              {error && <p className="text-red-500 text-xs">{error}</p>}

              <GlowButton
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Request Tracking Info'
                )}
              </GlowButton>
            </form>
          )}
        </div>
      </motion.div>
    </main>
  );
}
