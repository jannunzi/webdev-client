import type { LectureSlide } from "../types";

export const KAMBAZ_ACCOUNT_REST_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 5 · Account REST APIs",
      "§5.4.2 · signin, signup, profile, signout",
    ],
  },
  {
    id: "dao",
    title: "Users DAO, then HTTP routes",
    kind: "demo",
    bullets: [
      "A DAO hides the array. Routes turn HTTP into function calls",
      "`npm install uuid` for new `_id`s on signup",
    ],
    code: `import { v4 as uuidv4 } from "uuid";
export default function UsersDao(db) {
  let { users } = db;
  const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    users = [...users, newUser];
    return newUser;
  };
  const findUserByCredentials = (username, password) =>
    users.find((user) => user.username === username && user.password === password);
  return { createUser, findUserByCredentials };
}`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Users/dao.js",
    codeHighlightLines: [[4, 8], [9, 10]],
  },
  {
    id: "routes",
    title: "Four POST account routes",
    kind: "demo",
    bullets: [
      "Register after CORS, session, and `express.json()`",
      "Pass `db` into the route module",
    ],
    code: `import UsersDao from "./dao.js";
export default function UserRoutes(app, db) {
  const dao = UsersDao(db);
  const signup = (req, res) => { };
  const signin = (req, res) => { };
  const signout = (req, res) => { };
  const profile = (req, res) => { };
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Users/routes.js",
    codeHighlightLines: [[8, 11]],
  },
  {
    id: "signin",
    title: "POST /api/users/signin",
    kind: "demo",
    bullets: [
      "Read `username` and `password` from `req.body`",
      "Store the user, then `res.json` it back",
      "§5.4.3 moves `currentUser` into the session",
    ],
    code: `const signin = (req, res) => {
  const { username, password } = req.body;
  currentUser = dao.findUserByCredentials(username, password);
  res.json(currentUser);
};
app.post("/api/users/signin", signin);`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Users/routes.js",
    codeHighlightLines: [[2, 4]],
  },
  {
    id: "client",
    title: "axios posts credentials",
    kind: "demo",
    bullets: [
      "`httpServer()` is the same Lab 5 helper",
      "`withCredentials` is required once sessions arrive",
    ],
    code: `import axios from "axios";
import { httpServer } from "@/app/lib/httpServer";

const axiosWithCredentials = axios.create({ withCredentials: true });
const USERS_API = \`\${httpServer()}/api/users\`;

export const signin = async (credentials: { username: string; password: string }) => {
  const response = await axiosWithCredentials.post(\`\${USERS_API}/signin\`, credentials);
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/account/client.ts",
    codeHighlightLines: [4, [7, 10]],
  },
  {
    id: "signin-ui",
    title: "Sign in writes AccountContext",
    kind: "demo",
    bullets: [
      "Chapter 4 Context — not a Redux `accountReducer`",
      "`setCurrentUser(user)` then navigate to Dashboard",
    ],
    code: `const { setCurrentUser } = useAccountContext();
const signin = async () => {
  const user = await client.signin(credentials);
  if (!user) return;
  setCurrentUser(user);
  router.push("/dashboard");
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/signin/page.tsx",
    codeHighlightLines: [[3, 6]],
    embed: "kambaz-styled-signin",
  },
  {
    id: "signup-profile",
    title: "Signup 400, profile, update",
    kind: "demo",
    bullets: [
      "Signup: 400 if the username is taken, else `createUser`",
      "`PUT /api/users/:userId` updates, then profile POSTs `currentUser`",
    ],
    code: `const signup = (req, res) => {
  const user = dao.findUserByUsername(req.body.username);
  if (user) {
    res.status(400).json({ message: "Username already in use" });
    return;
  }
  currentUser = dao.createUser(req.body);
  res.json(currentUser);
};
app.post("/api/users/signup", signup);`,
    codeLanguage: "js",
    codeFile: "webdev-server/Kambaz/Users/routes.js",
    codeHighlightLines: [[3, 6]],
  },
  {
    id: "recap",
    title: "Account REST recap",
    kind: "content",
    bullets: [
      "DAO for the array. Routes for `/api/users/*`",
      "Client posts; `setCurrentUser` from AccountContext",
      "One module-level `currentUser` is one user — sessions next",
    ],
  },
  {
    id: "next-up",
    title: "Next: sessions and Axios",
    kind: "title",
    bullets: [
      "Cookies so more than one browser can be signed in",
      "§5.4.3: CORS origin, `express-session`, `withCredentials`",
    ],
  },
];
