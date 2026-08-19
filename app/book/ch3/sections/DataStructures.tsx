import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import BookFigure from "../../components/BookFigure";
import FigureLink from "../../components/FigureLink";
import SimpleArrays from "@/app/labs/lab3/SimpleArrays";
import ArrayIndexAndLength from "@/app/labs/lab3/ArrayIndexAndLength";
import AddingAndRemovingToFromArrays from "@/app/labs/lab3/AddingAndRemovingToFromArrays";
import ForLoops from "@/app/labs/lab3/ForLoops";
import MapFunction from "@/app/labs/lab3/MapFunction";
import FindFunction from "@/app/labs/lab3/FindFunction";
import FindIndex from "@/app/labs/lab3/FindIndex";
import FilterFunction from "@/app/labs/lab3/FilterFunction";
import JsonStringify from "@/app/labs/lab3/JsonStringify";
import House from "@/app/labs/lab3/House";
import Spreader from "@/app/labs/lab3/Spreader";
import Destructing from "@/app/labs/lab3/Destructing";
import FunctionDestructing from "@/app/labs/lab3/FunctionDestructing";
import DestructingImports from "@/app/labs/lab3/DestructingImports";
import IncludesSomeEvery from "@/app/labs/lab3/IncludesSomeEvery";
import ReduceFunction from "@/app/labs/lab3/ReduceFunction";
import OptionalChaining from "@/app/labs/lab3/OptionalChaining";

