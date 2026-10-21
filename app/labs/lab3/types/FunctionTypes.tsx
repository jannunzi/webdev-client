function add(a: number, b: number): number {
  return a + b;
}

const fullName = (first: string, last?: string): string =>
  last ? `${first} ${last}` : first;

const greet = (name: string = "World"): string => `Hello ${name}`;

function logMessage(message: string): void {
  console.log(message);
}

type Operation = (a: number, b: number) => number;
const multiply: Operation = (a, b) => a * b;

export default function FunctionTypes() {
  logMessage("FunctionTypes rendered");
  return (
    <div id="wd-function-types">
      <h4>Function Types</h4>
      add(2, 3) = {add(2, 3)} <br />
      fullName(&quot;Alice&quot;) = {fullName("Alice")} <br />
      fullName(&quot;Alice&quot;, &quot;Wonderland&quot;) ={" "}
      {fullName("Alice", "Wonderland")} <br />
      greet() = {greet()} <br />
      multiply(4, 5) = {multiply(4, 5)}
      <hr />
    </div>
  );
}
