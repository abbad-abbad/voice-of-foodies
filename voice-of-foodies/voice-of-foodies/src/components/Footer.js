import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">🍽 Voice of Foodies</span>
          <p>Discover Karachi's best restaurants through honest community reviews.</p>
        </div>
        <div className="footer__links">
          <Link to="/">Home</Link>
          <Link to="/reviews">Reviews</Link>
          <Link to="/about">About</Link>
        </div>
        <p className="footer__copy">
          © 2026 Voice of Foodies · SZABIST University FYP
        </p>
      </div>
    </footer>
  );
}
