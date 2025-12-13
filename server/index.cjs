const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");
let db;
try {
  db = require("./db.cjs");
} catch (err) {
  console.warn('better-sqlite3 not available, falling back to JSON file storage');
  const USERS_FILE = path.join(__dirname, 'users.json');

  function readAll() {
    try {
      if (!fs.existsSync(USERS_FILE)) return [];
      const raw = fs.readFileSync(USERS_FILE, 'utf8');
      return JSON.parse(raw || '[]');
    } catch (e) {
      console.error('Failed to read users.json', e);
      return [];
    }
  }

  function writeAll(rows) {
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(rows, null, 2), 'utf8');
      return true;
    } catch (e) {
      console.error('Failed to write users.json', e);
      return false;
    }
  }

  db = {
    getUserByEmail(email) {
      const rows = readAll();
      return rows.find((r) => r.email === email) || null;
    },
    createUser({ email, name, passwordHash }) {
      const rows = readAll();
      if (rows.find((r) => r.email === email)) return null;
      const rec = { email, name, passwordHash };
      rows.push(rec);
      const ok = writeAll(rows);
      return ok ? { email, name } : null;
    }
  };
}

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/signup", (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: "missing" });
  try {
    const existing = db.getUserByEmail(email);
    if (existing) return res.status(409).json({ error: "exists" });
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const created = db.createUser({ email, name, passwordHash: hash });
    if (!created) return res.status(409).json({ error: "exists" });
    return res.json({ user: { name, email } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server_error' });
  }
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "missing" });
  try {
    const record = db.getUserByEmail(email);
    if (!record) return res.status(401).json({ error: "not_found" });
    const hash = record.passwordHash || record.password;
    if (!bcrypt.compareSync(password, hash)) return res.status(401).json({ error: "invalid" });
    return res.json({ user: { name: record.name, email } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server_error' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Mock auth server running on http://localhost:${port}`);
});
