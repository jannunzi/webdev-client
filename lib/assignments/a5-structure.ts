/**
 * A5 checks (Chapter 5: HTTP servers and RESTful Web APIs).
 *
 * Two sources:
 *   1. the Lab pages on the Vercel deploy (structure only, as A3/A4);
 *   2. the student's own Node server, found from the absolute links on
 *      /labs/lab5 (the book builds them from NEXT_PUBLIC_HTTP_SERVER). The
 *      checker opens only GET routes that don't change server state, with
 *      its own numbers, and compares answers (12 + 30 = 42), never text.
 *
 * Server pages: a 404 fails; a timeout, 5xx, or login wall is a re-check
 * with points kept (Render free instances sleep and can take a minute to
 * wake). Messages never name an id.
 */
import type { StructureContext, StructureFallback, StructureTarget } from "./a1-structure";
import type { AutoJudgeContext, AutoVerdict, FetchTextResult } from "./checker-types";
import { isBoilerplatePage, a3GithubLinkStructurePassed, a3IdHasContent } from "./a3-structure";
import { headings, links, rendered, samePath, textOf } from "./structure-dom";

export { a3GithubLinkStructurePassed as a5GithubLinkStructurePassed, a3IdHasContent as a5IdHasContent };

/* ------------------------------------------------------------------ */
/* Delivery                                                            */
/* ------------------------------------------------------------------ */

export const A5_LAB_PATHS = ["/labs/lab1", "/labs/lab2", "/labs/lab3", "/labs/lab4", "/labs/lab5"] as const;

export function a5LabsNavStructurePassed(labsHtml: string, siteHost?: string): boolean {
  const paths = links(rendered(labsHtml), siteHost)
    .map((link) => link.path)
    .filter((path): path is string => Boolean(path));
  const labs = A5_LAB_PATHS.every((lab) => paths.some((path) => samePath(path, lab)));
  const kambaz = paths.some((path) => !/^\/labs(\/|$)/i.test(path));
  return labs && kambaz;
}

