import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Render PostgreSQL
  },
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL Database"))
  .catch((err) => console.error("Database connection error:", err));

export default pool;
