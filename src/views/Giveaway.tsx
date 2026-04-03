import { useState, useEffect } from 'react';
import { ChevronLeft, Ticket, Trophy } from 'lucide-react';
import GlowButton from '../components/GlowButton';

interface GiveawayProps {
  onBack: () => void;
}

const GIVEAWAYS = [
  {
    type: 'best-seller',
    label: 'Best Seller Jersey',
    prize: 'Palace x Nike 2026 World Cup Jersey',
    image: '/jerseys/palace-wc-1.png',
    ticketPrice: 2.99,
    highlight: true,
  },
  {
    type: 'featured',
    label: 'Featured Jersey',
    prize: 'Random Featured Jersey',
    image: '/jerseys/england-home-2026-1.png',
    ticketPrice: 3.99,
    highlight: false,
  },
  {
    type: 'special',
    label: 'Special Edition Jersey',
    prize: 'Random Special Edition Jersey',
    image: '/jerseys/retro-saka-1.png',
    ticketPrice: 4.99,
    highlight: false,
  },
  {
    type: 'world-cup',
    label: 'World Cup Jersey',
    prize: 'Random 2026 World Cup Jersey',
    image: '/jerseys/nike-away-2026-front.png',
    ticketPrice: 2.99,
    highlight: false,
  },
  {
    type: 'any',
    label: 'Any Jersey',
    prize: 'Any Random Jersey from the Store',
    image: '/jerseys/retro-gazza-1.png',
    ticketPrice: 1.99,
    highlight: false,
  },
];

function getMsUntilFriday8pmUK() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    weekday: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false,
  }).formatToParts(now);
  const day = ({ Sunday:0,Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6 } as Record<string,number>)[parts.find(p=>p.type==='weekday')!.value] ?? 0;
  const hour = parseInt(parts.find(p=>p.type==='hour')!.value);
  const min = parseInt(parts.find(p=>p.type==='minute')!.value);
  const sec = parseInt(parts.find(p=>p.type==='second')!.value);
  const secSinceMidnight = hour * 3600 + min * 60 + sec;
  let daysUntil = (5 - day + 7) % 7;
  if (day === 5 && secSinceMidnight < 72000) daysUntil = 0;
  if (day === 5 && secSinceMidnight >= 72000) daysUntil = 7;
  return (daysUntil * 86400 + (72000 - secSinceMidnight)) * 1000;
}

function useCountdown() {
  const [ms, setMs] = useState(getMsUntilFriday8pmUK);
  useEffect(() => {
    const id = setInterval(() => setMs(getMsUntilFriday8pmUK()), 1000);
    return () => clearInterval(id);
  }, []);
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return { d, h, m, s };
}

