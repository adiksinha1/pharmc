const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_PATH = path.join(__dirname, "users.json");

function loadUsers() {
  try {
    if (!fs.existsSync(DATA_PATH)) return {};
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    return JSON.parse(raw || "{}");
  } catch (e) {
    return {};
  }
}

function saveUsers(obj) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(obj, null, 2), "utf8");
}

app.post("/api/signup", (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: "missing" });
  const users = loadUsers();
  if (users[email]) return res.status(409).json({ error: "exists" });
  // hash password
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  users[email] = { name, passwordHash: hash };
  saveUsers(users);
  return res.json({ user: { name, email } });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "missing" });
  const users = loadUsers();
  const record = users[email];
  if (!record) return res.status(401).json({ error: "not_found" });
  const hash = record.passwordHash || record.password; // fallback for older entries
  if (!bcrypt.compareSync(password, hash)) return res.status(401).json({ error: "invalid" });
  return res.json({ user: { name: record.name, email } });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Mock auth server running on http://localhost:${port}`);
});
