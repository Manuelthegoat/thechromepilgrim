import { useState } from "react";
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
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Checkout from "./pages/Checkout";
import OrderConfirmed from "./pages/OrderConfirmed";
import AdminLogin from "./pages/admin/AdminLogin";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminGallery from "./pages/admin/AdminGallery";
import { Toaster } from "react-hot-toast";
import AdminDiscounts from "./pages/admin/AdminDiscounts";
import LoadingScreen from "./components/shared/LoadingScreen";
import AdminObjects from './pages/admin/AdminObjects';
import ObjectDetail from './pages/ObjectDetail';
import Objects from './pages/Objects';
import Contact from "./pages/Contact";



function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  letterSpacing: "0.5px",
                  background: "#14130f",
                  color: "#fff",
                  borderRadius: "0px",
                },
                success: {
                  iconTheme: { primary: "#8a7238", secondary: "#fff" },
                },
                error: {
                  style: { background: "#a03030" },
                },
              }}
            />
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
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmed" element={<OrderConfirmed />} />
                <Route path="/objects" element={<Objects />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/objects/:id" element={<ObjectDetail />} />

                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminOverview />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="gallery" element={<AdminGallery />} />
                  <Route path="discounts" element={<AdminDiscounts />} />
                  <Route path="objects" element={<AdminObjects />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;
