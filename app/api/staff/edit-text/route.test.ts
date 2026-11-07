import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { handleEditTextRequest } from "../../../../lib/inline-edit/handle-edit.ts";
import { uniqueEditable } from "../../../../lib/inline-edit/locate.ts";
import type { FetchLike } from "../../../../lib/inline-edit/github.ts";

const FILE = "app/book/ch2/sections/Intro.tsx";
const SOURCE = `export function Intro() {
  return <p className="lead">Hello <ChapterLink to={1} /> world</p>;
}
`;

function hashFor(source: string): string {
  const node = uniqueEditable(source, FILE)[0];
  assert.ok(node);
  return node.hash;
}

function response(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function githubFetch(source: string) {
  const calls: { url: string; method: string; body: string; authorization: string }[] = [];
  const fetchImpl: FetchLike = async (url, init) => {
    const headers = new Headers(init?.headers);
    calls.push({
      url,
      method: init?.method ?? "GET",
      body: typeof init?.body === "string" ? init.body : "",
      authorization: headers.get("authorization") ?? "",
    });
    if (url.includes("/contents/") && (init?.method ?? "GET") === "GET") {
      return response({
        content: Buffer.from(source).toString("base64"),
        sha: "file-sha",
        encoding: "base64",
      });
    }
    if (url.includes("/contents/") && init?.method === "PUT") {
      return response({ content: { sha: "next" }, commit: { sha: "commit-sha" } });
    }
    if (url.includes("/git/ref/heads/main")) {
      return response({ object: { sha: "main-sha" } });
    }
    if (url.includes("/git/refs") && init?.method === "POST") {
      return response({ ref: "refs/heads/inline-edit/x", object: { sha: "main-sha" } });
    }
    if (url.includes("/pulls") && init?.method === "POST") {
      return response({ html_url: "https://github.com/octo/web/pull/9", number: 9 });
    }
    return response({ message: "missing" }, 404);
  };
  return { fetchImpl, calls };
}

function editRequest(html: string, hash = hashFor(SOURCE)) {
  return new Request("http://localhost/api/staff/edit-text", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ file: FILE, hash, html }),
  });
}

const env = {
  GITHUB_EDIT_TOKEN: "test-token",
  VERCEL_GIT_REPO_OWNER: "octo",
  VERCEL_GIT_REPO_SLUG: "web",
};

