import WaxSeal from './components/shared/WaxSeal';
import './PageLoader.css'
function PageLoader({ className = '' }) {
  return (
    <div className={`page-loader ${className}`}>
      <div className="page-loader__spinner"><WaxSeal /></div>
    </div>
  );
}

export default PageLoader;
