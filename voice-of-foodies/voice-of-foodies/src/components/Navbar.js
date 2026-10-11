import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <Link to="/" className="navbar__brand">
          <span className="brand-icon">🍽</span>
          <span className="brand-name">Voice of Foodies</span>
        </Link>

        <button
          className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <li><Link to="/"        className={isActive('/')        ? 'active' : ''}>Home</Link></li>
          <li><Link to="/reviews" className={isActive('/reviews') ? 'active' : ''}>Reviews</Link></li>
          <li><Link to="/about"   className={isActive('/about')   ? 'active' : ''}>About</Link></li>
          {!user ? (
            <>
              <li><Link to="/login"  className={`nav-btn nav-btn--ghost ${isActive('/login')  ? 'active' : ''}`}>Login</Link></li>
              <li><Link to="/signup" className={`nav-btn nav-btn--solid ${isActive('/signup') ? 'active' : ''}`}>Sign Up</Link></li>
            </>
          ) : (
            <>
              <li>
                <Link to="/profile" className={`nav-user ${isActive('/profile') ? 'active' : ''}`}>
                  👤 {user.name.split(' ')[0]}
                </Link>
              </li>
              <li><button className="nav-btn nav-btn--outline" onClick={handleLogout}>Logout</button></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
