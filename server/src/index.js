import { app } from './app.js';
import { config } from './config.js';
import { pool } from './db/pool.js';

// Fail fast with a readable message if Postgres isn't reachable.
try {
  await pool.query('SELECT 1');
} catch (err) {
  console.error(`Could not connect to the database: ${err.message}`);
  console.error('Check DATABASE_URL in server/.env and that PostgreSQL is running.');
  process.exit(1);
}

// Express 5 calls this on failure too, passing the error.
app.listen(config.port, (err) => {
  if (err) {
    console.error(
      err.code === 'EADDRINUSE'
        ? `Port ${config.port} is already in use. Is Postly already running in another terminal?`
        : `Server error: ${err.message}`,
    );
    process.exit(1);
  }
  console.log(`Postly API listening on http://localhost:${config.port}`);
});
