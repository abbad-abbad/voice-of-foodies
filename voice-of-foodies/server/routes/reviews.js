const express = require('express');
const crypto = require('crypto');
const db = require('../db');
const { requireAuth } = require('../auth');

const router = express.Router();

// READ – GET /api/reviews  (public, anyone can browse)
router.get('/', (req, res) => {
  const reviews = db.prepare('SELECT * FROM reviews ORDER BY createdAt DESC').all();
  res.json({ reviews });
});

// CREATE – POST /api/reviews  (must be logged in)
router.post('/', requireAuth, (req, res) => {
  const { restaurantName, category, rating, reviewText } = req.body;

  if (!restaurantName || !restaurantName.trim()) return res.status(400).json({ error: 'Restaurant name is required.' });
  if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Please select a star rating.' });
  if (!reviewText || !reviewText.trim()) return res.status(400).json({ error: 'Review text is required.' });

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO reviews (id, restaurantName, category, rating, reviewText, userId, userName, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, restaurantName.trim(), category || 'Other', parseInt(rating), reviewText.trim(), user.id, user.name, now, now);

  const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
  res.status(201).json({ review });
});

// UPDATE – PUT /api/reviews/:id  (only the owner)
router.put('/:id', requireAuth, (req, res) => {
  const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(req.params.id);
  if (!review) return res.status(404).json({ error: 'Review not found.' });
  if (review.userId !== req.userId) return res.status(403).json({ error: 'You can only edit your own reviews.' });

  const { restaurantName, category, rating, reviewText } = req.body;
  const next = {
    restaurantName: restaurantName?.trim() || review.restaurantName,
    category: category || review.category,
    rating: rating ? parseInt(rating) : review.rating,
    reviewText: reviewText?.trim() || review.reviewText,
  };
  const now = new Date().toISOString();

  db.prepare(
    `UPDATE reviews SET restaurantName = ?, category = ?, rating = ?, reviewText = ?, updatedAt = ? WHERE id = ?`
  ).run(next.restaurantName, next.category, next.rating, next.reviewText, now, review.id);

  const updated = db.prepare('SELECT * FROM reviews WHERE id = ?').get(review.id);
  res.json({ review: updated });
});

// DELETE – DELETE /api/reviews/:id  (only the owner)
router.delete('/:id', requireAuth, (req, res) => {
  const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(req.params.id);
  if (!review) return res.status(404).json({ error: 'Review not found.' });
  if (review.userId !== req.userId) return res.status(403).json({ error: 'You can only delete your own reviews.' });

  db.prepare('DELETE FROM reviews WHERE id = ?').run(review.id);
  res.json({ success: true });
});

module.exports = router;
