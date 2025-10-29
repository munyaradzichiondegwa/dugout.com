// CartContext.js

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    // Load cart from localStorage on mount
    const savedCart = localStorage.getItem('dugout_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const clearCart = () => {
    setCart(null);
    localStorage.removeItem('dugout_cart');
  };

  const value = {
    cart,
    setCart,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};