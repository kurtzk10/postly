import { pool } from '../db/pool.js';
import { HttpError } from './httpError.js';

// Checks a timezone name sent by the browser (e.g. 'Asia/Kuala_Lumpur')
// against the list Postgres knows, since Postgres is what does the date maths.
// Returns the name, or null if none was sent; throws a 400 if it isn't real.
export async function readTimeZone(value) {
  if (value === undefined) return null;
  if (typeof value !== 'string' || value.length > 64) {
    throw new HttpError(400, 'timeZone must be a timezone name like Asia/Kuala_Lumpur');
  }
  const { rows } = await pool.query('SELECT 1 FROM pg_timezone_names WHERE name = $1', [value]);
  if (!rows[0]) throw new HttpError(400, `${value} is not a timezone Postly knows`);
  return value;
}
