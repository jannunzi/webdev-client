import { replaceEditableSource } from "./replace";

export type Env = Record<string, string | undefined>;

export type FetchLike = (
  input: string,
  init?: RequestInit,
) => Promise<Response>;

export type GithubConfig = {
  token: string;
  owner: string;
  repo: string;
  /** Set on a Vercel preview branch. Null on production, main, and local. */
  directBranch: string | null;
};

type GithubBody = {
  message?: unknown;
  content?: unknown;
  sha?: unknown;
  encoding?: unknown;
  object?: { sha?: unknown };
  commit?: { sha?: unknown };
  html_url?: unknown;
  number?: unknown;
};

export type PublishResult =
  | {
      ok: true;
      mode: "commit" | "pr" | "unchanged";
      branch?: string;
      url?: string;
      number?: number;
    }
  | { ok: false; status: number; error: string };

export function githubConfigFromEnv(
  env: Env,
): { ok: true; config: GithubConfig } | { ok: false; status: number; error: string } {
  const token = env.GITHUB_EDIT_TOKEN?.trim() ?? "";
  if (!token) {
    return {
      ok: false,
      status: 500,
      error:
        "GITHUB_EDIT_TOKEN is not set. Add it in the Vercel project settings for Production and Preview.",
    };
  }
  const owner =
    env.VERCEL_GIT_REPO_OWNER?.trim() ||
    env.GITHUB_EDIT_OWNER?.trim() ||
    "jannunzi";
  const repo =
    env.VERCEL_GIT_REPO_SLUG?.trim() ||
    env.GITHUB_EDIT_REPO?.trim() ||
    "webdev-client";
  if (!/^[A-Za-z0-9_.-]+$/.test(owner) || !/^[A-Za-z0-9_.-]+$/.test(repo)) {
    return { ok: false, status: 500, error: "The GitHub repo coordinates are not valid." };
  }
  const ref = env.VERCEL_GIT_COMMIT_REF?.trim() ?? "";
  return {
    ok: true,
    config: {
      token,
      owner,
      repo,
      directBranch: ref && ref !== "main" ? ref : null,
    },
  };
}

export function commitMessage(email: string, file: string): string {
  return `Inline edit by ${email} in ${file}`;
}

export function pullTitle(file: string): string {
  return `Inline edit: ${file}`;
}

export async function publishInlineEdit(
  input: {
    config: GithubConfig;
    file: string;
    hash: string;
    html: string;
    email: string;
    fetchImpl?: FetchLike;
  },
): Promise<PublishResult> {
  const fetchImpl = input.fetchImpl ?? fetch;
  const { config } = input;
  const baseRef = config.directBranch ?? "main";
  const current = await readRepoFile(fetchImpl, config, input.file, baseRef);
  if (!current.ok) return current;
  const replaced = replaceEditableSource(
    current.source,
    input.file,
    input.hash,
    input.html,
  );
  if (!replaced.ok) return { ok: false, status: 409, error: replaced.error };
  if (replaced.unchanged) return { ok: true, mode: "unchanged" };

  const message = commitMessage(input.email, input.file);
  if (config.directBranch) {
    const wrote = await writeRepoFile(fetchImpl, config, {
      file: input.file,
      source: replaced.source,
      sha: current.sha,
      branch: config.directBranch,
      message,
    });
    if (!wrote.ok) return wrote;
    return { ok: true, mode: "commit", branch: config.directBranch };
  }

  const main = await readRef(fetchImpl, config, "main");
  if (!main.ok) return main;
  const branch = newBranchName(input.file);
  const created = await createBranch(fetchImpl, config, branch, main.sha);
  if (!created.ok) return created;
  const wrote = await writeRepoFile(fetchImpl, config, {
    file: input.file,
    source: replaced.source,
    sha: current.sha,
    branch,
    message,
  });
  if (!wrote.ok) return wrote;
  const pr = await openPull(fetchImpl, config, {
    title: pullTitle(input.file),
    head: branch,
    base: "main",
    body: `Staff inline edit of \`${input.file}\`.\n\nThe in-page editor replaced one static text node and left the rest of the file as it was.`,
  });
  if (!pr.ok) return pr;
  return { ok: true, mode: "pr", branch, url: pr.url, number: pr.number };
}

function newBranchName(file: string): string {
  const slug = file
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
  const stamp = Date.now().toString(36);
  const extra = Math.random().toString(36).slice(2, 6);
  return `inline-edit/${slug}-${stamp}${extra}`;
}

