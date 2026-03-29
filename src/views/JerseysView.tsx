import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Search } from 'lucide-react';
import { JERSEY_CATEGORIES, INTERNATIONAL_CATEGORY_IDS } from '../constants';

interface JerseysViewProps {
  onCategoryClick: (categoryId: string) => void;
  onBack: () => void;
  filter?: 'club' | 'international';
}

export default function JerseysView({ onCategoryClick, onBack, filter }: JerseysViewProps) {
  const [query, setQuery] = useState('');

  const baseCategories = filter === 'club'
    ? JERSEY_CATEGORIES.filter(c => !INTERNATIONAL_CATEGORY_IDS.has(c.id))
    : filter === 'international'
    ? JERSEY_CATEGORIES.filter(c => INTERNATIONAL_CATEGORY_IDS.has(c.id))
    : JERSEY_CATEGORIES;

  const filtered = query.trim()
    ? baseCategories.filter(cat =>
        cat.name.toLowerCase().includes(query.toLowerCase())
      )
    : baseCategories;

  const title = filter === 'club' ? 'Shop by Club' : filter === 'international' ? 'Shop by Country' : 'Jerseys';
  const subtitle = filter === 'club' ? 'Browse every club kit.' : filter === 'international' ? 'Browse every national team kit.' : 'Shop by club or country. Find every kit from the world\'s top sides.';

  return (
    <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12 min-h-screen">
      <div className="mb-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold mb-6 hover:opacity-60 transition-opacity"
        >
          <ChevronLeft size={14} /> Back to Home
        </button>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight uppercase">{title}</h1>
        <p className="text-brand-gray-dark text-sm mt-4">{subtitle}</p>
      </div>

      {/* Search */}
      <div className="relative mb-12 max-w-md">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-dark" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search club or country..."
          className="w-full pl-10 pr-4 py-3 border border-brand-gray-light text-sm focus:outline-none focus:border-brand-black rounded-sm"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filtered.map((cat) => (
            <motion.div
              key={cat.id}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -3 }}
              onClick={() => onCategoryClick(cat.id)}
              className="flex flex-col items-center gap-3 cursor-pointer group"
            >
              <div className="w-full aspect-square rounded-xl bg-[#f0f0f0] flex items-center justify-center overflow-hidden p-4 group-hover:shadow-md transition-shadow duration-200">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-center leading-tight group-hover:text-brand-gray-dark transition-colors">
                {cat.name}
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-brand-gray-dark text-sm">No results for "{query}"</p>
      )}
    </main>
  );
}
