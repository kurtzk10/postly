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
// routes/postcards.js is your model: read it first. It has a shared SELECT,
// validation, 201/404/409 answers and catching Postgres error codes.
//
// HOW TO USE THESE HINTS: write each line directly UNDER its hint.

// =============================================================================
// STEP 1: IMPORTS
// =============================================================================

// 1a. Router (like stats.js) and pool (like stats.js).

// 1b. HttpError: throw one to answer with an error status and message.
//     Look at the top of routes/postcards.js for the exact import line.

// 1c. parseId: turns req.params.id into a number, or answers 400 by itself.
//     It lives in '../lib/validate.js'. Import just that one function.

// =============================================================================
// STEP 2: THE ROUTER
// =============================================================================

// 2a. export const capsulesRouter = ___();

// =============================================================================
// STEP 3: ONE SHARED SELECT (GET and both POSTs answer with the same shape)
// =============================================================================
// Same idea as SELECT_POSTCARD in routes/postcards.js: a const string that
// renames columns to camelCase with AS "..." and JOINs the postcard, so each
// capsule comes back with its photo and date.
//
// 3a. const SELECT_CAPSULE = `
//       SELECT c.id,
//              c.postcard_id    AS "postcardId",
//              p.image_url      AS "___",
//              p.postcard_date  AS "___",
//              c.unlock_at      AS "unlockAt",
//              c.opened_at      AS "openedAt",
//              c.unlock_at > CURRENT_DATE AS "isLocked",
//
//              -- THE IMPORTANT LINE. Only send the message once the capsule
//              -- has unlocked. Otherwise CASE gives NULL. Doing it here, in
//              -- the database, means a locked message never leaves the server,
//              -- so nobody can read it by looking at the network tab:
//              CASE WHEN c.unlock_at ___ CURRENT_DATE THEN c.message END AS message
//       FROM capsules c
//       JOIN postcards p ON p.id = c.___`;
//
//     (c and p are short names for the two tables, set in FROM and JOIN.)

// =============================================================================
// STEP 4: VALIDATION FOR "SEAL A NEW CAPSULE"
// =============================================================================
// A function that checks the POST body and returns clean values, or throws a
// 400. Compare with validateNewPostcard in lib/validate.js: same shape.
//
// 4a. function validateNewCapsule(body) {
//
// 4b.   Pull the three fields out of the body:
//         const { postcardId, message, unlockAt } = body ?? {};
//
// 4c.   postcardId must be a whole number of at least 1:
//         if (!Number.isInteger(postcardId) || postcardId < ___) {
//           throw new HttpError(400, 'postcardId must be a positive whole number');
//         }
//
// 4d.   message must be text. Trim it first, then check it isn't empty and
//       isn't longer than your column allows (the number in schema.sql):
//         if (typeof message !== '___') {
//           throw new HttpError(400, 'message must be text');
//         }
//         const trimmed = message.trim();
//         if (trimmed.length === 0 || trimmed.length > ___) {
//           throw new HttpError(400, 'message must be between 1 and ___ characters');
//         }
//
// 4e.   unlockAt must look like 'YYYY-MM-DD'. A regular expression checks the
//       shape: \d means a digit and {4} means exactly four of them:
//         if (typeof unlockAt !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(unlockAt)) {
//           throw new HttpError(400, 'unlockAt must be a date like 2027-09-21');
//         }
//       (Whether it's a REAL date, e.g. not 2027-02-30, and in the future, is
//        checked by the database in step 6.)
//
// 4f.   return { postcardId, message: ___, unlockAt };
//
// 4g. Close the function with }

// =============================================================================
// STEP 5: GET /  (list every capsule)
// =============================================================================
//
// 5a. capsulesRouter.get('/', async (req, res) => {
// 5b.   const { rows } = await pool.query(`${SELECT_CAPSULE} ORDER BY c.unlock_at ___`);
//       (soonest to unlock first)
// 5c.   res.json(rows);
// 5d. });