export default function DataStructures() {
  return (
    <Section id="sec-3-4" title="3.4 JavaScript Data Structures">
      <p>
        Numbers, strings, and booleans combine into arrays and objects —
        the structures Kambaz will use for courses, modules, and people.
        An array groups values into one variable. The values can be mixed
        types (you rarely want that) or JSX elements (you often want that).
        Create <code>SimpleArrays.tsx</code>:
      </p>
      <CodeBlock
        language="tsx"
        name="SimpleArrays"
        file="app/labs/lab3/SimpleArrays.tsx"
      >{`export default function SimpleArrays() {
  var functionScoped = 2;
  let blockScoped = 5;
  const constant1 = functionScoped - blockScoped;
  let numberArray1 = [1, 2, 3, 4, 5];
  let stringArray1 = ["string1", "string2"];
  let htmlArray1 = [
    <li key={1}>Buy milk</li>,
    <li key={2}>Feed the pets</li>,
  ];
  let variableArray1 = [
    functionScoped,
    blockScoped,
    constant1,
    numberArray1,
    stringArray1,
  ];
  return (
    <div id="wd-simple-arrays">
      <h4>Simple Arrays</h4>
      numberArray1 = {numberArray1}
      <br />
      stringArray1 = {stringArray1}
      <br />
      variableArray1 = {variableArray1}
      <br />
      Todo list:
      <ol>{htmlArray1}</ol>
      <hr />
    </div>
  );
}`}</CodeBlock>
      <p>
        JSX interpolates an array of numbers or strings without commas —
        handy once the items are HTML. Each <code>li</code>{" "}in{" "}
        <code>htmlArray1</code>{" "}carries a <code>key</code>. React uses that
        key to match list items across renders; without it, the console
        warns and updates can reuse the wrong DOM node. Prefer a stable id
        from your data. Here the keys are <code>1</code>{" "}and{" "}
        <code>2</code>{" "}because the list is static:
      </p>
      <LiveDemo name="SimpleArrays" file="app/labs/lab3/SimpleArrays.tsx">
        <SimpleArrays />
      </LiveDemo>
      <p>
        <strong>On your own.</strong>{" "}Push a third <code>li</code>{" "}onto{" "}
        <code>htmlArray1</code>{" "}with its own <code>key</code>{" "}and confirm
        the ordered list grows.
      </p>

      <Section
        level={3}
        id="sec-3-4-1"
        title="3.4.1 Array Index and Length"
      >
        <p>
          <code>length</code>{" "}is the number of items.{" "}
          <code>indexOf(value)</code>{" "}returns the first index of that
          value, or <code>-1</code>{" "}if it is missing. Create{" "}
          <code>ArrayIndexAndLength.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="ArrayIndexAndLength"
          file="app/labs/lab3/ArrayIndexAndLength.tsx"
        >{`export default function ArrayIndexAndLength() {
  let numberArray1 = [1, 2, 3, 4, 5];
  const length1 = numberArray1.length;
  const index1 = numberArray1.indexOf(3);
  return (
    <div id="wd-array-index-and-length">
      <h4>Array index and length</h4>
      length1 = {length1}
      <br />
      index1 = {index1}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          Five items, and <code>3</code>{" "}sits at index <code>2</code>{" "}
          (arrays are zero-based):
        </p>
        <LiveDemo
          name="ArrayIndexAndLength"
          file="app/labs/lab3/ArrayIndexAndLength.tsx"
        >
          <ArrayIndexAndLength />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}Display{" "}
          <code>numberArray1.indexOf(9)</code>{" "}and confirm it is{" "}
          <code>-1</code>.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-3-4-2"
        title="3.4.2 Adding and Removing From Arrays"
      >
        <p>
          Unlike many languages, JavaScript arrays grow and shrink.{" "}
          <code>push</code>{" "}appends; <code>splice(start, deleteCount)</code>{" "}
          removes (or inserts) at an index. Create{" "}
          <code>AddingAndRemovingToFromArrays.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="AddingAndRemovingToFromArrays"
          file="app/labs/lab3/AddingAndRemovingToFromArrays.tsx"
        >{`export default function AddingAndRemovingToFromArrays() {
  let numberArray1 = [1, 2, 3, 4, 5];
  let stringArray1 = ["string1", "string2"];
  let todoArray = [
    <li key={1}>Buy milk</li>,
    <li key={2}>Feed the pets</li>,
  ];
  numberArray1.push(6);
  stringArray1.push("string3");
  todoArray.push(<li key={3}>Walk the dogs</li>);
  numberArray1.splice(2, 1);
  stringArray1.splice(1, 1);
  return (
    <div id="wd-adding-removing-from-arrays">
      <h4>Add/remove to/from arrays</h4>
      numberArray1 = {numberArray1}
      <br />
      stringArray1 = {stringArray1}
      <br />
      Todo list:
      <ol>{todoArray}</ol>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          After a push and a splice, the number array is{" "}
          <code>1, 2, 4, 5, 6</code>{" "}— the <code>3</code>{" "}at index 2 is
          gone, and <code>6</code>{" "}was appended first. Each new{" "}
          <code>li</code>{" "}still needs its own <code>key</code>:
        </p>
        <LiveDemo
          name="AddingAndRemovingToFromArrays"
          file="app/labs/lab3/AddingAndRemovingToFromArrays.tsx"
        >
          <AddingAndRemovingToFromArrays />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}<code>push</code>{" "}one more todo
          with a new key, then <code>splice</code>{" "}the first item, and
          confirm the list on screen matches.
        </p>
      </Section>

      <Section level={3} id="sec-3-4-3" title="3.4.3 For Loops">
        <p>
          A <code>for</code>{" "}loop visits every index. Build a new array
          inside the loop rather than mutating the source. Create{" "}
          <code>ForLoops.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="ForLoops"
          file="app/labs/lab3/ForLoops.tsx"
        >{`export default function ForLoops() {
  let stringArray1 = ["string1", "string3"];
  let stringArray2: string[] = [];
  for (let i = 0; i < stringArray1.length; i++) {
    const string1 = stringArray1[i];
    stringArray2.push(string1.toUpperCase());
  }
  return (
    <div id="wd-for-loops">
      <h4>Looping through arrays</h4>
      stringArray2 = {stringArray2}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          The TypeScript annotation <code>string[]</code>{" "}tells the compiler
          the empty array will hold strings. The result is{" "}
          <code>STRING1STRING3</code>{" "}(JSX still omits commas):
        </p>
        <LiveDemo name="ForLoops" file="app/labs/lab3/ForLoops.tsx">
          <ForLoops />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}Build a third array of lowercased
          copies in the same loop (or a second loop) and display it.
        </p>
      </Section>

      <Section level={3} id="sec-3-4-4" title="3.4.4 Map Function">
        <p>
          <code>map</code>{" "}is the loop you will actually write in React: it
          walks an array, applies a function to each item, and returns a{" "}
          <em>new</em>{" "}array of the results. Create{" "}
          <code>MapFunction.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="MapFunction"
          file="app/labs/lab3/MapFunction.tsx"
        >{`export default function MapFunction() {
  let numberArray1 = [1, 2, 3, 4, 5, 6];
  const square = (a: number) => a * a;
  const todos = ["Buy milk", "Feed the pets"];
  const squares = numberArray1.map(square);
  const cubes = numberArray1.map((a) => a * a * a);
  return (
    <div id="wd-map-function">
      <h4>Map Function</h4>
      squares = {squares}
      <br />
      cubes = {cubes}
      <br />
      Todos:
      <ol>
        {todos.map((todo) => (
          <li key={todo}>{todo}</li>
        ))}
      </ol>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          The first <code>map</code>{" "}passes a named function; the second
          inlines an implied-return arrow. Mapping to JSX is how Kambaz
          will turn a courses array into cards. Give each sibling a{" "}
          <code>key</code>{" "}— here the todo string is unique, so{" "}
          <code>key={"{todo}"}</code>{" "}works. When two titles could collide,
          use a real id from the data instead:
        </p>
        <LiveDemo name="MapFunction" file="app/labs/lab3/MapFunction.tsx">
          <MapFunction />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}Add a third string to{" "}
          <code>todos</code>{" "}and confirm the ordered list grows — the{" "}
          <code>key</code>{" "}must stay unique.
        </p>
      </Section>

      <Section level={3} id="sec-3-4-5" title="3.4.5 Find Function">
        <p>
          <code>find</code>{" "}returns the <em>first</em>{" "}element whose
          predicate is true, or <code>undefined</code>{" "}if none match. The
          predicate is an arrow that receives the current item. Create{" "}
          <code>FindFunction.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="FindFunction"
          file="app/labs/lab3/FindFunction.tsx"
        >{`export default function FindFunction() {
  let numberArray1 = [1, 2, 3, 4, 5];
  let stringArray1 = ["string1", "string2", "string3"];
  const four = numberArray1.find((a) => a === 4);
  const string3 = stringArray1.find((a) => a === "string3");
  return (
    <div id="wd-find-function">
      <h4>Find Function</h4>
      four = {four}
      <br />
      string3 = {string3}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <LiveDemo name="FindFunction" file="app/labs/lab3/FindFunction.tsx">
          <FindFunction />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}<code>find</code>{" "}a value that is
          not in the array and display the result — it should be empty on
          the page because JSX hides <code>undefined</code>. Wrap it in{" "}
          <code>String(...)</code>{" "}if you want to see the word
          &quot;undefined&quot;.
        </p>
      </Section>

      <Section level={3} id="sec-3-4-6" title="3.4.6 Find Index">
        <p>
          <code>findIndex</code>{" "}is <code>find</code>{" "}that returns a
          position instead of the element — or <code>-1</code>{" "}when the
          predicate never matches. Create <code>FindIndex.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="FindIndex"
          file="app/labs/lab3/FindIndex.tsx"
        >{`export default function FindIndex() {
  let numberArray1 = [1, 2, 4, 5, 6];
  let stringArray1 = ["string1", "string3"];
  const fourIndex = numberArray1.findIndex((a) => a === 4);
  const string3Index = stringArray1.findIndex((a) => a === "string3");
  return (
    <div id="wd-find-index">
      <h4>Find Index Function</h4>
      fourIndex = {fourIndex}
      <br />
      string3Index = {string3Index}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          <code>4</code>{" "}is at index <code>2</code>.{" "}
          <code>&quot;string3&quot;</code>{" "}is at index <code>1</code>:
        </p>
        <LiveDemo name="FindIndex" file="app/labs/lab3/FindIndex.tsx">
          <FindIndex />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}Display{" "}
          <code>numberArray1.findIndex((a) =&gt; a === 3)</code>{" "}— there is
          no <code>3</code>{" "}in this array, so the index is{" "}
          <code>-1</code>.
        </p>
      </Section>

      <Section level={3} id="sec-3-4-7" title="3.4.7 Filter Function">
        <p>
          <code>filter</code>{" "}keeps every item whose predicate is true and
          returns them as a new array — the tool Kambaz will use to show
          only the modules (or assignments, or people) for the current
          course. Create <code>FilterFunction.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="FilterFunction"
          file="app/labs/lab3/FilterFunction.tsx"
        >{`export default function FilterFunction() {
  let numberArray1 = [1, 2, 4, 5, 6];
  const numbersGreaterThan2 = numberArray1.filter((a) => a > 2);
  const evenNumbers = numberArray1.filter((a) => a % 2 === 0);
  const oddNumbers = numberArray1.filter((a) => a % 2 !== 0);
  return (
    <div id="wd-filter-function">
      <h4>Filter Function</h4>
      numbersGreaterThan2 = {numbersGreaterThan2}
      <br />
      evenNumbers = {evenNumbers}
      <br />
      oddNumbers = {oddNumbers}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <LiveDemo
          name="FilterFunction"
          file="app/labs/lab3/FilterFunction.tsx"
        >
          <FilterFunction />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}Filter numbers greater than or equal
          to <code>5</code>{" "}into a new constant and display it.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-3-4-8"
        title="3.4.8 Includes, some, and every"
      >
        <p>
          Three more array questions, each returning a boolean.{" "}
          <code>includes(value)</code>{" "}asks whether the value is present.{" "}
          <code>some(predicate)</code>{" "}asks whether <em>at least one</em>{" "}
          item passes. <code>every(predicate)</code>{" "}asks whether{" "}
          <em>all</em>{" "}items pass. Create{" "}
          <code>IncludesSomeEvery.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="IncludesSomeEvery"
          file="app/labs/lab3/IncludesSomeEvery.tsx"
        >{`export default function IncludesSomeEvery() {
  const numbers = [1, 2, 3, 4, 5];
  const includes3 = numbers.includes(3);
  const includes8 = numbers.includes(8);
  const someGreaterThan4 = numbers.some((n) => n > 4);
  const everyGreaterThan0 = numbers.every((n) => n > 0);
  return (
    <div id="wd-includes-some-every">
      <h4>Includes, Some, Every</h4>
      includes(3) = {includes3 + ""}
      <br />
      includes(8) = {includes8 + ""}
      <br />
      some(n &gt; 4) = {someGreaterThan4 + ""}
      <br />
      every(n &gt; 0) = {everyGreaterThan0 + ""}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          Coerce the booleans with <code>+ &quot;&quot;</code>{" "}again so they
          print. Kambaz people-table enrollment checks will use{" "}
          <code>some</code>{" "}the same way:
        </p>
        <LiveDemo
          name="IncludesSomeEvery"
          file="app/labs/lab3/IncludesSomeEvery.tsx"
        >
          <IncludesSomeEvery />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}Display{" "}
          <code>numbers.every((n) =&gt; n &gt; 4)</code>{" "}— it should be
          false — and <code>numbers.some((n) =&gt; n === 1)</code>.
        </p>
      </Section>

      <Section level={3} id="sec-3-4-9" title="3.4.9 Reduce">
        <p>
          <code>reduce</code>{" "}folds an array down to one value: a running
          total, a concatenated string, a grouped object. The callback
          receives the accumulator and the current item; the second
          argument to <code>reduce</code>{" "}is the starting accumulator.
          Create <code>ReduceFunction.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="ReduceFunction"
          file="app/labs/lab3/ReduceFunction.tsx"
        >{`export default function ReduceFunction() {
  const numbers = [1, 2, 3, 4, 5];
  const sum = numbers.reduce((total, n) => total + n, 0);
  return (
    <div id="wd-reduce-function">
      <h4>Reduce Function</h4>
      sum = {sum}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          Starting from <code>0</code>, the callback adds each{" "}
          <code>n</code>, so the sum is <code>15</code>:
        </p>
        <LiveDemo
          name="ReduceFunction"
          file="app/labs/lab3/ReduceFunction.tsx"
        >
          <ReduceFunction />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}Reduce the same array to a product
          (start the accumulator at <code>1</code>) and display it.
        </p>
      </Section>

      <Section level={3} id="sec-3-4-10" title="3.4.10 JSON Stringify">
        <p>
          <strong>JSON</strong>{" "}(JavaScript Object Notation) is the text
          format APIs and files use to ship data. The global{" "}
          <code>JSON</code>{" "}object provides <code>stringify</code>{" "}
          (value to text) and <code>parse</code>{" "}(text to value). JSX
          prints arrays without brackets or commas;{" "}
          <code>JSON.stringify</code>{" "}puts them back so you can see the
          real structure. Create <code>JsonStringify.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="JsonStringify"
          file="app/labs/lab3/JsonStringify.tsx"
        >{`export default function JsonStringify() {
  const squares = [1, 4, 16, 25, 36];
  return (
    <div id="wd-json-stringify">
      <h3>JSON Stringify</h3>
      squares = {JSON.stringify(squares)}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <LiveDemo name="JsonStringify" file="app/labs/lab3/JsonStringify.tsx">
          <JsonStringify />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}Stringify a small object (for
          example <code>{`{ course: "RS101", credits: 4 }`}</code>) and
          display it next to the array.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-3-4-11"
        title="3.4.11 JavaScript Objects"
      >
        <p>
          An <strong>object</strong> groups named properties. Values can be
          numbers, strings, arrays, or nested objects. Curly braces around
          <code>key: value</code>{" "}pairs are an object literal. Create{" "}
          <code>House.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="House"
          file="app/labs/lab3/House.tsx"
        >{`export default function House() {
  const house = {
    bedrooms: 4,
    bathrooms: 2.5,
    squareFeet: 2000,
    address: {
      street: "Via Roma",
      city: "Roma",
      state: "RM",
      zip: "00100",
      country: "Italy",
    },
    owners: ["Alice", "Bob"],
  };
  console.log(house);
  return (
    <div id="wd-house">
      <h4>House</h4>
      <h5>bedrooms</h5>
      {house.bedrooms}
      <h5>bathrooms</h5>
      {house.bathrooms}
      <h5>Data</h5>
      <pre>{JSON.stringify(house, null, 2)}</pre>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          Dot notation reads a property: <code>house.bedrooms</code>,{" "}
          <code>house.address.city</code>. The pretty-printed{" "}
          <code>&lt;pre&gt;</code>{" "}uses the optional second and third
          arguments to <code>stringify</code>{" "}— a replacer (here{" "}
          <code>null</code>) and an indent width of <code>2</code>.{" "}
          <code>console.log(house)</code>{" "}prints that tree in the
          Console tab — the next subsection:
        </p>
        <LiveDemo name="House" file="app/labs/lab3/House.tsx">
          <House />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}Add a <code>yearBuilt</code>{" "}
          property and interpolate it under bathrooms.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-3-4-12"
        title="3.4.12 Writing to the Console"
      >
        <p>
          DevTools&apos; Elements tab showed the DOM in{" "}
          <SectionLink to="1.3.1" />. Functions and objects need the{" "}
          <strong>Console</strong>{" "}tab as well — a place to print values
          without putting them on the page. Right-click the Lab 3 page and
          choose Inspect. Click the Console tab — empty until your scripts
          write to it (
          <FigureLink to="3.4.12a" />
          ):
        </p>
        <BookFigure
          id="fig-3.4.12a"
          src="/images/book/ch3/figures/fig-3-9-1a-console.png"
          alt="Chrome DevTools Console tab, empty"
          caption="Figure 3.4.12a — Console tab"
        />
        <p>
          Add <code>console.log(&quot;Hello World!&quot;)</code>{" "}at the
          top of the Lab 3 function, reload, and confirm the string
          appears in the console:
        </p>
        <CodeBlock language="tsx">{`export default function Lab3() {
  console.log("Hello World!");
  return (
    <div id="wd-lab3">
      <h2>Lab 3</h2>
      {/* ...lab components... */}
    </div>
  );
}`}</CodeBlock>
        <p>
          Objects print as expandable trees.{" "}
          <code>House.tsx</code>{" "}already logs the house. Reload Lab 3,
          find that log, and expand <code>address</code>{" "}and{" "}
          <code>owners</code>{" "}(
          <FigureLink to="3.4.12c" />
          ):
        </p>
        <BookFigure
          id="fig-3.4.12c"
          src="/images/book/ch3/figures/fig-3-9-1c-house.png"
          alt="House object logged in the DevTools console"
          caption="Figure 3.4.12c — House object in the console"
        />
        <p>
          <strong>On your own.</strong>{" "}Log <code>house.owners</code>{" "}
          from <code>House.tsx</code>{" "}and confirm the two-string array
          appears in the console.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-3-4-13"
        title="3.4.13 Spread Operator"
      >
        <p>
          The spread operator <code>...</code>{" "}copies the items of an array
          (or the properties of an object) into a new literal. Later
          properties win if a name collides — that is how you clone an
          object and override one field. Create <code>Spreader.tsx</code>{" "}
          (the function inside is named <code>Spreading</code>, matching the
          lab file):
        </p>
        <CodeBlock
          language="tsx"
          name="Spreading"
          file="app/labs/lab3/Spreader.tsx"
        >{`export default function Spreading() {
  const arr1 = [1, 2, 3];
  const arr2 = [...arr1, 4, 5, 6];
  const obj1 = { a: 1, b: 2, c: 3 };
  const obj2 = { ...obj1, d: 4, e: 5, f: 6 };
  const obj3 = { ...obj1, b: 4 };
  return (
    <div id="wd-spreading">
      <h2>Spread Operator</h2>
      <h3>Array Spread</h3>
      arr1 = {JSON.stringify(arr1)}
      <br />
      arr2 = {JSON.stringify(arr2)}
      <br />
      <h3>Object Spread</h3>
      {JSON.stringify(obj1)}
      <br />
      {JSON.stringify(obj2)}
      <br />
      {JSON.stringify(obj3)}
      <br />
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          <code>obj3.b</code>{" "}is <code>4</code>, not <code>2</code> — the
          later <code>b: 4</code>{" "}overrides the copy from{" "}
          <code>obj1</code>:
        </p>
        <LiveDemo name="Spreading" file="app/labs/lab3/Spreader.tsx">
          <Spreader />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}Build <code>obj4</code>{" "}by spreading{" "}
          <code>obj2</code>{" "}and overriding <code>a</code>, then stringify
          it.
        </p>
      </Section>

      <Section level={3} id="sec-3-4-14" title="3.4.14 Destructing">
        <p>
          Spread copies outward. <strong>Destructuring</strong> unpacks
          inward: object properties by name, array items by position. The
          lab file is named <code>Destructing.tsx</code>{" "}— the spelling used
          in the original assignment — but the operation in prose is
          destructuring. Create that component:
        </p>
        <CodeBlock
          language="tsx"
          name="Destructing"
          file="app/labs/lab3/Destructing.tsx"
        >{`export default function Destructing() {
  const person = { name: "John", age: 25 };
  const { name, age } = person;
  const numbers = ["one", "two", "three"];
  const [first, second, third] = numbers;
  return (
    <div id="wd-destructing">
      <h2>Destructing</h2>
      <h3>Object Destructing</h3>
      const &#123; name, age &#125; = &#123; name: "John", age: 25 &#125;
      <br />
      <br />
      name = {name}
      <br />
      age = {age}
      <h3>Array Destructing</h3>
      const [first, second, third] = ["one","two","three"]
      <br />
      <br />
      first = {first}
      <br />
      second = {second}
      <br />
      third = {third}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          <code>{`const { name, age } = person`}</code>{" "}is the same as{" "}
          <code>const name = person.name</code>{" "}and{" "}
          <code>const age = person.age</code>. Array destructuring is the
          same as <code>numbers[0]</code>, <code>numbers[1]</code>,{" "}
          <code>numbers[2]</code>:
        </p>
        <LiveDemo name="Destructing" file="app/labs/lab3/Destructing.tsx">
          <Destructing />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}Destructure a fourth array item
          (add <code>&quot;four&quot;</code>{" "}to the array first) or a
          third object property, and display it.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-3-4-15"
        title="3.4.15 Function Destructing"
      >
        <p>
          React components receive props as one object. Destructuring that
          object in the parameter list is the usual way to name each prop.
          Create <code>FunctionDestructing.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="FunctionDestructing"
          file="app/labs/lab3/FunctionDestructing.tsx"
        >{`export default function FunctionDestructing() {
  const add = (a: number, b: number) => a + b;
  const sum = add(1, 2);
  const subtract = ({ a, b }: { a: number; b: number }) => a - b;
  const difference = subtract({ a: 4, b: 2 });
  return (
    <div id="wd-function-destructing">
      <h2>Function Destructing</h2>
      const add = (a, b) =&gt; a + b;
      <br />
      const sum = add(1, 2);
      <br />
      const subtract = (&#123; a, b &#125;) =&gt; a - b;
      <br />
      const difference = subtract(&#123; a: 4, b: 2 &#125;);
      <br />
      sum = {sum}
      <br />
      difference = {difference}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          <code>add</code>{" "}takes two numbers. <code>subtract</code>{" "}takes
          one object and unpacks <code>a</code>{" "}and <code>b</code>{" "}from
          it — the same shape as{" "}
          <code>{`function Add({ a, b }: { a: number; b: number })`}</code>{" "}
          in <SectionLink to="3.7" />:
        </p>
        <p>
          Parameters can also carry a <strong>default</strong>:{" "}
          <code>{`(name = "Ada") => name`}</code>{" "}uses{" "}
          <code>&quot;Ada&quot;</code>{" "}when the caller omits the argument.
          Destructured props work the same way —{" "}
          <code>{`{ a, b = 0 }`}</code> — which{" "}
          <SectionLink to="3.7.4" />{" "}uses for a default todo.
        </p>
        <LiveDemo
          name="FunctionDestructing"
          file="app/labs/lab3/FunctionDestructing.tsx"
        >
          <FunctionDestructing />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}Add a <code>multiply</code>{" "}arrow
          that destructures <code>{`{ a, b }`}</code>{" "}and display the
          product. Then add a <code>greet</code>{" "}arrow with a default{" "}
          <code>name = &quot;Ada&quot;</code>{" "}and interpolate a call with
          no argument.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-3-4-16"
        title="3.4.16 Destructing Imports"
      >
        <p>
          Modules export values; importers unpack them. Build a tiny{" "}
          <code>Math.ts</code>{" "}library with named exports and a default
          object, then import it three ways in{" "}
          <code>DestructingImports.tsx</code>:
        </p>
        <CodeBlock
          language="ts"
          name="Math"
          file="app/labs/lab3/Math.ts"
        >{`export function add(a: number, b: number): number {
  return a + b;
}
export function subtract(a: number, b: number): number {
  return a - b;
}
export function multiply(a: number, b: number): number {
  return a * b;
}
export function divide(a: number, b: number): number {
  return a / b;
}
const Math = {
  add,
  subtract,
  multiply,
  divide,
};
export default Math;`}</CodeBlock>
        <CodeBlock
          language="tsx"
          name="DestructingImports"
          file="app/labs/lab3/DestructingImports.tsx"
        >{`import Math, { add, subtract, multiply, divide } from "./Math";
import * as Matematica from "./Math";

export default function DestructingImports() {
  return (
    <div id="wd-destructuring-imports">
      <h2>Destructing Imports</h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th>Math</th>
            <th>Matematica</th>
            <th>Functions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Math.add(2, 3) = {Math.add(2, 3)}</td>
            <td>Matematica.add(2, 3) = {Matematica.add(2, 3)}</td>
            <td>add(2, 3) = {add(2, 3)}</td>
          </tr>
          <tr>
            <td>Math.subtract(5, 1) = {Math.subtract(5, 1)}</td>
            <td>Matematica.subtract(5, 1) = {Matematica.subtract(5, 1)}</td>
            <td>subtract(5, 1) = {subtract(5, 1)}</td>
          </tr>
          <tr>
            <td>Math.multiply(3, 4) = {Math.multiply(3, 4)}</td>
            <td>Matematica.multiply(3, 4) = {Matematica.multiply(3, 4)}</td>
            <td>multiply(3, 4) = {multiply(3, 4)}</td>
          </tr>
          <tr>
            <td>Math.divide(8, 2) = {Math.divide(8, 2)}</td>
            <td>Matematica.divide(8, 2) = {Matematica.divide(8, 2)}</td>
            <td>divide(8, 2) = {divide(8, 2)}</td>
          </tr>
        </tbody>
      </table>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          A module can export many <strong>named</strong>{" "}values (
          <code>export function add</code>) and at most one{" "}
          <strong>default</strong>{" "}(<code>export default Math</code>).
          Named imports use braces:{" "}
          <code>{`import { add } from "./Math"`}</code>. The default
          import does not: <code>{`import Math from "./Math"`}</code> — the
          same pattern as <code>{`import House from "./House"`}</code>{" "}and
          as every Next.js <code>page.tsx</code>, which must default-export
          the page component. <code>import * as Matematica</code>{" "}gathers
          every export as one object. Each column of the table is the same
          arithmetic:
        </p>
        <LiveDemo
          name="DestructingImports"
          file="app/labs/lab3/DestructingImports.tsx"
        >
          <DestructingImports />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}Import only <code>add</code>{" "}in a
          one-line experiment in the same file (or a comment) and confirm
          you can still call <code>Math.divide</code>{" "}through the default
          import.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-3-4-17"
        title="3.4.17 Optional chaining and nullish coalescing"
      >
        <p>
          Reading <code>house.address.city</code>{" "}throws if{" "}
          <code>address</code>{" "}is missing. Optional chaining{" "}
          <code>?.</code>{" "}stops at the first <code>null</code>{" "}or{" "}
          <code>undefined</code>{" "}and yields <code>undefined</code>{" "}instead
          of crashing. Nullish coalescing <code>??</code>{" "}supplies a
          default only when the left side is <code>null</code>{" "}or{" "}
          <code>undefined</code>{" "}(unlike <code>||</code>, which also
          treats <code>0</code>{" "}and <code>&quot;&quot;</code>{" "}as missing).
          Create <code>OptionalChaining.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="OptionalChaining"
          file="app/labs/lab3/OptionalChaining.tsx"
        >{`export default function OptionalChaining() {
  const house = {
    bedrooms: 4,
    address: {
      street: "Via Roma",
      city: "Roma",
    },
  };
  const missing = undefined as { prop?: string } | undefined;
  return (
    <div id="wd-optional-chaining">
      <h4>Optional Chaining</h4>
      house.address?.city = {house.address?.city}
      <br />
      missing?.prop ?? "n/a" = {missing?.prop ?? "n/a"}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          <code>house.address?.city</code>{" "}is <code>Roma</code>.{" "}
          <code>missing?.prop</code>{" "}is <code>undefined</code>, so{" "}
          <code>?? &quot;n/a&quot;</code>{" "}fills in the fallback — the same
          pattern the assignment editor uses for{" "}
          <code>assignment?.title ?? &quot;&quot;</code>{" "}in{" "}
          <SectionLink to="3.9.8.1" />:
        </p>
        <LiveDemo
          name="OptionalChaining"
          file="app/labs/lab3/OptionalChaining.tsx"
        >
          <OptionalChaining />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}Read{" "}
          <code>house.garage?.cars ?? 0</code>{" "}and display it — there is no{" "}
          <code>garage</code>, so the fallback should appear.
        </p>
      </Section>

      <Section level={3} id="sec-3-4-18" title="3.4.18 Exercises">
        <p>
          Confirm Lab 3 covers every data-structure topic in{" "}
          <SectionLink to="3.4" />. Import each component into{" "}
          <code>page.tsx</code>. Give every mapped JSX sibling a{" "}
          <code>key</code>.
        </p>
        <ol>
          <li>
            Create <code>SimpleArrays.tsx</code>{" "}with a keyed todo list
            (3.4).
          </li>
          <li>
            Create <code>ArrayIndexAndLength.tsx</code>{" "}(3.4.1).
          </li>
          <li>
            Create <code>AddingAndRemovingToFromArrays.tsx</code>{" "}using{" "}
            <code>push</code>{" "}and <code>splice</code>{" "}(3.4.2).
          </li>
          <li>
            Create <code>ForLoops.tsx</code>{" "}(3.4.3).
          </li>
          <li>
            Create <code>MapFunction.tsx</code>{" "}and map todos with{" "}
            <code>key={"{todo}"}</code>{" "}(3.4.4).
          </li>
          <li>
            Create <code>FindFunction.tsx</code>{" "}and{" "}
            <code>FindIndex.tsx</code>{" "}(3.4.5–3.4.6).
          </li>
          <li>
            Create <code>FilterFunction.tsx</code>{" "}(3.4.7).
          </li>
          <li>
            Create <code>IncludesSomeEvery.tsx</code>{" "}and{" "}
            <code>ReduceFunction.tsx</code>{" "}(3.4.8–3.4.9).
          </li>
          <li>
            Create <code>JsonStringify.tsx</code>{" "}and{" "}
            <code>House.tsx</code>, then log the house in the Console tab
            (3.4.10–3.4.12).
          </li>
          <li>
            Create <code>Spreader.tsx</code>, <code>Destructing.tsx</code>,{" "}
            <code>FunctionDestructing.tsx</code>, <code>Math.ts</code>, and{" "}
            <code>DestructingImports.tsx</code>{" "}(3.4.13–3.4.16).
          </li>
          <li>
            Create <code>OptionalChaining.tsx</code>{" "}(3.4.17).
          </li>
        </ol>
      </Section>
    </Section>
  );
}
