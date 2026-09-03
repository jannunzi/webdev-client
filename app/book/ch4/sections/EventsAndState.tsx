import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import { OnYourOwn, WithAI } from "../../components/Practice";
import ClickEvent from "@/app/labs/lab4/ClickEvent";
import PassingDataOnEvent from "@/app/labs/lab4/PassingDataOnEvent";
import PassingFunctionsDemo from "@/app/labs/lab4/PassingFunctionsDemo";
import CounterBroken from "@/app/labs/lab4/CounterBroken";
import Counter from "@/app/labs/lab4/Counter";
import BooleanStateVariables from "@/app/labs/lab4/BooleanStateVariables";
import StringStateVariables from "@/app/labs/lab4/StringStateVariables";
import DateStateVariable from "@/app/labs/lab4/DateStateVariable";
import ObjectStateVariable from "@/app/labs/lab4/ObjectStateVariable";
import ArrayStateVariable from "@/app/labs/lab4/ArrayStateVariable";

export default function EventsAndState() {
  return (
    <>
      <Section
        level={3}
        id="sec-4-2-1"
        title="4.2.1 Handling User Events"
      >
        <p>
          HTML and CSS describe how a screen looks. As users work they
          generate a stream of <strong>events</strong> — click, change,
          submit — that describe what they did. Handlers change state;
          React paints again. The PDF splits this into click events
          (4.2.1.1), passing data (4.2.1.2), and passing functions
          (4.2.1.3). Those are the next three subsections.
        </p>
        <p>
          A click, a keystroke, and a form submit are events, and React
          listens with attributes such as <code>onClick</code>{" "}and{" "}
          <code>onChange</code>. Those listeners only run in the browser,
          so the file that uses them starts with{" "}
          <code>&quot;use client&quot;</code> — the same directive{" "}
          <SectionLink to="3.6.1" />{" "}introduced for pathname-aware
          components. Create <code>ClickEvent.tsx</code>{" "}and import it
          from the Lab 4 page:
        </p>
        <CodeBlock
          language="tsx"
          name="ClickEvent"
          file="app/labs/lab4/ClickEvent.tsx"
        >{`"use client";

const hello = () => {
  alert("Hello World!");
};

export default function ClickEvent() {
  return (
    <div id="wd-click-event">
      <h2>Click Event</h2>
      <button
        type="button"
        onClick={hello}
        id="wd-onclick-hello"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Click Hello
      </button>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          The handler is a function reference:{" "}
          <code>{`onClick={hello}`}</code>, not{" "}
          <code>{`onClick={hello()}`}</code>. Parentheses would call{" "}
          <code>hello</code>{" "}while React is rendering, before anyone
          clicks. Click the button and confirm an alert appears:
        </p>
        <LiveDemo
          name="ClickEvent"
          file="app/labs/lab4/ClickEvent.tsx"
          mode="styled"
        >
          <ClickEvent />
        </LiveDemo>
        <OnYourOwn>
          In <code>ClickEvent.tsx</code>, add a second button with its own{" "}
          <code>id</code>{" "}that alerts a greeting that includes your name.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/ClickEvent.tsx, keep any extra button I added for myself. After the existing Click Hello button, add a sample button id="wd-onclick-goodbye" that alerts "Goodbye World!" using a goodbye function. Do not rename my personal button.`}
        >
          Paste this prompt so the assistant adds one extra sample click
          handler — leave your named greeting as yours:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-2-2"
        title="4.2.2 Passing Data on Events"
      >
        <p>
          Sometimes the handler needs an argument: which item to delete,
          which message to show. Write a function that takes a string, then
          wrap the call in an arrow so the argument is not evaluated during
          render:
        </p>
        <CodeBlock
          language="tsx"
          name="PassingDataOnEvent"
          file="app/labs/lab4/PassingDataOnEvent.tsx"
        >{`"use client";

const hello = () => {
  alert("Hello World!");
};

const lifeIs = (good: string) => {
  alert(good);
};

export default function PassingDataOnEvent() {
  return (
    <div id="wd-passing-data-on-event">
      <h2>Passing Data on Event</h2>
      <button
        type="button"
        onClick={hello}
        id="wd-pass-data-click"
        className="me-2 rounded bg-yellow-400 px-3 py-1.5 text-sm font-medium"
      >
        Pass Data
      </button>
      <button
        type="button"
        onClick={() => lifeIs("Life is Good!")}
        id="wd-pass-data-parameter-click"
        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Pass Data Parameter
      </button>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          <code>{`onClick={lifeIs("Life is Good!")}`}</code>{" "}would run{" "}
          <code>lifeIs</code>{" "}immediately and pass its return value
          (undefined) to <code>onClick</code>. The arrow delays the call
          until the click:
        </p>
        <LiveDemo
          name="PassingDataOnEvent"
          file="app/labs/lab4/PassingDataOnEvent.tsx"
          mode="styled"
        >
          <PassingDataOnEvent />
        </LiveDemo>
        <OnYourOwn>
          Add a third button that passes a different string of your choosing
          into <code>lifeIs</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/PassingDataOnEvent.tsx, keep any extra button I added. After the existing buttons, add a sample button id="wd-pass-data-course-click" that calls lifeIs("Web Development") through an arrow function. Do not rename my personal button.`}
        >
          Ask the assistant to add one extra sample parameter button:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-2-3"
        title="4.2.3 Passing Functions"
      >
        <p>
          A child can invoke behavior the parent owns if the parent passes
          the function as a prop. Create{" "}
          <code>PassingFunctions.tsx</code>{" "}and pass <code>sayHello</code>{" "}
          from the Lab 4 page:
        </p>
        <CodeBlock
          language="tsx"
          name="PassingFunctions"
          file="app/labs/lab4/PassingFunctions.tsx"
        >{`"use client";

export default function PassingFunctions({
  theFunction,
}: {
  theFunction: () => void;
}) {
  return (
    <div id="wd-passing-functions">
      <h2>Passing Functions</h2>
      <button
        type="button"
        onClick={theFunction}
        id="wd-pass-functions-click"
        className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Invoke the Function
      </button>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          On the Lab 4 page, declare <code>sayHello</code>{" "}and pass it as{" "}
          <code>{`theFunction={sayHello}`}</code>. That is why the page
          itself is a Client Component: the parent creates the function in
          the browser and hands the child a reference.
        </p>
        <LiveDemo
          name="PassingFunctions"
          file="app/labs/lab4/PassingFunctions.tsx"
          mode="styled"
        >
          <PassingFunctionsDemo />
        </LiveDemo>
        <OnYourOwn>
          Pass a second function from <code>page.tsx</code>{" "}that alerts
          your name, and add a second button in{" "}
          <code>PassingFunctions</code>{" "}that calls it.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/PassingFunctions.tsx and app/labs/lab4/page.tsx, keep any extra function I passed. Add a sample prop theOtherFunction: () => void and a button id="wd-pass-functions-other-click" that calls it. From page.tsx pass a function that alerts "Sample from parent". Do not rename my personal function.`}
        >
          Ask the assistant to add one extra sample function prop:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-2-4"
        title="4.2.4 useState and the Counter"
      >
        <p>
          The PDF calls this <strong>4.2.2 Managing Component
          State</strong> — the <code>useState</code> hook, then integer,
          boolean, string, date, object, and array variables. The hook
          is how you join React&apos;s render cycle. The syntax is a
          pair:
        </p>
        <CodeBlock language="tsx">{`const [stateVariable, setStateVariable] = useState(initialStateValue);`}</CodeBlock>
        <p>
          The argument is the first value. Index <code>0</code> is the
          current value; index <code>1</code> is the setter. Calling the
          setter queues a new render. A plain <code>let</code> can
          change in memory and the heading will not move, because React
          does not know to paint again. Create{" "}
          <code>CounterBroken.tsx</code>{" "}first so the failure is visible:
          clicking Up increments a <code>let</code>, but the heading stays
          at 7:
        </p>
        <CodeBlock
          language="tsx"
          name="CounterBroken"
          file="app/labs/lab4/CounterBroken.tsx"
        >{`"use client";

export default function CounterBroken() {
  let count = 7;
  return (
    <div id="wd-counter-broken">
      <h2>Broken Counter: {count}</h2>
      <button
        type="button"
        onClick={() => {
          count++;
        }}
        id="wd-counter-broken-up-click"
        className="me-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Up
      </button>
      <button
        type="button"
        onClick={() => {
          count--;
        }}
        id="wd-counter-broken-down-click"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Down
      </button>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <LiveDemo
          name="CounterBroken"
          file="app/labs/lab4/CounterBroken.tsx"
          mode="styled"
        >
          <CounterBroken />
        </LiveDemo>
        <p>
          <code>useState</code>{" "}returns a pair: the current value and a
          setter. Calling the setter queues a new render with the new
          value. Replace the <code>let</code>{" "}with that pair in{" "}
          <code>Counter.tsx</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="Counter"
          file="app/labs/lab4/Counter.tsx"
        >{`"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(7);
  return (
    <div id="wd-counter">
      <h2>Counter: {count}</h2>
      <button
        type="button"
        onClick={() => setCount(count + 1)}
        id="wd-counter-up-click"
        className="me-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Up
      </button>
      <button
        type="button"
        onClick={() => setCount(count - 1)}
        id="wd-counter-down-click"
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Down
      </button>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          Click Up and Down and confirm the heading changes. That is the
          same integer you will rebuild with Context, Zustand, and Redux so
          the three APIs stay comparable:
        </p>
        <LiveDemo name="Counter" file="app/labs/lab4/Counter.tsx" mode="styled">
          <Counter />
        </LiveDemo>
        <OnYourOwn>
          Add a Reset button that sets the counter back to 7.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/Counter.tsx, keep any extra button I added. After Down, add a sample button id="wd-counter-reset-click" that calls setCount(7). Do not rename my personal button.`}
        >
          Ask the assistant to add a sample Reset after your own control:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-2-5"
        title="4.2.5 Boolean State Variables"
      >
        <p>
          Boolean state is a natural fit for checkboxes and for markup
          that should appear only when a flag is true. Bind{" "}
          <code>checked</code>{" "}to the state value and toggle it on change:
        </p>
        <CodeBlock
          language="tsx"
          name="BooleanStateVariables"
          file="app/labs/lab4/BooleanStateVariables.tsx"
        >{`"use client";

import { useState } from "react";

export default function BooleanStateVariables() {
  const [done, setDone] = useState(true);
  return (
    <div id="wd-boolean-state-variables">
      <h2>Boolean State Variables</h2>
      <p>{done ? "Done" : "Not done"}</p>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={done}
          onChange={() => setDone(!done)}
          id="wd-boolean-checkbox"
        />
        Done
      </label>
      {done && <div className="mt-2 rounded bg-yellow-100 p-2">Yay! Done</div>}
      <hr />
    </div>
  );
}`}</CodeBlock>
        <LiveDemo
          name="BooleanStateVariables"
          file="app/labs/lab4/BooleanStateVariables.tsx"
          mode="styled"
        >
          <BooleanStateVariables />
        </LiveDemo>
        <OnYourOwn>
          Add a second boolean (for example <code>urgent</code>) with its
          own checkbox and a short message that appears only when it is
          true.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/BooleanStateVariables.tsx, keep any extra boolean I added. After the Done checkbox, add const [saved, setSaved] = useState(false), a checkbox id="wd-boolean-saved", and {saved && <div>Saved</div>}. Do not rename my personal boolean.`}
        >
          Ask the assistant to add one extra sample boolean:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-2-6"
        title="4.2.6 String State Variables"
      >
        <p>
          A <strong>controlled</strong> input uses <code>value</code>{" "}for
          what the field shows and <code>onChange</code>{" "}to write each
          keystroke back into state. Using <code>defaultValue</code>{" "}would
          leave the field uncontrolled after the first render — the heading
          and the input could drift apart. Lab 1 used{" "}
          <code>defaultValue</code>{" "}because there was no state yet; from
          here on, bind <code>value</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="StringStateVariables"
          file="app/labs/lab4/StringStateVariables.tsx"
        >{`"use client";

import { useState } from "react";

export default function StringStateVariables() {
  const [firstName, setFirstName] = useState("John");
  return (
    <div id="wd-string-state-variables">
      <h2>String State Variables</h2>
      <p>{firstName}</p>
      <input
        className="w-full max-w-sm rounded border border-neutral-300 px-3 py-1.5"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        id="wd-first-name"
      />
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          <code>e.target.value</code>{" "}is the field&apos;s current text.
          Type in the input and watch the paragraph update on every
          keystroke:
        </p>
        <LiveDemo
          name="StringStateVariables"
          file="app/labs/lab4/StringStateVariables.tsx"
          mode="styled"
        >
          <StringStateVariables />
        </LiveDemo>
        <OnYourOwn>
          Add a <code>lastName</code>{" "}state string and a second controlled
          input. Show both names together under the heading.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/StringStateVariables.tsx, keep any extra string I added. After firstName, add const [nickName, setNickName] = useState("JD") with a controlled input id="wd-nick-name" and interpolate nickName under firstName. Do not rename my personal field.`}
        >
          Ask the assistant to add one extra sample string field:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-2-7"
        title="4.2.7 Date State Variables"
      >
        <p>
          HTML date inputs speak <code>YYYY-MM-DD</code>. A JavaScript{" "}
          <code>Date</code>{" "}does not. Convert with a small helper, bind{" "}
          <code>value</code>{" "}to that string, and construct a new{" "}
          <code>Date</code>{" "}from <code>e.target.value</code>{" "}on change:
        </p>
        <CodeBlock
          language="tsx"
          name="DateStateVariable"
          file="app/labs/lab4/DateStateVariable.tsx"
        >{`"use client";

import { useState } from "react";

function dateObjectToHtmlDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return \`\${year}-\${month}-\${day}\`;
}

export default function DateStateVariable() {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <div id="wd-date-state-variables">
      <h2>Date State Variables</h2>
      <h3>{JSON.stringify(startDate)}</h3>
      <h3>{dateObjectToHtmlDateString(startDate)}</h3>
      <input
        type="date"
        className="rounded border border-neutral-300 px-3 py-1.5"
        value={dateObjectToHtmlDateString(startDate)}
        onChange={(e) => setStartDate(new Date(e.target.value))}
        id="wd-start-date"
      />
      <hr />
    </div>
  );
}`}</CodeBlock>
        <LiveDemo
          name="DateStateVariable"
          file="app/labs/lab4/DateStateVariable.tsx"
          mode="styled"
        >
          <DateStateVariable />
        </LiveDemo>
        <OnYourOwn>
          Add an <code>endDate</code>{" "}state value and a second date input.
          Show both formatted strings.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/DateStateVariable.tsx, keep any extra date I added. After startDate, add const [dueDate, setDueDate] = useState(new Date()) with a type="date" input id="wd-due-date" bound the same way as startDate. Do not rename my personal date.`}
        >
          Ask the assistant to add one extra sample date field:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-2-8"
        title="4.2.8 Object State Variables"
      >
        <p>
          When the state value is an object, replace it with a new one
          rather than editing the old one in place. Spread the previous
          object, then override the field you changed.{" "}
          <code>person.name = e.target.value</code>{" "}would edit the old
          object in place, and React may skip the render:
        </p>
        <CodeBlock
          language="tsx"
          name="ObjectStateVariable"
          file="app/labs/lab4/ObjectStateVariable.tsx"
        >{`"use client";

import { useState } from "react";

export default function ObjectStateVariable() {
  const [person, setPerson] = useState({ name: "Peter", age: 24 });
  return (
    <div id="wd-object-state-variables">
      <h2>Object State Variables</h2>
      <pre>{JSON.stringify(person, null, 2)}</pre>
      <input
        className="mb-2 block w-full max-w-sm rounded border border-neutral-300 px-3 py-1.5"
        value={person.name}
        onChange={(e) => setPerson({ ...person, name: e.target.value })}
        id="wd-person-name"
      />
      <input
        type="number"
        className="block w-full max-w-sm rounded border border-neutral-300 px-3 py-1.5"
        value={person.age}
        onChange={(e) =>
          setPerson({ ...person, age: parseInt(e.target.value) || 0 })
        }
        id="wd-person-age"
      />
      <hr />
    </div>
  );
}`}</CodeBlock>
        <LiveDemo
          name="ObjectStateVariable"
          file="app/labs/lab4/ObjectStateVariable.tsx"
          mode="styled"
        >
          <ObjectStateVariable />
        </LiveDemo>
        <OnYourOwn>
          Add a <code>city</code>{" "}property to the person object and a
          controlled input that updates it with the spread pattern.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/ObjectStateVariable.tsx, keep any extra field I added. Add a sample city: "Boston" on the initial person object and a controlled input id="wd-person-city" that sets city with { ...person, city: e.target.value }. Do not rename my personal field.`}
        >
          Ask the assistant to add one extra sample object field:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-4-2-9"
        title="4.2.9 Array State Variables"
      >
        <p>
          Arrays follow the same replace-don&apos;t-mutate rule: compute a
          new array, append with spread, and remove with{" "}
          <code>filter</code>. The Delete button
          receives the index through an arrow so it is not called during
          render:
        </p>
        <CodeBlock
          language="tsx"
          name="ArrayStateVariable"
          file="app/labs/lab4/ArrayStateVariable.tsx"
        >{`"use client";

import { useState } from "react";

export default function ArrayStateVariable() {
  const [array, setArray] = useState([1, 2, 3, 4, 5]);
  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };
  const deleteElement = (index: number) => {
    setArray(array.filter((_item, i) => i !== index));
  };
  return (
    <div id="wd-array-state-variables">
      <h2>Array State Variable</h2>
      <button
        type="button"
        onClick={addElement}
        id="wd-add-element-click"
        className="mb-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Add Element
      </button>
      <ul className="m-0 max-w-xs list-none p-0">
        {array.map((item, index) => (
          <li
            key={\`\${item}-\${index}\`}
            className="mb-1 flex items-center justify-between rounded border border-neutral-200 bg-green-50 px-3 py-1"
          >
            <span>{item}</span>
            <button
              type="button"
              onClick={() => deleteElement(index)}
              id={\`wd-delete-element-\${index}-click\`}
              className="rounded bg-red-600 px-2 py-0.5 text-sm font-medium text-white"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <LiveDemo
          name="ArrayStateVariable"
          file="app/labs/lab4/ArrayStateVariable.tsx"
          mode="styled"
        >
          <ArrayStateVariable />
        </LiveDemo>
        <OnYourOwn>
          Add a Clear button that sets the array back to{" "}
          <code>[1, 2, 3, 4, 5]</code>.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/ArrayStateVariable.tsx, keep any extra button I added. After Add Element, add a sample button id="wd-clear-array-click" that calls setArray([1, 2, 3, 4, 5]). Do not rename my personal button.`}
        >
          Ask the assistant to add a sample Clear after your own control:
        </WithAI>
      </Section>
    </>
  );
}
