import { COVER_MONGO } from "../cover-colors";
import type { LectureSlide } from "../types";

export const MONGO_USERS_CRUD_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: COVER_MONGO,
      icon: "user",
      headline: "CRUD Users",
    },
    bullets: [
      "Chapter 6 · CRUD Users",
      "Filter, open one, delete, update, create",
    ],
  },
  {
    id: "goal",
    title: "What we are building",
    kind: "demo",
    bullets: [
      "The Users page already lists every document",
      "Filter that list, open one user, then write",
      "Delete, update, and create change the collection",
    ],
    diagram: "users-crud-goal",
  },
  {
    id: "filter-why",
    title: "Filter by role and by name",
    kind: "demo",
    bullets: [
      "Ask for a subset: all faculty, or a typed name",
      "Ids go in the path. Filters go in the query string",
      "Role first. Then a name with a regular expression",
    ],
    diagram: "users-filters-preview",
  },
  {
    id: "role-path",
    title: "GET /api/users?role=",
    kind: "demo",
    bullets: ["The role menu, the client, the same GET, then `find({ role })`"],
    diagram: "users-filter-role",
  },
  {
    id: "role-dao",
    title: "findUsersByRole in the DAO",
    kind: "demo",
    bullets: [
      "`{ role }` is shorthand for `{ role: role }`",
      "`find()` returns an array. Many users share a role",
      "Export `findUsersByRole` on the object the DAO returns",
    ],
    code: `const findUsersByRole = (role) => model.find({ role });
return {
  createUser, findAllUsers, findUserById,
  findUserByUsername, findUserByCredentials,
  updateUser, deleteUser, findUsersByRole,
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/dao.ts",
    codeAddedLines: [1, 6],
  },
  {
    id: "role-route",
    title: "GET /api/users reads ?role=",
    kind: "demo",
    bullets: [
      "Same `GET /api/users`. Read `role` from `req.query`",
      "A role returns that subset, then `return`",
      "Leave `name` off until the next section",
    ],
    code: `const findAllUsers = async (req, res) => {
  const { role } = req.query;
  if (role) {
    const users = await dao.findUsersByRole(role);
    res.json(users);
    return;
  }
  const users = await dao.findAllUsers();
  res.json(users);
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/routes.ts",
    codeAddedLines: [[2, 7]],
  },
  {
    id: "role-ui",
    title: "Role from the client and page",
    kind: "demo",
    bullets: [
      "An empty value calls `fetchUsers()`",
      "Faculty sends `?role=FACULTY`",
    ],
    codeBlocks: [
      {
        code: `export const findUsersByRole = async (role: string) => {
  const response = await axios.get(\`\${USERS_API}?role=\${role}\`);
  return response.data;
};`,
        language: "ts",
        file: "app/(kambaz)/account/client.ts",
        addedLines: [[1, 4]],
      },
      {
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
        language: "tsx",
        file: "app/(kambaz)/account/users/page.tsx",
        highlightLines: [[2, 9], 14],
      },
    ],
  },
  {
    id: "role-result",
    title: "Faculty narrows the list",
    kind: "demo",
    bullets: [
      "The menu reads Faculty",
      "The request is `GET /api/users?role=FACULTY`",
      "The rows are Nick Fury and Bruce Banner",
    ],
    diagram: "users-role-result",
  },
  {
    id: "name-path",
    title: "GET /api/users?name=",
    kind: "demo",
    bullets: ["Search people, the client, the same GET, then a regular expression"],
    diagram: "users-filter-name",
  },
  {
    id: "name-dao",
    title: "Partial name in the DAO",
    kind: "demo",
    bullets: [
      "The `i` flag is case-insensitive, so `thor` finds Thor",
      "`$or` means either first name or last name matches",
      "Export it. The book searches first and last name only",
    ],
    code: `const findUsersByPartialName = (partialName) => {
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
    codeAddedLines: [[1, 9]],
  },
  {
    id: "name-route",
    title: "GET /api/users reads ?name=",
    kind: "demo",
    bullets: [
      "Add `if (name)` under the existing `if (role)`",
      "When both are sent, `role` wins",
      "Still one route. The handler reads `req.query`",
    ],
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
    codeAddedLines: [2, [7, 11]],
  },
  {
    id: "name-ui",
    title: "Name from the client and page",
    kind: "demo",
    bullets: [
      "Every keystroke sends the partial name",
      "An empty field calls `fetchUsers()`",
    ],
    codeBlocks: [
      {
        code: `export const findUsersByPartialName = async (name: string) => {
  const response = await axios.get(\`\${USERS_API}?name=\${name}\`);
  return response.data;
};`,
        language: "ts",
        file: "app/(kambaz)/account/client.ts",
        addedLines: [[1, 4]],
      },
      {
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
        language: "tsx",
        file: "app/(kambaz)/account/users/page.tsx",
        highlightLines: [[2, 9], 16],
      },
    ],
  },
  {
    id: "name-result",
    title: "Stark narrows the list",
    kind: "demo",
    bullets: [
      "Search people reads Stark",
      "The request is `GET /api/users?name=Stark`",
      "The only row is Tony Stark",
    ],
    diagram: "users-name-result",
  },
  {
    id: "read-one-path",
    title: "GET /api/users/:userId",
    kind: "demo",
    bullets: [
      "The id belongs in the path, not the query string",
      "This route is not `GET /api/users`",
    ],
    diagram: "users-read-one",
  },
  {
    id: "by-id",
    links: ["http://localhost:4000/api/users/123"],
    title: "findById and the GET route",
    kind: "demo",
    bullets: [
      "`findById` is shorthand for `findOne({ _id: userId })`",
      "Open `/api/users/` plus an id in the browser",
    ],
    codeBlocks: [
      {
        code: `const findUserById = (userId) => model.findById(userId);`,
        language: "ts",
        file: "webdev-server/Kambaz/Users/dao.ts",
        addedLines: [1],
      },
      {
        code: `const findUserById = async (req, res) => {
  const user = await dao.findUserById(req.params.userId);
  res.json(user);
};
app.get("/api/users/:userId", findUserById);`,
        language: "ts",
        file: "webdev-server/Kambaz/Users/routes.ts",
        addedLines: [[1, 5]],
      },
    ],
  },
  {
    id: "details",
    title: "Client and People Details",
    kind: "demo",
    bullets: [
      "No `uid` means `return null`, so the panel stays hidden",
      "`useEffect` depends on `uid`, so the next name reloads",
      "The id is in the path, not the query string",
    ],
    codeBlocks: [
      {
        code: `export const findUserById = async (id: string) => {
  const response = await axios.get(\`\${USERS_API}/\${id}\`);
  return response.data;
};`,
        language: "ts",
        file: "app/(kambaz)/account/client.ts",
        addedLines: [[1, 4]],
      },
      {
        code: `const fetchUser = async () => {
  if (!uid) return;
  const user = await client.findUserById(uid);
  setUser(user);
};
useEffect(() => {
  if (uid) fetchUser();
}, [uid]);
if (!uid) return null;
<div className="wd-name text-lg text-red-700">
  {user.firstName} {user.lastName}
</div>
<b>Roles:</b> <span className="wd-roles">{user.role}</span>
<br />
<b>Login ID:</b> <span className="wd-login-id">{user.loginId}</span>
<br />
<b>Section:</b> <span className="wd-section">{user.section}</span>
// Table.tsx, on the name cell:
onClick={() => {
  setShowDetails(true);
  setShowUserId(user._id);
}}`,
        language: "tsx",
        file: "app/(kambaz)/courses/[cid]/people/Details.tsx",
        highlightLines: [[1, 10]],
      },
    ],
  },
  {
    id: "details-result",
    title: "Details shows one user",
    kind: "demo",
    bullets: [
      "Bruce Banner's name is the open link",
      "The request is `GET /api/users/789`",
      "The panel shows his role, login, and section",
    ],
    diagram: "users-details-result",
  },
  {
    id: "delete-path",
    title: "DELETE /api/users/:userId",
    kind: "demo",
    bullets: ["Details deletes, then the list refreshes"],
    diagram: "users-delete",
  },
  {
    id: "delete-server",
    title: "Delete in the DAO and route",
    kind: "demo",
    bullets: [
      "The id is in the path",
      "The route sends back the DAO result, not the user list",
    ],
    codeBlocks: [
      {
        code: `const deleteUser = (userId) => model.findByIdAndDelete(userId);`,
        language: "ts",
        file: "webdev-server/Kambaz/Users/dao.ts",
        addedLines: [1],
      },
      {
        code: `app.delete("/api/users/:userId", async (req, res) => {
  const status = await dao.deleteUser(req.params.userId);
  res.json(status);
});`,
        language: "ts",
        file: "webdev-server/Kambaz/Users/routes.ts",
        addedLines: [[1, 4]],
      },
    ],
  },
  {
    id: "delete-ui",
    title: "Delete from Details",
    kind: "demo",
    bullets: [
      "Delete calls the API, then closes and refreshes",
      "Cancel only closes. The document stays",
    ],
    codeBlocks: [
      {
        code: `export const deleteUser = async (userId: string) => {
  const response = await axios.delete(\`\${USERS_API}/\${userId}\`);
  return response.data;
};`,
        language: "ts",
        file: "app/(kambaz)/account/client.ts",
        addedLines: [[1, 4]],
      },
      {
        code: `const deleteUser = async (uid: string) => {
  await client.deleteUser(uid);
  onClose();
};
// in the JSX, after the activity fields:
<button
  type="button"
  onClick={() => deleteUser(uid)}
  className="wd-delete float-end rounded bg-red-600 px-3 py-1 text-sm text-white"
>
  Delete
</button>
<button
  type="button"
  onClick={onClose}
  className="wd-cancel float-end me-2 rounded bg-neutral-200 px-3 py-1 text-sm"
>
  Cancel
</button>`,
        language: "tsx",
        file: "app/(kambaz)/courses/[cid]/people/Details.tsx",
        highlightLines: [[1, 4], [6, 18]],
      },
    ],
  },
  {
    id: "delete-result",
    title: "Delete removes the user",
    kind: "demo",
    bullets: [
      "The request is `DELETE /api/users/789`",
      "Bruce Banner is not in the list",
    ],
    diagram: "users-delete-result",
  },
  {
    id: "update-path",
    title: "PUT /api/users/:userId",
    kind: "demo",
    bullets: ["`$set` keeps fields the editor did not send"],
    diagram: "users-update",
  },
  {
    id: "update-server",
    title: "$set and the session route",
    kind: "demo",
    bullets: [
      "Without `$set`, only the fields you sent would remain",
      "Always update the database. Copy the session only if the ids match",
      "Editing someone else must not change your own role",
    ],
    codeBlocks: [
      {
        code: `const updateUser = (userId, user) =>
  model.updateOne({ _id: userId }, { $set: user });`,
        language: "ts",
        file: "webdev-server/Kambaz/Users/dao.ts",
        highlightLines: [[1, 2]],
      },
      {
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
        language: "ts",
        file: "webdev-server/Kambaz/Users/routes.ts",
        highlightLines: [[6, 8]],
      },
    ],
  },
  {
    id: "update-ui",
    title: "Save from Details",
    kind: "demo",
    bullets: [
      "One input holds first and last, split on a space",
      "Enter or the check saves, then the panel closes",
    ],
    codeBlocks: [
      {
        code: `export const updateUser = async (user: any) => {
  const response = await axiosWithCredentials.put(
    \`\${USERS_API}/\${user._id}\`,
    user,
  );
  return response.data;
};`,
        language: "ts",
        file: "app/(kambaz)/account/client.ts",
        addedLines: [[1, 7]],
      },
      {
        code: `const [name, setName] = useState("");
const [editing, setEditing] = useState(false);
const saveUser = async () => {
  const [firstName, lastName] = name.split(" ");
  const updatedUser = { ...user, firstName, lastName };
  await client.updateUser(updatedUser);
  setUser(updatedUser);
  setEditing(false);
  onClose();
};
// pencil when !editing, check when editing
// name text when !editing; input when editing
// input onKeyDown: if Enter, saveUser()`,
        language: "tsx",
        file: "app/(kambaz)/courses/[cid]/people/Details.tsx",
        highlightLines: [[3, 10]],
      },
    ],
  },
  {
    id: "update-result",
    title: "Save writes the new name",
    kind: "demo",
    bullets: [
      "The input reads Antonio Stark",
      "The request is `PUT /api/users/123`",
      "The row says Antonio Stark. Email and role stayed",
    ],
    diagram: "users-update-result",
  },
  {
    id: "create-path",
    title: "POST /api/users",
    kind: "demo",
    bullets: ["`POST /api/users` returns the created user, and the table shows that document"],
    diagram: "users-create",
  },
  {
    id: "create-server",
    title: "Create in the DAO and route",
    kind: "demo",
    bullets: [
      "`uuidv4()` replaces a leftover `_id`",
      "An empty `_id` would collide on insert",
      "`POST` returns the created user for the table",
    ],
    codeBlocks: [
      {
        code: `const createUser = (user) => {
  const newUser = { ...user, _id: uuidv4() };
  return model.create(newUser);
};`,
        language: "ts",
        file: "webdev-server/Kambaz/Users/dao.ts",
        addedLines: [[1, 4]],
      },
      {
        code: `const createUser = async (req, res) => {
  const user = await dao.createUser(req.body);
  res.json(user);
};
app.post("/api/users", createUser);`,
        language: "ts",
        file: "webdev-server/Kambaz/Users/routes.ts",
        addedLines: [[1, 5]],
      },
    ],
  },
  {
    id: "create-ui",
    title: "+ User on the Users page",
    kind: "demo",
    bullets: [
      "`Date.now()` in the username keeps two clicks unique",
      "Append the user the server returned",
    ],
    codeBlocks: [
      {
        code: `export const createUser = async (user: any) => {
  const response = await axios.post(
    \`\${USERS_API}\`,
    user,
  );
  return response.data;
};`,
        language: "ts",
        file: "app/(kambaz)/account/client.ts",
        addedLines: [[1, 7]],
      },
      {
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
        language: "tsx",
        file: "app/(kambaz)/account/users/page.tsx",
        highlightLines: [[1, 12]],
      },
    ],
  },
  {
    id: "users-live",
    title: "+ User adds a document",
    kind: "demo",
    bullets: [
      "+ Users, Search people, and the role menu are on screen",
      "Click + Users. The new row is the document `POST` returned",
    ],
    embed: "lab6-users",
  },
];
