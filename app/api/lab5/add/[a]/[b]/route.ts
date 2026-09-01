export async function GET(
  _request: Request,
  { params }: { params: Promise<{ a: string; b: string }> },
) {
  const { a, b } = await params;
  const left = Number(a);
  const right = Number(b);
  return Response.json({
    a: left,
    b: right,
    sum: left + right,
  });
}
