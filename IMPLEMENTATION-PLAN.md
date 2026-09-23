# Postly: implementation plan

Built from `FinalProjectProposal.pdf`, `WireframeAndComponents.pdf`, `DesignSystem.pdf`,
`rubrics.md`, `documentation-guide.md` and `journal-template.md`.

**Stack:** React (Vite) + Tailwind · Express · PostgreSQL · Cloudinary (unsigned upload preset).
**Repo layout:** `client/` (React) and `server/` (Express) in one repo.

Weeks 1 and 2 each end with a **Project Increment Report** (20), a **Documentation Update** (15) and a
**Reflection Journal** (15). Week 3 is the **Final Project** (100), the **AI badge** (100) and the
**Presentation** (100). Most of the final-project marks go to the backend (builds and runs, API, schema,
validation = 75 of 100), so the server comes first and the UI is built on top of it.

---

## Decisions to settle on day 1

| Question | Recommendation | Why |
| --- | --- | --- |
| Database | **PostgreSQL** with `pg` and parameterized queries | The rubric grades "queries are correct, input is handled safely". Hand-written SQL shows that directly. |
| Breakpoints | **640px and 1024px** (from the wireframes) | The design system says 768px, the wireframes say 640/1024. Pick one pair and update the design system doc to match. |
| Users / auth | **Single user, no login** | Not in the proposal. Add it only if weeks 1 and 2 finish early. |
| "One postcard per day" | Enforce it in the database (`UNIQUE` on the day) **and** in the API (`409 Conflict`) | Streaks depend on it, and it gives you a real error-handling case to show. |

---

## Week 1: foundation and the core loop (capture, save, gallery)

**Goal by Friday:** a reader can clone the repo, follow the README, and save today's postcard end to end.

### Setup
- [ ] `git init`, add the `.gitignore`, create the GitHub repo (keep it **private** until the week 2 security checklist is done).
- [ ] Scaffold `server/` (Express, `pg`, `dotenv`, `cors`) and `client/` (Vite React, React Router, Tailwind).
- [ ] Add `.env.example` files for both sides, with placeholders only:
  - server: `PORT=4000`, `DATABASE_URL=postgres://user:pass@localhost:5432/postly`, `CLIENT_ORIGIN=http://localhost:5173`
  - client: `VITE_API_URL=http://localhost:4000`, `VITE_CLOUDINARY_CLOUD_NAME=your-cloud`, `VITE_CLOUDINARY_UPLOAD_PRESET=your-preset`
- [ ] Create the Cloudinary account and an unsigned upload preset limited to images.

### Database
- [ ] `server/db/schema.sql`:
  - `templates (id, name, slug)`, seeded with 3 rows
  - `postcards (id, image_url, caption varchar(140), template_id → templates, postcard_date date UNIQUE, created_at)`
- [ ] `server/db/seed.sql` with templates plus 5–10 sample postcards on past dates, so the gallery and streaks aren't empty.
- [ ] npm scripts: `db:setup`, `db:seed`.

### API (first pass)
| Method | Path | Does | Statuses |
| --- | --- | --- | --- |
| GET | `/api/templates` | list templates | 200 |
| GET | `/api/postcards` | list, newest first (`?q=`, `?month=` later) | 200 |
| GET | `/api/postcards/today` | today's postcard or 404 | 200 / 404 |
| GET | `/api/postcards/:id` | one postcard | 200 / 404 / 400 bad id |
| POST | `/api/postcards` | create `{ imageUrl, caption, templateId }` | 201 / 400 / 409 already made today |
| DELETE | `/api/postcards/:id` | delete | 204 / 404 |

- [ ] Central error-handling middleware, plus a 404 handler for unknown routes.
- [ ] Validation on POST: `imageUrl` must be an `https://res.cloudinary.com/...` URL, caption ≤ 140 characters, `templateId` must exist.

### Frontend
- [ ] Tailwind theme tokens from the design system: the 5 colours, the 3 type sizes, the 8px spacing grid.
- [ ] Atoms: `Button`, `Label`, `TextArea`, `Badge`, `Spinner`, `NavLink`.
- [ ] `AppLayout` with `Header` (4 nav links, ☰ drawer on phone) and `Footer`. Router with the 4 routes, redirecting `/` to `/capture`.
- [ ] **/capture:** `TodayStatusBar`, `UploadDropzone` (uploads to Cloudinary, `uploadStatus` idle/uploading/error), `TemplatePicker`, caption `FormField` with a 0/140 counter, `PostcardPreview` (front/back + flip), Save button disabled until photo + template are chosen **and** while uploading. This is the fix for the race condition named as the risk in the proposal.
- [ ] "Already done today" state on /capture.
- [ ] **/gallery (basic):** `GalleryGrid` of `PostcardCard`s, plus the empty state linking to /capture.
- [ ] `PostcardsContext` at app level: fetch the list once, append on save, remove on delete.

