/**
 * Origin of the sibling Express server for Lab 5 + Kambaz HTTP calls.
 *
 * PDF name: NEXT_PUBLIC_HTTP_SERVER
 * Alias:    NEXT_PUBLIC_API_BASE
 *
 * Unset → http://localhost:4000 so Express LiveDemos hit the companion
 * (run `npm run server:dev` next to `npm run dev`). On Vercel set the
 * Render origin — same client code, different base. Route Handler demos
 * in 5.3 use same-origin `/api/...` and do not go through this helper.
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
