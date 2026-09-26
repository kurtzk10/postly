// =============================================================================
// flashback.js: the GET /api/flashback route.
// Written by: me (kurtzk10). Hints by the AI; the code is mine.
// =============================================================================
//
// The /capsule screen shows one past postcard as a "flashback":
//   - the postcard from ON THIS DAY LAST YEAR, if there is one,
//   - otherwise a RANDOM older postcard (not today's),
//   - and if there are no older postcards at all: 404.
//
// Answer:  200  { "reason": "on-this-day", "postcard": { ...same shape as
//                                                       GET /api/postcards/:id } }
//          200  { "reason": "random", "postcard": { ... } }
//          404  { "error": "No postcards to look back on yet" }
//
// These hints say WHAT to do, not the exact line. Use routes/postcards.js and
// your own stats.js / capsules.js for the patterns.

// STEP 1: imports. You need Router, pool and HttpError.

// STEP 2: create and export flashbackRouter.

// STEP 3: the postcard shape. GET /api/postcards/:id already answers with the
// shape you want. Open routes/postcards.js and look at the query it uses
// (SELECT_POSTCARD). It isn't exported, so either export it from there and
// import it here, or write the same columns here. Exporting it is better:
// one copy of the query means one place to fix. (That edit to
// postcards.js is a one-word change you'd make yourself.)

// STEP 4: the GET '/' handler (async).

//   4a. Try "on this day last year" first. In SQL, a year ago as a DATE is:
//         (CURRENT_DATE - INTERVAL '1 year')::date
//       Add a WHERE on postcard_date equal to that.

//   4b. If that found a row, answer with reason 'on-this-day' and that
//       postcard, then return so nothing below runs.

//   4c. Otherwise pick a random postcard that is NOT from today:
//         ... WHERE p.postcard_date < CURRENT_DATE ORDER BY random() LIMIT 1

//   4d. If that found a row, answer with reason 'random' and that postcard.

//   4e. If neither found anything, throw an HttpError with the right status
//       (the resource you asked for doesn't exist) and the message above.

// STEP 5: connect it in app.js at '/api/flashback', above notFound.

// STEP 6: test it. Your data has no postcard from a year ago, so you should
// get 'random'. Call it a few times; the postcard should change.
