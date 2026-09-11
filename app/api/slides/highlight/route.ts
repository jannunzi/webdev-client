import { highlightLectureCodeBlock } from "@/lib/code-block/highlight-lecture";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const row = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const code = typeof row.code === "string" ? row.code : "";
  const language = typeof row.language === "string" ? row.language : "tsx";
  const file = typeof row.file === "string" ? row.file : undefined;
  const highlighted = await highlightLectureCodeBlock({
    code,
    language,
    file,
  });
  return Response.json({ html: highlighted.html ?? "" });
}
