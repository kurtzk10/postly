# AI usage

Assistant: **Claude Code** (Anthropic), running in VS Code.

The rules I set for the assistant are in [CLAUDE.md](CLAUDE.md), which it reads at the start of every session.

Keep this current as you go. Every entry needs a commit.

The first commits were made after the week 1 work was finished, so each fix listed below is included in the commit for its feature rather than in a commit of its own.

## How I used AI

| # | Date | Tool | What I asked for | What I kept or changed | Commit |
| --- | --- | --- | --- | --- | --- |
| 1 | 2026-09-24 | Claude Code | Turn my proposal, wireframes, design system and the course rubrics into a week-by-week implementation plan, plus a `.gitignore` | Kept the plan. It picked PostgreSQL because my proposal never named a database. | [`1e14e95`](https://github.com/kurtzk10/postly/commit/1e14e95) |
| 2 | 2026-09-24 | Claude Code | Scaffold the Express API: Postgres schema, seed data, a setup script that creates the database, and the postcards and templates routes | Kept. The schema enforces one postcard per day with `UNIQUE` on the date, which the API turns into a `409`. | [`79c8f51`](https://github.com/kurtzk10/postly/commit/79c8f51) [`916f0c0`](https://github.com/kurtzk10/postly/commit/916f0c0) [`aa94632`](https://github.com/kurtzk10/postly/commit/aa94632) |
| 3 | 2026-09-24 | Claude Code | Validation and error handling for every route | Kept. Tested every status code (200/201/204/400/404/409) with curl. | [`aa94632`](https://github.com/kurtzk10/postly/commit/aa94632) |
| 4 | 2026-09-24 | Claude Code | Scaffold the React client with the atomic folder structure from my wireframes doc, and Tailwind tokens from my design system | Kept, with one change to my design system (see "Where the AI got it wrong" / notes below) | [`3c84cdb`](https://github.com/kurtzk10/postly/commit/3c84cdb) |
| 5 | 2026-09-24 | Claude Code | Build `/capture`: Cloudinary upload, template picker, caption with counter, live front/back preview, save | Kept. The upload uses a sequence number so a slow earlier upload can't overwrite a newer photo. That's the race condition I named as my risk in the proposal. | [`15191cc`](https://github.com/kurtzk10/postly/commit/15191cc) [`4255ea0`](https://github.com/kurtzk10/postly/commit/4255ea0) |
| 6 | 2026-09-24 | Claude Code | Build `/gallery` and the shared postcards context | Kept | [`15191cc`](https://github.com/kurtzk10/postly/commit/15191cc) [`8695eb3`](https://github.com/kurtzk10/postly/commit/8695eb3) |
| 7 | 2026-09-24 | Claude Code | Check the layout in a headless browser at 375–1440px and take README screenshots | Found the phone overflow bug below | [`1c35580`](https://github.com/kurtzk10/postly/commit/1c35580) |
| 8 | 2026-09-24 | Claude Code | Make gallery cards clickable at `/gallery/:id` | Kept. It's a page route that reads the existing `GET /api/postcards/:id`, so the API stays named after its resource. The detail view has flip, download, and delete with a confirm step. | [`29a1ed0`](https://github.com/kurtzk10/postly/commit/29a1ed0) |
| 9 | 2026-09-24 | Claude Code | Take a photo straight from the camera, not just from the library | Kept. It uses a live `getUserMedia` viewfinder, with `capture="environment"` as a fallback. | [`cc95959`](https://github.com/kurtzk10/postly/commit/cc95959) |
| 10 | 2026-09-24 | Claude Code | A command to reset today's postcard while testing | Kept: `npm run db:reset-today` | [`2be2753`](https://github.com/kurtzk10/postly/commit/2be2753) |
| 11 | 2026-09-24 | Claude Code | Fix `npm` failing in the project root ("Could not read package.json") | Kept. A root `package.json` where `npm install` installs both halves and `npm run dev` starts both together. | [`8534ecb`](https://github.com/kurtzk10/postly/commit/8534ecb) |
| 12 | 2026-09-27 | Claude Code | Hint comments for the streaks API, which I'm writing myself | Comments only, no code, in `server/src/lib/streaks.js`, `server/src/routes/stats.js` and two `TODO` lines in `app.js`. They explain what each step should do and which edge cases to check. The code under them is mine. I removed the hints from `streaks.js` once it was done. | [`1a4e824`](https://github.com/kurtzk10/postly/commit/1a4e824) [`b7d882e`](https://github.com/kurtzk10/postly/commit/b7d882e) |
| 13 | 2026-09-27 | Claude Code | Build the `/streaks` screen on top of my `/api/stats` | Kept. Stat tiles, year heatmap, month calendar and journaling stats, following my wireframe. It uses my API for the streak numbers and works out best month, average per week and days missed from the postcards list. Filled days open the same detail modal at `/streaks/:id`, so the modal now closes back to whichever page opened it. | [`c473ca0`](https://github.com/kurtzk10/postly/commit/c473ca0) [`885671c`](https://github.com/kurtzk10/postly/commit/885671c) |
| 14 | 2026-09-27 | Claude Code | Hint comments for the capsule API and flashback, which I'm writing myself | Comments only, no code, in `server/src/db/schema.sql` (the capsules table), `server/src/routes/capsules.js` and `server/src/routes/flashback.js`. It also added a rule to my `CLAUDE.md` that the remaining features are mine to write. The code under the hints is mine. | [`99538ed`](https://github.com/kurtzk10/postly/commit/99538ed) [`724c5b7`](https://github.com/kurtzk10/postly/commit/724c5b7) |
| 15 | 2026-09-27 | Claude Code | Hint comments for the `/capsule` screen, which I'm writing myself | Comments only in six files: `CapsuleRow`, `CapsuleVault`, `SealCapsuleForm`, `CapsuleRevealModal`, `FlashbackStrip` and `CapsulePage`, following the component list in my wireframe. `CapsulePage` keeps a small placeholder until my version replaces it, so the app keeps working. The code under the hints is mine. | [`3c113b4`](https://github.com/kurtzk10/postly/commit/3c113b4) |
| 16 | 2026-09-27 | Claude Code | Update the README for my capsule and flashback API | Added my four routes to the API table, a `/capsule` section saying honestly what works and what's still being built, my files to the project map, and an updated known issue. It checked the vault really renders before writing "working now". | [`985c7ca`](https://github.com/kurtzk10/postly/commit/985c7ca) |
| 17 | 2026-10-04 | Claude Code | Fill in the course security checklist | It checked every row against the real repo and database before answering: secrets and git history, every SQL query, Postgres network settings, CORS, error responses and dependencies. That gave honest **No** answers for the superuser database login (row 15) and the missing login (row 18). It also added a Credits section to the README for the fonts and sample photos (row 30). The checklist is in my workspace (`project/SECURITY-CHECKLIST.md`). | [`e15beb4`](https://github.com/kurtzk10/postly/commit/e15beb4) |
| 18 | 2026-10-04 | Claude Code | A fill-in-the-blank boilerplate for the `return` of my `CapsulePage` | The AI put the layout straight into my `return`: the error line, the grid, the phone ordering, and the "+ New capsule" button that shows the form. Every value that comes from my own state and functions was left as a `___` blank for me to fill in. My own lines (heading, spinner, vault) were kept as I wrote them. | [`8d7c2a2`](https://github.com/kurtzk10/postly/commit/8d7c2a2) |
| 19 | 2026-10-04 | Claude Code | Make Download save the whole postcard, front and back, not just the photo | Kept. It draws both faces off-screen at a fixed size and captures them as one PNG with the `html-to-image` library. The first version saved the back in a fallback font, because the browser wouldn't let the library read Google's font CSS. It fixed that by bundling the fonts with the app (Fontsource). Tested by downloading and looking at the files. | [`5b1a419`](https://github.com/kurtzk10/postly/commit/5b1a419) |
| 20 | 2026-10-04 | Claude Code | Hint comments for gallery search, sort and month filter, which I'm writing myself | Comments only: above the list route in `server/src/routes/postcards.js` (safe filtering with `$` parameters, and why the sort direction must come from an allowed list), in a new `GalleryToolbar.jsx`, and at the top of `GalleryPage.jsx`. The existing gallery keeps working until I replace it. The code under the hints is mine. | [`dfaaf0d`](https://github.com/kurtzk10/postly/commit/dfaaf0d) [`960c86c`](https://github.com/kurtzk10/postly/commit/960c86c) |
| 21 | 2026-10-05 | Claude Code | Tidy the loose ends: test the README from a fresh clone, update the docs, date this log | It cloned the repo into an empty folder and followed my README on a throwaway database. Everything ran, but it found a placeholder clone URL, no copy commands for the `.env` files, and a preset name that didn't match `.env.example`, so it fixed those. It also documented the finished capsule screen and gallery search, took new screenshots using only sample photos (not my own), and added the dates in this table from each entry's commits. | [`0015790`](https://github.com/kurtzk10/postly/commit/0015790) |
| 22 | 2026-10-05 | Claude Code | Accounts, part 1: the server side of logging in, plus hints for my parts | It added a `users` table, made every postcard belong to a user (one postcard per day per user), sessions stored in Postgres with an httpOnly cookie, and a `requireAuth` middleware that answers 401. It scoped its own postcard routes to the logged-in user and added a demo account to the seed. For my parts it wrote hints only: the auth routes (`auth.js`) and the user filter in my stats, capsules, flashback and search routes. | [`cbc2e04`](https://github.com/kurtzk10/postly/commit/cbc2e04) [`2e20d09`](https://github.com/kurtzk10/postly/commit/2e20d09) |
| 23 | 2026-10-05 | Claude Code | Accounts, part 2: the login screens, and uploads only for logged-in users | Kept. **Log in** and **Create an account** pages (one shared form), a guard that sends logged-out visitors to `/login` and back afterwards, my email and **Log out** in the header, and a jump to the login page if the session runs out mid-use. Photo uploads now need a signature from our server (`POST /api/uploads/signature`), so only logged-in users can upload to my Cloudinary account and the API secret stays on the server. In development Vite now forwards `/api` to Express, so the app and API share one address, like they will on Vercel. Tested in a headless browser on a throwaway database: wrong password, log in, reload, log out, sign up, duplicate email, expired session, a real upload and save, and no sideways scroll at all six widths. The test image was deleted from Cloudinary afterwards. | [`9154930`](https://github.com/kurtzk10/postly/commit/9154930) [`84edadd`](https://github.com/kurtzk10/postly/commit/84edadd) |

**A note on my design system:** the AI checked the contrast ratios and found my design system's claim that "all pairs pass 4.5:1" was wrong. The slate primary `#7C8B99` is only 3.4:1 on the cream background, and white text on the gold accent is 2.3:1. We added a darker slate `#56636F` (6:1) for links and filled buttons, and used charcoal text on gold buttons (4.7:1).

## Where the AI got it wrong

### 1. Horizontal scroll on phones, and the first fix didn't work
- **Output:** the `/capture` layout used a CSS grid with a sideways-scrolling template row inside.
- **Problem:** at 375px wide the whole page scrolled sideways by 113px. The AI's first fix (`min-w-0` on the grid columns) only brought it down to 105px.
- **Fix:** the real cause was the `<fieldset>` around the templates. Browsers give fieldsets `min-inline-size: min-content`, so it grew to fit every template. Adding `min-w-0` to the fieldset fixed it. Verified at 375/639/641/1023/1025/1440px.
- **Commit:** [`4255ea0`](https://github.com/kurtzk10/postly/commit/4255ea0) (the fieldset fix is in `TemplatePicker.jsx`)

### 2. A lint warning its first fix didn't clear
- **Output:** the postcards context loaded data by calling an async `load()` function from `useEffect`.
- **Problem:** oxlint flagged `set-state-in-effect`. The AI's first change (splitting out a `reload` function) still triggered it.
- **Fix:** moved the fetch inline into the effect with a `cancelled` flag, and made `reload` bump a counter that re-runs the effect. This also stops a stale response from overwriting newer data.
- **Commit:** [`15191cc`](https://github.com/kurtzk10/postly/commit/15191cc) (`PostcardsContext.jsx`)

### 3. It tried to use Docker when I wanted a normal install
- **Output:** PostgreSQL wasn't installed, so the AI started launching Docker Desktop to run Postgres in a container.
- **Problem:** I didn't want Docker. It adds a dependency that anyone following my README would also need.
- **Fix:** I stopped it and had it install PostgreSQL 17 directly with `winget`, and the README documents the native install.
- **Commit:** [`1c35580`](https://github.com/kurtzk10/postly/commit/1c35580) (the README documents the native install)

### 4. The camera shutter could capture an empty photo
- **Output:** the camera marked itself "ready" as soon as the browser granted access.
- **Problem:** a test with Chrome's fake webcam showed the video was still 0×0 at that moment, so pressing the shutter straight away produced no image and the upload never happened.
- **Fix:** the shutter now only enables once the video's first frame has loaded (`onLoadedData`).
- **Commit:** [`cc95959`](https://github.com/kurtzk10/postly/commit/cc95959) (`CameraCapture.jsx`)

### 5. A port-clash message that said the opposite of what happened
- **Output:** a handler that printed a friendly message when port 4000 was already taken, using `server.on('error')`.
- **Problem:** Express 5 changed `app.listen` to call its callback on errors too, so the server printed "listening on port 4000" and then "port already in use".
- **Fix:** handle the error inside the `listen` callback (`app.listen(port, (err) => …)`), which is how Express 5 reports it.
- **Commit:** [`aa94632`](https://github.com/kurtzk10/postly/commit/aa94632) (`server/src/index.js`)

### 6. It deleted my postcard without being asked
- **Output:** while testing the new root scripts, the AI ran a command that included `npm run db:reset-today`.
- **Problem:** I hadn't asked for a reset, so my postcard for the day was deleted.
- **Fix:** it spotted the mistake, told me, and restored the row with the same id, image, caption and template. Only the `createdAt` timestamp changed. Lesson: an AI running commands on your real database can do real damage. Check what it ran.
- **Commit:** n/a (data, not code)

### 7. It put my reports and journal in the public project repo
- **Output:** the AI saved my weekly reports and journals in the Postly repo. It kept doing so even after we'd read the finals instructions, which say they belong in my private course workspace. It even created the week 2 versions there.
- **Problem:** Postly is going public, and the journals are personal reflections. The course keeps personal material in the private workspace. The copies in Postly weren't graded, so they only added risk.
- **Fix:** I had it check that the workspace copies contained everything, then remove the reports and journals from Postly. The report is now one file in my workspace that grows each week.
- **Commit:** [`60a921b`](https://github.com/kurtzk10/postly/commit/60a921b)

### 8. The header didn't fit between 640 and 1024px once Log out was added
- **Output:** the AI added my email and a **Log out** button to the header and checked the pages at all six widths. There was no sideways scroll, but in the 641px screenshot the logo touched the **Today** link.
- **Problem:** the logo, four nav links and the new button needed about 670px, so at 641px they were squeezed together. A "no horizontal scroll" check alone would have passed it; only looking at the screenshot showed it.
- **Fix:** between 640 and 1024px the nav links and the Log out button use less padding, and the email only shows from 1024px up (it's in the ☰ menu on phones). It then measured about 29px of space on each side of the links at 641px.
- **Commit:** [`84edadd`](https://github.com/kurtzk10/postly/commit/84edadd)

## Who wrote what

### What I wrote

- **The idea and the design documents** (`FinalProjectProposal.pdf`, `WireframeAndComponents.pdf`, `DesignSystem.pdf`, commit [`1f6e790`](https://github.com/kurtzk10/postly/commit/1f6e790)). Postly's concept, what it does, its screens, and where it's headed all came from me. I used AI to help me write these documents up.
- **The rules for my AI assistant** (`CLAUDE.md`, commit [`f1d0e70`](https://github.com/kurtzk10/postly/commit/f1d0e70)). I reworded the whole file myself, so the rules it follows are in my own words.
- **My reflection** (my weekly journals, kept in my private course workspace rather than this public repo). What I learned and my honest look back at each week are my own writing.
- **Every decision about the project.** The AI built what I asked for, but the calls were mine. For example, I refused to use Docker. After testing the app myself, I asked for clickable gallery cards, camera capture and a reset command. I set up Cloudinary and tracked down the upload error from my browser console. And I chose to be open about how much AI I used.

### What the AI wrote

The application code in `server/` and `client/` was written by Claude Code under my direction, as logged in the table above.

### An AI-written piece I can explain

*(To be written.)*
