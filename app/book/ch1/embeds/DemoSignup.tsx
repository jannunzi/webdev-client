import Link from "next/link";

/**
 * Plain Chapter 1 Sign up — no auth, no router.push / redirect.
 * Live Kambaz Sign up navigates on submit; this stub is safe in book LiveDemos.
 */
export default function DemoSignup() {
  return (
    <div id="wd-signup-screen">
      <h3>Sign up</h3>
      <input
        placeholder="username"
        className="wd-username"
        defaultValue="ada"
      />
      <br />
      <input
        placeholder="password"
        type="password"
        className="wd-password"
        defaultValue="123"
      />
      <br />
      <input
        placeholder="verify password"
        type="password"
        className="wd-password-verify"
      />
      <br />
      <Link href="/account/profile">Sign up</Link>
      <br />
      <Link href="/account/signin">Sign in</Link>
    </div>
  );
}
