import { COVER_MONGO } from "../cover-colors";
import type { LectureSlide } from "../types";

export const MONGOOSE_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: COVER_MONGO,
      icon: "code",
      headline: "Mongoose",
    },
    bullets: [
      "Chapter 6 · Mongoose",
      "Connect, env, schema, DAO",
    ],
  },
  {
    id: "purpose",
    title: "Install Mongoose in webdev-server",
    kind: "demo",
    diagram: "mongoose-goal",
    bullets: [
      "Applications need `find`, `create`, `updateOne`, and `deleteOne`",
      "Run `npm install mongoose` in `webdev-server` on branch `a6`, not the Next.js app",
      "The connection URI stays in `webdev-server`",
    ],
    code: `cd webdev-server
npm install mongoose`,
    codeLanguage: "bash",
  },
  {
    id: "connect",
    title: "Connect before any route runs",
    kind: "demo",
    bullets: [
      "`CONNECTION_STRING` is `mongodb://127.0.0.1:27017/kambaz`",
      "Place `connect` near the top of `index.ts`",
      "If `mongod` is down, Mongoose retries and then fails",
    ],
    code: `import express from "express";
import mongoose from "mongoose";
const CONNECTION_STRING = "mongodb://127.0.0.1:27017/kambaz";
await mongoose.connect(CONNECTION_STRING);
const app = express();`,
    codeLanguage: "ts",
    codeFile: "webdev-server/index.ts",
    codeAddedLines: [2, [3, 4]],
  },
  {
    id: "env",
    title: "Put the URI in .env",
    kind: "demo",
    bullets: [
      "Node `.env` — not the Next.js `.env.local`",
      "`DATABASE_CONNECTION_STRING` is the MongoDB URI Node reads when it starts",
      "Alongside `SESSION_SECRET` from Chapter 5",
    ],
    code: `SERVER_ENV=development
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:4000
SESSION_SECRET=super secret session phrase
DATABASE_CONNECTION_STRING=mongodb://127.0.0.1:27017/kambaz`,
    codeLanguage: "bash",
    codeFile: "webdev-server/.env",
    codeAddedLines: [5],
  },
  {
    id: "read-env",
    title: "Read `process.env`, then connect",
    kind: "demo",
    bullets: [
      "`dotenv/config` loads `.env` before other modules read keys",
      "If `.env` has no `DATABASE_CONNECTION_STRING`, the `||` falls back to the local `mongodb://127.0.0.1:27017/kambaz`",
    ],
    code: `import "dotenv/config";
import mongoose from "mongoose";

const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING ||
  "mongodb://127.0.0.1:27017/kambaz";
await mongoose.connect(CONNECTION_STRING);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/index.ts",
    codeAddedLines: [1, [4, 6]],
  },
  {
    id: "schema-where",
    title: "SQL declares the schema, MongoDB does not",
    kind: "content",
    bullets: [
      "In SQL, each table's schema (columns and types) is defined in the database itself",
      "In MongoDB, the database doesn't enforce a schema; Mongoose schemas define it in application code",
      "`_id` is `String` so Chapter 3 ids still match enrollments",
    ],
  },
  {
    id: "schema-intro",
    title: "A schema validates writes",
    kind: "content",
    bullets: [
      "`required: true` rejects an insert that's missing `username`",
      "`unique: true` rejects an insert or update that would duplicate an existing `username` (enforced by a unique index in MongoDB)",
      "`{ collection: \"users\" }` names the collection; without it, Mongoose picks one for you (the lowercased, pluralized model name)",
    ],
  },
  {
    id: "schema",
    title: "A schema validates writes (code)",
    kind: "demo",
    code: `import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  _id: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
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
    title: "One compiled UserModel",
    kind: "demo",
    bullets: [
      "The model is the interface to a collection: `find`, `findById`, `create`, `updateOne`, `deleteOne`",
      "The schema describes a user. The model reads and writes `users`",
      "Those functions are generic for any schema. Mongoose is an ODM, like an ORM",
    ],
    code: `import mongoose from "mongoose";
import schema from "./schema";
const model = mongoose.model("UserModel", schema);
export default model;`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/model.ts",
    codeHighlightLines: [3],
  },
  {
    id: "dao",
    title: "DAO Finders Wrap Model Queries",
    kind: "demo",
    bullets: [
      "A DAO is the app's database API, written with the model's generic calls",
      "`findUserByUsername` wraps `model.findOne({ username })`",
      "Routes call the DAO only, so ch5 arrays become Mongo without route changes",
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
  ...`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/dao.ts",
    codeHighlightLines: [[4, 9]],
  },
  {
    id: "dao-writes",
    title: "DAO Writes Create, Update, and Delete",
    kind: "demo",
    bullets: [
      "`createUser` assigns `uuidv4()` so enrollments stay string ids",
      "`updateUser` uses `$set` so omitted fields stay as they were",
    ],
    code: `  ...
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
    codeHighlightLines: [[2, 3], 4, [5, 8]],
  },
  {
    id: "recap",
    title: "Mongoose recap",
    kind: "content",
    bullets: [
      "`npm install mongoose`, then `mongoose.connect` from env",
      "Schema describes `users`. Model exposes CRUD",
      "DAO names stay `findUserByCredentials` — routes `await` them next",
    ],
  },
  {
    id: "next-up",
    title: "Next: async account APIs",
    kind: "title",
    bullets: [
      "Tag routes `async` and expose find-all on `/api/users`",
      "Sign in still works, then an ADMIN Users screen",
    ],
  },
];