function githubRepos(html: string): Set<string> {
  const out = new Set<string>();
  for (const link of links(rendered(html))) {
    try {
      const url = new URL(link.href);
      if (url.hostname.toLowerCase().replace(/^www\./, "") !== "github.com") continue;
      const [owner, repo] = url.pathname.split("/").filter(Boolean);
      if (owner && repo && owner.toLowerCase() !== "jannunzi") out.add(`${owner}/${repo}`.toLowerCase().replace(/\.git$/, ""));
    } catch {
      /* not a URL */
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Lab 5 page                                                          */
/* ------------------------------------------------------------------ */

export const A5_MIN_LAB_HEADINGS = 15;

export function lab5HasSections(html: string): boolean {
  return !isBoilerplatePage(html) && headings(rendered(html)).length >= A5_MIN_LAB_HEADINGS;
}

const LOCAL_HOST = /^(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)$/i;

/** Origins of absolute links to /lab5/… routes, most used first. */
export function serverOrigins(lab5Html: string, siteHost?: string): { remote: string[]; local: boolean } {
  const counts = new Map<string, number>();
  let local = false;
  for (const link of links(rendered(lab5Html))) {
    let url: URL;
    try {
      url = new URL(link.href);
    } catch {
      continue;
    }
    if (!/^\/lab5(\/|$)/i.test(url.pathname)) continue;
    if (LOCAL_HOST.test(url.hostname)) {
      local = true;
      continue;
    }
    if (siteHost && url.hostname.toLowerCase() === siteHost.toLowerCase()) continue;
    if (url.protocol !== "https:") continue;
    counts.set(url.origin, (counts.get(url.origin) ?? 0) + 1);
  }
  return { remote: [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([origin]) => origin), local };
}

/* ------------------------------------------------------------------ */
/* server answers                                                      */
/* ------------------------------------------------------------------ */

/** A route's answer as a number: plain text "42", JSON 42, "42", or { result: 42 }. */
export function answerNumber(text: string): number | null {
  const body = textOf(text).trim();
  const direct = Number(body.replace(/^"|"$/g, ""));
  if (body !== "" && Number.isFinite(direct)) return direct;
  try {
    const value = JSON.parse(body);
    if (typeof value === "number") return value;
    if (value && typeof value === "object") {
      for (const key of ["result", "answer", "sum", "difference", "product", "quotient", "value"]) {
        const n = Number((value as Record<string, unknown>)[key]);
        if (Number.isFinite(n) && (value as Record<string, unknown>)[key] !== null) return n;
      }
    }
  } catch {
    /* not JSON */
  }
  return null;
}

export function parseJson(text: string): unknown {
  try {
    return JSON.parse(text.trim());
  } catch {
    // Some servers send JSON with an HTML wrapper from the probe; strip tags once.
    try {
      return JSON.parse(textOf(text).trim());
    } catch {
      return undefined;
    }
  }
}

const near = (a: number | null, b: number) => a !== null && Math.abs(a - b) < 1e-6;

type Probe = { url: string; ok: (text: string) => boolean };

/** Runs probes in order; folds missing / unreachable like the page checks. */
async function runProbes(fetch: (url: string) => Promise<FetchTextResult>, probes: Probe[]): Promise<"pass" | "fail" | "missing" | "unreachable"> {
  let unreachable = false;
  for (const probe of probes) {
    const result = await fetch(probe.url);
    if (!result.ok) {
      if (result.missing) return "missing";
      unreachable = true;
      continue;
    }
    if (!probe.ok(result.text)) return "fail";
  }
  return unreachable ? "unreachable" : "pass";
}

const isObject = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);

function sameScalar(text: string, expected: unknown): boolean {
  const value = parseJson(text);
  const got = typeof value === "string" || typeof value === "number" ? String(value) : textOf(text).trim();
  return got.trim() !== "" && got.trim() === String(expected).trim();
}

type ServerItem = {
  id: string;
  /** Probes built from the server origin (and earlier answers, read lazily). */
  run: (server: string, fetch: (url: string) => Promise<FetchTextResult>) => Promise<"pass" | "fail" | "missing" | "unreachable">;
  pass: string;
  miss: string;
};

const calc = (server: string, path: string, expected: number): Probe => ({ url: `${server}${path}`, ok: (text) => near(answerNumber(text), expected) });

export const A5_SERVER_ITEMS: ServerItem[] = [
  {
    id: "a5-lab-path",
    run: (s, f) => runProbes(f, [calc(s, "/lab5/add/12/30", 42), calc(s, "/lab5/subtract/12/30", -18)]),
    pass: "Your server added and subtracted path parameters (12 + 30 = 42, 12 − 30 = −18).",
    miss: "Your server should answer /lab5/add/:a/:b and /lab5/subtract/:a/:b with the sum and the difference (we tried 12 and 30).",
  },
  {
    id: "a5-lab-path-oyo",
    run: (s, f) => runProbes(f, [calc(s, "/lab5/multiply/12/30", 360), calc(s, "/lab5/divide/36/12", 3)]),
    pass: "Your server multiplied and divided path parameters.",
    miss: "Your server should also answer /lab5/multiply/:a/:b and /lab5/divide/:a/:b (we tried 12 × 30 and 36 ÷ 12).",
  },
  {
    id: "a5-lab-query",
    run: (s, f) =>
      runProbes(f, [calc(s, "/lab5/calculator?operation=add&a=12&b=30", 42), calc(s, "/lab5/calculator?operation=subtract&a=12&b=30", -18)]),
    pass: "Your server's /lab5/calculator added and subtracted query parameters.",
    miss: "Your server should answer /lab5/calculator?operation=add&a=12&b=30 with 42 and operation=subtract with −18.",
  },
  {
    id: "a5-lab-query-oyo",
    run: (s, f) =>
      runProbes(f, [calc(s, "/lab5/calculator?operation=multiply&a=12&b=30", 360), calc(s, "/lab5/calculator?operation=divide&a=36&b=12", 3)]),
    pass: "Your server's /lab5/calculator multiplied and divided.",
    miss: "/lab5/calculator should also handle operation=multiply and operation=divide (we tried 12 × 30 and 36 ÷ 12).",
  },
  {
    id: "a5-lab-object",
    run: async (s, f) => {
      const object = await f(`${s}/lab5/assignment`);
      if (!object.ok) return object.missing ? "missing" : "unreachable";
      const value = parseJson(object.text);
      if (!isObject(value) || typeof value.title !== "string") return "fail";
      return runProbes(f, [{ url: `${s}/lab5/assignment/title`, ok: (text) => sameScalar(text, value.title) }]);
    },
    pass: "Your server returned the assignment object and its title.",
    miss: "Your server should return the assignment object (JSON with a title) at /lab5/assignment and the same title at /lab5/assignment/title.",
  },
  {
    id: "a5-lab-module-oyo",
    run: async (s, f) => {
      const object = await f(`${s}/lab5/module`);
      if (!object.ok) return object.missing ? "missing" : "unreachable";
      const value = parseJson(object.text);
      if (!isObject(value) || typeof value.name !== "string") return "fail";
      return runProbes(f, [{ url: `${s}/lab5/module/name`, ok: (text) => sameScalar(text, value.name) }]);
    },
    pass: "Your server returned the module object and its name.",
    miss: "Your server should return a module object (JSON with a name) at /lab5/module and the same name at /lab5/module/name.",
  },
  {
    id: "a5-lab-todos",
    run: async (s, f) => {
      const list = await f(`${s}/lab5/todos`);
      if (!list.ok) return list.missing ? "missing" : "unreachable";
      const todos = parseJson(list.text);
      if (!Array.isArray(todos) || todos.length < 2 || !todos.every(isObject)) return "fail";
      const first = todos.find((todo) => todo.id !== undefined || todo._id !== undefined) as Record<string, unknown> | undefined;
      if (!first) return "fail";
      const id = String(first.id ?? first._id);
      return runProbes(f, [
        {
          url: `${s}/lab5/todos/${encodeURIComponent(id)}`,
          ok: (text) => {
            const one = parseJson(text);
            return isObject(one) && String(one.id ?? one._id) === id;
          },
        },
        {
          url: `${s}/lab5/todos?completed=true`,
          ok: (text) => {
            const done = parseJson(text);
            const expected = todos.filter((todo) => todo.completed === true || todo.completed === "true").length;
            return Array.isArray(done) && done.length === expected && done.every((todo) => isObject(todo) && (todo.completed === true || todo.completed === "true"));
          },
        },
      ]);
    },
    pass: "Your server returned the todos array, a single todo, and the completed todos.",
    miss: "Your server should return the todos array at /lab5/todos, one todo at /lab5/todos/:id, and only the completed ones at /lab5/todos?completed=true.",
  },
  {
    id: "a5-kambaz-courses-api",
    run: (s, f) =>
      runProbes(f, [
        {
          url: `${s}/api/courses`,
          ok: (text) => {
            const courses = parseJson(text);
            return Array.isArray(courses) && courses.length >= 3 && courses.every((c) => isObject(c) && c._id !== undefined && typeof c.name === "string");
          },
        },
      ]),
    pass: "Your server returned at least 3 courses at /api/courses.",
    miss: "Your server should return the courses array at /api/courses (at least 3 courses, each with an _id and a name).",
  },
  {
    id: "a5-kambaz-modules-api",
    run: async (s, f) => {
      // Course ids from /api/courses; the book's seed ids when that route is missing,
      // so a broken Courses API doesn't also cost the Modules item.
      const list = await f(`${s}/api/courses`);
      const courses = list.ok ? parseJson(list.text) : undefined;
      const listed = Array.isArray(courses) ? courses.filter(isObject).map((c) => String(c._id)).filter((id) => id && id !== "undefined") : [];
      const ids = listed.length >= 2 ? listed : ["RS101", "RS102", "RS103"];
      const lists: string[] = [];
      let unreachable = false;
      for (const id of ids.slice(0, 4)) {
        const result = await f(`${s}/api/courses/${encodeURIComponent(id)}/modules`);
        if (!result.ok) {
          if (result.missing) return "missing";
          unreachable = true;
          continue;
        }
        const modules = parseJson(result.text);
        if (!Array.isArray(modules)) return "fail";
        // Each module that names its course must name this one.
        if (modules.some((m) => isObject(m) && m.course !== undefined && String(m.course) !== id)) return "fail";
        if (modules.length > 0) lists.push(JSON.stringify(modules.map((m) => (isObject(m) ? m._id ?? m.name : m)).sort()));
        if (new Set(lists).size >= 2) return "pass";
      }
      return unreachable ? "unreachable" : "fail";
    },
    pass: "Your server returned each course's own modules at /api/courses/:courseId/modules.",
    miss: "/api/courses/:courseId/modules should return only that course's modules, so two courses return different lists.",
  },
  {
    id: "a5-lab-server-url",
    run: (s, f) => runProbes(f, [{ url: `${s}/lab5/welcome`, ok: (text) => textOf(text).trim().length > 0 }]),
    pass: "The Lab 5 links point at your deployed server, and /lab5/welcome answered.",
    miss: "Your server's /lab5/welcome route should answer (the Lab 5 Welcome link opens it).",
  },
];

const RECHECK =
  "We couldn't reach your Node server (it may have been asleep or slow to start). Points are kept for now; the check will be re-run.";

/** Async verdicts for the server items and the Next.js Route Handlers. */
export async function judgeA5(ctx: AutoJudgeContext): Promise<Record<string, AutoVerdict>> {
  const out: Record<string, AutoVerdict> = {};
  const lab5 = ctx.structure.pages.find((page) => samePath(page.path, "/labs/lab5"));
  const tried = ctx.attempted.filter((page) => samePath(page.path, "/labs/lab5"));

  // Next.js Route Handlers live on the deploy itself.
  const hello = await ctx.fetchText("/api/lab5/hello");
  const sum = await ctx.fetchText("/api/lab5/calculator?a=12&b=30&operation=add");
  const helloOk = hello.ok && hello.text.trim().length > 0 && parseJson(hello.text) !== undefined;
  const sumOk = sum.ok && near(answerNumber(sum.text), 42);
  if (helloOk && sumOk) out["a5-lab-next-routes"] = { kind: "pass", message: "Your deployment answered /api/lab5/hello and /api/lab5/calculator (12 + 30 = 42)." };
  else if ((!hello.ok && !hello.missing) || (!sum.ok && !sum.missing)) out["a5-lab-next-routes"] = { kind: "unreachable", message: "We couldn't open your /api/lab5 routes on Vercel. Points are kept for now; the check will be re-run." };
  else out["a5-lab-next-routes"] = { kind: "fail", message: "Your Vercel deployment should answer /api/lab5/hello with JSON and /api/lab5/calculator?a=12&b=30&operation=add with 42 as its result." };

  const serverIds = A5_SERVER_ITEMS.map((item) => item.id);
  if (!lab5) {
    // Lab 5 itself is missing or couldn't be opened: the page check decides; server items follow it.
    const missing = tried.length > 0 && tried.every((page) => !page.ok && (page.status ?? 0) >= 400 && (page.status ?? 0) < 500 && ![401, 403, 408, 425, 429].includes(page.status ?? 0));
    for (const id of serverIds) {
      out[id] = missing
        ? { kind: "fail", message: "/labs/lab5 wasn't found on your deploy, so we couldn't find your Node server from its links." }
        : { kind: "unreachable", message: "We couldn't open /labs/lab5 on your deploy. Points are kept for now; the check will be re-run." };
    }
    return out;
  }
  const origins = serverOrigins(lab5.html, ctx.structure.siteHost);
  const server = origins.remote[0];
  if (!server) {
    const message = origins.local
      ? "The Lab 5 links on your Vercel deployment point at localhost. Set NEXT_PUBLIC_HTTP_SERVER on Vercel to your Render (or Heroku) URL and redeploy (§5.5.3)."
      : "We couldn't find links to your Node server on /labs/lab5 (absolute https links to /lab5/… routes built from NEXT_PUBLIC_HTTP_SERVER).";
    for (const id of serverIds) out[id] = { kind: "fail", message };
    return out;
  }
  const fetch = ctx.fetchRemote ?? (async () => ({ ok: false as const, missing: false }));
  // Wake the server once before the graded probes (Render free instances sleep).
  await fetch(`${server}/`);
  for (const item of A5_SERVER_ITEMS) {
    const state = await item.run(server, fetch);
    out[item.id] =
      state === "pass"
        ? { kind: "pass", message: item.pass }
        : state === "unreachable"
          ? { kind: "unreachable", message: RECHECK }
          : { kind: "fail", message: state === "missing" ? `${item.miss} (Your server returned HTTP 404.)` : item.miss };
  }
  return out;
}

/** Server links on Labs: a second GitHub repository and the server's root URL. */
export function labsHaveServerLinks(labsHtml: string, ctx: StructureContext): boolean {
  const repos = githubRepos(labsHtml);
  const lab5 = ctx.pages.find((page) => samePath(page.path, "/labs/lab5"));
  const server = lab5 ? serverOrigins(lab5.html, ctx.siteHost).remote : [];
  const roots = links(rendered(labsHtml)).some((link) => {
    try {
      const url = new URL(link.href);
      if (url.protocol !== "https:" || LOCAL_HOST.test(url.hostname)) return false;
      if (/github\.com$/i.test(url.hostname) || (ctx.siteHost && url.hostname.toLowerCase() === ctx.siteHost.toLowerCase())) return false;
      return server.length > 0 ? server.includes(url.origin) : /\.(onrender\.com|herokuapp\.com)$/i.test(url.hostname);
    } catch {
      return false;
    }
  });
  return repos.size >= 2 && roots;
}

/* ------------------------------------------------------------------ */
/* fallbacks by A5 criterion (page items; server items are judged async) */
/* ------------------------------------------------------------------ */

const LAB5: StructureTarget = { kind: "path", path: "/labs/lab5", name: "the Lab 5 page" };

function fallback(entry: Omit<StructureFallback, "structureOnly" | "onMiss">): StructureFallback {
  return { onMiss: "fail", ...entry, structureOnly: true };
}

const serverFallback = (looksFor: string, missMessage: string): StructureFallback =>
  // Only used when the async judge didn't run (it always does for A5).
  fallback({ looksFor, missMessage, target: LAB5, test: () => "review" });

export const A5_STRUCTURE_FALLBACKS: Readonly<Record<string, StructureFallback>> = {
  "a5-delivery-server-links": fallback({
    looksFor: "links to your Node server's GitHub repository and to your deployed server",
    missMessage: "The Labs pages should also link to your Node server's GitHub repository and to the root URL of your deployed server (Render or Heroku).",
    target: { kind: "labs" },
    test: (html, ctx) => labsHaveServerLinks(html, ctx),
  }),
  "a5-lab-page": fallback({
    looksFor: `the Lab 5 page with its sections (at least ${A5_MIN_LAB_HEADINGS} headings)`,
    missMessage: `/labs/lab5 should show a titled section for each exercise in §5.2–§5.3 (we found fewer than ${A5_MIN_LAB_HEADINGS} section headings, or the starter page).`,
    target: LAB5,
    test: (html) => lab5HasSections(html),
  }),
  ...Object.fromEntries(A5_SERVER_ITEMS.map((item) => [item.id, serverFallback(item.pass, item.miss)])),
  "a5-lab-next-routes": serverFallback("the /api/lab5 Route Handlers", "Your Vercel deployment should answer /api/lab5/hello and /api/lab5/calculator."),
};
