import Eyebrow from '../shared/Eyebrow';
import ProductCard from './ProductCard';
import './ProductGrid.css';

function ProductGrid({ title, products = [] }) {
  return (
    <section className="product-grid">
      <Eyebrow>{title}</Eyebrow>
      <div className="product-grid__items">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}

export default ProductGrid;