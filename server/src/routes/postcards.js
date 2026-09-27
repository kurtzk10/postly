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

async function findPostcard(id) {
  const { rows } = await pool.query(`${SELECT_POSTCARD} WHERE p.id = $1`, [id]);
  return rows[0];
}

postcardsRouter.get('/', async (req, res) => {
  const { rows } = await pool.query(`${SELECT_POSTCARD} ORDER BY p.postcard_date DESC`);
  res.json(rows);
});

// Declared before /:id so "today" isn't read as an id.
postcardsRouter.get('/today', async (req, res) => {
  const { rows } = await pool.query(`${SELECT_POSTCARD} WHERE p.postcard_date = CURRENT_DATE`);
  if (!rows[0]) throw new HttpError(404, "Today's postcard hasn't been made yet");
  res.json(rows[0]);
});

postcardsRouter.get('/:id', async (req, res) => {
  const postcard = await findPostcard(parseId(req.params.id));
  if (!postcard) throw new HttpError(404, 'Postcard not found');
  res.json(postcard);
});

postcardsRouter.post('/', async (req, res) => {
  const { imageUrl, caption, templateId } = validateNewPostcard(req.body);
  try {
    const { rows } = await pool.query(
      `INSERT INTO postcards (image_url, caption, template_id)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [imageUrl, caption, templateId],
    );
    res.status(201).json(await findPostcard(rows[0].id));
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
  const { rowCount } = await pool.query('DELETE FROM postcards WHERE id = $1', [parseId(req.params.id)]);
  if (rowCount === 0) throw new HttpError(404, 'Postcard not found');
  res.status(204).end();
});
