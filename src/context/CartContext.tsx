import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, thickness?: string, length?: string, name?: string, priceOverride?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  bundleDiscount: number;
  chainBundleDiscount: number;
  jerseyBundleDiscount: number;
  jerseyDiscountRate: number;
  hasJerseyBundle: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('virenza_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('virenza_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, thickness?: string, length?: string, name?: string, priceOverride?: number) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedThickness === thickness &&
          item.selectedLength === length &&
          item.selectedName === name
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      }

      const finalProduct = priceOverride !== undefined ? { ...product, price: priceOverride } : product;
      return [...prevCart, { ...finalProduct, quantity: 1, selectedThickness: thickness, selectedLength: length, selectedName: name }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const rawTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const hasJerseyBundle = cart.some(item => item.category.startsWith('jersey-'));

  // 40% off chains when jersey in cart
  const chainBundleDiscount = hasJerseyBundle
    ? cart.filter(item => item.category === 'chains').reduce((total, item) => total + item.price * item.quantity * 0.4, 0)
    : 0;

  // Jersey quantity discount: 2=10%, 3=20%, 5+=25%
  const jerseyCount = cart.filter(item => item.category.startsWith('jersey-')).reduce((sum, item) => sum + item.quantity, 0);
  const jerseyDiscountRate = jerseyCount >= 5 ? 0.25 : jerseyCount >= 3 ? 0.20 : jerseyCount >= 2 ? 0.10 : 0;
  const jerseySubtotal = cart.filter(item => item.category.startsWith('jersey-')).reduce((sum, item) => sum + item.price * item.quantity, 0);
  const jerseyBundleDiscount = jerseySubtotal * jerseyDiscountRate;

  const bundleDiscount = chainBundleDiscount + jerseyBundleDiscount;
  const cartTotal = rawTotal;

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal, bundleDiscount, chainBundleDiscount, jerseyBundleDiscount, jerseyDiscountRate, hasJerseyBundle }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
