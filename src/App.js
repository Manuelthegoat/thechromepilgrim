import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Cart from "./pages/Cart";
import "./App.css";
import Info from "./pages/Info";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import GalleryDetail from "./pages/GalleryDetail";
import ScrollToTop from "./ScrollToTop";

function App() {
  return (
    <BrowserRouter>
     <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/info" element={<Info />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<ProductDetail />} />
          <Route path="/gallery/:id" element={<GalleryDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
