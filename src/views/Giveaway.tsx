import { useState, useEffect } from 'react';
import { ChevronLeft, Ticket, Trophy, Zap, Users, Gift } from 'lucide-react';

interface GiveawayProps {
  onBack: () => void;
}

const GIVEAWAYS = [
  {
    type: 'best-seller',
    label: 'This Week\'s Star Prize',
    prize: 'Palace x Nike 2026 World Cup Jersey',
    image: '/jerseys/palace-wc-1.png',
    ticketPrice: 2.99,
    value: 49.99,
    highlight: true,
  },
  {
    type: 'featured',
    label: 'Featured Drop',
    prize: 'Mystery Featured Jersey',
    image: 'https://cdn.shopify.com/s/files/1/0869/8052/6405/files/barcelona-travis-scott-2024-away-shirt-8764442.jpg',
    ticketPrice: 3.99,
    value: 47.99,
    highlight: false,
  },
  {
    type: 'special',
    label: 'Special Edition',
    prize: 'Mystery Special Edition Jersey',
    image: '/jerseys/external/2011-12-real-madrid-third-shirt-1.jpg',
    ticketPrice: 4.99,
    value: 59.99,
    highlight: false,
  },
  {
    type: 'world-cup',
    label: 'World Cup 2026',
    prize: 'Mystery 2026 World Cup Jersey',
    image: '/jerseys/external/uruguay-world-cup-away-shirt-2026-1.jpg',
    ticketPrice: 2.99,
    value: 39.99,
    highlight: false,
  },
  {
    type: 'any',
    label: 'Wildcard Draw',
    prize: 'Any Jersey from the Store',
    image: '/jerseys/external/al-hilal-away-shirt-2023-24-1.jpg',
    ticketPrice: 1.99,
    value: 34.99,
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

function MiniCard({ giveaway, email }: { giveaway: typeof GIVEAWAYS[0]; email: string }) {
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
    if (maxQty === 0) { setError('Max tickets entered'); return; }
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
    <div className="border border-brand-gray-light hover:border-black transition-colors group">
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden relative bg-zinc-100">
        <img
          src={giveaway.image}
          alt={giveaway.prize}
          className="w-full h-full object-cover grayscale blur-[2px] brightness-75 group-hover:blur-[1px] transition-all duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="bg-black/80 px-4 py-3 text-center">
            <span className="text-white font-black text-3xl">?</span>
          </div>
          <span className="text-white text-[9px] uppercase tracking-[0.3em] font-bold mt-2 drop-shadow">Mystery Prize</span>
        </div>
        <div className="absolute top-0 left-0 right-0 bg-black text-white text-[8px] uppercase tracking-[0.25em] font-bold px-3 py-1.5">
          <span>{giveaway.label}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-2xl font-black">£{giveaway.ticketPrice.toFixed(2)}</p>
            <p className="text-[9px] uppercase tracking-widest text-brand-gray-dark">per ticket</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{Math.round(giveaway.value / giveaway.ticketPrice)}x value</p>
            {currentTickets !== null && currentTickets > 0 && (
              <p className="text-[9px] text-brand-gray-dark">{currentTickets}/3 tickets entered</p>
            )}
          </div>
        </div>

        {maxQty > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex border border-brand-gray-light flex-1">
                {[1, 2, 3].filter(n => n <= maxQty).map(n => (
                  <button
                    key={n}
                    onClick={() => setQty(n)}
                    className={`flex-1 py-2 text-xs font-bold transition-all ${qty === n ? 'bg-black text-white' : 'hover:bg-zinc-100'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-brand-gray-dark font-bold w-16 text-right">£{(giveaway.ticketPrice * qty).toFixed(2)}</span>
            </div>
            {error && <p className="text-red-500 text-[10px]">{error}</p>}
            <button
              onClick={handleEnter}
              disabled={loading}
              className="w-full py-2.5 bg-black text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:opacity-80 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Ticket size={11} /> Enter Draw</>}
            </button>
          </div>
        ) : (
          <div className="text-center py-2.5 border border-emerald-400 text-emerald-600 text-[10px] uppercase tracking-widest font-bold">
            Max tickets entered ✓
          </div>
        )}
      </div>
    </div>
  );
}

function HeroCard({ giveaway, email, emailSet }: { giveaway: typeof GIVEAWAYS[0]; email: string; emailSet: boolean }) {
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
    <div className="flex flex-col md:flex-row border border-brand-gray-light overflow-hidden">
      {/* Image side */}
      <div className="relative bg-zinc-100 min-h-[360px] md:w-1/2 flex-shrink-0">
        <img
          src={giveaway.image}
          alt={giveaway.prize}
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="absolute top-4 left-4 bg-black text-white text-[9px] uppercase tracking-[0.25em] px-3 py-1.5 font-bold">
          ⭐ Best Seller
        </div>
        <div className="absolute bottom-4 left-4 bg-black/80 text-white px-4 py-2">
          <p className="text-[8px] uppercase tracking-widest opacity-60 mb-0.5">Retail value</p>
          <p className="text-lg font-black">£{giveaway.value.toFixed(2)}</p>
        </div>
      </div>

      {/* Content side */}
      <div className="p-8 flex flex-col justify-center bg-white md:w-1/2 min-w-0">
        <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gray-dark mb-2">{giveaway.label}</p>
        <h2 className="text-2xl font-black uppercase tracking-tight leading-tight mb-2">{giveaway.prize}</h2>
        <p className="text-brand-gray-dark text-sm mb-6">
          Win a jersey worth <strong className="text-black">£{giveaway.value.toFixed(2)}</strong> for just <strong className="text-black">£{giveaway.ticketPrice.toFixed(2)}</strong> a ticket. That's {Math.round(giveaway.value / giveaway.ticketPrice)}x your money back.
        </p>

        {currentTickets !== null && currentTickets > 0 && (
          <div className="flex items-center gap-2 mb-4 text-emerald-600">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] uppercase tracking-widest font-bold">{currentTickets} ticket{currentTickets > 1 ? 's' : ''} entered for this draw</span>
          </div>
        )}

        {maxQty > 0 ? (
          <div className="space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-brand-gray-dark mb-2">Number of tickets (max 3)</p>
              <div className="flex gap-2">
                {[1, 2, 3].filter(n => n <= maxQty).map(n => (
                  <button
                    key={n}
                    onClick={() => setQty(n)}
                    className={`w-12 h-12 text-sm font-black border transition-all ${qty === n ? 'bg-black text-white border-black' : 'border-brand-gray-light hover:border-black'}`}
                  >
                    {n}
                  </button>
                ))}
                <div className="flex items-center ml-2">
                  <span className="text-xl font-black">£{(giveaway.ticketPrice * qty).toFixed(2)}</span>
                </div>
              </div>
            </div>
            {!emailSet && <p className="text-[11px] text-brand-gray-dark">Enter your email below to unlock draws</p>}
            {error && <p className="text-red-500 text-[11px]">{error}</p>}
            <button
              onClick={handleEnter}
              disabled={loading || !emailSet}
              className="w-full py-4 bg-black text-white text-[11px] uppercase tracking-[0.25em] font-bold hover:opacity-80 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {loading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><Ticket size={13} /> Enter the Draw — £{(giveaway.ticketPrice * qty).toFixed(2)}</>
              }
            </button>
          </div>
        ) : (
          <div className="text-center py-4 border border-emerald-400 text-emerald-600 text-[11px] uppercase tracking-widest font-bold">
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

  const [bestSeller, ...otherDraws] = GIVEAWAYS;

  return (
    <main className="pt-28 pb-24 overflow-x-hidden">

      {/* Hero Banner */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold hover:opacity-60 transition-opacity mb-10 text-white/60 hover:text-white"
          >
            <ChevronLeft size={14} /> Back
          </button>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Trophy size={20} className="text-yellow-400" />
                <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-white/60">Weekly Jersey Giveaway</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight leading-none mb-4">
                Win a<br />
                <span className="text-yellow-400">Premium</span><br />
                Jersey.
              </h1>
              <p className="text-white/50 text-sm max-w-sm">
                Tickets from £1.99. Drawn every Friday at 8pm UK. Winner contacted by email and announced on our socials.
              </p>
            </div>

            {/* Countdown */}
            <div className="flex-shrink-0">
              <p className="text-[9px] uppercase tracking-[0.35em] text-white/40 mb-3 font-bold">Draw closes in</p>
              <div className="flex gap-3">
                {[{ v: d, l: 'Days' }, { v: h, l: 'Hours' }, { v: m, l: 'Mins' }, { v: s, l: 'Secs' }].map(({ v, l }) => (
                  <div key={l} className="flex flex-col items-center bg-white/10 px-4 py-3 min-w-[60px]">
                    <span className="text-3xl font-black tabular-nums leading-none">{String(v).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase tracking-widest text-white/40 mt-1">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="border-b border-brand-gray-light bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex flex-wrap gap-6 md:gap-12 items-center justify-center md:justify-start">
          {[
            { icon: <Zap size={12} />, text: 'Drawn every Friday 8pm UK' },
            { icon: <Users size={12} />, text: 'Max 3 tickets per person' },
            { icon: <Gift size={12} />, text: 'Winner gets free jersey' },
            { icon: <Trophy size={12} />, text: 'Results on our socials' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-brand-gray-dark font-bold">
              {icon} {text}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Email gate */}
        <div className="py-10 border-b border-brand-gray-light">
          {!emailSet ? (
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex-1 max-w-md">
                <p className="text-[11px] uppercase tracking-widest font-bold mb-2">Enter your email — we'll contact you if you win</p>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && email && setEmailSet(true)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-brand-gray-light text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <button
                onClick={() => email && setEmailSet(true)}
                className="px-8 py-3 bg-black text-white text-[10px] uppercase tracking-[0.25em] font-bold hover:opacity-80 transition-opacity whitespace-nowrap"
              >
                Get Started →
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-[11px] uppercase tracking-widest font-bold">Entering as <span className="text-black">{email}</span></p>
              <button onClick={() => setEmailSet(false)} className="text-[10px] text-brand-gray-dark underline hover:text-black">Change</button>
            </div>
          )}
        </div>

        {/* Star Prize */}
        <div className="pt-12 pb-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-yellow-500 text-lg">⭐</span>
            <h2 className="text-[11px] uppercase tracking-[0.35em] font-black">This Week's Star Prize</h2>
            <div className="flex-1 h-px bg-brand-gray-light" />
            <span className="text-[10px] uppercase tracking-widest text-brand-gray-dark">£{bestSeller.ticketPrice.toFixed(2)} / ticket</span>
          </div>
          <HeroCard giveaway={bestSeller} email={emailSet ? email : ''} emailSet={emailSet} />
        </div>

        {/* Other draws */}
        <div className="pb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-[11px] uppercase tracking-[0.35em] font-black">More Draws This Week</h2>
            <div className="flex-1 h-px bg-brand-gray-light" />
            <span className="text-[10px] uppercase tracking-widest text-brand-gray-dark">From £1.99</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherDraws.map(g => (
              <MiniCard key={g.type} giveaway={g} email={emailSet ? email : ''} />
            ))}
          </div>
        </div>

        {/* Bottom trust note */}
        <div className="border-t border-brand-gray-light pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-brand-gray-dark uppercase tracking-widest text-center sm:text-left">
            Winners contacted by email within 24 hours of the draw. One winner per draw per week.
          </p>
          <p className="text-[10px] text-brand-gray-dark uppercase tracking-widest whitespace-nowrap">
            5 draws · Every Friday · 8pm UK
          </p>
        </div>
      </div>
    </main>
  );
}
