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

// ============= COMPREHENSIVE DRUG SEARCH ENDPOINTS =============

// Search drugs by name
app.get("/api/drugs/search", async (req, res) => {
  try {
    const query = req.query.q || "";
    if (!query.trim()) {
      return res.json({ drugs: [], message: "Please enter a search term" });
    }

    if (db.query) {
      const searchTerm = `%${query}%`;
      const [drugs] = await db.query(
        `SELECT * FROM drugs 
         WHERE drug_name LIKE ? OR medical_condition LIKE ? 
         LIMIT 50`,
        [searchTerm, searchTerm]
      );

      if (drugs.length === 0) {
        return res.json({ 
          drugs: [], 
          message: `No drugs found for "${query}". Try searching by condition or drug name.` 
        });
      }

      return res.json({ 
        drugs, 
        count: drugs.length,
        message: `Found ${drugs.length} drug(s) matching "${query}"` 
      });
    }

    // Fallback: Search in medicines table
    return res.json({ drugs: [], message: "Database not configured" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error", message: e.message });
  }
});

// Search by medical condition
app.get("/api/drugs/condition", async (req, res) => {
  try {
    const condition = req.query.condition || "";
    if (!condition.trim()) {
      return res.json({ drugs: [], message: "Please specify a condition" });
    }

    if (db.query) {
      const searchTerm = `%${condition}%`;
      const [drugs] = await db.query(
        `SELECT DISTINCT drug_name, medical_condition, rating, no_of_reviews, activity, rx_otc 
         FROM drugs 
         WHERE medical_condition LIKE ? 
         ORDER BY rating DESC, no_of_reviews DESC
         LIMIT 100`,
        [searchTerm]
      );

      return res.json({ 
        drugs, 
        count: drugs.length,
        condition: condition,
        message: `Found ${drugs.length} drugs for treating "${condition}"` 
      });
    }

    return res.json({ drugs: [], message: "Database not configured" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
});

// Search Indian medicines
app.get("/api/medicines-india/search", async (req, res) => {
  try {
    const query = req.query.q || "";
    if (!query.trim()) {
      return res.json({ medicines: [], message: "Please enter a search term" });
    }

    if (db.query) {
      const searchTerm = `%${query}%`;
      const [medicines] = await db.query(
        `SELECT * FROM medicines_india 
         WHERE name LIKE ? OR manufacturer_name LIKE ? 
         ORDER BY price ASC
         LIMIT 50`,
        [searchTerm, searchTerm]
      );

      return res.json({ 
        medicines, 
        count: medicines.length,
        message: `Found ${medicines.length} medicine(s) in India database` 
      });
    }

    return res.json({ medicines: [], message: "Database not configured" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
});

// Get drug details including reviews and ratings
app.get("/api/drugs/:drugName", async (req, res) => {
  try {
    const drugName = req.params.drugName;

    if (db.query) {
      const [drugs] = await db.query(
        `SELECT * FROM drugs WHERE drug_name = ?`,
        [drugName]
      );

      if (drugs.length === 0) {
        return res.status(404).json({ error: "not_found", message: "Drug not found" });
      }

      const [reviews] = await db.query(
        `SELECT * FROM drug_reviews WHERE drug_name = ? LIMIT 10`,
        [drugName]
      );

      return res.json({ 
        drug: drugs[0], 
        reviews: reviews || [],
        avgRating: drugs[0].rating
      });
    }

    return res.status(501).json({ error: "Database not configured" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
});

// Advanced search with filters
app.get("/api/drugs/advanced-search", async (req, res) => {
  try {
    const { name, condition, minRating, rxOtc } = req.query;

    if (db.query) {
      let query = "SELECT * FROM drugs WHERE 1=1";
      const params = [];

      if (name) {
        query += " AND drug_name LIKE ?";
        params.push(`%${name}%`);
      }

      if (condition) {
        query += " AND medical_condition LIKE ?";
        params.push(`%${condition}%`);
      }

      if (minRating) {
        query += " AND rating >= ?";
        params.push(parseFloat(minRating));
      }

      if (rxOtc) {
        query += " AND rx_otc = ?";
        params.push(rxOtc);
      }

      query += " ORDER BY rating DESC LIMIT 100";

      const [drugs] = await db.query(query, params);

      return res.json({ 
        drugs, 
        count: drugs.length,
        filters: { name, condition, minRating, rxOtc }
      });
    }

    return res.json({ drugs: [], message: "Database not configured" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
});

// Get top rated drugs
app.get("/api/drugs/top-rated", async (req, res) => {
  try {
    const limit = req.query.limit || 10;

    if (db.query) {
      const [drugs] = await db.query(
        `SELECT DISTINCT drug_name, medical_condition, rating, no_of_reviews, activity, rx_otc 
         FROM drugs 
         WHERE rating IS NOT NULL AND rating > 0
         ORDER BY rating DESC, no_of_reviews DESC 
         LIMIT ?`,
        [parseInt(limit)]
      );

      return res.json({ 
        drugs, 
        count: drugs.length,
        message: `Top ${limit} rated drugs` 
      });
    }

    return res.json({ drugs: [], message: "Database not configured" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
});

// Get pharma companies
app.get("/api/pharma-companies", async (req, res) => {
  try {
    if (db.query) {
      const [companies] = await db.query(
        "SELECT * FROM pharma_companies ORDER BY company_name LIMIT 100"
      );
      return res.json({ companies, count: companies.length });
    }

    return res.json({ companies: [], message: "Database not configured" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Mock auth server running on http://localhost:${port}`);
});
