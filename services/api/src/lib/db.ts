import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL must be set to connect to PostgreSQL.');
}

const pool = new Pool({ connectionString });

export default pool;