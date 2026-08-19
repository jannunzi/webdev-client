import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import LegacyFunctions from "@/app/labs/lab3/LegacyFunctions";
import ArrowFunctions from "@/app/labs/lab3/ArrowFunctions";
import ImpliedReturn from "@/app/labs/lab3/ImpliedReturn";
import TemplateLiterals from "@/app/labs/lab3/TemplateLiterals";

export default function Functions() {
  return (
    <Section id="sec-3-3" title="3.3 JavaScript Functions">
      <p>
        Markup repeats; functions reuse. Wrap an algorithm in a named,
        parameterized block and call it from JSX the same way you call it
        from any other JavaScript. The language carries two styles from its
        history. The older ES5 form is:
      </p>
      <CodeBlock language="ts">{`function <functionName>(<parameterList>) {
  <functionBody>
}`}</CodeBlock>
      <p>
        Create <code>LegacyFunctions.tsx</code>, import it into Lab 3, and
        confirm the sum prints both as a stored result and as a call
        inlined in JSX:
      </p>
      <CodeBlock
        language="tsx"
        name="LegacyFunctions"
        file="app/labs/lab3/LegacyFunctions.tsx"
      >{`function add(a: number, b: number) {
  return a + b;
}

export default function LegacyFunctions() {
  const twoPlusFour = add(2, 4);
  console.log(twoPlusFour);
  return (
    <div id="wd-legacy-functions">
      <h4>Functions</h4>
      <h5>Legacy ES5 functions</h5>
      twoPlusFour = {twoPlusFour}
      <br />
      add(2, 4) = {add(2, 4)}
      <hr />
    </div>
  );
}`}</CodeBlock>
      <p>
        The TypeScript annotations <code>a: number</code>{" "}and{" "}
        <code>b: number</code>{" "}are compile-time only. The{" "}
        <code>console.log</code>{" "}writes to the browser console — you will
        inspect that output in <SectionLink to="3.4.12" />:
      </p>
      <LiveDemo
        name="LegacyFunctions"
        file="app/labs/lab3/LegacyFunctions.tsx"
      >
        <LegacyFunctions />
      </LiveDemo>
      <p>
        <strong>On your own.</strong>{" "}Add a <code>function subtract</code>{" "}
        in the same file, call it with two numbers, and interpolate the
        result under the existing sum.
      </p>

      <Section
        level={3}
        id="sec-3-3-1"
        title="3.3.1 Arrow Functions"
      >
        <p>
          ES6 added a shorter function syntax — the{" "}
          <strong>arrow function</strong> — that you will use for almost
          every callback in this course (<code>map</code>, event handlers,
          predicates). The name is optional; you typically store the
          function in a <code>const</code>. Create{" "}
          <code>ArrowFunctions.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="ArrowFunctions"
          file="app/labs/lab3/ArrowFunctions.tsx"
        >{`const subtract = (a: number, b: number) => {
  return a - b;
};

export default function ArrowFunctions() {
  const threeMinusOne = subtract(3, 1);
  console.log(threeMinusOne);
  return (
    <div id="wd-arrow-functions">
      <h4>New ES6 arrow functions</h4>
      threeMinusOne = {threeMinusOne}
      <br />
      subtract(3, 1) = {subtract(3, 1)}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          The <code>=&gt;</code>{" "}replaces the <code>function</code>{" "}
          keyword. Parameters still sit in parentheses; the body still sits
          in curly braces when it needs a <code>return</code>:
        </p>
        <LiveDemo
          name="ArrowFunctions"
          file="app/labs/lab3/ArrowFunctions.tsx"
        >
          <ArrowFunctions />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}Declare an arrow{" "}
          <code>const add</code>{" "}in the same file and display{" "}
          <code>add(2, 4)</code>{" "}next to the subtraction.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-3-3-2"
        title="3.3.2 Implied Return"
      >
        <p>
          When the body is a single expression, ES6 lets you drop the curly
          braces and the <code>return</code>{" "}— the expression{" "}
          <em>is</em>{" "}the return value. Create{" "}
          <code>ImpliedReturn.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="ImpliedReturn"
          file="app/labs/lab3/ImpliedReturn.tsx"
        >{`export default function ImpliedReturn() {
  const multiply = (a: number, b: number) => a * b;
  const fourTimesFive = multiply(4, 5);
  console.log(fourTimesFive);
  return (
    <div id="wd-implied-return">
      <h4>Implied return</h4>
      fourTimesFive = {fourTimesFive}
      <br />
      multiply(4, 5) = {multiply(4, 5)}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          <code>(a, b) =&gt; a * b</code>{" "}is the same as{" "}
          <code>{`(a, b) => { return a * b; }`}</code>. That one-liner is
          the shape you will pass into <code>map</code>{" "}and{" "}
          <code>filter</code>{" "}in <SectionLink to="3.4" />:
        </p>
        <LiveDemo
          name="ImpliedReturn"
          file="app/labs/lab3/ImpliedReturn.tsx"
        >
          <ImpliedReturn />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}Add an implied-return{" "}
          <code>const square = (n: number) =&gt; n * n</code>{" "}and display{" "}
          <code>square(9)</code>.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-3-3-3"
        title="3.3.3 Template Literals"
      >
        <p>
          Building strings with <code>+</code>{" "}gets noisy as soon as you
          mix numbers, variables, and punctuation. A{" "}
          <strong>template literal</strong> is a string in backticks that
          can embed any expression inside <code>{`\${…}`}</code> — including
          a ternary. Create <code>TemplateLiterals.tsx</code>. Do not hard-code
          the results; interpolate the variables:
        </p>
        <CodeBlock
          language="tsx"
          name="TemplateLiterals"
          file="app/labs/lab3/TemplateLiterals.tsx"
        >{`export default function TemplateLiterals() {
  const five = 2 + 3;
  const result1 = "2 + 3 = " + five;
  const result2 = \`2 + 3 = \${2 + 3}\`;
  const username = "alice";
  const greeting1 = \`Welcome home \${username}\`;
  const loggedIn = false;
  const greeting2 = \`Logged in: \${loggedIn ? "Yes" : "No"}\`;
  return (
    <div id="wd-template-literals">
      <h4>Template Literals</h4>
      result1 = {result1}
      <br />
      result2 = {result2}
      <br />
      greeting1 = {greeting1}
      <br />
      greeting2 = {greeting2}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          <code>result1</code>{" "}and <code>result2</code>{" "}print the same
          text; the backtick form is the one you will keep using. Wrap the
          output in a <code>div</code>{" "}whose id is{" "}
          <code>wd-template-literals</code>:
        </p>
        <LiveDemo
          name="TemplateLiterals"
          file="app/labs/lab3/TemplateLiterals.tsx"
        >
          <TemplateLiterals />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}Add a template that embeds your
          name and a ternary (for example whether a course is published)
          and interpolate that string into the same component.
        </p>
      </Section>

      <Section level={3} id="sec-3-3-4" title="3.3.4 Exercises">
        <p>
          Confirm Lab 3 covers every function topic in{" "}
          <SectionLink to="3.3" />. Import each component into{" "}
          <code>page.tsx</code>{" "}in order.
        </p>
        <ol>
          <li>
            Create <code>LegacyFunctions.tsx</code>{" "}with an ES5{" "}
            <code>function add</code>{" "}(3.3).
          </li>
          <li>
            Create <code>ArrowFunctions.tsx</code>{" "}with{" "}
            <code>const subtract = (a, b) =&gt; {"{ … }"}</code>{" "}(3.3.1).
          </li>
          <li>
            Create <code>ImpliedReturn.tsx</code>{" "}with{" "}
            <code>(a, b) =&gt; a * b</code>{" "}(3.3.2).
          </li>
          <li>
            Create <code>TemplateLiterals.tsx</code>{" "}using backticks and{" "}
            <code>{`\${}`}</code>, not hardcoded result strings (3.3.3).
          </li>
        </ol>
      </Section>
    </Section>
  );
}
