import './ProductCard.css';

function ProductCard({ plateNumber, name, price }) {
  return (
    <div className="product-card">
      <div className="product-card__image">
        <span className="product-card__plate">PLATE {plateNumber}</span>
      </div>
      <div className="product-card__name">{name}</div>
      <div className="product-card__price">${price}</div>
    </div>
  );
}

export default ProductCard;