import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
// import Wordmark from '../shared/Wordmark';
import HelmetMenu from "./HelmetMenu";
import helmetIcon from "../../assets/logoblack.PNG";
import logo from "../../assets/homepage/titleblack.PNG";

import "./Header.css";

function Header({ cartCount = 1 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="header">
      <div className="header__side header__side--left" ref={menuRef}>
        <button
          className="header__helmet-btn"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <img src={helmetIcon} alt="" className="header__helmet" />
        </button>
        {menuOpen && <HelmetMenu onClose={() => setMenuOpen(false)} />}
      </div>

      <Link to="/" className="header__logo-link">
        <img src={logo} alt="The Chrome Pilgrim" className="header__logo" />
      </Link>

      <div className="header__side header__side--right">
        <span className="header__link">LOGIN</span>
        <Link to="/cart" className="header__cart" aria-label="Cart">
          <i className="ti ti-shopping-bag" aria-hidden="true" />
          {cartCount > 0 && (
            <span className="header__cart-count">{cartCount}</span>
          )}
        </Link>
      </div>
    </header>
  );
}

export default Header;
