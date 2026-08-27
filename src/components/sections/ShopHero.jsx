import { useEffect, useState } from 'react';
import image6657 from '../../assets/Slideshow/IMG_6657.png';
import image6658 from '../../assets/Slideshow/IMG_6658.png';
import image6659 from '../../assets/Slideshow/IMG_6659.png';
import image6660 from '../../assets/Slideshow/IMG_6660.png';
import image6706 from '../../assets/Slideshow/IMG_6706.png';
import image6707 from '../../assets/Slideshow/IMG_6707.png';
import image6708 from '../../assets/Slideshow/IMG_6708.png';
import image6709 from '../../assets/Slideshow/IMG_6709.png';
import image6749 from '../../assets/Slideshow/IMG_6749.png';
import image6750 from '../../assets/Slideshow/IMG_6750.png';
import image6751 from '../../assets/Slideshow/IMG_6751.png';
import './ShopHero.css';

const slides = [
  image6657,
  image6658,
  image6659,
  image6660,
  image6706,
  image6707,
  image6708,
  image6709,
  image6749,
  image6750,
  image6751,
];

function shuffleSlides(images) {
  const shuffled = [...images];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function ShopHero({ onImagesLoaded }) {
  const [shuffledSlides] = useState(() => shuffleSlides(slides));
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    let settled = false;
    const imageLoads = shuffledSlides.map((slide) => new Promise((resolve) => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = resolve;
      image.src = slide;
    }));

    Promise.all(imageLoads).then(() => {
      if (!settled) onImagesLoaded?.();
    });

    return () => {
      settled = true;
    };
  }, [shuffledSlides, onImagesLoaded]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % shuffledSlides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [shuffledSlides.length]);

  return (
    <section className="shop-hero" aria-label="The Chrome Pilgrim collection">
      {shuffledSlides.map((slide, index) => (
        <div
          key={slide}
          className={`shop-hero__slide${index === activeSlide ? ' shop-hero__slide--active' : ''}`}
          style={{ backgroundImage: `url(${slide})` }}
        />
      ))}
    </section>
  );
}

export default ShopHero;
