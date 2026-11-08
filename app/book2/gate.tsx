import Link from "next/link";

export default function Book2Gate({
  access,
}: {
  access: "not_configured" | "signed_out" | "forbidden";
}) {
  const title =
    access === "not_configured"
      ? "Sign-in is not configured"
      : access === "signed_out"
        ? "Sign in to open book2"
        : "Staff only";
  const body =
    access === "not_configured"
      ? "Clerk is not configured on this server, so book2 cannot check the staff allowlist. The public book at /book is unchanged."
      : access === "signed_out"
        ? "Sign in with the course account you already use on kambaz.dev. book2 uses that same login. It is not a Vercel preview login."
        : "book2 is only for staff on the course allowlist. The public book at /book is unchanged.";
  return (
    <main className="mx-auto max-w-xl px-6 py-16 font-sans">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-3 text-neutral-700">{body}</p>
      {access === "signed_out" ? (
        <p className="mt-4">
          <Link className="text-blue-700 underline" href="/sign-in?redirect_url=%2Fbook2">
            Sign in
          </Link>
        </p>
      ) : (
        <p className="mt-4">
          <Link className="text-blue-700 underline" href="/book">
            Back to the book
          </Link>
        </p>
      )}
    </main>
  );
}
