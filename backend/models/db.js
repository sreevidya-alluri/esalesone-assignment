import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQL_DATABASE || process.env.MYSQLDATABASE,
  port: parseInt(process.env.MYSQLPORT, 10) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

try {
  const connection = await pool.getConnection();
  console.log('MySQL connected successfully to PlanetScale!');
  connection.release();
} catch (err) {
  console.error('MySQL connection failed:', err.message);
}

export default pool
