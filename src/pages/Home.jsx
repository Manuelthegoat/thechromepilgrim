import Hero from '../components/sections/Hero';
import Waypoints from '../components/sections/Waypoints';
import ProductGrid from '../components/sections/ProductGrid';

const WAYPOINTS = [
  { numeral: 'I', label: 'ARRIVAL' },
  { numeral: 'II', label: 'RELICS' },
  { numeral: 'III', label: 'VESTMENTS' },
  { numeral: 'IV', label: 'DEPARTURE' },
];

const PRODUCTS = [
  { plateNumber: '01', name: 'Distressed cross tee', price: 185 },
  { plateNumber: '02', name: 'Draped wool overcoat', price: 640 },
  { plateNumber: '03', name: 'Silver relic pendant', price: 310 },
];

function Home() {
  return (
    <>
      <Hero />
      <Waypoints items={WAYPOINTS} activeIndex={1} />
      <ProductGrid title="II. RELICS — NEW ARRIVALS" products={PRODUCTS} />
    </>
  );
}

export default Home;