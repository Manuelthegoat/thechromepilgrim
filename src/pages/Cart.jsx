import Eyebrow from '../components/shared/Eyebrow';
import './Cart.css';

function Cart() {
  return (
    <section className="cart">
      <Eyebrow>YOUR CART</Eyebrow>
      <p className="cart__empty">NOTHINGNESS.</p>
    </section>
  );
}

export default Cart;