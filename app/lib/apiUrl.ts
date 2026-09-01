/**
 * Prefix a same-origin path with NEXT_PUBLIC_API_BASE when it is set.
 * Empty base → "/api/courses" (this Next.js app's Route Handlers).
 * "https://kambaz-api.onrender.com" → that host's matching path.
 */
export function apiUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") ?? "";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function apiBaseLabel(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") ?? "";
  return base || "same origin (Next.js Route Handlers)";
}
