import shopBanner from '../../assets/TCP.JPG';
import './ShopHero.css';

function ShopHero() {
  return (
    <section
      className="shop-hero"
      style={{ backgroundImage: `url(${shopBanner})` }}
    />
  );
}

export default ShopHero;