import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { ChevronLeft, ShieldCheck, Lock, CheckCircle2, Tag } from 'lucide-react';
import GlowButton from '../components/GlowButton';

const SQUARE_APP_ID = 'sq0idp-rIRWM4XyN8qda0IECdiBPw';
const SQUARE_LOCATION_ID = 'L5W2Z3AV5TJFE';

const DISCOUNT_CODES: Record<string, number> = {
  'VIRENZA5': 0.05, 'VIRENZA6': 0.06, 'VIRENZA7': 0.07, 'VIRENZA8': 0.08,
  'VIRENZA9': 0.09, 'VIRENZA10': 0.10, 'VIRENZA11': 0.11, 'VIRENZA12': 0.12,
  'VIRENZA13': 0.13, 'VIRENZA14': 0.14, 'VIRENZA15': 0.15, 'VIRENZA16': 0.16,
  'DPRESTON420': 0.15, 'DP420': 0.15, 'PLXENG20': 0.20,
  'JDBENSON': 0.25, 'EAMON': 0.25, 'GARY10': 0.10, 'JAY10': 0.10,
  'DAWN10': 0.10, 'LP15': 0.15, 'PAL100': 1.00,
};
const USED_CODES_KEY = 'virenza_used_discount';
let _appliedCode = '';
let _appliedPercent = 0;

interface CheckoutViewProps {
  onBack: () => void;
  onSuccess: () => void;
  onGiveaway?: () => void;
  initialClientSecret?: string;
}

