import type { LectureSlide } from "../types";

export const ATLAS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 6 · Atlas",
      "§6.3 · cloud cluster, then remote sessions",
    ],
  },
  {
    id: "purpose",
    title: "127.0.0.1 is empty on Render",
    kind: "content",
    bullets: [
      "The remote Express VM has no `kambaz` and no Compass documents",
      "Atlas hosts MongoDB and gives you a connection string",
      "Free cluster, Compass import, Network Access, then a **new** Render service",
      "Do not overwrite the Chapter 5 `a5` URL while TAs are grading",
    ],
  },
  {
    id: "cluster",
    title: "Free cluster named Kambaz",
    kind: "content",
    bullets: [
      "Sign in at mongodb.com — Google or email",
      "Deploy your cluster: **Free** plan, name it `Kambaz`",
      "Pick a nearby region — AWS North Virginia is fine",
      "Create a database user you will remember. Do **not** commit the password",
    ],
  },
  {
    id: "compass-remote",
    title: "Connect Compass with +srv",
    kind: "demo",
    bullets: [
      "Choose Compass, copy the string, Connect → New Window, paste",
      "Compass is now talking to the cloud — not `127.0.0.1`",
    ],
    code: `mongodb+srv://giuseppi:supersecretpassword@kambaz.jxui0bc.mongodb.net/`,
    codeLanguage: "text",
    interactiveHint:
      "The host will differ. Scheme, username, password, and cluster hostname matter.",
  },
  {
    id: "import-remote",
    title: "Import JSON on the remote DB",
    kind: "content",
    bullets: [
      "Create `kambaz` if Atlas did not, then import all five JSON files",
      "Confirm counts match localhost. You now have two Compass connections",
      "Edits on localhost do not appear on Atlas until you import or the app writes",
    ],
  },
  {
    id: "network",
    title: "Allow access from anywhere",
    kind: "content",
    bullets: [
      "Network Access → + ADD IP ADDRESS → ALLOW ACCESS FROM ANYWHERE",
      "That adds `0.0.0.0/0` — free Render outbound IPs change",
      "Without it, Mongoose on Render hangs even if the password is correct",
    ],
  },
  {
    id: "drivers",
    title: "Drivers URI includes /kambaz",
    kind: "demo",
    bullets: [
      "Connect → Drivers → Node.js 5.5+. Copy the application string",
      "`kambaz` must sit between the last `/` and the `?`",
      "Omit the path and Mongoose writes to `test` — Dashboard looks empty",
    ],
    code: `mongodb+srv://giuseppi:<password>@kambaz.jxui0bc.mongodb.net/kambaz?retryWrites=true&w=majority&appName=Kambaz`,
    codeLanguage: "text",
    interactiveHint:
      "Replace <password>. Do not commit the completed URI.",
  },
  {
    id: "render",
    title: "New Render service, same key",
    kind: "content",
    bullets: [
      "Push branch `a6`. Deploy a **new** Render (or Heroku) service",
      "Environment: `DATABASE_CONNECTION_STRING` = the Atlas URI",
      "Vercel `a6`: `NEXT_PUBLIC_HTTP_SERVER` = new origin, no trailing slash",
      "Redeploy both so the env vars take effect",
    ],
  },
  {
    id: "sessions",
    title: "Remote sessions need five keys",
    kind: "demo",
    bullets: [
      "`CLIENT_URL` is the Vercel `a6` origin — CORS and `sameSite`",
      "`SERVER_ENV=production` turns on secure cookies",
      "`SERVER_URL` must **not** start with `https://`",
      "After env changes: Manual Deploy → Deploy latest commit",
    ],
    code: `DATABASE_CONNECTION_STRING=mongodb+srv://USER:PASSWORD@cluster/kambaz?retryWrites=true&w=majority
CLIENT_URL=https://your-a6-preview.vercel.app
SERVER_URL=your-webdev-server.onrender.com
SERVER_ENV=production
SESSION_SECRET=a long random phrase`,
    codeLanguage: "bash",
    codeFile: "Render Environment",
  },
  {
    id: "recap",
    title: "Atlas recap",
    kind: "content",
    bullets: [
      "Free `Kambaz` cluster, Compass `mongodb+srv`, import JSON",
      "`0.0.0.0/0`, Drivers URI with `/kambaz?`",
      "New Render service + session env. Do not overwrite `a5`",
    ],
  },
  {
    id: "next-up",
    title: "Next: check your understanding",
    kind: "title",
    bullets: [
      "A 10-item self-check on schemas, DAOs, and Atlas",
      "§6-check, then migrate Kambaz collections in §6.4",
    ],
  },
];
