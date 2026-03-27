import { motion } from 'motion/react';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency, CURRENCIES, type Currency } from '../context/CurrencyContext';

export default function Navbar({ onHome, onNavigate, onCart, onAbout, logo }: { 
  onHome: () => void, 
  onNavigate: (cat: string) => void,
  onCart: () => void,
  onAbout: () => void,
  logo: string | null
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Jerseys', id: 'jerseys' },
    { name: 'Chains', id: 'chains' },
    { name: 'Bracelets', id: 'bracelets' },
    { name: 'Best Sellers', id: 'best-sellers' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      {/* Sale Banner */}
      <div className="bg-brand-black text-white text-center py-2 px-4">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold">
          🔥 Sale — 20% Off All Jerseys &nbsp;·&nbsp; Limited Time Only &nbsp;·&nbsp; Free Worldwide Shipping
        </p>
      </div>
      <div className={`transition-all duration-500 ${isScrolled ? 'py-4' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Left: Links */}
        <div className="hidden md:flex gap-8 items-center">
          {navItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => onNavigate(item.id)}
              className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-brand-gray-dark transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-black transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
          <button 
            onClick={onAbout}
            className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-brand-gray-dark transition-colors relative group"
          >
            About
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-black transition-all duration-300 group-hover:w-full" />
          </button>
        </div>

        {/* Center: Logo */}
        <button 
          onClick={onHome}
          className="flex items-center gap-3 hover:opacity-70 transition-opacity"
        >
          {logo && (
            <img 
              src={logo} 
              alt="Virenza Logo" 
              className="w-8 h-8 object-contain invert" 
              referrerPolicy="no-referrer"
            />
          )}
          <span className="text-2xl font-bold tracking-[0.4em] uppercase">Virenza</span>
        </button>

        {/* Right: Icons */}
        <div className="flex gap-6 items-center">
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
          <button 
            onClick={onCart}
            className="hover:opacity-70 transition-opacity relative"
          >
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

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden bg-white overflow-hidden border-b border-brand-gray-light"
      >
        <div className="px-6 py-8 flex flex-col gap-6">
          {navItems.map((item) => (
            <button 
              key={item.id} 
              className="text-xs uppercase tracking-[0.2em] font-bold text-left"
              onClick={() => {
                onNavigate(item.id);
                setIsMobileMenuOpen(false);
              }}
            >
              {item.name}
            </button>
          ))}
          <button 
            className="text-xs uppercase tracking-[0.2em] font-bold text-left"
            onClick={() => {
              onAbout();
              setIsMobileMenuOpen(false);
            }}
          >
            About
          </button>
          <button 
            className="text-xs uppercase tracking-[0.2em] font-bold text-left opacity-50 cursor-not-allowed"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </button>
        </div>
      </motion.div>
    </nav>
  );
}
