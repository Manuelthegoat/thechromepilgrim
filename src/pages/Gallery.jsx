import { Link } from 'react-router-dom';
import Eyebrow from '../components/shared/Eyebrow';
import { GALLERY_ITEMS } from '../data/gallery';
import './Gallery.css';

function Gallery() {
  return (
    <section className="gallery">
      <Eyebrow>THE ARCHIVES</Eyebrow>
      <div className="gallery__grid">
        {GALLERY_ITEMS.map((item) => (
          <Link key={item.id} to={`/gallery/${item.id}`} className="gallery__item">
            <div className="gallery__image-wrap">
              <img src={item.image} alt={item.title} className="gallery__image" />
            </div>
            <div className="gallery__title">{item.title}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Gallery;