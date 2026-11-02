import type { LectureSlide } from "../types";

export const KAMBAZ_PEOPLE_TABLE_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · People Table CRUD",
      "People · add, edit, and delete users",
    ],
  },
  {
    id: "purpose",
    title: "Implementing the People Table CRUD",
    kind: "content",
    bullets: [
      "The People screen lists the users enrolled in a course",
      "This module lets instructors add, edit and delete those users",
      "Changes go through the account context, so every screen re-renders",
    ],
  },
  {
    id: "people-page-intro",
    title: "Planning the People Screen",
    kind: "content",
    bullets: [
      "The People screen reads the course id from the URL",
      "It passes that id to a table component that runs in the browser",
      "The next slide shows the People screen",
    ],
  },
  {
    id: "people-page",
    title: "People Page Component",
    kind: "content",
    code: `import PeopleTable from "./PeopleTable";

export default async function PeopleTablePage({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  return <PeopleTable cid={cid} />;
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/people/table/page.tsx",
  },
  {
    id: "people-table-intro",
    title: "Planning People Table CRUD",
    kind: "content",
    bullets: [
      "Goal: a form above the table with first and last name inputs",
      "Add creates a user and enrolls them in this course",
      "Each row gets Edit, which loads it into the form, and Delete",
      "The next three slides build the table in parts",
    ],
  },
  {
    id: "people-table",
    title: "Enrolled Users and CRUD Handlers",
    kind: "content",
    code: `"use client";

import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useEnrollmentsStore } from "../../../../store/enrollmentsStore";
import {
  useAccountContext,
  type User,
} from "../../../../account/AccountContext";

const emptyUser: User = {
  _id: "0", username: "new_user", password: "", firstName: "New", lastName: "User",
  email: "", role: "STUDENT", loginId: "", section: "S101", lastActivity: "", totalActivity: "",
};

export default function PeopleTable({ cid }: { cid: string }) {
  const { users, createUser, updateUser, deleteUser } = useAccountContext();
  const { enrollments, enrollIntoCourse } = useEnrollmentsStore();
  const [user, setUser] = useState<User>(emptyUser);
  const enrolled = users.filter((usr) =>
    enrollments.some(
      (enrollment) => enrollment.user === usr._id && enrollment.course === cid,
    ),
  );
  const addUser = () => {
    const newUser = createUser(user);
    enrollIntoCourse(newUser._id, cid);
  };`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/people/table/PeopleTable.tsx",
  },
  {
    id: "people-table-part-2",
    title: "Name Inputs and Add/Update Buttons",
    kind: "content",
    code: `  return (
    <div id="wd-people-table" className="overflow-x-auto">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input value={user.firstName} id="wd-user-first-name" className="rounded border border-neutral-300 px-3 py-1.5"
          onChange={(e) => setUser({ ...user, firstName: e.target.value })} />
        <input value={user.lastName} id="wd-user-last-name" className="rounded border border-neutral-300 px-3 py-1.5"
          onChange={(e) => setUser({ ...user, lastName: e.target.value })} />
        <button id="wd-add-user-click" type="button" className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
          onClick={addUser} >                Add    </button>
        <button id="wd-update-user-click" type="button" className="rounded bg-yellow-400 px-3 py-1.5 text-sm font-medium"
          onClick={() => updateUser(user)} > Update </button>
      </div>
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-300">
            <th className="p-2">Name</th>
            <th className="p-2">Login ID</th>
            <th className="p-2">Section</th>
            <th className="p-2">Role</th>
            <th className="p-2">Last Activity</th>
            <th className="p-2">Total Activity</th>
            <th className="p-2"></th>
          </tr>
        </thead>`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/people/table/PeopleTable.tsx",
    codeStartLine: 38,
  },
  {
    id: "people-table-part-3",
    title: "Table Row per Enrolled User",
    kind: "content",
    code: `        <tbody>
          {enrolled.map((usr) => (
            <tr key={usr._id} className="odd:bg-neutral-50">
              <td className="wd-full-name p-2 text-nowrap">
                <FaUserCircle className="me-2 inline align-middle text-3xl text-neutral-500" />
                <span className="wd-first-name">{usr.firstName}</span>{" "}
                <span className="wd-last-name">{usr.lastName}</span>
              </td>
              <td className="wd-login-id p-2">{usr.loginId}</td>
              <td className="wd-section p-2">{usr.section}</td>
              <td className="wd-role p-2">{usr.role}</td>
              <td className="wd-last-activity p-2">{usr.lastActivity}</td>
              <td className="wd-total-activity p-2">{usr.totalActivity}</td>
              <td className="p-2 text-nowrap">
                <button type="button" className="rounded bg-yellow-400 px-2 py-1 text-xs font-medium"
                  onClick={() => setUser(usr)} >        Edit   </button>
                <button type="button" className="ms-2 rounded bg-red-600 px-2 py-1 text-xs font-medium text-white"
                  onClick={() => deleteUser(usr._id)} > Delete </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/(kambaz)/courses/[cid]/people/table/PeopleTable.tsx",
    codeStartLine: 82,
  },
  {
    id: "people-table-live",
    title: "People CRUD Demo",
    kind: "demo",
    bullets: [
      "Type a name and **Add**: the new user joins this course's table",
      "**Edit** loads a row; change it and **Update**",
      "**Delete** removes the user everywhere",
    ],
    embed: "kambaz-people-crud",
  },
  {
    id: "recap",
    title: "Account and Chapter 4 Recap",
    kind: "content",
    bullets: [
      "Context = current user. Zustand = courses and modules",
      "`useState` still owns drafts, dialogs, and one-screen flags",
      "Add, Edit, and Delete now change every screen that reads the store",
    ],
  },
];
