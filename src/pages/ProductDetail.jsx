import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useCart } from "../context/CartContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import toast from "react-hot-toast";
import Accordion from "../components/shared/Accordion";
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
        .select(
          "id, name, price, images, sizes, stock, description, sizing_guide_image",
        )
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

  const ACCORDION_ITEMS = [
    {
      title: "Delivery information",
      content: (
        <p>
          All pre-orders are processed within 5–10 business days before they are
          sent out for delivery. Import duties may apply for customers in
          certain regions.
        </p>
      ),
    },
    {
      title: "Product description",
      content: (
        <p className="text-preserve-breaks">
          {product.description || "No description available."}
        </p>
      ),
    },
    {
      title: "Size guide",
      content: product.sizing_guide_image ? (
        <img
          src={product.sizing_guide_image}
          alt="Size guide"
          style={{ width: "100%", display: "block" }}
        />
      ) : (
        <p>No size guide available for this item.</p>
      ),
    },
  ];

  const { name, price, sizes } = product;
  function handleSizeSelect(size) {
    setSelectedSize(size);
    const available = product.stock?.[size] ?? 1;
    setQuantity((q) => Math.min(q, available));
  }
  const isProductSoldOut = product.stock
    ? Object.values(product.stock).every((qty) => qty <= 0)
    : false;

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
                  onClick={() => !isSoldOut && handleSizeSelect(size)}
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
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={isProductSoldOut}
            >
              −
            </button>
            <span>{quantity}</span>
            <button
              onClick={() =>
                setQuantity((q) =>
                  Math.min(product.stock?.[selectedSize] ?? 1, q + 1),
                )
              }
              disabled={
                isProductSoldOut ||
                quantity >= (product.stock?.[selectedSize] ?? 1)
              }
            >
              +
            </button>
          </div>
        </div>

        <button
          className="product-detail__add-btn"
          disabled={!selectedSize || isProductSoldOut}
          onClick={() => {
            addItem(product, selectedSize, quantity);
            toast.success(`Added ${name} (${selectedSize}) to cart`);
          }}
        >
          {isProductSoldOut
            ? "Sold out"
            : selectedSize
              ? "Acquire"
              : "Select a size"}
        </button>
        <Accordion items={ACCORDION_ITEMS} />
      </div>
    </section>
  );
}

export default ProductDetail;
