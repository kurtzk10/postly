import express from 'express';
import cors from 'cors';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { config } from './config.js';
import { pool } from './db/pool.js';
import { postcardsRouter } from './routes/postcards.js';
import { templatesRouter } from './routes/templates.js';
import { statsRouter } from './routes/stats.js';
import { capsulesRouter } from './routes/capsules.js';
import { flashbackRouter } from './routes/flashback.js';
// TODO (me): import authRouter from './routes/auth.js' here.
import { requireAuth } from './middleware/auth.js';
import { errorHandler, notFound } from './middleware/errors.js';

export const app = express();

const PgStore = connectPgSimple(session);

// Behind Vercel's proxy, Express needs this to know the request was https,
// or it won't send a `secure` cookie.
app.set('trust proxy', 1);

app.use(cors({ origin: config.clientOrigin, credentials: true }));
app.use(express.json({ limit: '10kb' }));

// Logins. The browser only gets a signed, random session id in a cookie;
// who it belongs to lives in the `session` table.
app.use(
  session({
    store: new PgStore({ pool }),
    name: 'postly.sid',
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // page scripts can't read it, so an injected script can't steal it
      sameSite: 'lax', // not sent on cross-site form posts
      secure: config.isProduction, // https only, once deployed
      maxAge: 30 * 24 * 60 * 60 * 1000, // stay logged in for 30 days
    },
  }),
);

app.get('/api/health', (req, res) => res.json({ ok: true }));

// TODO (me): mount authRouter at '/api/auth' HERE, above requireAuth:
// you can't be required to be logged in to sign up or log in.

// Everything below needs a logged-in user (401 otherwise).
app.use('/api', requireAuth);
app.use('/api/templates', templatesRouter);
app.use('/api/postcards', postcardsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/capsules', capsulesRouter);
app.use('/api/flashback', flashbackRouter);

app.use(notFound);
app.use(errorHandler);
