import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
const STORAGE_KEY = 'chrome-pilgrim-cart';

function loadInitialCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadInitialCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(product, size, quantity) {
    setItems((current) => {
      const existing = current.find(
        (item) => item.id === product.id && item.size === size
      );

      if (existing) {
        return current.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0],
          size,
          quantity,
        },
      ];
    });
  }

  function removeItem(id, size) {
    setItems((current) => current.filter((item) => !(item.id === id && item.size === size)));
  }

  function updateQuantity(id, size, quantity) {
    if (quantity < 1) return;
    setItems((current) =>
      current.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = items.reduce((sum, item) => {
    const numericPrice = Number(String(item.price).replace(/,/g, ''));
    return sum + numericPrice * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, cartCount, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}