# Postly

![Built with AI: Claude Code](https://img.shields.io/badge/built%20with-Claude%20Code-D4A373)

Built with help from **Claude Code (Anthropic)**. See [AI-USAGE.md](AI-USAGE.md) for what the AI wrote and what I wrote, and [CLAUDE.md](CLAUDE.md) for the rules I set for it.

## 1. Overview

Postly is a private daily postcard journal. Once a day you upload one photo, pick a postcard template, write a short caption, and save it. Your postcards build up into a searchable gallery and a streak calendar, and you can seal one in a "future you" time capsule with a note to open on a later date. It's for anyone who wants a daily photo-and-reflection habit without posting to social media.

Stack: React 19 + Vite + Tailwind CSS · Express 5 · PostgreSQL · Cloudinary (image hosting).

## 2. Setup and installation

### Install first

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | 22 or newer | Vite 8 needs Node 20.19+ / 22.12+ |
| PostgreSQL | 14 or newer (built on 17) | Windows: `winget install PostgreSQL.PostgreSQL.17` · macOS: `brew install postgresql@17` |
| A Cloudinary account | free tier | Only needed to upload new photos. The seeded sample postcards work without it. |

During the PostgreSQL install you set a password for the `postgres` user. You'll need it below.

### Get the code and install dependencies

```bash
git clone https://github.com/kurtzk10/postly.git
cd postly
npm install        # installs the root tools, then server/ and client/ automatically
```

Every command in this README runs from the project root (`postly/`).

### Environment variables

Both folders have a `.env.example`. Copy each one to `.env`, then open the two new files and fill in real values. `.env` files are git-ignored; never commit them.

```bash
# Windows (PowerShell)
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env

# macOS / Linux
cp server/.env.example server/.env
cp client/.env.example client/.env
```

**`server/.env`**

| Variable | Example | What it is |
| --- | --- | --- |
| `PORT` | `4000` | Port the API listens on |
| `DATABASE_URL` | `postgres://postgres:your-password@localhost:5432/postly` | Postgres connection. The `postly` database is created for you by the setup script. |
| `CLIENT_ORIGIN` | `http://localhost:5173` | The React dev server's address, allowed through CORS |
| `SESSION_SECRET` | a long random string | Signs the login cookie. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `CLOUDINARY_CLOUD_NAME` | `your-cloud-name` | Shown on your Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | `your-api-key` | Cloudinary console → Settings → API Keys |
| `CLOUDINARY_API_SECRET` | `your-api-secret` | Same page. **Server only**: it signs uploads and never goes to the browser |

**`client/.env`**

| Variable | Example | What it is |
| --- | --- | --- |
| `VITE_API_URL` | *(leave empty)* | Only set this if the API runs on a different address. Empty means "same address as the app": in development Vite forwards every `/api/...` request to `http://localhost:4000`. |

**How photo uploads work:** the photo goes straight from the browser to Cloudinary, but only with a one-time signature from our server (`POST /api/uploads/signature`), which you only get when logged in. The signature fixes the folder (one per user) and the allowed file types, so nobody can upload to the Cloudinary account without an account here. No upload preset is needed.

### Set up and seed the database

Make sure PostgreSQL is running, then:

```bash
npm run db:seed    # creates the "postly" database, the tables, 3 templates, a demo account and its 9 sample postcards
```

The demo account is **`demo@postly.app`** / **`postly-demo`**. Only use it locally; it is never created on a deployed server.

`npm run db:setup` does the same without the sample postcards. **Both drop and recreate the tables**, so running either one again wipes your postcards.

`npm run db:reset-today` deletes only today's postcard (each account's own today, in its timezone), so you can test making one again. There's one postcard allowed per day.

## 3. How to run it

```bash
npm run dev
```

This starts the API and the React app together in one terminal. Lines from each are labelled, and Ctrl+C stops both:

