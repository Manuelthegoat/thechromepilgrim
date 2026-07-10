import ShopHero from '../components/sections/ShopHero';
import ProductGrid from '../components/sections/ProductGrid';
import { PRODUCTS } from '../data/products';

function Shop() {
  return (
    <>
      <ShopHero />
      <ProductGrid title="THE CHROME PILGRIM SLEEVES" products={PRODUCTS} />
    </>
  );
}

export default Shop;