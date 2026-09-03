"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAccountContext, type User } from "../AccountContext";
import * as client from "../client";

export default function Profile() {
  const [profile, setProfile] = useState<User | null>(null);
  const { currentUser, setCurrentUser } = useAccountContext();
  const router = useRouter();
  const pathname = usePathname() ?? "";

  useEffect(() => {
    if (!currentUser) {
      if (pathname.startsWith("/account")) {
        router.push("/account/signin");
      }
      return;
    }
    setProfile(currentUser);
  }, [currentUser, router, pathname]);

  const signout = async () => {
    try {
      await client.signout();
    } catch {
      /* local sign-out still proceeds */
    }
    setCurrentUser(null);
    router.push("/account/signin");
  };

  if (!profile) return null;

  return (
    <div id="wd-profile-screen">
      <h3>Profile</h3>
      <input
        value={profile.username}
        placeholder="username"
        className="wd-username mb-2 block rounded border border-neutral-300 px-3 py-1.5"
        id="wd-username"
        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
      />
      <input
        value={profile.password}
        placeholder="password"
        type="password"
        className="wd-password mb-2 block rounded border border-neutral-300 px-3 py-1.5"
        id="wd-password"
        onChange={(e) => setProfile({ ...profile, password: e.target.value })}
      />
      <input
        value={profile.firstName}
        placeholder="First Name"
        id="wd-firstname"
        className="mb-2 block rounded border border-neutral-300 px-3 py-1.5"
        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
      />
      <input
        value={profile.lastName}
        placeholder="Last Name"
        id="wd-lastname"
        className="mb-2 block rounded border border-neutral-300 px-3 py-1.5"
        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
      />
      <input
        value={profile.email}
        type="email"
        id="wd-email"
        className="mb-2 block rounded border border-neutral-300 px-3 py-1.5"
        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
      />
      <select
        value={profile.role}
        id="wd-role"
        className="mb-2 block rounded border border-neutral-300 px-3 py-1.5"
        onChange={(e) => setProfile({ ...profile, role: e.target.value })}
      >
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        <option value="FACULTY">Faculty</option>
        <option value="STUDENT">Student</option>
        <option value="TA">TA</option>
      </select>
      <button
        type="button"
        onClick={signout}
        id="wd-signout-btn"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Sign out
      </button>
    </div>
  );
}
