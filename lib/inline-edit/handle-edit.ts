import { githubConfigFromEnv, publishInlineEdit, type Env, type FetchLike } from "./github";
import { isAllowedEditFile, SOURCE_HASH_RE } from "./source-hash";

export type StaffGate =
  | { email: string }
  | { error: string; status: number };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_HTML = 100_000;

export async function handleEditTextRequest(
  request: Request,
  options: {
    staff: StaffGate;
    env: Env;
    fetchImpl?: FetchLike;
  },
): Promise<Response> {
  if ("error" in options.staff) {
    return Response.json(
      { ok: false, error: options.staff.error },
      { status: options.staff.status },
    );
  }
  const email = options.staff.email.trim();
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return Response.json({ ok: false, error: "Staff only." }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }
  const body = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const file = typeof body.file === "string" ? body.file : "";
  const hash = typeof body.hash === "string" ? body.hash : "";
  const html = typeof body.html === "string" ? body.html : "";
  if (!isAllowedEditFile(file) || file.length > 240) {
    return Response.json(
      { ok: false, error: "That file can't be edited from the book or slides." },
      { status: 400 },
    );
  }
  if (!SOURCE_HASH_RE.test(hash)) {
    return Response.json(
      { ok: false, error: "This paragraph isn't located in the source." },
      { status: 400 },
    );
  }
  if (!html || html.length > MAX_HTML) {
    return Response.json(
      { ok: false, error: "The edited text is empty or too long." },
      { status: 400 },
    );
  }

  const config = githubConfigFromEnv(options.env);
  if (!config.ok) {
    return Response.json({ ok: false, error: config.error }, { status: config.status });
  }
  const published = await publishInlineEdit({
    config: config.config,
    file,
    hash,
    html,
    email,
    fetchImpl: options.fetchImpl,
  });
  if (!published.ok) {
    return Response.json(
      { ok: false, error: published.error },
      { status: published.status },
    );
  }
  return Response.json({
    ok: true,
    mode: published.mode,
    branch: published.branch,
    url: published.url,
    number: published.number,
  });
}
