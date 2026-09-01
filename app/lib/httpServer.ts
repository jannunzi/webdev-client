/**
 * Base URL of the sibling Express server (PDF: NEXT_PUBLIC_HTTP_SERVER).
 * Empty / unset → local companion at http://localhost:4000 so Lab 5
 * LiveDemos work. Production sets the Render origin on Vercel.
 * NEXT_PUBLIC_API_BASE is accepted as an alias.
 */
export function httpServer(): string {
  const raw =
    process.env.NEXT_PUBLIC_HTTP_SERVER ??
    process.env.NEXT_PUBLIC_API_BASE ??
    "http://localhost:4000";
  return raw.replace(/\/$/, "");
}

export function httpServerLabel(): string {
  return httpServer();
}
