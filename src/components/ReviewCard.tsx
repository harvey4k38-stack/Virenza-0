import { Star } from 'lucide-react';
import { Review } from '../types';

export default function ReviewCard({ review }: { review: Review; key?: string | number }) {
  return (
    <div className="bg-white border border-brand-gray-light p-8 rounded-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            className={i < review.rating ? "fill-brand-black text-brand-black" : "text-brand-gray-light"} 
          />
        ))}
      </div>
      <p className="text-brand-gray-dark italic mb-6 leading-relaxed">
        "{review.comment}"
      </p>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-brand-gray-light rounded-full flex items-center justify-center text-[10px] font-bold">
          {review.author[0]}
        </div>
        <span className="text-xs font-bold uppercase tracking-widest">
          {review.author}
        </span>
      </div>
    </div>
  );
}
