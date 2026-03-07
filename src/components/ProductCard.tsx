import { motion } from 'motion/react';
import { Product } from '../types';
import { ShoppingBag, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  key?: string | number;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group relative bg-white border border-brand-gray-light rounded-sm overflow-hidden transition-all duration-500 hover:shadow-xl"
      onClick={() => onClick(product)}
    >
      <div className="aspect-[4/5] overflow-hidden bg-brand-gray-light/20">
        <motion.img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={10} 
                className={i < Math.floor(product.rating) ? "fill-brand-black text-brand-black" : "text-brand-gray-light"} 
              />
            ))}
          </div>
          <span className="text-[10px] font-bold tracking-tighter">{product.rating}</span>
          <span className="text-[10px] text-brand-gray-dark ml-1">({product.reviewCount})</span>
        </div>

        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-bold tracking-widest uppercase text-brand-black">
            {product.name}
          </h3>
          <span className="text-sm font-medium text-brand-gray-dark">
            £{product.price.toFixed(2)}
          </span>
        </div>
        
        <p className="text-xs text-brand-gray-dark mb-4 line-clamp-1">
          {product.category === 'chains' ? 'Premium Silver Chain' : 'Refined Wristwear'}
        </p>

        <button 
          className="w-full py-2 bg-brand-black text-white text-[10px] uppercase tracking-[0.2em] font-bold opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 flex items-center justify-center gap-2"
        >
          <ShoppingBag size={12} />
          View Details
        </button>
      </div>
      
      {product.isBestSeller && (
        <div className="absolute top-4 left-4 bg-brand-black text-white text-[10px] uppercase tracking-widest px-3 py-1 font-bold">
          Best Seller
        </div>
      )}
    </motion.div>
  );
}
