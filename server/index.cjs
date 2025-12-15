const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bcrypt = require("bcryptjs");
let db;
try {
  db = require("./db.cjs");
  console.log("Using MySQL storage (mysql2)");
} catch (err) {
  console.warn("MySQL not configured/available, falling back to JSON file storage", err.message);
  const USERS_FILE = path.join(__dirname, "users.json");

  function readAll() {
    try {
      if (!fs.existsSync(USERS_FILE)) return [];
      const raw = fs.readFileSync(USERS_FILE, "utf8");
      return JSON.parse(raw || "[]");
    } catch (e) {
      console.error("Failed to read users.json", e);
      return [];
    }
  }

  function writeAll(rows) {
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(rows, null, 2), "utf8");
      return true;
    } catch (e) {
      console.error("Failed to write users.json", e);
      return false;
    }
  }

  db = {
    async getUserByEmail(email) {
      const rows = readAll();
      return rows.find((r) => r.email === email) || null;
    },
    async createUser({ email, name, passwordHash }) {
      const rows = readAll();
      if (rows.find((r) => r.email === email)) return null;
      const rec = { email, name, passwordHash };
      rows.push(rec);
      const ok = writeAll(rows);
      return ok ? { email, name } : null;
    },
  };
}

const app = express();
app.use(cors());
app.use(express.json());

// Simple request logger to aid local debugging
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url}`);
  if (req.method === "POST") {
    try {
      console.log("  body:", JSON.stringify(req.body));
    } catch (e) {
      // ignore
    }
  }
  next();
});

app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: "missing" });
  try {
    const existing = await db.getUserByEmail(email);
    if (existing) return res.status(409).json({ error: "exists" });
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const created = await db.createUser({ email, name, passwordHash: hash });
    if (!created) return res.status(409).json({ error: "exists" });
    return res.json({ user: { name, email } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "missing" });
  try {
    const record = await db.getUserByEmail(email);
    if (!record) return res.status(401).json({ error: "not_found" });
    const hash = record.passwordHash || record.password;
    if (!bcrypt.compareSync(password, hash)) return res.status(401).json({ error: "invalid" });
    return res.json({ user: { name: record.name, email } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
});

// Pharmacy Data API Endpoints
app.get("/api/medicines", async (req, res) => {
  try {
    if (db.query) {
      const [rows] = await db.query("SELECT * FROM medicines ORDER BY name");
      return res.json({ medicines: rows });
    }
    return res.status(501).json({ error: "Database not configured" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
});

app.get("/api/medicines/:id", async (req, res) => {
  try {
    if (db.query) {
      const [rows] = await db.query("SELECT * FROM medicines WHERE medicine_id = ?", [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: "not_found" });
      return res.json({ medicine: rows[0] });
    }
    return res.status(501).json({ error: "Database not configured" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
});

app.get("/api/customers", async (req, res) => {
  try {
    if (db.query) {
      const [rows] = await db.query("SELECT * FROM customers ORDER BY name");
      return res.json({ customers: rows });
    }
    return res.status(501).json({ error: "Database not configured" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
});

app.get("/api/sales", async (req, res) => {
  try {
    if (db.query) {
      const [rows] = await db.query(`
        SELECT s.*, m.name as medicine_name, c.name as customer_name 
        FROM sales s 
        LEFT JOIN medicines m ON s.medicine_id = m.medicine_id 
        LEFT JOIN customers c ON s.customer_id = c.customer_id 
        ORDER BY s.date DESC
      `);
      return res.json({ sales: rows });
    }
    return res.status(501).json({ error: "Database not configured" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
});

app.get("/api/suppliers", async (req, res) => {
  try {
    if (db.query) {
      const [rows] = await db.query("SELECT * FROM suppliers ORDER BY supplier_name");
      return res.json({ suppliers: rows });
    }
    return res.status(501).json({ error: "Database not configured" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
});

app.get("/api/analytics/low-stock", async (req, res) => {
  try {
    if (db.query) {
      const threshold = req.query.threshold || 100;
      const [rows] = await db.query(
        "SELECT * FROM medicines WHERE stock < ? ORDER BY stock ASC",
        [threshold]
      );
      return res.json({ medicines: rows });
    }
    return res.status(501).json({ error: "Database not configured" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
});

app.get("/api/analytics/expiring-soon", async (req, res) => {
  try {
    if (db.query) {
      const days = req.query.days || 90;
      const [rows] = await db.query(
        `SELECT * FROM medicines 
         WHERE expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY) 
         ORDER BY expiry_date ASC`,
        [days]
      );
      return res.json({ medicines: rows });
    }
    return res.status(501).json({ error: "Database not configured" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
});

app.get("/api/analytics/sales-summary", async (req, res) => {
  try {
    if (db.query) {
      const [rows] = await db.query(`
        SELECT 
          DATE(date) as sale_date,
          COUNT(*) as total_sales,
          SUM(total_amount) as total_revenue,
          SUM(quantity) as total_items_sold
        FROM sales 
        GROUP BY DATE(date) 
        ORDER BY sale_date DESC 
        LIMIT 30
      `);
      return res.json({ summary: rows });
    }
    return res.status(501).json({ error: "Database not configured" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Mock auth server running on http://localhost:${port}`);
});
