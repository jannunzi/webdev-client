import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import LocalUrl from "../../components/LocalUrl";
import ChapterLink from "../../components/ChapterLink";
import CodeBlock from "../../components/CodeBlock";
import Link from "next/link";

export default function Intro() {
  return (
    <>
      <header id="intro" className="scroll-mt-6 mb-8">
        <p className="font-sans text-sm uppercase tracking-wide text-neutral-500">
          Developing Full Stack Next.js Web Applications
        </p>
        <h1 className="mt-1 font-sans text-4xl font-semibold leading-tight">
          Chapter 3 — Creating Single Page Applications with JavaScript
        </h1>
        <p className="text-neutral-600">Dr. Jose Annunziato</p>
      </header>

      <section className="space-y-4 text-[1.05rem]">
        <p>
          <ChapterLink to={1} />{" "}and <ChapterLink to={2} />{" "}gave Kambaz
          structure and style. The screens still show the same hardcoded
          markup no matter who is signed in or which course you open. The
          goal of this chapter is to take control of <strong>data and
          logic</strong> — variables, functions, arrays, and objects — so
          the UI can change with the data instead of living as fixed HTML.
        </p>
        <p>
          <strong>JavaScript</strong>, officially{" "}
          <strong>ECMAScript</strong>, is the language browsers run to
          script pages. The name ECMAScript comes from the European Computer
          Manufacturers Association (<strong>ECMA</strong>), which
          standardized the language in 1997 so implementations would agree.
          Developers still say &quot;JavaScript&quot;; ECMAScript is the
          formal name. A major milestone arrived in 2015 as{" "}
          <strong>ECMAScript 2015</strong> (<strong>ES6</strong>): arrow
          functions, <code>let</code>/<code>const</code>, template literals,
          modules, and more — the dialect this course writes in. Those
          features are what libraries like React use to build{" "}
          <strong>Single Page Applications</strong> (<strong>SPA</strong>s):
          one HTML document whose views swap as the URL changes, without a
          full reload for every screen.
        </p>
        <p>
          <strong>TypeScript</strong>, released by Microsoft in 2012, is a
          superset of JavaScript that adds static types. It compiles to
          plain JavaScript, so browsers and Node.js run the result. This
          course writes React in <code>.tsx</code>{" "}files — JavaScript with
          type annotations on parameters and props. The runtime behavior is
          still JavaScript; the types catch mistakes before the browser
          does.
        </p>
      </section>

      <Section id="sec-3-1" title="3.1 Learning Objectives">
        <p>By the end of this chapter you will be able to:</p>
        <ul>
          <li>
            Understand the basics of JavaScript and its role in Web
            development.
          </li>
          <li>
            Declare variables, constants, and data types, including{" "}
            <code>null</code>{" "}and <code>undefined</code>.
          </li>
          <li>Work with Boolean values and conditionals.</li>
          <li>
            Use the ternary operator and short-circuit{" "}
            <code>&amp;&amp;</code>{" "}to generate conditional output.
          </li>
          <li>
            Define functions, including ES6 arrow functions and implied
            returns.
          </li>
          <li>Implement template literals for string interpolation.</li>
          <li>
            Manipulate arrays and objects, including{" "}
            <code>map</code>, <code>find</code>, <code>filter</code>,{" "}
            <code>findIndex</code>, <code>includes</code>, <code>some</code>,{" "}
            <code>every</code>, and <code>reduce</code>.
          </li>
          <li>
            Convert data with JSON (<code>JSON.stringify</code>) and apply
            the spread operator, destructuring, optional chaining, and
            nullish coalescing.
          </li>
          <li>
            Apply dynamic styling with HTML classes and style objects.
          </li>
          <li>
            Distinguish Next.js client components from server components.
          </li>
          <li>
            Parameterize React components with props,{" "}
            <code>children</code>, the pathname, and path parameters.
          </li>
          <li>
            Implement a data-driven Kambaz application — navigation,
            dashboard, courses, modules, assignments, and people.
          </li>
          <li>
            Understand the structure of a single-page application (SPA)
            using React.
          </li>
        </ul>
      </Section>

      <Section id="sec-3-2" title="3.2 Introduction to JavaScript">
        <p>
          HTML and CSS on their own are static: the same tags and styles
          render the same way every time. JavaScript adds{" "}
          <strong>logic</strong>{" "}to the page — conditionals, iteration,
          and data-driven rendering — so content can change with the data
          instead of living as copy-pasted markup. One{" "}
          <code>map</code>{" "}over an array of courses can replace eight
          nearly identical cards; a ternary can swap a login prompt for a
          welcome heading. In the following exercises we will learn how to
          write that logic ourselves — conditionals, iteration, and
          data-driven, dynamic content — as components imported into a Lab
          3 page you grow as you go, the same pattern as Lab 1 and Lab 2.
          Those lab files are throwaway drills — one idea per component.
          Kambaz, later in this chapter and across the rest of the course,
          is the application you keep.
        </p>
        <p>
          Keep working in the same{" "}
          <code>kambaz-next-js</code>{" "}project. Under <code>app/labs</code>,
          create <code>lab3</code>{" "}and add <code>page.tsx</code>:
        </p>
        <CodeBlock language="shell">{`mkdir app/labs/lab3`}</CodeBlock>
        <p>
          Start <code>app/labs/lab3/page.tsx</code>{" "}as a single top-level
          component:
        </p>
        <CodeBlock language="tsx" name="Lab3" file="app/labs/lab3/page.tsx">{`export default function Lab3() {
  return (
    <div id="wd-lab3">
      <h2>Lab 3</h2>
    </div>
  );
}`}</CodeBlock>
        <p>
          Add a link to the new lab in both{" "}
          <code>app/labs/page.tsx</code>{" "}and{" "}
          <code>app/labs/TOC.tsx</code>, the same two files you updated for{" "}
          <Link href="/labs/lab2">Lab 2</Link>{" "}in <SectionLink to="1.3.11" />
          –<SectionLink to="1.3.12" />. Confirm you can reach{" "}
          <LocalUrl href="/labs/lab3" />{" "}from the Labs table of contents
          before continuing.
        </p>
      </Section>
    </>
  );
}
