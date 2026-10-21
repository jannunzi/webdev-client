type User = {
  username: string;
  email?: string;
  address?: { city: string };
};

function describe(value: string | number | null): string {
  if (value === null) return "nothing";
  if (typeof value === "number") return `the number ${value.toFixed(1)}`;
  return `the text "${value.toUpperCase()}"`;
}

export default function Narrowing() {
  const alice: User = { username: "alice", address: { city: "Boston" } };
  const bob: User = { username: "bob" };
  const nickname: string | undefined = undefined;
  return (
    <div id="wd-narrowing">
      <h4>Null, Undefined, and Narrowing</h4>
      describe(null) = {describe(null)} <br />
      describe(7) = {describe(7)} <br />
      describe(&quot;hi&quot;) = {describe("hi")} <br />
      alice.address?.city = {alice.address?.city} <br />
      bob.address?.city ?? &quot;unknown&quot; ={" "}
      {bob.address?.city ?? "unknown"} <br />
      nickname ?? &quot;none&quot; = {nickname ?? "none"}
      <hr />
    </div>
  );
}
