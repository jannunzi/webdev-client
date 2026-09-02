"use client";

import { useEffect, useState } from "react";
import {
  createUser,
  deleteUser,
  findAllUsers,
  findUserById,
  findUsersByPartialName,
  findUsersByRole,
  updateUser,
} from "../client";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  role: string;
  email: string;
  loginId?: string;
  section?: string;
  totalActivity?: string;
};

export default function Lab6Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");

  const fetchUsers = async () => {
    setUsers((await findAllUsers()) as User[]);
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  const filterUsersByRole = async (next: string) => {
    setRole(next);
    if (next) setUsers((await findUsersByRole(next)) as User[]);
    else await fetchUsers();
  };

  const filterUsersByName = async (next: string) => {
    setName(next);
    if (next) setUsers((await findUsersByPartialName(next)) as User[]);
    else await fetchUsers();
  };

  const onCreate = async () => {
    const user = (await createUser({
      firstName: "New",
      lastName: `User ${users.length + 1}`,
      username: `newuser${Date.now()}`,
      password: "password123",
      email: `email${users.length + 1}@neu.edu`,
      section: "S101",
      role: "STUDENT",
    })) as User;
    setUsers([...users, user]);
  };

  const saveUser = async () => {
    if (!selected) return;
    const [firstName, ...rest] = editName.split(" ");
    const lastName = rest.join(" ") || selected.lastName;
    const updated = { ...selected, firstName, lastName };
    await updateUser(updated);
    setSelected(updated);
    setEditing(false);
    await fetchUsers();
  };

  return (
    <div id="wd-lab6-users">
      <h3>Users</h3>
      <div className="mb-2 flex flex-wrap gap-2">
        <button
          type="button"
          id="wd-add-people"
          className="rounded bg-red-600 px-3 py-1.5 text-sm text-white"
          onClick={onCreate}
        >
          + Users
        </button>
        <input
          className="wd-filter-by-name rounded border border-neutral-300 px-2 py-1"
          placeholder="Search people"
          value={name}
          onChange={(e) => void filterUsersByName(e.target.value)}
        />
        <select
          className="wd-select-role rounded border border-neutral-300 px-2 py-1"
          value={role}
          onChange={(e) => void filterUsersByRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="TA">Assistants</option>
          <option value="FACULTY">Faculty</option>
          <option value="ADMIN">Administrators</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-300">
              <th className="p-2">Name</th>
              <th className="p-2">Role</th>
              <th className="p-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="odd:bg-neutral-50">
                <td className="wd-full-name p-2">
                  <button
                    type="button"
                    className="text-blue-700 underline"
                    onClick={async () => {
                      const one = (await findUserById(user._id)) as User;
                      setSelected(one);
                      setEditName(`${one.firstName} ${one.lastName}`);
                      setEditing(false);
                    }}
                  >
                    <span className="wd-first-name">{user.firstName}</span>{" "}
                    <span className="wd-last-name">{user.lastName}</span>
                  </button>
                </td>
                <td className="wd-role p-2">{user.role}</td>
                <td className="p-2">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected ? (
        <div className="wd-people-details mt-3 rounded border border-neutral-300 p-3">
          <div className="text-danger wd-name text-lg text-red-700">
            {editing ? (
              <input
                className="wd-edit-name w-full max-w-xs rounded border border-neutral-300 px-2 py-1"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void saveUser();
                }}
              />
            ) : (
              <span>
                {selected.firstName} {selected.lastName}
              </span>
            )}
          </div>
          <p>
            <b>Roles:</b> <span className="wd-roles">{selected.role}</span>
          </p>
          <p>
            <b>Login ID:</b>{" "}
            <span className="wd-login-id">{selected.loginId}</span>
          </p>
          <div className="mt-2 flex gap-2">
            {editing ? (
              <button
                type="button"
                className="wd-save rounded bg-green-600 px-3 py-1 text-sm text-white"
                onClick={() => void saveUser()}
              >
                Save
              </button>
            ) : (
              <button
                type="button"
                className="wd-edit rounded bg-yellow-400 px-3 py-1 text-sm"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
            )}
            <button
              type="button"
              className="wd-delete rounded bg-red-600 px-3 py-1 text-sm text-white"
              onClick={async () => {
                await deleteUser(selected._id);
                setSelected(null);
                await fetchUsers();
              }}
            >
              Delete
            </button>
            <button
              type="button"
              className="wd-cancel rounded bg-neutral-200 px-3 py-1 text-sm"
              onClick={() => setSelected(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
      <hr />
    </div>
  );
}
