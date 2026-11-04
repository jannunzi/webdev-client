import type { LectureSlide } from "../types";

export const KAMBAZ_SESSIONS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: "#C8102E",
      icon: "user",
      headline: "Sessions and Axios",
    },
    bullets: [
      "Chapter 5 · Sessions and Axios",
      "Many users, one cookie each",
    ],
  },
  {
    id: "purpose",
    title: "Remembering Who Is Signed In",
    kind: "content",
    bullets: [
      "The server keeps one `currentUser` variable shared by every browser",
      "If two people sign in, the second replaces the first",
      "Sessions keep a separate signed-in user for each browser, using a cookie",
      "The server must accept cookies from the Next.js app only",
    ],
  },
  {
    id: "install",
    title: "Installing express-session",
    kind: "demo",
    bullets: [
      "`express-session` plus `dotenv` on the server",
      "Do not commit `.env` — `.gitignore` already lists it",
    ],
    codeBlocks: [
      { code: "npm install express-session\nnpm i -D @types/express-session\nnpm install dotenv", language: "bash" },
      {
        file: "webdev-server/.env",
        language: "bash",
        code: `SERVER_ENV=development
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:4000
SESSION_SECRET=super secret session phrase`,
      },
    ],
  },
  {
    id: "config-intro",
    title: "Ordering CORS, Session, and JSON",
    kind: "demo",
    bullets: [
      "Production: `proxy`, `sameSite: \"none\"`, `secure` cookies",
      "That is how Vercel can send credentials to Render",
    ],
  },
  {
    id: "config",
    title: "Configuring Session Middleware",
    kind: "demo",
    code: `import "dotenv/config";
import session from "express-session";
const app = express();
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL || "http://localhost:3000",
}));
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};
if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.SERVER_URL,
  };
}
app.use(session(sessionOptions));
app.use(express.json());`,
    codeLanguage: "ts",
    codeFile: "webdev-server/index.ts",
    codeHighlightLines: [[4, 7], [21, 22]],
  },
  {
    id: "cookie-flow",
    title: "Session Cookies",
    kind: "content",
    bullets: [
      "Sign in: the server stores the user in `req.session` on its side",
      "The response sets a cookie holding only a session id",
      "The browser sends that cookie back on later requests to the server",
      "`express-session` uses the id to look up that user’s session",
      "So `req.session.currentUser` is the right user for each browser",
      "axios needs `withCredentials` or the cookie is never sent",
    ],
  },
  {
    id: "session-auth-intro",
    title: "Storing the User on the Session",
    kind: "demo",
    bullets: [
      "Signin 401 if credentials miss. Profile 401 if nobody is signed in",
      "Signout destroys the session. Profile update must keep it in sync",
    ],
  },
  {
    id: "session-auth",
    title: "Reading the User from the Session",
    kind: "demo",
    code: `const signin = (req, res) => {
  const { username, password } = req.body;
  const currentUser = dao.findUserByCredentials(username, password);
  if (currentUser) {
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  } else {
    res.status(401).json({ message: "Unable to login. Try again later." });
  }
};
const profile = (req, res) => {
  const currentUser = req.session["currentUser"];
  if (!currentUser) {
    res.sendStatus(401);
    return;
  }
  res.json(currentUser);
};
const signout = (req, res) => {
  req.session.destroy();
  res.sendStatus(200);
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/routes.ts",
    codeHighlightLines: [5, 12, 20],
  },
  {
    id: "axios-cookies-intro",
    title: "Sending Cookies with Axios",
    kind: "demo",
    bullets: [
      "Default axios drops cookies. `axios.create({ withCredentials: true })`",
      "Profile, signout, update, and later `/current/courses` must use it",
    ],
  },
  {
    id: "axios-cookies",
    title: "Configuring Axios withCredentials",
    kind: "demo",
    code: `import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
export const signin = async (credentials: { username: string; password: string }) => {
  const response = await axiosWithCredentials.post(\`\${USERS_API}/signin\`, credentials);
  return response.data;
};
export const profile = async () => {
  const response = await axiosWithCredentials.post(\`\${USERS_API}/profile\`);
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/account/client.ts",
    codeAddedLines: [2, 8],
  },
  {
    id: "recap",
    title: "Recap: Sessions and Cookies",
    kind: "content",
    bullets: [
      "`req.session.currentUser` per browser cookie",
      "CORS `credentials` + a specific `CLIENT_URL`",
      "Every signed-in axios call uses `withCredentials`",
    ],
  },
  {
    id: "next-up",
    title: "Next: Courses API",
    kind: "title",
    bullets: [
      "Dashboard fetches enrolled courses from Express",
      "`GET /api/courses` and `/api/users/current/courses`",
    ],
  },
];
