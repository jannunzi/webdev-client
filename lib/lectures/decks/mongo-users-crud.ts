import type { LectureSlide } from "../types";

export const MONGO_USERS_CRUD_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: "#00ED64",
      icon: "user",
      headline: "User CRUD",
    },
    bullets: [
      "Chapter 6 · User CRUD",
      "Filter, id, mutate",
    ],
  },
  {
    id: "users-picture",
    title: "Users from the Page to Mongo",
    kind: "demo",
    bullets: ["Every user route, from the page through the users collection"],
    diagram: "users-stack",
  },
  {
    id: "filter-path",
    title: "GET /api/users?role and ?name",
    kind: "demo",
    bullets: ["One GET. `role` and `name` are separate filters"],
    diagram: "users-filter",
  },
  {
    id: "predicates",
    title: "find() accepts a predicate",
    kind: "demo",
    bullets: [
      "`{ role }` is shorthand for `{ role: role }`",
      "`$regex` with flag `i` — `thor` finds Thor",
      "Export both so the route can call them",
    ],
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
    title: "One GET, two query filters",
    kind: "demo",
    bullets: [
      "Parse `role` and `name` from `req.query`",
      "Client encodes `?role=FACULTY` or `?name=thor`",
      "Independent filters are required — combining them is extra",
    ],
  },
  {
    id: "query-route",
    title: "One GET, two query filters (code)",
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
    id: "filter-role",
    title: "Role select filters the users",
    kind: "demo",
    code: `const [role, setRole] = useState("");
const filterUsersByRole = async (role: string) => {
  setRole(role);
  if (role) {
    const users = await client.findUsersByRole(role);
    setUsers(users);
  } else {
    fetchUsers();
  }
};
// in the JSX:
<select
  value={role}
  onChange={(e) => filterUsersByRole(e.target.value)}
  className="wd-select-role mb-2 w-1/4 rounded border border-neutral-300 px-2 py-1"
>
  <option value="">All Roles</option>
  <option value="STUDENT">Students</option>
  <option value="TA">Assistants</option>
  <option value="FACULTY">Faculty</option>
  <option value="ADMIN">Administrators</option>
</select>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/users/page.tsx",
    codeHighlightLines: [[2, 9], 14],
  },
  {
    id: "filter-name",
    title: "Name input filters the users",
    kind: "demo",
    code: `const [name, setName] = useState("");
const filterUsersByName = async (name: string) => {
  setName(name);
  if (name) {
    const users = await client.findUsersByPartialName(name);
    setUsers(users);
  } else {
    fetchUsers();
  }
};
// in the JSX:
<input
  className="wd-filter-by-name me-2 mb-2 w-1/4 rounded border border-neutral-300 px-2 py-1"
  placeholder="Search people"
  value={name}
  onChange={(e) => filterUsersByName(e.target.value)}
/>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/users/page.tsx",
    codeHighlightLines: [[2, 9], 16],
  },
  {
    id: "filter-live",
    title: "Filter by Role or Name",
    kind: "demo",
    bullets: [
      "Students shows only STUDENT. All Roles loads everyone",
      "Search people matches first or last name",
    ],
    embed: "lab6-users",
  },
  {
    id: "read-one-path",
    title: "GET /api/users/:userId",
    kind: "demo",
    bullets: ["findById loads the document Details shows"],
    diagram: "users-read-one",
  },
  {
    id: "by-id",
    links: ["http://localhost:4000/api/users/123"],
    title: "findById loads one document",
    kind: "demo",
    bullets: [
      "Convenience for `findOne({ _id: userId })`",
      "Confirm in the browser: `/api/users/` plus an `_id` from Compass",
    ],
    code: `const findUserById = (userId) => model.findById(userId);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/dao.ts",
    codeAddedLines: [1],
  },
  {
    id: "by-id-route",
    links: ["http://localhost:4000/api/users/123"],
    title: "GET one user route",
    kind: "demo",
    code: `const findUserById = async (req, res) => {
  const user = await dao.findUserById(req.params.userId);
  res.json(user);
};
app.get("/api/users/:userId", findUserById);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/routes.ts",
    codeAddedLines: [[1, 5]],
  },
  {
    id: "details",
    title: "People Details on a name click",
    kind: "demo",
    bullets: [
      "Parse `uid`. If missing, return `null` so the panel does not render",
      "`useEffect` depends on `uid` so a second click reloads",
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
    id: "details-ui",
    title: "Details Loads One User",
    kind: "demo",
    code: `const fetchUser = async () => {
  if (!uid) return;
  const user = await client.findUserById(uid);
  setUser(user);
};
useEffect(() => {
  fetchUser();
}, [uid]);`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/people/Details.tsx",
    codeHighlightLines: [[1, 8]],
  },
  {
    id: "read-one-live",
    title: "Open One User",
    kind: "demo",
    bullets: [
      "Click a name. Details loads that one document",
      "The panel shows the role and the login id",
    ],
    embed: "lab6-users",
  },
  {
    id: "delete-path",
    title: "DELETE /api/users/:userId",
    kind: "demo",
    bullets: ["Details deletes, then the list refreshes"],
    diagram: "users-delete",
  },
  {
    id: "delete",
    title: "DELETE by primary key",
    kind: "demo",
    bullets: [
      "`findByIdAndDelete` or `deleteOne({ _id })` — same result",
      "Details: red Delete, then `onClose`. Cancel leaves Compass unchanged",
    ],
    code: `const deleteUser = (userId) => model.findByIdAndDelete(userId);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/dao.ts",
    codeAddedLines: [1],
  },
  {
    id: "delete-route",
    title: "DELETE user route",
    kind: "demo",
    code: `app.delete("/api/users/:userId", async (req, res) => {
  const status = await dao.deleteUser(req.params.userId);
  res.json(status);
});`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/routes.ts",
    codeAddedLines: [[1, 4]],
  },
  {
    id: "delete-client",
    title: "Deleting a User from the Client",
    kind: "demo",
    code: `export const deleteUser = async (userId: string) => {
  const response = await axios.delete(\`\${USERS_API}/\${userId}\`);
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/account/client.ts",
    codeAddedLines: [[1, 4]],
  },
  {
    id: "delete-ui",
    title: "Delete Removes the Document",
    kind: "demo",
    code: `const deleteUser = async (uid: string) => {
  await client.deleteUser(uid);
  onClose();
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/people/Details.tsx",
    codeHighlightLines: [[1, 4]],
  },
  {
    id: "delete-live",
    title: "Delete Removes the Row",
    kind: "demo",
    bullets: [
      "Delete drops the document and closes Details",
      "That name leaves the table",
    ],
    embed: "lab6-users",
  },
  {
    id: "update-path",
    title: "PUT /api/users/:userId",
    kind: "demo",
    bullets: ["$set keeps fields the editor did not send"],
    diagram: "users-update",
  },
  {
    id: "update",
    title: "$set keeps the other fields",
    kind: "demo",
    bullets: [
      "Without `$set`, Mongoose replaces the whole document",
      "The route merges a matching `currentUser` into the session",
    ],
    code: `const updateUser = (userId, user) =>
  model.updateOne({ _id: userId }, { $set: user });`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/dao.ts",
    codeHighlightLines: [[1, 2]],
  },
  {
    id: "update-route",
    title: "PUT refreshes the session",
    kind: "demo",
    code: `const updateUser = async (req, res) => {
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
    codeHighlightLines: [[5, 8]],
  },
  {
    id: "update-client",
    title: "Updating a User from the Client",
    kind: "demo",
    code: `export const updateUser = async (user: any) => {
  const response = await axiosWithCredentials.put(
    \`\${USERS_API}/\${user._id}\`,
    user,
  );
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/account/client.ts",
    codeAddedLines: [[1, 7]],
  },
  {
    id: "update-ui",
    title: "Save Writes the User",
    kind: "demo",
    code: `const saveUser = async () => {
  const [firstName, lastName] = name.split(" ");
  const updatedUser = { ...user, firstName, lastName };
  await client.updateUser(updatedUser);
  setUser(updatedUser);
  setEditing(false);
  onClose();
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/people/Details.tsx",
    codeHighlightLines: [[1, 8]],
  },
  {
    id: "update-live",
    title: "Save Writes the Name",
    kind: "demo",
    bullets: [
      "Edit the name, then press Enter or Save",
      "The table shows the new name",
    ],
    embed: "lab6-users",
  },
  {
    id: "create-path",
    title: "POST /api/users",
    kind: "demo",
    bullets: ["The new document is the one the server returned"],
    diagram: "users-create",
  },
  {
    id: "create",
    title: "POST assigns a fresh uuid",
    kind: "demo",
    bullets: [
      "Strip a leftover `_id` — an empty string would collide",
      "`Date.now()` in the username so two clicks stay unique",
    ],
    code: `const createUser = (user) => {
  const newUser = { ...user, _id: uuidv4() };
  return model.create(newUser);
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/dao.ts",
    codeAddedLines: [[1, 4]],
  },
  {
    id: "create-route",
    title: "POST user route",
    kind: "demo",
    code: `const createUser = async (req, res) => {
  const user = await dao.createUser(req.body);
  res.json(user);
};
app.post("/api/users", createUser);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/routes.ts",
    codeAddedLines: [[1, 5]],
  },
  {
    id: "create-client",
    title: "Creating a User from the Client",
    kind: "demo",
    code: `export const createUser = async (user: any) => {
  const response = await axios.post(
    \`\${USERS_API}\`,
    user,
  );
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/account/client.ts",
    codeAddedLines: [[1, 7]],
  },
  {
    id: "create-ui",
    title: "Plus User Appends the Document",
    kind: "demo",
    code: `const createUser = async () => {
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
};`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/users/page.tsx",
    codeHighlightLines: [[1, 12]],
  },
  {
    id: "users-live",
    title: "Plus User Adds a Document",
    kind: "demo",
    bullets: [
      "+ Users inserts a New User",
      "The new row is the document the server returned",
    ],
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
    title: "Next: host the database",
    kind: "title",
    bullets: [
      "127.0.0.1 is empty on Render — Atlas is the public cluster",
      "Free Kambaz cluster, Compass, then a new Render service",
    ],
  },
];
