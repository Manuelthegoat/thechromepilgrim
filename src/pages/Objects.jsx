import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Eyebrow from '../components/shared/Eyebrow';
import './Objects.css';

function Objects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      const { data, error } = await supabase
        .from('objects')
        .select('id, title, price, images, sold')
        .eq('active', true)
        .order('created_at', { ascending: false });
      if (!error) setItems(data);
      setLoading(false);
    }
    fetchItems();
  }, []);

  return (
    <section className="objects">
      <Eyebrow>OBJECTS</Eyebrow>

      {loading ? (
        <p className="objects__text">Loading…</p>
      ) : items.length === 0 ? (
        <p className="objects__text">Did some soul searching and... there's nothing still</p>
      ) : (
        <div className="objects__grid">
          {items.map((item) => (
            <Link key={item.id} to={`/objects/${item.id}`} className="objects__item">
              <div className="objects__image-wrap">
                {item.images?.[0] && <img src={item.images[0]} alt={item.title} className="objects__image" />}
                {item.sold && <span className="objects__sold-badge">Sold</span>}
              </div>
              <div className="objects__title">{item.title}</div>
              <div className="objects__price">₦{Number(item.price).toLocaleString()}</div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default Objects;