import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

const EXIT_KEY = 'virenza_exit_intent_shown';
const USED_EMAILS_KEY = 'virenza_discount_emails';

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem(EXIT_KEY)) return;
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setVisible(true);
        sessionStorage.setItem(EXIT_KEY, '1');
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
    // Only add after 5 seconds so it doesn't fire immediately
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const dismiss = () => setVisible(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEmailError('');
    const usedEmails: string[] = JSON.parse(localStorage.getItem(USED_EMAILS_KEY) ?? '[]');
    if (usedEmails.includes(email.trim().toLowerCase())) {
      setEmailError('This email has already claimed a discount.');
      return;
    }
    setStatus('loading');
    fetch('/api/discount-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code: 'VIRENZA10' }),
    }).catch(() => {});
    usedEmails.push(email.trim().toLowerCase());
    localStorage.setItem(USED_EMAILS_KEY, JSON.stringify(usedEmails));
    setStatus('success');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4"
          onClick={dismiss}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white w-full max-w-md relative overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-brand-black text-white px-8 py-5 text-center">
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold">Wait — Don't Miss Out</p>
              <p className="text-2xl font-bold mt-1 tracking-wide">Up to 10% Off</p>
              <p className="text-xs mt-1 opacity-70">Claim your mystery discount before you go</p>
            </div>

            <button type="button" onClick={dismiss} className="absolute top-4 right-4 text-white hover:opacity-70 transition-opacity">
              <X size={18} />
            </button>

            <div className="px-8 py-8">
              {status === 'success' ? (
                <div className="text-center py-4">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-brand-gray-dark mb-1">Your mystery code is</p>
                  <div className="border-2 border-dashed border-brand-gray-light py-4 px-6 mb-3">
                    <span className="text-2xl font-bold tracking-[0.3em] uppercase">VIRENZA10</span>
                  </div>
                  <p className="text-xs text-brand-gray-dark mb-6">We've also sent it to your email. Enter it at checkout.</p>
                  <button type="button" onClick={dismiss} className="w-full py-4 bg-brand-black text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:opacity-80 transition-opacity">
                    Shop Now
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-brand-gray-dark text-center mb-6">
                    Enter your email to unlock a mystery discount of up to 10% off your order.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                      placeholder="Your email address"
                      className="w-full border border-brand-gray-light px-4 py-3.5 text-sm focus:outline-none focus:border-brand-black transition-colors"
                    />
                    {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-4 bg-brand-black text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:opacity-80 transition-opacity disabled:opacity-50"
                    >
                      {status === 'loading' ? 'Claiming...' : 'Claim My Discount'}
                    </button>
                  </form>
                  <button type="button" onClick={dismiss} className="w-full mt-3 text-[10px] uppercase tracking-widest text-brand-gray-dark hover:text-brand-black transition-colors">
                    No thanks
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
