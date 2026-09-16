import Link from "next/link";

/** Shown when publishable auth is unset so Sign in / Sign up stay reachable. */
export default function CourseAuthFallback() {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Link
        href="/sign-in"
        className="rounded border border-neutral-400 bg-white px-3 py-1.5 no-underline hover:bg-neutral-50"
      >
        Sign in
      </Link>
      <Link
        href="/sign-up"
        className="rounded border border-neutral-800 bg-neutral-800 px-3 py-1.5 text-white no-underline hover:bg-neutral-700"
      >
        Sign up
      </Link>
    </div>
  );
}
