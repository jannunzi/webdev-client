import {
  deleteCourse,
  getCourse,
  updateCourse,
  type Course,
} from "../../kambaz/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const course = getCourse(id);
  if (!course) {
    return Response.json({ error: "Course not found" }, { status: 404 });
  }
  return Response.json(course);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as Course;
  const updated = updateCourse({ ...body, _id: id });
  if (!updated) {
    return Response.json({ error: "Course not found" }, { status: 404 });
  }
  return Response.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const deleted = deleteCourse(id);
  if (!deleted) {
    return Response.json({ error: "Course not found" }, { status: 404 });
  }
  return Response.json(deleted);
}
