CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_verified INTEGER DEFAULT 0,
  is_admin INTEGER DEFAULT 0,
  verification_token TEXT,
  verification_token_expires_at TEXT,
  reset_password_token TEXT,
  reset_password_token_expires_at TEXT,
  pending_email TEXT,
  email_change_token TEXT,
  email_change_token_expires_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  location TEXT NOT NULL,
  country TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE token_blacklist (
  token TEXT PRIMARY KEY,
  expires_at TEXT NOT NULL
);
