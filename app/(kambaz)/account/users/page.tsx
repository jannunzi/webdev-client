"use client";

import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import PeopleTable from "../../courses/[cid]/people/Table";
import * as client from "../client";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  role: string;
  email: string;
  loginId?: string;
  section?: string;
  lastActivity?: string;
  totalActivity?: string;
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");

  const fetchUsers = async () => {
    setUsers((await client.findAllUsers()) as User[]);
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  const filterUsersByRole = async (next: string) => {
    setRole(next);
    if (next) setUsers((await client.findUsersByRole(next)) as User[]);
    else await fetchUsers();
  };

  const filterUsersByName = async (next: string) => {
    setName(next);
    if (next) setUsers((await client.findUsersByPartialName(next)) as User[]);
    else await fetchUsers();
  };

  const createUser = async () => {
    const user = (await client.createUser({
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

  return (
    <div id="wd-account-users">
      <button
        type="button"
        onClick={() => void createUser()}
        className="wd-add-people float-end rounded bg-red-600 px-3 py-1.5 text-sm text-white"
      >
        <FaPlus className="me-2 inline" />
        Users
      </button>
      <h3>Users</h3>
      <input
        className="wd-filter-by-name me-2 mb-2 w-1/4 rounded border border-neutral-300 px-2 py-1"
        placeholder="Search people"
        value={name}
        onChange={(e) => void filterUsersByName(e.target.value)}
      />
      <select
        value={role}
        onChange={(e) => void filterUsersByRole(e.target.value)}
        className="wd-select-role mb-2 w-1/4 rounded border border-neutral-300 px-2 py-1"
      >
        <option value="">All Roles</option>
        <option value="STUDENT">Students</option>
        <option value="TA">Assistants</option>
        <option value="FACULTY">Faculty</option>
        <option value="ADMIN">Administrators</option>
      </select>
      <PeopleTable users={users} fetchUsers={() => void fetchUsers()} />
    </div>
  );
}
