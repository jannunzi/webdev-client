import { lab6Users } from "../../store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = lab6Users().find((u) => u._id === id);
  if (!user) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }
  return Response.json(user);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const users = lab6Users();
  const index = users.findIndex((u) => u._id === id);
  if (index < 0) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }
  const body = (await request.json().catch(() => ({}))) as Record<string, string>;
  users[index] = { ...users[index], ...body, _id: id };
  return Response.json(users[index]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const users = lab6Users();
  const index = users.findIndex((u) => u._id === id);
  if (index >= 0) users.splice(index, 1);
  return Response.json({ deletedCount: index >= 0 ? 1 : 0 });
}
