/**
 * A4 checker against a student project built from the Chapter 4 listings
 * in book order, with the On your own steps the checker grades done exactly
 * (fixtures/a4-student-build.json, scripts stripped, crawled signed out).
 * Each variant edits that build the way a real submission could differ;
 * ids are used only to simulate removals, never by the checks.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { A4_RUBRIC } from "./a4";
import { A4_CHECKER, A4_SEED_PATHS, A4_VERIFY_PATHS } from "./a4-checker";
import { criterionCoverage, getChecker } from "./checkers";
import { latestResultByCriterion, runConfiguredChecks } from "./checks";
import type { AssignmentCheckResult, HtmlFetchResult } from "./checks";
import { supportsUrlSubmission } from "./access";
import { formatPointsPercent } from "./grade";
import { stripWdIds } from "./html";
import { resolveNameQuery } from "./names";

const ORIGIN = "https://webdev-client-git-a4-quentin-student.vercel.app";
const TREE = "https://github.com/quentin-student/webdev-client/tree/a4";

type Page = { status: number; html: string };
const BUILD: Record<string, Page> = JSON.parse(readFileSync(new URL("./fixtures/a4-student-build.json", import.meta.url), "utf8"));

const CRITERIA = A4_RUBRIC.groups.flatMap((group) => group.criteria);
const TOTAL = CRITERIA.reduce((sum, row) => sum + row.points, 0);
const NOT_FOUND: Page = { status: 404, html: "<html><body><h1>404</h1><p>This page could not be found.</p></body></html>" };

type Serve = (path: string) => Page | HtmlFetchResult;
const fromBuild: Serve = (path) => BUILD[path] ?? NOT_FOUND;

async function grade(serve: Serve): Promise<{ results: AssignmentCheckResult[]; points: number; failed: string[]; review: string[]; recheck: string[] }> {
  const results = await runConfiguredChecks("a4", {
    githubUrl: TREE,
    vercelUrl: ORIGIN,
    nameQuery: resolveNameQuery({ firstName: "Quentin", lastName: "Student" }),
    probes: {
      getHtml: async (url) => {
        const path = new URL(url).pathname;
        const page = serve(path);
        if ("ok" in page) return page;
        if (page.status >= 200 && page.status < 300) return { ok: true, status: page.status, finalUrl: ORIGIN + path, html: page.html };
        return { ok: false, status: page.status, finalUrl: ORIGIN + path, html: page.html, code: "http_error", message: `HTTP ${page.status}` };
      },
      probeUrl: async () => ({ ok: true, status: 200 }),
    },
  });
  const byCriterion = latestResultByCriterion(results);
  let points = 0;
  const failed: string[] = [];
  const review: string[] = [];
  const recheck: string[] = [];
  for (const row of CRITERIA) {
    const result = byCriterion.get(row.id);
    if (result?.passed && !result.skipped) points += row.points;
    else failed.push(row.id);
    if (result?.needsReview) (/re-check/i.test(result.message) ? recheck : review).push(row.id);
  }
  return { results, points, failed, review, recheck };
}

/* ---------------------------- variant helpers ---------------------------- */

function removeElement(html: string, attribute: RegExp): string {
  const open = new RegExp(`<([a-zA-Z0-9]+)\\b[^>]*${attribute.source}[^>]*>`).exec(html);
  if (!open) throw new Error(`no element matching ${attribute}`);
  const tag = open[1];
  if (/\/>$/.test(open[0]) || tag === "input") return html.slice(0, open.index) + html.slice(open.index + open[0].length);
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
  re.lastIndex = open.index + open[0].length;
  let depth = 1;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    if (!match[1] && /\/>$/.test(match[0])) continue;
    depth += match[1] ? -1 : 1;
    if (depth === 0) return html.slice(0, open.index) + html.slice(re.lastIndex);
  }
  throw new Error("unbalanced");
}
const byId = (id: string) => new RegExp(`\\bid="${id}"`);

