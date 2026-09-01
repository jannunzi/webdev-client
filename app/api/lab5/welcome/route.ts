import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name") ?? "World";
  return Response.json({ message: `Welcome, ${name}` });
}
