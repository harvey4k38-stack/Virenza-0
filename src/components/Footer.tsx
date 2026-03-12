import { Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer({ logo, onNavigate }: { 
  logo: string | null,
  onNavigate?: (view: string) => void 
}) {
  return (
    <footer className="bg-white border-t border-brand-gray-light pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
          {/* Brand */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              {logo && (
                <img 
                  src={logo} 
                  alt="Virenza Logo" 
                  className="w-10 h-10 object-contain" 
                  referrerPolicy="no-referrer"
                />
              )}
              <h3 className="text-2xl font-bold tracking-[0.4em] uppercase">Virenza</h3>
            </div>
            <p className="text-brand-gray-dark text-sm leading-relaxed max-w-xs">
              Premium men's jewelry designed for the modern minimalist. Quality materials, refined aesthetics.
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:opacity-60 transition-opacity"><Instagram size={20} /></a>
              <a href="#" className="hover:opacity-60 transition-opacity"><Twitter size={20} /></a>
              <a href="#" className="hover:opacity-60 transition-opacity"><Facebook size={20} /></a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8">Shop</h4>
            <ul className="space-y-4">
              {[
                { name: 'Chains', view: 'chains' },
                { name: 'Bracelets', view: 'bracelets' },
                { name: 'Best Sellers', view: 'best-sellers' }
              ].map(item => (
                <li key={item.name}>
                  <button 
                    onClick={() => onNavigate?.(item.view)}
                    className="text-sm text-brand-gray-dark hover:text-brand-black transition-colors"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8">Information</h4>
            <ul className="space-y-4">
              {[
                { name: 'About Us', view: 'about' },
                { name: 'Sizing Guide', view: 'sizing-guide' }
              ].map(item => (
                <li key={item.name}>
                  <button 
                    onClick={() => onNavigate?.(item.view)}
                    className="text-sm text-brand-gray-dark hover:text-brand-black transition-colors"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8">Support</h4>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => onNavigate?.('contact')}
                  className="text-sm text-brand-gray-dark hover:text-brand-black transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('shipping-tracking')}
                  className="text-sm text-brand-gray-dark hover:text-brand-black transition-colors"
                >
                  Shipping & Tracking
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-brand-gray-light flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-widest font-bold text-brand-gray-dark">
            © {new Date().getFullYear()} Virenza. All Rights Reserved.
          </p>
          <div className="flex gap-8">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-40 grayscale" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 opacity-40 grayscale" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-40 grayscale" />
          </div>
        </div>
      </div>
    </footer>
  );
}
