// ============================================================
// db.js – SQLite database connection + schema initialization
//
// Using SQLite (via better-sqlite3) because it's a real,
// persistent SQL database but requires zero separate server
// setup (no MySQL daemon, no credentials, no ports) — perfect
// for a basic app. The whole database lives in one file:
// voice_of_foodies.db. Swapping to MySQL/Postgres later would
// only mean changing this file + the query calls in routes/.
// ============================================================

const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, 'voice_of_foodies.db');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Reviewer',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    restaurantName TEXT NOT NULL,
    category TEXT NOT NULL,
    rating INTEGER NOT NULL,
    reviewText TEXT NOT NULL,
    userId TEXT NOT NULL,
    userName TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );
`);

module.exports = db;
