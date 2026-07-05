import { Link } from 'react-router-dom';
import Wordmark from '../shared/Wordmark';
import './Header.css';

function Header({ cartCount = 0 }) {
  return (
    <header className="header">
      <div className="header__side header__side--left">
        <Link to="/gallery" aria-label="Gallery">
          <i className="ti ti-helmet" aria-hidden="true" />
        </Link>
      </div>

      <Link to="/">
        <Wordmark size="sm" />
      </Link>

      <div className="header__side header__side--right">
        <span className="header__link">LOGIN</span>
        <Link to="/cart" className="header__cart" aria-label="Cart">
          <i className="ti ti-shopping-bag" aria-hidden="true" />
          {cartCount > 0 && <span className="header__cart-count">{cartCount}</span>}
        </Link>
      </div>
    </header>
  );
}

export default Header;