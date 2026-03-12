import { Ruler, Info } from 'lucide-react';

export default function SizingGuideContent() {
  const braceletSizes = [
    { wristCm: '14 - 15.5', wristIn: '5.5 - 6.1"', size: 'XS', braceletCm: '16', braceletIn: '6.3"' },
    { wristCm: '15.5 - 16.5', wristIn: '6.1 - 6.5"', size: 'S', braceletCm: '17', braceletIn: '6.7"' },
    { wristCm: '16.5 - 18', wristIn: '6.5 - 7"', size: 'M', braceletCm: '19', braceletIn: '7.5"' },
    { wristCm: '18 - 19', wristIn: '7 - 7.5"', size: 'L', braceletCm: '20', braceletIn: '7.9"' },
    { wristCm: '19 - 20', wristIn: '7.5 - 7.9"', size: 'XL', braceletCm: '21', braceletIn: '8.3"' },
    { wristCm: '20 - 21', wristIn: '7.9 - 8.3"', size: 'XXL', braceletCm: '22', braceletIn: '8.7"' },
  ];

  const chainSizes = [
    { inches: '16"', cm: '41 cm', description: 'Choker style, sits at the base of the neck.' },
    { inches: '18"', cm: '46 cm', description: 'Sits at the collarbone. Most common length for men.' },
    { inches: '20"', cm: '51 cm', description: 'Sits a few inches below the collarbone.' },
    { inches: '24"', cm: '61 cm', description: 'Sits at the center of the chest.' },
  ];

  return (
    <div className="space-y-16">
      {/* Bracelet Section */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <Ruler className="text-brand-black" size={24} />
          <h2 className="text-2xl uppercase tracking-widest font-bold">Bracelet Sizing</h2>
        </div>

        <div className="bg-white border border-brand-gray-light overflow-hidden rounded-sm mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-gray-light/10 border-bottom border-brand-gray-light">
                  <th colSpan={2} className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold border-r border-brand-gray-light">Wrist Size</th>
                  <th rowSpan={2} className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold border-r border-brand-gray-light">Size</th>
                  <th colSpan={2} className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold">Bracelet Size</th>
                </tr>
                <tr className="bg-brand-gray-light/5 border-b border-brand-gray-light">
                  <th className="px-6 py-3 text-[9px] uppercase tracking-widest font-bold text-brand-gray-dark">cm</th>
                  <th className="px-6 py-3 text-[9px] uppercase tracking-widest font-bold text-brand-gray-dark border-r border-brand-gray-light">inches</th>
                  <th className="px-6 py-3 text-[9px] uppercase tracking-widest font-bold text-brand-gray-dark">cm</th>
                  <th className="px-6 py-3 text-[9px] uppercase tracking-widest font-bold text-brand-gray-dark">inches</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray-light">
                {braceletSizes.map((row, idx) => (
                  <tr key={idx} className="hover:bg-brand-gray-light/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">{row.wristCm}</td>
                    <td className="px-6 py-4 text-sm text-brand-gray-dark border-r border-brand-gray-light">{row.wristIn}</td>
                    <td className="px-6 py-4 text-sm font-bold border-r border-brand-gray-light">{row.size}</td>
                    <td className="px-6 py-4 text-sm font-medium">{row.braceletCm}</td>
                    <td className="px-6 py-4 text-sm text-brand-gray-dark">{row.braceletIn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-brand-gray-light/10 p-8 rounded-sm">
            <div className="flex items-center gap-3 mb-4">
              <Info size={18} className="text-brand-gray-dark" />
              <h3 className="text-xs uppercase tracking-widest font-bold">How to Measure</h3>
            </div>
            <p className="text-sm text-brand-gray-dark leading-relaxed">
              Measure around your wrist using a flexible measuring tape or a piece of string. Mark the point where the ends meet and measure the length against a ruler.
            </p>
          </div>
          <div className="bg-brand-gray-light/10 p-8 rounded-sm">
            <div className="flex items-center gap-3 mb-4">
              <Info size={18} className="text-brand-gray-dark" />
              <h3 className="text-xs uppercase tracking-widest font-bold">Fit Preference</h3>
            </div>
            <ul className="text-sm text-brand-gray-dark space-y-2">
              <li>• <span className="font-bold text-brand-black">Tight Fit:</span> Add 1 - 1.5 cm to your wrist size.</li>
              <li>• <span className="font-bold text-brand-black">Loose Fit:</span> Add 2 - 2.5 cm to your wrist size.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Chain Section */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <Ruler className="text-brand-black" size={24} />
          <h2 className="text-2xl uppercase tracking-widest font-bold">Chain Sizing</h2>
        </div>

        <div className="space-y-6">
            {chainSizes.map((chain, idx) => (
              <div key={idx} className="flex items-start gap-6 group">
                <div className="text-xl font-bold tracking-tighter text-brand-gray-light group-hover:text-brand-black transition-colors">
                  {chain.inches}
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-1">{chain.cm}</h4>
                  <p className="text-xs text-brand-gray-dark leading-relaxed">
                    {chain.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
      </section>
    </div>
  );
}
