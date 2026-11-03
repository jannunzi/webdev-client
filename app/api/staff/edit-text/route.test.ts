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

  it("opens a pull request on main instead of committing to it", async () => {
    const { fetchImpl, calls } = githubFetch(SOURCE);
    const response = await handleEditTextRequest(
      editRequest('Hi <slot data-i="0"></slot> there'),
      {
        staff: { email: "staff@example.com" },
        env: { ...env, VERCEL_GIT_COMMIT_REF: "main" },
        fetchImpl,
      },
    );
    assert.equal(response.status, 200);
    const body = (await response.json()) as { mode: string; url: string; branch: string };
    assert.equal(body.mode, "pr");
    assert.equal(body.url, "https://github.com/octo/web/pull/9");
    assert.match(body.branch, /^inline-edit\//);
    const pull = calls.find((call) => call.url.includes("/pulls"));
    assert.ok(pull);
    const pullBody = JSON.parse(pull.body) as { title: string; base: string; head: string };
    assert.equal(pullBody.title, `Inline edit: ${FILE}`);
    assert.equal(pullBody.base, "main");
    assert.equal(pullBody.head, body.branch);
    const put = calls.find((call) => call.method === "PUT");
    assert.ok(put);
    assert.notEqual(JSON.parse(put.body).branch, "main");
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
