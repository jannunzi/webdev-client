import { lab6Todos } from "../../store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const todo = lab6Todos().find((t) => t._id === id);
  if (!todo) {
    return Response.json({ message: "Todo not found" }, { status: 404 });
  }
  return Response.json(todo);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const todos = lab6Todos();
  const index = todos.findIndex((t) => t._id === id);
  if (index < 0) {
    return Response.json({ message: "Todo not found" }, { status: 404 });
  }
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  todos[index] = { ...todos[index], ...body, _id: id };
  return Response.json(todos[index]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const todos = lab6Todos();
  const index = todos.findIndex((t) => t._id === id);
  if (index >= 0) todos.splice(index, 1);
  return Response.json({ deletedCount: index >= 0 ? 1 : 0 });
}
