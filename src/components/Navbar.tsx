import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Menu, X, Search, ChevronDown, Crown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency, CURRENCIES, type Currency } from '../context/CurrencyContext';
import { INTERNATIONAL_JERSEY_CATEGORIES, CLUB_JERSEY_CATEGORIES, LEAGUE_CATEGORIES } from '../constants';

type MegaMenu = 'countries' | 'clubs' | 'leagues' | 'accessories' | null;

const getSaleTarget = () => {
  const now = new Date();
  // Reliably get current UK time components using Intl (works for any user timezone)
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false,
  }).formatToParts(now);
  const ukHour = parseInt(parts.find(p => p.type === 'hour')!.value);
  const ukMin  = parseInt(parts.find(p => p.type === 'minute')!.value);
  const ukSec  = parseInt(parts.find(p => p.type === 'second')!.value);
  const msSinceMidnightUK = (ukHour * 3600 + ukMin * 60 + ukSec) * 1000;
  // Next 12-hour mark: noon or midnight
  const msUntilTarget = msSinceMidnightUK < 12 * 3600 * 1000
    ? 12 * 3600 * 1000 - msSinceMidnightUK
    : 24 * 3600 * 1000 - msSinceMidnightUK;
  return Date.now() + msUntilTarget;
};
let saleTarget = getSaleTarget();

const fmtCountdown = () => {
  const diff = saleTarget - Date.now();
  if (diff <= 0) { saleTarget = getSaleTarget(); }
  const d = Math.max(0, saleTarget - Date.now());
  const h = Math.floor(d / 3600000);
  const m = Math.floor((d % 3600000) / 60000);
  const s = Math.floor((d % 60000) / 1000);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
};

