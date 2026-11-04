import type { LectureSlide } from "../types";

export const MONGO_USERS_CRUD_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: "#47A248",
      icon: "user",
      headline: "User CRUD with MongoDB",
    },
    bullets: [
      "Chapter 6 · User CRUD",
      "Filter, id, mutate",
    ],
  },
  {
    id: "purpose",
    title: "Searching and Editing Users",
    kind: "content",
    bullets: [
      "The Users screen lists everyone. Admins also need to search, edit, and remove",
      "MongoDB does the filtering, so the browser only receives matching users",
      "This deck adds filters, find by id, delete, update, and create",
    ],
  },
  {
    id: "predicates-how",
    title: "Filtering with Query Objects",
    kind: "content",
    bullets: [
      "`find()` takes an object describing which documents match",
      "`model.find({ role: \"FACULTY\" })` returns only faculty users",
      "`$regex` matches part of a text: `thor` matches `Thor`, and flag `i` ignores case",
      "`$or` matches when either condition holds — first name or last name",
    ],
  },
  {
    id: "predicates-intro",
    title: "Finding Users by Role and Name",
    kind: "demo",
    bullets: [
      "In `Kambaz/Users/dao.ts`, add both finders as shown below",
      "`{ role }` is shorthand for `{ role: role }`",
      "Export both so the route can call them",
    ],
  },
  {
    id: "predicates",
    title: "Writing Role and Name Queries",
    kind: "demo",
    code: `const findUsersByRole = (role) => model.find({ role });
const findUsersByPartialName = (partialName) => {
  const regex = new RegExp(partialName, "i");
  return model.find({
    $or: [
      { firstName: { $regex: regex } },
      { lastName: { $regex: regex } },
    ],
  });
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/dao.ts",
    codeAddedLines: [[1, 11]],
  },
  {
    id: "query-route-intro",
    title: "Filtering Users with Query Parameters",
    kind: "demo",
    bullets: [
      "In `routes.ts`, update `findAllUsers` as shown below",
      "Read `role` and `name` from `req.query`: `?role=FACULTY` or `?name=thor`",
      "Independent filters are required — combining them is extra",
    ],
  },
  {
    id: "query-route",
    links: ["http://localhost:4000/api/users?role=FACULTY", "http://localhost:4000/api/users?name=thor"],
    title: "Choosing a Query from the URL",
    kind: "demo",
    code: `const findAllUsers = async (req, res) => {
  const { role, name } = req.query;
  if (role) {
    const users = await dao.findUsersByRole(role);
    res.json(users);
    return;
  }
  if (name) {
    const users = await dao.findUsersByPartialName(name);
    res.json(users);
    return;
  }
  const users = await dao.findAllUsers();
  res.json(users);
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/routes.ts",
    codeAddedLines: [[2, 12]],
  },
  {
    id: "filter-ui",
    title: "Filtering Users from the Client",
    kind: "demo",
    bullets: [
      "In `account/client.ts`, add both filter calls as shown below",
      "On the Users screen, add a bordered role select and a name input",
      "All Roles clears the filter and calls `fetchUsers` again",
    ],
    code: `export const findUsersByRole = async (role: string) => {
  const response = await axios.get(\`\${USERS_API}?role=\${role}\`);
  return response.data;
};
export const findUsersByPartialName = async (name: string) => {
  const response = await axios.get(\`\${USERS_API}?name=\${name}\`);
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/account/client.ts",
    codeAddedLines: [[1, 8]],
  },
  {
    id: "by-id",
    links: ["http://localhost:4000/api/users/123"],
    title: "Loading One User by ID",
    kind: "demo",
    bullets: [
      "In `dao.ts`, add `findUserById`, then its route in `routes.ts`, as shown below",
      "`findById(id)` is short for `findOne({ _id: id })`",
      "Confirm in the browser: `/api/users/` plus an `_id` from Compass",
    ],
    code: `const findUserById = (userId) => model.findById(userId);
const findUserById = async (req, res) => {
  const user = await dao.findUserById(req.params.userId);
  res.json(user);
};
app.get("/api/users/:userId", findUserById);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/dao.ts",
    codeAddedLines: [[2, 6]],
  },
  {
    id: "details",
    title: "Fetching One User from the Client",
    kind: "demo",
    bullets: [
      "In `account/client.ts`, add `findUserById` as shown below",
      "People Details calls it with the clicked `uid`. No `uid`, no panel",
      "The panel is a fixed column on the right: `fixed top-0 end-0 bottom-0`, a white background, and a shadow",
    ],
    code: `export const findUserById = async (id: string) => {
  const response = await axios.get(\`\${USERS_API}/\${id}\`);
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/account/client.ts",
    codeAddedLines: [[1, 4]],
  },
  {
    id: "delete",
    title: "Deleting a User by ID",
    kind: "demo",
    bullets: [
      "In `dao.ts`, add `deleteUser` and its route as shown below",
      "`findByIdAndDelete` or `deleteOne({ _id })` — same result",
      "Details: red Delete, then `onClose`. Cancel leaves Compass unchanged",
    ],
    code: `const deleteUser = (userId) => model.findByIdAndDelete(userId);
app.delete("/api/users/:userId", async (req, res) => {
  const status = await dao.deleteUser(req.params.userId);
  res.json(status);
});`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/dao.ts",
    codeAddedLines: [[1, 5]],
  },
  {
    id: "update-how",
    title: "Changing Only Some Fields with $set",
    kind: "content",
    bullets: [
      "Stored: `{ _id: \"123\", firstName: \"Tony\", lastName: \"Stark\" }`",
      "`updateOne({ _id: \"123\" }, { $set: { firstName: \"Anthony\" } })`",
      "Result: `firstName` is `Anthony`. `lastName` is still `Stark`",
      "The first argument picks the document. `$set` lists only what changes",
    ],
  },
  {
    id: "update-intro",
    title: "Updating a User and the Session",
    kind: "demo",
    bullets: [
      "In `routes.ts`, add the update route as shown below",
      "If the path id matches `currentUser`, merge the changes into `req.session`",
      "Otherwise the signed-in user would keep seeing the old profile",
    ],
  },
  {
    id: "update",
    title: "Keeping the Session in Sync",
    kind: "demo",
    code: `const updateUser = (userId, user) =>
  model.updateOne({ _id: userId }, { $set: user });

const updateUser = async (req, res) => {
  const { userId } = req.params;
  const userUpdates = req.body;
  await dao.updateUser(userId, userUpdates);
  const currentUser = req.session["currentUser"];
  if (currentUser && currentUser._id === userId) {
    req.session["currentUser"] = { ...currentUser, ...userUpdates };
  }
  res.json(currentUser);
};
app.put("/api/users/:userId", updateUser);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/routes.ts",
    codeHighlightLines: [2, [8, 10]],
  },
  {
    id: "create",
    title: "Creating a User with a New ID",
    kind: "demo",
    bullets: [
      "In `routes.ts`, add the create route as shown below",
      "Strip a leftover `_id` — an empty string would collide",
      "`Date.now()` in the username so two clicks stay unique",
    ],
    code: `const createUser = (user) => {
  const newUser = { ...user, _id: uuidv4() };
  return model.create(newUser);
};
const createUser = async (req, res) => {
  const user = await dao.createUser(req.body);
  res.json(user);
};
app.post("/api/users", createUser);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/routes.ts",
    codeAddedLines: [[5, 9]],
    embed: "lab6-users",
  },
  {
    id: "recap",
    title: "User CRUD recap",
    kind: "content",
    bullets: [
      "`find({ role })` and `$regex` on first or last name",
      "`findById`, `findByIdAndDelete`, `updateOne` + `$set`, `create`",
      "Users screen: filter, open Details, edit, delete, then + User",
    ],
  },
  {
    id: "next-up",
    title: "Next: Hosting MongoDB on Atlas",
    kind: "title",
    bullets: [
      "127.0.0.1 is empty on Render — Atlas is the public cluster",
      "Free Kambaz cluster, Compass, then a new Render service",
    ],
  },
];
