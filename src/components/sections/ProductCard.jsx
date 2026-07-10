import { Link } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ id, plateNumber, name, price, images }) {
  return (
    <Link to={`/shop/${id}`} className="product-card">
      <div className="product-card__media">
        {images?.[0] ? (
          <img src={images[0]} alt={name} className="product-card__img" />
        ) : (
          <div className="product-card__placeholder">
            <span className="product-card__plate">PLATE {plateNumber}</span>
          </div>
        )}
      </div>
      <div className="product-card__name">{name}</div>
      <div className="product-card__price">₦{price}</div>
    </Link>
  );
}

export default ProductCard;