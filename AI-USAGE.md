# AI usage

Assistant: **Claude Code** (Anthropic), running in VS Code.

The rules I set for the assistant are in [CLAUDE.md](CLAUDE.md), which it reads at the start of every session.

Keep this current as you go. Every entry needs a commit.

The first commits were made after the week 1 work was finished, so each fix listed below is included in the commit for its feature rather than in a commit of its own. The IDs become clickable links once the repo is on GitHub.

## How I used AI

| # | Tool | What I asked for | What I kept or changed | Commit |
| --- | --- | --- | --- | --- |
| 1 | Claude Code | Turn my proposal, wireframes, design system and the course rubrics into a week-by-week implementation plan, plus a `.gitignore` | Kept the plan. It picked PostgreSQL because my proposal never named a database. | `9456237` |
| 2 | Claude Code | Scaffold the Express API: Postgres schema, seed data, a setup script that creates the database, and the postcards and templates routes | Kept. The schema enforces one postcard per day with `UNIQUE` on the date, which the API turns into a `409`. | `c325c8c` `de39fbd` `79c126a` |
| 3 | Claude Code | Validation and error handling for every route | Kept. Tested every status code (200/201/204/400/404/409) with curl. | `79c126a` |
| 4 | Claude Code | Scaffold the React client with the atomic folder structure from my wireframes doc, and Tailwind tokens from my design system | Kept, with one change to my design system (see "Where the AI got it wrong" / notes below) | `d038eb8` |
| 5 | Claude Code | Build `/capture`: Cloudinary upload, template picker, caption with counter, live front/back preview, save | Kept. The upload uses a sequence number so a slow earlier upload can't overwrite a newer photo. That's the race condition I named as my risk in the proposal. | `9dcf9c2` `e528744` |
| 6 | Claude Code | Build `/gallery` and the shared postcards context | Kept | `9dcf9c2` `fb02457` |
| 7 | Claude Code | Check the layout in a headless browser at 375–1440px and take README screenshots | Found the phone overflow bug below | `bf80d35` |
| 8 | Claude Code | Make gallery cards clickable at `/gallery/:id` | Kept. It's a page route that reads the existing `GET /api/postcards/:id`, so the API stays named after its resource. The detail view has flip, download, and delete with a confirm step. | `f3b6413` |
| 9 | Claude Code | Take a photo straight from the camera, not just from the library | Kept. It uses a live `getUserMedia` viewfinder, with `capture="environment"` as a fallback. | `e18c9df` |
| 10 | Claude Code | A command to reset today's postcard while testing | Kept: `npm run db:reset-today` | `43c2902` |
| 11 | Claude Code | Fix `npm` failing in the project root ("Could not read package.json") | Kept. A root `package.json` where `npm install` installs both halves and `npm run dev` starts both together. | `4b525a3` |

**A note on my design system:** the AI checked the contrast ratios and found my design system's claim that "all pairs pass 4.5:1" was wrong. The slate primary `#7C8B99` is only 3.4:1 on the cream background, and white text on the gold accent is 2.3:1. We added a darker slate `#56636F` (6:1) for links and filled buttons, and used charcoal text on gold buttons (4.7:1).

## Where the AI got it wrong

### 1. Horizontal scroll on phones, and the first fix didn't work
- **Output:** the `/capture` layout used a CSS grid with a sideways-scrolling template row inside.
- **Problem:** at 375px wide the whole page scrolled sideways by 113px. The AI's first fix (`min-w-0` on the grid columns) only brought it down to 105px.
- **Fix:** the real cause was the `<fieldset>` around the templates. Browsers give fieldsets `min-inline-size: min-content`, so it grew to fit every template. Adding `min-w-0` to the fieldset fixed it. Verified at 375/639/641/1023/1025/1440px.
- **Commit:** `e528744` (the fieldset fix is in `TemplatePicker.jsx`)

### 2. A lint warning its first fix didn't clear
- **Output:** the postcards context loaded data by calling an async `load()` function from `useEffect`.
- **Problem:** oxlint flagged `set-state-in-effect`. The AI's first change (splitting out a `reload` function) still triggered it.
- **Fix:** moved the fetch inline into the effect with a `cancelled` flag, and made `reload` bump a counter that re-runs the effect. This also stops a stale response from overwriting newer data.
- **Commit:** `9dcf9c2` (`PostcardsContext.jsx`)

### 3. It tried to use Docker when I wanted a normal install
- **Output:** PostgreSQL wasn't installed, so the AI started launching Docker Desktop to run Postgres in a container.
- **Problem:** I didn't want Docker. It adds a dependency that anyone following my README would also need.
- **Fix:** I stopped it and had it install PostgreSQL 17 directly with `winget`, and the README documents the native install.
- **Commit:** `bf80d35` (the README documents the native install)

### 4. The camera shutter could capture an empty photo
- **Output:** the camera marked itself "ready" as soon as the browser granted access.
- **Problem:** a test with Chrome's fake webcam showed the video was still 0×0 at that moment, so pressing the shutter straight away produced no image and the upload never happened.
- **Fix:** the shutter now only enables once the video's first frame has loaded (`onLoadedData`).
- **Commit:** `e18c9df` (`CameraCapture.jsx`)

### 5. A port-clash message that said the opposite of what happened
- **Output:** a handler that printed a friendly message when port 4000 was already taken, using `server.on('error')`.
- **Problem:** Express 5 changed `app.listen` to call its callback on errors too, so the server printed "listening on port 4000" and then "port already in use".
- **Fix:** handle the error inside the `listen` callback (`app.listen(port, (err) => …)`), which is how Express 5 reports it.
- **Commit:** `79c126a` (`server/src/index.js`)

### 6. It deleted my postcard without being asked
- **Output:** while testing the new root scripts, the AI ran a command that included `npm run db:reset-today`.
- **Problem:** I hadn't asked for a reset, so my postcard for the day was deleted.
- **Fix:** it spotted the mistake, told me, and restored the row with the same id, image, caption and template. Only the `createdAt` timestamp changed. Lesson: an AI running commands on your real database can do real damage. Check what it ran.
- **Commit:** n/a (data, not code)

## Who wrote what

*Fill this in yourself, in your own words. The rubric wants your own parts named with the file and commit, and one AI-written piece explained as clearly as if you'd written it.*

- **Parts I wrote:** (file, commit, and what it does in my own words)
- **An AI-written piece I can explain:** (e.g. how the upload sequence number in `client/src/pages/CapturePage.jsx` prevents the race condition)
