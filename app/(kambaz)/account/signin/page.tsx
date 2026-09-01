"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccountContext, type User } from "../AccountContext";
import * as client from "../client";

export default function Signin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { setCurrentUser } = useAccountContext();
  const router = useRouter();

  const signin = async () => {
    try {
      const user = (await client.signin(credentials)) as User;
      setCurrentUser(user);
      setError("");
      router.push("/dashboard");
    } catch {
      setError("Unable to login. Try again later.");
    }
  };

  return (
    <div id="wd-signin-screen">
      <h3>Sign in</h3>
      {error ? <p className="text-red-700">{error}</p> : null}
      <input
        placeholder="username"
        className="wd-username mb-2 block rounded border border-neutral-300 px-3 py-1.5"
        value={credentials.username}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
        id="wd-username"
      />
      <input
        placeholder="password"
        type="password"
        className="wd-password mb-2 block rounded border border-neutral-300 px-3 py-1.5"
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
        id="wd-password"
      />
      <button
        type="button"
        onClick={signin}
        id="wd-signin-btn"
        className="mb-2 rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Sign in
      </button>
      <br />
      <Link href="/account/signup" id="wd-signup-link">
        Sign up
      </Link>
    </div>
  );
}
