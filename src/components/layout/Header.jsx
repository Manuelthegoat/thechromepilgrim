import Wordmark from '../shared/Wordmark';
import './Header.css';

function Header({ cartCount = 0 }) {
  return (
    <header className="header">
      <div className="header__side header__side--left">
        <i className="ti ti-helmet" aria-hidden="true" />
      </div>

      <Wordmark size="sm" />

      <div className="header__side header__side--right">
        <span className="header__link">LOGIN</span>
        <span className="header__cart">
          <i className="ti ti-shopping-bag" aria-hidden="true" />
          {cartCount > 0 && <span className="header__cart-count">{cartCount}</span>}
        </span>
      </div>
    </header>
  );
}

export default Header;