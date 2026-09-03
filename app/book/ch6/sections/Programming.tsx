import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import OfficialLink from "../../components/OfficialLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import { OnYourOwn, WithAI } from "../../components/Practice";
import ConnectionStatus from "@/app/labs/lab6/intermediates/6-2-1-Connection";
import Lab6Todos from "@/app/labs/lab6/intermediates/6-2-5-Todos";

export default function Programming() {
  return (
    <Section id="sec-6-2" title="6.2 Programming with a MongoDB Database">
      <p>
        Compass is fine for a one-off insert. Applications talk to
        MongoDB through a library.{" "}
        <OfficialLink href="https://mongoosejs.com/">
          Mongoose
        </OfficialLink>{" "}
        is the usual choice on Node. Do this work on branch{" "}
        <code>a6</code> in <em>both</em> repositories —{" "}
        <code>webdev-client</code> and{" "}
        <code>webdev-server</code>.
      </p>
      <p>
        LiveDemos in this book call same-origin{" "}
        <code>/api/lab6</code>, which implements the Express Lab 6
        contract with an in-memory store so pages render when{" "}
        <code>mongod</code> is not running. The teaching code below is
        the sibling server. When{" "}
        <code>DATABASE_CONNECTION_STRING</code> (or{" "}
        <code>MONGO_CONNECTION_STRING</code>) is set and reachable,
        those DAOs use Mongoose; otherwise they keep the Chapter 5
        arrays. The prose is written as if the database is connected —
        that is the path you will run tomorrow and on Atlas.
      </p>

      <Section
        level={3}
        id="sec-6-2-1"
        title="6.2.1 Installing and Connecting to a MongoDB Database"
      >
        <p>
          From the root of the Node project:
        </p>
        <CodeBlock language="shell">{`cd webdev-server
npm install mongoose`}</CodeBlock>
        <p>
          Import Mongoose and call <code>connect</code> with a{" "}
          <strong>connection string</strong>. The URI below is a
          database named <code>kambaz</code> on localhost port 27017 —
          the same instance Compass just opened:
        </p>
        <CodeBlock
          language="js"
          name="index"
          file="webdev-server/index.js"
        >{`import express from "express";
import mongoose from "mongoose";
// ...
const CONNECTION_STRING = "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING);
const app = express();`}</CodeBlock>
        <p>
          This book wraps that call in{" "}
          <code>connectDatabase()</code> so a missing or dead URI does
          not crash CI. The string you write as a student is the one
          above.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-6-2-2"
        title="6.2.2 Configuring Connection Strings as Environment Variables"
      >
        <p>
          Do not leave the URI in source. When you deploy to Render,
          the same code should read an Atlas string from the
          environment. In the Node project <code>.env</code>:
        </p>
        <CodeBlock language="shell">{`SERVER_ENV=development
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:4000
SESSION_SECRET=super secret session phrase
DATABASE_CONNECTION_STRING=mongodb://127.0.0.1:27017/kambaz`}</CodeBlock>
        <CodeBlock
          language="js"
          name="index"
          file="webdev-server/index.js"
        >{`import "dotenv/config";
import mongoose from "mongoose";

const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING ||
  "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING);`}</CodeBlock>
        <p>
          The PDF name is <code>DATABASE_CONNECTION_STRING</code>. This
          repo also accepts <code>MONGO_CONNECTION_STRING</code>. If
          neither is set, DAOs stay in memory and{" "}
          <code>/lab6/status</code> reports{" "}
          <code>store: &quot;memory&quot;</code>.
        </p>
        <LiveDemo
          name="ConnectionStatus"
          file="app/labs/lab6/intermediates/6-2-1-Connection.tsx"
          mode="styled"
        >
          <ConnectionStatus />
        </LiveDemo>
        <OnYourOwn>
          Add the <code>DATABASE_CONNECTION_STRING</code> line to the
          Node <code>.env</code> (not the Next.js one) and restart{" "}
          <code>nodemon</code>. Click the status button again after
          Express is up — or keep using the book store for now.
        </OnYourOwn>
        <WithAI
          prompt={`In webdev-server/.env.example, keep DATABASE_CONNECTION_STRING as the PDF name and mention MONGO_CONNECTION_STRING as an alias. Do not put a real Atlas password in any committed file.`}
        >
          Ask the assistant to keep the env names straight:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-6-2-3"
        title="6.2.3 Implementing Mongoose Schemas and Models"
      >
        <p>
          MongoDB does not enforce a schema. Mongoose does, in your
          application. A schema lists field names, types, required /
          unique flags, enums, and the collection name. Create{" "}
          <code>Kambaz/Users/schema.js</code>:
        </p>
        <CodeBlock
          language="js"
          name="userSchema"
          file="webdev-server/Kambaz/Users/schema.js"
        >{`import mongoose from "mongoose";
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
export default userSchema;`}</CodeBlock>
        <p>
          <code>_id</code> is the primary key. We keep it a{" "}
          <code>String</code> so the IDs from earlier JSON files still
          work. <code>username</code> is required and unique — two
          signups cannot share it.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-6-2-4"
        title="6.2.4 Implementing Mongoose Models"
      >
        <p>
          A model is the low-level CRUD API: <code>find</code>,{" "}
          <code>create</code>, <code>updateOne</code>,{" "}
          <code>deleteOne</code>, <code>findById</code>. Those names
          are generic on purpose — they work for any collection. The
          next section wraps them in Kambaz-specific DAO functions.
        </p>
        <CodeBlock
          language="js"
          name="UserModel"
          file="webdev-server/Kambaz/Users/model.js"
        >{`import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("UserModel", schema);
export default model;`}</CodeBlock>
        <p>
          The string <code>&quot;UserModel&quot;</code> is the model
          name other schemas use in <code>ref</code> — enrollments
          will point at it in <SectionLink to="6.4.3" />.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-6-2-5"
        title="6.2.5 Retrieving Data from MongoDB with Mongoose"
      >
        <p>
          <ChapterLink to={5} />
          &apos;s DAO read arrays from{" "}
          <code>Database/index.js</code>. This chapter keeps the same
          function names and reimplements them with the model.{" "}
          <code>findAllUsers</code> is <code>model.find()</code>;{" "}
          <code>findUserByUsername</code> is{" "}
          <code>model.findOne({`{ username }` })</code>.
        </p>
        <CodeBlock
          language="js"
          name="UsersDao"
          file="webdev-server/Kambaz/Users/dao.js"
        >{`import model from "./model.js";
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
}`}</CodeBlock>
        <p>
          Practice the same verbs on a small todos collection before
          you touch Kambaz users. Create, find, find by id, update, and
          delete — that is every CRUD letter:
        </p>
        <LiveDemo
          name="Lab6Todos"
          file="app/labs/lab6/intermediates/6-2-5-Todos.tsx"
          mode="styled"
        >
          <Lab6Todos />
        </LiveDemo>
        <OnYourOwn>
          Add a todo whose title includes your name, mark it complete,
          then delete it. Confirm the list updates after each click.
        </OnYourOwn>
      </Section>
    </Section>
  );
}
