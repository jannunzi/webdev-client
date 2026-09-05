import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assignmentSubmitAccess, canPersistAssignmentSubmission, supportsUrlSubmission } from "./access";
import {
  classifyDeployFetch,
  htmlHasA1LabMarkers,
  htmlHasLabsNavigation,
  htmlHasWdHooks,
  runA1Checks,
} from "./checks";
import { htmlHasStudentName, resolveNameQuery } from "./names";
import { ASSIGNMENT_STUDENT_COPY } from "./student-copy";
import {
  loadAssignmentSubmission,
  upsertAssignmentSubmission,
  type AssignmentSubmissionDoc,
  type SubmissionStore,
} from "./submissions-store";

function memorySubmissionStore(): SubmissionStore {
  const docs: AssignmentSubmissionDoc[] = [];
  return {
    async find(clerkUserId, assignmentId) {
      return (
        docs.find(
          (doc) =>
            doc.clerkUserId === clerkUserId && doc.assignmentId === assignmentId,
        ) ?? null
      );
    },
    async upsert(doc) {
      const index = docs.findIndex(
        (row) =>
          row.clerkUserId === doc.clerkUserId &&
          row.assignmentId === doc.assignmentId,
      );
      if (index === -1) docs.push(doc);
      else docs[index] = doc;
    },
  };
}

const LABS_HTML = `
  <div id="wd-labs">
    <h2>Jane Doe</h2>
    <a id="wd-lab1-link" href="/labs/lab1">Lab 1</a>
    <a id="wd-github" href="https://github.com/jane-doe/webdev-client">GitHub</a>
  </div>
`;

describe("html lab markers", () => {
  it("finds Labs navigation and wd- hooks", () => {
    assert.equal(htmlHasLabsNavigation(LABS_HTML), true);
    assert.equal(htmlHasWdHooks(LABS_HTML), true);
    assert.equal(htmlHasA1LabMarkers(LABS_HTML), true);
    assert.equal(htmlHasA1LabMarkers("<main>Hello</main>"), false);
    assert.equal(htmlHasWdHooks('<input id="wd-your-heading" />'), true);
  });
});

describe("name markers", () => {
  it("parses Clerk/profile and Canvas last, first names", () => {
    const fromClerk = resolveNameQuery({
      firstName: "Jane",
      lastName: "Doe",
      fullName: "Jane Doe",
    });
    assert.equal(fromClerk.first, "Jane");
    assert.equal(fromClerk.last, "Doe");
    assert.equal(htmlHasStudentName(LABS_HTML, fromClerk), true);

    const fromRoster = resolveNameQuery({ rosterName: "Doe, Jane" });
    assert.ok(fromRoster.phrases.includes("Jane Doe"));
    assert.equal(htmlHasStudentName(LABS_HTML, fromRoster), true);
    assert.equal(
      htmlHasStudentName("<h2>Alex Rivera</h2>", fromClerk),
      false,
    );
  });

  it("skips dummy impersonation tokens", () => {
    const query = resolveNameQuery({
      firstName: "Demo",
      lastName: "Student",
      rosterName: "Demo Student",
    });
    assert.equal(query.markers.length, 0);
  });
});

