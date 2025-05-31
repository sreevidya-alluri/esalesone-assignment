import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,        // Not localhost on Render!
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection inside an async function or on demand
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL connected successfully!');
    connection.release();
  } catch (err) {
    console.error('MySQL connection failed:', err.message);
  }
}

testConnection();

export default pool;
