import { COVER_MONGO } from "../cover-colors";
import type { LectureSlide } from "../types";

function sectionSlide(id: string, headline: string): LectureSlide {
  return {
    id,
    title: "WEB DEV",
    kind: "title",
    cover: {
      color: COVER_MONGO,
      icon: "server",
      headline,
    },
    bullets: ["Chapter 6 · Mongo APIs", headline],
  };
}

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
    bullets: [
      "The Users page asks the account client for users.",
      "The client calls the Express routes, and each route calls the Users DAO.",
      "The DAO reads and writes the users collection.",
    ],
    diagram: "users-stack",
  },
  {
    id: "purpose",
    title: "Implementing MongoDB APIs",
    kind: "demo",
    bullets: [
      "The DAO is the only code that talks to MongoDB, so a route never imports Mongoose.",
      "The React page still sends JSON to the same sign-in URL.",
      "Each action needs a DAO function, an Express route, and an axios call in the client.",
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
    title: "Signup awaits `createUser`",
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
  sectionSlide("section-finding", "Finding Users"),
  {
    id: "find-all-dao",
    title: "Users DAO finds every user",
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
    diagram: "users-read-all",
    diagramFocus: "dao",
  },
  {
    id: "find-all-route",
    links: ["http://localhost:4000/api/users"],
    title: "Route returns users as JSON",
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
    diagram: "users-read-all",
    diagramFocus: "routes",
  },
  {
    id: "find-all-client",
    title: "Client GETs with credentials",
    kind: "demo",
    bullets: [
      "`USERS_API` already prefixes `NEXT_PUBLIC_HTTP_SERVER`",
      "Send credentials so the session cookie goes with the request. Without it the server answers 401",
    ],
    code: `export const findAllUsers = async () => {
  const response = await axiosWithCredentials.get(USERS_API);
  return response.data;
};`,
    codeLanguage: "ts",
    codeFile: "app/(kambaz)/account/client.ts",
    codeAddedLines: [[1, 4]],
    diagram: "users-read-all",
    diagramFocus: "client",
  },
  {
    id: "from-people-table",
    title: "Course PeopleTable reads users",
    kind: "demo",
    bullets: [
      "`cid` loads `users` from `useAccountContext`",
      "`enrollments.some` keeps that course. Delete it and the `db.users` read",
      "`people/Table.tsx` takes `users` and `fetchUsers`",
    ],
    code: `export default function PeopleTable({ cid }: { cid: string }) {
  const { users, createUser, updateUser, deleteUser } = useAccountContext();
  const { enrollments, enrollIntoCourse } = useEnrollmentsStore();
  const [user, setUser] = useState<User>(emptyUser);
  const enrolled = users.filter((usr) =>
    enrollments.some((enrollment) => enrollment.user === usr._id && enrollment.course === cid));
  const addUser = () => {
    const newUser = createUser(user);
    enrollIntoCourse(newUser._id, cid);
  };`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/people/table/PeopleTable.tsx",
    codeHighlightLines: [[5, 6]],
  },
  {
    id: "people-table",
    title: "PeopleTable takes a users prop",
    kind: "demo",
    bullets: [
      "`users` defaults to `[]` when the parent omits it",
      "`fetchUsers` reloads that array",
      "`PeopleDetails` is imported from `./Details`",
    ],
    code: `"use client";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import PeopleDetails from "./Details";

export default function PeopleTable({
  users = [],
  fetchUsers,
}: {
  users?: any[];
  fetchUsers: () => void;
}) {`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/people/Table.tsx",
    codeHighlightLines: [[4, 11]],
  },
  {
    id: "people-table-part-2",
    title: "People table head",
    kind: "demo",
    code: `  return (
    <div id="wd-people-table" className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-300">
            <th className="p-2">Name</th>
            <th className="p-2">Login ID</th>
            <th className="p-2">Section</th>
            <th className="p-2">Role</th>
            <th className="p-2">Last Activity</th>
            <th className="p-2">Total Activity</th>
          </tr>
        </thead>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/people/Table.tsx",
    codeStartLine: 13,
    codeHighlightLines: [[6, 11]],
  },
  {
    id: "people-table-part-3",
    title: "Name, login id, and section",
    kind: "demo",
    code: `        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="odd:bg-neutral-50">
              <td className="wd-full-name p-2 text-nowrap">
                <FaUserCircle className="me-2 inline text-3xl text-neutral-500" />
                <span className="wd-first-name">{user.firstName}</span>{" "}
                <span className="wd-last-name">{user.lastName}</span>
              </td>
              <td className="wd-login-id p-2">{user.loginId}</td>
              <td className="wd-section p-2">{user.section}</td>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/people/Table.tsx",
    codeStartLine: 26,
    codeHighlightLines: [[2, 10]],
  },
  {
    id: "people-table-part-4",
    title: "Role and activity cells",
    kind: "demo",
    code: `              <td className="wd-role p-2">{user.role}</td>
              <td className="wd-last-activity p-2">{user.lastActivity}</td>
              <td className="wd-total-activity p-2">{user.totalActivity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/people/Table.tsx",
    codeStartLine: 36,
    codeHighlightLines: [[1, 3]],
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
  sectionSlide("section-users-screen", "Users Screen"),
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
