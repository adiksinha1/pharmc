const mysql = require('mysql2/promise');

const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_PORT = parseInt(process.env.MYSQL_PORT || '3306', 10);
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || '';
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;
const MYSQL_SSL = process.env.MYSQL_SSL === 'true';

if (!MYSQL_HOST || !MYSQL_USER || MYSQL_PASSWORD === undefined || !MYSQL_DATABASE) {
  throw new Error('MySQL not configured. Set MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE');
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
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      email VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  return pool;
}

module.exports = {
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
};