```
[api] Postly API listening on http://localhost:4000
[web]   ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173**. You'll land on the **Log in** page: use the demo account above, or click **Create an account**. After logging in you're on the **Today** screen with today's date and a "not made yet" badge. Check the API on its own at http://localhost:4000/api/health, which should return `{"ok":true}`.

If something goes wrong:
- `Could not connect to the database`: check `DATABASE_URL` in `server/.env` and that the PostgreSQL service is running.
- `Port 4000 is already in use`: Postly is already running in another terminal. Stop that one first.
- `Could not read package.json`: you're in the wrong folder. Run commands from the project root.

## Deploying (Vercel + Neon)

The live app runs on **Vercel**, with the database on **Neon** (hosted PostgreSQL). Both have free plans that are enough for Postly. Vercel serves the built React app as static files and runs the Express API as one serverless function, all on one address, so the login cookie works without any cross-site setup.

How the repo is set up for it:
- `api/index.js` hands the Express app from `server/src/app.js` to Vercel. Locally, `server/src/index.js` runs the same app as a normal server.
- `vercel.json` installs and builds from the project root, serves `client/dist`, sends `/api/...` to the API and every other path to `index.html` (so reloading `/gallery` works), and runs the API in Singapore (`sin1`), next to the Neon database.

**1. Database (Neon).** Create a project, then copy the **pooled** connection string from **Connect** (its host contains `-pooler`). Put it in a git-ignored `server/.env.neon` as `DATABASE_URL=...` and create the tables once:

```bash
# PowerShell, from server/
$env:DATABASE_URL = (Get-Content .env.neon | Select-String '^DATABASE_URL=').Line.Substring(13); node src/db/setup.js; Remove-Item Env:DATABASE_URL
```

Use `db:setup`, not `db:seed`: the deployed database gets no demo account.

**2. App (Vercel).** Import the GitHub repo as a new project (root directory `./`; `vercel.json` does the rest) and add these environment variables before the first deploy:

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Neon's pooled connection string, with `sslmode=verify-full` |
| `SESSION_SECRET` | a new long random string, different from your local one |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | from the Cloudinary console |
Leave `VITE_API_URL` unset: the app and API share one address. **Don't set `NODE_ENV`** either: with `NODE_ENV=production`, `npm install` skips the dev packages the build needs (Vite's React plugin) and the build fails. The server switches to production mode (https-only login cookie) by itself when it sees Vercel's own `VERCEL=1`. Every push to `main` then redeploys.

## 4. Features and usage

### Accounts (`/login`, `/signup`)

Anyone can sign up with an email and a password (8 to 72 characters). Each account only ever sees its own postcards, streaks and capsules. You stay logged in for 30 days, or until you click **Log out** in the header. Any journal page you open while logged out sends you to **Log in** first, then back to where you were.

**"Today" is your today.** When you sign up or log in, the browser sends its timezone (e.g. `Asia/Kuala_Lumpur`) and the server saves it on your account. Every "which day is it?" question (today's postcard, streaks, capsule unlock dates, the flashback) is answered in that timezone, not the server's, so a postcard made at 2 a.m. counts for the right day wherever you are. The server still decides the date, so changing your computer's clock can't fill in a missed day.

How it's kept safe:
- Passwords are stored only as bcrypt hashes.
- The login lives in an `httpOnly` cookie (page scripts can't read it) that points to a row in the `session` table.
- Log in and sign up allow 10 tries per 15 minutes, then answer 429.
- A wrong email and a wrong password get the same message, so the login can't be used to find out who has an account.
- Asking for another account's postcard or capsule gets a 404, the same as one that doesn't exist.

### Make today's postcard (`/capture`)

1. Add today's photo, one of three ways. Whichever you use, it uploads to Cloudinary straight away and shows a spinner while it does.
   - **Take a photo** opens your camera (webcam or phone) in a viewfinder. Tap **Take photo** to snap, and **Switch camera** to swap front and back on phones. Your browser asks for camera permission the first time. Browsers only allow the camera on `localhost` or `https`. When that isn't available, the button opens the phone's own camera app instead.
   - **Choose a photo** picks one from your files or photo library.
   - On desktop you can also drag a photo onto the dashed box.
2. Pick one of three templates: **Classic**, **Polaroid** or **Airmail**. The thumbnails show your own photo in each frame.
3. Write a caption, up to 140 characters (a counter shows how many are left).
4. The live preview shows the front and back of the postcard as you type. On a phone, use **Show back** to flip it.
5. Click **Save postcard**. It stays disabled until a photo has finished uploading, so a half-uploaded photo can't be saved. After saving you're taken to the gallery.

You can only make one postcard per day. Once today's is saved, `/capture` shows it with a link to the gallery instead of the form.

### Browse your postcards (`/gallery`)

Every postcard, newest first, with its caption, date and template. 4 per row on desktop, 2 on tablets, 1 on small phones. If you have none yet, a link takes you back to `/capture`.

The toolbar above the grid narrows it down. On a phone, tap **Filters** to show it.
- **Search captions:** type part of a word; upper and lower case don't matter. Results update a moment after you stop typing.
- **Sort:** newest or oldest first.
- **Month:** only postcards from one month. The list only offers months you have postcards in.

If nothing matches, the gallery says so, with a **Clear filters** button.

### Postcard detail (`/gallery/:id`)

Click (or Tab to and press Enter on) any card to open it in a detail view over the gallery. The address changes to `/gallery/12`, so you can bookmark or share a single postcard. It's full screen on phones.

- **Flip** switches between the front and the back (caption, stamp and date).
- **Download** saves the whole postcard, front above back, as one PNG image (`postly-YYYY-MM-DD.png`, 1500px wide).
- **Delete** asks you to confirm first, then removes the postcard from the database and the gallery.
- Close with ✕, the Esc key, or by clicking outside it.
- A link to a postcard that doesn't exist (e.g. `/gallery/99999`) shows "Postcard not found" instead of a blank screen.

### Streaks (`/streaks`)

- **Three tiles:** your current streak, longest streak and total postcards. The current streak counts back from today, or from yesterday if today's postcard isn't made yet, so it doesn't reset every morning.
- **The past year:** one square per day for the last 53 weeks. Filled squares are postcards, and today has a gold ring. Click a filled square to open that postcard. On a phone the year scrolls sideways inside its box.
- **This month:** a calendar with a thumbnail on each day you made a postcard. Click one to open it.
- **Journaling stats:** your best month, average postcards per week, days missed since your first postcard, and the date of your first postcard.

Postcards open in the same detail view as the gallery, at `/streaks/:id`, and closing it brings you back to `/streaks`. If you delete a postcard from there, the streak updates straight away.

### Time capsule (`/capsule`)

- **Seal a capsule:** pick one of your postcards, write a message to future you (up to 500 characters), and choose the day it unlocks (tomorrow at the earliest).
- **The vault:** your capsules, soonest to unlock first. Locked ones show a blurred photo and a countdown ("opens in 42 days"). The message stays on the server until the unlock day, so it can't be peeked at.
- **Open now** appears from the unlock day. It shows the message in a pop-up, and afterwards the button says **Read again**.
- **Flashback:** a past postcard. It's the one from exactly a year ago if you have it, otherwise a random older one. **Shuffle** picks another.

On a phone the flashback comes first, then the vault, and the seal form is behind a **+ New capsule** button.

### API

All responses are JSON. Errors look like `{ "error": "message" }`.

| Method | Path | What it does | Responses |
| --- | --- | --- | --- |
| GET | `/api/health` | Server is up | 200 |
| POST | `/api/auth/signup` | Create an account and log in. Body: `{ "email", "password", "timeZone" }` (`timeZone` is optional, e.g. `Asia/Kuala_Lumpur`; `UTC` if left out) | 201 · 400 invalid input or unknown timezone · 409 email already used · 429 too many tries |
| POST | `/api/auth/login` | Log in. Body: `{ "email", "password", "timeZone" }` (optional; updates your saved timezone) | 200 · 400 · 401 wrong email or password · 429 |
| POST | `/api/auth/logout` | Log out | 204 |
| GET | `/api/auth/me` | Who is logged in: `{ "id", "email" }` | 200 · 401 |
| POST | `/api/uploads/signature` | A signature for one photo upload to Cloudinary | 200 · 503 Cloudinary not set up on the server |
| GET | `/api/templates` | List the postcard templates | 200 |
| GET | `/api/postcards` | List postcards. Optional filters: `?q=` (search captions), `?month=YYYY-MM`, `?sort=newest\|oldest`. With none, all postcards, newest first. | 200 · 400 bad filter |
| GET | `/api/postcards/today` | Today's postcard | 200, or 404 if not made yet |
| GET | `/api/postcards/:id` | One postcard | 200 · 400 if the id isn't a number · 404 |
| POST | `/api/postcards` | Save today's postcard. Body: `{ "imageUrl", "caption", "templateId" }` | 201 · 400 invalid input · 409 today's already exists |
| DELETE | `/api/postcards/:id` | Delete a postcard, and its photo from Cloudinary (only if it's in your own upload folder and no other postcard of yours uses it; if Cloudinary can't be reached the postcard is still deleted) | 204 · 400 · 404 |
| GET | `/api/stats` | Streak numbers: `{ currentStreak, longestStreak, totalPostcards, firstPostcardDate }` (`firstPostcardDate` is `null` with no postcards) | 200 |
| GET | `/api/capsules` | All capsules, soonest to unlock first. **A locked capsule's `message` is `null`**: the database only sends it from the unlock day on. | 200 |
| POST | `/api/capsules` | Seal a capsule. Body: `{ "postcardId", "message", "unlockAt" }` | 201 · 400 (bad input, a date that isn't real or isn't in the future, or no such postcard) |
| POST | `/api/capsules/:id/open` | Open an unlocked capsule. Records when it was first opened. | 200 · 400 · 403 still locked · 404 |
| GET | `/api/flashback` | One past postcard: `{ "reason": "on-this-day" \| "random", "postcard": {...} }`. The one from exactly a year ago if there is one, otherwise a random older one. | 200 · 404 no older postcards |

Every route below `/api/auth` needs you to be logged in and answers **401** otherwise. They only ever read or change the logged-in account's own rows.

Rules `POST /api/postcards` checks: `imageUrl` must be a Cloudinary image URL (`https://res.cloudinary.com/...`), `caption` is at most 140 characters (trimmed, optional), and `templateId` must be an existing template's id. Every query uses parameters (`$1`, `$2`), never string-built SQL.

