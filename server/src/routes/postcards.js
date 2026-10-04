import { Router } from 'express';
import { pool } from '../db/pool.js';
import { HttpError } from '../lib/httpError.js';
import { parseId, validateNewPostcard } from '../lib/validate.js';

export const postcardsRouter = Router();

// Every read returns the same shape, with the template's slug and name joined in.
export const SELECT_POSTCARD = `
  SELECT p.id,
         p.image_url     AS "imageUrl",
         p.caption,
         p.template_id   AS "templateId",
         t.slug          AS "templateSlug",
         t.name          AS "templateName",
         p.postcard_date AS "date",
         p.created_at    AS "createdAt"
  FROM postcards p
  JOIN templates t ON t.id = p.template_id`;

// Postgres error codes we answer with a 4xx instead of a 500.
const UNIQUE_VIOLATION = '23505';
const FOREIGN_KEY_VIOLATION = '23503';

// Only ever finds the logged-in user's own postcard. Someone else's id gets
// the same 404 as an id that doesn't exist, so it can't be used to probe.
async function findPostcard(id, userId) {
  const { rows } = await pool.query(`${SELECT_POSTCARD} WHERE p.id = $1 AND p.user_id = $2`, [id, userId]);
  return rows[0];
}

// =============================================================================
// GET /api/postcards: the gallery list, with search, month filter and sort.
// Written by: me (kurtzk10). Hints by the AI; the code is mine.
// =============================================================================
//
// GET /api/postcards?q=tulip&month=2026-09&sort=oldest   (all three optional)
//   q      text to find in captions, ignoring upper/lower case
//   month  'YYYY-MM': only postcards from that month
//   sort   'newest' (the default) or 'oldest'
// With no filters it answers exactly as before: every postcard, newest first.
// A bad value gets a 400.

postcardsRouter.get('/', async (req, res) => {
  const { q = '', month = '', sort = 'newest' } = req.query;

  if (typeof q !== 'string' || typeof month !== 'string') {
    throw new HttpError(400, 'query and month must each be given once, as text')
  }

  if (q.length > 100) {
    throw new HttpError(400, 'query must not exceed 100 characters')
  }

  if (month && !/^\d{4}-\d{2}$/.test(month)) {
    throw new HttpError(400, 'month must look like 2026-09')
  }

  if (sort !== 'newest' && sort !== 'oldest') {
    throw new HttpError(400, 'sort must be either oldest or newest')
  }
  
  const conditions = ['p.user_id = $1'];
  const values = [req.userId];

  if (q) {
    values.push(`%${q}%`);
    conditions.push(`p.caption ILIKE $${values.length}`);
  }

  if (month) {
    values.push(month)
    conditions.push(`to_char(p.postcard_date, 'YYYY-MM') = $${values.length}`);
  }

  const direction = sort === 'oldest' ? 'ASC' : 'DESC';

  const where = `WHERE ${conditions.join(' AND ')}`
  const { rows } = await pool.query(
    `${SELECT_POSTCARD} ${where} ORDER BY p.postcard_date ${direction}`,
    values,
  );
  res.json(rows);
});

// Declared before /:id so "today" isn't read as an id.
postcardsRouter.get('/today', async (req, res) => {
  const { rows } = await pool.query(
    `${SELECT_POSTCARD} WHERE p.user_id = $1 AND p.postcard_date = CURRENT_DATE`,
    [req.userId],
  );
  if (!rows[0]) throw new HttpError(404, "Today's postcard hasn't been made yet");
  res.json(rows[0]);
});

postcardsRouter.get('/:id', async (req, res) => {
  const postcard = await findPostcard(parseId(req.params.id), req.userId);
  if (!postcard) throw new HttpError(404, 'Postcard not found');
  res.json(postcard);
});

postcardsRouter.post('/', async (req, res) => {
  const { imageUrl, caption, templateId } = validateNewPostcard(req.body);
  try {
    const { rows } = await pool.query(
      `INSERT INTO postcards (user_id, image_url, caption, template_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [req.userId, imageUrl, caption, templateId],
    );
    res.status(201).json(await findPostcard(rows[0].id, req.userId));
  } catch (err) {
    if (err.code === UNIQUE_VIOLATION) {
      throw new HttpError(409, "Today's postcard has already been made");
    }
    if (err.code === FOREIGN_KEY_VIOLATION) {
      throw new HttpError(400, `There is no template with id ${templateId}`);
    }
    throw err;
  }
});

postcardsRouter.delete('/:id', async (req, res) => {
  const { rowCount } = await pool.query('DELETE FROM postcards WHERE id = $1 AND user_id = $2', [
    parseId(req.params.id),
    req.userId,
  ]);
  if (rowCount === 0) throw new HttpError(404, 'Postcard not found');
  res.status(204).end();
});
