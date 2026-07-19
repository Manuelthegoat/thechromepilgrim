import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './GalleryDetail.css';

function GalleryDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItem() {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('id', id)
        .single();

      if (!error) setItem(data);
      setLoading(false);
    }
    fetchItem();
  }, [id]);

  if (loading) {
    return <section className="gallery-detail"><p>Loading…</p></section>;
  }

  if (!item) {
    return (
      <section className="gallery-detail gallery-detail--not-found">
        <p>That piece doesn't exist.</p>
        <Link to="/gallery" className="gallery-detail__back">Back to gallery</Link>
      </section>
    );
  }

  return (
    <section className="gallery-detail">
      <div className="gallery-detail__media">
        {item.images?.[0] && <img src={item.images[0]} alt={item.title} />}
      </div>
      <div className="gallery-detail__info">
        <h1 className="gallery-detail__title">{item.title}</h1>
        <div className="gallery-detail__meta">{item.year} — {item.medium}</div>
        <p className="gallery-detail__description">{item.description}</p>
        <Link to="/gallery" className="gallery-detail__back">← Back to gallery</Link>
      </div>
    </section>
  );
}

export default GalleryDetail;