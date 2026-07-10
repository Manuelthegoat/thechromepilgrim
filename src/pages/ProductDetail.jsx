import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import './ProductDetail.css';

const AUTOPLAY_DELAY = 4000;

function ProductDetail() {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === id);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const dragStartX = useRef(0);
  const isDragging = useRef(false);

  const images = product?.images || [];

  function goToPrev() {
    setActiveImage((i) => (i === 0 ? images.length - 1 : i - 1));
  }

  function goToNext() {
    setActiveImage((i) => (i === images.length - 1 ? 0 : i + 1));
  }

  // Autoplay
  useEffect(() => {
    if (images.length <= 1 || isPaused) return;
    const timer = setInterval(goToNext, AUTOPLAY_DELAY);
    return () => clearInterval(timer);
  }, [images.length, isPaused, activeImage]);

  // Touch swipe (mobile)
  function handleTouchStart(e) {
    dragStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  }

  function handleTouchEnd(e) {
    const delta = e.changedTouches[0].clientX - dragStartX.current;
    if (delta > 50) goToPrev();
    else if (delta < -50) goToNext();
    setIsPaused(false);
  }

  // Mouse drag (desktop)
  function handleMouseDown(e) {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    setIsPaused(true);
  }

  function handleMouseUp(e) {
    if (!isDragging.current) return;
    const delta = e.clientX - dragStartX.current;
    if (delta > 50) goToPrev();
    else if (delta < -50) goToNext();
    isDragging.current = false;
    setIsPaused(false);
  }

  function handleMouseLeave() {
    if (isDragging.current) {
      isDragging.current = false;
      setIsPaused(false);
    }
  }

  if (!product) {
    return (
      <section className="product-detail product-detail--not-found">
        <p>That item doesn't exist.</p>
        <Link to="/shop" className="product-detail__back">Back to shop</Link>
      </section>
    );
  }

  const { name, price } = product;

  return (
    <section className="product-detail">
      <div
        className="product-detail__media"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsPaused(true)}
      >
        {images.length > 1 && (
          <button className="product-detail__arrow product-detail__arrow--left" onClick={goToPrev} aria-label="Previous image">
            <i className="ti ti-chevron-left" aria-hidden="true" />
          </button>
        )}

        <img src={images[activeImage]} alt={`${name} — view ${activeImage + 1}`} draggable="false" />

        {images.length > 1 && (
          <button className="product-detail__arrow product-detail__arrow--right" onClick={goToNext} aria-label="Next image">
            <i className="ti ti-chevron-right" aria-hidden="true" />
          </button>
        )}

        {images.length > 1 && (
          <div className="product-detail__dots">
            {images.map((_, i) => (
              <span
                key={i}
                className={`product-detail__dot ${i === activeImage ? 'product-detail__dot--active' : ''}`}
                onClick={() => setActiveImage(i)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="product-detail__info">
        <h1 className="product-detail__name">{name}</h1>
        <div className="product-detail__price">₦{price}</div>

        <div className="product-detail__sizes">
          <div className="product-detail__label">Size</div>
          <div className="product-detail__size-options">
            {product.sizes.map((size) => (
              <button
                key={size}
                className={`product-detail__size-btn ${selectedSize === size ? 'product-detail__size-btn--active' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="product-detail__quantity">
          <div className="product-detail__label">Quantity</div>
          <div className="product-detail__qty-controls">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)}>+</button>
          </div>
        </div>

        <button className="product-detail__add-btn" disabled={!selectedSize}>
          {selectedSize ? 'Add to cart' : 'Select a size'}
        </button>
      </div>
    </section>
  );
}

export default ProductDetail;