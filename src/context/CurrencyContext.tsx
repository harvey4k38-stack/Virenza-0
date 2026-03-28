import { createContext, useContext, useState } from 'react';

export type Currency = 'GBP' | 'USD' | 'EUR' | 'AUD' | 'CAD';

export const CURRENCIES: { code: Currency; symbol: string; rate: number }[] = [
  { code: 'GBP', symbol: '£', rate: 1 },
  { code: 'USD', symbol: '$', rate: 1.27 },
  { code: 'EUR', symbol: '€', rate: 1.18 },
  { code: 'AUD', symbol: 'A$', rate: 1.97 },
  { code: 'CAD', symbol: 'C$', rate: 1.73 },
];

function detectCurrency(): Currency {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.startsWith('America/')) {
      const canadaZones = ['Toronto', 'Vancouver', 'Winnipeg', 'Edmonton', 'Calgary', 'Halifax', 'St_Johns', 'Moncton', 'Glace_Bay', 'Goose_Bay', 'Whitehorse', 'Yellowknife', 'Regina', 'Swift_Current'];
      if (canadaZones.some(z => tz.includes(z))) return 'CAD';
      return 'USD';
    }
    if (tz.startsWith('Australia/')) return 'AUD';
    if (tz.startsWith('Europe/') && tz !== 'Europe/London') return 'EUR';
  } catch {}
  return 'GBP';
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (gbpPrice: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(detectCurrency);

  const formatPrice = (gbpPrice: number) => {
    const cur = CURRENCIES.find(c => c.code === currency)!;
    const converted = gbpPrice * cur.rate;
    return `${cur.symbol}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within a CurrencyProvider');
  return context;
};
