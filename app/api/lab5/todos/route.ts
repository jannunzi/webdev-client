import { addTodo, getTodos } from "./store";

export async function GET() {
  return Response.json(getTodos());
}

export async function POST(request: Request) {
  const body = (await request.json()) as { title?: string };
  const title = body.title?.trim();
  if (!title) {
    return Response.json({ error: "title is required" }, { status: 400 });
  }
  return Response.json(addTodo(title), { status: 201 });
}
