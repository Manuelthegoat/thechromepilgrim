import './ProductCard.css';

function ProductCard({ plateNumber, name, price, image, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="product-card__media">
        {image ? (
          <img src={image} alt={name} className="product-card__img" />
        ) : (
          <div className="product-card__placeholder">
            <span className="product-card__plate">PLATE {plateNumber}</span>
          </div>
        )}
        <button className="product-card__add-btn" onClick={onAddToCart}>
          Add to cart
        </button>
      </div>
      <div className="product-card__name">{name}</div>
      <div className="product-card__price">₦{price}</div>
    </div>
  );
}

export default ProductCard;