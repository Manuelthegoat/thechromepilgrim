import WaxSeal from './components/shared/WaxSeal';
import './PageLoader.css'
function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader__spinner"><WaxSeal /></div>
    </div>
  );
}

export default PageLoader;