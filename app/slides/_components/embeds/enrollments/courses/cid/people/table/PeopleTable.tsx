"use client";

import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useEnrollmentsStore } from "../../../../store/enrollmentsStore";
import {
  useAccountContext,
  type User,
} from "../../../../account/AccountContext";

const emptyUser: User = {
  _id: "0",
  username: "new_user",
  password: "",
  firstName: "New",
  lastName: "User",
  email: "",
  role: "STUDENT",
  loginId: "",
  section: "S101",
  lastActivity: "",
  totalActivity: "",
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
  };
  return (
    <div id="wd-people-table" className="overflow-x-auto">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input
          className="rounded border border-neutral-300 px-3 py-1.5"
          value={user.firstName}
          onChange={(e) => setUser({ ...user, firstName: e.target.value })}
          id="wd-user-first-name"
        />
        <input
          className="rounded border border-neutral-300 px-3 py-1.5"
          value={user.lastName}
          onChange={(e) => setUser({ ...user, lastName: e.target.value })}
          id="wd-user-last-name"
        />
        <button
          type="button"
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
          id="wd-add-user-click"
          onClick={addUser}
        >
          Add
        </button>
        <button
          type="button"
          className="rounded bg-yellow-400 px-3 py-1.5 text-sm font-medium"
          id="wd-update-user-click"
          onClick={() => updateUser(user)}
        >
          Update
        </button>
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
        </thead>
        <tbody>
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
                <button
                  type="button"
                  className="rounded bg-yellow-400 px-2 py-1 text-xs font-medium"
                  onClick={() => setUser(usr)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="ms-2 rounded bg-red-600 px-2 py-1 text-xs font-medium text-white"
                  onClick={() => deleteUser(usr._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
