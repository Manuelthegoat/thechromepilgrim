import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminLayout.css";

function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <div className="admin-layout">
      <button
        className="admin-layout__menu-toggle"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        <i
          className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`}
          aria-hidden="true"
        />{" "}
      </button>

      <aside
        className={`admin-layout__sidebar ${menuOpen ? "admin-layout__sidebar--open" : ""}`}
      >
        <div className="admin-layout__brand">Chrome Pilgrim Admin</div>
        <nav className="admin-layout__nav">
          <NavLink to="/admin" end onClick={() => setMenuOpen(false)}>
            Overview
          </NavLink>
          <NavLink to="/admin/orders" onClick={() => setMenuOpen(false)}>
            Orders
          </NavLink>
          <NavLink to="/admin/products" onClick={() => setMenuOpen(false)}>
            Products
          </NavLink>
          <NavLink to="/admin/gallery" onClick={() => setMenuOpen(false)}>
            Gallery
          </NavLink>
          <NavLink to="/admin/discounts" onClick={() => setMenuOpen(false)}>
            Discounts
          </NavLink>a
        </nav>
        <button className="admin-layout__logout" onClick={handleLogout}>
          Log out
        </button>
      </aside>

      <main className="admin-layout__content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
