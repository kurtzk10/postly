// Creates the database if it doesn't exist, then (re)creates the tables.
// Usage: npm run db:setup          -> empty tables
//        npm run db:seed           -> tables plus sample postcards
import { readFile } from 'node:fs/promises';
import pg from 'pg';
import { config } from '../config.js';

const withSeed = process.argv.includes('--seed');
const readSql = (name) => readFile(new URL(name, import.meta.url), 'utf8');

async function createDatabaseIfMissing() {
  const target = new URL(config.databaseUrl);
  const dbName = decodeURIComponent(target.pathname.slice(1));

  // Connect to the default "postgres" database to check for and create ours.
  const admin = new URL(config.databaseUrl);
  admin.pathname = '/postgres';
  const client = new pg.Client({ connectionString: admin.toString() });
  await client.connect();
  try {
    const { rowCount } = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
    if (rowCount === 0) {
      // Identifiers can't be parameterized; escape any double quotes instead.
      await client.query(`CREATE DATABASE "${dbName.replaceAll('"', '""')}"`);
      console.log(`Created database "${dbName}".`);
    }
  } finally {
    await client.end();
  }
}

async function main() {
  await createDatabaseIfMissing();

  const client = new pg.Client({ connectionString: config.databaseUrl });
  await client.connect();
  try {
    await client.query(await readSql('./schema.sql'));
    console.log('Tables created.');
    if (withSeed) {
      await client.query(await readSql('./seed.sql'));
      console.log('Sample postcards added.');
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(`Database setup failed: ${err.message}`);
  process.exit(1);
});
