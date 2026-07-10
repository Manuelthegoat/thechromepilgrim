// import WaxSeal from '../shared/WaxSeal';
// import Eyebrow from '../shared/Eyebrow';
// import useIsMobile from '../../hooks/useIsMobile';
import './Hero.css';

function Hero({ title = 'The Chrome Pilgrim', tagline = 'AN ORDER OF CLOTH AND CHAIN' }) {
  // const isMobile = useIsMobile();

  return (
    <section className="hero">
      {/* <div className="hero__seal">
        <WaxSeal size={isMobile ? 80 : 130} opacity={0.5} />
      </div> */}
      {/* <h1 className="hero__title">{title}</h1> */}
      {/* <Eyebrow>{tagline}</Eyebrow> */}
      {/* <div className="hero__scroll">SCROLL</div> */}
    </section>
  );
}

export default Hero;