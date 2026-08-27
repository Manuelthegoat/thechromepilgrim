import { useEffect } from 'react';
import shopBanner from '../../assets/chromePilgrimPage/photo2.PNG';
import './ShopHero.css';

function ShopHero({ onImagesLoaded }) {
  useEffect(() => {
    const image = new Image();
    const handleSettled = () => onImagesLoaded?.();
    image.onload = handleSettled;
    image.onerror = handleSettled;
    image.src = shopBanner;

    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, [onImagesLoaded]);

  return (
    <section className="shop-hero" style={{ backgroundImage: `url(${shopBanner})` }} aria-label="The Chrome Pilgrim collection" />
  );
}

export default ShopHero;
