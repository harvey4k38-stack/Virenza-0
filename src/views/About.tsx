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
            <h2 className="text-brand-black text-xs uppercase tracking-[0.3em] font-bold mb-4">Who We Are</h2>
            <p>
              Virenza is a premium lifestyle brand built for men who care about what they wear. We started with minimal jewelry and have expanded into football — stocking premium England retro jerseys and limited-edition kits alongside our chain and bracelet collection.
            </p>
          </section>

          <section>
            <h2 className="text-brand-black text-xs uppercase tracking-[0.3em] font-bold mb-4">Jerseys</h2>
            <p>
              Our jersey range covers everything from iconic retro England kits to the latest limited-edition releases. Whether it's Gascoigne's Italia 90 shirt, the Euro 96 classic, or the Palace x Nike 2026 World Cup collaboration — we stock the kits that matter.
            </p>
          </section>

          <section>
            <h2 className="text-brand-black text-xs uppercase tracking-[0.3em] font-bold mb-4">Accessories</h2>
            <p>
              Our chain and bracelet collection is built on the same principle: quality over quantity. Every piece is selected for its material integrity, precise proportions, and a finish that lasts — designed to complement what you wear on and off the pitch.
            </p>
          </section>

          <section>
            <h2 className="text-brand-black text-xs uppercase tracking-[0.3em] font-bold mb-4">Direct</h2>
            <p>
              By operating independently, we maintain full control over our selection and pricing. No middlemen, no inflated markups — just quality products delivered directly to you.
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
