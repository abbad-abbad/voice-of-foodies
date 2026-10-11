const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'voice-of-foodies-dev-secret-change-me';

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Not authenticated.' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }
}

module.exports = { signToken, requireAuth, JWT_SECRET };
