/**
 * Origin of the sibling Express server for Lab 5 + Kambaz HTTP calls.
 *
 * PDF name: NEXT_PUBLIC_HTTP_SERVER
 * Unset → http://localhost:4000 (run nodemon in kambaz-node-server-app
 * alongside next dev). A public host is optional and taught in 5.5.
 * Route Handler demos in 5.3 use same-origin `/api/...`.
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
