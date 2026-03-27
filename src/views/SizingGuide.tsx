import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

interface SizingGuideProps {
  onBack: () => void;
}

export default function SizingGuide({ onBack }: SizingGuideProps) {
  return (
    <main className="pt-32 pb-24 max-w-2xl mx-auto px-6 md:px-12">
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
        className="flex flex-col gap-8"
      >
        <img
          src="/size-guide-v7.png"
          alt="Football Jersey Size Guide"
          className="w-full rounded-2xl"
        />
        <img
          src="/size-guide-v8.png"
          alt="Size and Delivery Info"
          className="w-full rounded-2xl"
        />
      </motion.div>
    </main>
  );
}
