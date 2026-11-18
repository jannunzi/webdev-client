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
        In the previous section we practiced interacting with the
        MongoDB database through the Compass graphical interface. That
        is all well and good to make occasional simple manual updates
        and queries to confirm the data behaves as expected, but
        applications need to interact with the database
        programmatically with libraries such as{" "}
        <OfficialLink href="https://mongoosejs.com/">
          Mongoose
        </OfficialLink>
        . Compass is a human tool; Mongoose is the library your Node
        process uses so Sign in, Dashboard, and the Users screen can
        create, read, update, and delete documents without anyone
        clicking Insert. The following sections describe how to
        install, configure, and connect a{" "}
        <OfficialLink href="https://nodejs.org/">
          Node.js
        </OfficialLink>{" "}
        application to a MongoDB database server using the Mongoose
        library. The final part of this chapter discusses how to
        configure the application to integrate to a MongoDB database
        hosted in MongoDB&apos;s Atlas cloud service, and how to point
        a new{" "}
        <OfficialLink href="https://render.com/">
          Render
        </OfficialLink>{" "}
        deployment at that remote URI. Do all your work in a new
        GitHub branch called <code>a6</code>{" "}in both the React and
        Node.js projects — <code>webdev-client</code>{" "}and the sibling{" "}
        <code>webdev-server</code>.
      </p>

      <Section
        level={3}
        id="sec-6-2-1"
        title="6.2.1 Installing and Connecting to a MongoDB Database"
      >
        <p>
          The Mongoose library implements a set of APIs and
          abstractions for applications to interact with a MongoDB
          database. Instead of opening a raw driver connection and
          writing collection names as strings in every call, you
          declare schemas and models once and then call{" "}
          <code>find</code>, <code>create</code>,{" "}
          <code>updateOne</code>, and <code>deleteOne</code>{" "}on those
          models. To use the Mongoose library, install it from the root
          of the Node.js project as shown below.
        </p>
        <CodeBlock language="shell">{`cd webdev-server
npm install mongoose`}</CodeBlock>
        <p>
          To connect to the database server programmatically, import
          the Mongoose library and then use the{" "}
          <code>connect</code>{" "}function as shown below. The URL in
          the <code>connect</code>{" "}function is called the{" "}
          <strong>connection string</strong>{" "}and is currently
          referring to a MongoDB server instance running on the
          localhost machine — the current laptop or desktop — listening
          at port 27017 and the <code>kambaz</code>{" "}database existing
          in that server, the same instance Compass just opened. In a
          later section we will revisit the connection string and
          configure it to connect to a database server running in a
          remote machine hosted by MongoDB&apos;s Atlas cloud service.
        </p>
        <CodeBlock
          language="ts"
          name="index"
          file="webdev-server/index.ts"
        >{`import express from "express";
import mongoose from "mongoose";
// load the mongoose library
// ...
const CONNECTION_STRING = "mongodb://127.0.0.1:27017/kambaz";
await mongoose.connect(CONNECTION_STRING);
// connect to the kambaz database
const app = express();
// ...`}</CodeBlock>
        <p>
          Place the <code>connect</code>{" "}call near the top of{" "}
          <code>index.ts</code>{" "}so the connection is established
          before any route handler tries to run a query. If MongoDB
          is not running, a database request such as{" "}
          <code>model.find()</code>{" "}fails after about 10 seconds,
          and the server stops after about 30 seconds. Start{" "}
          <code>mongod</code>{" "}(or check the connection string)
          before you start the server. The service or command-line
          process is in <SectionLink to="6.1.1" />.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-6-2-2"
        title="6.2.2 Configuring Connection Strings as Environment Variables"
      >
        <p>
          Instead of hard coding the connection string in the source
          code, it is better to configure it as an environment variable
          and then reference it from the code. This will come in handy
          when the server application is deployed to a remote service
          such as Render or Heroku and the connection string can be
          configured to reference the online remote database running on
          MongoDB&apos;s Atlas cloud service. You will create that
          cluster in <SectionLink to="6.3" />; for now the local URI
          is enough, and the same variable name will later hold the{" "}
          <code>mongodb+srv://</code>{" "}string. In the{" "}
          <code>.env</code>{" "}file of the Node project — not the
          Next.js <code>.env.local</code> — declare the following
          connection string environment variable alongside the session
          keys you already set in <ChapterLink to={5} />.
        </p>
        <CodeBlock language="shell">{`SERVER_ENV=development
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:4000
SESSION_SECRET=super secret session phrase
DATABASE_CONNECTION_STRING=mongodb://127.0.0.1:27017/kambaz`}</CodeBlock>
        <p>
          Then in <code>index.ts</code>, read the connection string as
          shown below. The <code>dotenv/config</code>{" "}import loads{" "}
          <code>.env</code>{" "}into <code>process.env</code>{" "}before
          any other module reads those keys. If the variable is
          missing, the fallback keeps you on localhost so a forgotten
          line does not silently point at nothing.
        </p>
        <CodeBlock
          language="ts"
          name="index"
          file="webdev-server/index.ts"
        >{`import "dotenv/config";
import mongoose from "mongoose";

const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING ||
  "mongodb://127.0.0.1:27017/kambaz";
await mongoose.connect(CONNECTION_STRING);`}</CodeBlock>
        <p>
          Use <code>DATABASE_CONNECTION_STRING</code>. After you add the
          line and restart <code>nodemon</code>, the status demo below
          should report a database connection when Mongo is reachable.
          In <SectionLink to="6.3.2" />{" "}you will type the same key
          into the Render Environment dashboard with an Atlas URI as
          the value, and you will not change this source file again.
        </p>
        <LiveDemo
          name="ConnectionStatus"
          file="app/labs/lab6/Connection.tsx"
          mode="styled"
        >
          <ConnectionStatus />
        </LiveDemo>
        <OnYourOwn>
          Add the <code>DATABASE_CONNECTION_STRING</code>{" "}line to the
          Node <code>.env</code>{" "}(not the Next.js one) and restart{" "}
          <code>nodemon</code>. Click the status button again after
          Express is up.
        </OnYourOwn>
        <WithAI
          prompt={`In webdev-server/.env.example, keep DATABASE_CONNECTION_STRING. Do not put a real Atlas password in any committed file.`}
        >
          Ask the assistant to keep the connection string name in the example env file:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-6-2-3"
        title="6.2.3 Implementing Mongoose Schemas and Models"
      >
        <p>
          As mentioned earlier, non-relational databases do not require
          specifying the structure, or schema, of the data stored in
          collections like relational databases do. That responsibility
          has been delegated to applications using non-relational
          databases. Once a Node.js application establishes a
          connection to a MongoDB database, the Mongoose API declares
          datatypes Schemas and Models to interact with collections.
          Mongoose Schemas describe the structure of the data being
          stored in the database and are used to validate the data
          being stored or modified through the Mongoose library. In
          SQL, each table&apos;s schema (columns and types) is defined
          in the database itself. In MongoDB, the database doesn&apos;t
          enforce a schema; Mongoose schemas define it in application
          code. <code>required: true</code> rejects an insert
          that&apos;s missing the field, for example{" "}
          <code>username</code>. The
          schema shown below describes the structure for the{" "}
          <code>users</code>{" "}collection imported earlier. Create the
          schema in a Users directory in your Node.js project.
        </p>
        <CodeBlock
          language="ts"
          name="userSchema"
          file="webdev-server/Kambaz/Users/schema.ts"
        >{`import mongoose from "mongoose";
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
export default userSchema;`}</CodeBlock>
        <p>
          Walk the fields one by one so the later DAO and Users screen
          make sense. <code>_id</code>{" "}is the primary key. We keep
          it a <code>String</code>{" "}so the identifiers from earlier
          JSON files still work; if we omitted it, MongoDB would assign
          ObjectIds and every enrollment that stored{" "}
          <code>&quot;123&quot;</code>{" "}would stop matching.{" "}
          <code>username</code>{" "}is marked{" "}
          <code>required: true</code>, so an insert that&apos;s missing
          the field is rejected. <code>unique: true</code>{" "}rejects
          an insert or update that would duplicate an existing value,
          enforced by a unique index in MongoDB.{" "}
          <code>password</code>{" "}is required.{" "}
          <code>select: false</code>{" "}leaves it off documents that{" "}
          <code>find</code>{" "}and <code>findOne</code>{" "}return. Sign
          in still matches it: the credentials query filters on{" "}
          <code>password</code>{" "}even when the field is hidden from
          the result. This course stores it in plain text only so that
          comparison works the way <ChapterLink to={5} />{" "}did.{" "}
          <code>firstName</code>, <code>lastName</code>, and{" "}
          <code>email</code>{" "}are plain strings with no extra
          configuration; they may be empty on a newly created user
          until someone edits them in People Details.{" "}
          <code>dob</code>{" "}is a <code>Date</code>{" "}so Compass and
          Mongoose agree on a calendar value rather than a free-form
          string. <code>role</code>{" "}is a string restricted by{" "}
          <code>enum</code>{" "}to <code>STUDENT</code>,{" "}
          <code>FACULTY</code>, <code>ADMIN</code>,{" "}
          <code>USER</code>, and <code>TA</code>, with a default of{" "}
          <code>USER</code>{" "}when the client does not send a role —
          that default is what keeps a forgotten field from becoming{" "}
          <code>undefined</code>{" "}in the Account Navigation check.{" "}
          <code>loginId</code>{" "}and <code>section</code>{" "}are
          strings the People table displays.{" "}
          <code>lastActivity</code>{" "}is a date and{" "}
          <code>totalActivity</code>{" "}is a string so the table can
          show a duration such as <code>10:21:32</code>{" "}without
          forcing a numeric type. The second argument,{" "}
          <code>{`{ collection: "users" }`}</code>, names the
          collection. Without it, Mongoose picks one for you (the
          lowercased, pluralized model name). With the option, documents
          go in the <code>users</code>{" "}collection you created in
          Compass.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-6-2-4"
        title="6.2.4 Implementing Mongoose Models"
      >
        <p>
          A Mongoose model is the interface the application uses to
          interact with one collection. It provides{" "}
          <code>find()</code>, <code>findById()</code>,{" "}
          <code>create()</code>, <code>updateOne()</code>, and{" "}
          <code>deleteOne()</code>. Those functions are deliberately
          generic so they work with any schema, the way an ORM works
          for SQL tables. Mongoose is an ODM, an object-document
          mapper. The schema says what a document looks like. The
          model uses that schema to read and write the{" "}
          <code>users</code>{" "}collection. Express with nodemon
          restarts the whole process, so{" "}
          <code>mongoose.model</code>{" "}does not need a hot-reload
          guard. In the next section the DAO wraps these generic
          calls in Kambaz names such as{" "}
          <code>findUserByCredentials</code>.
        </p>
        <CodeBlock
          language="ts"
          name="UserModel"
          file="webdev-server/Kambaz/Users/model.ts"
        >{`import mongoose from "mongoose";
import schema from "./schema";
const model = mongoose.model("UserModel", schema);
export default model;`}</CodeBlock>
      </Section>

      <Section
        level={3}
        id="sec-6-2-5"
        title="6.2.5 Retrieving Data from MongoDB with Mongoose"
      >
        <p>
          A DAO is the application-level interface to the database.
          Its functions are written in terms of the model&apos;s
          generic calls.{" "}
          <code>findUserByUsername</code>{" "}wraps{" "}
          <code>model.findOne({`{ username }`})</code>. Routes rely
          only on the API the DAO defines, so the data source can
          change without the rest of the application changing.{" "}
          <ChapterLink to={5} />{" "}read arrays from{" "}
          <code>Database/index.ts</code>. This chapter keeps those
          function names and reimplements them with the model. The{" "}
          <code>Kambaz/Users/dao.ts</code>{" "}listing below is that
          interface for the <code>users</code>{" "}collection.
        </p>
        <CodeBlock
          language="ts"
          name="UsersDao"
          file="webdev-server/Kambaz/Users/dao.ts"
        >{`import model from "./model";
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
          <code>findAllUsers</code>{" "}is <code>model.find()</code>{" "}
          with no predicate, so it returns every document in{" "}
          <code>users</code>. <code>findUserById</code>{" "}uses{" "}
          <code>findById</code>, which is the usual way to load one
          document by primary key. <code>findUserByUsername</code>{" "}
          calls <code>findOne</code>{" "}with{" "}
          <code>{`{ username }`}</code>{" "}so signup can reject a
          duplicate. <code>findUserByCredentials</code>{" "}matches both
          username and password in one query, which is what Sign in
          needs. <code>updateUser</code>{" "}identifies the document by{" "}
          <code>_id</code>{" "}and applies <code>$set</code>{" "}so only
          the fields in the payload change; fields you omit stay as
          they were. <code>deleteUser</code>{" "}removes one document by
          primary key. <code>createUser</code>{" "}copies the incoming
          object, assigns a fresh <code>uuidv4()</code>{" "}identifier,
          and inserts it; we generate the id in the application so the
          string format stays compatible with enrollments. Each of
          these functions returns a promise. Routes in the next section
          will <code>await</code>{" "}them. Practice the same verbs on a
          small todos collection before you touch Kambaz users. Create,
          find, find by id, update, and delete — that is every CRUD
          letter:
        </p>
        <LiveDemo
          name="Lab6Todos"
          file="app/labs/lab6/Todos.tsx"
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
