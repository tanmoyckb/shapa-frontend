import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product, size = null, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id && i.size === size);
      if (existing) return prev.map(i => i.id === product.id && i.size === size ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty, size: size || product.sizes?.[0] || 'One Size' }];
    });
  };

  const removeFromCart = (id, size) => setCart(prev => prev.filter(i => !(i.id === id && i.size === size)));

  const updateQty = (id, size, qty) => {
    if (qty < 1) return removeFromCart(id, size);
    setCart(prev => prev.map(i => i.id === id && i.size === size ? { ...i, qty } : i));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, cartCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
