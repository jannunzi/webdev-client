import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import { OnYourOwn, WithAI } from "../../components/Practice";
import Effect from "@/app/labs/lab4/Effect";

export default function EffectsAndExercises() {
  return (
    <>
      <Section id="sec-4-7" title="4.7 Side Effects with useEffect">
        <p>
          Rendering should compute JSX from props and state. Talking to the
          document, a timer, or a network is a <strong>side effect</strong>
          — it belongs in <code>useEffect</code>, which runs after React
          paints. The dependency array lists values that should re-run the
          effect; an empty array would run only after the first paint.
        </p>
        <CodeBlock
          language="tsx"
          name="Effect"
          file="app/labs/lab4/Effect.tsx"
        >{`"use client";

import { useEffect, useState } from "react";

export default function Effect() {
  const [name, setName] = useState("Kambaz");
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`\${name} — clicked \${count}\`;
  }, [name, count]);

  return (
    <div id="wd-use-effect">
      <h2>useEffect</h2>
      <p>
        The document title updates after React paints, whenever{" "}
        <code>name</code> or <code>count</code> changes.
      </p>
      <input
        className="mb-2 block w-full max-w-sm rounded border border-neutral-300 px-3 py-1.5"
        value={name}
        onChange={(e) => setName(e.target.value)}
        id="wd-effect-name"
      />
      <button
        type="button"
        onClick={() => setCount(count + 1)}
        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
        id="wd-effect-count-click"
      >
        Clicked {count}
      </button>
      <hr />
    </div>
  );
}`}</CodeBlock>
        <p>
          Type in the field or click the button, then look at the browser
          tab title. Import <code>Effect</code>{" "}from the Lab 4 page:
        </p>
        <LiveDemo name="Effect" file="app/labs/lab4/Effect.tsx" mode="styled">
          <Effect />
        </LiveDemo>
        <OnYourOwn>
          Log <code>name</code>{" "}and <code>count</code>{" "}to the console
          from the same effect so you can see when it runs.
        </OnYourOwn>
        <WithAI
          prompt={`In app/labs/lab4/Effect.tsx, keep any extra effect I added. Inside the existing useEffect, add console.log(name, count) after setting document.title. Do not add a second useEffect for my personal log if I already have one.`}
        >
          Ask the assistant to add a sample log in the existing effect:
        </WithAI>
      </Section>

      <Section id="sec-4-8" title="4.8 Exercises">
        <p>
          Use this checklist to confirm Lab 4 covers every sample in{" "}
          <SectionLink to="4.2" />
          –<SectionLink to="4.7" />. Each item points back to the section
          where you built the worked example. Build in order as you read —
          this list is for checking coverage, not a substitute for the
          walkthroughs.
        </p>
        <ol>
          <li>
            Create the Lab 4 Client Component page and link it from Labs
            and the Labs TOC (<SectionLink to="4.2" />).
          </li>
          <li>
            Handle a click with <code>onClick</code>{" "}and{" "}
            <code>&quot;use client&quot;</code> (
            <SectionLink to="4.2.1" />).
          </li>
          <li>
            Pass data into an event with an arrow wrapper (
            <SectionLink to="4.2.2" />).
          </li>
          <li>
            Pass a function from parent to child (
            <SectionLink to="4.2.3" />).
          </li>
          <li>
            Contrast a broken <code>let</code>{" "}counter with{" "}
            <code>useState</code> (<SectionLink to="4.2.4" />).
          </li>
          <li>
            Bind boolean, string, date, object, and array state (
            <SectionLink to="4.2.5" />
            –<SectionLink to="4.2.9" />).
          </li>
          <li>
            Move shared state to a parent and show prop drilling (
            <SectionLink to="4.3.1" />
            –<SectionLink to="4.3.2" />).
          </li>
          <li>
            Encode two numbers as query parameters and as path parameters (
            <SectionLink to="4.3.3" />).
          </li>
          <li>
            Share a counter with React Context (
            <SectionLink to="4.4" />).
          </li>
          <li>
            Rebuild the counter and a todo list with Zustand (
            <SectionLink to="4.5" />).
          </li>
          <li>
            Rebuild the counter with Redux Toolkit (
            <SectionLink to="4.6" />).
          </li>
          <li>
            Update the document title with <code>useEffect</code> (
            <SectionLink to="4.7" />).
          </li>
        </ol>
      </Section>
    </>
  );
}