describe("POST /api/staff/edit-text", () => {
  it("rejects a caller who is not staff", async () => {
    const { fetchImpl, calls } = githubFetch(SOURCE);
    const response = await handleEditTextRequest(editRequest("Hi"), {
      staff: { error: "Staff only.", status: 403 },
      env,
      fetchImpl,
    });
    assert.equal(response.status, 403);
    const body = (await response.json()) as { error: string };
    assert.equal(body.error, "Staff only.");
    assert.equal(calls.length, 0);
  });

  it("refuses to guess when the paragraph is not a unique static element", async () => {
    const { fetchImpl } = githubFetch(SOURCE);
    const response = await handleEditTextRequest(
      editRequest("Hi", "a".repeat(24)),
      { staff: { email: "staff@example.com" }, env, fetchImpl },
    );
    assert.equal(response.status, 409);
    const body = (await response.json()) as { error: string };
    assert.match(body.error, /wasn't found|more than once/);
  });

  it("commits a preview-branch edit with the staff email and does not open a PR", async () => {
    const { fetchImpl, calls } = githubFetch(SOURCE);
    const response = await handleEditTextRequest(
      editRequest('Hi <slot data-i="0"></slot> there'),
      {
        staff: { email: "staff@example.com" },
        env: { ...env, VERCEL_GIT_COMMIT_REF: "preview-branch" },
        fetchImpl,
      },
    );
    assert.equal(response.status, 200);
    const body = (await response.json()) as { ok: boolean; mode: string; branch: string };
    assert.equal(body.ok, true);
    assert.equal(body.mode, "commit");
    assert.equal(body.branch, "preview-branch");
    const put = calls.find((call) => call.method === "PUT");
    assert.ok(put);
    const payload = JSON.parse(put.body) as { message: string; branch: string; content: string };
    assert.equal(payload.branch, "preview-branch");
    assert.equal(payload.message, `Inline edit by staff@example.com in ${FILE}`);
    assert.equal(put.authorization, "Bearer test-token");
    const written = Buffer.from(payload.content, "base64").toString("utf8");
    assert.match(written, /<ChapterLink to=\{1\} \/>/);
    assert.match(written, /\{"Hi "\}/);
    assert.equal(calls.some((call) => call.url.includes("/pulls")), false);
    assert.equal(
      calls.some((call) => call.method === "PUT" && JSON.parse(call.body).branch === "main"),
      false,
    );
  });

  it("commits directly to main on production and when the ref is main", async () => {
    for (const ref of ["main", undefined] as const) {
      const { fetchImpl, calls } = githubFetch(SOURCE);
      const response = await handleEditTextRequest(
        editRequest('Hi <slot data-i="0"></slot> there'),
        {
          staff: { email: "staff@example.com" },
          env: ref ? { ...env, VERCEL_GIT_COMMIT_REF: ref } : env,
          fetchImpl,
        },
      );
      assert.equal(response.status, 200);
      const body = (await response.json()) as { mode: string; branch: string };
      assert.equal(body.mode, "commit");
      assert.equal(body.branch, "main");
      const put = calls.find((call) => call.method === "PUT");
      assert.ok(put);
      const payload = JSON.parse(put.body) as { branch: string; message: string };
      assert.equal(payload.branch, "main");
      assert.equal(payload.message, `Inline edit by staff@example.com in ${FILE}`);
      assert.equal(calls.some((call) => call.url.includes("/pulls")), false);
      assert.equal(calls.some((call) => call.url.includes("/git/refs")), false);
    }
  });

  it("retries a sha conflict once when the edited region still matches", async () => {
    const drifted = `// comment added elsewhere\n${SOURCE}`;
    let gets = 0;
    let puts = 0;
    const fetchImpl: FetchLike = async (url, init) => {
      const method = init?.method ?? "GET";
      if (url.includes("/contents/") && method === "GET") {
        gets += 1;
        const source = gets === 1 ? SOURCE : drifted;
        return response({
          content: Buffer.from(source).toString("base64"),
          sha: gets === 1 ? "sha-1" : "sha-2",
          encoding: "base64",
        });
      }
      if (url.includes("/contents/") && method === "PUT") {
        puts += 1;
        const payload = JSON.parse(String(init?.body)) as { sha: string; branch: string; content: string };
        if (puts === 1) {
          assert.equal(payload.sha, "sha-1");
          return response({ message: "sha conflict" }, 409);
        }
        assert.equal(payload.sha, "sha-2");
        assert.equal(payload.branch, "main");
        const written = Buffer.from(payload.content, "base64").toString("utf8");
        assert.match(written, /comment added elsewhere/);
        assert.match(written, /\{"Hi "\}/);
        return response({ commit: { sha: "commit-sha" } });
      }
      return response({ message: "missing" }, 404);
    };
    const saved = await handleEditTextRequest(
      editRequest('Hi <slot data-i="0"></slot> there'),
      {
        staff: { email: "staff@example.com" },
        env: { ...env, VERCEL_GIT_COMMIT_REF: "main" },
        fetchImpl,
      },
    );
    assert.equal(saved.status, 200);
    const body = (await saved.json()) as { mode: string; branch: string };
    assert.equal(body.mode, "commit");
    assert.equal(body.branch, "main");
    assert.equal(gets, 2);
    assert.equal(puts, 2);
  });

  it("stops after a sha conflict when the edited region no longer matches", async () => {
    const changed = SOURCE.replace("Hello", "Goodbye");
    let gets = 0;
    let puts = 0;
    const fetchImpl: FetchLike = async (url, init) => {
      const method = init?.method ?? "GET";
      if (url.includes("/contents/") && method === "GET") {
        gets += 1;
        const source = gets === 1 ? SOURCE : changed;
        return response({
          content: Buffer.from(source).toString("base64"),
          sha: `sha-${gets}`,
          encoding: "base64",
        });
      }
      if (url.includes("/contents/") && method === "PUT") {
        puts += 1;
        return response({ message: "sha conflict" }, 409);
      }
      return response({ message: "missing" }, 404);
    };
    const saved = await handleEditTextRequest(
      editRequest('Hi <slot data-i="0"></slot> there'),
      {
        staff: { email: "staff@example.com" },
        env: { ...env, VERCEL_GIT_COMMIT_REF: "main" },
        fetchImpl,
      },
    );
    assert.equal(saved.status, 409);
    const body = (await saved.json()) as { error: string };
    assert.match(body.error, /no longer matches/);
    assert.equal(gets, 2);
    assert.equal(puts, 1);
  });

  it("commits a removed paragraph and an inserted list without an instruction", async () => {
    const source = `export function Page() {
  return (
    <section id="sec-1-1">
      <h2 id="intro">Title</h2>
      <p>Hello <code>HTML</code> there.</p>
      <p>Neighbor stays.</p>
    </section>
  );
}
`;
    const paragraph = uniqueEditable(source, FILE).find(
      (node) => node.kind === "jsx" && source.slice(node.start, node.end).includes("HTML"),
    );
    assert.ok(paragraph);
    const { fetchImpl, calls } = githubFetch(source);
    const response = await handleEditTextRequest(
      new Request("http://localhost/api/staff/edit-text", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          file: FILE,
          hash: paragraph.hash,
          html: 'Hello <slot data-i="0"></slot> there. <div data-ai-instruction="1">Create a list of terms introduced in this section</div>',
          insertsAfter: [
            {
              kind: "ul",
              items: ["<strong>HTML</strong> — the markup language."],
            },
          ],
        }),
      }),
      {
        staff: { email: "staff@example.com" },
        env: { ...env, VERCEL_GIT_COMMIT_REF: "main" },
        fetchImpl,
      },
    );
    assert.equal(response.status, 200);
    const body = (await response.json()) as { mode: string; branch: string };
    assert.equal(body.mode, "commit");
    assert.equal(body.branch, "main");
    const put = calls.find((call) => call.method === "PUT");
    assert.ok(put);
    const payload = JSON.parse(put.body) as { branch: string; content: string };
    assert.equal(payload.branch, "main");
    const written = Buffer.from(payload.content, "base64").toString("utf8");
    assert.match(written, /<code>HTML<\/code>/);
    assert.match(written, /<ul>/);
    assert.match(written, /<strong>\{"HTML"\}<\/strong>/);
    assert.match(written, /Neighbor stays/);
    assert.match(written, /id="intro"/);
    assert.doesNotMatch(written, /Create a list of terms/);
    assert.doesNotMatch(written, /data-ai-instruction/);
  });

  it("does not write when a caller who is not staff removes a paragraph", async () => {
    const { fetchImpl, calls } = githubFetch(SOURCE);
    const response = await handleEditTextRequest(
      new Request("http://localhost/api/staff/edit-text", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ file: FILE, hash: hashFor(SOURCE), html: "", remove: true }),
      }),
      { staff: { error: "Staff only.", status: 403 }, env, fetchImpl },
    );
    assert.equal(response.status, 403);
    assert.equal(calls.length, 0);
  });

  it("tells staff to set GITHUB_EDIT_TOKEN when it is missing", async () => {
    const denied = await handleEditTextRequest(editRequest("Hi"), {
      staff: { email: "staff@example.com" },
      env: {},
      fetchImpl: async () => response({}),
    });
    assert.equal(denied.status, 500);
    const body = (await denied.json()) as { error: string };
    assert.match(body.error, /GITHUB_EDIT_TOKEN/);
    assert.doesNotMatch(body.error, /test-token/);
  });
});
