import { addCourse, getCourses } from "../kambaz/store";

export async function GET() {
  return Response.json(getCourses());
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  return Response.json(addCourse(body), { status: 201 });
}
