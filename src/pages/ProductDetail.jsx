import { useState} from "react";
import { useParams, Link } from "react-router-dom";
import { PRODUCTS } from "../data/products";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "./ProductDetail.css";
import "swiper/css";
import "swiper/css/pagination";

function ProductDetail() {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === id);

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const images = product?.images || [];

  if (!product) {
    return (
      <section className="product-detail product-detail--not-found">
        <p>That item doesn't exist.</p>
        <Link to="/shop" className="product-detail__back">
          Back to shop
        </Link>
      </section>
    );
  }

  const { name, price } = product;

  return (
    <section className="product-detail">
      <div className="product-detail__media">
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          loop={images.length > 1}
          navigation
          pagination={{ clickable: true }}
          autoplay={
            images.length > 1
              ? {
                  delay: 4000,
                  disableOnInteraction: false,
                }
              : false
          }
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image} alt={`${name} ${index + 1}`} draggable={false} />
            </SwiperSlide>
          ))}
        </Swiper>
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
                className={`product-detail__size-btn ${selectedSize === size ? "product-detail__size-btn--active" : ""}`}
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
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
              −
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)}>+</button>
          </div>
        </div>

        <button className="product-detail__add-btn" disabled={!selectedSize}>
          {selectedSize ? "Add to Bag" : "Select a size"}
        </button>
      </div>
    </section>
  );
}

export default ProductDetail;
