import { useState } from 'react';
import { ChevronLeft, Crown, Percent, Gift, Zap, Truck } from 'lucide-react';
import GlowButton from '../components/GlowButton';

interface VIPMembershipProps {
  onBack: () => void;
  onManage: () => void;
}

const PERKS = [
  { icon: Percent, title: '15% Off Every Order', desc: 'Automatic discount applied at checkout — every time, no codes needed.' },
  { icon: Gift, title: 'Monthly Giveaway Entry', desc: 'Every member is entered into a monthly draw. Winner picks any jersey from the site for free.' },
  { icon: Zap, title: 'Early Access', desc: 'New kits drop for VIP members 24 hours before anyone else.' },
  { icon: Truck, title: 'Free Priority Shipping', desc: 'Every order ships free with priority handling.' },
];

export default function VIPMembership({ onBack, onManage }: VIPMembershipProps) {
  const [email, setEmail] = useState('');
  const [manageEmail, setManageEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [manageLoading, setManageLoading] = useState(false);
  const [manageError, setManageError] = useState('');
  const [showManage, setShowManage] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      setLoading(false);
    }
  };

  const handleManage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manageEmail) return;
    setManageLoading(true);
    setManageError('');
    try {
      const res = await fetch('/api/customer-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: manageEmail }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setManageError('No subscription found for this email.');
        setManageLoading(false);
      }
    } catch {
      setManageError('Something went wrong. Please try again.');
      setManageLoading(false);
    }
  };

  return (
    <main className="pt-32 pb-24 max-w-4xl mx-auto px-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold hover:opacity-60 transition-opacity mb-12"
      >
        <ChevronLeft size={14} /> Back
      </button>

      {/* Hero */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
            <Crown size={28} className="text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-[0.3em] mb-4">Virenza VIP</h1>
        <p className="text-brand-gray-dark text-sm max-w-md mx-auto mb-2">
          Join the club. Get 15% off every order, free giveaway entries every month, and early access to every new kit.
        </p>
        <p className="text-2xl font-black mt-6">£4.99 <span className="text-sm font-normal text-brand-gray-dark">/ every 2 weeks</span></p>
        <p className="text-[11px] text-brand-gray-dark uppercase tracking-widest mt-1">Cancel anytime — no commitment</p>
      </div>

      {/* Perks */}
      <div className="grid sm:grid-cols-2 gap-6 mb-16">
        {PERKS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="border border-brand-gray-light p-6 flex gap-4">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
              <Icon size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
              <p className="text-[12px] text-brand-gray-dark leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Subscribe Form */}
      <div className="max-w-md mx-auto">
        <div className="border border-brand-black p-8 mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-center mb-6">Join VIP</h2>
          <form onSubmit={handleSubscribe} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full px-4 py-3 border border-brand-gray-light text-sm focus:outline-none focus:border-brand-black transition-colors"
            />
            <GlowButton
              type="submit"
              disabled={loading}
              className="w-full py-4 text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Join for £4.99 / 2 weeks</>
              )}
            </GlowButton>
          </form>
          <p className="text-[10px] text-brand-gray-dark text-center mt-4 uppercase tracking-widest">
            Secure payment · Cancel anytime
          </p>
        </div>

        {/* Manage subscription */}
        <div className="text-center">
          {!showManage ? (
            <button
              onClick={() => setShowManage(true)}
              className="text-[11px] text-brand-gray-dark uppercase tracking-widest hover:text-brand-black transition-colors underline underline-offset-2"
            >
              Already a member? Manage your subscription
            </button>
          ) : (
            <form onSubmit={handleManage} className="space-y-3">
              <p className="text-[11px] uppercase tracking-widest text-brand-gray-dark mb-3">Enter your member email to manage or cancel</p>
              <input
                type="email"
                required
                value={manageEmail}
                onChange={e => { setManageEmail(e.target.value); setManageError(''); }}
                placeholder="Your email address"
                className="w-full px-4 py-3 border border-brand-gray-light text-sm focus:outline-none focus:border-brand-black transition-colors"
              />
              {manageError && <p className="text-red-500 text-[11px]">{manageError}</p>}
              <button
                type="submit"
                disabled={manageLoading}
                className="w-full py-3 border border-brand-black text-[11px] uppercase tracking-widest font-bold hover:bg-brand-black hover:text-white transition-all disabled:opacity-50"
              >
                {manageLoading ? 'Loading...' : 'Manage Subscription'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
