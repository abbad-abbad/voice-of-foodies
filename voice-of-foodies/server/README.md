# Voice of Foodies – API Server

A small Express + SQLite backend that replaces the old `localStorage`
persistence with a real database.

## Why SQLite?
The app is intentionally basic, so SQLite was chosen over MySQL/Postgres:
it's a real relational database with full SQL, but it needs **no separate
database server, no installation, and no credentials** — it's just a single
file (`voice_of_foodies.db`) created automatically the first time you run
the server. If you ever outgrow it, swapping to MySQL only means changing
the queries in `db.js` / `routes/*.js`; the rest of the app (routes,
frontend) stays the same.

## Setup
```bash
cd server
npm install
cp .env.example .env   # optionally edit JWT_SECRET
npm start
```
The API runs on `http://localhost:5000` by default.

## Endpoints

### Auth
- `POST /api/auth/signup` — `{ name, email, password }` → creates user, returns `{ user, token }`
- `POST /api/auth/login` — `{ email, password }` → returns `{ user, token }`
- `GET /api/auth/me` — (Bearer token) → returns the logged-in user

### Users / Profile (all require `Authorization: Bearer <token>`)
- `GET /api/users/me` — view your profile
- `PUT /api/users/me` — `{ name, email, currentPassword?, newPassword? }` — edit name/email, optionally change password
- `DELETE /api/users/me` — delete your account (and your reviews)

### Reviews
- `GET /api/reviews` — list all reviews (public)
- `POST /api/reviews` — create a review (auth required)
- `PUT /api/reviews/:id` — edit your own review (auth required)
- `DELETE /api/reviews/:id` — delete your own review (auth required)

Passwords are hashed with bcrypt before being stored. Sessions are JSON Web
Tokens (7 day expiry) stored client-side and sent as a Bearer token.
