import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const a = parseFloat(request.nextUrl.searchParams.get("a") ?? "");
  const b = parseFloat(request.nextUrl.searchParams.get("b") ?? "");
  const operation = request.nextUrl.searchParams.get("operation");
  if (Number.isNaN(a) || Number.isNaN(b)) {
    return Response.json({ error: "Invalid numbers" }, { status: 400 });
  }
  let result: number;
  switch (operation) {
    case "add":
      result = a + b;
      break;
    case "subtract":
      result = a - b;
      break;
    case "multiply":
      result = a * b;
      break;
    case "divide":
      result = b === 0 ? Number.NaN : a / b;
      break;
    default:
      return Response.json({ error: "Invalid operation" }, { status: 400 });
  }
  if (Number.isNaN(result)) {
    return Response.json({ error: "Invalid operation" }, { status: 400 });
  }
  return Response.json({ a, b, operation, result });
}
