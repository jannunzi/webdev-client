import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import LocalUrl from "../../components/LocalUrl";
import ChapterLink from "../../components/ChapterLink";
import CodeBlock from "../../components/CodeBlock";
import OfficialLink from "../../components/OfficialLink";
import Link from "next/link";

export default function Intro() {
  return (
    <>
      <header id="intro" className="scroll-mt-6 mb-8">
        <p className="font-sans text-sm uppercase tracking-wide text-neutral-500">
          Developing Full Stack Next.js Web Applications
        </p>
        <h1 className="mt-1 font-sans text-4xl font-semibold leading-tight">
          Chapter 4 — Managing Client State
        </h1>
        <p className="text-neutral-600">Dr. Jose Annunziato</p>
      </header>

      <section className="space-y-4 text-[1.05rem]">
        <p>
          <ChapterLink to={3} /> discussed how to render content dynamically from data formatted in JSON.
          The Dashboard screen is rendered by looping over an array of courses,
          not eight copies of the same markup. The Course screen is rendered
          from an object indexed by an ID parsed from the URL.
          What we cannot do yet is change that data from the UI. The Add, Edit,
          and Delete buttons are still for decoration. A module you type on one
          screen never appears on another, because both pages are still reading
          from static files and are not connected to each other.
        </p>
        <p>
          In an application, <strong>state</strong> is the collection of
          values sitting in constants, variables, and data structures
          while the page is open. The useful question is who needs that
          data. <strong>Local state</strong> is data only one screen
          cares about, such as a form draft or a dialog that is open or
          closed. The course name you are still typing on Dashboard
          belongs next to that form, because nobody else needs it yet.{" "}
          <strong>Shared state</strong> is data several screens need,
          such as who is signed in or the list of courses. Sign in,
          Profile, and Dashboard all need the current user; Dashboard and
          Home both change the same courses array, so that data belongs
          where those screens can all reach it. As those values change,
          the user interface renders again to match.
        </p>
        <p>
          The PDF spine for this chapter is{" "}
          <em>forms and events → Redux → Context → Zustand →
          Kambaz</em>. This interactive book keeps that coverage and
          the Redux Hello / Add / Todo labs, then puts{" "}
          <strong>Zustand</strong> on Kambaz courses and modules
          because it is the smaller store students will maintain. The
          PDF&apos;s Kambaz screens use Redux reducers for the same
          lists — same screens, different store. You will still be able
          to read a Redux slice when you meet one.
        </p>
        <p>
          This chapter introduces how to maintain both kinds of state.
          React&apos;s{" "}
          <OfficialLink href="https://react.dev/reference/react/useState">
            useState
          </OfficialLink>{" "}
          hook holds local state — a counter, a controlled input, a
          dialog flag.{" "}
          <OfficialLink href="https://react.dev/learn/passing-data-deeply-with-context">
            React Context
          </OfficialLink>{" "}
          lets nested components read who is signed in without passing
          that user through every parent in between.{" "}
          <OfficialLink href="https://redux-toolkit.js.org/">
            Redux Toolkit
          </OfficialLink>{" "}
          is the PDF&apos;s application store: a single object, reducers
          that receive actions, <code>useSelector</code> and{" "}
          <code>dispatch</code>.{" "}
          <OfficialLink href="https://zustand.docs.pmnd.rs/">
            Zustand
          </OfficialLink>{" "}
          is the store this book uses for Kambaz courses and modules.
        </p>
        <p>
          The next sections practice these ideas one component at a time.
          After the labs, <SectionLink to="4.10" />{" "}applies them to
          Kambaz so Add, Edit, and Delete change the screens that already
          render from JSON.
        </p>
      </section>

      <Section id="sec-4-1" title="4.1 Learning Objectives">
        <p>By the end of this chapter you will be able to:</p>
        <ul>
          <li>
            Handle user events in Client Components and pass both data and
            functions into event handlers.
          </li>
          <li>
            Declare local state with <code>useState</code>{" "}for numbers,
            booleans, strings, dates, objects, and arrays.
          </li>
          <li>
            Bind form fields to state with <code>value</code>{" "}and{" "}
            <code>onChange</code>{" "}so the UI and the data stay in sync.
          </li>
          <li>
            Share state by declaring it in a parent both components can
            reach, and recognize when that sharing becomes prop drilling.
          </li>
          <li>
            Encode optional or structural data in the URL with query
            parameters and path parameters.
          </li>
          <li>
            Share the signed-in user with React Context from the Kambaz
            layout, without turning Context into a database of courses.
          </li>
          <li>
            Put courses and modules in a Zustand store and subscribe from
            any Client Component.
          </li>
          <li>
            Read a Redux Toolkit slice, store, selector, and dispatch so
            you can follow existing codebases.
          </li>
          <li>
            Run side effects with <code>useEffect</code>{" "}after React
            paints.
          </li>
          <li>
            Add, update, and delete Kambaz courses and modules from a
            shared Zustand store so Dashboard and Home stay in sync.
          </li>
        </ul>
        <p>
          Those objectives are best achieved by building along with the
          narration — each Lab 4 component and Kambaz store as it appears —
          rather than reading first and coding later. Glance at the Lab 4
          checklist in <SectionLink to="4.8" />{" "}and the Kambaz checklist
          in <SectionLink to="4.11" />{" "}so the expected coverage is visible
          from the start. Those lists are recaps, not a reason to skip
          ahead: work through each section, then use them to confirm what
          stuck.
        </p>
      </Section>

      <Section id="sec-4-2" title="4.2 Managing State and User Input with Forms">
        <p>
          HTML and CSS describe what a screen looks like. As users
          interact with the application, they generate a stream of events
          that describe what the user did. Events change the State of the
          application and the user interface updates to reflect the new State.
          To practice managing state and user interaction, create a new
          lab directory called <code>lab4</code> in the <code>app/labs</code>
          directory.
        </p>
        <CodeBlock language="shell">{`mkdir app/labs/lab4`}</CodeBlock>
        <p>
          In Next.js, files run on the server by default and cannot
          handle clicks, typing, or dialogs. Those events need the
          browser, so Lab 4 starts with{" "}
          <code>&quot;use client&quot;</code>. Create{" "}
          <code>app/labs/lab4/page.tsx</code>{" "}with that directive and a
          heading. You will import each new component under that heading
          as you go:
        </p>
        <CodeBlock language="tsx" name="Lab4" file="app/labs/lab4/page.tsx">{`"use client";

export default function Lab4() {
  return (
    <div id="wd-lab4">
      <h2>Lab 4</h2>
    </div>
  );
}`}</CodeBlock>
        <p>
          Add a link to the new lab in both{" "}
          <code>app/labs/page.tsx</code>{" "}and{" "}
          <code>app/labs/TOC.tsx</code>, the same two files you updated in
          earlier chapters. Confirm you can reach{" "}
          <LocalUrl href="/labs/lab4" />{" "}from the Labs table of contents
          before continuing. A coverage checklist for Lab 4 is in{" "}
          <SectionLink to="4.8" /> — use it after you have walked through
          the samples, not instead of building them as you read. Those lab
          files are throwaway drills — one idea per component. Kambaz,
          later in this chapter, is the application you keep.
        </p>
        <p>
          Install the two store libraries now so later sections can import
          them. This book uses{" "}
          <Link href="/labs/lab2">Lab 2</Link>&apos;s Tailwind classes for
          buttons and fields instead of Bootstrap:
        </p>
        <CodeBlock language="shell">{`npm install zustand @reduxjs/toolkit react-redux`}</CodeBlock>
      </Section>
    </>
  );
}
