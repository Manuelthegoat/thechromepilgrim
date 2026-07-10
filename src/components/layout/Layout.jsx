import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <>
      <Header />
      <div className={isHome ? '' : 'page-white'}>
        <Outlet />
      <Footer />
      </div>
    </>
  );
}

export default Layout;