export default function CheckoutView({ onBack, onSuccess }: CheckoutViewProps) {
  const { cart, cartTotal, clearCart } = useCart();
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountInput, setDiscountInput] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [sqReady, setSqReady] = useState(false);
  const [sqError, setSqError] = useState('');
  const [postcodeLoading, setPostcodeLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', address: '', city: '', postcode: ''
  });
  const cardRef = useRef<any>(null);
  const applePayRef = useRef<any>(null);
  const paymentsRef = useRef<any>(null);
  const initRef = useRef(false);
  const paymentRequestRef = useRef<any>(null);
  const formRef = useRef(form);
  const [hasGooglePay, setHasGooglePay] = useState(false);
  const [hasApplePay, setHasApplePay] = useState(false);

  const finalTotal = discountApplied ? cartTotal * (1 - _appliedPercent) : cartTotal;
  const finalTotalRef = useRef(finalTotal);

  // Keep refs in sync
  useEffect(() => { formRef.current = form; }, [form]);
  useEffect(() => { finalTotalRef.current = finalTotal; }, [finalTotal]);

  // Update payment request total when discount applied
  useEffect(() => {
    if (paymentRequestRef.current) {
      paymentRequestRef.current.update({
        total: { amount: finalTotal.toFixed(2), label: 'Virenza Order' },
      });
    }
  }, [finalTotal]);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    const init = async () => {
      if (!(window as any).Square) {
        await new Promise<void>((resolve, reject) => {
          if (document.querySelector('script[src*="squarecdn.com"]')) {
            const check = setInterval(() => {
              if ((window as any).Square) { clearInterval(check); resolve(); }
            }, 100);
            setTimeout(() => { clearInterval(check); reject(new Error('Square SDK timed out')); }, 10000);
            return;
          }
          const script = document.createElement('script');
          script.src = 'https://web.squarecdn.com/v1/square.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load payment SDK'));
          document.head.appendChild(script);
        });
      }
      const payments = (window as any).Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);
      paymentsRef.current = payments;

      // Card form
      const card = await payments.card({
        style: {
          '.input-container': { borderColor: '#e5e5e5', borderRadius: '0px' },
          '.input-container.is-focus': { borderColor: '#000000' },
          '.input-container.is-error': { borderColor: '#dc2626' },
          'input': { fontSize: '14px', color: '#000000' },
          'input::placeholder': { color: '#9ca3af' },
        },
      });
      await card.attach('#sq-card-container');
      cardRef.current = card;
      setSqReady(true);

      // Payment request for Google Pay / Apple Pay
      const pr = payments.paymentRequest({
        countryCode: 'GB',
        currencyCode: 'GBP',
        total: { amount: finalTotalRef.current.toFixed(2), label: 'Virenza Order' },
        requestBillingContact: true,
        requestShippingContact: true,
      });
      paymentRequestRef.current = pr;

      const isAppleDevice = 'ApplePaySession' in window;

      // Apple Pay — only on Apple devices
      if (isAppleDevice) {
        try {
          const applePay = await payments.applePay(pr);
          applePayRef.current = applePay;
          setHasApplePay(true);
        } catch {}
      }
    };
    init().catch(e => setSqError(e.message ?? e.toString() ?? 'Payment form failed to load'));
    return () => { cardRef.current?.destroy().catch(() => {}); };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
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

  const processPaymentToken = async (token: string, total: number, overrideForm?: typeof form, verificationToken?: string) => {
    const f = overrideForm ?? formRef.current;
    setErrorMessage('');

    const payRes = await fetch('/api/create-square-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceId: token, amount: total, idempotencyKey: `${f.email}-${total}-${Math.round(Date.now() / 10000)}`, verificationToken }),
    });
    const payData = await payRes.json();
    if (!payData.success) {
      if (payData.code === 'CARD_DECLINED_VERIFICATION_REQUIRED' && paymentsRef.current && !verificationToken) {
        try {
          const verifyResult = await paymentsRef.current.verifyBuyer(token, {
            amount: total.toFixed(2),
            currencyCode: 'GBP',
            intent: 'CHARGE',
            billingContact: {
              givenName: f.firstName,
              familyName: f.lastName,
              email: f.email,
              addressLines: [f.address],
              city: f.city,
              postalCode: f.postcode,
              countryCode: 'GB',
            },
          });
          if (verifyResult?.token) {
            return processPaymentToken(token, total, f, verifyResult.token);
          }
        } catch {}
      }
      setErrorMessage(payData.error ?? 'Payment failed. Please try again.');
      setIsProcessing(false);
      return false;
    }

    // TikTok
    try {
      const encoded = new TextEncoder().encode(f.email.trim().toLowerCase());
      const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
      const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
      (window as any).ttq?.identify({ email: hashHex });
    } catch {}
    const ttqContents = cart.map((item: any) => ({ content_id: item.id, content_name: item.name, quantity: item.quantity, price: parseFloat(item.price) || 0 }));
    (window as any).ttq?.track('CompletePayment', { value: total, currency: 'GBP', contents: ttqContents });
    (window as any).ttq?.track('Purchase', { value: total, currency: 'GBP', contents: ttqContents });

    if (discountApplied && f.email) {
      const used: string[] = JSON.parse(localStorage.getItem(USED_CODES_KEY) ?? '[]');
      used.push(f.email.toLowerCase());
      localStorage.setItem(USED_CODES_KEY, JSON.stringify(used));
    }

    const emailRes = await fetch('/api/send-order-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: f.firstName, lastName: f.lastName, email: f.email,
        address: f.address, city: f.city, postcode: f.postcode,
        cart, total: total.toFixed(2),
        discount: discountApplied ? `${_appliedPercent * 100}% off (${_appliedCode})` : null,
      }),
    });
    const emailData = await emailRes.json();
    if (emailData.orderNumber) setOrderNumber(emailData.orderNumber);
    clearCart();
    setIsSuccess(true);
    setIsProcessing(false);
    return true;
  };

  const processWalletPayment = async (token: string, contactDetails?: any) => {
    const f = formRef.current;
    const total = finalTotalRef.current;
    const shipping = contactDetails?.shippingContact;
    const billing = contactDetails?.billingContact;
    const contact = shipping ?? billing;
    const walletForm = contact ? {
      firstName: contact.givenName ?? f.firstName,
      lastName: contact.familyName ?? f.lastName,
      email: contact.email ?? f.email,
      address: contact.addressLines?.[0] ?? f.address,
      city: contact.city ?? contact.locality ?? f.city,
      postcode: contact.postalCode ?? f.postcode,
    } : f;
    if (!walletForm.email) { setErrorMessage('Please enter your email address first.'); return; }
    await processPaymentToken(token, total, walletForm);
  };

  const handleApplyDiscount = () => {
    setDiscountError('');
    const code = discountInput.trim().toUpperCase();
    const percent = DISCOUNT_CODES[code];
    if (!percent) { setDiscountError('Invalid discount code.'); return; }
    const used: string[] = JSON.parse(localStorage.getItem(USED_CODES_KEY) ?? '[]');
    if (form.email && used.includes(form.email.toLowerCase())) {
      setDiscountError('This code has already been used with this email.');
      return;
    }
    _appliedCode = code;
    _appliedPercent = percent;
    setDiscountApplied(true);
  };

  const handlePayment = async () => {
    if (!cardRef.current || !sqReady || isProcessing) return;
    if (!form.firstName || !form.lastName || !form.email || !form.address || !form.city || !form.postcode) {
      setErrorMessage('Please fill in all shipping details before proceeding.');
      return;
    }
    setIsProcessing(true);
    fetch('/api/track-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, firstName: form.firstName, cart, total: finalTotal.toFixed(2) }),
    }).catch(() => {});
    const result = await cardRef.current.tokenize();
    if (result.status !== 'OK') {
      setErrorMessage(result.errors?.[0]?.message ?? 'Card details invalid. Please check and try again.');
      setIsProcessing(false);
      return;
    }
    let verificationToken: string | undefined;
    if (paymentsRef.current) {
      try {
        const verifyResult = await paymentsRef.current.verifyBuyer(result.token, {
          amount: finalTotal.toFixed(2),
          currencyCode: 'GBP',
          intent: 'CHARGE',
          billingContact: {
            givenName: form.firstName,
            familyName: form.lastName,
            email: form.email,
            addressLines: [form.address],
            city: form.city,
            postalCode: form.postcode,
            countryCode: 'GB',
          },
        });
        if (verifyResult?.token) {
          verificationToken = verifyResult.token;
        } else if (verifyResult?.status && verifyResult.status !== 'OK') {
          setErrorMessage('Payment verification was cancelled. Please try again.');
          setIsProcessing(false);
          return;
        }
      } catch {
        setErrorMessage('Payment verification failed. Please try again.');
        setIsProcessing(false);
        return;
      }
    }
    await processPaymentToken(result.token, finalTotal, form, verificationToken);
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
            {discountApplied ? (
              <div className="flex items-center gap-3 p-4 border border-emerald-400 bg-emerald-50">
                <Tag size={16} className="text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                  {_appliedCode} — {_appliedPercent * 100}% off applied
                </span>
              </div>
            ) : (
              <>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={discountInput}
                    onChange={e => setDiscountInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleApplyDiscount()}
                    placeholder="Enter discount code"
                    className="flex-1 p-4 bg-brand-gray-light/10 border border-brand-gray-light focus:border-brand-black outline-none transition-colors text-sm"
                  />
                  <button
                    onClick={handleApplyDiscount}
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
            <div className="mb-6 space-y-3">
{hasApplePay && (
                <button
                  onClick={async () => {
                    if (!applePayRef.current || isProcessing) return;
                    setIsProcessing(true);
                    const result = await applePayRef.current.tokenize();
                    if (result?.status === 'OK') {
                      await processWalletPayment(result.token, result.details);
                    } else {
                      setIsProcessing(false);
                    }
                  }}
                  className="w-full h-[48px] bg-black text-white flex items-center justify-center gap-2 rounded-md text-[15px] font-medium"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  Pay
                </button>
              )}
              {hasApplePay && (
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex-1 h-px bg-brand-gray-light" />
                  <span className="text-[10px] uppercase tracking-widest text-brand-gray-dark font-bold">or pay by card</span>
                  <div className="flex-1 h-px bg-brand-gray-light" />
                </div>
              )}
            </div>
            <div id="sq-card-container" className="min-h-[90px]" />
            {!sqReady && !sqError && (
              <div className="flex items-center gap-2 text-xs text-brand-gray-dark mt-3">
                <div className="w-3 h-3 border-2 border-brand-gray-light border-t-brand-black rounded-full animate-spin" />
                Loading payment form...
              </div>
            )}
            {sqError && (
              <p className="text-red-500 text-xs mt-2">Payment form error: {sqError}</p>
            )}
            {errorMessage && <p className="text-red-500 text-xs mt-3">{errorMessage}</p>}
          </section>

          <GlowButton
            onClick={handlePayment}
            disabled={isProcessing || !sqReady}
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
