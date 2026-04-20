import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { loadStripe, PaymentRequest } from '@stripe/stripe-js';
import { Elements, PaymentElement, PaymentRequestButtonElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { ChevronLeft, ShieldCheck, Lock, CheckCircle2, Tag } from 'lucide-react';
import GlowButton from '../components/GlowButton';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '');

const DISCOUNT_CODES: Record<string, number> = { 'VIRENZA5': 0.05, 'VIRENZA6': 0.06, 'VIRENZA7': 0.07, 'VIRENZA8': 0.08, 'VIRENZA9': 0.09, 'VIRENZA10': 0.10, 'VIRENZA11': 0.11, 'VIRENZA12': 0.12, 'VIRENZA13': 0.13, 'VIRENZA14': 0.14, 'VIRENZA15': 0.15, 'VIRENZA16': 0.16, 'DPRESTON420': 0.15, 'DP420': 0.15, 'PLXENG20': 0.20, 'WC2026': 0.26, 'JDBENSON': 0.25, 'EAMON': 0.25, 'GARY10': 0.10, 'JAY10': 0.10, 'DAWN10': 0.10, 'LP15': 0.15, 'PAL100': 1.00, 'CALLUM25': 0.25 };
const USED_CODES_KEY = 'virenza_used_discount';
let _appliedCode = '';
let _appliedPercent = 0;

interface CheckoutViewProps {
  onBack: () => void;
  onSuccess: () => void;
  onGiveaway?: () => void;
  initialClientSecret?: string;
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
    localStorage.setItem('virenza_pending_order', JSON.stringify({
      firstName: form.firstName, lastName: form.lastName,
      email: form.email, address: form.address,
      city: form.city, postcode: form.postcode,
      cart, total: finalTotal.toFixed(2),
      discount: discountApplied ? `${_appliedPercent * 100}% off (${_appliedCode})` : null,
      savedAt: Date.now(),
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
      localStorage.removeItem('virenza_pending_order');
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
          discount: discountApplied ? `${_appliedPercent * 100}% off (${_appliedCode})` : null,
        }),
      });
      const emailData = await emailRes.json();
      if (emailData.orderNumber) setOrderNumber(emailData.orderNumber);
      localStorage.removeItem('virenza_pending_order');
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
          <p className="text-brand-gray-dark mb-8">
            Thank you for your purchase. Your order has been received and is being processed.
            A confirmation email has been sent to you.
          </p>
          <div className="w-full max-w-md border-2 border-black p-6 mb-8 text-left">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-1">🏆 While you're here</p>
            <p className="text-sm font-bold uppercase tracking-widest mb-2">Enter this week's jersey giveaway</p>
            <p className="text-xs text-brand-gray-dark mb-4">Win a free jersey — drawn every Friday at 8pm UK. Tickets from £1.99. Max 3 per draw.</p>
            <button
              onClick={() => { onSuccess(); setTimeout(() => (window as any).__virenzaGoGiveaway?.(), 50); }}
              className="w-full py-3 bg-black text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:opacity-80 transition-opacity"
            >
              Enter Giveaway →
            </button>
          </div>
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
                  {`${_appliedCode} — ${_appliedPercent * 100}% off applied`}
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
                      Qty: {item.quantity} | {item.selectedLength}
                    </p>
                    {item.selectedName && (
                      <p className="text-[8px] font-bold uppercase tracking-widest mt-0.5">Personalisation: {item.selectedName}</p>
                    )}
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
                  <span className="text-emerald-600">Discount ({_appliedPercent * 100}%)</span>
                  <span className="font-bold text-emerald-600">−£{(cartTotal * _appliedPercent).toFixed(2)}</span>
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
    if (!DISCOUNT_CODES[input.trim().toUpperCase()]) { setError('Invalid discount code.'); return; }
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

