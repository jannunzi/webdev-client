import type { NextRequest } from "next/server";
import { addModule, getModules } from "../kambaz/store";

export async function GET(request: NextRequest) {
  const course = request.nextUrl.searchParams.get("course") ?? undefined;
  return Response.json(getModules(course));
}

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string; course?: string };
  if (!body.name?.trim() || !body.course) {
    return Response.json(
      { error: "name and course are required" },
      { status: 400 },
    );
  }
  return Response.json(
    addModule({ name: body.name.trim(), course: body.course }),
    { status: 201 },
  );
}
