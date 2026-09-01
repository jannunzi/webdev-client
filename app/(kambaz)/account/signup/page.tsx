"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccountContext, type User } from "../AccountContext";
import * as client from "../client";

export default function Signup() {
  const [user, setUser] = useState({ username: "ada", password: "123" });
  const [error, setError] = useState("");
  const { setCurrentUser } = useAccountContext();
  const router = useRouter();

  const signup = async () => {
    try {
      const current = (await client.signup(user)) as User;
      setCurrentUser(current);
      router.push("/account/profile");
    } catch {
      setError("Username already taken");
    }
  };

  return (
    <div id="wd-signup-screen">
      <h3>Sign up</h3>
      {error ? <p className="text-red-700">{error}</p> : null}
      <input
        placeholder="username"
        className="wd-username mb-2 block rounded border border-neutral-300 px-3 py-1.5"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />
      <input
        placeholder="password"
        type="password"
        className="wd-password mb-2 block rounded border border-neutral-300 px-3 py-1.5"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <button
        type="button"
        className="mb-2 rounded bg-red-600 px-3 py-1.5 text-sm text-white"
        onClick={signup}
      >
        Sign up
      </button>
      <br />
      <Link href="/account/signin" className="wd-signin-link">
        Sign in
      </Link>
    </div>
  );
}
