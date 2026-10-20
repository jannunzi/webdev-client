/**
 * A5 checker against a Next.js client built from the Chapter 5 listings
 * (Lab 5 page with NEXT_PUBLIC_HTTP_SERVER set to the deployed server) and
 * a Node server built from the Lab 5 and Kambaz listings
 * (fixtures/a5-student-build.json: client pages, plus "server:" entries for
 * the server's answers). Each variant edits that build the way a real
 * submission could differ; ids are used only to simulate removals.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { A5_RUBRIC } from "./a5";
import { A5_CHECKER, A5_SEED_PATHS, A5_VERIFY_PATHS } from "./a5-checker";
import { answerNumber, serverOrigins } from "./a5-structure";
import { criterionCoverage, getChecker } from "./checkers";
import { latestResultByCriterion, runConfiguredChecks } from "./checks";
import type { AssignmentCheckResult, HtmlFetchResult } from "./checks";
import { supportsUrlSubmission } from "./access";
import { formatPointsPercent } from "./grade";
import { stripWdIds } from "./html";
import { resolveNameQuery } from "./names";

const CLIENT = "webdev-client-git-a5-quentin-student.vercel.app";
const SERVER = "webdev-server-qa.onrender.com";
const TREE = "https://github.com/quentin-student/webdev-client/tree/a5";

type Page = { status: number; html: string };
const BUILD: Record<string, Page> = JSON.parse(readFileSync(new URL("./fixtures/a5-student-build.json", import.meta.url), "utf8"));
const CRITERIA = A5_RUBRIC.groups.flatMap((group) => group.criteria);
const TOTAL = CRITERIA.reduce((sum, row) => sum + row.points, 0);
const NOT_FOUND: Page = { status: 404, html: "<html><body>404: This page could not be found.</body></html>" };
const CANNOT_GET: Page = { status: 404, html: "<pre>Cannot GET</pre>" };

/** key: "/path?query" for the client, "server:/path?query" for the Node server (any host). */
type Serve = (key: string) => Page | HtmlFetchResult;
const fromBuild: Serve = (key) => BUILD[key] ?? (key.startsWith("server:") ? CANNOT_GET : NOT_FOUND);

async function grade(serve: Serve) {
  const results: AssignmentCheckResult[] = await runConfiguredChecks("a5", {
    githubUrl: TREE,
    vercelUrl: `https://${CLIENT}`,
    nameQuery: resolveNameQuery({ firstName: "Quentin", lastName: "Student" }),
    probes: {
      getHtml: async (raw) => {
        const url = new URL(raw);
        const key = (url.hostname === CLIENT ? "" : "server:") + url.pathname + url.search;
        const page = serve(key);
        if ("ok" in page) return page;
        if (page.status >= 200 && page.status < 300) return { ok: true, status: page.status, finalUrl: raw, html: page.html };
        return { ok: false, status: page.status, finalUrl: raw, html: page.html, code: "http_error", message: `HTTP ${page.status}` };
      },
      probeUrl: async () => ({ ok: true, status: 200 }),
    },
  });
  const byCriterion = latestResultByCriterion(results);
  let points = 0;
  const failed: string[] = [];
  const recheck: string[] = [];
  for (const row of CRITERIA) {
    const result = byCriterion.get(row.id);
    if (result?.passed && !result.skipped) points += row.points;
    else failed.push(row.id);
    if (result?.needsReview) recheck.push(row.id);
  }
  return { results, points, failed, recheck };
}

const on = (match: (key: string) => boolean, edit: (html: string) => string): Serve => (key) => {
  const page = fromBuild(key) as Page;
  return match(key) && page.status === 200 ? { ...page, html: edit(page.html) } : page;
};
const all = () => true;
const server = (path: string) => (key: string) => key === `server:${path}` || key.startsWith(`server:${path}?`) || key.startsWith(`server:${path}/`);
const answer = (match: (key: string) => boolean, page: Page): Serve => (key) => (match(key) ? page : fromBuild(key));
const gone = (match: (key: string) => boolean) => answer(match, CANNOT_GET);
const BOILERPLATE = `<html><head><title>Create Next App</title></head><body><main><h1>To get started, edit the page.tsx file.</h1><p>Looking for a starting point or more instructions? Head over to Templates or the Learning center.</p></main></body></html>`;

const pointsOf = (ids: string[]) => CRITERIA.filter((row) => ids.includes(row.id)).reduce((sum, row) => sum + row.points, 0);
const SERVER_ROWS = ["a5-lab-server-url", "a5-lab-path", "a5-lab-path-oyo", "a5-lab-query", "a5-lab-query-oyo", "a5-lab-object", "a5-lab-module-oyo", "a5-lab-todos", "a5-kambaz-courses-api", "a5-kambaz-modules-api"];
const ordered = (ids: string[]) => CRITERIA.map((row) => row.id).filter((id) => ids.includes(id));

