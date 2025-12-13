const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, 'data.db');

function ensureDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.prepare(
    `CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      passwordHash TEXT NOT NULL
    )`
  ).run();
  return db;
}

const db = ensureDb();

module.exports = {
  getUserByEmail(email) {
    const row = db.prepare('SELECT email, name, passwordHash FROM users WHERE email = ?').get(email);
    return row || null;
  },
  createUser({ email, name, passwordHash }) {
    const stmt = db.prepare('INSERT INTO users (email, name, passwordHash) VALUES (?, ?, ?)');
    try {
      stmt.run(email, name, passwordHash);
      return { email, name };
    } catch (e) {
      if (e && e.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') return null;
      throw e;
    }
  },
};
