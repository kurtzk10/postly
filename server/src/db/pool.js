import pg from 'pg';
import { config } from '../config.js';

// Return DATE columns as 'YYYY-MM-DD' strings instead of JS Dates, so a
// postcard's day never shifts when it is converted through a timezone.
pg.types.setTypeParser(pg.types.builtins.DATE, (value) => value);

export const pool = new pg.Pool({ connectionString: config.databaseUrl });
