import { Link } from 'react-router-dom';
import './HelmetMenu.css';

const MENU_ITEMS = [
  { label: 'Archives', to: '/gallery' },
  { label: '"The Chrome Pilgrim" Sleeves', to: '/shop' },
  { label: 'Objects', to: '/objects' },
  { label: 'Info', to: '/info' },
  { label: 'My Bag', to: '/cart' },
];

function HelmetMenu({ onClose }) {
  return (
    <div className="helmet-menu">
      <button className="helmet-menu__close" onClick={onClose} aria-label="Close menu">
        <i className="ti ti-x" aria-hidden="true" />
      </button>
      {MENU_ITEMS.map((item) => (
        <Link key={item.to} to={item.to} className="helmet-menu__item" onClick={onClose}>
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export default HelmetMenu;