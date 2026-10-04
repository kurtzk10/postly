import { Router } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { pool } from '../db/pool.js';
import { HttpError } from '../lib/httpError.js';
import { readTimeZone } from '../lib/timezone.js';

// =============================================================================
// auth.js: sign up, log in, log out, and "who am I?".
// Written by: me (kurtzk10). Hints by the AI; the code is mine.
// =============================================================================
//
// FOUR ROUTES (all under /api/auth, mounted in app.js ABOVE requireAuth):
//   POST /api/auth/signup  { email, password }  -> 201 { id, email }, now logged in
//                                                  400 bad input, 409 email already used
//   POST /api/auth/login   { email, password }  -> 200 { id, email }, now logged in
//                                                  400 bad input, 401 wrong email or password
//   POST /api/auth/logout                       -> 204, logged out
//   GET  /api/auth/me                           -> 200 { id, email }, or 401 if not logged in
//
// HOW LOGGING IN WORKS HERE: express-session (set up in app.js) gives every
// browser a session. "Logged in" just means you've stored the user's id in
// it: req.session.userId = user.id. requireAuth checks for exactly that.

export const authRouter = Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: { error: 'Too many attempts. Try again in 15 minutes.' },
})

function regenerateSession(req) {
    return new Promise((resolve, reject) =>
        req.session.regenerate((err) => (err ? reject(err) : resolve())));
}

function destroySession(req) {
    return new Promise((resolve, reject) =>
        req.session.destroy((err) => (err ? reject(err) : resolve())));
}

function validateCredentials(body) {
    const { email, password } = body ?? {};
    if (typeof email !== 'string' || typeof password !== 'string') {
        throw new HttpError(400, 'email and password are required');
    }
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        throw new HttpError(400, 'That doesn\'t look like an email address');
    }
    if (password.length < 8 || password.length > 72) {
        throw new HttpError(400, 'password must be 8 to 72 characters');
    }
    return { email: cleanEmail, password };
}

authRouter.post('/signup', authLimiter, async (req, res) => {
    const { email, password } = validateCredentials(req.body);
    const timeZone = (await readTimeZone(req.body.timeZone)) ?? 'UTC';
    const passwordHash = await bcrypt.hash(password, 12);

    let user;
    try {
        const { rows } = await pool.query(
            'INSERT INTO users (email, password_hash, timezone) VALUES ($1, $2, $3) RETURNING id, email',
            [email, passwordHash, timeZone],
        );
        user = rows[0];
    } catch (err) {
        if (err.code === '23505') throw new HttpError(409, 'An account with that email already exists');
        throw err;
    }

    await regenerateSession(req);
    req.session.userId = user.id;
    res.status(201).json(user);
})

authRouter.post('/login', authLimiter, async (req, res) => {
    const { email, password } = validateCredentials(req.body);
    const { rows } = await pool.query(
        'SELECT id, email, password_hash FROM users WHERE email = $1', [email]
    );
    const user = rows[0];

    const ok = user && (await bcrypt.compare(password, user.password_hash));

    if (!ok) throw new HttpError(401, 'Wrong email or password');

    // Follow the user if they've moved timezone since last time.
    const timeZone = await readTimeZone(req.body.timeZone);
    if (timeZone) {
        await pool.query('UPDATE users SET timezone = $1 WHERE id = $2', [timeZone, user.id]);
    }

    await regenerateSession(req);
    req.session.userId = user.id;
    res.json({ id: user.id, email: user.email })
})

authRouter.post('/logout', async (req, res) => {
    await destroySession(req);
    res.clearCookie('postly.sid');
    res.status(204).end();
})

authRouter.get('/me', async (req, res) => {
    if (!req.session.userId) throw new HttpError(401, 'Not logged in');
    const { rows } = await pool.query(
        'SELECT id, email FROM users WHERE id = $1', [req.session.userId]
    );
    if (!rows[0]) throw new HttpError(401, 'Not logged in');
    res.json(rows[0]);
});