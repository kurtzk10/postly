# Postly

![Built with AI: Claude Code](https://img.shields.io/badge/built%20with-Claude%20Code-D4A373)

Built with help from **Claude Code (Anthropic)**. See [AI-USAGE.md](AI-USAGE.md) for what the AI wrote and what I wrote, and [CLAUDE.md](CLAUDE.md) for the rules I set for it.

## 1. Overview

Postly is a private daily postcard journal. Once a day you upload one photo, pick a postcard template, write a short caption, and save it. Your postcards build up into a gallery (and, from week 2, a streak calendar and a "future you" time capsule). It's for anyone who wants a daily photo-and-reflection habit without posting to social media.

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
git clone <your-repo-url> postly
cd postly
npm install        # installs the root tools, then server/ and client/ automatically
```

Every command in this README runs from the project root (`postly/`).

### Environment variables

Both folders have a `.env.example`. Copy each one to `.env` and fill in real values. `.env` files are git-ignored; never commit them.

**`server/.env`**

| Variable | Example | What it is |
| --- | --- | --- |
| `PORT` | `4000` | Port the API listens on |
| `DATABASE_URL` | `postgres://postgres:your-password@localhost:5432/postly` | Postgres connection. The `postly` database is created for you by the setup script. |
| `CLIENT_ORIGIN` | `http://localhost:5173` | The React dev server's address, allowed through CORS |

**`client/.env`**

| Variable | Example | What it is |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:4000` | Where the API is running |
| `VITE_CLOUDINARY_CLOUD_NAME` | `your-cloud-name` | Shown on your Cloudinary dashboard |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | `postly_unsigned` | An **unsigned** upload preset |

To create the upload preset: Cloudinary console → Settings → Upload → Upload presets → Add upload preset → set *Signing mode* to **Unsigned** → save, then copy its name. Unsigned means the browser can upload without a secret key, so no Cloudinary secret is ever in this project.

### Set up and seed the database

Make sure PostgreSQL is running, then:

```bash
npm run db:seed    # creates the "postly" database, the tables, 3 templates and 9 sample postcards
```

`npm run db:setup` does the same without the sample postcards. **Both drop and recreate the tables**, so running either one again wipes your postcards.

`npm run db:reset-today` deletes only today's postcard, so you can test making one again. There's one postcard allowed per day.

## 3. How to run it

```bash
npm run dev
```

This starts the API and the React app together in one terminal. Lines from each are labelled, and Ctrl+C stops both:

```
[api] Postly API listening on http://localhost:4000
[web]   ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173**. You'll land on the **Today** screen with today's date and a "not made yet" badge. Check the API on its own at http://localhost:4000/api/health, which should return `{"ok":true}`.

If something goes wrong:
- `Could not connect to the database`: check `DATABASE_URL` in `server/.env` and that the PostgreSQL service is running.
- `Port 4000 is already in use`: Postly is already running in another terminal. Stop that one first.
- `Could not read package.json`: you're in the wrong folder. Run commands from the project root.

## 4. Features and usage

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

### Postcard detail (`/gallery/:id`)

Click (or Tab to and press Enter on) any card to open it in a detail view over the gallery. The address changes to `/gallery/12`, so you can bookmark or share a single postcard. It's full screen on phones.

- **Flip** switches between the front and the back (caption, stamp and date).
- **Download** saves the original photo.
- **Delete** asks you to confirm first, then removes the postcard from the database and the gallery.
- Close with ✕, the Esc key, or by clicking outside it.
- A link to a postcard that doesn't exist (e.g. `/gallery/99999`) shows "Postcard not found" instead of a blank screen.

### Streaks (`/streaks`)

- **Three tiles:** your current streak, longest streak and total postcards. The current streak counts back from today, or from yesterday if today's postcard isn't made yet, so it doesn't reset every morning.
- **The past year:** one square per day for the last 53 weeks. Filled squares are postcards, and today has a gold ring. Click a filled square to open that postcard. On a phone the year scrolls sideways inside its box.
- **This month:** a calendar with a thumbnail on each day you made a postcard. Click one to open it.
- **Journaling stats:** your best month, average postcards per week, days missed since your first postcard, and the date of your first postcard.

Postcards open in the same detail view as the gallery, at `/streaks/:id`, and closing it brings you back to `/streaks`. If you delete a postcard from there, the streak updates straight away.

### Coming in week 2

`/capsule` (time capsule) is a placeholder page for now. See Known issues.

### API

All responses are JSON. Errors look like `{ "error": "message" }`.

| Method | Path | What it does | Responses |
| --- | --- | --- | --- |
| GET | `/api/health` | Server is up | 200 |
| GET | `/api/templates` | List the postcard templates | 200 |
| GET | `/api/postcards` | List all postcards, newest first | 200 |
| GET | `/api/postcards/today` | Today's postcard | 200, or 404 if not made yet |
| GET | `/api/postcards/:id` | One postcard | 200 · 400 if the id isn't a number · 404 |
| POST | `/api/postcards` | Save today's postcard. Body: `{ "imageUrl", "caption", "templateId" }` | 201 · 400 invalid input · 409 today's already exists |
| DELETE | `/api/postcards/:id` | Delete a postcard | 204 · 400 · 404 |
| GET | `/api/stats` | Streak numbers: `{ currentStreak, longestStreak, totalPostcards, firstPostcardDate }` (`firstPostcardDate` is `null` with no postcards) | 200 |

Rules the POST checks: `imageUrl` must be a Cloudinary image URL (`https://res.cloudinary.com/...`), `caption` is at most 140 characters (trimmed, optional), and `templateId` must be an existing template's id. Every query uses parameters (`$1`, `$2`), never string-built SQL.

Example:

```bash
curl -X POST http://localhost:4000/api/postcards \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"https://res.cloudinary.com/demo/image/upload/sample.jpg","caption":"Hello","templateId":1}'
```

## 5. Project structure

```
postly/
├── CLAUDE.md                   my rules for the AI assistant
├── package.json                root scripts: npm install / npm run dev / db:* run both halves
├── server/                     Express API
│   ├── src/
│   │   ├── index.js            starts the server (checks the DB connection first)
│   │   ├── app.js              middleware and routes
│   │   ├── config.js           reads and checks environment variables
│   │   ├── routes/             postcards.js, templates.js
│   │   ├── lib/                validate.js (input checks), httpError.js
│   │   ├── middleware/         errors.js (404 + central error handler)
│   │   └── db/                 schema.sql, seed.sql, setup.js, resetToday.js, pool.js
│   └── .env.example
├── client/                     React app (Vite + Tailwind)
│   ├── src/
│   │   ├── pages/              CapturePage, GalleryPage, StreaksPage, CapsulePage
│   │   ├── layouts/            AppLayout (header + footer around every page)
│   │   ├── components/
│   │   │   ├── atoms/          Button, Badge, Spinner, Label, TextArea, AppNavLink, Logo, Stamp
│   │   │   ├── molecules/      PostcardFront/Back, PostcardCard, TemplatePicker, UploadDropzone, CameraCapture, FormField…
│   │   │   └── organisms/      Header, Footer, CaptureForm, PostcardPreview, GalleryGrid, PostcardDetailModal
│   │   ├── context/            postcards list shared by every page
│   │   ├── api/                client.js (calls the API), cloudinary.js (uploads)
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

**Streaks**
![Streaks screen on desktop](docs/screenshots/streaks-desktop.png)

**Postcard detail**
![Postcard detail view](docs/screenshots/detail-desktop.png)

**After saving: today's postcard is done**
![Capture screen after today's postcard is saved](docs/screenshots/capture-done-desktop.png)

## 7. Known issues and next steps

- **Capsule is a placeholder.** It's planned for week 2.
- **Download saves the photo, not the finished postcard.** Exporting the framed front and back as an image isn't built yet.
- **The live camera needs `localhost` or `https`.** If you open the dev server from your phone over Wi-Fi (`http://192.168...`), the browser blocks the live viewfinder, so **Take a photo** opens the phone's camera app instead.
- **No search, sort or month filter in the gallery yet.**
- **"Today" is the database server's date.** Postgres decides which day it is using its own timezone setting. If the server and the user are in different timezones, a postcard made late at night can count for the wrong day. This is fine locally but needs fixing before any deployment.
- **Re-running `db:setup` or `db:seed` deletes everything.** There are no migrations yet.
- **No user accounts.** It's a single-user app by design for now.
- **No automated tests yet.** The API has been checked by hand with curl for every status code in the table above.
- **Deleting a postcard doesn't delete its image from Cloudinary.** Doing that needs a signed API call from the server.
- Photos uploaded to Cloudinary before you click Save stay in your Cloudinary account even if you never save the postcard.
