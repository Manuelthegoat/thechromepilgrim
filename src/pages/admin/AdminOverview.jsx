import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './AdminOverview.css';

function AdminOverview() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase.from('orders').select('*');
      if (!error) setOrders(data);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  if (loading) return <p>Loading…</p>;

  const totalSales = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  return (
    <div className="admin-overview">
      <h1>Overview</h1>
      <div className="admin-overview__stats">
        <div className="admin-overview__card">
          <div className="admin-overview__label">Total sales</div>
          <div className="admin-overview__value">₦{totalSales.toLocaleString()}</div>
        </div>
        <div className="admin-overview__card">
          <div className="admin-overview__label">Total orders</div>
          <div className="admin-overview__value">{orders.length}</div>
        </div>
        <div className="admin-overview__card">
          <div className="admin-overview__label">Pending orders</div>
          <div className="admin-overview__value">{pendingCount}</div>
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;