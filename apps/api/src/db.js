import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/tunemavens';

export const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 5000 // 5 seconds timeout
});

// Resilient test query to log connectivity on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.warn('\n[Database Warning] Unable to establish connection to PostgreSQL.');
    console.warn(`[DATABASE URL] ${connectionString}`);
    console.warn('[Action Required] Ensure PostgreSQL is running locally and the database exists. Server will run with mock data fallback.\n');
  } else {
    console.log(`[Database Connection] PostgreSQL database connected successfully at ${res.rows[0].now}`);
  }
});
