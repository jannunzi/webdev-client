import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import OfficialLink from "../../components/OfficialLink";
import { OnYourOwn, WithAI } from "../../components/Practice";
import NestedExerciseList from "../../components/NestedExerciseList";
import { CH4_LAB_EXERCISES } from "../../exercise-lists/catalogs";
import LocalUrl from "../../components/LocalUrl";
import Effect from "@/app/labs/lab4/Effect";
import WindowSizeDemo from "@/app/labs/lab4/hooks/WindowSizeDemo";
import ToggleDemo from "@/app/labs/lab4/hooks/ToggleDemo";
import LocalStorageDemo from "@/app/labs/lab4/hooks/LocalStorageDemo";
import IndependentToggles from "@/app/labs/lab4/hooks/IndependentToggles";
import HookProfileForm from "@/app/labs/lab4/hooks/HookProfileForm";

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

        <Section
          level={3}
          id="sec-4-7-1"
          title="4.7.1 Writing Your Own Hooks"
        >
          <p>
            A <strong>custom hook</strong>{" "}is a function you write
            whose name starts with <code>use</code>{" "}and that calls other
            hooks inside. It lets several components share the same
            stateful logic without copying it. Each step below adds one
            hook to its own file under <code>app/labs/lab4/hooks</code>,
            plus a small component that calls it, and all of them appear
            together on the <LocalUrl href="/labs/lab4/hooks" />{" "}page.
            The hook files end in <code>.ts</code>{" "}because they return
            data, not JSX, and they have no{" "}
            <code>&quot;use client&quot;</code>{" "}line of their own: a
            module only runs where the component that imports it runs,
            and each demo component below is a Client Component.
          </p>

          <h4 className="mt-6 font-semibold">Step 1: useWindowSize</h4>
          <p>
            The window object demo in <SectionLink to="3.6.3" />{" "}kept
            the window size in <code>useState</code>, filled it in from{" "}
            <code>useEffect</code>, and removed its resize listener in
            the cleanup. Moving exactly that logic into a function named{" "}
            <code>useWindowSize</code>{" "}turns it into a hook that
            returns the size, or <code>null</code>{" "}until the browser
            has measured it:
          </p>
          <CodeBlock
            language="ts"
            name="useWindowSize"
            file="app/labs/lab4/hooks/useWindowSize.ts"
          >{`import { useEffect, useState } from "react";

export type WindowSize = { width: number; height: number };

export default function useWindowSize() {
  const [size, setSize] = useState<WindowSize | null>(null);
  useEffect(() => {
    const update = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    const first = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("resize", update);
    };
  }, []);
  return size;
}`}</CodeBlock>
          <p>
            The component that uses it shrinks to one line of logic. It
            no longer mentions <code>window</code>, listeners, or cleanup;
            it just asks for the size:
          </p>
          <CodeBlock
            language="tsx"
            name="WindowSizeDemo"
            file="app/labs/lab4/hooks/WindowSizeDemo.tsx"
          >{`"use client";

import useWindowSize from "./useWindowSize";

export default function WindowSizeDemo() {
  const size = useWindowSize();
  return (
    <div id="wd-window-size-demo">
      <h3>useWindowSize</h3>
      {size ? (
        <p>
          Window size: {size.width} x {size.height}
        </p>
      ) : (
        <p>Loading window size...</p>
      )}
    </div>
  );
}`}</CodeBlock>
          <LiveDemo
            name="WindowSizeDemo"
            file="app/labs/lab4/hooks/WindowSizeDemo.tsx"
            mode="styled"
          >
            <WindowSizeDemo />
          </LiveDemo>
          <p>Resize the browser window and watch the numbers change.</p>

          <h4 className="mt-6 font-semibold">Step 2: useToggle</h4>
          <p>
            A custom hook does not need an effect. <code>useToggle</code>{" "}
            wraps a boolean <code>useState</code>{" "}together with the
            function that flips it, the pattern from{" "}
            <SectionLink to="4.2.5" />. It returns a pair, like{" "}
            <code>useState</code>{" "}does. Writing <code>as const</code>{" "}
            after the array tells TypeScript that this is a{" "}
            <strong>tuple</strong>, an array with a fixed length whose
            first item is a boolean and second item is a function, so
            callers can destructure it with the right types:
          </p>
          <CodeBlock
            language="ts"
            name="useToggle"
            file="app/labs/lab4/hooks/useToggle.ts"
          >{`import { useState } from "react";

export default function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn(!on);
  return [on, toggle] as const;
}`}</CodeBlock>
          <CodeBlock
            language="tsx"
            name="ToggleDemo"
            file="app/labs/lab4/hooks/ToggleDemo.tsx"
          >{`"use client";

import useToggle from "./useToggle";

export default function ToggleDemo() {
  const [shown, toggleShown] = useToggle();
  return (
    <div id="wd-toggle-demo">
      <h3>useToggle</h3>
      <button
        type="button"
        onClick={toggleShown}
        id="wd-toggle-demo-click"
        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        {shown ? "Hide" : "Show"} details
      </button>
      {shown && <p>These details are visible because shown is true.</p>}
    </div>
  );
}`}</CodeBlock>
          <LiveDemo
            name="ToggleDemo"
            file="app/labs/lab4/hooks/ToggleDemo.tsx"
            mode="styled"
          >
            <ToggleDemo />
          </LiveDemo>

          <h4 className="mt-6 font-semibold">Step 3: useLocalStorage</h4>
          <p>
            <code>window.localStorage</code>{" "}is a small key-value store
            the browser keeps for each site; what you save there is still
            there after a reload or after closing the tab. It only stores
            strings, so <code>JSON.stringify</code>{" "}turns the value into
            a string when saving and <code>JSON.parse</code>{" "}turns it
            back when reading. <code>useLocalStorage(key, initial)</code>{" "}
            works like <code>useState</code>, but its setter also saves the
            value under <code>key</code>, and after the first render it
            reads back whatever was saved before. Like the window size, it
            starts with <code>initial</code>{" "}on both server and browser
            and reads <code>localStorage</code>{" "}only inside the effect,
            so the HTML matches and there is no hydration error.{" "}
            <code>&lt;T&gt;</code>{" "}is a <strong>type parameter</strong>:
            it lets the same hook store a string, a number, or an object,
            and TypeScript infers <code>T</code>{" "}from{" "}
            <code>initial</code>:
          </p>
          <CodeBlock
            language="ts"
            name="useLocalStorage"
            file="app/labs/lab4/hooks/useLocalStorage.ts"
          >{`import { useEffect, useState } from "react";

export default function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => {
    const first = requestAnimationFrame(() => {
      const saved = window.localStorage.getItem(key);
      if (saved !== null) setValue(JSON.parse(saved) as T);
    });
    return () => cancelAnimationFrame(first);
  }, [key]);
  const save = (next: T) => {
    setValue(next);
    window.localStorage.setItem(key, JSON.stringify(next));
  };
  return [value, save] as const;
}`}</CodeBlock>
          <p>
            This is how a page can remember a choice such as a selected
            tab. Click a tab, reload the page, and the same tab is still
            selected:
          </p>
          <CodeBlock
            language="tsx"
            name="LocalStorageDemo"
            file="app/labs/lab4/hooks/LocalStorageDemo.tsx"
          >{`"use client";

import useLocalStorage from "./useLocalStorage";

const TABS = ["Monday", "Tuesday", "Wednesday"];

export default function LocalStorageDemo() {
  const [tab, setTab] = useLocalStorage("wd-hooks-tab", TABS[0]);
  return (
    <div id="wd-local-storage-demo">
      <h3>useLocalStorage</h3>
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={
              t === tab
                ? "rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
                : "rounded border border-neutral-300 px-3 py-1.5 text-sm"
            }
          >
            {t}
          </button>
        ))}
      </div>
      <p>Selected: {tab}. Reload the page and it stays selected.</p>
    </div>
  );
}`}</CodeBlock>
          <LiveDemo
            name="LocalStorageDemo"
            file="app/labs/lab4/hooks/LocalStorageDemo.tsx"
            mode="styled"
          >
            <LocalStorageDemo />
          </LiveDemo>

          <h4 className="mt-6 font-semibold">Step 4: The rules of custom hooks</h4>
          <ul>
            <li>
              <strong>The name starts with <code>use</code>.</strong>{" "}
              That is how React and the linter recognize a hook and check
              that it is called only at the top level of a component or
              of another hook.
            </li>
            <li>
              <strong>A hook can call other hooks.</strong>{" "}
              <code>useWindowSize</code>{" "}calls <code>useState</code>{" "}
              and <code>useEffect</code>; a hook you write later could call{" "}
              <code>useWindowSize</code>.
            </li>
            <li>
              <strong>Each component that calls it gets its own state.</strong>{" "}
              A custom hook shares logic, not data. Below, two{" "}
              <code>Lamp</code>{" "}components each call{" "}
              <code>useToggle</code>, and switching one does not switch the
              other.
            </li>
          </ul>
          <CodeBlock
            language="tsx"
            name="IndependentToggles"
            file="app/labs/lab4/hooks/IndependentToggles.tsx"
          >{`"use client";

import useToggle from "./useToggle";

function Lamp({ label }: { label: string }) {
  const [on, toggle] = useToggle();
  return (
    <button
      type="button"
      onClick={toggle}
      className={
        on
          ? "rounded bg-yellow-300 px-3 py-1.5 text-sm"
          : "rounded bg-neutral-700 px-3 py-1.5 text-sm text-white"
      }
    >
      {label}: {on ? "on" : "off"}
    </button>
  );
}

export default function IndependentToggles() {
  return (
    <div id="wd-independent-toggles">
      <h3>Each caller gets its own state</h3>
      <div className="flex gap-2">
        <Lamp label="Kitchen" />
        <Lamp label="Porch" />
      </div>
    </div>
  );
}`}</CodeBlock>
          <LiveDemo
            name="IndependentToggles"
            file="app/labs/lab4/hooks/IndependentToggles.tsx"
            mode="styled"
          >
            <IndependentToggles />
          </LiveDemo>

          <h4 className="mt-6 font-semibold">Step 5: useProfileForm</h4>
          <p>
            The profile form in <SectionLink to="4.2.10" />{" "}kept three
            state variables, an <code>update</code>{" "}function, and a{" "}
            <code>save</code>{" "}handler that validates on submit.
            Moving all of that into <code>useProfileForm</code>{" "}leaves
            the form component with only its JSX. The hook returns an
            object instead of a pair because it has five things to hand
            back, and names read more clearly than positions:
          </p>
          <CodeBlock
            language="ts"
            name="useProfileForm"
            file="app/labs/lab4/hooks/useProfileForm.ts"
          >{`import { useState, type FormEvent } from "react";
import {
  emptyProfile,
  validateProfile,
  type Profile,
  type ProfileChanges,
  type ProfileErrors,
} from "../profile/profile";

export default function useProfileForm() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const update = (changes: ProfileChanges) =>
    setProfile({ ...profile, ...changes });
  const save = (e: FormEvent) => {
    e.preventDefault();
    setErrors(validateProfile(profile));
    setSubmitted(true);
  };
  return { profile, errors, submitted, update, save };
}`}</CodeBlock>
          <p>
            The form reuses <code>ProfileFields</code>{" "}and{" "}
            <code>ProfileAlert</code>{" "}from <SectionLink to="4.2.10" />{" "}
            unchanged. Press Save with empty fields to see the same errors
            as before:
          </p>
          <CodeBlock
            language="tsx"
            name="HookProfileForm"
            file="app/labs/lab4/hooks/HookProfileForm.tsx"
          >{`"use client";

import useProfileForm from "./useProfileForm";
import ProfileFields from "../profile/ProfileFields";
import ProfileAlert from "../profile/ProfileAlert";

export default function HookProfileForm() {
  const { profile, errors, submitted, update, save } = useProfileForm();
  return (
    <form id="wd-hook-profile-form" onSubmit={save} noValidate>
      <h3>useProfileForm</h3>
      <ProfileAlert id="wd-hook-profile-alert" submitted={submitted} errors={errors} />
      <ProfileFields prefix="wd-hook-profile" profile={profile} errors={errors} update={update} />
      <button id="wd-hook-profile-save" type="submit" className="mt-3 rounded bg-blue-600 px-4 py-1.5 text-white">
        Save
      </button>
    </form>
  );
}`}</CodeBlock>
          <LiveDemo
            name="HookProfileForm"
            file="app/labs/lab4/hooks/HookProfileForm.tsx"
            mode="styled"
          >
            <HookProfileForm />
          </LiveDemo>
          <p>
            Unlike <SectionLink to="4.4.3" />{" "}and{" "}
            <SectionLink to="4.5.3" />, which share one profile between
            components through Context or a store, every form that calls{" "}
            <code>useProfileForm</code>{" "}gets its own profile, by the
            third rule above. Finally, the page at{" "}
            <code>app/labs/lab4/hooks/page.tsx</code>{" "}puts every demo
            together. It is a Server Component; each demo it imports is a
            Client Component:
          </p>
          <CodeBlock
            language="tsx"
            name="HooksPage"
            file="app/labs/lab4/hooks/page.tsx"
          >{`import WindowSizeDemo from "./WindowSizeDemo";
import ToggleDemo from "./ToggleDemo";
import LocalStorageDemo from "./LocalStorageDemo";
import IndependentToggles from "./IndependentToggles";
import HookProfileForm from "./HookProfileForm";

export default function HooksPage() {
  return (
    <div id="wd-lab4-hooks" className="flex flex-col gap-8 p-4">
      <h2>Writing Your Own Hooks</h2>
      <WindowSizeDemo />
      <ToggleDemo />
      <LocalStorageDemo />
      <IndependentToggles />
      <HookProfileForm />
    </div>
  );
}`}</CodeBlock>
        </Section>

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
          as shown before you tick the matching item here. Each topic is
          listed once, with Lab, <strong>On your own</strong>, and{" "}
          <strong>With AI</strong>{" "}nested as a/b/c when that section
          has those blocks.
        </p>
        <NestedExerciseList groups={CH4_LAB_EXERCISES} />
      </Section>
    </>
  );
}