export default function CheckoutView({ onBack, onSuccess, initialClientSecret = '' }: CheckoutViewProps) {
  const { cartTotal } = useCart();
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountInput, setDiscountInput] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [clientSecret, setClientSecret] = useState(initialClientSecret);
  const [formEmail, setFormEmail] = useState('');
  const [loadError, setLoadError] = useState('');
  const [vipApplied, setVipApplied] = useState(false);

  const handleEmailChange = async (email: string) => {
    setFormEmail(email);
    if (!email.includes('@') || discountApplied) return;
    try {
      const res = await fetch('/api/check-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const { isMember } = await res.json();
      if (isMember && !discountApplied) {
        _appliedCode = 'VIP15';
        _appliedPercent = 0.15;
        setDiscountApplied(true);
        setVipApplied(true);
      }
    } catch {}
  };

  const finalTotal = discountApplied ? cartTotal * (1 - _appliedPercent) : cartTotal;

  useEffect(() => {
    // Only re-fetch when discount changes the total (initial secret already provided)
    if (!discountApplied && initialClientSecret) return;
    if (finalTotal <= 0) return;
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: finalTotal }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.clientSecret) {
          setClientSecret(d.clientSecret);
        } else {
          setLoadError('Payment system unavailable. Please try again later.');
        }
      })
      .catch(() => setLoadError('Failed to load checkout. Please refresh and try again.'));
  }, [finalTotal]);

  const handleApplyDiscount = (rawCode?: string) => {
    setDiscountError('');
    const code = (rawCode ?? discountInput).trim().toUpperCase();
    const percent = DISCOUNT_CODES[code];
    if (!percent) { setDiscountError('Invalid discount code.'); return; }
    const used: string[] = JSON.parse(localStorage.getItem(USED_CODES_KEY) ?? '[]');
    if (formEmail && used.includes(formEmail.toLowerCase())) {
      setDiscountError('This code has already been used with this email.');
      return;
    }
    _appliedCode = code;
    _appliedPercent = percent;
    setDiscountApplied(true);
    setVipApplied(false);
  };

  if (loadError) {
    return (
      <main className="pt-32 pb-24 max-w-3xl mx-auto px-6 text-center">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold hover:opacity-60 transition-opacity mb-12">
          <ChevronLeft size={14} /> Back
        </button>
        <p className="text-red-500 text-sm">{loadError}</p>
      </main>
    );
  }

  if (!clientSecret) {
    // Show skeleton checkout page while payment intent loads in background
    return (
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12 min-h-screen">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
          <div className="h-px flex-1 bg-brand-gray-light" />
          <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            <div className="h-5 w-48 bg-gray-100 rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`h-14 bg-gray-100 rounded animate-pulse ${i >= 2 ? 'col-span-2' : ''}`} />
              ))}
            </div>
            <div className="h-40 bg-gray-100 rounded animate-pulse mt-8" />
          </div>
          <div className="h-96 bg-gray-100 rounded animate-pulse" />
        </div>
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
        onEmailChange={handleEmailChange}
        vipApplied={vipApplied}
      />
    </Elements>
  );
}

interface FullFormProps extends InnerFormProps {
  discountInput: string;
  discountError: string;
  onDiscountInputChange: (v: string) => void;
  onApplyDiscount: (code?: string) => void;
  onEmailChange: (email: string) => void;
  vipApplied: boolean;
}

