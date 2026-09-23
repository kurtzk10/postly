import { Router } from 'express';
import { pool } from '../db/pool.js';

export const templatesRouter = Router();

templatesRouter.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT id, slug, name FROM templates ORDER BY id');
  res.json(rows);
});
