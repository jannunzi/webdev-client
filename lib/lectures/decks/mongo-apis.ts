import type { LectureSlide } from "../types";

export const MONGO_APIS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: "#47A248",
      icon: "server",
      headline: "Database-Backed User APIs",
    },
    bullets: [
      "Chapter 6 · Mongo APIs",
      "Async routes, then find all",
    ],
  },
  {
    id: "purpose",
    title: "Serving Database Data over HTTP",
    kind: "content",
    bullets: [
      "The DAO now reads MongoDB, but the routes still expect instant answers",
      "Database calls take time, so each route must wait for its reply",
      "React still posts to `/api/users/signin` and receives JSON",
      "This deck updates the account routes, then lists every user for admins",
    ],
  },
  {
    id: "async",
    title: "Awaiting Database Calls in Routes",
    kind: "demo",
    bullets: [
      "In `Kambaz/Users/routes.ts`, make the handlers `async` as shown below",
      "Chapter 5 arrays answered at once. MongoDB answers later, so `await` every DAO call",
      "Do the same for profile, signout, and course routes",
    ],
    code: `const signin = async (req, res) => {
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
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/routes.ts",
    codeHighlightLines: [1, 3, 13, 18],
    embed: "kambaz-styled-signin",
  },
  {
    id: "find-all-dao",
    title: "Finding Every Document",
    kind: "demo",
    bullets: [
      "In `Kambaz/Users/dao.ts`, confirm `findAllUsers` as shown below",
      "Empty `find()` returns every document in `users`",
    ],
    code: `const findAllUsers = () => model.find();`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/dao.ts",
  },
  {
    id: "find-all-route",
    links: ["http://localhost:4000/api/users"],
    title: "Listing Users with GET /api/users",
    kind: "demo",
    bullets: [
      "In `routes.ts`, add the route as shown below",
      "Open `http://localhost:4000/api/users` in the browser",
      "Length should match Compass `kambaz.users`. Empty? Re-import JSON",
    ],
    code: `const findAllUsers = async (req, res) => {
  const users = await dao.findAllUsers();
  res.json(users);
};
app.get("/api/users", findAllUsers);`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/routes.ts",
    codeAddedLines: [[1, 5]],
  },
  {
    id: "find-all-client",
    title: "Fetching All Users from the Client",
    kind: "demo",
    bullets: [
      "In `account/client.ts`, add `findAllUsers` as shown below",
      "`USERS_API` already prefixes `NEXT_PUBLIC_HTTP_SERVER`",
      "Credentials so a later admin-only check can read the session cookie",
    ],
    code: `export const findAllUsers = async () => {
  const response = await axiosWithCredentials.get(USERS_API);
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/account/client.ts",
    codeAddedLines: [[1, 4]],
  },
  {
    id: "people-table",
    title: "Passing Users into a Table",
    kind: "demo",
    bullets: [
      "In `people/Table.tsx`, add a `users` prop as shown below",
      "The server picks the users now: all of them here, a course's later",
      "A full-width collapsed table with a light border and striped odd rows",
    ],
    code: `export default function PeopleTable({
  users = [],
  fetchUsers,
}: {
  users?: any[];
  fetchUsers: () => void;
}) {
  return (
    <div id="wd-people-table" className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="odd:bg-neutral-50">
              <td className="wd-full-name p-2">{user.firstName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/people/Table.tsx",
    codeHighlightLines: [[1, 3], [12, 14]],
    embed: "kambaz-styled-people",
  },
  {
    id: "users-screen-intro",
    title: "Loading Users When the Page Opens",
    kind: "demo",
    bullets: [
      "In a new `account/users/page.tsx` page, create the Users screen as shown below",
      "Client Component: `useState` holds the list, `useEffect` fetches it once",
      "`fetchUsers` is passed into the table so Details can refresh",
    ],
  },
  {
    id: "users-screen",
    title: "Fetching Users into State",
    kind: "demo",
    code: `"use client";
import { useState, useEffect } from "react";
import PeopleTable from "../../courses/[cid]/people/Table";
import * as client from "../client";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const fetchUsers = async () => {
    const users = await client.findAllUsers();
    setUsers(users);
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <div>
      <h3>Users</h3>
      <PeopleTable users={users} fetchUsers={fetchUsers} />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/users/page.tsx",
    codeAddedLines: [[8, 14]],
  },
  {
    id: "admin-link-intro",
    title: "Showing Links by User Role",
    kind: "demo",
    bullets: [
      "In `account/Navigation.tsx`, add the Users link as shown below",
      "Read `currentUser` from `useAccountContext()` and check its `role`",
      "Seed `nick_fury` / `fury123` is an administrator",
      "Faculty and student sessions must not show the link",
    ],
  },
  {
    id: "admin-link",
    title: "Hiding Admin Links from Other Users",
    kind: "demo",
    code: `{currentUser && currentUser.role === "ADMIN" && (
  <Link
    href="/account/users"
    className={
      pathname.endsWith("users")
        ? "font-semibold text-black"
        : "text-red-600"
    }
  >
    Users
  </Link>
)}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/account/Navigation.tsx",
    codeAddedLines: [[1, 12]],
  },
  {
    id: "recap",
    title: "User APIs recap",
    kind: "content",
    bullets: [
      "`async` / `await` on every DAO call — Sign in still sets the session",
      "`GET /api/users` plus `findAllUsers` on the client",
      "ADMIN Account Nav → Users → PeopleTable",
    ],
  },
  {
    id: "next-up",
    title: "Next: User CRUD with MongoDB",
    kind: "title",
    bullets: [
      "Predicates, find by id, then delete, update, and create",
      "`?role=` and People Details",
    ],
  },
];
