const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error("⚠️ DATABASE_URL or POSTGRES_URL environment variable is missing!");
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false // Neon requires SSL
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