Example (`-c` saves the login cookie to a file, `-b` sends it back):

```bash
curl -c cookies.txt -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@postly.app","password":"postly-demo"}'

curl -b cookies.txt -X POST http://localhost:4000/api/postcards \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"https://res.cloudinary.com/demo/image/upload/sample.jpg","caption":"Hello","templateId":1}'
```

## 5. Project structure

```
postly/
├── CLAUDE.md                   my rules for the AI assistant
├── package.json                root scripts: npm install / npm run dev / db:* run both halves
├── vercel.json                 how Vercel builds and routes the deployed app
├── api/index.js                Vercel's entry point: hands it the Express app
├── server/                     Express API
│   ├── src/
│   │   ├── index.js            starts the server (checks the DB connection first)
│   │   ├── app.js              middleware and routes
│   │   ├── config.js           reads and checks environment variables
│   │   ├── routes/             auth.js, postcards.js, templates.js, stats.js, capsules.js, flashback.js, uploads.js
│   │   ├── lib/                streaks.js (streak counting), validate.js (input checks), cloudinary.js (signing, deleting photos), httpError.js
│   │   ├── middleware/         auth.js (requireAuth), errors.js (404 + central error handler)
│   │   └── db/                 schema.sql, seed.sql, setup.js, resetToday.js, pool.js
│   └── .env.example
├── client/                     React app (Vite + Tailwind)
│   ├── src/
│   │   ├── pages/              LoginPage, SignupPage, CapturePage, GalleryPage, StreaksPage, CapsulePage
│   │   ├── layouts/            AppLayout (header + footer), RequireAuth (sends logged-out visitors to /login), AuthLayout (frame for the login pages)
│   │   ├── components/
│   │   │   ├── atoms/          Button, Badge, Spinner, Label, Input, TextArea, AppNavLink, Logo, Stamp
│   │   │   ├── molecules/      PostcardFront/Back, PostcardSheet, PostcardCard, GalleryToolbar, CapsuleRow, TemplatePicker, UploadDropzone, CameraCapture, FormField…
│   │   │   └── organisms/      Header, Footer, AuthForm, CaptureForm, PostcardPreview, GalleryGrid, PostcardDetailModal, StreakHeatmap, MonthCalendar, CapsuleVault, SealCapsuleForm, CapsuleRevealModal, FlashbackStrip
│   │   ├── context/            who is logged in (AuthContext), postcards list shared by every page
│   │   ├── api/                client.js (calls the API), cloudinary.js (signed uploads)
│   │   ├── lib/                dates, image helpers, journal stats, postcard download
│   │   └── index.css           design tokens (colours, type scale)
│   └── .env.example
└── docs/screenshots/
```

