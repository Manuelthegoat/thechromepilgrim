import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ShopHero from "../components/sections/ShopHero";
import ProductGrid from "../components/sections/ProductGrid";
import PageLoader from "../PageLoader";

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroImagesLoaded, setHeroImagesLoaded] = useState(false);
  const [productImagesLoaded, setProductImagesLoaded] = useState(false);
  const handleHeroImagesLoaded = useCallback(() => setHeroImagesLoaded(true), []);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, images, stock")
        .eq("category", "shop")
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (!error) {
        const nextProducts = data || [];
        setProducts(nextProducts);

        const productImages = nextProducts.flatMap((product) => product.images || []);
        if (productImages.length === 0) {
          setProductImagesLoaded(true);
        } else {
          Promise.all(productImages.map((src) => new Promise((resolve) => {
            const image = new Image();
            image.onload = resolve;
            image.onerror = resolve;
            image.src = src;
          }))).then(() => setProductImagesLoaded(true));
        }
      } else {
        setProductImagesLoaded(true);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <>
      <ShopHero onImagesLoaded={handleHeroImagesLoaded} />
      {!loading ? (
        <ProductGrid title="THE CHROME PILGRIM SLEEVES" products={products} />
      ) : (
        <p style={{ textAlign: "center", padding: "60px" }}>Loading…</p>
      )}
      {(!heroImagesLoaded || !productImagesLoaded || loading) && <PageLoader className="page-loader--shop" />}
    </>
  );
}

export default Shop;
