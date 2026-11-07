import type { ParagraphStructure } from "./blocks";
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
  /**
   * Preview branch to commit on. Null on production, main, and local,
   * which commit straight to main.
   */
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

export async function publishInlineEdit(
  input: {
    config: GithubConfig;
    file: string;
    hash: string;
    html: string;
    email: string;
    structure?: ParagraphStructure;
    fetchImpl?: FetchLike;
  },
): Promise<PublishResult> {
  const fetchImpl = input.fetchImpl ?? fetch;
  const { config } = input;
  const branch = config.directBranch ?? "main";
  const message = commitMessage(input.email, input.file);
  let current = await readRepoFile(fetchImpl, config, input.file, branch);
  if (!current.ok) return current;
  let replaced = replaceEditableSource(
    current.source,
    input.file,
    input.hash,
    input.html,
    input.structure,
  );
  if (!replaced.ok) return { ok: false, status: 409, error: replaced.error };
  if (replaced.unchanged) return { ok: true, mode: "unchanged" };

  let wrote = await writeRepoFile(fetchImpl, config, {
    file: input.file,
    source: replaced.source,
    sha: current.sha,
    branch,
    message,
  });
  if (wrote.ok) return { ok: true, mode: "commit", branch };
  if (wrote.status !== 409) return wrote;

  current = await readRepoFile(fetchImpl, config, input.file, branch);
  if (!current.ok) return current;
  replaced = replaceEditableSource(
    current.source,
    input.file,
    input.hash,
    input.html,
    input.structure,
  );
  if (!replaced.ok) {
    return {
      ok: false,
      status: 409,
      error:
        "The file changed and this text no longer matches. Reload the page and try again.",
    };
  }
  if (replaced.unchanged) return { ok: true, mode: "unchanged" };
  wrote = await writeRepoFile(fetchImpl, config, {
    file: input.file,
    source: replaced.source,
    sha: current.sha,
    branch,
    message,
  });
  if (wrote.ok) return { ok: true, mode: "commit", branch };
  return {
    ok: false,
    status: 409,
    error: "The file changed while saving. Reload the page and try again.",
  };
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
      status: result.status === 409 ? 409 : 502,
      error:
        result.status === 409
          ? "The file changed while saving."
          : githubMessage(result.body, "GitHub didn't accept the edit."),
    };
  }
  return { ok: true };
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
