import Eyebrow from '../components/shared/Eyebrow';
import './Gallery.css';

const PLACEHOLDER_COUNT = 9;

function Gallery() {
  const plates = Array.from({ length: PLACEHOLDER_COUNT }, (_, i) =>
    String(i + 1).padStart(2, '0')
  );

  return (
    <section className="gallery">
      <Eyebrow>THE GALLERY</Eyebrow>
      <div className="gallery__grid">
        {plates.map((plate) => (
          <div key={plate} className="gallery__plate">
            <span className="gallery__plate-label">PLATE {plate}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Gallery;