### Week 1 deliverables
- [ ] **README.md**: all 7 sections from `documentation-guide.md` (overview, setup, run, features + endpoint table, structure, screenshots of /capture and /gallery, known issues).
- [ ] **AI-USAGE.md** started, plus the README credit line (badge + assistant name + link). Log every AI-assisted change with a commit link **as you go**. It needs 6+ entries and 3 "AI got it wrong" cases by week 3.
- [ ] **Increment report**: what was built, why, and what is broken or unfinished, with commit links.
- [ ] **journal/week-1.md** from the template: goal, what I did, blockers, what I learned. Be specific.
- [ ] Small, frequent commits. "Visible progress" is graded from commit history.

---

## Week 2: the other screens, hardening, security

**Goal by Friday:** all four routes work. Bad input can't crash the server. The security checklist is done and the repo is public.

### Gallery and detail
- [ ] `PostcardDetailModal`: full-size front and back, flip, download (Cloudinary `fl_attachment` URL), delete with a confirm step. Closes on ✕ and Esc and returns focus to the card that opened it.
- [ ] `GalleryToolbar`: count, caption search, sort newest/oldest, month filter. Filter on the server with `GET /api/postcards?q=&month=&sort=`, all parameterized.
- [ ] Responsive grid: 4 across at 1024px+, 2 across below, 1 across under 400px. Search and sort sit behind a "filters" button on phone.

### Streaks
- [ ] `GET /api/stats`: current streak, longest streak, total, best month, average per week, days missed, first postcard date. Computed from `postcards` in SQL or in a service function. **Never stored.**
- [ ] Unit-test the streak logic (gaps, today not made yet, timezone at midnight). This is the easiest place to get a subtle bug.
- [ ] `StatTile` × 3, `StreakHeatmap` (365 `HeatmapCell`s, scrolls inside its own box on phone), `MonthCalendar`. Clicking a filled day opens the same detail modal.

### Capsule
- [ ] Schema: `capsules (id, postcard_id → postcards ON DELETE CASCADE, message, unlock_at date, opened_at)`.
- [ ] API:
  - `GET /api/capsules`: locked capsules return **no message** (never trust the client to hide it)
  - `POST /api/capsules`: `unlock_at` must be in the future
  - `POST /api/capsules/:id/open`: 403 if still locked
  - `GET /api/flashback`: "on this day last year", or a random postcard
- [ ] `SealCapsuleForm`, `CapsuleVault` (blurred locked rows with a countdown, Open button when ready), capsule reveal modal, `FlashbackStrip`, and the empty state.

### Hardening
- [ ] Validation on every route: 400 for bad input with a clear JSON `{ error }` message, 404 for missing records, 409 for conflicts, 500 only for real failures, and no stack traces in responses.
- [ ] Client-side: loading and error states on every fetch. Handle a failed Cloudinary upload with a retry.
- [ ] Accessibility pass from the design system checklist: labels (`htmlFor`/`id`), alt text, visible focus, keyboard-operable modals.
- [ ] Check at 375px that nothing scrolls sideways.

### Week 2 deliverables
- [ ] **SECURITY-CHECKLIST.md** filled in from the template **before** making the repo public. Every row Yes/No/N/A with evidence, and every N/A with its reason. Check the git history for any committed `.env`.
- [ ] README updated: new endpoints, new screenshots (streaks, capsule, modal), updated known issues.
- [ ] AI-USAGE.md kept current.
- [ ] Increment report that says clearly **what changed since week 1**.
- [ ] journal/week-2.md.

---

## Week 3: finish, polish, present

**Goal:** a clean, working submission and the presentation assets.

### Mon–Tue: finish and fix
- [ ] Close the gaps between the proposal and the build ("Scope and completeness", 15 pts). Walk the sanity-check flow from the wireframes doc: upload → save → gallery → streaks shows +1.
- [ ] Fresh-clone test: follow your own README on a clean folder (or a friend's machine) and fix every step that fails.
- [ ] Code-quality pass: remove dead code and console logs, keep consistent naming, and keep the atom → molecule → organism import rule.
- [ ] Optional: deploy (e.g. Render/Railway for the server and Postgres, Netlify/Vercel for the client) and put the live link in the README.

### Wed: AI badge (75+ to pass)
- [ ] AI-USAGE.md: 6+ entries (tool, request, what you kept or changed, commit link), 3 real cases where the AI was wrong (output, problem, fix, commit link), and "who wrote what" naming your own files and commits plus one AI-written piece explained.
- [ ] README credit: badge, assistant name, link to AI-USAGE.md.

### Thu–Fri: presentation
- [ ] **Slides**: problem, demo, tech, challenges (the Cloudinary → POST race condition is a good one), what's next.
- [ ] **Video** (3–5 min, on camera, public Google Drive link): app walkthrough, code walkthrough, **2–3 min AI segment** (required).
- [ ] **Square image** 1080×1080: "Postly", your name, one screenshot or logo.
- [ ] Final README screenshots and known issues. Tag the release commit.

---

## If time runs short, cut in this order
1. Flashback shuffle, then the month filter, then the heatmap on phone
2. Capsule reveal animation
3. Deployment

Don't cut: validation, correct status codes, the README setup steps, or AI-USAGE.md. Those are where most of the marks are.
