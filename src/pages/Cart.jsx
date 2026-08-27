import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';
import Eyebrow from '../components/shared/Eyebrow';
import './Cart.css';

function Cart() {
  const { items, removeItem, updateQuantity, cartTotal } = useCart();
  const [stockMap, setStockMap] = useState({}); // { productId: { size: qty, ... } }
  const [loadingStock, setLoadingStock] = useState(true);

  useEffect(() => {
    async function fetchStock() {
      if (items.length === 0) {
        setLoadingStock(false);
        return;
      }

      const productIds = items.filter((i) => i.size).map((i) => i.id); // objects have no size, skip
      if (productIds.length === 0) {
        setLoadingStock(false);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('id, stock')
        .in('id', productIds);

      if (!error) {
        const map = {};
        data.forEach((p) => {
          map[p.id] = p.stock || {};
        });
        setStockMap(map);
      }
      setLoadingStock(false);
    }
    fetchStock();
  }, [items]);

  function getAvailableStock(item) {
    if (!item.size) return Infinity; // objects (no size) aren't stock-limited here — sold-out is handled separately
    return stockMap[item.id]?.[item.size] ?? item.quantity; // fallback: don't block if we can't confirm
  }

  function handleIncrease(item) {
    const available = getAvailableStock(item);
    if (item.quantity >= available) {
      toast.error(`Only ${available} left in stock`);
      return;
    }
    updateQuantity(item.id, item.size, item.quantity + 1);
  }

  if (items.length === 0) {
    return (
      <section className="cart">
        <Eyebrow>YOUR CART</Eyebrow>
        <p className="cart__empty">Nothing carried yet.</p>
        <Link to="/shop" className="cart__continue">Continue browsing</Link>
      </section>
    );
  }

  return (
    <section className="cart">
      <Eyebrow>YOUR CART</Eyebrow>

      <div className="cart__items">
        {items.map((item) => {
          const available = getAvailableStock(item);
          const atMax = item.quantity >= available;

          return (
            <div key={`${item.id}-${item.size}`} className="cart__item">
              {item.image && <img src={item.image} alt={item.name} className="cart__item-img" />}

              <div className="cart__item-details">
                <div className="cart__item-name">{item.name}</div>
                {item.size && <div className="cart__item-size">Size: {item.size}</div>}
                <div className="cart__item-price">₦{item.price}</div>

                <div className="cart__item-qty">
                  <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleIncrease(item)} disabled={atMax}>+</button>
                </div>

                {atMax && item.size && !loadingStock && (
                  <div className="cart__item-stock-note">Max stock reached</div>
                )}

                <button className="cart__item-remove" onClick={() => { removeItem(item.id, item.size); toast.success(`Removed ${item.name}`); }}>
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cart__total">
        <span>Total</span>
        <span>₦{cartTotal.toLocaleString()}</span>
      </div>

      <Link to="/checkout" className="cart__checkout-btn">
        Checkout
      </Link>
    </section>
  );
}

export default Cart;