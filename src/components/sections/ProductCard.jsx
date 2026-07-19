import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ id, plateNumber, name, price, images, stock }) {
  const isSoldOut = stock && Object.values(stock).every((qty) => qty <= 0);

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
        {isSoldOut && (
          <span className="product-card__soldout-badge">Sold out</span>
        )}
      </div>
      <div className="product-card__name">{name}</div>
      <div className="product-card__price">₦{price}</div>
    </Link>
  );
}

export default ProductCard;
