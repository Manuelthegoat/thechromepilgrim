import './Waypoints.css';

function Waypoints({ items = [], activeIndex = 1 }) {
  return (
    <nav className="waypoints">
      {items.map((item, index) => (
        <span
          key={item.numeral}
          className={`waypoints__item ${index === activeIndex ? 'waypoints__item--active' : ''}`}
        >
          {item.numeral} &nbsp;{item.label}
        </span>
      ))}
    </nav>
  );
}

export default Waypoints;