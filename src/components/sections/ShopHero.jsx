import shopBanner from '../../assets/chromePilgrimPage/photo2.PNG';
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