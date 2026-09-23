// Deletes today's postcard so /capture can be tested again.
// Usage: npm run db:reset-today
import pg from 'pg';
import { config } from '../config.js';

const client = new pg.Client({ connectionString: config.databaseUrl });

try {
  await client.connect();
  const { rows } = await client.query(
    'DELETE FROM postcards WHERE postcard_date = CURRENT_DATE RETURNING id, caption',
  );
  if (rows.length === 0) {
    console.log('No postcard for today. Nothing to reset.');
  } else {
    console.log(`Deleted today's postcard (id ${rows[0].id}: "${rows[0].caption}").`);
  }
} catch (err) {
  console.error(`Reset failed: ${err.message}`);
  process.exitCode = 1;
} finally {
  await client.end();
}
