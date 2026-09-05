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

Anyone may browse the book, syllabus, labs, practice, assignments, and terms —
signed in or not. **Only Canvas-roster students** can start or submit a graded
quiz at `/quizzes/take/q1`. Author review (answers shown) at `/quizzes` and
`/quizzes/q1` is **staff only** (`INSTRUCTOR_EMAILS` + `TA_EMAILS`, same as
`/people`).

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
   `quiz_attempts`, `canvas_roster`, `assignment_progress`, and
   `assignment_submissions`.
3. **Vercel** project env (Production + Preview + Development):
   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`,
   `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`,
   `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`, `MONGODB_URI`, `MONGODB_DB=webdev`,
   `INSTRUCTOR_EMAILS=jannunzi@gmail.com`. Optional: `TA_EMAILS` (empty
   until you add TAs).
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

### Staff People (`/people`)

`/people` lists every `canvas_roster` document, grouped by Canvas section
(name, email, SIS / Canvas ids, counts). It is **not** the Kambaz lab People
demo under `/courses/[cid]/people`.

Anyone can Clerk sign in or sign up on the public site. There is **no**
separate instructor/TA registration. Staff status is **only** the env
allowlists, matched server-side against the signed-in Clerk emails:

- **`INSTRUCTOR_EMAILS`** — full instructor powers (People and author-review
  question banks). Default if unset: `jannunzi@gmail.com`.
- **`TA_EMAILS`** — TAs see the same People and author-review views. Empty by
  default.

`canvas_roster` only gates **graded quizzes**. Being on the student roster
does **not** grant People or author-review access.

A signed-out visitor is asked to sign in. A signed-in user who is not staff
gets 403 and the roster / answer key is not loaded. A staff-only “People”
link appears on the question-bank index and the graded-quiz take layout.
Author-review links are hidden from student-facing surfaces.

#### Vercel: Jose (instructor)

1. Project → Settings → Environment Variables.
2. Set `INSTRUCTOR_EMAILS=jannunzi@gmail.com` for Production, Preview, and
   Development. Add another Clerk address (comma-separated) if you sign in
   with it, e.g. `j.annunziato@northeastern.edu`.
3. Add `TA_EMAILS` as an empty value (or omit it) until you have TAs.
4. Redeploy production after saving.

#### Vercel: add a TA (no invite UI)

1. The TA creates a Clerk account on the live site with the email they will
   use (Sign up on https://webdev-client.vercel.app).
2. Jose adds that **exact** email to `TA_EMAILS` on Vercel (Production;
   Preview too if they use a preview URL). Comma-separate multiple TAs.
3. Redeploy (or restart) so the new env value is live.
4. The TA refreshes `/people` and should see the roster.

Do not put student emails on either allowlist. There is no in-app invite
or email sender.

### View as student

Jose is staff (`jannunzi@gmail.com`) and is **not** on the Canvas student
roster. A second Clerk user with the same email is awkward, so this is an
**app-level view mode**, not a second Clerk session.

Signed-in staff see a sticky **Viewing as: Instructor | Student** bar on
`/people`, author review (`/quizzes`, `/quizzes/q1`), and graded take
(`/quizzes/take`). Non-staff users never see it.

- **Instructor** (default): current staff behavior.
- **Student**: People and author review behave like a non-staff user (403;
  answer keys are not loaded). `/quizzes/take/*` treats the actor as a
  synthetic roster match named **Demo Student**
  (`demo.student@webdev.local`). That dummy is **not** written to
  `canvas_roster`. You can submit to smoke-test the exam UI; the score is
  shown in memory with **Impersonation — attempt not saved**. No
  `quiz_attempts` document is inserted.

The mode is an httpOnly cookie (`webdev_view_mode`) set only by a server
action that checks the staff allowlist first. Reading the cookie also
requires a signed-in staff email, so a forged client cookie does nothing
for students. Switch back with the same bar on every gated surface.

Optional: set `IMPERSONATION_STUDENT_EMAIL` to override the dummy address.

### Exam sampling

`/quizzes/take/q1` draws **one question from each of the 16 Q1 groups**. The
draw is seeded by Clerk user id + bank id so a refresh keeps the same items.
Correct answers are stripped from the client payload and graded on submit.

### Answer review windows (same student URL)

After submit, students return to **the same URL** (`/quizzes/take/q1`, etc.).
Unlock is **class-wide** (wall-clock ET → stored as ISO UTC in
`lib/quiz-exam/schedule.ts`), not “one week after *your* submit”.

| Phase | What the student sees |
| --- | --- |
| Take open, no attempt | Existing exam form. New attempts are blocked after the Sunday 23:59 ET due. |
| Submitted, before answers open | Score / submitted status. Answers start **{answersOpenAt}**, only for **one week**, until **{answersCloseAt}**, and again one week before the midterm or final. |
| First answer week | Full review of their drawn attempt with correct answers. Banner: only one week, until **{answersCloseAt}**; reopen one week before the exam. |
| After that week | Answers hidden. Message that the window ended, plus the next reopen (week before midterm/final) if it is still ahead. |
| Midterm / final prep week | Answers shown again until the exam instant. |

The server clock decides the phase. `correctReveal` is omitted from HTML and
from the submit payload unless the phase is `answers_open` or `answers_reopen`.

Fall 2026 first windows (00:00 ET Monday → +7d):

- Q1: 2026-10-05 → 2026-10-12
- Q2: 2026-10-19 → 2026-10-26
- Q3: 2026-11-02 → 2026-11-09
- Q4: 2026-11-16 → 2026-11-23
- Q5: 2026-11-30 → 2026-12-07
- Q6: 2026-12-14 → 2026-12-21

Take windows follow Q1’s pattern (Monday 00:00 ET unlock → Sunday 23:59 ET
due). Q1: unlock 2026-09-28, due 2026-10-04 23:59 ET.

**Exam dates** live in `COURSE_EXAMS` in the same module:

- `midtermAt` — **placeholder** `2026-11-05T05:00:00.000Z` (Thu 2026-11-05
  00:00 ET). The published syllabus has no midterm.
- `finalAt` — syllabus **Exam** date `2026-12-03T05:00:00.000Z`
  (2026-12-03 00:00 ET). University finals are 2026-12-14–20 on the syllabus
  and are not used for the reopen.

Q1–Q3 reopen `[midtermAt − 7d, midtermAt)` and are labeled “midterm”. Q4–Q6
reopen `[finalAt − 7d, finalAt)` and are labeled “final”. Edit those two ISO
strings when Jose publishes a midterm.

Staff **View as student** still does not persist an attempt. Impersonation can
exercise the form even outside the take window; answers still follow the
server phase (no leak while waiting/closed).

### Next step (not in this PR)

Instructor CSV export of `quiz_attempts` for Canvas grade import. Storing
impersonation attempts (e.g. `impersonation: true`) is deferred.

## Assignments hub

`/assignments` lists A1–A6 from the syllabus. Each `/assignments/aN` page
links to the matching book chapter (`/book/ch1` for A1, and so on).
`/assignments/a1` and `/assignments/a2` include Delivery / Lab / Kambaz
checklists with section deep links. A3–A6 are syllabus placeholders until
those rubrics are authored.

Signed-in students persist checkmarks to MongoDB (`assignment_progress`,
keyed by user + assignment + criterion). Visitors who are not signed in keep
progress in this browser only. The UI never mentions the auth vendor — the
button says “Sign in with your school email.”

**A1 URL submit (Phase 2A).** Rostered students and staff can save a public
GitHub repository URL and a public Vercel deployment URL on
`/assignments/a1`. Documents live in `assignment_submissions` (user +
`a1`). After save — or via **Run checks** — the server runs a few basic
checks (https deploy URL, not localhost; GET succeeds; 401/403 called out
as Deployment Protection; Labs / `wd-` markers; name markers when a
roster/profile name is available; GitHub URL format, plus a public-repo
HEAD when possible). This is **not** full rubric auto-grading. Staff
**View as student** can exercise the form; the submission is not saved.

Canvas assignment descriptions should **not** paste the website rubric.
Point students at the live pages. Suggested student copy (HTML helpers in
`lib/assignments/canvas-copy.ts`):

- https://webdev-client.vercel.app/assignments/a1
- https://webdev-client.vercel.app/assignments/a2
- https://webdev-client.vercel.app/assignments/a3
- https://webdev-client.vercel.app/assignments/a4
- https://webdev-client.vercel.app/assignments/a5
- https://webdev-client.vercel.app/assignments/a6

The IMSCC cartridge is not in this repo (Jose’s `canvas-fall` tooling).
Updating those assignment HTML descriptions is a follow-up package.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deploy on Vercel

The course book deploys to [https://webdev-client.vercel.app](https://webdev-client.vercel.app). Students deploy their own `webdev-client` fork with the [Vercel Platform](https://vercel.com/new) and **webdev-server** separately (Render or Heroku), then point `NEXT_PUBLIC_HTTP_SERVER` at that origin.
