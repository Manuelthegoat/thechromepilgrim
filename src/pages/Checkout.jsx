import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabaseClient";
import Eyebrow from "../components/shared/Eyebrow";
import "./Checkout.css";

function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function isFormValid() {
    return form.name && form.email && form.phone && form.address; // notes intentionally excluded
  }

  function handlePayment(e) {
    e.preventDefault();
    if (!isFormValid() || items.length === 0) return;

    setIsProcessing(true);
    setError(null);

    const handler = window.PaystackPop.setup({
      key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
      email: form.email,
      amount: cartTotal * 100, // Paystack expects the amount in kobo
      currency: "NGN",
      metadata: {
        custom_fields: [
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: form.name,
          },
          { display_name: "Phone", variable_name: "phone", value: form.phone },
        ],
      },
      callback: (response) => {
        saveOrder(response.reference);
      },
      onClose: () => {
        setIsProcessing(false);
      },
    });

    handler.openIframe();
  }

  async function saveOrder(reference) {
    const { error: insertError } = await supabase.from("orders").insert({
      customer_name: form.name,
      customer_email: form.email,
      customer_phone: form.phone,
      shipping_address: form.address,
      notes: form.notes || null,
      items: items,
      total: cartTotal,
      paystack_reference: reference,
      status: "pending",
    });

    if (insertError) {
      setIsProcessing(false);
      setError(
        "Payment succeeded, but saving your order failed. Please contact us with reference: " +
          reference,
      );
      return;
    }

    // Decrement stock for each purchased item/size
    for (const item of items) {
      const { error: stockError } = await supabase.rpc("decrement_stock", {
        p_product_id: item.id,
        p_size: item.size,
        p_qty: item.quantity,
      });

      if (stockError) {
        console.error("Stock decrement failed:", stockError);
      }
    }

    setIsProcessing(false);
    clearCart();
    navigate("/order-confirmed", { state: { reference } });
  }

  if (items.length === 0) {
    return (
      <section className="checkout">
        <Eyebrow>CHECKOUT</Eyebrow>
        <p className="checkout__empty">Your cart is empty.</p>
      </section>
    );
  }

  return (
    <section className="checkout">
      <Eyebrow>CHECKOUT</Eyebrow>

      <form className="checkout__form" onSubmit={handlePayment}>
        <input
          type="text"
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone number"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <textarea
          name="address"
          placeholder="Shipping address"
          value={form.address}
          onChange={handleChange}
          rows={3}
          required
        />
        <textarea
          name="notes"
          placeholder="Anything we need to know? (optional)"
          value={form.notes}
          onChange={handleChange}
          rows={2}
        />

        <div className="checkout__total">
          <span>Total</span>
          <span>₦{cartTotal.toLocaleString()}</span>
        </div>

        {error && <p className="checkout__error">{error}</p>}

        <button
          type="submit"
          className="checkout__pay-btn"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing…" : "Pay with Paystack"}
        </button>
      </form>
    </section>
  );
}

export default Checkout;
