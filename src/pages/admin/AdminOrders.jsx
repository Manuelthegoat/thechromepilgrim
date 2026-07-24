import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import "./AdminOrders.css";

const STATUSES = ["pending", "packed", "shipped", "delivered", "cancelled"];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setOrders(data);
    setLoading(false);
  }

  async function updateStatus(id, status) {
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders((current) =>
      current.map((o) => (o.id === id ? { ...o, status } : o)),
    );
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div className="admin-orders">
      <h1>Orders</h1>
      <table className="admin-orders__table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Reference</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{new Date(order.created_at).toLocaleDateString()}</td>
              <td>
                {order.customer_name}
                <div className="admin-orders__sub">{order.customer_email}</div>
                <div className="admin-orders__sub">{order.customer_phone}</div>
                {order.notes && (
                  <div className="admin-orders__sub">Note: {order.notes}</div>
                )}
              </td>
              <td>
                {order.items?.map((item, i) => (
                  <div key={i} className="admin-orders__item-line">
                    {item.name} ({item.size}) × {item.quantity}
                  </div>
                ))}
              </td>
              <td>₦{Number(order.total).toLocaleString()}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
              <td className="admin-orders__ref">{order.paystack_reference}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrders;
