import Wordmark from '../shared/Wordmark';
import NavGroup from '../shared/NavGroup';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <NavGroup align="left" links={['COLLECTION', 'ARCHIVE']} />
      <Wordmark size="sm" />
      <NavGroup align="right" links={['JOURNAL']} icons={['search', 'shopping-bag']} />
    </header>
  );
}

export default Header;