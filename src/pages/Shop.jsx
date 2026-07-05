import ShopHero from '../components/sections/ShopHero';
import ProductGrid from '../components/sections/ProductGrid';

import whiteTCP from '../assets/whiteTCP.png';
import retro from '../assets/retro.png';
import retrofront from '../assets/retro-front.png';
import blackTCP from '../assets/blackTCP.png';

const PRODUCTS = [
    { plateNumber: '01', name: 'Chrome Pilgrim OG', price: '35,000', image: retro },
    { plateNumber: '02', name: 'The Chrome Pilgrim Sleeves (White)', price: '35,000', image: whiteTCP },
    { plateNumber: '03', name: 'The Chrome Pilgrim Sleeves (Black)', price: '35,000', image: blackTCP },
];

function Shop() {
    return (
        <>
            {/* <ShopHero /> */}
            <ProductGrid title="THE CHROME PILGRIM SLEEVES" products={PRODUCTS} />
        </>
    );
}

export default Shop;