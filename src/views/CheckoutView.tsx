import { useState } from 'react';
import { motion } from 'motion/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { ChevronLeft, ShieldCheck, CreditCard, Lock, CheckCircle2 } from 'lucide-react';
import GlowButton from '../components/GlowButton';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '');

interface CheckoutViewProps {
  onBack: () => void;
  onSuccess: () => void;
}

function CheckoutForm({ onBack, onSuccess }: CheckoutViewProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, cartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', address: '', city: '', postcode: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) return;

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Create payment intent on the server
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cartTotal }),
      });

      const { clientSecret, error: serverError } = await res.json();
      if (serverError) throw new Error(serverError);

      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            address: {
              line1: form.address,
              city: form.city,
              postal_code: form.postcode,
              country: 'GB',
            },
          },
        },
      });

      if (error) {
        setErrorMessage(error.message ?? 'Payment failed. Please try again.');
      } else if (paymentIntent?.status === 'succeeded') {
        const emailRes = await fetch('/api/send-order-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            address: form.address,
            city: form.city,
            postcode: form.postcode,
            cart,
            total: cartTotal.toFixed(2),
          }),
        });
        const emailData = await emailRes.json();
        if (emailData.orderNumber) setOrderNumber(emailData.orderNumber);
        clearCart();
        setIsSuccess(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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
          {orderNumber && (
            <p className="text-[11px] uppercase tracking-[0.3em] font-bold bg-brand-gray-light/20 border border-brand-gray-light px-6 py-3 mb-6">
              Order #{orderNumber}
            </p>
          )}
          <p className="text-brand-gray-dark mb-12">
            Thank you for your purchase. Your order has been received and is being processed.
            A confirmation email with your order number has been sent to you.
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
              <input name="firstName" value={form.firstName} onChange={handleChange} type="text" placeholder="First Name" className="col-span-1 p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm" />
              <input name="lastName" value={form.lastName} onChange={handleChange} type="text" placeholder="Last Name" className="col-span-1 p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm" />
              <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email Address" className="col-span-2 p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm" />
              <input name="address" value={form.address} onChange={handleChange} type="text" placeholder="Address" className="col-span-2 p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm" />
              <input name="city" value={form.city} onChange={handleChange} type="text" placeholder="City" className="col-span-1 p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm" />
              <input name="postcode" value={form.postcode} onChange={handleChange} type="text" placeholder="Postcode" className="col-span-1 p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm" />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-8 flex items-center gap-3">
              <span className="w-6 h-6 bg-brand-black text-white rounded-full flex items-center justify-center text-[10px]">2</span>
              Payment
            </h2>

            <div className="p-4 border border-brand-gray-light flex items-center gap-3 mb-6 bg-brand-black/5">
              <CreditCard size={20} />
              <span className="text-[10px] uppercase tracking-widest font-bold">Credit / Debit Card</span>
              <Lock size={12} className="ml-auto text-brand-gray-dark" />
            </div>

            <div className="space-y-3">
              <div className="p-4 border border-brand-gray-light focus-within:border-brand-black transition-colors">
                <p className="text-[9px] uppercase tracking-widest text-brand-gray-dark mb-2">Card Number</p>
                <CardNumberElement options={{ style: { base: { fontSize: '14px', color: '#000000', fontFamily: 'Inter, sans-serif', '::placeholder': { color: '#AAAAAA' } }, invalid: { color: '#e53e3e' } } }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 border border-brand-gray-light focus-within:border-brand-black transition-colors">
                  <p className="text-[9px] uppercase tracking-widest text-brand-gray-dark mb-2">Expiry Date</p>
                  <CardExpiryElement options={{ style: { base: { fontSize: '14px', color: '#000000', fontFamily: 'Inter, sans-serif', '::placeholder': { color: '#AAAAAA' } }, invalid: { color: '#e53e3e' } } }} />
                </div>
                <div className="p-4 border border-brand-gray-light focus-within:border-brand-black transition-colors">
                  <p className="text-[9px] uppercase tracking-widest text-brand-gray-dark mb-2">CVC</p>
                  <CardCvcElement options={{ style: { base: { fontSize: '14px', color: '#000000', fontFamily: 'Inter, sans-serif', '::placeholder': { color: '#AAAAAA' } }, invalid: { color: '#e53e3e' } } }} />
                </div>
              </div>
            </div>

            {errorMessage && (
              <p className="text-red-500 text-xs mt-3">{errorMessage}</p>
            )}
          </section>

          <GlowButton
            onClick={handlePayment}
            disabled={isProcessing || !stripe}
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

export default function CheckoutView({ onBack, onSuccess }: CheckoutViewProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm onBack={onBack} onSuccess={onSuccess} />
    </Elements>
  );
}
