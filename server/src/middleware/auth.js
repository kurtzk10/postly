import { pool } from '../db/pool.js';
import { HttpError } from '../lib/httpError.js';

// Put in front of every route that needs a logged-in user. The session
// remembers who logged in; this hands that id to the routes as req.userId,
// and the date it is right now IN THAT USER'S TIMEZONE as req.today
// ('YYYY-MM-DD'). Routes use req.today instead of CURRENT_DATE, which is the
// database server's date and can be a day off for the user.
export async function requireAuth(req, res, next) {
  if (!req.session.userId) {
    throw new HttpError(401, 'Please log in');
  }
  const { rows } = await pool.query(
    `SELECT to_char(now() AT TIME ZONE timezone, 'YYYY-MM-DD') AS today FROM users WHERE id = $1`,
    [req.session.userId],
  );
  if (!rows[0]) {
    throw new HttpError(401, 'Please log in'); // the account no longer exists
  }
  req.userId = req.session.userId;
  req.today = rows[0].today;
  next();
}
