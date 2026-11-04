import type { LectureSlide } from "../types";

export const MONGOOSE_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: "#880000",
      icon: "database",
      headline: "Programming with Mongoose",
    },
    bullets: [
      "Chapter 6 · Mongoose",
      "Connect, env, schema, DAO",
    ],
  },
  {
    id: "purpose",
    title: "Talking to MongoDB from Node.js",
    kind: "content",
    bullets: [
      "Compass lets people edit data. The Express server needs to do it in code",
      "Mongoose is a library that connects Node.js to MongoDB",
      "It checks document shapes and gives you `find`, `create`, `updateOne`, and `deleteOne`",
      "Work on branch `a6` in both `webdev-client` and `webdev-server`",
    ],
  },
  {
    id: "install",
    title: "Installing the Mongoose Library",
    kind: "demo",
    bullets: [
      "From the `webdev-server` folder — not the Next.js app",
      "You write schemas and models once, then call them from the routes",
    ],
    code: `cd webdev-server
npm install mongoose`,
    codeLanguage: "bash",
  },
  {
    id: "connection-how",
    title: "Reading a Connection String",
    kind: "content",
    bullets: [
      "A connection string is the database's address: `mongodb://127.0.0.1:27017/kambaz`",
      "`mongodb://` is the scheme. `127.0.0.1` is your own laptop",
      "`27017` is the port `mongod` listens on. `/kambaz` names the database",
      "`mongoose.connect` opens that connection once, when the server starts",
    ],
  },
  {
    id: "connect",
    title: "Connecting When the Server Starts",
    kind: "demo",
    bullets: [
      "In `index.ts`, import mongoose and connect as shown below",
      "Connect near the top, before any route runs",
      "If `mongod` is down, Mongoose retries and then fails",
    ],
    code: `import express from "express";
import mongoose from "mongoose";
const CONNECTION_STRING = "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING);
const app = express();`,
    codeLanguage: "ts",
    codeFile: "webdev-server/index.ts",
    codeAddedLines: [2, [3, 4]],
  },
  {
    id: "env",
    title: "Storing the Connection String in .env",
    kind: "demo",
    bullets: [
      "In `webdev-server/.env`, add `DATABASE_CONNECTION_STRING` as shown below",
      "This is the server's `.env` — not the Next.js `.env.local`",
      "Later the same key holds the Atlas `mongodb+srv://` string",
    ],
    code: `SERVER_ENV=development
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:4000
SESSION_SECRET=super secret session phrase
DATABASE_CONNECTION_STRING=mongodb://127.0.0.1:27017/kambaz`,
    codeLanguage: "bash",
    codeFile: "webdev-server/.env",
    codeAddedLines: [5],
    embed: "lab6-status",
  },
  {
    id: "read-env",
    title: "Reading the Connection String in Code",
    kind: "demo",
    bullets: [
      "In `index.ts`, read the key from `process.env` as shown below",
      "`dotenv/config` loads `.env` before other modules read keys",
      "The fallback keeps you on localhost if the line is missing",
    ],
    code: `import "dotenv/config";
import mongoose from "mongoose";

const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING ||
  "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/index.ts",
    codeAddedLines: [1, [4, 6]],
  },
  {
    id: "schema-how",
    title: "What a Schema Checks",
    kind: "content",
    bullets: [
      "MongoDB itself accepts any document shape",
      "A schema lists each field and its type: `username: String`, `dob: Date`",
      "Saving `{ password: \"stark123\" }` with no `username` fails because `username` is required",
      "A `role` of `\"PILOT\"` fails because it is not in the allowed list",
    ],
  },
  {
    id: "schema-intro",
    title: "Creating the User Schema",
    kind: "demo",
    bullets: [
      "In a new `Kambaz/Users/schema.ts` file, create the schema as shown below",
      "`_id` is `String` so Chapter 3 ids still match enrollments",
      "`username` is required and unique. `role` defaults to `USER`",
      "`{ collection: \"users\" }` — do not let Mongoose invent a name",
    ],
  },
  {
    id: "schema",
    title: "Defining Fields, Types, and Defaults",
    kind: "demo",
    code: `import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  _id: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  email: String,
  lastName: String,
  dob: Date,
  role: {
    type: String,
    enum: ["STUDENT", "FACULTY", "ADMIN", "USER", "TA"],
    default: "USER",
  },
  loginId: String,
  section: String,
  lastActivity: Date,
  totalActivity: String,
},
{ collection: "users" });
export default userSchema;`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/schema.ts",
    codeHighlightLines: [3, [4, 5], [10, 15], 20],
  },
  {
    id: "model",
    title: "Compiling a Schema into a Model",
    kind: "demo",
    bullets: [
      "In a new `Kambaz/Users/model.ts` file, create the model as shown below",
      "`\"UserModel\"` is the name other schemas `ref` — enrollments later",
      "You do not instantiate it. Import it and call `model.find()`",
    ],
    code: `import mongoose from "mongoose";
import schema from "./schema";
const model = mongoose.model("UserModel", schema);
export default model;`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/model.ts",
    codeAddedLines: [3],
  },
  {
    id: "dao-how",
    title: "Hiding the Database Behind a DAO",
    kind: "content",
    bullets: [
      "A data access object (DAO) is the one file that talks to the model",
      "Routes call `dao.findUserById(\"123\")` and never touch Mongoose directly",
      "Same function names as Chapter 5, but each now returns a promise",
      "`await dao.findUserById(\"123\")` gives back the `iron_man` document",
    ],
  },
  {
    id: "dao",
    title: "Rewriting the Users DAO with Mongoose",
    kind: "demo",
    bullets: [
      "In `Kambaz/Users/dao.ts`, replace the array code as shown below",
      "`createUser` assigns `uuidv4()` so enrollments stay string ids",
      "`updateUser` uses `$set` so omitted fields stay as they were",
    ],
    code: `import model from "./model";
import { v4 as uuidv4 } from "uuid";
export default function UsersDao() {
  const findAllUsers = () => model.find();
  const findUserById = (userId) => model.findById(userId);
  const findUserByUsername = (username) =>
    model.findOne({ username: username });
  const findUserByCredentials = (username, password) =>
    model.findOne({ username, password });
  const updateUser = (userId, user) =>
    model.updateOne({ _id: userId }, { $set: user });
  const deleteUser = (userId) => model.deleteOne({ _id: userId });
  const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    return model.create(newUser);
  };
  return {
    createUser, findAllUsers, findUserById,
    findUserByUsername, findUserByCredentials, updateUser, deleteUser,
  };
}`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/dao.ts",
    codeHighlightLines: [4, [10, 11], [13, 16]],
    embed: "lab6-todos",
  },
  {
    id: "recap",
    title: "Mongoose recap",
    kind: "content",
    bullets: [
      "`npm install mongoose`, then `mongoose.connect` from `.env`",
      "Schema describes `users`. Model exposes CRUD",
      "DAO names stay `findUserByCredentials` — routes `await` them next",
    ],
  },
  {
    id: "next-up",
    title: "Next: Database-Backed User APIs",
    kind: "title",
    bullets: [
      "Tag routes `async` and expose find-all on `/api/users`",
      "Sign in still works, then an ADMIN Users screen",
    ],
  },
];
