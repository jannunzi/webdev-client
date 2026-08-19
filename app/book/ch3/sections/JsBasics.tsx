import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import VariablesAndConstants from "@/app/labs/lab3/VariablesAndConstants";
import VariableTypes from "@/app/labs/lab3/VariableTypes";
import BooleanVariables from "@/app/labs/lab3/BooleanVariables";
import IfElse from "@/app/labs/lab3/IfElse";
import TernaryOperator from "@/app/labs/lab3/TernaryOperator";
import ConditionalOutputIfElse from "@/app/labs/lab3/ConditionalOutputIfElse";
import ConditionalOutputInline from "@/app/labs/lab3/ConditionalOutputInline";
import NullUndefined from "@/app/labs/lab3/NullUndefined";

export default function JsBasics() {
  return (
    <>
      <Section
        level={3}
        id="sec-3-2-1"
        title="3.2.1 Variables and Constants"
      >
        <p>
          Variables hold application state — a username, a course id, a
          preference. JavaScript offers three declarations:{" "}
          <code>var</code>{" "}(function-scoped, the old default),{" "}
          <code>let</code>{" "}(block-scoped, the usual choice when the value
          will change), and <code>const</code>{" "}(block-scoped and not
          reassigned). Create <code>VariablesAndConstants.tsx</code>{" "}and
          import it from the Lab 3 page:
        </p>
        <CodeBlock
          language="tsx"
          name="VariablesAndConstants"
          file="app/labs/lab3/VariablesAndConstants.tsx"
        >{`export default function VariablesAndConstants() {
  var functionScoped = 2;
  let blockScoped = 5;
  const constant1 = functionScoped - blockScoped;
  return (
    <div id="wd-variables-and-constants">
      <h4>Variables and Constants</h4>
      functionScoped = {functionScoped}
      <br />
      blockScoped = {blockScoped}
      <br />
      constant1 = {constant1}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          Curly braces in JSX interpolate a JavaScript expression into the
          markup, so <code>{`{functionScoped}`}</code>{" "}prints{" "}
          <code>2</code>. The constant is the difference of the other two,
          so the page shows <code>-3</code>:
        </p>
        <LiveDemo
          name="VariablesAndConstants"
          file="app/labs/lab3/VariablesAndConstants.tsx"
        >
          <VariablesAndConstants />
        </LiveDemo>
        <p>
          Import the new component at the top of{" "}
          <code>page.tsx</code>{" "}and render it under the Lab 3 heading — the
          same import-and-place pattern you will repeat for every exercise
          in this chapter.
        </p>
        <p>
          <strong>On your own.</strong>{" "}Still in{" "}
          <code>VariablesAndConstants.tsx</code>, declare one more{" "}
          <code>let</code>{" "}and one more <code>const</code>{" "}(for example
          a name and a computed greeting) and interpolate both into the
          JSX so they appear under the existing values.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-3-2-2"
        title="3.2.2 Variable Types"
      >
        <p>
          JavaScript values carry a type: numbers (integers and floating
          point), strings, booleans, and others. The{" "}
          <code>typeof</code>{" "}operator reports that type as a string. Create{" "}
          <code>VariableTypes.tsx</code>{" "}and import it at the bottom of Lab
          3:
        </p>
        <CodeBlock
          language="tsx"
          name="VariableTypes"
          file="app/labs/lab3/VariableTypes.tsx"
        >{`export default function VariableTypes() {
  let numberVariable = 123;
  let floatingPointNumber = 234.345;
  let stringVariable = "Hello World!";
  let booleanVariable = true;
  let isNumber = typeof numberVariable;
  let isString = typeof stringVariable;
  let isBoolean = typeof booleanVariable;
  return (
    <div id="wd-variable-types">
      <h4>Variables Types</h4>
      numberVariable = {numberVariable}
      <br />
      floatingPointNumber = {floatingPointNumber}
      <br />
      stringVariable = {stringVariable}
      <br />
      booleanVariable = {booleanVariable + ""}
      <br />
      isNumber = {isNumber}
      <br />
      isString = {isString}
      <br />
      isBoolean = {isBoolean}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          JSX does not render a bare boolean —{" "}
          <code>{`{true}`}</code>{" "}produces nothing on the page. Concatenating
          an empty string, <code>booleanVariable + &quot;&quot;</code>,
          coerces the value to <code>&quot;true&quot;</code>{" "}or{" "}
          <code>&quot;false&quot;</code>{" "}so it is visible:
        </p>
        <LiveDemo name="VariableTypes" file="app/labs/lab3/VariableTypes.tsx">
          <VariableTypes />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}Add a second string and a second
          number, plus <code>typeof</code>{" "}for each, and display them in
          the same component.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-3-2-3"
        title="3.2.3 Boolean Variables"
      >
        <p>
          Booleans are the raw material of decisions:{" "}
          <code>&amp;&amp;</code>{" "}(and), <code>||</code>{" "}(or),{" "}
          <code>!</code>{" "}(not), and comparisons. Always compare with{" "}
          <code>===</code>{" "}and <code>!==</code>{" "}— they test value{" "}
          <em>and</em>{" "}type — not <code>==</code>, which coerces types and
          hides bugs. Create <code>BooleanVariables.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="BooleanVariables"
          file="app/labs/lab3/BooleanVariables.tsx"
        >{`export default function BooleanVariables() {
  let numberVariable = 123,
    floatingPointNumber = 234.345;
  let true1 = true,
    false1 = false;
  let false2 = true1 && false1;
  let true2 = true1 || false1;
  let true3 = !false2;
  let true4 = numberVariable === 123;
  let true5 = floatingPointNumber !== 321.432;
  let false3 = numberVariable < 100;
  return (
    <div id="wd-boolean-variables">
      <h4>Boolean Variables</h4>
      true1 = {true1 + ""}
      <br />
      false1 = {false1 + ""}
      <br />
      false2 = {false2 + ""}
      <br />
      true2 = {true2 + ""}
      <br />
      true3 = {true3 + ""}
      <br />
      true4 = {true4 + ""}
      <br />
      true5 = {true5 + ""}
      <br />
      false3 = {false3 + ""}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          Concatenate <code>+ &quot;&quot;</code>{" "}again so each boolean
          prints as text:
        </p>
        <LiveDemo
          name="BooleanVariables"
          file="app/labs/lab3/BooleanVariables.tsx"
        >
          <BooleanVariables />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}Add one more comparison that uses{" "}
          <code>===</code>{" "}(for example a string compared to another
          string) and display it the same way — then deliberately try{" "}
          <code>==</code>{" "}with <code>&quot;123&quot;</code>{" "}and{" "}
          <code>123</code>{" "}in the console so you see why{" "}
          <code>===</code>{" "}is the safer habit.
        </p>
      </Section>

      <Section level={3} id="sec-3-2-4" title="3.2.4 Conditionals">
        <p>
          A predicate is an expression that evaluates to true or false. An{" "}
          <code>if</code>/<code>else</code>{" "}chooses which block to run; in
          JSX you more often embed the choice in the tree itself. Create{" "}
          <code>IfElse.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="IfElse"
          file="app/labs/lab3/IfElse.tsx"
        >{`export default function IfElse() {
  let true1 = true,
    false1 = false;
  return (
    <div id="wd-if-else">
      <h4>If Else</h4>
      {true1 && <p>true1</p>}
      {!false1 ? <p>!false1</p> : <p>false1</p>}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          The <code>&amp;&amp;</code>{" "}form is a short circuit: if{" "}
          <code>true1</code>{" "}is true, React renders the paragraph; if it is
          false, the right-hand side never runs and nothing appears. The{" "}
          <code>?</code>/<code>:</code>{" "}form (the ternary, next section)
          always picks one of two branches:
        </p>
        <LiveDemo name="IfElse" file="app/labs/lab3/IfElse.tsx">
          <IfElse />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}Flip <code>true1</code>{" "}to{" "}
          <code>false</code>{" "}and confirm the first paragraph disappears,
          then restore it.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-3-2-5"
        title="3.2.5 Ternary Operator"
      >
        <p>
          A ternary is a compact <code>if</code>/<code>else</code>{" "}that
          yields a value. It takes three pieces: a predicate, a{" "}
          <code>?</code>, the value when the predicate is true, a{" "}
          <code>:</code>, and the value when it is false. Create{" "}
          <code>TernaryOperator.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="TernaryOperator"
          file="app/labs/lab3/TernaryOperator.tsx"
        >{`export default function TernaryOperator() {
  let loggedIn = true;
  return (
    <div id="wd-ternary-operator">
      <h4>Logged In</h4>
      {loggedIn ? <p>Welcome</p> : <p>Please login</p>}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          With <code>loggedIn</code>{" "}true, the page greets the user; set it
          to <code>false</code>{" "}and the other paragraph appears instead:
        </p>
        <LiveDemo
          name="TernaryOperator"
          file="app/labs/lab3/TernaryOperator.tsx"
        >
          <TernaryOperator />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}Set <code>loggedIn</code>{" "}to{" "}
          <code>false</code>{" "}and confirm the greeting switches to
          &quot;Please login&quot;, then set it back.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-3-2-6"
        title="3.2.6 Generating Conditional Output"
      >
        <p>
          The same logged-in decision can live in the component&apos;s{" "}
          <code>return</code>{" "}path — two different trees — or inline in
          one tree. Start with an <code>if</code>/<code>else</code>{" "}that
          returns a different heading:
        </p>
        <CodeBlock
          language="tsx"
          name="ConditionalOutputIfElse"
          file="app/labs/lab3/ConditionalOutputIfElse.tsx"
        >{`export default function ConditionalOutputIfElse() {
  const loggedIn = true;
  if (loggedIn) {
    return (
      <h2 id="wd-conditional-output-if-else-welcome">Welcome If Else</h2>
    );
  } else {
    return (
      <h2 id="wd-conditional-output-if-else-login">Please login If Else</h2>
    );
  }
}`}</CodeBlock>
        <LiveDemo
          name="ConditionalOutputIfElse"
          file="app/labs/lab3/ConditionalOutputIfElse.tsx"
        >
          <ConditionalOutputIfElse />
        </LiveDemo>
        <p>
          A more compact equivalent keeps a single{" "}
          <code>return</code>{" "}and short-circuits each heading with{" "}
          <code>&amp;&amp;</code>. Here <code>loggedIn</code>{" "}is{" "}
          <code>false</code>, so only the login heading appears:
        </p>
        <CodeBlock
          language="tsx"
          name="ConditionalOutputInline"
          file="app/labs/lab3/ConditionalOutputInline.tsx"
        >{`export default function ConditionalOutputInline() {
  const loggedIn = false;
  return (
    <div id="wd-conditional-output-inline">
      {loggedIn && <h2>Welcome Inline</h2>}
      {!loggedIn && <h2>Please login Inline</h2>}
    </div>
  );
}`}</CodeBlock>
        <LiveDemo
          name="ConditionalOutputInline"
          file="app/labs/lab3/ConditionalOutputInline.tsx"
        >
          <ConditionalOutputInline />
        </LiveDemo>
        <p>
          Import both components into Lab 3. The if/else version returns
          early; the inline version always returns one wrapper and includes
          whichever heading the flags allow.
        </p>
        <p>
          <strong>On your own.</strong>{" "}Swap the <code>loggedIn</code>{" "}
          constants in both files and confirm each heading pair flips,
          then restore the values shown above.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-3-2-7"
        title="3.2.7 Null vs Undefined"
      >
        <p>
          Two values mean &quot;no value,&quot; and they are not the same.{" "}
          <code>null</code>{" "}is an assigned empty value — you put it there
          on purpose. <code>undefined</code>{" "}means nothing was assigned:
          a missing property, a variable declared but not initialized, a
          function that did not <code>return</code>. Create{" "}
          <code>NullUndefined.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="NullUndefined"
          file="app/labs/lab3/NullUndefined.tsx"
        >{`export default function NullUndefined() {
  const nullValue = null;
  const undefinedValue = undefined;
  return (
    <div id="wd-null-undefined">
      <h4>Null vs Undefined</h4>
      nullValue = {String(nullValue)}
      <br />
      undefinedValue = {String(undefinedValue)}
      <br />
      typeof nullValue = {typeof nullValue}
      <br />
      typeof undefinedValue = {typeof undefinedValue}
      <br />
      String(null) = {String(null)}
      <br />
      String(undefined) = {String(undefined)}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          JSX renders neither <code>null</code>{" "}nor{" "}
          <code>undefined</code>{" "}— they vanish, the same way a boolean
          does. <code>String(...)</code>{" "}makes them visible. A famous
          JavaScript quirk: <code>typeof null</code>{" "}is{" "}
          <code>&quot;object&quot;</code>, while{" "}
          <code>typeof undefined</code>{" "}is{" "}
          <code>&quot;undefined&quot;</code>. Later,{" "}
          <SectionLink to="3.4.17" />{" "}uses <code>?.</code>{" "}and{" "}
          <code>??</code>{" "}so missing values do not crash the page:
        </p>
        <LiveDemo name="NullUndefined" file="app/labs/lab3/NullUndefined.tsx">
          <NullUndefined />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}In the browser console, compare{" "}
          <code>null == undefined</code>{" "}(true, because <code>==</code>{" "}
          coerces) with <code>null === undefined</code>{" "}(false). That is
          another reason this chapter sticks to <code>===</code>.
        </p>
      </Section>

      <Section level={3} id="sec-3-2-8" title="3.2.8 Exercises">
        <p>
          Confirm Lab 3 covers every JavaScript-basics topic in{" "}
          <SectionLink to="3.2" />. Import each component into{" "}
          <code>app/labs/lab3/page.tsx</code>{" "}in order. Complete each
          section&apos;s <strong>On your own</strong>{" "}prompt as well.
        </p>
        <ol>
          <li>
            Create <code>VariablesAndConstants.tsx</code>{" "}and import it
            (3.2.1).
          </li>
          <li>
            Create <code>VariableTypes.tsx</code>, import it, and coerce
            the boolean with <code>+ &quot;&quot;</code>{" "}(3.2.2).
          </li>
          <li>
            Create <code>BooleanVariables.tsx</code>{" "}and compare with{" "}
            <code>===</code>/<code>!==</code>{" "}(3.2.3).
          </li>
          <li>
            Create <code>IfElse.tsx</code>{" "}with short-circuit{" "}
            <code>&amp;&amp;</code>{" "}and a ternary (3.2.4).
          </li>
          <li>
            Create <code>TernaryOperator.tsx</code>{" "}for the logged-in
            greeting (3.2.5).
          </li>
          <li>
            Create <code>ConditionalOutputIfElse.tsx</code>{" "}and{" "}
            <code>ConditionalOutputInline.tsx</code>{" "}(3.2.6).
          </li>
          <li>
            Create <code>NullUndefined.tsx</code>{" "}and display both values
            with <code>String(...)</code>{" "}(3.2.7).
          </li>
        </ol>
      </Section>
    </>
  );
}