async function readRepoFile(
  fetchImpl: FetchLike,
  config: GithubConfig,
  file: string,
  ref: string,
): Promise<
  | { ok: true; source: string; sha: string }
  | { ok: false; status: number; error: string }
> {
  const result = await github(fetchImpl, config, contentsUrl(config, file, ref));
  if (!result.ok) {
    return {
      ok: false,
      status: 502,
      error: githubMessage(result.body, "The source file couldn't be read from GitHub."),
    };
  }
  const content = typeof result.body?.content === "string" ? result.body.content : "";
  const sha = typeof result.body?.sha === "string" ? result.body.sha : "";
  if (!content || !sha) {
    return { ok: false, status: 502, error: "GitHub didn't return the file contents." };
  }
  return {
    ok: true,
    source: Buffer.from(content.replace(/\s/g, ""), "base64").toString("utf8"),
    sha,
  };
}

async function writeRepoFile(
  fetchImpl: FetchLike,
  config: GithubConfig,
  input: { file: string; source: string; sha: string; branch: string; message: string },
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const result = await github(fetchImpl, config, contentsUrl(config, input.file), {
    method: "PUT",
    body: JSON.stringify({
      message: input.message,
      content: Buffer.from(input.source, "utf8").toString("base64"),
      sha: input.sha,
      branch: input.branch,
    }),
  });
  if (!result.ok) {
    return {
      ok: false,
      status: 502,
      error: githubMessage(result.body, "GitHub didn't accept the edit."),
    };
  }
  return { ok: true };
}

async function readRef(
  fetchImpl: FetchLike,
  config: GithubConfig,
  branch: string,
): Promise<{ ok: true; sha: string } | { ok: false; status: number; error: string }> {
  const result = await github(
    fetchImpl,
    config,
    repoUrl(config, `/git/ref/heads/${branch.split("/").map(encodeURIComponent).join("/")}`),
  );
  const sha = result.body?.object?.sha;
  if (!result.ok || typeof sha !== "string") {
    return {
      ok: false,
      status: 502,
      error: githubMessage(result.body, "The main branch couldn't be read from GitHub."),
    };
  }
  return { ok: true, sha };
}

async function createBranch(
  fetchImpl: FetchLike,
  config: GithubConfig,
  branch: string,
  sha: string,
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const result = await github(fetchImpl, config, repoUrl(config, "/git/refs"), {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha }),
  });
  if (!result.ok) {
    return {
      ok: false,
      status: 502,
      error: githubMessage(result.body, "GitHub didn't create the edit branch."),
    };
  }
  return { ok: true };
}

async function openPull(
  fetchImpl: FetchLike,
  config: GithubConfig,
  input: { title: string; head: string; base: string; body: string },
): Promise<
  { ok: true; url: string; number: number } | { ok: false; status: number; error: string }
> {
  const result = await github(fetchImpl, config, repoUrl(config, "/pulls"), {
    method: "POST",
    body: JSON.stringify(input),
  });
  const url = typeof result.body?.html_url === "string" ? result.body.html_url : "";
  const number = typeof result.body?.number === "number" ? result.body.number : 0;
  if (!result.ok || !url) {
    return {
      ok: false,
      status: 502,
      error: githubMessage(result.body, "GitHub didn't open the edit pull request."),
    };
  }
  return { ok: true, url, number };
}

function repoUrl(config: GithubConfig, path: string): string {
  return `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}${path}`;
}

function contentsUrl(config: GithubConfig, file: string, ref?: string): string {
  const encoded = file.split("/").map(encodeURIComponent).join("/");
  const url = new URL(repoUrl(config, `/contents/${encoded}`));
  if (ref) url.searchParams.set("ref", ref);
  return url.toString();
}

async function github(
  fetchImpl: FetchLike,
  config: GithubConfig,
  url: string,
  init?: RequestInit,
): Promise<{ ok: boolean; status: number; body: GithubBody | null }> {
  const response = await fetchImpl(url, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${config.token}`,
      "User-Agent": "webdev-inline-edit",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  const text = await response.text();
  let body: GithubBody | null = null;
  if (text) {
    try {
      body = JSON.parse(text) as GithubBody;
    } catch {
      body = { message: text.slice(0, 180) };
    }
  }
  return { ok: response.ok, status: response.status, body };
}

function githubMessage(body: GithubBody | null, fallback: string): string {
  const message = typeof body?.message === "string" ? body.message : "";
  const safe = message.replace(/gh[pousr]_[A-Za-z0-9_]+/g, "[token]").slice(0, 180);
  return safe ? `GitHub: ${safe}` : fallback;
}