describe("runA1Checks", () => {
  it("validates URLs and reads Labs HTML from /labs when needed", async () => {
    const calls: string[] = [];
    const results = await runA1Checks({
      githubUrl: "https://github.com/jane-doe/webdev-client",
      vercelUrl: "https://jane-a1.vercel.app",
      nameQuery: resolveNameQuery({ firstName: "Jane", lastName: "Doe" }),
      probes: {
        async getHtml(url) {
          calls.push(url);
          if (url.endsWith("/labs")) {
            return { ok: true, status: 200, finalUrl: url, html: LABS_HTML };
          }
          return {
            ok: true,
            status: 200,
            finalUrl: url,
            html: "<html><body>Syllabus</body></html>",
          };
        },
        async probeUrl() {
          return { ok: true, status: 200 };
        },
      },
    });
    const byId = Object.fromEntries(results.map((row) => [row.id, row]));
    assert.equal(byId["github-url"]?.passed, true);
    assert.equal(byId["github-public"]?.passed, true);
    assert.equal(byId["vercel-url"]?.passed, true);
    assert.equal(byId["vercel-open"]?.passed, true);
    assert.equal(byId["labs-markers"]?.passed, true);
    assert.equal(byId["name-markers"]?.passed, true);
    assert.deepEqual(calls, [
      "https://jane-a1.vercel.app/",
      "https://jane-a1.vercel.app/labs",
    ]);
  });

  it("fails localhost, auth walls, and missing labs markers", async () => {
    const localhost = await runA1Checks({
      githubUrl: "https://github.com/jane-doe/webdev-client",
      vercelUrl: "http://localhost:3000",
      probes: {
        async getHtml() {
          throw new Error("should not fetch localhost");
        },
      },
    });
    assert.equal(
      localhost.find((row) => row.id === "vercel-url")?.passed,
      false,
    );

    const auth = await runA1Checks({
      githubUrl: "https://github.com/jane-doe/webdev-client",
      vercelUrl: "https://protected.vercel.app",
      probes: {
        async getHtml() {
          return {
            ok: false,
            status: 401,
            code: "auth_wall",
            message: ASSIGNMENT_STUDENT_COPY.vercelAuthWall,
          };
        },
      },
    });
    const authOpen = auth.find((row) => row.id === "vercel-open");
    assert.equal(authOpen?.passed, false);
    assert.match(authOpen?.message ?? "", /Deployment Protection/i);

    const missing = await runA1Checks({
      githubUrl: "not-github",
      vercelUrl: "https://empty.vercel.app",
      probes: {
        async getHtml(url) {
          return { ok: true, status: 200, finalUrl: url, html: "<p>Hi</p>" };
        },
      },
    });
    assert.equal(missing.find((row) => row.id === "github-url")?.passed, false);
    assert.equal(missing.find((row) => row.id === "labs-markers")?.passed, false);
  });

  it("classifies 403 and Vercel SSO redirects as auth walls", () => {
    const classified = classifyDeployFetch({
      ok: true,
      status: 200,
      finalUrl: "https://vercel.com/login?next=https://x.vercel.app",
      html: "<html></html>",
    });
    assert.equal(classified.ok, false);
    if (!classified.ok) assert.equal(classified.code, "auth_wall");
  });
});

describe("assignment submission access and store", () => {
  it("lets rostered students and staff through; skips persist while impersonating", () => {
    assert.equal(supportsUrlSubmission("a1"), true);
    assert.equal(supportsUrlSubmission("a2"), false);
    assert.equal(canPersistAssignmentSubmission(true), false);
    assert.equal(canPersistAssignmentSubmission(false), true);

    assert.equal(
      assignmentSubmitAccess({
        signedIn: true,
        configured: true,
        isActualStaff: false,
        roster: {
          status: "matched",
          entry: { email: "jane.doe@northeastern.edu" },
        },
      }).ok,
      true,
    );
    assert.equal(
      assignmentSubmitAccess({
        signedIn: true,
        configured: true,
        isActualStaff: true,
        roster: { status: "not_on_roster" },
      }).ok,
      true,
    );
    assert.equal(
      assignmentSubmitAccess({
        signedIn: true,
        configured: true,
        isActualStaff: false,
        roster: { status: "not_on_roster" },
      }).ok,
      false,
    );
    const signedOut = assignmentSubmitAccess({
      signedIn: false,
      configured: true,
      isActualStaff: false,
      roster: { status: "empty" },
    });
    assert.equal(signedOut.ok, false);
    if (!signedOut.ok) assert.equal(signedOut.code, "unauthenticated");
  });

  it("upserts one document per clerk user + assignment and keeps createdAt", async () => {
    const store = memorySubmissionStore();
    const first = await upsertAssignmentSubmission(
      store,
      {
        clerkUserId: "user_1",
        assignmentId: "a1",
        githubUrl: "https://github.com/jane-doe/webdev-client",
        vercelUrl: "https://jane-a1.vercel.app",
        checkResults: [{ id: "vercel-url", label: "Vercel", passed: true, message: "ok" }],
        checked: true,
      },
      new Date("2026-09-05T12:00:00.000Z"),
    );
    const second = await upsertAssignmentSubmission(
      store,
      {
        clerkUserId: "user_1",
        assignmentId: "a1",
        githubUrl: "https://github.com/jane-doe/webdev-client",
        vercelUrl: "https://jane-a1-v2.vercel.app",
        checked: true,
      },
      new Date("2026-09-05T13:00:00.000Z"),
    );
    assert.equal(first.createdAt.toISOString(), second.createdAt.toISOString());
    assert.equal(second.vercelUrl, "https://jane-a1-v2.vercel.app");
    assert.equal(second.updatedAt.toISOString(), "2026-09-05T13:00:00.000Z");
    const loaded = await loadAssignmentSubmission(store, "user_1", "a1");
    assert.equal(loaded?.vercelUrl, second.vercelUrl);
    assert.equal(await loadAssignmentSubmission(store, "user_2", "a1"), null);
  });
});

describe("student-facing copy", () => {
  it("never names Clerk", () => {
    for (const value of Object.values(ASSIGNMENT_STUDENT_COPY)) {
      assert.doesNotMatch(value, /Clerk/i);
    }
  });
});
