import type { LectureSlide } from "../types";

export const KAMBAZ_SESSIONS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 5 · Sessions and Axios",
      "§5.4.3 · many users, one cookie each",
    ],
  },
  {
    id: "purpose",
    title: "One variable is one user",
    kind: "content",
    bullets: [
      "A module-level `currentUser` cannot serve two browsers",
      "Sessions store the signed-in user per cookie",
      "CORS must allow cookies and only the React origin",
    ],
  },
  {
    id: "install",
    title: "Sessions, CORS, and cookies",
    kind: "demo",
    bullets: [
      "`express-session` plus `dotenv` on the server",
      "Do not commit `.env` — `.gitignore` already lists it",
    ],
    codeBlocks: [
      { code: "npm install express-session\nnpm install dotenv", language: "bash" },
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
    id: "config",
    title: "CORS, then session, then JSON",
    kind: "demo",
    bullets: [
      "Production: `proxy`, `sameSite: \"none\"`, `secure` cookies",
      "That is how Vercel can send credentials to Render",
    ],
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
    codeLanguage: "js",
    codeFile: "webdev-server/index.js",
    codeHighlightLines: [[4, 7], [21, 22]],
  },
  {
    id: "session-auth",
    title: "Store the user on the session",
    kind: "demo",
    bullets: [
      "Signin 401 if credentials miss. Profile 401 if nobody is signed in",
      "Signout destroys the session. Profile update must keep it in sync",
    ],
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
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Users/routes.js",
    codeHighlightLines: [5, 12, 20],
  },
  {
    id: "axios-cookies",
    title: "axios withCredentials",
    kind: "demo",
    bullets: [
      "Default axios drops cookies. `axios.create({ withCredentials: true })`",
      "Profile, signout, update, and later `/current/courses` must use it",
    ],
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
    title: "Sessions recap",
    kind: "content",
    bullets: [
      "`req.session.currentUser` per browser cookie",
      "CORS `credentials` + a specific `CLIENT_URL`",
      "Every signed-in axios call uses `withCredentials`",
    ],
  },
  {
    id: "next-up",
    title: "Next: a courses API",
    kind: "title",
    bullets: [
      "Dashboard fetches enrolled courses from Express",
      "§5.4.5: `GET /api/courses` and `/api/users/current/courses`",
    ],
  },
];
