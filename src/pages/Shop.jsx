import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ShopHero from "../components/sections/ShopHero";
import ProductGrid from "../components/sections/ProductGrid";

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, images, stock")
        .eq("category", "shop")
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (!error) setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <>
      <ShopHero />
      {loading ? (
        <p style={{ textAlign: "center", padding: "60px" }}>Loading…</p>
      ) : (
        <ProductGrid title="THE CHROME PILGRIM SLEEVES" products={products} />
      )}
    </>
  );
}

export default Shop;
