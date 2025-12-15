const mysql = require('mysql2/promise');

const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_PORT = parseInt(process.env.MYSQL_PORT || '3306', 10);
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;
const MYSQL_SSL = process.env.MYSQL_SSL === 'true';

if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
  throw new Error('MySQL not configured. Set MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE in .env');
}

let pool;

async function getPool() {
  if (pool) return pool;
  pool = mysql.createPool({
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: false,
    ssl: MYSQL_SSL ? { rejectUnauthorized: false } : undefined,
  });

  // Initialize tables
  await initializeTables(pool);
  return pool;
}

async function initializeTables(pool) {
  // Users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      email VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Queries table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS queries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_email VARCHAR(255) NOT NULL,
      query_text TEXT NOT NULL,
      query_type VARCHAR(50),
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE,
      INDEX idx_user_email (user_email),
      INDEX idx_status (status),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Results table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS results (
      id INT AUTO_INCREMENT PRIMARY KEY,
      query_id INT NOT NULL,
      result_data JSON,
      result_type VARCHAR(50),
      confidence_score DECIMAL(5,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (query_id) REFERENCES queries(id) ON DELETE CASCADE,
      INDEX idx_query_id (query_id),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Agent activities table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS agent_activities (
      id INT AUTO_INCREMENT PRIMARY KEY,
      agent_name VARCHAR(100) NOT NULL,
      activity_type VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL,
      details JSON,
      started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP NULL,
      INDEX idx_agent_name (agent_name),
      INDEX idx_activity_type (activity_type),
      INDEX idx_status (status),
      INDEX idx_started_at (started_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Reports table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reports (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_email VARCHAR(255) NOT NULL,
      report_name VARCHAR(255) NOT NULL,
      report_type VARCHAR(50),
      report_data JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE,
      INDEX idx_user_email (user_email),
      INDEX idx_report_type (report_type),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Visual insights table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS visual_insights (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_email VARCHAR(255) NOT NULL,
      insight_type VARCHAR(50) NOT NULL,
      insight_data JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE,
      INDEX idx_user_email (user_email),
      INDEX idx_insight_type (insight_type),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

module.exports = {
  // User operations
  async getUserByEmail(email) {
    const conn = await getPool();
    const [rows] = await conn.query(
      'SELECT email, name, password_hash AS passwordHash FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    return rows && rows[0] ? rows[0] : null;
  },

  async createUser({ email, name, passwordHash }) {
    const conn = await getPool();
    try {
      await conn.query(
        'INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)',
        [email, name, passwordHash]
      );
      return { email, name };
    } catch (err) {
      if (err && err.code === 'ER_DUP_ENTRY') return null;
      throw err;
    }
  },

  // Query operations
  async createQuery(userEmail, queryText, queryType = 'general') {
    const conn = await getPool();
    const [result] = await conn.query(
      'INSERT INTO queries (user_email, query_text, query_type, status) VALUES (?, ?, ?, ?)',
      [userEmail, queryText, queryType, 'pending']
    );
    return result.insertId;
  },

  async getQueryById(id) {
    const conn = await getPool();
    const [rows] = await conn.query(
      'SELECT * FROM queries WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },

  async getUserQueries(userEmail, limit = 50) {
    const conn = await getPool();
    const [rows] = await conn.query(
      'SELECT * FROM queries WHERE user_email = ? ORDER BY created_at DESC LIMIT ?',
      [userEmail, limit]
    );
    return rows;
  },

  async updateQueryStatus(id, status) {
    const conn = await getPool();
    await conn.query(
      'UPDATE queries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );
  },

  // Result operations
  async createResult(queryId, resultData, resultType, confidenceScore) {
    const conn = await getPool();
    const [result] = await conn.query(
      'INSERT INTO results (query_id, result_data, result_type, confidence_score) VALUES (?, ?, ?, ?)',
      [queryId, JSON.stringify(resultData), resultType, confidenceScore]
    );
    return result.insertId;
  },

  async getResultsByQueryId(queryId) {
    const conn = await getPool();
    const [rows] = await conn.query(
      'SELECT * FROM results WHERE query_id = ? ORDER BY created_at DESC',
      [queryId]
    );
    return rows.map(row => ({
      ...row,
      result_data: JSON.parse(row.result_data || '{}')
    }));
  },

  // Agent activity operations
  async createAgentActivity(agentName, activityType, status, details = {}) {
    const conn = await getPool();
    const [result] = await conn.query(
      'INSERT INTO agent_activities (agent_name, activity_type, status, details) VALUES (?, ?, ?, ?)',
      [agentName, activityType, status, JSON.stringify(details)]
    );
    return result.insertId;
  },

  async updateAgentActivity(id, status, completedAt = null) {
    const conn = await getPool();
    if (completedAt) {
      await conn.query(
        'UPDATE agent_activities SET status = ?, completed_at = ? WHERE id = ?',
        [status, completedAt, id]
      );
    } else {
      await conn.query(
        'UPDATE agent_activities SET status = ? WHERE id = ?',
        [status, id]
      );
    }
  },

  async getAgentActivities(limit = 100) {
    const conn = await getPool();
    const [rows] = await conn.query(
      'SELECT * FROM agent_activities ORDER BY started_at DESC LIMIT ?',
      [limit]
    );
    return rows.map(row => ({
      ...row,
      details: JSON.parse(row.details || '{}')
    }));
  },

  // Report operations
  async createReport(userEmail, reportName, reportType, reportData) {
    const conn = await getPool();
    const [result] = await conn.query(
      'INSERT INTO reports (user_email, report_name, report_type, report_data) VALUES (?, ?, ?, ?)',
      [userEmail, reportName, reportType, JSON.stringify(reportData)]
    );
    return result.insertId;
  },

  async getUserReports(userEmail, limit = 50) {
    const conn = await getPool();
    const [rows] = await conn.query(
      'SELECT * FROM reports WHERE user_email = ? ORDER BY created_at DESC LIMIT ?',
      [userEmail, limit]
    );
    return rows.map(row => ({
      ...row,
      report_data: JSON.parse(row.report_data || '{}')
    }));
  },

  // Visual insights operations
  async createVisualInsight(userEmail, insightType, insightData) {
    const conn = await getPool();
    const [result] = await conn.query(
      'INSERT INTO visual_insights (user_email, insight_type, insight_data) VALUES (?, ?, ?)',
      [userEmail, insightType, JSON.stringify(insightData)]
    );
    return result.insertId;
  },

  async getUserInsights(userEmail, limit = 50) {
    const conn = await getPool();
    const [rows] = await conn.query(
      'SELECT * FROM visual_insights WHERE user_email = ? ORDER BY created_at DESC LIMIT ?',
      [userEmail, limit]
    );
    return rows.map(row => ({
      ...row,
      insight_data: JSON.parse(row.insight_data || '{}')
    }));
  },

  // Utility
  async testConnection() {
    try {
      const conn = await getPool();
      await conn.query('SELECT 1');
      return true;
    } catch (err) {
      console.error('Database connection test failed:', err);
      return false;
    }
  }
};
