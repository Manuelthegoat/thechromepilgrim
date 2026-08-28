import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './ObjectDetail.css';

function ObjectDetail() {
  const { id } = useParams();
  const { addItem } = useCart();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItem() {
      const { data, error } = await supabase
        .from('objects')
        .select('*')
        .eq('id', id)
        .single();
      if (!error) setItem(data);
      setLoading(false);
    }
    fetchItem();
  }, [id]);

  if (loading) return <section className="object-detail"><p>Loading…</p></section>;

  if (!item) {
    return (
      <section className="object-detail object-detail--not-found">
        <p>That piece doesn't exist.</p>
        <Link to="/objects" className="object-detail__back">Back to objects</Link>
      </section>
    );
  }

  function handleAcquire() {
    addItem(
      { id: item.id, name: item.title, price: item.price, images: item.images, type: 'object' },
      null, // no size for a unique object
      1     // always quantity 1
    );
    toast.success(`Added ${item.title} to cart`);
  }

  return (
    <section className="object-detail">
      <div className="object-detail__media">
        {item.images?.[0] && <img src={item.images[0]} alt={item.title} loading="lazy" />}
      </div>
      <div className="object-detail__info">
        <h1 className="object-detail__title">{item.title}</h1>
        <div className="object-detail__price">₦{Number(item.price).toLocaleString()}</div>
        {item.description && <p className="object-detail__description text-preserve-breaks">{item.description}</p>}

        <button className="object-detail__add-btn" disabled={item.sold} onClick={handleAcquire}>
          {item.sold ? 'Sold' : 'Acquire'}
        </button>
      </div>
    </section>
  );
}

export default ObjectDetail;