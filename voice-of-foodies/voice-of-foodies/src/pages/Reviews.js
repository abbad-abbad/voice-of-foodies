import React, { useState, useEffect } from 'react';
import { getReviews, addReview } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ReviewCard from '../components/ReviewCard';
import StarRating from '../components/StarRating';
import './Reviews.css';

const CATEGORIES = ['Pakistani', 'Fast Food', 'BBQ & Grill', 'Chinese', 'Italian', 'Seafood', 'Desserts', 'Cafe', 'Other'];

const EMPTY_FORM = { restaurantName: '', category: 'Pakistani', rating: 0, reviewText: '' };

export default function Reviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const loadReviews = async () => setReviews(await getReviews());

  useEffect(() => { loadReviews(); }, []);

  // ---- Validate ----
  const validate = () => {
    const errs = {};
    if (!form.restaurantName.trim()) errs.restaurantName = 'Restaurant name is required.';
    if (!form.rating)                errs.rating = 'Please select a star rating.';
    if (!form.reviewText.trim())     errs.reviewText = 'Review text is required.';
    return errs;
  };

  // ---- Submit ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      await addReview(form);
      setForm(EMPTY_FORM);
      setErrors({});
      setSuccess(' Review added successfully!');
      await loadReviews();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setErrors({ reviewText: err.message });
    }
  };

  // ---- Filter + Sort ----
  const visible = reviews
    .filter((r) => {
      const matchSearch = r.restaurantName.toLowerCase().includes(search.toLowerCase()) ||
                          r.reviewText.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCat === 'All' || r.category === filterCat;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest')  return a.rating - b.rating;
      return 0;
    });

  return (
    <div className="reviews-page page-enter">
      <div className="reviews-hero">
        <div className="container">
          <h1 className="reviews-hero__title">Restaurant Reviews</h1>
          <p className="reviews-hero__sub">Share your dining experience. Help the community eat well.</p>
        </div>
      </div>

      <div className="container reviews-layout">
        {/* ADD REVIEW FORM */}
        <aside className="add-review-panel">
          <div className="panel-card">
            <h2 className="panel-title">
              <span></span> Write a Review
            </h2>
            <p className="panel-sub">Logged in as <strong>{user.name}</strong></p>

            {success && <div className="alert alert--success">{success}</div>}

            <form onSubmit={handleSubmit} className="review-form" noValidate>
              <div className="form-group">
                <label className="form-label">Restaurant Name *</label>
                <input
                  className={`form-input ${errors.restaurantName ? 'form-input--error' : ''}`}
                  placeholder="e.g. Kolachi Restaurant"
                  value={form.restaurantName}
                  onChange={(e) => { setForm({ ...form, restaurantName: e.target.value }); setErrors({ ...errors, restaurantName: '' }); }}
                />
                {errors.restaurantName && <span className="form-error">{errors.restaurantName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Food Category *</label>
                <select
                  className="form-input"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Your Rating *</label>
                <StarRating
                  value={form.rating}
                  onChange={(r) => { setForm({ ...form, rating: r }); setErrors({ ...errors, rating: '' }); }}
                  size="lg"
                />
                {errors.rating && <span className="form-error">{errors.rating}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Your Review *</label>
                <textarea
                  className={`form-input textarea ${errors.reviewText ? 'form-input--error' : ''}`}
                  placeholder="Describe your dining experience..."
                  rows={5}
                  value={form.reviewText}
                  onChange={(e) => { setForm({ ...form, reviewText: e.target.value }); setErrors({ ...errors, reviewText: '' }); }}
                />
                {errors.reviewText && <span className="form-error">{errors.reviewText}</span>}
              </div>

              <button type="submit" className="submit-btn">Add Review</button>
            </form>
          </div>
        </aside>

        {/* REVIEWS LIST */}
        <section className="reviews-list-panel">
          {/* Filters */}
          <div className="filters-bar">
            <input
              className="search-input"
              type="text"
              placeholder=" Search restaurant or keyword…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="filter-controls">
              <select
                className="filter-select"
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>
          </div>

          <div className="reviews-count">
            {visible.length} review{visible.length !== 1 ? 's' : ''} found
          </div>

          {visible.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">🍽</div>
              <h3>No reviews yet</h3>
              <p>Be the first to share your dining experience!</p>
            </div>
          ) : (
            <div className="reviews-grid">
              {visible.map((r) => (
                <ReviewCard key={r.id} review={r} onRefresh={loadReviews} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
