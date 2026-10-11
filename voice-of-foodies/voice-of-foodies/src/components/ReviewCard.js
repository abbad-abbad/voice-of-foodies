import React, { useState } from 'react';
import StarRating from './StarRating';
import { updateReview, deleteReview } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './ReviewCard.css';

const CATEGORIES = ['Pakistani', 'Fast Food', 'BBQ & Grill', 'Chinese', 'Italian', 'Seafood', 'Desserts', 'Cafe', 'Other'];

export default function ReviewCard({ review, onRefresh }) {
  const { user } = useAuth();
  const isOwner = user && user.id === review.userId;

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    restaurantName: review.restaurantName,
    category: review.category,
    rating: review.rating,
    reviewText: review.reviewText,
  });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [saveError, setSaveError] = useState('');

  const handleSave = async () => {
    if (!form.restaurantName.trim() || !form.reviewText.trim() || !form.rating) return;
    try {
      await updateReview(review.id, form);
      setEditing(false);
      setSaveError('');
      onRefresh();
    } catch (err) {
      setSaveError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteReview(review.id);
      onRefresh();
    } catch (err) {
      setSaveError(err.message);
    }
  };

  const dateStr = new Date(review.createdAt).toLocaleDateString('en-PK', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  if (editing) {
    return (
      <div className="review-card review-card--editing">
        <h4 className="edit-title">Edit Review</h4>
        {saveError && <p className="form-error">{saveError}</p>}
        <div className="edit-form">
          <input
            className="input"
            value={form.restaurantName}
            onChange={(e) => setForm({ ...form, restaurantName: e.target.value })}
            placeholder="Restaurant Name"
          />
          <select
            className="input"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <div>
            <label className="input-label">Rating</label>
            <StarRating value={form.rating} onChange={(r) => setForm({ ...form, rating: r })} size="lg" />
          </div>
          <textarea
            className="input textarea"
            value={form.reviewText}
            onChange={(e) => setForm({ ...form, reviewText: e.target.value })}
            rows={4}
            placeholder="Write your review..."
          />
          <div className="edit-actions">
            <button className="btn btn--primary" onClick={handleSave}>Save Changes</button>
            <button className="btn btn--ghost" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="review-card">
      <div className="review-card__header">
        <div>
          <h3 className="review-card__restaurant">{review.restaurantName}</h3>
          <span className="review-card__category">{review.category}</span>
        </div>
        <div className="review-card__rating">
          <StarRating value={review.rating} size="sm" />
          <span className="rating-num">{review.rating}/5</span>
        </div>
      </div>

      <p className="review-card__text">{review.reviewText}</p>

      <div className="review-card__footer">
        <div className="review-card__meta">
          <span className="reviewer-name">👤 {review.userName}</span>
          <span className="review-date">{dateStr}</span>
        </div>

        {isOwner && (
          <div className="review-card__actions">
            {confirmDelete ? (
              <>
                <span className="confirm-text">Delete?</span>
                <button className="btn-action btn-action--danger" onClick={handleDelete}>Yes</button>
                <button className="btn-action" onClick={() => setConfirmDelete(false)}>No</button>
              </>
            ) : (
              <>
                <button className="btn-action" onClick={() => setEditing(true)}>✏️ Edit</button>
                <button className="btn-action btn-action--danger" onClick={() => setConfirmDelete(true)}>🗑 Delete</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
