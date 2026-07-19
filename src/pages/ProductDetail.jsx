import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useCart } from "../context/CartContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "./ProductDetail.css";
import "swiper/css";
import "swiper/css/pagination";

function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, images, sizes, stock")
        .eq("id", id)
        .single();

      if (!error) setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  const images = product?.images || [];

  if (loading) {
    return (
      <section className="product-detail">
        <p>Loading…</p>
      </section>
    );
  }

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

  const { name, price, sizes } = product;

  return (
    <section className="product-detail">
      <div className="product-detail__media">
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          spaceBetween={30}
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
        <div className="product-detail__price">
          ₦{Number(price).toLocaleString()}
        </div>

        <div className="product-detail__sizes">
          <div className="product-detail__label">Size</div>
          <div className="product-detail__size-options">
            {(sizes || []).map((size) => {
              const available = product.stock?.[size] ?? 0;
              const isSoldOut = available <= 0;
              return (
                <button
                  key={size}
                  className={`product-detail__size-btn ${selectedSize === size ? "product-detail__size-btn--active" : ""} ${isSoldOut ? "product-detail__size-btn--soldout" : ""}`}
                  onClick={() => !isSoldOut && setSelectedSize(size)}
                  disabled={isSoldOut}
                >
                  {size}
                  {isSoldOut && (
                    <span className="product-detail__soldout-label">
                      Sold out
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="product-detail__quantity">
          <div className="product-detail__label">Quantity</div>
          <div className="product-detail__qty-controls">
            <button
              onClick={() =>
                setQuantity((q) =>
                  Math.min(product.stock?.[selectedSize] ?? 1, q + 1),
                )
              }
            >
              +
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)}>+</button>
          </div>
        </div>

        <button
          className="product-detail__add-btn"
          disabled={!selectedSize}
          onClick={() => addItem(product, selectedSize, quantity)}
        >
          {selectedSize ? "Add to Bag" : "Select a size"}
        </button>
      </div>
    </section>
  );
}

export default ProductDetail;
