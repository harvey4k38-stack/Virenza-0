import { motion } from 'motion/react';
import { ChevronLeft, RefreshCw, AlertCircle, Clock, Mail } from 'lucide-react';

interface ReturnsPolicyProps {
  onBack: () => void;
}

export default function ReturnsPolicy({ onBack }: ReturnsPolicyProps) {
  return (
    <main className="pt-32 pb-24 max-w-3xl mx-auto px-6 md:px-12">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold mb-12 hover:opacity-60 transition-opacity"
      >
        <ChevronLeft size={14} /> Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-gray-dark mb-4">Virenza</p>
          <h1 className="text-4xl font-bold uppercase tracking-[0.2em] mb-6">Returns & Refunds</h1>
          <p className="text-brand-gray-dark leading-relaxed">
            We want you to love your order. If something isn't right, we'll make it right.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="border border-brand-gray-light p-6 text-center">
            <RefreshCw size={24} className="mx-auto mb-3 text-brand-gray-dark" />
            <p className="text-[10px] uppercase tracking-widest font-bold">30-Day Returns</p>
          </div>
          <div className="border border-brand-gray-light p-6 text-center">
            <Clock size={24} className="mx-auto mb-3 text-brand-gray-dark" />
            <p className="text-[10px] uppercase tracking-widest font-bold">5–7 Day Refunds</p>
          </div>
          <div className="border border-brand-gray-light p-6 text-center">
            <Mail size={24} className="mx-auto mb-3 text-brand-gray-dark" />
            <p className="text-[10px] uppercase tracking-widest font-bold">Email to Start</p>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4">How to Return</h2>
            <ol className="space-y-3 text-sm text-brand-gray-dark leading-relaxed list-decimal list-inside">
              <li>Email us at <a href="mailto:orders@virenza.tech" className="text-brand-black font-bold underline">orders@virenza.tech</a> within 30 days of receiving your order</li>
              <li>Include your order number and reason for return</li>
              <li>We'll confirm and provide return instructions within 24 hours</li>
              <li>Send the item back unworn and in its original condition</li>
              <li>Your refund will be processed within 5–7 working days of us receiving it</li>
            </ol>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4">Conditions</h2>
            <ul className="space-y-2 text-sm text-brand-gray-dark leading-relaxed">
              <li>• Items must be unworn, unwashed, and in original condition</li>
              <li>• Returns must be initiated within 30 days of delivery</li>
              <li>• Return postage is covered by the customer</li>
            </ul>
          </section>

          <section className="border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-amber-700 mb-2">Personalised Items</p>
                <p className="text-sm text-amber-700 leading-relaxed">
                  Items with a custom name or number printed cannot be returned or refunded unless they arrive damaged or faulty.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4">Damaged or Wrong Item?</h2>
            <p className="text-sm text-brand-gray-dark leading-relaxed">
              If your item arrives damaged or we sent the wrong item, email us at <a href="mailto:orders@virenza.tech" className="text-brand-black font-bold underline">orders@virenza.tech</a> with a photo and we'll send a replacement or full refund at no cost to you.
            </p>
          </section>
        </div>
      </motion.div>
    </main>
  );
}
