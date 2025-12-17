/**
 * Import CSV data into the database
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
               rx_otc, pregnancy_category, csa, alcohol, rating, no_of_reviews, 
               medical_condition_url, drug_link) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const values = [
              row.drug_name || null,
              row.medical_condition || null,
              row.medical_condition_description || null,
              row.activity || null,
              row.rx_otc || null,
              row.pregnancy_category || null,
              row.csa || null,
              row.alcohol || null,
              parseFloat(row.rating) || null,
              parseInt(row.no_of_reviews) || 0,
              row.medical_condition_url || null,
              row.drug_link || null,
            ];

            try {
              await connection.execute(sql, values);
              importedCount++;
            } catch (err) {
              // Duplicate entry, skip
            }
          }
          console.log(`✅ Imported ${importedCount} drugs from drugs_for_common_treatments.csv`);
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

async function importMedicinesFromArchive2() {
  console.log("📌 Importing medicine_dataset.csv...");
  const connection = await mysql.createConnection(dbConfig);

  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(__dirname, "archive2", "medicine_dataset.csv");

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", async () => {
        try {
          let importedCount = 0;
          for (const row of results) {
            const sql = `INSERT INTO medicines 
              (medicine_name, generic_name, side_effects, usage_info, warnings) 
              VALUES (?, ?, ?, ?, ?)`;

            const values = [
              row.name || row.medicine_name || null,
              row.generic_name || null,
              row.side_effects || null,
              row.usage || null,
              row.warnings || null,
            ];

            try {
              await connection.execute(sql, values);
              importedCount++;
            } catch (err) {
              // Skip duplicates
            }
          }
          console.log(`✅ Imported ${importedCount} medicines from medicine_dataset.csv`);
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
  console.log("📌 Importing A_Z_medicines_dataset_of_India.csv...");
  const connection = await mysql.createConnection(dbConfig);

  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(__dirname, "archive3", "A_Z_medicines_dataset_of_India.csv");

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
              (name, price, is_discontinued, manufacturer_name, type, pack_size_label, composition) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`;

            const values = [
              row.name || null,
              parseFloat(row["price(₹)"]) || 0,
              row.Is_discontinued === "yes" ? true : false,
              row.manufacturer_name || null,
              row.type || null,
              row.pack_size_label || null,
              `${row.short_composition1 || ""} ${row.short_composition2 || ""}`.trim(),
            ];

            try {
              await connection.execute(sql, values);
              importedCount++;
            } catch (err) {
              // Skip duplicates
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

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", async () => {
        try {
          let importedCount = 0;
          for (const row of results) {
            const sql = `INSERT INTO pharma_companies 
              (company_name, ipc_subclass, patents_count) 
              VALUES (?, ?, ?)`;

            const values = [
              Object.keys(row)[0] || null, // Company name from first column
              row[Object.keys(row)[1]] || null, // IPC subclass
              1,
            ];

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
    const schemaPath = path.join(__dirname, "drugs_comprehensive_schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");
    const statements = schema.split(";").filter((s) => s.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }
    console.log("✅ Database schema initialized\n");
    await connection.end();

    // Import data
    await importDrugsForCommonTreatments();
    await importMedicinesFromArchive2();
    await importIndianMedicines();
    await importPharmaCompanies();

    console.log("\n✨ All data imported successfully!\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Import failed:", error);
    process.exit(1);
  }
}

runAllImports();
