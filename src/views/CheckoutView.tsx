import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { ChevronLeft, ShieldCheck, Lock, CheckCircle2, Tag } from 'lucide-react';
import GlowButton from '../components/GlowButton';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '');

const DISCOUNT_CODE = 'TENNIS30';
const DISCOUNT_PERCENT = 0.40;
const USED_CODES_KEY = 'virenza_used_discount';

interface CheckoutViewProps {
  onBack: () => void;
  onSuccess: () => void;
}

interface InnerFormProps extends CheckoutViewProps {
  finalTotal: number;
  discountApplied: boolean;
  cartTotal: number;
}

function CheckoutForm({ onBack, onSuccess, finalTotal, discountApplied, cartTotal }: InnerFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, clearCart } = useCart();
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
    setIsProcessing(true);
    setErrorMessage('');

    // Save order for PayPal redirect case (user leaves page and returns)
    sessionStorage.setItem('virenza_pending_order', JSON.stringify({
      firstName: form.firstName, lastName: form.lastName,
      email: form.email, address: form.address,
      city: form.city, postcode: form.postcode,
      cart, total: finalTotal.toFixed(2),
      discount: discountApplied ? `${DISCOUNT_PERCENT * 100}% off (${DISCOUNT_CODE})` : null,
    }));

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/?virenza_order=complete`,
        payment_method_data: {
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
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message ?? 'Payment failed. Please try again.');
      sessionStorage.removeItem('virenza_pending_order');
      setIsProcessing(false);
    } else if (paymentIntent?.status === 'succeeded') {
      // Card / in-place payment succeeded
      if (discountApplied && form.email) {
        const used: string[] = JSON.parse(localStorage.getItem(USED_CODES_KEY) ?? '[]');
        used.push(form.email.toLowerCase());
        localStorage.setItem(USED_CODES_KEY, JSON.stringify(used));
      }
      const emailRes = await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName, lastName: form.lastName,
          email: form.email, address: form.address,
          city: form.city, postcode: form.postcode,
          cart, total: finalTotal.toFixed(2),
          discount: discountApplied ? `${DISCOUNT_PERCENT * 100}% off (${DISCOUNT_CODE})` : null,
        }),
      });
      const emailData = await emailRes.json();
      if (emailData.orderNumber) setOrderNumber(emailData.orderNumber);
      sessionStorage.removeItem('virenza_pending_order');
      clearCart();
      setIsSuccess(true);
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
            A confirmation email has been sent to you.
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
        {/* Left: Form */}
        <div className="space-y-12">
          {/* Shipping */}
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

          {/* Discount */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-8 flex items-center gap-3">
              <span className="w-6 h-6 bg-brand-black text-white rounded-full flex items-center justify-center text-[10px]">2</span>
              Discount Code
            </h2>
            {discountApplied ? (
              <div className="flex items-center gap-3 p-4 border border-emerald-400 bg-emerald-50">
                <Tag size={16} className="text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                  {DISCOUNT_CODE} — 40% off applied
                </span>
              </div>
            ) : (
              <DiscountInput form={form} />
            )}
          </section>

          {/* Payment */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-8 flex items-center gap-3">
              <span className="w-6 h-6 bg-brand-black text-white rounded-full flex items-center justify-center text-[10px]">3</span>
              Payment
            </h2>
            <PaymentElement options={{ layout: 'tabs' }} />
            {errorMessage && <p className="text-red-500 text-xs mt-3">{errorMessage}</p>}
          </section>

          <GlowButton
            onClick={handlePayment}
            disabled={isProcessing || !stripe || !elements}
            className="w-full py-5 text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              `Pay £${finalTotal.toFixed(2)}`
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
              {discountApplied && (
                <div className="flex justify-between text-[10px] uppercase tracking-widest">
                  <span className="text-emerald-600">Discount (40%)</span>
                  <span className="font-bold text-emerald-600">−£{(cartTotal * DISCOUNT_PERCENT).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[10px] uppercase tracking-widest">
                <span className="text-brand-gray-dark">Shipping</span>
                <span className="font-bold text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between text-xs uppercase tracking-widest pt-4 border-t border-brand-gray-light">
                <span className="font-bold">Total</span>
                <span className="text-xl font-bold">£{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Separate discount component so it doesn't re-render the whole form
function DiscountInput({ form }: { form: { email: string } }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const apply = () => {
    setError('');
    if (input.trim().toUpperCase() !== DISCOUNT_CODE) { setError('Invalid discount code.'); return; }
    const used: string[] = JSON.parse(localStorage.getItem(USED_CODES_KEY) ?? '[]');
    if (form.email && used.includes(form.email.toLowerCase())) {
      setError('This code has already been used with this email.');
      return;
    }
    // Signal parent - not possible without prop drilling; handled in outer wrapper
    setError('Please refresh and re-enter your code if the total does not update.');
  };

  return (
    <>
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter discount code"
          className="flex-1 p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm"
        />
        <button
          onClick={apply}
          className="px-6 py-4 border border-brand-black text-[10px] uppercase tracking-widest font-bold hover:bg-brand-black hover:text-white transition-colors"
        >
          Apply
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </>
  );
}

export default function CheckoutView({ onBack, onSuccess }: CheckoutViewProps) {
  const { cartTotal } = useCart();
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountInput, setDiscountInput] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [formEmail, setFormEmail] = useState('');

  const finalTotal = discountApplied ? cartTotal * (1 - DISCOUNT_PERCENT) : cartTotal;

  useEffect(() => {
    if (finalTotal <= 0) return;
    setLoading(true);
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: finalTotal }),
    })
      .then(r => r.json())
      .then(d => { setClientSecret(d.clientSecret ?? ''); setLoading(false); });
  }, [finalTotal]);

  const handleApplyDiscount = () => {
    setDiscountError('');
    if (discountInput.trim().toUpperCase() !== DISCOUNT_CODE) { setDiscountError('Invalid discount code.'); return; }
    const used: string[] = JSON.parse(localStorage.getItem(USED_CODES_KEY) ?? '[]');
    if (formEmail && used.includes(formEmail.toLowerCase())) {
      setDiscountError('This code has already been used with this email.');
      return;
    }
    setDiscountApplied(true);
  };

  if (loading || !clientSecret) {
    return (
      <main className="pt-32 pb-24 flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-brand-gray-light border-t-brand-black rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <Elements
      key={clientSecret}
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#000000',
            colorBackground: '#ffffff',
            colorText: '#000000',
            colorDanger: '#e53e3e',
            fontFamily: 'Inter, sans-serif',
            borderRadius: '0px',
            spacingUnit: '4px',
          },
          rules: {
            '.Input': { border: '1px solid #e5e5e5', padding: '12px 16px', fontSize: '14px' },
            '.Input:focus': { border: '1px solid #000000', boxShadow: 'none' },
            '.Tab': { border: '1px solid #e5e5e5' },
            '.Tab--selected': { border: '1px solid #000000', boxShadow: 'none' },
          },
        },
      }}
    >
      <CheckoutFormWithDiscount
        onBack={onBack}
        onSuccess={onSuccess}
        finalTotal={finalTotal}
        discountApplied={discountApplied}
        cartTotal={cartTotal}
        discountInput={discountInput}
        discountError={discountError}
        onDiscountInputChange={setDiscountInput}
        onApplyDiscount={handleApplyDiscount}
        onEmailChange={setFormEmail}
      />
    </Elements>
  );
}

interface FullFormProps extends InnerFormProps {
  discountInput: string;
  discountError: string;
  onDiscountInputChange: (v: string) => void;
  onApplyDiscount: () => void;
  onEmailChange: (email: string) => void;
}

function CheckoutFormWithDiscount({
  onBack, onSuccess, finalTotal, discountApplied, cartTotal,
  discountInput, discountError, onDiscountInputChange, onApplyDiscount, onEmailChange,
}: FullFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', address: '', city: '', postcode: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    if (e.target.name === 'email') onEmailChange(e.target.value);
  };

  const handlePayment = async () => {
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setErrorMessage('');

    sessionStorage.setItem('virenza_pending_order', JSON.stringify({
      firstName: form.firstName, lastName: form.lastName,
      email: form.email, address: form.address,
      city: form.city, postcode: form.postcode,
      cart, total: finalTotal.toFixed(2),
      discount: discountApplied ? `${DISCOUNT_PERCENT * 100}% off (${DISCOUNT_CODE})` : null,
    }));

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/?virenza_order=complete`,
        payment_method_data: {
          billing_details: {
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            address: { line1: form.address, city: form.city, postal_code: form.postcode, country: 'GB' },
          },
        },
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message ?? 'Payment failed. Please try again.');
      sessionStorage.removeItem('virenza_pending_order');
      setIsProcessing(false);
    } else if (paymentIntent?.status === 'succeeded') {
      if (discountApplied && form.email) {
        const used: string[] = JSON.parse(localStorage.getItem(USED_CODES_KEY) ?? '[]');
        used.push(form.email.toLowerCase());
        localStorage.setItem(USED_CODES_KEY, JSON.stringify(used));
      }
      const emailRes = await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName, lastName: form.lastName,
          email: form.email, address: form.address,
          city: form.city, postcode: form.postcode,
          cart, total: finalTotal.toFixed(2),
          discount: discountApplied ? `${DISCOUNT_PERCENT * 100}% off (${DISCOUNT_CODE})` : null,
        }),
      });
      const emailData = await emailRes.json();
      if (emailData.orderNumber) setOrderNumber(emailData.orderNumber);
      sessionStorage.removeItem('virenza_pending_order');
      clearCart();
      setIsSuccess(true);
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="pt-32 pb-24 max-w-3xl mx-auto px-6 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
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
            A confirmation email has been sent to you.
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
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold hover:opacity-60 transition-opacity">
          <ChevronLeft size={14} /> Back to Basket
        </button>
        <div className="h-px flex-1 bg-brand-gray-light" />
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-brand-gray-dark">
          <Lock size={12} /> Secure Checkout
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-16">
        <div className="space-y-12">
          {/* Shipping */}
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

          {/* Discount */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-8 flex items-center gap-3">
              <span className="w-6 h-6 bg-brand-black text-white rounded-full flex items-center justify-center text-[10px]">2</span>
              Discount Code
            </h2>
            {discountApplied ? (
              <div className="flex items-center gap-3 p-4 border border-emerald-400 bg-emerald-50">
                <Tag size={16} className="text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                  {DISCOUNT_CODE} — 40% off applied
                </span>
              </div>
            ) : (
              <>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={discountInput}
                    onChange={e => onDiscountInputChange(e.target.value)}
                    placeholder="Enter discount code"
                    className="flex-1 p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm"
                  />
                  <button
                    onClick={onApplyDiscount}
                    className="px-6 py-4 border border-brand-black text-[10px] uppercase tracking-widest font-bold hover:bg-brand-black hover:text-white transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {discountError && <p className="text-red-500 text-xs mt-2">{discountError}</p>}
              </>
            )}
          </section>

          {/* Payment */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-8 flex items-center gap-3">
              <span className="w-6 h-6 bg-brand-black text-white rounded-full flex items-center justify-center text-[10px]">3</span>
              Payment
            </h2>
            <PaymentElement options={{ layout: 'tabs' }} />
            {errorMessage && <p className="text-red-500 text-xs mt-3">{errorMessage}</p>}
          </section>

          <GlowButton
            onClick={handlePayment}
            disabled={isProcessing || !stripe || !elements}
            className="w-full py-5 text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              `Pay £${finalTotal.toFixed(2)}`
            )}
          </GlowButton>

          <div className="flex items-center justify-center gap-2 text-[10px] text-brand-gray-dark uppercase tracking-widest">
            <ShieldCheck size={14} /> 256-bit SSL Encrypted Security
          </div>
        </div>

        {/* Order Summary */}
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
              {discountApplied && (
                <div className="flex justify-between text-[10px] uppercase tracking-widest">
                  <span className="text-emerald-600">Discount (40%)</span>
                  <span className="font-bold text-emerald-600">−£{(cartTotal * DISCOUNT_PERCENT).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[10px] uppercase tracking-widest">
                <span className="text-brand-gray-dark">Shipping</span>
                <span className="font-bold text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between text-xs uppercase tracking-widest pt-4 border-t border-brand-gray-light">
                <span className="font-bold">Total</span>
                <span className="text-xl font-bold">£{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