// =============================================================================
// STEP 6: POST /  (seal a new capsule)
// =============================================================================
//
// 6a. capsulesRouter.post('/', async (req, res) => {
//
// 6b.   Validate. If anything's wrong, this throws and Express answers 400:
//         const { postcardId, message, unlockAt } = validateNewCapsule(req.body);
//
// 6c.   Ask the DATABASE whether unlockAt is in the future. $1::date turns the
//       text into a date; an impossible date like 2027-02-30 makes Postgres
//       throw an error with code '22008' (bad format: '22007'). Catch those
//       and answer 400 instead of letting them become a 500:
//         let isFuture;
//         try {
//           const { rows } = await pool.query(
//             'SELECT $1::date > CURRENT_DATE AS "isFuture"',
//             [___],
//           );
//           isFuture = rows[0].isFuture;
//         } catch (err) {
//           if (err.code === '22008' || err.code === '22007') {
//             throw new HttpError(400, 'unlockAt is not a real date');
//           }
//           throw err;
//         }
//         if (!isFuture) {
//           throw new HttpError(400, 'unlockAt must be a future date');
//         }
//
// 6d.   Insert it. Every value goes in as a $ parameter, never glued into the
//       SQL string. Catch '23503' (foreign key violation), which means the
//       postcard doesn't exist, the same way routes/postcards.js catches it
//       for templateId:
//         let newId;
//         try {
//           const { rows } = await pool.query(
//             `INSERT INTO capsules (postcard_id, message, unlock_at)
//              VALUES ($1, $2, $3)
//              RETURNING id`,
//             [___, ___, ___],
//           );
//           newId = rows[0].id;
//         } catch (err) {
//           if (err.code === '23503') {
//             throw new HttpError(400, `There is no postcard with id ${postcardId}`);
//           }
//           throw err;
//         }
//
// 6e.   Read it back in the shared shape and answer 201 Created:
//         const { rows } = await pool.query(`${SELECT_CAPSULE} WHERE c.id = $1`, [newId]);
//         res.status(___).json(rows[0]);
//
// 6f. });

// =============================================================================
// STEP 7: POST /:id/open  (open a capsule)
// =============================================================================
// Three possible answers: 404 no such capsule, 403 still locked, 200 opened.
//
// 7a. capsulesRouter.post('/:id/open', async (req, res) => {
//
// 7b.   const id = parseId(req.params.id);      // 400 by itself if not a number
//
// 7c.   Look it up and ask whether it's still locked:
//         const found = await pool.query(
//           'SELECT unlock_at > CURRENT_DATE AS "isLocked" FROM capsules WHERE id = $1',
//           [id],
//         );
//
// 7d.   No row means no such capsule:
//         if (found.rows.length === 0) {
//           throw new HttpError(___, 'Capsule not found');
//         }
//
// 7e.   Still locked means "you're not allowed yet", which is 403 Forbidden:
//         if (found.rows[0].isLocked) {
//           throw new HttpError(___, 'This capsule is still locked');
//         }
//
// 7f.   Record when it was FIRST opened. COALESCE keeps the old value if there
//       is one, so opening it again doesn't overwrite the first time:
//         await pool.query(
//           'UPDATE capsules SET opened_at = COALESCE(opened_at, now()) WHERE id = $1',
//           [id],
//         );
//
// 7g.   Answer with the capsule, message included now that it's unlocked:
//         const { rows } = await pool.query(`${SELECT_CAPSULE} WHERE c.id = $1`, [id]);
//         res.json(rows[0]);
//
// 7h. });

// =============================================================================
// STEP 8: CONNECT IT in server/src/app.js, same as you did for stats:
//   import { capsulesRouter } from './routes/capsules.js';
//   app.use('/api/capsules', capsulesRouter);      <- above app.use(notFound)
//
// STEP 9: TEST IT. Say "review capsules" and the AI tests every status code.
// Or try it yourself in PowerShell:
//   curl.exe http://localhost:4000/api/capsules
//   curl.exe -X POST http://localhost:4000/api/capsules -H "Content-Type: application/json" -d '{\"postcardId\":1,\"message\":\"hi\",\"unlockAt\":\"2027-01-01\"}'
// =============================================================================
