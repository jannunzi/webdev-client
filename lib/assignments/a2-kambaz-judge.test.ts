/**
 * A2 Kambaz rows are judged from the compiled CSS of the crawled screens:
 * what the CSS does to the page, never ids, class names or text. Pages and
 * CSS come from fixtures/a2-kambaz.ts (a styled §2.4 build and the plain
 * Chapter 1 prototype).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { A2_RUBRIC } from "./a2";
import { A2_KAMBAZ_ROWS, colorTone } from "./a2-kambaz-judge";
import { latestResultByCriterion, runConfiguredChecks } from "./checks";
import {
  A2_FIXTURE_NAME,
  A2_FIXTURE_ORIGIN,
  A2_FIXTURE_TREE,
  bookSite,
  editPages,
  fixtureProbes,
  override,
  type FixtureSite,
} from "./fixtures/a2-deploy";
import { KAMBAZ_CSS_FILE, kambazPages } from "./fixtures/a2-kambaz";
import { proposedGradeFromResults } from "./grade";
import { resolveNameQuery } from "./names";

const KAMBAZ_IDS = A2_KAMBAZ_ROWS.map((row) => row.id);

async function grade(site: FixtureSite) {
  const results = await runConfiguredChecks("a2", {
    githubUrl: A2_FIXTURE_TREE,
    vercelUrl: A2_FIXTURE_ORIGIN,
    nameQuery: resolveNameQuery({ rosterName: A2_FIXTURE_NAME }),
    probes: fixtureProbes(site),
  });
  const latest = latestResultByCriterion(results);
  const kambazPoints = proposedGradeFromResults(A2_RUBRIC, results).earnedPoints - 38;
  return {
    results,
    kambazPoints,
    row: (id: string) => {
      const result = latest.get(id);
      assert.ok(result, id);
      return result;
    },
  };
}

const KAMBAZ_PATHS = Object.keys(kambazPages(true));

/** Serve the plain Chapter 1 Kambaz pages (no stylesheet, tables for layout). */
function withPlainKambaz(site: FixtureSite): FixtureSite {
  const plain = kambazPages(false);
  return (path) => {
    const clean = path.length > 1 ? path.replace(/\/+$/, "") : path;
    return clean in plain ? { status: 200, body: plain[clean] } : site(path);
  };
}

