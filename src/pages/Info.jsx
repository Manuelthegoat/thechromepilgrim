import Eyebrow from "../components/shared/Eyebrow";
import "./Info.css";

function Info() {
  return (
    <section className="info">
      <div className="info__block">
        <Eyebrow>Refund policy</Eyebrow>
        <p className="info__text">
          All sales are final, we do not offer refunds unless the item is
          unavailable or if the item is lost in transit.
        </p>
      </div>

      <div className="info__block">
        <Eyebrow>Shipping</Eyebrow>
        <p className="info__text">
          All pre-orders are processed within 5-10 business days before they are
          sent out for delivery. Please confirm the delivery information for
          each item by reading its description. To ensure smooth communication,
          please provide a valid email and phone number when placing your order.
          Note that import duties may apply for customers in certain regions.
        </p>
      </div>
    </section>
  );
}

export default Info;
