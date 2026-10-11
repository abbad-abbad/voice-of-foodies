import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getReviews } from '../utils/api';
import StarRating from '../components/StarRating';
import './Home.css';

export default function Home() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getReviews().then((all) => setReviews(all.slice(0, 3)));
  }, []);

  return (
    <div className="home page-enter">
      {/* HERO */}
      <section className="hero">
        <div className="hero__bg-pattern" />
        <div className="container hero__content">
          <div className="hero__badge">Pakistan's Community Food Guide</div>
          <h1 className="hero__title">
            Every Meal<br />
            <span className="hero__title--accent">Deserves a Voice</span>
          </h1>
          <p className="hero__sub">
            Discover Karachi's best restaurants through honest reviews by real food lovers.
            Write reviews · Rate restaurants · Explore dining experiences.
          </p>
          <div className="hero__cta">
            {user ? (
              <Link to="/reviews" className="cta-btn cta-btn--primary">Explore Reviews</Link>
            ) : (
              <>
                <Link to="/signup" className="cta-btn cta-btn--primary">Join the Community</Link>
                <Link to="/reviews" className="cta-btn cta-btn--ghost">Browse Reviews</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-bar">
        <div className="container stats-bar__inner">
          {[
            { label: 'Honest Reviews' },
            { label: 'Restaurants Covered' },
            { label: 'Food Enthusiasts' },
            { label: 'Karachi, Pakistan' },
          ].map((s) => (
            <div key={s.label} className="stat-item">
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            {[
              { step: '01', title: 'Create an Account', desc: 'Sign up in seconds — no spam, no ads.' },
              { step: '02', title: 'Dine & Experience', desc: 'Visit a restaurant and form your honest opinion.' },
              { step: '03', title: 'Write a Review', desc: 'Rate the restaurant 1–5 stars and share your experience.' },
              { step: '04', title: 'Help Others Decide', desc: 'Your review helps fellow foodies make better choices.' },
            ].map((item) => (
              <div key={item.step} className="step-card">
                <div className="step-num">{item.step}</div>
                <h3 className="step-title">{item.title}</h3>
                <p className="step-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT REVIEWS PREVIEW */}
      {reviews.length > 0 && (
        <section className="recent-reviews">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Recent Reviews</h2>
              <Link to="/reviews" className="see-all">See All</Link>
            </div>
            <div className="reviews-preview-grid">
              {reviews.map((r) => (
                <div key={r.id} className="preview-card">
                  <div className="preview-card__top">
                    <span className="preview-category">{r.category}</span>
                    <StarRating value={r.rating} size="sm" />
                  </div>
                  <h3 className="preview-restaurant">{r.restaurantName}</h3>
                  <p className="preview-text">{r.reviewText.slice(0, 120)}{r.reviewText.length > 120 ? '...' : ''}</p>
                  <p className="preview-author">— {r.userName}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA BANNER */}
      {!user && (
        <section className="cta-banner">
          <div className="container cta-banner__inner">
            <div>
              <h2 className="cta-banner__title">Ready to share your experience?</h2>
              <p className="cta-banner__sub">Join food lovers across Karachi on Voice of Foodies.</p>
            </div>
            <Link to="/signup" className="cta-btn cta-btn--white">Get Started Free</Link>
          </div>
        </section>
      )}
    </div>
  );
}
