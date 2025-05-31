import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'LemmeIn@',
  database: 'ecommerce',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Try a test connection and log the result
try {
  const connection = await pool.getConnection();
  console.log(' MySQL connected successfully!');
  connection.release(); // Always release the connection back to the pool
} catch (err) {
  console.error(' MySQL connection failed:', err.message);
}

export default pool;
