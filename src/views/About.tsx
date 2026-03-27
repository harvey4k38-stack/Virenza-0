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
              Virenza is a dedicated football jersey store. We exist for one reason — to make it easy to get the kit you want, from any club or country, at a fair price. No distractions, no filler products. Just jerseys.
            </p>
          </section>

          <section>
            <h2 className="text-brand-black text-xs uppercase tracking-[0.3em] font-bold mb-4">The Range</h2>
            <p>
              We stock over 600 kits spanning every major international team and club side — from the Premier League to La Liga, Serie A to the World Cup. Whether it's the latest season shirt or a classic you've been hunting for, we've got it covered.
            </p>
          </section>

          <section>
            <h2 className="text-brand-black text-xs uppercase tracking-[0.3em] font-bold mb-4">Quality</h2>
            <p>
              Every jersey in our catalogue is premium quality — accurate colours, clean printing, and fabric that holds up wash after wash. We don't stock anything we wouldn't wear ourselves. If it doesn't meet the standard, it doesn't make the cut.
            </p>
          </section>

          <section>
            <h2 className="text-brand-black text-xs uppercase tracking-[0.3em] font-bold mb-4">Worldwide Delivery</h2>
            <p>
              We ship globally. Orders are dispatched quickly and tracked end-to-end. Wherever you are in the world, your kit will find you.
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
