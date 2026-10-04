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

statsRouter.get('/', async (req, res) => {
    const sql = `
    SELECT postcard_date
    FROM postcards
    WHERE user_id = $1
    ORDER BY postcard_date ASC;
    `;
    const datesResult = await pool.query(sql, [req.userId]);
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
