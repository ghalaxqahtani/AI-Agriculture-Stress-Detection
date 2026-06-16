import mysql from "mysql2";
import dotenv from "dotenv";

// Load environment variables from the .env file for security
dotenv.config();

/**
 * Create a connection to the MySQL database.
 * Sensitive credentials (like the password) are securely loaded 
 * from environment variables to prevent hardcoding secrets.
 */
const db = mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "StressAnalysis",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306
});

/**
 * Establish the connection to the database and handle initialization results.
 */
db.connect((err) => {
  if (err) {
    console.log("❌ DB connection error:", err);
  } else {
    console.log("✅ Database connected successfully");
  }
});

// Export the database instance to be used across the application routers
export default db;