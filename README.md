# webdev-client

Next.js client for CS 4550 / CS 5610 Web Development. Students build **Kambaz**, a Canvas-inspired LMS UI, in this repo. The sibling Express API is **webdev-server** (nested here as a convenience copy; assignments still treat it as its own GitHub repository).

The course homepage (`/`) redirects to `/syllabus`. Kambaz stays on its existing routes (`/account/signin`, `/dashboard`, `/courses/…`). The live book is at [https://webdev-client.vercel.app](https://webdev-client.vercel.app).

This project was bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to the syllabus. Kambaz is at [http://localhost:3000/account/signin](http://localhost:3000/account/signin).

For Lab 5–6 LiveDemos, run the Express sibling in a second terminal:

```bash
cd webdev-server
npm install
npm run dev
```

Or from this repo root: `npm run server:dev`.

## Book term pages

First-use technology terms in the course book (`OfficialLink`) open an in-app
page at `/book/terms/[slug]` — for example
[`/book/terms/react`](http://localhost:3000/book/terms/react) or
[`/book/terms/next-js`](http://localhost:3000/book/terms/next-js). Each page
shows the official site plus relevant YouTube explainers.

To populate videos, set **`YOUTUBE_API_KEY`** (YouTube Data API v3) in `.env`
or the Vercel project. Without the key the page still works: official link plus
a “Search on YouTube” fallback. Results are cached for 24 hours.

## Graded quizzes (Clerk + MongoDB Atlas)

Anyone may browse the book, syllabus, labs, practice, and terms — signed in or
not. **Only Canvas-roster students** can start or submit a graded quiz at
`/quizzes/take/q1`. Author review (answers shown) stays at `/quizzes/q1`.

If Clerk or Atlas env vars are missing, those take routes show a clear
“not configured” message. The rest of the site keeps working.

### What Jose creates

1. **Clerk** (https://dashboard.clerk.com): create an application for this
   course site. Copy the publishable key and secret key. Add the production
   (and preview) origin as an allowed URL. Optional: restrict sign-up to
   `northeastern.edu` later; the roster check is the grade gate.
2. **MongoDB Atlas**: create a cluster, a database user, and a Network Access
   entry that allows Vercel (or `0.0.0.0/0` if you prefer allow-all + strong
   user password). Copy the `mongodb+srv://…` connection string. The app uses
   database `webdev` (override with `MONGODB_DB`) and collections
   `quiz_attempts` and `canvas_roster`.
3. **Vercel** project env (Production + Preview + Development):
   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`,
   `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`,
   `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`, `MONGODB_URI`, `MONGODB_DB=webdev`.
   Redeploy after saving.

Locally, copy `.env.example` to `.env.local` and fill the same keys. Do not
commit `.env.local`.

### Load / refresh the Canvas roster

Export **People** (or the gradebook) from Canvas as CSV. Keep columns
`Email` (or `SIS Login ID` if it is an email), `ID` (Canvas user id),
`Student` / `Name`, and optionally `SIS User ID` and `Section`.

```bash
npm run roster:import -- path/to/canvas-people.csv
# replace every row instead of upserting:
npm run roster:import -- --replace path/to/canvas-people.csv
```

JSON also works: `[{ "email": "jane.doe@northeastern.edu", "canvasUserId": "12345", "name": "Jane Doe" }]`.
A sample file lives at `scripts/fixtures/canvas-roster.example.csv`.

While testing a single account, you can set `CANVAS_ROSTER_EMAILS` instead of
importing. Matching uses Clerk emails (primary and verified first, then
others), case-insensitive.

A signed-in visitor who is **not** on the roster sees
“Your account isn’t on the Canvas roster for this course” and **no** graded
attempt is written.

CSV upload in the UI can come later; this script is the MVP refresh path.

### Exam sampling

`/quizzes/take/q1` draws **one question from each of the 16 Q1 groups**. The
draw is seeded by Clerk user id + bank id so a refresh keeps the same items.
Correct answers are stripped from the client payload and graded on submit.

### Next step (not in this PR)

Instructor CSV export of `quiz_attempts` for Canvas grade import, and optional
an `instructor` flag on author review routes.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deploy on Vercel

The course book deploys to [https://webdev-client.vercel.app](https://webdev-client.vercel.app). Students deploy their own `webdev-client` fork with the [Vercel Platform](https://vercel.com/new) and **webdev-server** separately (Render or Heroku), then point `NEXT_PUBLIC_HTTP_SERVER` at that origin.
