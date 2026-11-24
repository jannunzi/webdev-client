import { COVER_MONGO } from "../cover-colors";
import type { LectureSlide } from "../types";

export const MONGO_APIS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: COVER_MONGO,
      icon: "server",
      headline: "Mongo APIs",
    },
    bullets: [
      "Chapter 6 · Mongo APIs",
      "Async routes, then find all",
    ],
  },
  {
    id: "users-picture",
    title: "Users from the Page to Mongo",
    kind: "demo",
    bullets: ["Page, client, routes, DAO, then the users collection"],
    diagram: "users-stack",
  },
  {
    id: "purpose",
    title: "Implementing MongoDB APIs",
    kind: "demo",
    bullets: [
      "DAO hides the vendor. Routes are the HTTP calls",
      "React still posts JSON to the same signin URL",
      "Each verb: DAO, Express route, and axios client",
    ],
    diagram: "users-read-all",
  },
  {
    id: "signin",
    title: "Signin awaits the database",
    kind: "demo",
    bullets: ["Tag the handler `async` and `await` the DAO call"],
    code: `const signin = async (req, res) => {
  const { username, password } = req.body;
  const currentUser = await dao.findUserByCredentials(
    username, password);
  if (currentUser) {
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  } else {
    res.status(401).json({
      message: "Unable to login. Try again later." });
  }
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/routes.ts",
    codeHighlightLines: [1, 3],
  },
  {
    id: "signup",
    title: "Signup awaits createUser",
    kind: "demo",
    bullets: ["Do the same for profile, signout, and course routes"],
    code: `const signup = async (req, res) => {
  const user = await dao.findUserByUsername(
    req.body.username);
  if (user) {
    res.status(400).json({
      message: "Username already taken" });
    return;
  }
  const currentUser = await dao.createUser(req.body);
  req.session["currentUser"] = currentUser;
  res.json(currentUser);
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/routes.ts",
    codeHighlightLines: [1, 2, 9],
  },
  {
    id: "find-all-dao",
    title: "find() with no predicate",
    kind: "demo",
    bullets: [
      "Same `findAllUsers` you returned from the DAO",
      "Empty `find()` returns every document in `users`",
    ],
    code: `const findAllUsers = () => model.find();
return {
  createUser, findAllUsers,
  findUserById, findUserByUsername,
  findUserByCredentials,
  updateUser, deleteUser,
};`,
    codeLanguage: "ts",
    codeFile: "webdev-server/Kambaz/Users/dao.ts",
    codeHighlightLines: [1, 3],
  },
  {
    id: "find-all-route",
    links: ["http://localhost:4000/api/users"],
    title: "GET /api/users returns JSON",
    kind: "demo",
    bullets: [
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
    title: "Client GETs with credentials",
    kind: "demo",
    bullets: [
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
    title: "PeopleTable takes a users prop",
    kind: "demo",
    bullets: [
      "Stop joining enrollments in the browser",
      "Users passes everyone. Course People passes a subset",
      "Full width, light border, striped odd rows",
    ],
    code: `export default function PeopleTable({
  users = [],
  fetchUsers,
}: {
  users?: any[];
  fetchUsers: () => void;
}) {`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/people/Table.tsx",
    codeHighlightLines: [[1, 3]],
  },
  {
    id: "people-table-part-2",
    title: "Each row is one user",
    kind: "demo",
    code: `  return (
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
    codeStartLine: 8,
    codeHighlightLines: [[5, 7]],
  },
  {
    id: "people-table-live",
    title: "People Table Live Demo",
    kind: "demo",
    bullets: [
      "The table renders the `users` array it was given",
      "Odd rows are striped. The first column is the name",
    ],
    embed: "kambaz-styled-people",
  },
  {
    id: "users-screen-intro",
    title: "Why a Users screen",
    kind: "demo",
    bullets: [
      "The route and PeopleTable are ready, but no page fetches every user from the database",
      "A Users screen loads all users when it opens and displays them with PeopleTable",
      "People Details creates, updates, and deletes, so that list has to refresh afterward",
    ],
  },
  {
    id: "users-screen",
    title: "Users fetches on mount (code)",
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
    title: "Users link is ADMIN only",
    kind: "demo",
    bullets: [
      "Only an `ADMIN` should open the Users screen. Faculty and students must not see the link",
      "Read `currentUser` from `useAccountContext()` and show the link only when `role` is `ADMIN`",
      "`nick_fury` is an ADMIN account in the sample users. Sign in as that user to test the link",
    ],
  },
  {
    id: "admin-link",
    title: "Users link is ADMIN only (code)",
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
    title: "Find-all recap",
    kind: "content",
    bullets: [
      "`async` / `await` on signin and signup — the session is still set",
      "`find()` with no predicate, then `GET /api/users` and `findAllUsers`",
      "ADMIN Account Nav → Users screen → PeopleTable",
    ],
  },
  {
    id: "next-up",
    title: "Next: CRUD Users",
    kind: "title",
    bullets: [
      "Filter by role, then by a partial name",
      "Open one user, then delete, update, and create",
    ],
  },
];
