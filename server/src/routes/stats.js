import { Router } from 'express';
import { pool } from '../db/pool.js';
import { calculateStreaks } from '../lib/streaks.js';

// =============================================================================
// stats.js: the GET /api/stats route.
// Written by: me (kurtzk10). Hints by the AI; the code is mine.
// =============================================================================
//
// WHAT THIS ROUTE RETURNS (the /streaks screen expects exactly these names):
//   200  {
//          "currentStreak": 5,
//          "longestStreak": 9,
//          "totalPostcards": 10,
//          "firstPostcardDate": "2026-09-07"    // or null if there are none
//        }
//
// Open routes/templates.js next to this file: it has the same shape.
//

export const statsRouter = Router();

// =============================================================================
// STEP 3: THE GET HANDLER
// =============================================================================

// 3a. Start the handler. The path is '/', because app.js mounts this whole
//     router at /api/stats. async lets you use await inside:
//       statsRouter.get('/', async (req, res) => {
//   3b. Ask the database for every postcard date, oldest first:
//         const datesResult = await pool.query(
//           'SELECT postcard_date FROM postcards ORDER BY postcard_date ___'
//         );
//       (ASC means oldest first. No user input goes into this query, so it
//        needs no $1 parameters.)

statsRouter.get('/', async (req, res) => {
    const sql = `
    SELECT postcard_date
    FROM postcards
    ORDER BY postcard_date ASC;
    `;

    const datesResult = await pool.query(sql);
    const todayResult = await pool.query('SELECT CURRENT_DATE as today');
    const dates = datesResult.rows.map((row) => row.postcard_date);
    const today = todayResult.rows[0].today;

    const { currentStreak, longestStreak } = calculateStreaks(dates, today);

    res.json({
        currentStreak,
        longestStreak,
        totalPostcards: dates.length,
        firstPostcardDate: dates[0] ?? null,
    });
});

// =============================================================================
// STEP 4: CONNECT IT. Go to server/src/app.js and do the two TODO lines there.
//
// STEP 5: TEST IT, with `npm run dev` running:
//   curl http://localhost:4000/api/stats
// Work out the right answer by hand from your gallery first, then compare.
// =============================================================================
