import { PRODUCTS, LEAGUE_CATEGORIES, LEAGUE_TO_CLUBS, INTERNATIONAL_CATEGORY_IDS, JERSEY_CATEGORIES, FEATURED_PRODUCT_IDS, WC_2026_FEATURED_IDS } from '../constants';
import ProductCard from '../components/ProductCard';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { Product } from '../types';

interface JerseysViewProps {
  onCategoryClick: (categoryId: string) => void;
  onProductClick: (product: Product) => void;
  onBack: () => void;
  filter?: 'club' | 'international';
}

export default function JerseysView({ onCategoryClick, onProductClick, onBack, filter }: JerseysViewProps) {
  if (filter === 'club' || filter === 'international') {
    const baseCategories = filter === 'club'
      ? JERSEY_CATEGORIES.filter(c => !INTERNATIONAL_CATEGORY_IDS.has(c.id))
      : JERSEY_CATEGORIES.filter(c => INTERNATIONAL_CATEGORY_IDS.has(c.id));

    const title = filter === 'club' ? 'Shop by Club' : 'Shop by Country';

    return (
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12 min-h-screen">
        <div className="mb-10">
          <button onClick={onBack} className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold mb-6 hover:opacity-60 transition-opacity">
            <ChevronLeft size={14} /> Back
          </button>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight uppercase">{title}</h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {baseCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onCategoryClick(cat.id)}
              className="flex flex-col items-center gap-3 cursor-pointer group"
            >
              <div className="w-full aspect-square rounded-xl bg-[#f0f0f0] flex items-center justify-center overflow-hidden p-4 group-hover:shadow-md transition-shadow duration-200">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-center leading-tight">{cat.name}</p>
            </div>
          ))}
        </div>
      </main>
    );
  }

  const scrollSection = (label: string, sublabel: string, route: string, products: Product[]) => (
    <section key={route} className="py-8 border-t border-brand-gray-light/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-5">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-1 text-brand-gray-dark">{sublabel}</p>
            <h2 className="text-xl">{label}</h2>
          </div>
          <button onClick={() => onCategoryClick(route)} className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:gap-4 transition-all group shrink-0">
            View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
      <div className="flex gap-5 overflow-x-auto px-6 md:px-12 pb-3 scrollbar-hide snap-x snap-mandatory">
        {products.map((product) => (
          <div key={product.id} className="snap-start shrink-0 w-[220px] sm:w-[260px]">
            <ProductCard product={product} onClick={onProductClick} />
          </div>
        ))}
        <div className="snap-start shrink-0 w-[160px] flex items-center justify-center">
          <button onClick={() => onCategoryClick(route)} className="flex flex-col items-center gap-3 group">
            <div className="w-14 h-14 rounded-full border-2 border-brand-black flex items-center justify-center group-hover:bg-brand-black transition-colors">
              <ArrowRight size={18} className="group-hover:text-white transition-colors" />
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-center">View All</span>
          </button>
        </div>
      </div>
    </section>
  );

  const featuredProducts = FEATURED_PRODUCT_IDS.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean) as Product[];
  const wc2026Products = WC_2026_FEATURED_IDS.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean) as Product[];
  const specialProducts = PRODUCTS.filter(p => p.name.toLowerCase().includes('special') && p.category.startsWith('jersey-'));
  const retroProducts = PRODUCTS.filter(p => p.name.toLowerCase().includes('retro') && p.category.startsWith('jersey-'));

  // Full jerseys hub page
  return (
    <main className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold mb-6 hover:opacity-60 transition-opacity">
          <ChevronLeft size={14} /> Back
        </button>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight uppercase mb-3">Shop Jerseys</h1>
        <p className="text-brand-gray-dark text-sm">Every club. Every country. Every era.</p>
      </div>

      {scrollSection('Featured Jerseys', 'Hand Picked', 'jerseys', featuredProducts)}
      {scrollSection('Special Jerseys', 'Exclusive Editions', 'special-jerseys', specialProducts)}
      {scrollSection('2026 World Cup Kits', 'FIFA World Cup', 'world-cup-2026', wc2026Products)}

      {/* League sections */}
      {LEAGUE_CATEGORIES.map((league) => {
        const clubIds = new Set(LEAGUE_TO_CLUBS[league.id] ?? []);
        const kits = PRODUCTS.filter(p => clubIds.has(p.category));
        if (kits.length === 0) return null;
        return (
          <section key={league.id} className="py-8 border-t border-brand-gray-light/50">
            <div className="max-w-7xl mx-auto px-6 md:px-12 mb-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img src={league.image} alt={league.name} className="w-8 h-8 object-contain" />
                  <h2 className="text-xl">{league.name}</h2>
                </div>
                <button
                  onClick={() => onCategoryClick(league.id.replace('league-', 'league-clubs-'))}
                  className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:gap-4 transition-all group shrink-0"
                >
                  View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            <div className="flex gap-5 overflow-x-auto px-6 md:px-12 pb-3 scrollbar-hide snap-x snap-mandatory">
              {kits.map((product) => (
                <div key={product.id} className="snap-start shrink-0 w-[220px] sm:w-[260px]">
                  <ProductCard product={product} onClick={onProductClick} />
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* International section */}
      <section className="py-8 border-t border-brand-gray-light/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-5">
          <div className="flex justify-between items-center">
            <h2 className="text-xl">International</h2>
            <button
              onClick={() => onCategoryClick('country-jerseys')}
              className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:gap-4 transition-all group shrink-0"
            >
              View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        <div className="flex gap-5 overflow-x-auto px-6 md:px-12 pb-3 scrollbar-hide snap-x snap-mandatory">
          {PRODUCTS.filter(p => INTERNATIONAL_CATEGORY_IDS.has(p.category)).slice(0, 20).map((product) => (
            <div key={product.id} className="snap-start shrink-0 w-[220px] sm:w-[260px]">
              <ProductCard product={product} onClick={onProductClick} />
            </div>
          ))}
          <div className="snap-start shrink-0 w-[160px] flex items-center justify-center">
            <button onClick={() => onCategoryClick('country-jerseys')} className="flex flex-col items-center gap-3 group">
              <div className="w-14 h-14 rounded-full border-2 border-brand-black flex items-center justify-center group-hover:bg-brand-black transition-colors">
                <ArrowRight size={18} className="group-hover:text-white transition-colors" />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-center">View All</span>
            </button>
          </div>
        </div>
      </section>

      {scrollSection('Retro Jerseys', 'Classic Kits', 'retro-jerseys', retroProducts)}
    </main>
  );
}
