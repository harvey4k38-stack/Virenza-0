import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'virenza_discount_captured';
const USED_EMAILS_KEY = 'virenza_discount_emails';

function pickCode() {
  return 'VIRENZA10';
}

function getPercent(code: string) {
  return parseInt(code.replace('VIRENZA', ''), 10);
}

interface Props {
  forceOpen?: boolean;
  onClose?: () => void;
  onGiveaway?: () => void;
}

export default function EmailCapturePopup({ forceOpen, onClose, onGiveaway }: Props) {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [emailError, setEmailError] = useState('');
  const [revealedCode] = useState(pickCode);

  // Auto-show once ever (localStorage persists across sessions)
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setVisible(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  // Manual trigger
  useEffect(() => {
    if (forceOpen) setVisible(true);
  }, [forceOpen]);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, '1');
    onClose?.();
  };

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
      body: JSON.stringify({ email, code: revealedCode }),
    }).catch(() => {});
    usedEmails.push(email.trim().toLowerCase());
    localStorage.setItem(USED_EMAILS_KEY, JSON.stringify(usedEmails));
    setStatus('success');
    localStorage.setItem(STORAGE_KEY, '1');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0"
          onClick={dismiss}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white w-full max-w-md relative overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Top bar */}
            <div className="bg-brand-black text-white px-8 py-5 text-center">
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold">Exclusive Offer</p>
              <p className="text-2xl font-bold mt-1 tracking-wide">Mystery Discount</p>
              <p className="text-xs mt-1 opacity-70">Up to 10% off — revealed instantly</p>
            </div>

            <button
              type="button"
              onClick={dismiss}
              className="absolute top-4 right-4 text-white hover:opacity-70 transition-opacity"
            >
              <X size={18} />
            </button>

            <div className="px-8 py-8">
              {status === 'success' ? (
                <div className="text-center py-4">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-brand-gray-dark mb-1">You unlocked</p>
                  <p className="text-4xl font-bold mb-3">{getPercent(revealedCode)}% Off</p>
                  <p className="text-[10px] uppercase tracking-widest text-brand-gray-dark mb-2">Your code</p>
                  <div className="border-2 border-dashed border-brand-gray-light py-4 px-6 mb-3">
                    <span className="text-2xl font-bold tracking-[0.3em] uppercase">{revealedCode}</span>
                  </div>
                  <p className="text-xs text-brand-gray-dark mb-6">We've also sent it to your email. Enter it at checkout.</p>
                  <button
                    type="button"
                    onClick={dismiss}
                    className="w-full py-4 bg-brand-black text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:opacity-80 transition-opacity"
                  >
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
                      {status === 'loading' ? 'Revealing...' : 'Reveal My Discount'}
                    </button>
                  </form>
                  <button
                    type="button"
                    onClick={dismiss}
                    className="w-full mt-3 text-[10px] uppercase tracking-widest text-brand-gray-dark hover:text-brand-black transition-colors"
                  >
                    No thanks
                  </button>

                  {/* Giveaway teaser */}
                  <div className="mt-6 pt-5 border-t border-brand-gray-light">
                    <button
                      type="button"
                      onClick={onGiveaway}
                      className="w-full flex items-center justify-between group"
                    >
                      <div className="text-left">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-brand-gray-dark mb-0.5">Also this week</p>
                        <p className="text-xs font-black uppercase tracking-widest group-hover:opacity-70 transition-opacity">🏆 Win the Palace Jersey — from £2.99</p>
                      </div>
                      <span className="text-brand-gray-dark group-hover:text-brand-black transition-colors text-xs">→</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
