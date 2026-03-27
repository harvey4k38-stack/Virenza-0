import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { LEAGUE_CATEGORIES } from '../constants';

interface LeaguesViewProps {
  onLeagueClick: (leagueId: string) => void;
  onBack: () => void;
}

export default function LeaguesView({ onLeagueClick, onBack }: LeaguesViewProps) {
  return (
    <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12 min-h-screen">
      <div className="mb-16">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold mb-6 hover:opacity-60 transition-opacity"
        >
          <ChevronLeft size={14} /> Back to Home
        </button>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight uppercase">Leagues</h1>
        <p className="text-brand-gray-dark text-sm mt-4">Shop by competition. Find every kit from the world's top leagues.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {LEAGUE_CATEGORIES.map((league) => (
          <motion.div
            key={league.id}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => onLeagueClick(league.id)}
            className="flex flex-col items-center gap-3 cursor-pointer group"
          >
            <div className="w-full aspect-square rounded-xl bg-[#f0f0f0] flex items-center justify-center overflow-hidden p-4 group-hover:shadow-md transition-shadow duration-200">
              <img
                src={league.image}
                alt={league.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-center">
              <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-brand-gray-dark mb-0.5">{league.country}</p>
              <p className="text-[11px] font-bold uppercase tracking-wider leading-tight group-hover:text-brand-gray-dark transition-colors">{league.name}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
