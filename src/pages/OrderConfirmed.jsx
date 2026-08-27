import { useLocation, Link } from 'react-router-dom';
import Eyebrow from '../components/shared/Eyebrow';
import './OrderConfirmed.css';

function OrderConfirmed() {
  const { state } = useLocation();

  return (
    <section className="order-confirmed">
      <Eyebrow>ORDER RECEIVED</Eyebrow>
      <p className="order-confirmed__text">
        Thank you — your order has been placed. We will email you an order confirmation shortly.
        {state?.reference && <> Reference: {state.reference}</>}
      </p>
      <Link to="/shop" className="order-confirmed__link">Continue browsing</Link>
    </section>
  );
}

export default OrderConfirmed;