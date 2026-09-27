import { Router } from 'express';
import { HttpError } from '../lib/httpError.js';
import { parseId } from '../lib/validate.js';
import { pool } from '../db/pool.js';

// =============================================================================
// capsules.js: the /api/capsules routes ("Future You" time capsule).
// Written by: me (kurtzk10). Hints by the AI; the code is mine.
// =============================================================================
//
// THREE ROUTES:
//   GET  /api/capsules             list every capsule. LOCKED ONES HIDE THEIR MESSAGE.
//   POST /api/capsules             seal a new one        -> 201, or 400
//   POST /api/capsules/:id/open    open one once it's unlocked -> 200, 403, 404
//
// Each capsule in a response looks like this:
//   {
//     "id": 1,
//     "postcardId": 7,
//     "imageUrl": "https://res.cloudinary.com/...",
//     "postcardDate": "2026-09-21",
//     "unlockAt": "2027-09-21",
//     "openedAt": null,               // a timestamp once opened
//     "isLocked": true,
//     "message": null                 // the real text only once unlocked
//   }
//
//

export const capsulesRouter = Router();

const SELECT_CAPSULE = `
      SELECT c.id,
             c.postcard_id    AS "postcardId",
             p.image_url      AS "imageUrl",
             p.postcard_date  AS "postcardDate",
             c.unlock_at      AS "unlockAt",
             c.opened_at      AS "openedAt",
             c.unlock_at > CURRENT_DATE AS "isLocked",
             CASE WHEN c.unlock_at <= CURRENT_DATE THEN c.message END AS message
      FROM capsules c
      JOIN postcards p ON p.id = c.postcard_id`;

function validateNewCapsule(body) {
    const { postcardId, message, unlockAt } = body ?? {};

    if (!Number.isInteger(postcardId) || postcardId < 1) {
        throw new HttpError(400, 'postcardId must be a positive whole number');
    }

    if (typeof message !== 'string') {
        throw new HttpError(400, 'message must be text');
    }
    const trimmed = message.trim();

    if (trimmed.length === 0 || trimmed.length > 500) {
        throw new HttpError(400, 'message must be between 1 and 500 characters');
    }

    if (typeof unlockAt !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(unlockAt)) {
        throw new HttpError(400, 'unlockAt must be a date like 2027-09-21');
    }

    return { postcardId, message: trimmed, unlockAt };
}

capsulesRouter.get('/', async (req, res) => {
    const { rows } = await pool.query(`${SELECT_CAPSULE} ORDER BY c.unlock_at ASC`);
    res.json(rows);
});

capsulesRouter.post('/', async (req, res) => {
    const { postcardId, message, unlockAt } = validateNewCapsule(req.body);

    let isFuture;
    try {
        const { rows } = await pool.query(
            'SELECT $1::date > CURRENT_DATE AS "isFuture"',
            [unlockAt]
        );
        isFuture = rows[0].isFuture;
    } catch (err) {
        if (err.code === '22008' || err.code === '22007') {
            throw new HttpError(400, 'unlockAt is not a real date');
        }
        throw err;
    }
    if (!isFuture) {
        throw new HttpError(400, 'unlockAt must be a future date');
    }

    let newId;
    try {
        const { rows } = await pool.query(
            `
        INSERT INTO capsules (postcard_id, message, unlock_at)
        VALUES ($1, $2, $3)
        RETURNING id;
        `,
            [postcardId, message, unlockAt]
        );
        newId = rows[0].id;
    } catch (err) {
        if (err.code === '23503') {
            throw new HttpError(400, `There is no postcard with id ${postcardId}`);
        }
        throw err;
    }

    const { rows } = await pool.query(`${SELECT_CAPSULE} WHERE c.id = $1`, [newId]);
    res.status(201).json(rows[0]);
});

capsulesRouter.post('/:id/open', async(req, res) => {
    const id = parseId(req.params.id);

    const found = await pool.query(
        'SELECT unlock_at > CURRENT_DATE as "isLocked" FROM capsules WHERE id = $1',
        [id],
    );

    if (found.rows.length === 0) {
        throw new HttpError(404, 'Capsule not found');
    }

    if (found.rows[0].isLocked) {
        throw new HttpError(403, 'This capsule is still locked');
    }

    await pool.query(
        'UPDATE capsules SET opened_at = COALESCE(opened_at, now()) WHERE id = $1',
        [id],
    );

    const { rows } = await pool.query(`${SELECT_CAPSULE} WHERE c.id = $1`, [id]);
    res.json(rows[0]);
})