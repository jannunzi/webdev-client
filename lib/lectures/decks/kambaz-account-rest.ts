import { COVER_KAMBAZ } from "../cover-colors";
import type { LectureSlide } from "../types";

export const KAMBAZ_ACCOUNT_REST_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: COVER_KAMBAZ,
      icon: "user",
      headline: "Account REST APIs",
    },
    bullets: [
      "Chapter 5 · Account REST APIs",
      "Signin, signup, profile, signout",
    ],
  },
  {
    id: "purpose",
    title: "Signing In Through the Server",
    kind: "content",
    bullets: [
      "Sign in and sign up still check users stored in the browser",
      "Anyone can read or edit browser data, and it resets on refresh",
      "The server keeps the users list and checks credentials in its routes",
      "The account pages call those routes instead of reading users directly",
    ],
    diagram: "account-dao",
  },
  {
    id: "routes",
    title: "Defining the Account `POST` Routes",
    kind: "demo",
    bullets: [
      "`UserRoutes(app, db)` receives the database object and builds the DAO",
      "`currentUser` holds the signed-in user on the server; sessions replace it later",
      "The next slide imports that object in `index.ts` and registers the routes",
    ],
    code: `import UsersDao from "./dao";
export default function UserRoutes(app, db) {
  const dao = UsersDao(db);
  let currentUser = null;
  const signup = (req, res) => { };
  const signin = (req, res) => { };
  const signout = (req, res) => { };
  const profile = (req, res) => { };
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.get("/api/users/profile", profile);
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/routes.ts",
    codeHighlightLines: [4, [9, 12]],
  },
  {
    id: "wire-db",
    title: "Passing the Database to the Routes",
    kind: "demo",
    bullets: [
      "Import `db` from `./Kambaz/Database`, not from `users.json`",
      "That index exports courses, modules, assignments, users, and enrollments",
      "Call `UserRoutes(app, db)` after `cors()` and `express.json()`",
    ],
    code: `import express from "express";
import cors from "cors";
import db from "./Kambaz/Database";
import UserRoutes from "./Kambaz/Users/routes";
const app = express();
app.use(cors());
app.use(express.json());
UserRoutes(app, db);
app.listen(process.env.PORT || 4000);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/index.ts",
    codeHighlightLines: [3, 8],
  },
  {
    id: "why-post",
    title: "Why Sign-In Uses `POST`",
    kind: "content",
    bullets: [
      "`POST` keeps the username and password in the body, not the URL",
      "History, logs, and caches keep the URL",
      "Sign-in, sign-up, and sign-out change server state",
      "GETs should only read data",
      "They are actions, not reads, so they do not map onto create, read, update, and delete",
      "`POST` is the standard practice, and visiting a link never sends it",
      "Profile only reads the current user, so it stays a `GET`",
    ],
  },
  {
    id: "dao-intro",
    title: "Users DAO interfaces with the database",
    kind: "demo",
    bullets: [
      "The Data Access Object (DAO) is a design pattern that encapsulates access to a data source behind a set of functions",
      "Routes call `findUserByUsername` and `createUser` and never touch storage",
      "Queries live in one place, so they are easier to change and to test",
      "Swapping storage does not change the routes",
      "This DAO reads in-memory JSON. A later chapter uses a database with the same routes",
    ],
  },
  {
    id: "dao-architecture",
    title: "From the Account UI to the Database",
    kind: "demo",
    bullets: [
      "The database is an in-memory object. Edits change the arrays, not the JSON files. MongoDB comes later for permanent storage",
    ],
    diagram: "account-dao",
  },
  {
    id: "dao",
    title: "Users DAO finds by credentials",
    kind: "demo",
    code: `export default function UsersDao(db) {
  let { users } = db;
  const findUserByCredentials = (username, password) =>
    users.find((user) => user.username === username && user.password === password);
  return { findUserByCredentials };
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/dao.ts",
    codeHighlightLines: [[3, 4]],
    diagram: "account-dao",
    diagramFocus: "dao",
  },
  {
    id: "signin",
    title: "Implementing `POST /api/users/signin`",
    kind: "demo",
    bullets: [
      "Read `username` and `password` from `req.body`",
      "Store the user in `currentUser`, then `res.json` it back",
      "Sessions move `currentUser` into the session",
    ],
    code: `const signin = (req, res) => {
  const { username, password } = req.body;
  currentUser = dao.findUserByCredentials(username, password);
  res.json(currentUser);
};
app.post("/api/users/signin", signin);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/routes.ts",
    codeHighlightLines: [[2, 4]],
    diagram: "account-dao",
    diagramFocus: "routes",
  },
  {
    id: "signin-flow",
    title: "Following a Sign-In Request",
    kind: "content",
    bullets: [
      "Form state `{ username: \"iron_man\", password: \"stark123\" }`",
      "axios POSTs it as JSON to `/api/users/signin`",
      "Express routes it to `signin`, which reads `req.body`",
      "The DAO finds a matching user, and the route sends it back as JSON",
      "The client stores `response.data` as the current user",
    ],
    diagram: "account-dao",
    diagramFocus: "client",
  },
  {
    id: "client",
    title: "Posting Credentials with Axios",
    kind: "demo",
    bullets: [
      "`HTTP_SERVER` is `process.env.NEXT_PUBLIC_HTTP_SERVER` from Lab 5",
      "`axios.post` sends the username and password as JSON",
    ],
    code: `import axios from "axios";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const USERS_API = \`\${HTTP_SERVER}/api/users\`;

export const signin = async (credentials: { username: string; password: string }) => {
  const response = await axios.post(
    \`\${USERS_API}/signin\`,
    credentials,
  );
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/account/client.ts",
    codeHighlightLines: [[7, 10]],
  },
  {
    id: "signin-ui",
    title: "Storing the Signed-In User",
    kind: "demo",
    bullets: [
      "Chapter 4 Context — not a Redux `accountReducer`",
      "`setCurrentUser(user)` then navigate to Dashboard",
    ],
    code: `import * as client from "../client";

const { setCurrentUser } = useAccountContext();
const signin = async () => {
  const user = await client.signin(credentials);
  if (!user) return;
  setCurrentUser(user);
  router.push("/dashboard");
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/signin/page.tsx",
    codeHighlightLines: [1, [5, 8]],
    diagram: "account-dao",
    diagramFocus: "ui",
  },
  {
    id: "signin-live",
    title: "Sign-In Live Demo",
    kind: "demo",
    bullets: [
      "Sign in with a username and password",
      "Submit stores the user and opens the Dashboard",
    ],
    embed: "kambaz-styled-signin",
  },
  {
    id: "signup-dao",
    title: "Users DAO creates a new user",
    kind: "demo",
    bullets: [
      "`createUser` copies the new user and assigns an `_id`",
      "`findUserByUsername` finds a taken name before insert",
    ],
    code: `import { v4 as uuidv4 } from "uuid";
const createUser = (user) => {
  const newUser = { ...user, _id: uuidv4() };
  users = [...users, newUser];
  return newUser;
};
const findUserByUsername = (username) =>
  users.find((user) => user.username === username);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/dao.ts",
    codeHighlightLines: [[2, 6], [7, 8]],
    codeBlocks: [
      {
        language: "bash",
        code: "npm install uuid",
      },
    ],
  },
  {
    id: "signup",
    title: "Implementing `POST /api/users/signup`",
    kind: "demo",
    bullets: [
      "400 if `findUserByUsername` already has that name",
      "Otherwise store `createUser` in `currentUser` and send it back",
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
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/routes.ts",
    codeHighlightLines: [[6, 8]],
  },
  {
    id: "signup-client",
    title: "Adding Signup to the Account Client",
    kind: "demo",
    bullets: [
      "Add signup beside signin. `HTTP_SERVER` and `USERS_API` are already declared there",
    ],
    code: `export const signup = async (user: { username: string; password: string }) => {
  const response = await axios.post(
    \`\${USERS_API}/signup\`,
    user,
  );
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/account/client.ts",
    codeAddedLines: [[1, 6]],
  },
  {
    id: "signup-ui",
    title: "Storing the Signed-Up User",
    kind: "demo",
    bullets: [
      "Same pattern as sign in, then go to Profile",
    ],
    code: "const { setCurrentUser } = useAccountContext();\nconst signup = async () => {\n  const current = await client.signup(user);\n  setCurrentUser(current);\n  router.push(\"/account/profile\");\n};",
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/signup/page.tsx",
  },
  {
    id: "signup-ui-live",
    title: "Sign-Up Live Demo",
    kind: "demo",
    bullets: [
      "Fill in a new username and password",
      "Submit lands on Profile as the new user",
    ],
    embed: "kambaz-ch4-signup",
  },
  {
    id: "profile-dao",
    title: "Users DAO updates a user",
    kind: "demo",
    bullets: [
      "`updateUser` replaces the matching user in the array",
      "`findUserById` reads that user back",
    ],
    code: `const findUserById = (userId) =>
  users.find((user) => user._id === userId);
const updateUser = (userId, user) =>
  (users = users.map((u) => (u._id === userId ? user : u)));`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/dao.ts",
    codeHighlightLines: [[3, 4]],
  },
  {
    id: "update",
    title: "Implementing `PUT /api/users/:userId`",
    kind: "demo",
    bullets: [
      "The path id and the body go to `dao.updateUser`",
      "Read the saved user back into `currentUser`",
    ],
    code: `const updateUser = (req, res) => {
  const userId = req.params.userId;
  const userUpdates = req.body;
  dao.updateUser(userId, userUpdates);
  currentUser = dao.findUserById(userId);
  res.json(currentUser);
};
app.put("/api/users/:userId", updateUser);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/routes.ts",
    codeHighlightLines: [[5, 6]],
  },
  {
    id: "update-client",
    title: "Sending Profile Updates with Axios",
    kind: "demo",
    bullets: [
      "`PUT` the edited user to `/api/users/:userId`",
    ],
    code: `export const updateUser = async (user: { _id: string }) => {
  const response = await axios.put(\`\${USERS_API}/\${user._id}\`, user);
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/account/client.ts",
    codeAddedLines: [[1, 4]],
  },
  {
    id: "profile-ui",
    title: "Storing the Updated Profile",
    kind: "demo",
    bullets: [
      "`client.updateUser` saves the form, then `setCurrentUser` stores it",
    ],
    code: `import * as client from "../client";

const { setCurrentUser } = useAccountContext();
const updateProfile = async () => {
  const user = await client.updateUser(profile);
  setCurrentUser(user);
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/profile/page.tsx",
    codeHighlightLines: [1, [5, 6]],
  },
  {
    id: "recap",
    title: "Recap: Account REST APIs",
    kind: "content",
    bullets: [
      "DAO for the array. Routes for `/api/users/*`",
      "The client calls each route; `setCurrentUser` stores the user",
      "One module-level `currentUser` is one user — sessions next",
    ],
  },
  {
    id: "next-up",
    title: "Next: Server Sessions",
    kind: "title",
    bullets: [
      "Cookies (small values the browser sends back on each request) so more than one browser can be signed in",
      "`express-session` and a specific CORS origin",
    ],
  },
];
