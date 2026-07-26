import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Eyebrow from "../components/shared/Eyebrow";
import toast from "react-hot-toast";
import "./Cart.css";

function Cart() {
  const { items, removeItem, updateQuantity, cartTotal } = useCart();
  if (items.length === 0) {
    return (
      <section className="cart">
        <Eyebrow>YOUR BAG</Eyebrow>
        <p className="cart__empty">NOTHINGNESS.</p>
        <Link to="/shop" className="cart__continue">
          Continue browsing
        </Link>
      </section>
    );
  }
  return (
    <section className="cart">
      <Eyebrow>YOUR BAG</Eyebrow>

      <div className="cart__items">
        {items.map((item) => (
          <div key={`${item.id}-${item.size}`} className="cart__item">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="cart__item-img"
              />
            )}

            <div className="cart__item-details">
              <div className="cart__item-name">{item.name}</div>
              <div className="cart__item-size">Size: {item.size}</div>
              <div className="cart__item-price">₦{item.price}</div>

              <div className="cart__item-qty">
                <button
                  onClick={() =>
                    updateQuantity(item.id, item.size, item.quantity - 1)
                  }
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.id, item.size, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>

              <button
                className="cart__item-remove"
                onClick={() => {
                  removeItem(item.id, item.size);
                  toast.success(`Removed ${item.name}`);
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
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
