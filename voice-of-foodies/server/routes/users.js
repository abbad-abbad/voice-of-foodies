const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { requireAuth } = require('../auth');

const router = express.Router();

function toPublicUser(u) {
  return { id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt, updatedAt: u.updatedAt };
}

// All routes below require a valid logged-in user.
router.use(requireAuth);

// READ – GET /api/users/me
router.get('/me', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({ user: toPublicUser(user) });
});

// UPDATE – PUT /api/users/me  (edit name / email / password)
router.put('/me', (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const nextName = (name ?? user.name).trim();
  const nextEmail = (email ?? user.email).toLowerCase().trim();

  if (!nextName) return res.status(400).json({ error: 'Name cannot be empty.' });
  if (!/\S+@\S+\.\S+/.test(nextEmail)) return res.status(400).json({ error: 'Invalid email format.' });

  if (nextEmail !== user.email) {
    const taken = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(nextEmail, user.id);
    if (taken) return res.status(409).json({ error: 'That email is already in use by another account.' });
  }

  let nextPasswordHash = user.password;
  if (newPassword) {
    if (!currentPassword || !bcrypt.compareSync(currentPassword, user.password)) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }
    if (newPassword.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    nextPasswordHash = bcrypt.hashSync(newPassword, 10);
  }

  const now = new Date().toISOString();
  db.prepare(
    `UPDATE users SET name = ?, email = ?, password = ?, updatedAt = ? WHERE id = ?`
  ).run(nextName, nextEmail, nextPasswordHash, now, user.id);

  // Keep review authorship display name in sync.
  if (nextName !== user.name) {
    db.prepare('UPDATE reviews SET userName = ? WHERE userId = ?').run(nextName, user.id);
  }

  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
  res.json({ user: toPublicUser(updated) });
});

// DELETE – DELETE /api/users/me  (delete own account + their reviews)
router.delete('/me', (req, res) => {
  db.prepare('DELETE FROM users WHERE id = ?').run(req.userId);
  res.json({ success: true });
});

module.exports = router;
