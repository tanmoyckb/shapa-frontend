import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = ({ onSearch }) => {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [ddShop, setDdShop] = useState(false);
  const [ddAccount, setDdAccount] = useState(false);
  const shopRef = useRef(); const accRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (shopRef.current && !shopRef.current.contains(e.target)) setDdShop(false);
      if (accRef.current && !accRef.current.contains(e.target)) setDdAccount(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const go = (path, category = null) => {
    setMenuOpen(false); setDdShop(false); setDdAccount(false);
    if (category && onSearch) onSearch('', category);
    navigate(path);
    window.scrollTo(0, 0);
  };

  const handleSearch = (val) => {
    setSearch(val);
    if (onSearch) onSearch(val, null);
  };

  return (
    <>
      <nav className="main-nav">
        <div className="nav-left">
          <button
            className={`hamburger ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
          <a className="logo" onClick={() => go('/')}>SHAPA</a>
        </div>

        <div className="search-bar">
          <input
            type="text" placeholder="Search styles, brands..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
          />
          <button onClick={() => handleSearch(search)}>🔍</button>
        </div>

        <div className="nav-right">
          {/* Shop Dropdown */}
          <div className={`nav-dropdown-wrap ${ddShop ? 'open' : ''}`} ref={shopRef}>
            <button className="nav-dropdown-trigger" onClick={() => { setDdShop(!ddShop); setDdAccount(false); }}>
              Shop <span className="chevron">▾</span>
            </button>
            <div className="nav-dropdown">
              <div className="nav-dropdown-label">Categories</div>
              <button className="nav-dropdown-item" onClick={() => go('/', 'Women')}><span className="dd-icon">👗</span> Women</button>
              <button className="nav-dropdown-item" onClick={() => go('/', 'Men')}><span className="dd-icon">🧥</span> Men</button>
              <button className="nav-dropdown-item" onClick={() => go('/', 'Accessories')}><span className="dd-icon">👜</span> Accessories</button>
              <div className="nav-dropdown-divider" />
              <button className="nav-dropdown-item" onClick={() => go('/', 'Sale')} style={{ color: 'var(--error)' }}><span className="dd-icon">🏷️</span> Sale — up to 50% off</button>
            </div>
          </div>

          {/* Account Dropdown */}
          <div className={`nav-dropdown-wrap ${ddAccount ? 'open' : ''}`} ref={accRef}>
            <button className="nav-dropdown-trigger" onClick={() => { setDdAccount(!ddAccount); setDdShop(false); }}>
              👤 Account <span className="chevron">▾</span>
            </button>
            <div className="nav-dropdown">
              <div className="nav-dropdown-label">My Account</div>
              <button className="nav-dropdown-item" onClick={() => go('/login')}><span className="dd-icon">🔑</span> Sign In</button>
              <button className="nav-dropdown-item" onClick={() => go('/login')}><span className="dd-icon">✨</span> Create Account</button>
              <div className="nav-dropdown-divider" />
              <div className="nav-dropdown-label">Admin</div>
              <button className="nav-dropdown-item" onClick={() => go('/admin')}><span className="dd-icon">🔐</span> Admin Panel</button>
            </div>
          </div>

          {/* Cart */}
          <button className="nav-icon-btn" onClick={() => go('/cart')} style={{ position: 'relative' }}>
            🛍 Cart
            <span className="cart-badge">{cartCount}</span>
          </button>
        </div>
      </nav>

      {/* Side Menu Overlay */}
      <div className={`overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      <div className={`side-menu ${menuOpen ? 'open' : ''}`}>
        <div className="side-menu-header">
          <span className="side-menu-logo">SHAPA</span>
          <button className="close-menu" onClick={() => setMenuOpen(false)}>✕</button>
        </div>
        <span className="side-menu-section">Shop</span>
        <button className="side-menu-nav-item" onClick={() => go('/', 'Women')}>Women</button>
        <button className="side-menu-nav-item" onClick={() => go('/', 'Men')}>Men</button>
        <button className="side-menu-nav-item" onClick={() => go('/', 'Accessories')}>Accessories</button>
        <button className="side-menu-nav-item" onClick={() => go('/', 'Sale')}>Sale 🔥</button>
        <span className="side-menu-section">Company</span>
        <button className="side-menu-nav-item">About Shapa</button>
        <button className="side-menu-nav-item">Sustainability</button>
        <button className="side-menu-nav-item">Careers</button>
        <button className="side-menu-nav-item">Press</button>
        <span className="side-menu-section">Support</span>
        <button className="side-menu-nav-item">Size Guide</button>
        <button className="side-menu-nav-item">Returns & Exchanges</button>
        <button className="side-menu-nav-item">Contact Us</button>
        <span className="side-menu-section">Account</span>
        <button className="side-menu-nav-item" onClick={() => go('/login')}>Sign In</button>
        <button className="side-menu-nav-item" onClick={() => go('/admin')}>Admin Panel</button>
      </div>
    </>
  );
};

export default Navbar;
