// Vercel's entry point for the API. Vercel runs this file as a serverless
// function and hands it every /api/... request (see vercel.json). It's the same
// Express app that `npm run dev` runs locally through server/src/index.js.
export { app as default } from '../server/src/app.js';