export default function Navbar({ onHome, onNavigate, onCart, onAbout, onVip, onGiveaway, logo }: {
  onHome: () => void,
  onNavigate: (cat: string) => void,
  onCart: () => void,
  onAbout: () => void,
  onVip: () => void,
  onGiveaway: () => void,
  logo: string | null
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<'countries' | 'clubs' | 'leagues' | 'accessories' | null>(null);
  const [openMenu, setOpenMenu] = useState<MegaMenu>(null);
  const [countrySearch, setCountrySearch] = useState('');
  const [clubSearch, setClubSearch] = useState('');
  const navRef = useRef<HTMLDivElement>(null);
  const { cartCount } = useCart();
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navigate = (id: string) => {
    onNavigate(id);
    setOpenMenu(null);
    setIsMobileMenuOpen(false);
  };

  const [leagueSearch, setLeagueSearch] = useState('');
  const [countdown, setCountdown] = useState(fmtCountdown);

  useEffect(() => {
    const id = setInterval(() => setCountdown(fmtCountdown()), 1000);
    return () => clearInterval(id);
  }, []);

  const toggle = (menu: MegaMenu) => {
    setOpenMenu(o => o === menu ? null : menu);
    if (menu !== 'countries') setCountrySearch('');
    if (menu !== 'clubs') setClubSearch('');
    if (menu !== 'leagues') setLeagueSearch('');
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      {/* Sale Banner */}
      <div className="bg-brand-black text-white text-center py-2 px-4">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold">
          🔥 Sale — 20% Off All Jerseys &nbsp;·&nbsp; Ends in <span className="tabular-nums">{countdown}</span> &nbsp;·&nbsp;{' '}
          <button onClick={onGiveaway} className="underline underline-offset-2 hover:opacity-80 transition-opacity">
            🏆 Win a Free Jersey
          </button>
        </p>
      </div>

      <div className={`transition-all duration-500 ${isScrolled ? 'py-4' : 'py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center gap-8">

          {/* Logo — far left */}
          <button
            onClick={onHome}
            className="flex items-center gap-3 hover:opacity-70 transition-opacity shrink-0"
          >
            {logo && (
              <img src={logo} alt="Virenza Logo" className="w-8 h-8 object-contain invert" referrerPolicy="no-referrer" />
            )}
            <span className="text-2xl font-bold tracking-[0.4em] uppercase">Virenza</span>
          </button>

          {/* Nav — centre */}
          <div className="hidden md:flex gap-6 items-center flex-1 justify-center">

            <button
              onClick={() => navigate('jerseys')}
              className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-brand-gray-dark transition-colors relative group whitespace-nowrap"
            >
              All Jerseys
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-black transition-all duration-300 group-hover:w-full" />
            </button>

            {/* Countries dropdown */}
            <div className="relative">
              <button
                onClick={() => toggle('countries')}
                className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-brand-gray-dark transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                Countries
                <ChevronDown size={10} className={`transition-transform duration-200 ${openMenu === 'countries' ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Clubs dropdown */}
            <div className="relative">
              <button
                onClick={() => toggle('clubs')}
                className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-brand-gray-dark transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                Clubs
                <ChevronDown size={10} className={`transition-transform duration-200 ${openMenu === 'clubs' ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Leagues dropdown */}
            <div className="relative">
              <button
                onClick={() => toggle('leagues')}
                className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-brand-gray-dark transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                Leagues
                <ChevronDown size={10} className={`transition-transform duration-200 ${openMenu === 'leagues' ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <button
              onClick={() => navigate('world-cup-2026')}
              className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-brand-gray-dark transition-colors relative group whitespace-nowrap"
            >
              World Cup '26
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-black transition-all duration-300 group-hover:w-full" />
            </button>

            <button
              onClick={onAbout}
              className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-brand-gray-dark transition-colors relative group whitespace-nowrap"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-black transition-all duration-300 group-hover:w-full" />
            </button>
          </div>

          {/* Right icons */}
          <div className="flex gap-6 items-center ml-auto">
            <button
              onClick={onVip}
              className="hidden sm:flex items-center gap-1.5 bg-black text-white px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] font-bold hover:opacity-80 transition-opacity whitespace-nowrap"
            >
              <Crown size={11} /> VIP
            </button>
            <button className="hover:opacity-70 transition-opacity hidden sm:block">
              <Search size={18} />
            </button>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value as Currency)}
              className="text-[10px] uppercase tracking-widest font-bold bg-transparent border-none outline-none cursor-pointer hover:opacity-70 transition-opacity hidden sm:block"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.code}</option>
              ))}
            </select>
            <button onClick={onCart} className="hover:opacity-70 transition-opacity relative">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-black text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="md:hidden hover:opacity-70 transition-opacity"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Countries mega-dropdown */}
      <AnimatePresence>
        {openMenu === 'countries' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 w-full bg-white border-t border-brand-gray-light shadow-xl z-40"
          >
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
              <div className="flex items-center justify-between mb-6">
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-gray-dark">International</p>
                <input
                  autoFocus
                  type="text"
                  placeholder="Search country..."
                  value={countrySearch}
                  onChange={e => setCountrySearch(e.target.value)}
                  className="text-[11px] border border-brand-gray-light rounded-sm px-3 py-1.5 outline-none focus:border-brand-black transition-colors w-44 placeholder:text-brand-gray-dark/50"
                />
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                {INTERNATIONAL_JERSEY_CATEGORIES.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase())).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => navigate(cat.id)}
                    className="group flex flex-col items-center gap-2 text-center"
                  >
                    <div className="w-full aspect-square rounded-lg bg-[#f0f0f0] flex items-center justify-center p-1.5">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-bold leading-tight group-hover:text-brand-gray-dark transition-colors">
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leagues mega-dropdown */}
      <AnimatePresence>
        {openMenu === 'leagues' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 w-full bg-white border-t border-brand-gray-light shadow-xl z-40"
          >
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
              <div className="flex items-center justify-between mb-6">
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-gray-dark">Leagues</p>
                <input
                  autoFocus
                  type="text"
                  placeholder="Search league..."
                  value={leagueSearch}
                  onChange={e => setLeagueSearch(e.target.value)}
                  className="text-[11px] border border-brand-gray-light rounded-sm px-3 py-1.5 outline-none focus:border-brand-black transition-colors w-44 placeholder:text-brand-gray-dark/50"
                />
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                {LEAGUE_CATEGORIES.filter(l => l.name.toLowerCase().includes(leagueSearch.toLowerCase()) || l.country.toLowerCase().includes(leagueSearch.toLowerCase())).map(league => (
                  <button
                    key={league.id}
                    onClick={() => navigate(league.id)}
                    className="group flex flex-col items-center gap-2 text-center"
                  >
                    <div className="w-full aspect-square rounded-lg bg-[#f0f0f0] flex items-center justify-center p-1.5">
                      <img
                        src={league.image}
                        alt={league.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-bold leading-tight group-hover:text-brand-gray-dark transition-colors">
                      {league.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clubs mega-dropdown */}
      <AnimatePresence>
        {openMenu === 'clubs' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 w-full bg-white border-t border-brand-gray-light shadow-xl z-40"
          >
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
              <div className="flex items-center justify-between mb-6">
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-gray-dark">Clubs</p>
                <input
                  autoFocus
                  type="text"
                  placeholder="Search club..."
                  value={clubSearch}
                  onChange={e => setClubSearch(e.target.value)}
                  className="text-[11px] border border-brand-gray-light rounded-sm px-3 py-1.5 outline-none focus:border-brand-black transition-colors w-44 placeholder:text-brand-gray-dark/50"
                />
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                {CLUB_JERSEY_CATEGORIES.filter(c => c.name.toLowerCase().includes(clubSearch.toLowerCase())).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => navigate(cat.id)}
                    className="group flex flex-col items-center gap-2 text-center"
                  >
                    <div className="w-full aspect-square rounded-lg bg-[#f0f0f0] flex items-center justify-center p-1.5">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-bold leading-tight group-hover:text-brand-gray-dark transition-colors">
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden bg-white overflow-hidden border-b border-brand-gray-light"
      >
        <div className="px-6 py-8 flex flex-col gap-6">
          <button
            className="text-xs uppercase tracking-[0.2em] font-bold text-left"
            onClick={() => navigate('jerseys')}
          >
            All Jerseys
          </button>

          {/* Countries accordion */}
          <div>
            <button
              className="text-xs uppercase tracking-[0.2em] font-bold text-left w-full flex justify-between items-center"
              onClick={() => setMobileExpanded(e => e === 'countries' ? null : 'countries')}
            >
              Countries
              <ChevronDown size={12} className={`transition-transform ${mobileExpanded === 'countries' ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {mobileExpanded === 'countries' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-2 pt-4 pl-3 border-l border-brand-gray-light">
                    {INTERNATIONAL_JERSEY_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => navigate(cat.id)}
                        className="text-xs uppercase tracking-[0.15em] font-bold text-left hover:text-brand-gray-dark transition-colors py-1"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Clubs accordion */}
          <div>
            <button
              className="text-xs uppercase tracking-[0.2em] font-bold text-left w-full flex justify-between items-center"
              onClick={() => setMobileExpanded(e => e === 'clubs' ? null : 'clubs')}
            >
              Clubs
              <ChevronDown size={12} className={`transition-transform ${mobileExpanded === 'clubs' ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {mobileExpanded === 'clubs' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-2 pt-4 pl-3 border-l border-brand-gray-light max-h-64 overflow-y-auto">
                    {CLUB_JERSEY_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => navigate(cat.id)}
                        className="text-xs uppercase tracking-[0.15em] font-bold text-left hover:text-brand-gray-dark transition-colors py-1"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Leagues accordion */}
          <div>
            <button
              className="text-xs uppercase tracking-[0.2em] font-bold text-left w-full flex justify-between items-center"
              onClick={() => setMobileExpanded(e => e === 'leagues' ? null : 'leagues')}
            >
              Leagues
              <ChevronDown size={12} className={`transition-transform ${mobileExpanded === 'leagues' ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {mobileExpanded === 'leagues' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-2 pt-4 pl-3 border-l border-brand-gray-light max-h-64 overflow-y-auto">
                    {LEAGUE_CATEGORIES.map(league => (
                      <button
                        key={league.id}
                        onClick={() => navigate(league.id)}
                        className="text-xs uppercase tracking-[0.15em] font-bold text-left hover:text-brand-gray-dark transition-colors py-1"
                      >
                        {league.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>


          <button
            className="text-xs uppercase tracking-[0.2em] font-bold text-left"
            onClick={() => navigate('world-cup-2026')}
          >
            World Cup '26
          </button>

          <button
            className="text-xs uppercase tracking-[0.2em] font-bold text-left"
            onClick={() => { onAbout(); setIsMobileMenuOpen(false); }}
          >
            About
          </button>
          <button
            className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-left bg-black text-white px-4 py-2.5 w-full"
            onClick={() => { onVip(); setIsMobileMenuOpen(false); }}
          >
            <Crown size={13} /> VIP Membership
          </button>
          <button
            className="text-xs uppercase tracking-[0.2em] font-bold text-left"
            onClick={() => { onGiveaway(); setIsMobileMenuOpen(false); }}
          >
            🏆 Weekly Giveaway
          </button>
        </div>
      </motion.div>
    </nav>
  );
}
