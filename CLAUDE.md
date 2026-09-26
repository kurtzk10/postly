# Instructions for the AI assistant

I'm building Postly for my final project. These are my rules for my Claude Agent. Follow it over your own defaults, and ask me before breaking any rule here.

## What Postly is

A private daily postcard journal: one photo a day, a template, a caption, saved to a gallery. The design is already decided in my own documents. Build from them, don't redesign:

- `FinalProjectProposal.pdf`: This file states the app's purpose, routes, data, and main risk or challenge
- `WireframeAndComponents.pdf`: This file holds every screen for two viewports: desktop and phone, and the component tree
- `DesignSystem.pdf`: This is where the design system is established. Colors, type, spacing, components and accessibility
- `IMPLEMENTATION-PLAN.md`: Follow this to know what should be built each week
- `rubrics.md` and `documentation-guide.md`: Check your work against this rubric.

If something you're asked to do is not in these documents or contradicts it, tell me instead of deciding for yourself.

## Stack and commands

React 19 + Vite + Tailwind 4 (`client/`) · Express 5 + `pg` (`server/`) · PostgreSQL 17 · Cloudinary for images.

Run everything from the project root:

| Command | Does |
| --- | --- |
| `npm install` | installs root, server and client |
| `npm run dev` | starts the API (:4000) and the web app (:5173) together |
| `npm run db:seed` | recreates the tables with sample data. **Wipes everything.** |
| `npm run db:reset-today` | deletes only today's postcard |
| `npm run lint` / `npm run build` | checks the client |

## Rules

### Environment
- **No Docker.** Install tools natively (e.g. with `winget`). Anyone following my README shouldn't need Docker.
- Never commit `.env` files or real credentials. Every new environment variable goes in the matching `.env.example` with a placeholder, and in the README.

### The database is my real data
- **Never delete, reset or change rows unless I ask in that message.** That includes `db:seed`, `db:setup` and `db:reset-today`.
- When I say "reset today", run `npm run db:reset-today`, and nothing else.
- For tests, insert your own clearly labelled rows and delete only those afterwards. Don't touch my postcards.

### API
- Routes are RESTful and named after resources (`/api/postcards/:id`, not `/api/gallery/:id`). Page URLs in the React app can differ from API paths.
- **Every SQL query uses parameters** (`$1`, `$2`). Never build SQL from strings.
- Validate every input on the server and return the right status: 400 bad input, 404 not found, 409 conflict, 201 created, 204 deleted. Errors are JSON `{ "error": "message" }`. Never send a stack trace to the client.
- One postcard per day is enforced by the database (`UNIQUE` on `postcard_date`). Don't work around it.
- After changing a route, test each status code with curl before telling me it works.

### Front end
- Keep the atomic folders from my wireframes: `atoms/` → `molecules/` → `organisms/` → `pages/`. **A level only imports from the levels below it.**
- Use the design tokens in `client/src/index.css`, not raw colours. Text links and filled buttons use `primary-strong` (#56636F), because the design system's `#7C8B99` fails 4.5:1 contrast. Gold (`accent`) buttons get charcoal text, not white.
- Breakpoints are **640px and 1024px** (from my wireframes).
- Accessibility is required: real `<label>`s for inputs, alt text on meaningful images (`alt=""` on decorative ones), visible focus, and everything usable by keyboard.
- The Save button stays disabled while an upload is in flight. That's how I handle the race condition named in my proposal, so don't remove it.

### Code I write myself
- At least a fifth of this project has to be code I wrote. From week 2 on, **I write the remaining features myself**: the capsule API, gallery search, and the `/capsule` screen.
- **Don't write or rewrite my code.** Your job there: hint comments showing where each line goes, answers to questions about a specific step, and testing and review. When you review, tell me what's wrong and why; don't fix it for me.
- My files so far: `server/src/lib/streaks.js`, `server/src/routes/stats.js`, `server/src/routes/capsules.js`, `server/src/routes/flashback.js`, and the capsules table in `server/src/db/schema.sql`.

### Checking your work
- **Don't tell me something works until you've run it.** Run lint and build, then load the page in a headless browser at **375, 639, 641, 1023, 1025 and 1440px** and check there's no sideways scroll.
- If a test fails, say so and show the output. Don't paper over it.

### Honesty and my coursework
- **Log every change you make in `AI-USAGE.md`**: what I asked for, what you did, and what I kept or changed. When you get something wrong and it's caught, add it under "Where the AI got it wrong", with the output, the problem and the fix. Never leave a mistake out.
- **Don't write my reflection journal or my increment report.** They're graded on my own experience. You can remind me what we did; I write them.
- Don't fill in the "Who wrote what" section of `AI-USAGE.md` for me.

### Git
- Don't commit or push unless I ask.
- Suggest [Conventional Commit](https://www.conventionalcommits.org/) messages (`feat`, `fix`, `style`, `refactor`, `chore`, `docs`). Prefer small commits, because my grade counts visible progress.

### How to talk to me
- Explain what you changed and why in plain words. I have to explain this code in my presentation video.
- When there's a choice to make, give me your recommendation and the reason. Don't decide something big silently.
