import { useParams, Link } from 'react-router-dom';
import { GALLERY_ITEMS } from '../data/gallery';
import './GalleryDetail.css';

function GalleryDetail() {
  const { id } = useParams();
  const item = GALLERY_ITEMS.find((g) => g.id === id);

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
        <img src={item.image} alt={item.title} />
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