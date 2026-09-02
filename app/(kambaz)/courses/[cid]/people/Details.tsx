"use client";

import { useEffect, useState } from "react";
import { FaCheck, FaUserCircle } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import * as client from "../../../account/client";

export default function PeopleDetails({
  uid,
  onClose,
}: {
  uid: string | null;
  onClose: () => void;
}) {
  const [user, setUser] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);

  const fetchUser = async () => {
    if (!uid) return;
    const next = await client.findUserById(uid);
    setUser(next ?? {});
    setName(`${next?.firstName ?? ""} ${next?.lastName ?? ""}`.trim());
  };

  useEffect(() => {
    if (uid) void fetchUser();
  }, [uid]);

  if (!uid) return null;

  const saveUser = async () => {
    const [firstName, ...rest] = name.split(" ");
    const lastName = rest.join(" ") || user.lastName;
    const updatedUser = { ...user, firstName, lastName, _id: uid };
    await client.updateUser(updatedUser);
    setUser(updatedUser);
    setEditing(false);
    onClose();
  };

  const removeUser = async () => {
    await client.deleteUser(uid);
    onClose();
  };

  return (
    <div className="wd-people-details fixed top-0 end-0 bottom-0 z-20 w-full max-w-sm bg-white p-4 shadow">
      <button
        type="button"
        onClick={onClose}
        className="wd-close-details absolute end-2 top-2"
      >
        <IoCloseSharp className="text-3xl" />
      </button>
      <div className="mt-2 text-center">
        <FaUserCircle className="me-2 text-4xl text-neutral-500" />
      </div>
      <hr />
      <div className="text-lg text-red-700">
        {!editing && (
          <FaPencil
            onClick={() => setEditing(true)}
            className="wd-edit float-end mt-2 cursor-pointer text-base"
          />
        )}
        {editing && (
          <FaCheck
            onClick={() => void saveUser()}
            className="wd-save float-end me-2 mt-2 cursor-pointer text-base"
          />
        )}
        {!editing && (
          <div className="wd-name" onClick={() => setEditing(true)}>
            {user.firstName} {user.lastName}
          </div>
        )}
        {editing && (
          <input
            className="wd-edit-name w-1/2 rounded border border-neutral-300 px-2 py-1"
            defaultValue={`${user.firstName ?? ""} ${user.lastName ?? ""}`}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void saveUser();
            }}
          />
        )}
      </div>
      <b>Roles:</b> <span className="wd-roles">{user.role}</span>
      <br />
      <b>Login ID:</b> <span className="wd-login-id">{user.loginId}</span>
      <br />
      <b>Section:</b> <span className="wd-section">{user.section}</span>
      <br />
      <b>Total Activity:</b>{" "}
      <span className="wd-total-activity">{user.totalActivity}</span>
      <hr />
      <button
        type="button"
        onClick={() => void removeUser()}
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
      </button>
    </div>
  );
}
