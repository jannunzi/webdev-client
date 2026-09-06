import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import OfficialLink from "../../components/OfficialLink";
import { OnYourOwn, WithAI } from "../../components/Practice";
import Effect from "@/app/labs/lab4/Effect";

export default function EffectsAndExercises() {
  return (
    <>
      <Section id="sec-4-7" title="4.7 Side Effects with useEffect">
        <p>
          One of the learning objectives for this chapter is to handle
          side effects with the{" "}
          <OfficialLink href="https://react.dev/reference/react/useEffect">
            useEffect
          </OfficialLink>{" "}
          hook. Rendering should compute JSX from props and state —
          that is the transformation from application state into a user
          interface that <SectionLink to="4.2.4" />{" "}described. Talking
          to the document, starting a timer, subscribing to a window
          event, or asking a network for data is a{" "}
          <strong>side effect</strong>: it reaches outside the
          component&apos;s return value. Those operations belong in{" "}
          <code>useEffect</code>, which runs after React paints, not
          during the render that computes the tree.
        </p>
        <p>
          If you set <code>document.title</code>{" "}or call{" "}
          <code>fetch</code>{" "}directly in the component body, the work
          runs every time React renders, including renders that had
          nothing to do with the title or the request. Putting the same
          work in <code>useEffect</code>{" "}lets you say when it should
          run. The dependency array lists values that should re-run the
          effect; when any of those values change, React runs the
          function again after the next paint. An empty array would run
          only after the first paint, which is the pattern later chapters
          use to load data when a screen first appears. Omitting the
          array altogether would run after every paint, which is rarely
          what you want.
        </p>
        <p>
          Kambaz Profile will use the same hook: if there is no current
          user the screen redirects to Sign in; otherwise it copies the
          current user into a local form, and a{" "}
          <code>useEffect</code>{" "}with an empty dependency array calls
          that fetch-profile function after the first paint. Chapter 5
          will use the same hook to retrieve welcome messages, objects,
          and arrays from an HTTP server when a lab component loads. This
          section practices the hook in isolation so those later calls
          are not the first time you have seen it. To practice side
          effects, create the <code>Effect</code>{" "}component below and
          import it from the Lab 4 page. Confirm the browser displays as
          shown, then look at the browser tab title as you type and
          click.
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
          The effect reads <code>name</code>{" "}and <code>count</code>{" "}
          and writes a string onto <code>document.title</code>. Because
          both values are listed in the dependency array, typing in the
          field or clicking the button schedules a new paint and then a
          new title. The input is a controlled string; the button is the
          same integer mutator you have been using since the counter.
          The new idea is only when the title write runs: after the
          paint, and only when one of those two values changed. Type in
          the field or click the button, then look at the browser tab
          title. Import <code>Effect</code>{" "}from the Lab 4 page and
          confirm the tab title tracks the field and the click count:
        </p>
        <LiveDemo name="Effect" file="app/labs/lab4/Effect.tsx" mode="styled">
          <Effect />
        </LiveDemo>
        <p>
          When you later fetch courses or a profile, the effect will look
          the same: a function that talks to the outside world, and an
          array that says when to talk. An empty array means once, after
          the screen first appears. An array with a course id means again
          whenever that id changes. Keep the fetch itself out of the
          render path so a parent rerender does not fire a new request.
        </p>
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
          walkthroughs. As you read each section, implement the component,
          import it from the Lab 4 page, and confirm the browser displays
          as shown before you tick the matching item here.
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
            Rebuild Hello, the counter, Add with a payload, and a
            todo list with Redux Toolkit (
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
