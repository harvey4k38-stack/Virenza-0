import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

interface AboutProps {
  onBack: () => void;
}

export default function About({ onBack }: AboutProps) {
  return (
    <main className="pt-32 pb-24 max-w-4xl mx-auto px-6 md:px-12">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold mb-12 hover:opacity-60 transition-opacity"
      >
        <ChevronLeft size={14} /> Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl mb-12 text-center">About Virenza</h1>
        
        <div className="space-y-12 text-brand-gray-dark max-w-2xl mx-auto leading-relaxed">
          <section>
            <h2 className="text-brand-black text-xs uppercase tracking-[0.3em] font-bold mb-4">The Standard</h2>
            <p>
              Virenza was established to provide a refined alternative in men's jewelry. We focus on the essentials: material integrity, precise proportions, and a finish that lasts.
            </p>
          </section>

          <section>
            <h2 className="text-brand-black text-xs uppercase tracking-[0.3em] font-bold mb-4">Curation</h2>
            <p>
              We maintain a intentionally limited collection. By focusing on a small number of essential pieces, we ensure that every item meets our rigorous standards for quality and longevity. We choose quality over quantity, every time.
            </p>
          </section>

          <section>
            <h2 className="text-brand-black text-xs uppercase tracking-[0.3em] font-bold mb-4">Design Philosophy</h2>
            <p>
              Our aesthetic is rooted in minimalism. We avoid unnecessary ornamentation, focusing instead on the weight and feel of each piece. The result is jewelry that complements the wearer rather than defining them.
            </p>
          </section>

          <section>
            <h2 className="text-brand-black text-xs uppercase tracking-[0.3em] font-bold mb-4">Direct</h2>
            <p>
              By operating independently, we maintain control over our production and pricing. No middlemen, no inflated markups. Just high-quality jewelry delivered directly to you.
            </p>
          </section>
        </div>

        <div className="mt-24 border-t border-brand-gray-light pt-12 text-center">
          <p className="text-[10px] uppercase tracking-widest font-bold text-brand-gray-dark">
            Virenza &copy; {new Date().getFullYear()}
          </p>
        </div>
      </motion.div>
    </main>
  );
}
