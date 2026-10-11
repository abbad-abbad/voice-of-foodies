# Voice of Foodies — Full Stack

This app now has two parts:

```
voice-of-foodies/   ← React frontend (UI unchanged, all features intact)
server/             ← Express + SQLite backend (new)
```

## What changed
- All data (user accounts, sessions, reviews) used to live in the browser's
  `localStorage`. It now lives in a real **SQLite database** (`server/voice_of_foodies.db`),
  accessed through a small REST API.
- Passwords are now hashed with bcrypt instead of stored as plain text.
- Login sessions use JWTs instead of a raw localStorage session object.
- A new **Profile page** (`/profile`) lets a logged-in user view their account
  and edit their name, email, and password, or delete their account — full CRUD.
- Every other feature (Home, Reviews list/search/filter/sort, add/edit/delete
  your own review, About page, navbar, styling) works exactly as before.

## Running it locally

**1. Start the backend** (in one terminal):
```bash
cd server
npm install
cp .env.example .env
npm start
```
This starts the API on `http://localhost:5000` and creates `voice_of_foodies.db`
automatically the first time it runs.

**2. Start the frontend** (in another terminal):
```bash
cd voice-of-foodies
npm install
npm start
```
This starts the React app on `http://localhost:3000`, which talks to the API
at the URL set in `voice-of-foodies/.env` (`REACT_APP_API_URL`).

That's it — sign up, log in, write reviews, and edit your profile; everything
is now persisted in the database instead of the browser.

## Why SQLite instead of MySQL?
You asked for "whichever is easier to implement and handle" given how basic
the app is. SQLite gives you a real SQL database with zero setup — no server
to install, no host/port/credentials to configure — it's just a file. If you
later want MySQL/Postgres, only `server/db.js` and the queries in
`server/routes/*.js` would need to change; the API contract and the whole
frontend stay the same.