function CheckoutFormWithDiscount({
  onBack, onSuccess, finalTotal, discountApplied, cartTotal,
  discountInput, discountError, onDiscountInputChange, onApplyDiscount, onEmailChange, vipApplied,
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
  const [postcodeLoading, setPostcodeLoading] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);

  useEffect(() => {
    if (!stripe) return;
    const pr = stripe.paymentRequest({
      country: 'GB',
      currency: 'gbp',
      total: { label: 'Virenza Order', amount: Math.round(finalTotal * 100) },
      requestPayerName: true,
      requestPayerEmail: true,
      requestShipping: true,
      shippingOptions: [{ id: 'free', label: 'Free Shipping', detail: 'Delivered in 7-10 working days', amount: 0 }],
    });
    pr.canMakePayment().then(result => {
      if (result) setPaymentRequest(pr);
    });
    pr.on('shippingaddresschange', (e) => {
      e.updateWith({ status: 'success', shippingOptions: [{ id: 'free', label: 'Free Shipping', detail: 'Delivered in 7-10 working days', amount: 0 }] });
    });
    pr.on('paymentmethod', async (e) => {
      try {
        const res = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: finalTotal }),
        });
        const { clientSecret } = await res.json();
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          { payment_method: e.paymentMethod.id },
          { handleActions: false }
        );
        if (error) { e.complete('fail'); setErrorMessage(error.message ?? 'Payment failed.'); return; }
        e.complete('success');
        if (paymentIntent?.status === 'requires_action') await stripe.confirmCardPayment(clientSecret);
        const addr = e.shippingAddress;
        const emailRes = await fetch('/api/send-order-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: e.payerName?.split(' ')[0] ?? '',
            lastName: e.payerName?.split(' ').slice(1).join(' ') ?? '',
            email: e.payerEmail ?? '',
            address: addr?.addressLine?.[0] ?? '',
            city: addr?.city ?? '',
            postcode: addr?.postalCode ?? '',
            cart, total: finalTotal.toFixed(2), discount: null,
          }),
        });
        const emailData = await emailRes.json();
        if (emailData.orderNumber) setOrderNumber(emailData.orderNumber);
        // Fire TikTok events for Apple/Google Pay
        try {
          const payerEmail = e.payerEmail ?? '';
          if (payerEmail) {
            const encoded = new TextEncoder().encode(payerEmail.trim().toLowerCase());
            const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
            const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
            (window as any).ttq?.identify({ email: hashHex });
          }
        } catch {}
        const ttqContents = cart.map((item: any) => ({
          content_id: item.id,
          content_name: item.name,
          quantity: item.quantity,
          price: parseFloat(item.price) || 0,
        }));
        (window as any).ttq?.track('CompletePayment', { value: finalTotal, currency: 'GBP', contents: ttqContents });
        (window as any).ttq?.track('Purchase', { value: finalTotal, currency: 'GBP', contents: ttqContents });
        clearCart();
        setIsSuccess(true);
      } catch { e.complete('fail'); }
    });
  }, [stripe, finalTotal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    if (e.target.name === 'email') onEmailChange(e.target.value);
  };

  const handlePostcodeBlur = async (postcode: string) => {
    const clean = postcode.trim().replace(/\s+/g, '');
    if (clean.length < 5) return;
    setPostcodeLoading(true);
    try {
      const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (data.status === 200 && data.result) {
        const town = data.result.admin_district || data.result.parish || data.result.region || '';
        if (town) setForm(prev => ({ ...prev, city: town }));
      }
    } catch {}
    setPostcodeLoading(false);
  };

  const handleEmailBlur = async (email: string) => {
    if (!email || !email.includes('@')) return;
    try {
      const encoded = new TextEncoder().encode(email.trim().toLowerCase());
      const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
      const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
      (window as any).ttq?.identify({ email: hashHex });
    } catch {}
  };

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    if (!form.firstName || !form.lastName || !form.email || !form.address || !form.city || !form.postcode) {
      setErrorMessage('Please fill in all shipping details before proceeding.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    localStorage.setItem('virenza_pending_order', JSON.stringify({
      firstName: form.firstName, lastName: form.lastName,
      email: form.email, address: form.address,
      city: form.city, postcode: form.postcode,
      cart, total: finalTotal.toFixed(2),
      discount: discountApplied ? `${_appliedPercent * 100}% off (${_appliedCode})` : null,
      savedAt: Date.now(),
    }));
    fetch('/api/track-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, firstName: form.firstName, cart, total: finalTotal.toFixed(2) }),
    }).catch(() => {});

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
      localStorage.removeItem('virenza_pending_order');
      setIsProcessing(false);
    } else if (paymentIntent?.status === 'succeeded') {
      // Fire TikTok CompletePayment with full data
      try {
        const encoded = new TextEncoder().encode(form.email.trim().toLowerCase());
        const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
        const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
        (window as any).ttq?.identify({ email: hashHex });
      } catch {}
      const ttqContents = cart.map((item: any) => ({
        content_id: item.id,
        content_name: item.name,
        quantity: item.quantity,
        price: parseFloat(item.price) || 0,
      }));
      (window as any).ttq?.track('CompletePayment', { value: finalTotal, currency: 'GBP', contents: ttqContents });
      (window as any).ttq?.track('Purchase', { value: finalTotal, currency: 'GBP', contents: ttqContents });
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
          discount: discountApplied ? `${_appliedPercent * 100}% off (${_appliedCode})` : null,
        }),
      });
      const emailData = await emailRes.json();
      if (emailData.orderNumber) setOrderNumber(emailData.orderNumber);
      localStorage.removeItem('virenza_pending_order');
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
          <p className="text-brand-gray-dark mb-8">
            Thank you for your purchase. Your order has been received and is being processed.
            A confirmation email has been sent to you.
          </p>
          <div className="w-full max-w-md border-2 border-black p-6 mb-8 text-left">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-1">🏆 While you're here</p>
            <p className="text-sm font-bold uppercase tracking-widest mb-2">Enter this week's jersey giveaway</p>
            <p className="text-xs text-brand-gray-dark mb-4">Win a free jersey — drawn every Friday at 8pm UK. Tickets from £1.99. Max 3 per draw.</p>
            <button
              onClick={() => { onSuccess(); setTimeout(() => (window as any).__virenzaGoGiveaway?.(), 50); }}
              className="w-full py-3 bg-black text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:opacity-80 transition-opacity"
            >
              Enter Giveaway →
            </button>
          </div>
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
              <input name="firstName" value={form.firstName} onChange={handleChange} type="text" placeholder="First Name" autoComplete="given-name" className="col-span-1 p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm" />
              <input name="lastName" value={form.lastName} onChange={handleChange} type="text" placeholder="Last Name" autoComplete="family-name" className="col-span-1 p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm" />
              <input name="email" value={form.email} onChange={handleChange} onBlur={e => handleEmailBlur(e.target.value)} type="email" placeholder="Email Address" autoComplete="email" className="col-span-2 p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm" />
              <input name="postcode" value={form.postcode} onChange={handleChange} onBlur={e => handlePostcodeBlur(e.target.value)} type="text" placeholder="Postcode" autoComplete="postal-code" className="col-span-2 p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm uppercase" />
              <input name="address" value={form.address} onChange={handleChange} type="text" placeholder="House number & street" autoComplete="address-line1" className="col-span-2 p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm" />
              <div className="col-span-2 relative">
                <input name="city" value={form.city} onChange={handleChange} type="text" placeholder={postcodeLoading ? 'Looking up postcode...' : 'City / Town'} autoComplete="address-level2" className="w-full p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm" />
                {postcodeLoading && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-brand-gray-light border-t-brand-black rounded-full animate-spin" />}
              </div>
            </div>
          </section>

          {/* Discount */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-8 flex items-center gap-3">
              <span className="w-6 h-6 bg-brand-black text-white rounded-full flex items-center justify-center text-[10px]">2</span>
              Discount Code
            </h2>
            {discountApplied && !vipApplied ? (
              <div className="flex items-center gap-3 p-4 border border-emerald-400 bg-emerald-50">
                <Tag size={16} className="text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                  {`${_appliedCode} — ${_appliedPercent * 100}% off applied`}
                </span>
              </div>
            ) : (
              <>
                {vipApplied && (
                  <div className="flex items-center gap-3 p-4 border border-emerald-400 bg-emerald-50 mb-3">
                    <Tag size={16} className="text-emerald-600" />
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                      👑 VIP Member — 15% off automatically applied
                    </span>
                  </div>
                )}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={discountInput}
                    onChange={e => onDiscountInputChange(e.target.value)}
                    placeholder={vipApplied ? 'Have a higher discount code?' : 'Enter discount code'}
                    className="flex-1 p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm"
                  />
                  <button
                    onClick={() => onApplyDiscount(discountInput)}
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
            {paymentRequest && (
              <div className="mb-6">
                <PaymentRequestButtonElement
                  options={{
                    paymentRequest,
                    style: { paymentRequestButton: { type: 'buy', theme: 'dark', height: '52px' } },
                  }}
                />
                <div className="flex items-center gap-3 mt-5">
                  <div className="flex-1 h-px bg-brand-gray-light" />
                  <span className="text-[10px] uppercase tracking-widest text-brand-gray-dark font-bold">or pay another way</span>
                  <div className="flex-1 h-px bg-brand-gray-light" />
                </div>
              </div>
            )}
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
                      Qty: {item.quantity} | {item.selectedLength}
                    </p>
                    {item.selectedName && (
                      <p className="text-[8px] font-bold uppercase tracking-widest mt-0.5">Personalisation: {item.selectedName}</p>
                    )}
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
                  <span className="text-emerald-600">Discount ({_appliedPercent * 100}%)</span>
                  <span className="font-bold text-emerald-600">−£{(cartTotal * _appliedPercent).toFixed(2)}</span>
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
