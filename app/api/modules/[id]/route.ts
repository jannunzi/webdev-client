import {
  deleteModule,
  getModule,
  updateModule,
  type CourseModule,
} from "../../kambaz/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const module = getModule(id);
  if (!module) {
    return Response.json({ error: "Module not found" }, { status: 404 });
  }
  return Response.json(module);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as CourseModule;
  const updated = updateModule({ ...body, _id: id });
  if (!updated) {
    return Response.json({ error: "Module not found" }, { status: 404 });
  }
  return Response.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const deleted = deleteModule(id);
  if (!deleted) {
    return Response.json({ error: "Module not found" }, { status: 404 });
  }
  return Response.json(deleted);
}