Components follow atomic design: a level only imports from the levels below it.

## 6. Screenshots

**Making today's postcard (desktop)**
![Capture screen on desktop](docs/screenshots/capture-desktop.png)

**The same screen on a phone**, with the save button fixed to the bottom

<img src="docs/screenshots/capture-phone.png" alt="Capture screen on a phone" width="300">

**Gallery**
![Gallery on desktop](docs/screenshots/gallery-desktop.png)

**Gallery search**: "the" in October, 3 matches
![Gallery filtered by a search and a month](docs/screenshots/gallery-search-desktop.png)

**Streaks**
![Streaks screen on desktop](docs/screenshots/streaks-desktop.png)

**Time capsule**: the seal form, the vault (one ready, two locked and blurred) and a flashback
![Time capsule screen on desktop](docs/screenshots/capsule-desktop.png)

**Opening a capsule**
![A capsule's message opened in a pop-up](docs/screenshots/capsule-open-desktop.png)

**Time capsule on a phone**: flashback first, the form behind "+ New capsule"

<img src="docs/screenshots/capsule-phone.png" alt="Time capsule screen on a phone" width="300">

**Postcard detail**
![Postcard detail view](docs/screenshots/detail-desktop.png)

**After saving: today's postcard is done**
![Capture screen after today's postcard is saved](docs/screenshots/capture-done-desktop.png)

## Credits

- **Fonts:** [Courier Prime](https://fonts.google.com/specimen/Courier+Prime) and [Nunito Sans](https://fonts.google.com/specimen/Nunito+Sans), both under the SIL Open Font License. They're bundled with the app through [Fontsource](https://fontsource.org) instead of loaded from Google, so the postcard download can include them.
- **Sample photos** in the seed data and screenshots: Cloudinary's public demo images (`res.cloudinary.com/demo`), used only as placeholders.
- **Logo, postage stamp and favicon:** drawn for this project as SVG.

## 7. Known issues and next steps

- **The live camera needs `localhost` or `https`.** If you open the dev server from your phone over Wi-Fi (`http://192.168...`), the browser blocks the live viewfinder, so **Take a photo** opens the phone's camera app instead.
- **Your timezone updates when you log in, not while you're logged in.** If you travel, log out and back in so "today" follows you.
- **Re-running `db:setup` or `db:seed` deletes everything.** There are no migrations yet.
- **No password reset or email check yet.** Sign-up doesn't confirm the email address, and a forgotten password can't be recovered.
- **Not deployed yet.** Next: move the database to Neon and host the app on Vercel.
- **No automated tests yet.** The API has been checked by hand with curl for every status code in the table above.
- **Photos uploaded but never saved stay in Cloudinary.** If you pick a photo and then leave without clicking Save, or pick a different one, the first upload isn't cleaned up. Fixing that would need a scheduled cleanup job.
