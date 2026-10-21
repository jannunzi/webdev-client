function lengthOf(value: unknown): number {
  if (typeof value === "string") return value.length;
  if (Array.isArray(value)) return value.length;
  return 0;
}

export default function AnyVsUnknown() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anything: any = "hello";
  const parsed: unknown = JSON.parse('{"name": "Alice"}');
  const name =
    typeof parsed === "object" && parsed !== null && "name" in parsed
      ? String(parsed.name)
      : "unknown";
  return (
    <div id="wd-any-vs-unknown">
      <h4>any vs unknown</h4>
      anything.toUpperCase() = {anything.toUpperCase()} <br />
      lengthOf(&quot;hello&quot;) = {lengthOf("hello")} <br />
      lengthOf([1, 2, 3]) = {lengthOf([1, 2, 3])} <br />
      lengthOf(42) = {lengthOf(42)} <br />
      parsed name = {name}
      <hr />
    </div>
  );
}
