/**
 * Import CSV data into the database - SIMPLIFIED VERSION
 * Usage: node import-all-data.cjs
 */

const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const mysql = require("mysql2/promise");
require("dotenv").config();

const dbConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "pharmacy",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Simplified schema - only essential tables
const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS drugs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  drug_name VARCHAR(255) NOT NULL,
  medical_condition VARCHAR(255),
  medical_condition_description LONGTEXT,
  activity VARCHAR(100),
  rx_otc VARCHAR(50),
  pregnancy_category VARCHAR(50),
  rating DECIMAL(3,1),
  no_of_reviews INT,
  medical_condition_url VARCHAR(500),
  drug_link VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_drug_name (drug_name),
  INDEX idx_condition (medical_condition)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS medicines_india (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2),
  is_discontinued BOOLEAN DEFAULT FALSE,
  manufacturer_name VARCHAR(255),
  medicine_type VARCHAR(100),
  pack_size_label VARCHAR(100),
  composition VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_medicine_name (name),
  INDEX idx_manufacturer (manufacturer_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pharma_companies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  company_name VARCHAR(255) NOT NULL,
  ipc_subclass VARCHAR(50),
  patents_count INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_company_name (company_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

async function importDrugsForCommonTreatments() {
  console.log("📌 Importing drugs_for_common_treatments.csv...");
  const connection = await mysql.createConnection(dbConfig);

  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(__dirname, "drugs_for_common_treatments.csv");

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", async () => {
        try {
          let importedCount = 0;
          for (const row of results) {
            const sql = `INSERT INTO drugs 
              (drug_name, medical_condition, medical_condition_description, activity, 
               rx_otc, pregnancy_category, rating, no_of_reviews, 
               medical_condition_url, drug_link) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const values = [
              row.drug_name || null,
              row.medical_condition || null,
              row.medical_condition_description ? row.medical_condition_description.substring(0, 1000) : null,
              row.activity || null,
              row.rx_otc || null,
              row.pregnancy_category || null,
              parseFloat(row.rating) || null,
              parseInt(row.no_of_reviews) || 0,
              row.medical_condition_url || null,
              row.drug_link || null,
            ];

            try {
              await connection.execute(sql, values);
              importedCount++;
            } catch (err) {
              // Skip duplicates or errors
            }
          }
          console.log(`✅ Imported ${importedCount} drugs`);
          resolve();
        } catch (error) {
          reject(error);
        } finally {
          await connection.end();
        }
      })
      .on("error", reject);
  });
}

async function importIndianMedicines() {
  console.log("📌 Importing Indian medicines...");
  const connection = await mysql.createConnection(dbConfig);

  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(__dirname, "archive3", "A_Z_medicines_dataset_of_India.csv");

    if (!fs.existsSync(filePath)) {
      console.log("⚠️ Indian medicines file not found, skipping...");
      return resolve();
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", async () => {
        try {
          let importedCount = 0;
          for (const row of results) {
            const sql = `INSERT INTO medicines_india 
              (name, price, is_discontinued, manufacturer_name, medicine_type, pack_size_label, composition) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`;

            const values = [
              row.name || null,
              parseFloat(row["price(₹)"]) || 0,
              row.Is_discontinued === "yes" || row.Is_discontinued === "Yes" ? true : false,
              row.manufacturer_name || null,
              row.type || null,
              row.pack_size_label || null,
              `${row.short_composition1 || ""} ${row.short_composition2 || ""}`.trim().substring(0, 500),
            ];

            try {
              await connection.execute(sql, values);
              importedCount++;
            } catch (err) {
              // Skip errors
            }
          }
          console.log(`✅ Imported ${importedCount} Indian medicines`);
          resolve();
        } catch (error) {
          reject(error);
        } finally {
          await connection.end();
        }
      })
      .on("error", reject);
  });
}

async function importPharmaCompanies() {
  console.log("📌 Importing pharma companies...");
  const connection = await mysql.createConnection(dbConfig);

  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(__dirname, "archive5", "37 PHARMA COMPANY - IPC SUBCLASS MATRIX.csv");

    if (!fs.existsSync(filePath)) {
      console.log("⚠️ Pharma companies file not found, skipping...");
      return resolve();
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", async () => {
        try {
          let importedCount = 0;
          for (const row of results) {
            const keys = Object.keys(row);
            const companyName = keys[0] ? row[keys[0]] : null;
            const ipcSubclass = keys[1] ? row[keys[1]] : null;

            if (!companyName) continue;

            const sql = `INSERT INTO pharma_companies 
              (company_name, ipc_subclass, patents_count) 
              VALUES (?, ?, ?)`;

            const values = [companyName, ipcSubclass || null, 1];

            try {
              await connection.execute(sql, values);
              importedCount++;
            } catch (err) {
              // Skip duplicates
            }
          }
          console.log(`✅ Imported ${importedCount} pharma companies`);
          resolve();
        } catch (error) {
          reject(error);
        } finally {
          await connection.end();
        }
      })
      .on("error", reject);
  });
}

async function runAllImports() {
  try {
    console.log("\n🚀 Starting comprehensive data import...\n");

    // Create tables first
    const connection = await mysql.createConnection(dbConfig);
    const statements = CREATE_TABLES_SQL.split(";").filter((s) => s.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.execute(statement);
        } catch (err) {
          console.error("Schema error:", err.message);
        }
      }
    }
    console.log("✅ Database schema initialized\n");
    await connection.end();

    // Import data
    await importDrugsForCommonTreatments();
    await importIndianMedicines();
    await importPharmaCompanies();

    console.log("\n✨ All data imported successfully!\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Import failed:", error.message);
    process.exit(1);
  }
}

runAllImports();
