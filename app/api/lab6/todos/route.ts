import { lab6Todos } from "../store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const completed = searchParams.get("completed");
  let todos = lab6Todos();
  if (completed === "true" || completed === "false") {
    const flag = completed === "true";
    todos = todos.filter((t) => t.completed === flag);
  }
  return Response.json(todos);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    title?: string;
    completed?: boolean;
    description?: string;
  };
  const todo = {
    _id: crypto.randomUUID(),
    title: body.title ?? "New todo",
    completed: Boolean(body.completed),
    description: body.description ?? "",
  };
  lab6Todos().push(todo);
  return Response.json(todo, { status: 201 });
}
