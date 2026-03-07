import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import SizingGuideContent from '../components/SizingGuideContent';

interface SizingGuideProps {
  onBack: () => void;
}

export default function SizingGuide({ onBack }: SizingGuideProps) {
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
        <h1 className="text-4xl md:text-5xl mb-6 text-center">Sizing Guide</h1>
        <p className="text-brand-gray-dark text-center mb-16 max-w-2xl mx-auto">
          Finding your perfect fit is essential for comfort and style. Use our comprehensive guide below to determine the ideal size for your Virenza pieces.
        </p>

        <SizingGuideContent />
      </motion.div>
    </main>
  );
}