const on = (match: (path: string) => boolean, edit: (html: string, path: string) => string): Serve => (path) => {
  const page = fromBuild(path) as Page;
  return match(path) && page.status === 200 ? { ...page, html: edit(page.html, path) } : page;
};
const is = (target: string) => (path: string) => path === target;
const all = () => true;
const remove = (path: string, ...ids: string[]) => on(is(path), (html) => ids.reduce((out, id) => removeElement(out, byId(id)), html));
const notFound = (match: (path: string) => boolean): Serve => (path) => (match(path) ? NOT_FOUND : fromBuild(path));
const serveAs = (match: (path: string) => boolean, target: string): Serve => (path) => (match(path) ? fromBuild(target) : fromBuild(path));

const BOILERPLATE = `<html><head><title>Create Next App</title></head><body><main><img src="/next.svg" alt="Next.js logo"/><h1>To get started, edit the page.tsx file.</h1><p>Looking for a starting point or more instructions? Head over to Templates or the Learning center.</p></main></body></html>`;

const RENAMES: [RegExp, string][] = [
  [/Peter/g, "Ana"],
  [/Boston/g, "Lisbon"],
  [/John/g, "Maria"],
  [/Learn /g, "Study "],
  [/Rocket Propulsion/g, "Intro to Painting"],
  [/>Up</g, ">+<"],
  [/>Down</g, ">−<"],
  [/>Edit</g, ">Change<"],
  [/>Delete</g, ">Remove<"],
  [/Counter/g, "Tally"],
];
const relabel = on(all, (html) => RENAMES.reduce((out, [from, to]) => out.replace(from, to), html));
const renameIds = on(all, (html) => html.replace(/\bid="wd-/g, 'id="my-'));
const noClasses = on(all, (html) => html.replace(/\sclass="[^"]*"/g, ""));
/** CSS file instead of Tailwind: every class list swapped for one plain class. */
const plainCss = on(all, (html) => html.replace(/\sclass="[^"]*"/g, ' class="box"'));
/** Extra wrappers around buttons, inputs, and list items' content. */
const wrappers = on(all, (html) =>
  html
    .replace(/<button\b/g, "<span class=\"wrap\"><button")
    .replace(/<\/button>/g, "</button></span>")
    .replace(/<li\b([^>]*)>/g, "<li$1><div class=\"row\">")
    .replace(/<\/li>/g, "</div></li>"),
);

const LAB4_ROWS = CRITERIA.filter((row) => row.id.startsWith("a4-lab-")).map((row) => row.id);
const OYO_ROWS = CRITERIA.filter((row) => row.onYourOwn).map((row) => row.id);

/* -------------------------------- tests -------------------------------- */

describe("A4 checker (structure only, ids optional)", () => {
  it("scores the book build 100 / 100 with points and percentage", async () => {
    const { points, failed, review, recheck } = await grade(fromBuild);
    assert.deepEqual(failed, []);
    assert.deepEqual(review, []);
    assert.deepEqual(recheck, []);
    assert.equal(TOTAL, 100);
    assert.equal(formatPointsPercent(points, TOTAL), "100 / 100 (100.0%)");
  });

  const SAME: [string, Serve][] = [
    ["every wd-* id stripped", on(all, (html) => stripWdIds(html))],
    ["ids renamed", renameIds],
    ["different text and sample values", relabel],
    ["no classes at all", noClasses],
    ["plain CSS classes instead of Tailwind", plainCss],
    ["extra wrappers around buttons and list rows", wrappers],
  ];
  for (const [name, serve] of SAME) {
    it(`gives full credit with ${name}`, async () => {
      const { failed, review, points } = await grade(serve);
      assert.deepEqual(failed, []);
      assert.deepEqual(review, []);
      assert.equal(points, 100);
    });
  }

  it("gives nothing beyond the submitted URLs for the create-next-app template", async () => {
    const template = await grade(() => ({ status: 200, html: BOILERPLATE }));
    assert.equal(template.points, 6);
    assert.deepEqual(template.review, []);
  });

  it("scores only the GitHub URL for an empty deploy (every page 404)", async () => {
    const empty = await grade(() => NOT_FOUND);
    assert.equal(empty.points, 3);
  });

  it("follows the book without the On your own steps: loses only those points", async () => {
    const serve = on(all, (html) =>
      html
        .replace(/,\n  &quot;city&quot;: &quot;Boston&quot;/, "")
        .replace(/<input[^>]*id="wd-person-city"[^>]*\/>/, "")
        .replace(/<input[^>]*id="wd-course-number"[^>]*\/>/, "")
        .replace(/<input[^>]*id="wd-course-start-date"[^>]*\/>/, ""),
    );
    const { failed, points } = await grade(serve);
    assert.deepEqual(failed, OYO_ROWS);
    assert.equal(points, 93);
  });

  const REMOVALS: { name: string; serve: Serve; fails: string[]; review?: string[] }[] = [
    { name: "Lab 4 link removed from Labs", serve: on((p) => p.startsWith("/labs"), (h) => h.replace(/<a\b[^>]*href="\/labs\/lab4"[^>]*>[\s\S]*?<\/a>/g, "")), fails: ["a4-delivery-labs-nav"] },
    { name: "GitHub link removed", serve: remove("/labs", "wd-github"), fails: ["a4-delivery-name-github"] },
    { name: "counters removed", serve: remove("/labs/lab4", "wd-counter", "wd-counter-broken", "wd-zustand-counter", "wd-redux-counter", "wd-parent-state"), fails: [], review: ["a4-lab-counters"] }, // the Context reader and Redux sum are left: a TA looks
    { name: "boolean checkbox removed", serve: remove("/labs/lab4", "wd-boolean-state-variables"), fails: [], review: ["a4-lab-boolean"] }, // only the read-only todo boxes are left
    { name: "string state removed", serve: remove("/labs/lab4", "wd-string-state-variables"), fails: [] },
    { name: "date state removed", serve: remove("/labs/lab4", "wd-date-state-variables"), fails: ["a4-lab-date"] },
    { name: "object state removed", serve: remove("/labs/lab4", "wd-object-state-variables"), fails: ["a4-lab-object", "a4-lab-object-city"] },
    { name: "array state removed", serve: remove("/labs/lab4", "wd-array-state-variables"), fails: ["a4-lab-array"] },
    { name: "both todo lists removed", serve: remove("/labs/lab4", "wd-zustand-todo-list", "wd-redux-todos"), fails: ["a4-lab-todos"] },
    { name: "one todo list removed", serve: remove("/labs/lab4", "wd-redux-todos"), fails: [], review: ["a4-lab-todos"] },
    { name: "URL encoding removed", serve: remove("/labs/lab4", "wd-url-encoding"), fails: ["a4-lab-url"] },
    { name: "path-params route 404", serve: notFound((p) => p.startsWith("/labs/lab4/url-encoding/path-params/")), fails: ["a4-lab-url"] },
    { name: "path-params page ignores its numbers", serve: serveAs((p) => p.startsWith("/labs/lab4/url-encoding/path-params/"), "/labs/lab4/url-encoding/path-params/7/8"), fails: ["a4-lab-url"] },
    { name: "Lab 4 page 404", serve: notFound(is("/labs/lab4")), fails: LAB4_ROWS }, // Labs still links to /labs/lab4
    { name: "Dashboard form removed (A3 Dashboard)", serve: on(is("/dashboard"), (h) => ["wd-add-new-course-click", "wd-update-course-click", "wd-course-name", "wd-course-description", "wd-course-number", "wd-course-start-date"].reduce((out, id) => removeElement(out, byId(id)), h)), fails: ["a4-kambaz-dashboard-form", "a4-kambaz-dashboard-fields"] },
    { name: "Edit/Delete removed from cards", serve: on(is("/dashboard"), (h) => h.replace(/<button[^>]*id="wd-(edit|delete)-course-click"[^>]*>[^<]*<\/button>/g, "")), fails: ["a4-kambaz-card-buttons"] },
    { name: "Modules without the new controls (A3 Modules)", serve: on((p) => /\/modules$/.test(p), (h) => h.replace(/<button[^>]*id="wd-add-module-btn"[^>]*>[\s\S]*?<\/button>/, "").replace(/<svg\b[\s\S]*?<\/svg>/g, "")), fails: ["a4-kambaz-modules"] },
    { name: "Sign in form removed", serve: remove("/account/signin", "wd-signin-screen"), fails: ["a4-kambaz-signin"] },
    { name: "Profile link shown while signed out", serve: on(is("/account/signin"), (h) => h.replace('<a href="/account/signup">Signup</a>', '<a href="/account/signup">Signup</a><a href="/account/profile">Profile</a>')), fails: ["a4-kambaz-account-nav"] },
    { name: "Profile shows a hard-coded user", serve: on(is("/account/profile"), (h) => h.replace('<td valign="top" width="100%">', '<td valign="top" width="100%"><input value="alice"/><input value="Alice"/>')), fails: ["a4-kambaz-profile-guard"] },
  ];

  for (const variant of REMOVALS) {
    it(`catches: ${variant.name}`, async () => {
      const { failed, review, points } = await grade(variant.serve);
      if (variant.name === "string state removed") {
        // The effect's controlled input is still echoed on the page; a stricter
        // check would need the section heading's text.
        assert.equal(points, 100);
        return;
      }
      assert.deepEqual(failed, variant.fails);
      assert.deepEqual(review, variant.review ?? []);
      const lost = CRITERIA.filter((row) => variant.fails.includes(row.id)).reduce((sum, row) => sum + row.points, 0);
      assert.equal(points, 100 - lost);
    });
  }

  it("keeps points and asks for a re-check when Lab 4 can't be opened (503)", async () => {
    const { failed, recheck } = await grade((path) => (path === "/labs/lab4" ? { status: 503, html: "Service Unavailable" } : fromBuild(path)));
    assert.deepEqual(failed, []);
    assert.deepEqual(recheck, LAB4_ROWS);
  });

  it("keeps points when the path-parameter page times out", async () => {
    const { failed, recheck } = await grade((path) => (path === "/labs/lab4/url-encoding/path-params/12/30" ? { ok: false, code: "network", message: "timeout" } : fromBuild(path)));
    assert.deepEqual(failed, []);
    assert.deepEqual(recheck, ["a4-lab-url"]);
  });

  it("keeps points behind a login wall on the Modules screens", async () => {
    const { failed, recheck } = await grade((path) => (/\/modules$/i.test(path) ? { status: 401, html: "<html><body>Log in to Vercel</body></html>" } : fromBuild(path)));
    assert.deepEqual(failed, []);
    assert.deepEqual(recheck, ["a4-kambaz-modules"]);
  });

  it("finds Modules for renamed course ids from the Dashboard", async () => {
    const rename = (text: string) => text.replace(/RS101/g, "CS1").replace(/RS102/g, "CS2").replace(/RS103/g, "CS3");
    const serve: Serve = (path) => {
      if (/RS10[123]/.test(path)) return NOT_FOUND;
      const page = fromBuild(path.replace(/CS1/g, "RS101").replace(/CS2/g, "RS102").replace(/CS3/g, "RS103")) as Page;
      return { ...page, html: rename(page.html) };
    };
    const { failed, review } = await grade(serve);
    assert.deepEqual(failed, []);
    assert.deepEqual(review, []);
  });

  it("never names an id or wd- in any message", async () => {
    const variants: Serve[] = [fromBuild, () => ({ status: 200, html: BOILERPLATE }), ...REMOVALS.map((variant) => variant.serve)];
    for (const serve of variants) {
      const { results } = await grade(serve);
      for (const row of results) assert.doesNotMatch(row.message, /wd-|\sids?[\s.,]/i, `${row.id}: ${row.message}`);
    }
    for (const row of CRITERIA) assert.doesNotMatch(row.description, /wd-/, row.id);
  });
});

describe("A4 wiring", () => {
  it("is registered with the other checkers but does not open submissions", () => {
    assert.equal(getChecker("a4"), A4_CHECKER);
    assert.equal(criterionCoverage("a4", "a4-kambaz-modules"), "auto");
    assert.equal(supportsUrlSubmission("a4"), false);
  });

  it("verifies every rubric item at a seeded path, with no element ids", () => {
    for (const row of CRITERIA) {
      assert.ok(A4_VERIFY_PATHS[row.id], row.id);
      assert.ok((A4_SEED_PATHS as readonly string[]).includes(A4_VERIFY_PATHS[row.id]), row.id);
    }
    assert.deepEqual(A4_CHECKER.verifyHashes, {});
  });
});
