import type { NextRequest } from "next/server";

export async function GET(_request: NextRequest) {
  return Response.json({ message: "Hello from Lab 5 API!" });
}
