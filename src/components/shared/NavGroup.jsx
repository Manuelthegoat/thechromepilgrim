import './NavGroup.css';

function NavGroup({ links = [], icons = [], align = 'left' }) {
  return (
    <div className={`nav-group nav-group--${align}`}>
      {links.map((link) => (
        <span key={link} className="nav-group__link">{link}</span>
      ))}
      {icons.map((icon) => (
        <i key={icon} className={`ti ti-${icon} nav-group__icon`} aria-hidden="true" />
      ))}
    </div>
  );
}

export default NavGroup;