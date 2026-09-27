import { Router } from 'express';
import { HttpError } from '../lib/httpError.js';
import { pool } from '../db/pool.js';
import { SELECT_POSTCARD } from './postcards.js';

// =============================================================================
// flashback.js: the GET /api/flashback route.
// Written by: me (kurtzk10). Hints by the AI; the code is mine.
// =============================================================================
//
// The /capsule screen shows one past postcard as a "flashback":
//   - the postcard from ON THIS DAY LAST YEAR, if there is one,
//   - otherwise a RANDOM older postcard (not today's),
//   - and if there are no older postcards at all: 404.
//
// Answer:  200  { "reason": "on-this-day", "postcard": { ...same shape as
//                                                       GET /api/postcards/:id } }
//          200  { "reason": "random", "postcard": { ... } }
//          404  { "error": "No postcards to look back on yet" }
//

export const flashbackRouter = Router();

flashbackRouter.get('/', async (req, res) => {
    const yearAgo = await pool.query(`${SELECT_POSTCARD} WHERE p.postcard_date = (CURRENT_DATE - INTERVAL '1 year')::date;`);
    if (yearAgo.rows.length !== 0) {
        return res.json({ "reason": "on-this-day", "postcard": yearAgo.rows[0] })
    }

    const random = await pool.query(`${SELECT_POSTCARD} WHERE p.postcard_date < CURRENT_DATE ORDER BY random() LIMIT 1;`);
    if (random.rows.length !== 0) {
        return res.json({ "reason": "random", "postcard": random.rows[0] });
    }

    throw new HttpError(404, 'No postcards to look back on yet');
})
