import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useCart } from "../context/CartContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Accordion from "../components/shared/Accordion";
import "./ProductDetail.css";
import "swiper/css";
import "swiper/css/pagination";

const ACCORDION_ITEMS = [
  {
    title: "Delivery information",
    content: (
      <p>
        All pre-orders are processed within 5-10 business days before they are
        sent out for delivery. Please confirm the delivery information for each
        item by reading its description. To ensure smooth communication, please
        provide a valid email and phone number when placing your order. Note
        that import duties may apply for customers in certain regions. For more
        info, refer to our shipping policy.
      </p>
    ),
  },
  {
    title: "Product description",
    content: <p>A description of this piece goes here.</p>,
  },
  {
    title: "Size guide",
    content: <p>Size guide details go here.</p>,
  },
];

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
          {selectedSize ? "Acquire" : "Select a size"}
        </button>
        <Accordion items={ACCORDION_ITEMS} />
      </div>
    </section>
  );
}

export default ProductDetail;
