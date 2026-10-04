// Deletes today's postcard so /capture can be tested again. "Today" is each
// user's own today, in their timezone.
// Usage: npm run db:reset-today
import pg from 'pg';
import { config } from '../config.js';

const client = new pg.Client({ connectionString: config.databaseUrl });

try {
  await client.connect();
  const { rows } = await client.query(
    `DELETE FROM postcards p
     USING users u
     WHERE u.id = p.user_id AND p.postcard_date = (now() AT TIME ZONE u.timezone)::date
     RETURNING p.id, p.caption, u.email`,
  );
  if (rows.length === 0) {
    console.log('No postcard for today. Nothing to reset.');
  }
  for (const row of rows) {
    console.log(`Deleted today's postcard for ${row.email} (id ${row.id}: "${row.caption}").`);
  }
} catch (err) {
  console.error(`Reset failed: ${err.message}`);
  process.exitCode = 1;
} finally {
  await client.end();
}