describe("A5 checker (Lab pages + the student's server)", () => {
  it("scores the book build 100 / 100 with points and percentage", async () => {
    const { points, failed, recheck } = await grade(fromBuild);
    assert.deepEqual(failed, []);
    assert.deepEqual(recheck, []);
    assert.equal(TOTAL, 100);
    assert.equal(formatPointsPercent(points, TOTAL), "100 / 100 (100.0%)");
  });

  const SAME: [string, Serve][] = [
    ["every wd-* id stripped", on((k) => !k.startsWith("server:"), (h) => stripWdIds(h))],
    ["ids renamed", on((k) => !k.startsWith("server:"), (h) => h.replace(/\bid="wd-/g, 'id="my-'))],
    ["different link labels and sample numbers", on((k) => k === "/labs/lab5", (h) => h.replace(/>Add </g, ">Plus <").replace(/\/34\/23/g, "/5/6").replace(/a=34&amp;b=23/g, "a=5&amp;b=6"))],
    ["answers sent as JSON numbers", (k) => { const p = fromBuild(k) as Page; return k.startsWith("server:/lab5/") && /^-?\d+(\.\d+)?$/.test(p.html.trim()) ? { ...p, html: JSON.stringify(Number(p.html)) } : p; }],
    ["answers sent as { result }", (k) => { const p = fromBuild(k) as Page; return k.startsWith("server:/lab5/") && /^-?\d+(\.\d+)?$/.test(p.html.trim()) ? { ...p, html: JSON.stringify({ result: Number(p.html) }) } : p; }],
    ["a renamed assignment title and module name", on((k) => /server:\/lab5\/(assignment|module)/.test(k), (h) => h.replace(/NodeJS Assignment/g, "Express homework").replace(/Introduction to Node.js/g, "Routes 101"))],
    ["renamed course ids", on((k) => k === "server:/api/courses", (h) => h)],
  ];
  for (const [name, serve] of SAME) {
    it(`gives full credit with ${name}`, async () => {
      const { failed, recheck } = await grade(serve);
      assert.deepEqual(failed, []);
      assert.deepEqual(recheck, []);
    });
  }

  it("gives nothing beyond the submitted URLs for the create-next-app template", async () => {
    const { points } = await grade((k) => (k.startsWith("server:") ? CANNOT_GET : { status: 200, html: BOILERPLATE }));
    assert.equal(points, 6);
  });

  it("scores only the GitHub URL for an empty deploy (every page 404)", async () => {
    const { points } = await grade(() => NOT_FOUND);
    assert.equal(points, 3);
  });

  it("follows the book without the On your own steps: loses only those points", async () => {
    const serve: Serve = (k) => {
      if (/^server:\/lab5\/(multiply|divide)\//.test(k) || k.startsWith("server:/lab5/module")) return CANNOT_GET;
      if (/^server:\/lab5\/calculator\?operation=(multiply|divide)/.test(k)) return { status: 200, html: "Invalid operation" };
      return fromBuild(k);
    };
    const { failed, points } = await grade(serve);
    assert.deepEqual(failed, ["a5-lab-path-oyo", "a5-lab-query-oyo", "a5-lab-module-oyo"]);
    assert.equal(points, 89);
  });

  const MISSES: { name: string; serve: Serve; fails: string[] }[] = [
    { name: "Lab 5 link removed from Labs", serve: on((k) => k.startsWith("/labs"), (h) => h.replace(/<a\b[^>]*href="\/labs\/lab5"[^>]*>[\s\S]*?<\/a>/g, "")), fails: ["a5-delivery-labs-nav"] },
    { name: "server links removed from Labs", serve: on((k) => k === "/labs", (h) => h.replace(/<a[^>]*id="wd-github-server"[^>]*>[^<]*<\/a>/, "").replace(/<a[^>]*id="wd-server-root"[^>]*>[^<]*<\/a>/, "")), fails: ["a5-delivery-server-links"] },
    { name: "add route returns the wrong number", serve: answer((k) => k === "server:/lab5/add/12/30", { status: 200, html: "1230" }), fails: ["a5-lab-path"] },
    { name: "subtract route missing", serve: gone(server("/lab5/subtract")), fails: ["a5-lab-path"] },
    { name: "divide route missing", serve: gone(server("/lab5/divide")), fails: ["a5-lab-path-oyo"] },
    { name: "calculator ignores operation", serve: on((k) => k.startsWith("server:/lab5/calculator"), () => "42"), fails: ["a5-lab-query", "a5-lab-query-oyo"] },
    { name: "assignment title route missing", serve: gone((k) => k === "server:/lab5/assignment/title"), fails: ["a5-lab-object"] },
    { name: "module name differs from the module", serve: answer((k) => k === "server:/lab5/module/name", { status: 200, html: '"Something else"' }), fails: ["a5-lab-module-oyo"] },
    { name: "todos ?completed filter ignored", serve: (k) => (k === "server:/lab5/todos?completed=true" ? fromBuild("server:/lab5/todos") : fromBuild(k)), fails: ["a5-lab-todos"] },
    { name: "todo by id returns the whole array", serve: (k) => (k === "server:/lab5/todos/1" ? fromBuild("server:/lab5/todos") : fromBuild(k)), fails: ["a5-lab-todos"] },
    { name: "Next.js calculator route missing", serve: (k) => (k.startsWith("/api/lab5/calculator") ? NOT_FOUND : fromBuild(k)), fails: ["a5-lab-next-routes"] },
    { name: "only 2 courses", serve: on((k) => k === "server:/api/courses", (h) => JSON.stringify(JSON.parse(h).slice(0, 2))), fails: ["a5-kambaz-courses-api"] },
    { name: "Courses API missing", serve: gone((k) => k === "server:/api/courses"), fails: ["a5-kambaz-courses-api"] },
    { name: "modules not filtered by course", serve: (k) => (/^server:\/api\/courses\/[^/]+\/modules$/.test(k) ? { status: 200, html: JSON.stringify([...JSON.parse((fromBuild("server:/api/courses/RS101/modules") as Page).html), ...JSON.parse((fromBuild("server:/api/courses/RS102/modules") as Page).html)]) } : fromBuild(k)), fails: ["a5-kambaz-modules-api"] },
    { name: "Lab 5 page 404", serve: (k) => (k === "/labs/lab5" ? NOT_FOUND : fromBuild(k)), fails: ["a5-lab-page", ...SERVER_ROWS] }, // Labs still links to Lab 5 and the server
  ];
  for (const variant of MISSES) {
    it(`catches: ${variant.name}`, async () => {
      const { failed, points } = await grade(variant.serve);
      assert.deepEqual(failed, ordered(variant.fails));
      assert.equal(points, 100 - pointsOf(variant.fails));
    });
  }

  it("fails every server item, with a fix-it message, when the Lab 5 links point at localhost", async () => {
    const { failed, results } = await grade(on((k) => k.startsWith("/labs"), (h) => h.replace(/https:\/\/webdev-server-qa\.onrender\.com/g, "http://localhost:4000")));
    assert.deepEqual(failed, ordered([...SERVER_ROWS, "a5-delivery-server-links"]));
    assert.ok(results.some((row) => /NEXT_PUBLIC_HTTP_SERVER on Vercel/.test(row.message)));
  });

  it("keeps points and asks for a re-check when the server is asleep (timeouts)", async () => {
    const { failed, recheck } = await grade((k) => (k.startsWith("server:") ? { ok: false, code: "network", message: "timeout" } : fromBuild(k)));
    assert.deepEqual(failed, []);
    assert.deepEqual(recheck, ordered(SERVER_ROWS));
  });

  it("keeps points on a 503 from the server", async () => {
    const { failed, recheck } = await grade((k) => (k.startsWith("server:/api/") ? { status: 503, html: "Service Unavailable" } : fromBuild(k)));
    assert.deepEqual(failed, []);
    assert.deepEqual(recheck, ["a5-kambaz-courses-api", "a5-kambaz-modules-api"]);
  });

  it("never names an id or wd- in any message", async () => {
    for (const serve of [fromBuild, ...MISSES.map((variant) => variant.serve)]) {
      const { results } = await grade(serve);
      for (const row of results) assert.doesNotMatch(row.message, /wd-|\sids?[\s.,]/i, `${row.id}: ${row.message}`);
    }
    for (const row of CRITERIA) assert.doesNotMatch(row.description, /wd-/, row.id);
  });
});

describe("A5 helpers", () => {
  it("reads answers as numbers in the shapes students send", () => {
    assert.equal(answerNumber("42"), 42);
    assert.equal(answerNumber("-18"), -18);
    assert.equal(answerNumber('"42"'), 42);
    assert.equal(answerNumber('{"result":42}'), 42);
    assert.equal(answerNumber("Invalid operation"), null);
  });

  it("finds the server from the Lab 5 links, ignoring same-site and localhost links", () => {
    const html = `<a href="https://x.onrender.com/lab5/add/1/2">a</a><a href="https://x.onrender.com/lab5/welcome">w</a><a href="http://localhost:4000/lab5/add/1/2">l</a><a href="https://${CLIENT}/lab5/x">s</a>`;
    assert.deepEqual(serverOrigins(html, CLIENT), { remote: ["https://x.onrender.com"], local: true });
  });
});

describe("A5 wiring", () => {
  it("is registered with the other checkers but does not open submissions", () => {
    assert.equal(getChecker("a5"), A5_CHECKER);
    assert.equal(criterionCoverage("a5", "a5-kambaz-modules-api"), "auto");
    assert.equal(supportsUrlSubmission("a5"), false);
  });

  it("verifies every rubric item at a seeded path", () => {
    for (const row of CRITERIA) {
      assert.ok(A5_VERIFY_PATHS[row.id], row.id);
      assert.ok((A5_SEED_PATHS as readonly string[]).includes(A5_VERIFY_PATHS[row.id]), row.id);
    }
  });
});
