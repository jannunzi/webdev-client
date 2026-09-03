import Link from "next/link";

/**
 * Plain Chapter 1 Sign in — no auth, no router.push / redirect.
 * Live Kambaz Sign in navigates on submit; this stub is safe in book LiveDemos.
 */
export default function DemoSignin() {
  return (
    <div id="wd-signin-screen">
      <h3>Sign in</h3>
      <input
        placeholder="username"
        className="wd-username"
        defaultValue="ada"
      />{" "}
      <br />
      <input
        placeholder="password"
        type="password"
        className="wd-password"
        defaultValue="123"
      />{" "}
      <br />
      <Link href="/account/profile" id="wd-signin-btn">
        Sign in
      </Link>{" "}
      <br />
      <Link href="/account/signup" id="wd-signup-link">
        Sign up
      </Link>
    </div>
  );
}