/** Remove every class attribute on one Kambaz page. */
const unstyle = (site: FixtureSite, target: string) =>
  editPages(site, (html) => html.replace(/ class="[^"]*"/g, ""), target);

describe("A2 Kambaz rows", () => {
  it("passes every Kambaz row on a styled §2.4 build", async () => {
    const graded = await grade(bookSite);
    for (const id of KAMBAZ_IDS) {
      assert.equal(graded.row(id).passed, true, `${id}: ${graded.row(id).message}`);
      assert.equal(graded.row(id).needsReview, undefined, id);
      assert.equal(graded.row(id).skipped, undefined, id);
    }
    assert.equal(graded.kambazPoints, 45);
  });

  it("fails every Kambaz row on the plain Chapter 1 prototype", async () => {
    const graded = await grade(withPlainKambaz(bookSite));
    for (const id of KAMBAZ_IDS) {
      assert.equal(graded.row(id).passed, false, `${id}: ${graded.row(id).message}`);
      assert.equal(graded.row(id).needsReview, undefined, id);
    }
    assert.equal(graded.kambazPoints, 0);
    assert.match(graded.row("a2-kambaz-nav").message, /Kambaz Navigation styling/);
    assert.match(graded.row("a2-kambaz-nav").message, /§2\.4\.1/);
  });

  it("does not read ids, class names or text", async () => {
    const renamed: FixtureSite = (path) => {
      const res = bookSite(path);
      if ("network" in res || path.endsWith(".css") || !KAMBAZ_PATHS.includes(path)) return res;
      // Same CSS, same rules reaching the same elements; only the text changes.
      return { ...res, body: res.body.replace(/>([^<>]*[A-Za-z][^<>]*)</g, (_m, t: string) => `>${t.replace(/[A-Za-z]/g, "x")}<`) };
    };
    const graded = await grade(renamed);
    assert.equal(graded.kambazPoints, 45);
    for (const row of graded.results) assert.doesNotMatch(row.message, /\bwd-/i, row.id);
  });

  it("sends a screen with only some of its styling to TA review, points kept", async () => {
    // Dashboard: the grid is there, the cards are plain.
    const site = editPages(bookSite, (html) => html.replace(/class="w-\[300px\] border rounded-lg shadow"/g, "").replace(/class="p-4"/g, ""), "/dashboard");
    const graded = await grade(site);
    const row = graded.row("a2-kambaz-dashboard");
    assert.equal(row.passed, true);
    assert.equal(row.needsReview, true);
    assert.match(row.message, /Needs TA review/);
    assert.match(row.message, /no points taken off/);
    assert.equal(graded.kambazPoints, 45);
  });

  it("fails only the unstyled screen, and says what is missing", async () => {
    const graded = await grade(unstyle(bookSite, "/courses/1234/assignments"));
    assert.equal(graded.row("a2-kambaz-assignments").passed, false);
    assert.match(graded.row("a2-kambaz-assignments").message, /Assignments styling/);
    assert.match(graded.row("a2-kambaz-assignments").message, /§2\.4\.7/);
    for (const id of KAMBAZ_IDS.filter((id) => id !== "a2-kambaz-assignments")) {
      // The nav on the plain page is unstyled too, but the nav row reads /dashboard.
      assert.equal(graded.row(id).passed, true, id);
    }
    assert.equal(graded.kambazPoints, 40);
  });

  it("fails the Dashboard and Navigation rows when /dashboard is a 404", async () => {
    const graded = await grade(override(bookSite, "/dashboard", { status: 404, body: "nf" }));
    assert.equal(graded.row("a2-kambaz-dashboard").passed, false);
    assert.match(graded.row("a2-kambaz-dashboard").message, /404/);
    // The nav is read from the course Home page when /dashboard is gone.
    assert.equal(graded.row("a2-kambaz-nav").passed, true);
  });

  it("keeps People points for review when the page is at /people, if the rest is real", async () => {
    const graded = await grade(override(bookSite, "/courses/1234/people/table", { status: 404, body: "nf" }));
    const row = graded.row("a2-kambaz-people");
    assert.equal(row.passed, true);
    assert.equal(row.needsReview, true);
    assert.match(row.message, /Needs TA review/);
    assert.equal(graded.kambazPoints, 45);
  });

  it("does not give People review points to a site with no real Kambaz screens", async () => {
    const blank: FixtureSite = (path) => (KAMBAZ_PATHS.includes(path) ? { status: 404, body: "nf" } : bookSite(path));
    const graded = await grade(blank);
    assert.equal(graded.row("a2-kambaz-people").passed, false);
    assert.equal(graded.kambazPoints, 0);
  });

  it("asks for a re-check, keeping points, when the Kambaz stylesheet can't be downloaded", async () => {
    const site: FixtureSite = (path) => (path.endsWith(KAMBAZ_CSS_FILE) ? { status: 503, body: "" } : bookSite(path));
    const graded = await grade(site);
    for (const id of KAMBAZ_IDS) {
      assert.equal(graded.row(id).passed, true, id);
      assert.match(graded.row(id).message, /Needs re-check/, id);
    }
    assert.equal(graded.kambazPoints, 45);
  });

  it("classifies the colors Kambaz uses", () => {
    assert.equal(colorTone("var(--color-black)"), "dark");
    assert.equal(colorTone("#000"), "dark");
    assert.equal(colorTone("var(--color-gray-900)"), "dark");
    assert.equal(colorTone("var(--color-white)"), "light");
    assert.equal(colorTone("var(--color-gray-200)"), "gray");
    assert.equal(colorTone("#e9ecef"), "gray");
    assert.equal(colorTone("var(--color-green-600)"), "green");
    assert.equal(colorTone("rgb(25, 135, 84)"), "green");
    assert.equal(colorTone("var(--color-red-600)"), "red");
    assert.equal(colorTone("oklch(0.5 0.2 25)"), "red");
  });
});
