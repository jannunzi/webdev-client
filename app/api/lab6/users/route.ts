import { lab6Users } from "../store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");
  const name = searchParams.get("name");
  let users = lab6Users();
  if (role) {
    users = users.filter((u) => u.role === role);
  } else if (name) {
    const q = name.toLowerCase();
    users = users.filter(
      (u) =>
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q),
    );
  }
  return Response.json(users);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, string>;
  const users = lab6Users();
  const user = {
    _id: crypto.randomUUID(),
    username: body.username ?? `newuser${Date.now()}`,
    password: body.password ?? "password123",
    firstName: body.firstName ?? "New",
    lastName: body.lastName ?? `User ${users.length + 1}`,
    email: body.email ?? `email${users.length + 1}@neu.edu`,
    role: body.role ?? "STUDENT",
    loginId: body.loginId ?? "",
    section: body.section ?? "S101",
    lastActivity: body.lastActivity ?? "",
    totalActivity: body.totalActivity ?? "",
  };
  users.push(user);
  return Response.json(user, { status: 201 });
}
