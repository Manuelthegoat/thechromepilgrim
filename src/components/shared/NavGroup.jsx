import './NavGroup.css';

function NavGroup({ links = [], align = 'left' }) {
  return (
    <div className={`nav-group nav-group--${align}`}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="nav-group__link"
          target={link.external ? "_blank" : "_self"}
          rel={link.external ? "noopener noreferrer" : undefined}
        >
          {link.label}
          {link.icon && (
            <i
              className={`fab fa-${link.icon} nav-group__icon`}
              aria-hidden="true"
            />
          )}
        </a>
      ))}
    </div>
  );
}

export default NavGroup;