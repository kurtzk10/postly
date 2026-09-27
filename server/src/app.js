import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { postcardsRouter } from './routes/postcards.js';
import { templatesRouter } from './routes/templates.js';
import { statsRouter } from './routes/stats.js';
import { capsulesRouter } from './routes/capsules.js';
import { errorHandler, notFound } from './middleware/errors.js';

export const app = express();

app.use(cors({ origin: config.clientOrigin }));
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/templates', templatesRouter);
app.use('/api/postcards', postcardsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/capsules', capsulesRouter);

app.use(notFound);
app.use(errorHandler);
