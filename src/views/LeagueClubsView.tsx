import { JERSEY_CATEGORIES, LEAGUE_TO_CLUBS, LEAGUE_CATEGORIES } from '../constants';
import { ChevronLeft } from 'lucide-react';

interface LeagueClubsViewProps {
  leagueId: string;
  onClubClick: (clubId: string) => void;
  onBack: () => void;
}

export default function LeagueClubsView({ leagueId, onClubClick, onBack }: LeagueClubsViewProps) {
  const league = LEAGUE_CATEGORIES.find(l => l.id === leagueId);
  const clubIds = new Set(LEAGUE_TO_CLUBS[leagueId] ?? []);
  const clubs = JERSEY_CATEGORIES.filter(c => clubIds.has(c.id));

  return (
    <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12 min-h-screen">
      <div className="mb-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold mb-6 hover:opacity-60 transition-opacity"
        >
          <ChevronLeft size={14} /> Back
        </button>
        {league && (
          <div className="flex items-center gap-4 mb-3">
            <img src={league.image} alt={league.name} className="w-10 h-10 object-contain" />
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight uppercase">{league.name}</h1>
          </div>
        )}
        <p className="text-brand-gray-dark text-sm">Select a club to browse their kits.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {clubs.map((club) => (
          <div
            key={club.id}
            onClick={() => onClubClick(club.id)}
            className="flex flex-col items-center gap-3 cursor-pointer group"
          >
            <div className="w-full aspect-square rounded-xl bg-[#f0f0f0] flex items-center justify-center overflow-hidden p-4 group-hover:shadow-md transition-shadow duration-200">
              <img src={club.image} alt={club.name} className="w-full h-full object-contain" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-center leading-tight group-hover:text-brand-gray-dark transition-colors">
              {club.name}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
