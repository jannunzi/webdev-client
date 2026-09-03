import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import { OnYourOwn, WithAI } from "../../components/Practice";
import Lab6Users from "@/app/labs/lab6/intermediates/6-2-6-Users";

export default function Apis() {
  return (
    <Section
      level={3}
      id="sec-6-2-6"
      title="6.2.6 Implementing APIs to Interact with MongoDB from a React Client Application"
    >
      <p>
        DAOs hide vendor details. Routes hide HTTP: they turn a request
        into objects and call the DAO. The rest of this section is CRUD
        on users — retrieve all, retrieve by predicate, retrieve by
        primary key, delete, update, create — then a React client and a
        Users screen that call those routes.
      </p>

      <Section
        level={3}
        id="sec-6-2-6-1"
        title="6.2.6.1 Refactoring Account Routes"
      >
        <p>
          Chapter 5 DAOs were <strong>synchronous</strong> — they
          touched in-memory arrays. Mongoose returns promises. Tag every
          route <code>async</code> and <code>await</code> every DAO
          call. Confirm Signin, Signup, and Profile still work.
        </p>
        <CodeBlock
          language="js"
          name="UserRoutes"
          file="web-dev-server/Kambaz/Users/routes.js"
        >{`const signin = async (req, res) => {
  const { username, password } = req.body;
  const currentUser = await dao.findUserByCredentials(username, password);
  if (currentUser) {
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  } else {
    res.status(401).json({ message: "Unable to login. Try again later." });
  }
};

const signup = async (req, res) => {
  const user = await dao.findUserByUsername(req.body.username);
  if (user) {
    res.status(400).json({ message: "Username already taken" });
    return;
  }
  const currentUser = await dao.createUser(req.body);
  req.session["currentUser"] = currentUser;
  res.json(currentUser);
};`}</CodeBlock>
      </Section>

      <Section
        level={3}
        id="sec-6-2-6-2"
        title="6.2.6.2 Retrieving All Documents from MongoDB with Mongoose"
      >
        <p>
          <code>model.find()</code> with no predicate returns every
          document. Expose it as <code>GET /api/users</code> and confirm
          in the browser at{" "}
          <code>http://localhost:4000/api/users</code>.
        </p>
        <CodeBlock
          language="js"
          name="findAllUsers"
          file="web-dev-server/Kambaz/Users/dao.js"
        >{`const findAllUsers = () => model.find();`}</CodeBlock>
        <CodeBlock
          language="js"
          name="findAllUsers route"
          file="web-dev-server/Kambaz/Users/routes.js"
        >{`const findAllUsers = async (req, res) => {
  const users = await dao.findAllUsers();
  res.json(users);
};
app.get("/api/users", findAllUsers);`}</CodeBlock>
        <CodeBlock
          language="ts"
          name="findAllUsers"
          file="app/(kambaz)/account/client.ts"
        >{`export const findAllUsers = async () => {
  const response = await axiosWithCredentials.get(USERS_API);
  return response.data;
};`}</CodeBlock>
        <p>
          Refactor People Table into a component that accepts{" "}
          <code>users</code> instead of importing JSON. Create{" "}
          <code>app/(kambaz)/account/users/page.tsx</code> that fetches
          on mount and renders the table. Add a Users link on Account
          Navigation that appears only when{" "}
          <code>currentUser.role === &quot;ADMIN&quot;</code>. Sign in
          as <code>nick_fury</code> / <code>fury123</code> (seeded
          ADMIN) or change a role in Compass.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-6-2-6-3"
        title="6.2.6.3 Retrieving Documents by Predicate from MongoDB with Mongoose"
      >
        <p>
          <code>find</code> accepts a JSON predicate.{" "}
          <code>{`{ role }`}</code> keeps documents whose{" "}
          <code>role</code> matches. A regular expression matches
          partial first or last names, case-insensitive:
        </p>
        <CodeBlock
          language="js"
          name="predicates"
          file="web-dev-server/Kambaz/Users/dao.js"
        >{`const findUsersByRole = (role) => model.find({ role });
const findUsersByPartialName = (partialName) => {
  const regex = new RegExp(partialName, "i");
  return model.find({
    $or: [
      { firstName: { $regex: regex } },
      { lastName: { $regex: regex } },
    ],
  });
};`}</CodeBlock>
        <p>
          The route reads <code>role</code> and <code>name</code> from
          the query string. The client encodes them the same way. The
          Users screen has a role dropdown and a search field.
        </p>
        <CodeBlock
          language="ts"
          name="findUsersByRole"
          file="app/(kambaz)/account/client.ts"
        >{`export const findUsersByRole = async (role: string) => {
  const response = await axios.get(\`\${USERS_API}?role=\${role}\`);
  return response.data;
};
export const findUsersByPartialName = async (name: string) => {
  const response = await axios.get(\`\${USERS_API}?name=\${name}\`);
  return response.data;
};`}</CodeBlock>
      </Section>

      <Section
        level={3}
        id="sec-6-2-6-4"
        title="6.2.6.4 Retrieving Documents by Primary Key from MongoDB with Mongoose"
      >
        <p>
          <code>findById</code> loads one document. Clicking a name
          opens People Details with that <code>uid</code>.
        </p>
        <CodeBlock
          language="js"
          name="findUserById"
          file="web-dev-server/Kambaz/Users/dao.js"
        >{`const findUserById = (userId) => model.findById(userId);
// route:
const findUserById = async (req, res) => {
  const user = await dao.findUserById(req.params.userId);
  res.json(user);
};
app.get("/api/users/:userId", findUserById);`}</CodeBlock>
      </Section>

      <Section
        level={3}
        id="sec-6-2-6-5"
        title="6.2.6.5 Deleting a Document in MongoDB with Mongoose"
      >
        <CodeBlock
          language="js"
          name="deleteUser"
          file="web-dev-server/Kambaz/Users/dao.js"
        >{`const deleteUser = (userId) => model.findByIdAndDelete(userId);
app.delete("/api/users/:userId", async (req, res) => {
  const status = await dao.deleteUser(req.params.userId);
  res.json(status);
});`}</CodeBlock>
        <p>
          People Details has Delete and Cancel. Delete calls the client
          then closes; Cancel only closes.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-6-2-6-6"
        title="6.2.6.6 Updating a Document in MongoDB with Mongoose"
      >
        <p>
          <code>updateOne</code> identifies the document by{" "}
          <code>_id</code> and applies <code>$set</code>. If the
          session user is the one being edited, refresh the session
          copy too.
        </p>
        <CodeBlock
          language="js"
          name="updateUser"
          file="web-dev-server/Kambaz/Users/dao.js"
        >{`const updateUser = (userId, user) =>
  model.updateOne({ _id: userId }, { $set: user });`}</CodeBlock>
        <p>
          The pencil / check pattern toggles an input. Enter or the
          check splits the typed name into first and last and PUTs.
        </p>
        <OnYourOwn>
          In People Details, add fields to edit email (type{" "}
          <code>email</code>) and role (the same dropdown as the
          filter). Persist them with <code>updateUser</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/(kambaz)/courses/[cid]/people/Details.tsx, keep any extra field I added. Add sample controls to edit user.email (type=email) and user.role (select STUDENT/TA/FACULTY/ADMIN) and include them in saveUser. Do not rename my personal fields.`}
        >
          Ask the assistant to add email and role after your own extra
          field:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-6-2-6-7"
        title="6.2.6.7 Creating New Documents in MongoDB with Mongoose"
      >
        <p>
          Strip a leftover <code>_id</code> from the incoming object,
          assign <code>uuidv4()</code>, and{" "}
          <code>model.create</code>. <code>POST /api/users</code>{" "}
          returns the inserted document. The Users screen&apos;s + Users
          button posts defaults:
        </p>
        <CodeBlock
          language="js"
          name="createUser"
          file="web-dev-server/Kambaz/Users/dao.js"
        >{`const createUser = (user) => {
  const newUser = { ...user, _id: uuidv4() };
  return model.create(newUser);
};`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="Users"
          file="app/(kambaz)/account/users/page.tsx"
        >{`const createUser = async () => {
  const user = await client.createUser({
    firstName: "New",
    lastName: \`User \${users.length + 1}\`,
    username: \`newuser\${Date.now()}\`,
    password: "password123",
    email: \`email\${users.length + 1}@neu.edu\`,
    section: "S101",
    role: "STUDENT",
  });
  setUsers([...users, user]);
};`}</CodeBlock>
        <p>
          The LiveDemo below is that Users screen against the Lab 6
          store — find all, filter by role and name, open details,
          update, delete, create:
        </p>
        <LiveDemo
          name="Lab6Users"
          file="app/labs/lab6/intermediates/6-2-6-Users.tsx"
          mode="styled"
        >
          <Lab6Users />
        </LiveDemo>
        <OnYourOwn>
          Create a user, filter by STUDENT, search part of the last
          name, edit the name, then delete the user you created.
        </OnYourOwn>
      </Section>
    </Section>
  );
}
