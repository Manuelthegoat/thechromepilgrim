import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";
import Eyebrow from "../components/shared/Eyebrow";
import "./Checkout.css";

const SHIPPING_OPTIONS = [
  { label: "Standard (Enugu Only)", value: "enugu", price: 6000 },
  { label: "Outside Enugu", value: "outside-enugu", price: 8000 },
];

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
  const [shippingMethod, setShippingMethod] = useState(
    SHIPPING_OPTIONS[0].value,
  );
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState(null);
  const [checkingCode, setCheckingCode] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const selectedShipping = SHIPPING_OPTIONS.find(
    (s) => s.value === shippingMethod,
  );

  const discountAmount = appliedDiscount
    ? appliedDiscount.type === "percent"
      ? Math.round((cartTotal * appliedDiscount.value) / 100)
      : Math.min(appliedDiscount.value, cartTotal) // never discount below 0
    : 0;

  const orderTotal = cartTotal - discountAmount + selectedShipping.price;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function isFormValid() {
    return form.name && form.email && form.phone && form.address;
  }

  async function handleApplyDiscount() {
    if (!discountCode.trim()) return;

    setCheckingCode(true);
    setDiscountError(null);

    const { data, error: rpcError } = await supabase.rpc(
      "validate_discount_code",
      {
        p_code: discountCode.trim(),
      },
    );

    setCheckingCode(false);

    const result = data?.[0];

    if (rpcError || !result?.valid) {
      setDiscountError("Invalid or expired code.");
      setAppliedDiscount(null);
      toast.error("Invalid or expired code");

      return;
    }

    setAppliedDiscount({
      code: discountCode.trim().toUpperCase(),
      type: result.code_type,
      value: result.code_value,
    });
    toast.success(`Code ${discountCode.trim().toUpperCase()} applied`);
  }

  function removeDiscount() {
    setAppliedDiscount(null);
    setDiscountCode("");
    setDiscountError(null);
    toast("Discount removed");
  }

  function handlePayment(e) {
    e.preventDefault();
    if (!isFormValid() || items.length === 0) return;

    setIsProcessing(true);
    setError(null);

    const handler = window.PaystackPop.setup({
      key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
      email: form.email,
      amount: orderTotal * 100,
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
        toast.error("Payment window closed");
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
      shipping_method: selectedShipping.label,
      shipping_cost: selectedShipping.price,
      discount_code: appliedDiscount?.code || null,
      discount_amount: discountAmount,
      items: items,
      total: orderTotal,
      paystack_reference: reference,
      status: "pending",
    });

    if (insertError) {
      setIsProcessing(false);
      setError(
        "Payment succeeded, but saving your order failed. Please contact us with reference: " +
          reference,
      );
      toast.error("Something went wrong saving your order");
      return;
    }
    // inside saveOrder, right after the successful insert (before the stock decrement loop):
    try {
      await fetch(
        `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/send-order-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            customerEmail: form.email,
            customerName: form.name,
            items: items,
            total: orderTotal,
            reference: reference,
          }),
        },
      );
    } catch (emailError) {
      console.error("Order email failed to send:", emailError);
      // deliberately not blocking the order flow if email fails — the order itself already succeeded
    }
    for (const item of items) {
      if (item.type === "object") {
        const { error: soldError } = await supabase.rpc("mark_object_sold", {
          p_object_id: item.id,
        });
        if (soldError) console.error("Marking object sold failed:", soldError);
      } else {
        const { error: stockError } = await supabase.rpc("decrement_stock", {
          p_product_id: item.id,
          p_size: item.size,
          p_qty: item.quantity,
        });
        if (stockError) console.error("Stock decrement failed:", stockError);
      }
    }

    setIsProcessing(false);
    clearCart();
    toast.success("Payment successful — order placed!");
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

        <select
          className="checkout__shipping-select"
          value={shippingMethod}
          onChange={(e) => setShippingMethod(e.target.value)}
        >
          {SHIPPING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} — ₦{option.price.toLocaleString()}
            </option>
          ))}
        </select>

        <div className="checkout__discount">
          {appliedDiscount ? (
            <div className="checkout__discount-applied">
              <span>
                Code <strong>{appliedDiscount.code}</strong> applied
              </span>
              <button type="button" onClick={removeDiscount}>
                Remove
              </button>
            </div>
          ) : (
            <div className="checkout__discount-input">
              <input
                type="text"
                placeholder="Discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <button
                type="button"
                onClick={handleApplyDiscount}
                disabled={checkingCode}
              >
                {checkingCode ? "..." : "Apply"}
              </button>
            </div>
          )}
          {discountError && (
            <p className="checkout__discount-error">{discountError}</p>
          )}
        </div>

        <div className="checkout__summary">
          <div className="checkout__summary-row">
            <span>Subtotal</span>
            <span>₦{cartTotal.toLocaleString()}</span>
          </div>
          {appliedDiscount && (
            <div className="checkout__summary-row checkout__summary-row--discount">
              <span>Discount</span>
              <span>−₦{discountAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="checkout__summary-row">
            <span>Shipping</span>
            <span>₦{selectedShipping.price.toLocaleString()}</span>
          </div>
          <div className="checkout__summary-row checkout__summary-row--total">
            <span>Total</span>
            <span>₦{orderTotal.toLocaleString()}</span>
          </div>
        </div>

        {error && <p className="checkout__error">{error}</p>}

        <button
          type="submit"
          className="checkout__pay-btn"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing…" : "Pay Now"}
        </button>
      </form>
    </section>
  );
}

export default Checkout;
