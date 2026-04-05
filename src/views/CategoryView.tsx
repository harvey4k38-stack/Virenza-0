import { motion } from 'motion/react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { ChevronLeft } from 'lucide-react';

interface CategoryViewProps {
  title: string;
  products: Product[];
  onProductClick: (product: Product) => void;
  onBack: () => void;
}

export default function CategoryView({ title, products, onProductClick, onBack }: CategoryViewProps) {
  return (
    <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold mb-6 hover:opacity-60 transition-opacity"
          >
            <ChevronLeft size={14} /> Back to Home
          </button>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight uppercase">{title}</h1>
        </div>
        <p className="text-brand-gray-dark text-sm max-w-xs">
          Explore our curated selection of premium {title.toLowerCase()}, designed for the modern minimalist.
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={onProductClick}
              priority={index < 4}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center border border-dashed border-brand-gray-light rounded-sm">
          <p className="text-brand-gray-dark uppercase tracking-widest text-xs font-bold">No products found in this category.</p>
        </div>
      )}
    </main>
  );
}
