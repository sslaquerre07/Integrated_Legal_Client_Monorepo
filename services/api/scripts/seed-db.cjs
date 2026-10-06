const { readFile } = require('node:fs/promises');
const path = require('node:path');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL must be set to seed the database.');
}

const seedFile = path.resolve(
  __dirname,
  '../../../.devcontainer/init-scripts/seed.sql',
);

async function seedDatabase() {
  const sql = await readFile(seedFile, 'utf8');
  const pool = new Pool({ connectionString });

  try {
    await pool.query(sql);
  } finally {
    await pool.end();
  }
}

seedDatabase().catch((error) => {
  console.error('Failed to seed the database:', error);
  process.exitCode = 1;
});