function GiveawayCard({ giveaway, email }: { giveaway: typeof GIVEAWAYS[0]; email: string }) {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentTickets, setCurrentTickets] = useState<number | null>(null);
  const [error, setError] = useState('');

  const checkTickets = async (e: string) => {
    if (!e) return;
    const res = await fetch('/api/check-giveaway', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: e }),
    });
    const data = await res.json();
    setCurrentTickets(data.tickets?.[giveaway.type] ?? 0);
  };

  useEffect(() => {
    if (email) checkTickets(email);
  }, [email]);

  const maxQty = Math.max(0, 3 - (currentTickets ?? 0));

  const handleEnter = async () => {
    if (!email) { setError('Enter your email above first'); return; }
    if (maxQty === 0) { setError('You already have 3 tickets in this draw'); return; }
    setLoading(true);
    setError('');
    const res = await fetch('/api/giveaway-entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, quantity: qty, type: giveaway.type }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      setError(data.error ?? 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className={`border ${giveaway.highlight ? 'border-black border-2' : 'border-brand-gray-light'} relative`}>
      {giveaway.highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] uppercase tracking-[0.3em] px-3 py-1 font-bold whitespace-nowrap">
          This Week's Feature
        </div>
      )}
      <div className="aspect-[4/3] overflow-hidden bg-brand-gray-light/20 relative">
        <img
          src={giveaway.image}
          alt={giveaway.prize}
          className={`w-full h-full object-cover transition-all duration-300 ${giveaway.highlight ? '' : 'grayscale blur-[3px] scale-105 brightness-75'}`}
          referrerPolicy="no-referrer"
        />
        {!giveaway.highlight && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
            <span className="text-white font-black text-5xl mb-2 drop-shadow-lg">?</span>
            <span className="text-white text-[9px] uppercase tracking-[0.3em] font-bold opacity-90">Mystery Prize</span>
            <span className="text-white/60 text-[8px] uppercase tracking-widest mt-1">Revealed on Draw</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gray-dark mb-1">{giveaway.label}</p>
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4 leading-snug">{giveaway.prize}</h3>

        <div className="flex items-center justify-between mb-4">
          <p className="text-xl font-black">£{giveaway.ticketPrice.toFixed(2)}<span className="text-xs font-normal text-brand-gray-dark"> / ticket</span></p>
          {currentTickets !== null && currentTickets > 0 && (
            <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold border border-emerald-400 px-2 py-1">
              {currentTickets} ticket{currentTickets > 1 ? 's' : ''} entered
            </span>
          )}
        </div>

        {maxQty > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <p className="text-[10px] uppercase tracking-widest text-brand-gray-dark">Tickets:</p>
              <div className="flex border border-brand-gray-light">
                {[1, 2, 3].filter(n => n <= maxQty).map(n => (
                  <button
                    key={n}
                    onClick={() => setQty(n)}
                    className={`w-9 h-9 text-xs font-bold transition-all ${qty === n ? 'bg-black text-white' : 'hover:bg-brand-gray-light/30'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-brand-gray-dark">= £{(giveaway.ticketPrice * qty).toFixed(2)}</p>
            </div>
            {error && <p className="text-red-500 text-[11px]">{error}</p>}
            <button
              onClick={handleEnter}
              disabled={loading}
              className="w-full py-3 bg-black text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:opacity-80 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Ticket size={12} /> Enter Draw</>}
            </button>
          </div>
        ) : (
          <div className="text-center py-3 border border-emerald-400 text-emerald-600 text-[11px] uppercase tracking-widest font-bold">
            Max tickets entered ✓
          </div>
        )}
      </div>
    </div>
  );
}

export default function Giveaway({ onBack }: GiveawayProps) {
  const { d, h, m, s } = useCountdown();
  const [email, setEmail] = useState('');
  const [emailSet, setEmailSet] = useState(false);

  return (
    <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold hover:opacity-60 transition-opacity mb-12"
      >
        <ChevronLeft size={14} /> Back
      </button>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Trophy size={36} />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-[0.3em] mb-3">Weekly Giveaways</h1>
        <p className="text-brand-gray-dark text-sm mb-8">Enter for a chance to win. Drawn every Friday at 8pm UK. Max 3 tickets per draw.</p>

        {/* Countdown */}
        <div className="inline-flex gap-1 items-center bg-black text-white px-8 py-4 mb-8">
          <span className="text-[10px] uppercase tracking-[0.3em] mr-4 font-bold">Draw in</span>
          {[{ v: d, l: 'D' }, { v: h, l: 'H' }, { v: m, l: 'M' }, { v: s, l: 'S' }].map(({ v, l }) => (
            <div key={l} className="flex flex-col items-center w-12">
              <span className="text-2xl font-black tabular-nums">{String(v).padStart(2, '0')}</span>
              <span className="text-[8px] uppercase tracking-widest opacity-60">{l}</span>
            </div>
          ))}
        </div>

        {/* Email input */}
        {!emailSet ? (
          <div className="max-w-sm mx-auto">
            <p className="text-[11px] uppercase tracking-widest text-brand-gray-dark mb-3">Enter your email to get started</p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && email && setEmailSet(true)}
                placeholder="Your email address"
                className="flex-1 px-4 py-3 border border-brand-gray-light text-sm focus:outline-none focus:border-brand-black transition-colors"
              />
              <GlowButton onClick={() => email && setEmailSet(true)} className="px-6 py-3 text-[10px] uppercase tracking-widest">
                Continue
              </GlowButton>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <p className="text-[11px] uppercase tracking-widest text-brand-gray-dark">Entering as <strong className="text-brand-black">{email}</strong></p>
            <button onClick={() => { setEmailSet(false); }} className="text-[10px] text-brand-gray-dark underline hover:text-brand-black">Change</button>
          </div>
        )}
      </div>

      {/* Giveaway Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
        {GIVEAWAYS.map(g => (
          <GiveawayCard key={g.type} giveaway={g} email={emailSet ? email : ''} />
        ))}
      </div>

      <p className="text-center text-[11px] text-brand-gray-dark mt-12 uppercase tracking-widest">
        Winners are contacted by email and announced on our socials. One winner per draw per week.
      </p>
    </main>
  );
}
