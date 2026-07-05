import { Link } from 'react-router-dom';
import './HelmetMenu.css';

const MENU_ITEMS = [
  { label: 'Archives', to: '/gallery' },
  { label: '"The Chrome Pilgrim" Sleeves', to: '/shop' },
  { label: 'Info', to: '/info' },
  { label: 'My Bag', to: '/cart' },
];

function HelmetMenu({ onClose }) {
  return (
    <div className="helmet-menu">
      {MENU_ITEMS.map((item) => (
        <Link key={item.to} to={item.to} className="helmet-menu__item" onClick={onClose}>
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export default HelmetMenu;