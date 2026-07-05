import WaxSeal from '../shared/WaxSeal';
import Eyebrow from '../shared/Eyebrow';
import './Hero.css';

function Hero({ title = 'The Chrome Pilgrim', tagline = 'AN ORDER OF CLOTH AND CHAIN' }) {
  return (
    <section className="hero">
      <div className="hero__seal">
        <WaxSeal size={130} opacity={0.14} />
      </div>
      <h1 className="hero__title">{title}</h1>
      <Eyebrow>{tagline}</Eyebrow>
      <div className="hero__scroll">SCROLL</div>
    </section>
  );
}

export default Hero;