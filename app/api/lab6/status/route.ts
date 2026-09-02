import { mongoStatus } from "../store";

export async function GET() {
  return Response.json(mongoStatus());
}
