import { createContext, useContext, useState } from 'react';

export type Currency = 'GBP' | 'USD' | 'EUR' | 'AUD' | 'CAD';

export const CURRENCIES: { code: Currency; symbol: string; rate: number }[] = [
  { code: 'GBP', symbol: '£', rate: 1 },
  { code: 'USD', symbol: '$', rate: 1.27 },
  { code: 'EUR', symbol: '€', rate: 1.18 },
  { code: 'AUD', symbol: 'A$', rate: 1.97 },
  { code: 'CAD', symbol: 'C$', rate: 1.73 },
];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (gbpPrice: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('GBP');

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
