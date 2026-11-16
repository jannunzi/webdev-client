import type { LectureSlide } from "../types";

export const KAMBAZ_SESSIONS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: "#C8102E",
      icon: "user",
      headline: "Server Sessions",
      stackWords: true,
      headlineScale: 2,
    },
    bullets: [
      "Chapter 5 · Server Sessions",
      "Many users, one cookie each",
    ],
  },
  {
    id: "stateless",
    title: "HTTP Does Not Remember",
    kind: "content",
    bullets: [
      "Each request is independent",
      "The server does not remember previous requests",
      "Sign-in has to store the user somewhere the next request can find",
    ],
  },
  {
    id: "one-user",
    title: "One currentUser for Every Browser",
    kind: "content",
    bullets: [
      "Browser B signs in and overwrites `currentUser`, so browser A sees B",
    ],
    diagram: "session-one-user",
  },
  {
    id: "many-sessions",
    title: "A Session for Each Browser",
    kind: "content",
    bullets: [
      "Each cookie maps to its own session and its own `currentUser`",
    ],
    diagram: "session-many",
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
      "Cookie requests need `credentials: true` and an explicit origin. `*` is rejected",
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
  };
}
app.use(session(sessionOptions));
app.use(express.json());`,
    codeLanguage: "ts",
    codeFile: "webdev-server/index.ts",
    codeHighlightLines: [[4, 7], [20, 21]],
  },
  {
    id: "cookie-flow",
    title: "How Session Cookies Work",
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
    id: "session-create",
    title: "Sign-In Creates the Session",
    kind: "content",
    bullets: [
      "A request that never writes `req.session` gets no cookie. `saveUninitialized` is false",
    ],
    diagram: "session-create",
  },
  {
    id: "session-update",
    title: "Updating a Value in the Session",
    kind: "content",
    bullets: [
      "`PUT /api/users/:userId` sets `req.session.currentUser` when the id matches",
    ],
    diagram: "session-update",
  },
  {
    id: "session-read",
    title: "Reading a Value from the Session",
    kind: "content",
    bullets: [
      "`GET /api/users/profile` returns `req.session.currentUser`",
    ],
    diagram: "session-read",
  },
  {
    id: "session-auth-intro",
    title: "Storing the User on the Session",
    kind: "demo",
    bullets: [
      "Signin returns 401 when the credentials do not match",
      "Signup returns 400 when the username is taken",
      "Both store the user in `req.session.currentUser`",
    ],
  },
  {
    id: "session-auth",
    title: "Signing In and Signing Up",
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
const signup = (req, res) => {
  const user = dao.findUserByUsername(req.body.username);
  if (user) {
    res.status(400).json({ message: "Username already in use" });
    return;
  }
  const currentUser = dao.createUser(req.body);
  req.session["currentUser"] = currentUser;
  res.json(currentUser);
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/routes.ts",
    codeHighlightLines: [5, 19],
  },
  {
    id: "session-profile",
    title: "Profile and Sign-Out",
    kind: "demo",
    bullets: [
      "Profile returns 401 when nobody is signed in",
      "Signout destroys the session",
    ],
    code: `const profile = (req, res) => {
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
    codeHighlightLines: [2, 10],
  },
  {
    id: "axios-cookies-intro",
    title: "Sending Cookies with Axios",
    kind: "demo",
    bullets: [
      "Default axios drops cookies",
      "`axios.create({ withCredentials: true })`",
      "Replace `axios` in signin, signup, updateUser, profile, and signout",
    ],
  },
  {
    id: "axios-cookies",
    title: "Configuring Axios withCredentials",
    kind: "demo",
    code: `import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const USERS_API = \`\${HTTP_SERVER}/api/users\`;
export const signin = async (credentials: { username: string; password: string }) => {
  const response = await axiosWithCredentials.post(
    \`\${USERS_API}/signin\`,
    credentials,
  );
  return response.data;
};
export const signup = async (user: { username: string; password: string }) => {
  const response = await axiosWithCredentials.post(
    \`\${USERS_API}/signup\`,
    user,
  );
  return response.data;
};
export const updateUser = async (user: { _id: string }) => {
  const response = await axiosWithCredentials.put(
    \`\${USERS_API}/\${user._id}\`,
    user,
  );
  return response.data;
};
export const profile = async () => {
  const response = await axiosWithCredentials.get(
    \`\${USERS_API}/profile\`,
  );
  return response.data;
};
export const signout = async () => {
  const response = await axiosWithCredentials.post(
    \`\${USERS_API}/signout\`,
  );
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/account/client.ts",
    codeHighlightLines: [[2, 4]],
  },
  {
    id: "refresh-why",
    title: "Keeping the User after Refresh",
    kind: "content",
    bullets: [
      "AccountContext lives in memory. A refresh clears `currentUser`",
      "The server session still has that user, stored with the cookie",
      "On load, call `profile()` and then `setCurrentUser`",
    ],
  },
  {
    id: "session",
    title: "Fetching the Profile on Load",
    kind: "demo",
    bullets: [
      "`pending` starts true, so Kambaz renders nothing during the request",
      "A missing session sets `currentUser` to `null`",
    ],
    code: `"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useAccountContext } from "./AccountContext";
import * as client from "./client";

export default function Session({
  children,
}: {
  children: ReactNode;
}) {
  const [pending, setPending] = useState(true);
  const { setCurrentUser } = useAccountContext();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = await client.profile();
        setCurrentUser(currentUser);
      } catch {
        setCurrentUser(null);
      } finally {
        setPending(false);
      }
    };
    fetchProfile();
  }, [setCurrentUser]);

  if (pending) {
    return null;
  }
  return children;
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/Session.tsx",
    codeHighlightLines: [[15, 26], [28, 30]],
  },
  {
    id: "session-layout",
    title: "Wrapping Kambaz in Session",
    kind: "demo",
    bullets: [
      "`Session` sits inside `AccountProvider` so it can call `setCurrentUser`",
      "It wraps the navigation and the page",
    ],
    code: `import { ReactNode } from "react";
import "./kambaz.css";
import KambazNavigation from "./Navigation";
import Session from "./account/Session";
import { AccountProvider } from "@/lib/account/AccountContext";

export default function KambazLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <AccountProvider>
      <Session>
        <div id="wd-kambaz" className="font-sans">
          <KambazNavigation />
          <div className="wd-main-content-offset p-3">
            {children}
          </div>
        </div>
      </Session>
    </AccountProvider>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/layout.tsx",
    codeHighlightLines: [[4, 5], [11, 19]],
  },
  {
    id: "recap",
    title: "Recap: Sessions and Cookies",
    kind: "content",
    bullets: [
      "`req.session.currentUser` per browser cookie",
      "CORS `credentials` + a specific `CLIENT_URL`",
      "Every signed-in axios call uses `withCredentials`",
      "Session calls `profile()` on load so a refresh keeps the user",
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
