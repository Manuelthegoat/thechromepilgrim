import useIsMobile from '../../hooks/useIsMobile';
import './Waypoints.css';

function Waypoints({ items = [], activeIndex = 1 }) {
  const isNarrow = useIsMobile(360);

  return (
    <nav className="waypoints">
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        const showLabel = !isNarrow || isActive;

        return (
          <span
            key={item.numeral}
            className={`waypoints__item ${isActive ? 'waypoints__item--active' : ''}`}
          >
            {item.numeral}
            {showLabel && <>&nbsp;{item.label}</>}
          </span>
        );
      })}
    </nav>
  );
}

export default Waypoints;