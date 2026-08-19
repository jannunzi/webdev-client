import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import LocalUrl from "../../components/LocalUrl";
import ChapterLink from "../../components/ChapterLink";
import CodeBlock from "../../components/CodeBlock";
import BookFigure from "../../components/BookFigure";
import FigureLink from "../../components/FigureLink";
import Link from "next/link";

export default function Intro() {
  return (
    <>
      <header id="intro" className="scroll-mt-6 mb-8">
        <p className="font-sans text-sm uppercase tracking-wide text-neutral-500">
          Developing Full Stack Next.js Web Applications
        </p>
        <h1 className="mt-1 font-sans text-4xl font-semibold leading-tight">
          Chapter 2 — Styling User Interfaces with CSS and Tailwind
        </h1>
        <p className="text-neutral-600">Dr. Jose Annunziato</p>
      </header>

      <section className="space-y-4 text-[1.05rem]">
        <p>
          <ChapterLink to={1} />{" "}built Kambaz screens with plain HTML — functional, but
          visually flat. Browsers apply only minimal default styling to raw
          tags, which is why every heading, paragraph, and list rendered in
          the browser&apos;s stock black-on-white look. This chapter
          introduces <strong>CSS</strong>{" "}(Cascading Style Sheets), the
          language browsers use to control color, spacing, borders, layout,
          and responsiveness — everything beyond the browser&apos;s fixed
          default look for each tag.
        </p>
        <p>
          You will practice CSS in layers of increasing convenience. First,
          plain CSS: the style attribute, external style sheets, and selectors
          that target specific tags, ids, and classes. Once
          the fundamentals click, the chapter introduces{" "}
          <strong>Tailwind CSS</strong>, a utility-class library you compose
          directly in JSX. Along the way you will also decorate the UI with{" "}
          <strong>React Icons</strong>, a library of icon components gathered
          from several icon families.
        </p>
        <p>
          The chapter closes by returning to Kambaz: styling the components you
          already extracted in <ChapterLink to={1} />{" "}(<code>CourseCard</code>,{" "}
          <code>Module</code>, <code>Lesson</code>,{" "}
          <code>AssignmentItem</code>) with Tailwind, and replacing table
          layouts with CSS so Navigation, Dashboard, Modules, Home, and People
          start to resemble the target product — Dashboard (
          <FigureLink to="2a" />), Home (<FigureLink to="2b" />), People (
          <FigureLink to="2c" />), and Account Sign in (<FigureLink to="2d" />).
          Several screens are
          left as guided, self-directed exercises — by now you have the tools
          to style them without a step-by-step walkthrough.
        </p>
        <BookFigure
          sources={[
            {
              id: "fig-2a",
              src: "/images/book/kambaz/dashboard-wide.png",
              alt: "Styled Kambaz Dashboard target",
              caption: "Figure 2a — Dashboard Screen",
            },
            {
              id: "fig-2b",
              src: "/images/book/kambaz/home-wide.png",
              alt: "Styled Kambaz Home target",
              caption: "Figure 2b — Home Screen",
            },
            {
              id: "fig-2c",
              src: "/images/book/kambaz/people.png",
              alt: "Styled Kambaz People target",
              caption: "Figure 2c — People Screen",
            },
            {
              id: "fig-2d",
              src: "/images/book/kambaz/account-signin.png",
              alt: "Styled Kambaz Account Sign in target",
              caption: "Figure 2d — Account Sign in Screen",
            },
          ]}
        />
      </section>

      <Section id="sec-2-1" title="2.1 Styling React Components with CSS">
        <p>
          Lab 1 structured the page; the browser still painted it in default
          black on white. The goal here is to take control of that look —
          color, spacing, and layout — first on a single tag, then from a CSS
          file whose selectors can restyle many elements at once.
        </p>
        <p>
          Keep working in the same{" "}
          <code>kambaz-next-js</code>{" "}project from <ChapterLink to={1} />.
          Under <code>app/labs</code>, create a new directory called{" "}
          <code>lab2</code>{" "}and add <code>page.tsx</code>{" "}to hold the
          exercises, mirroring the structure you already used for{" "}
          <code>app/labs/lab1</code>:
        </p>
        <CodeBlock language="shell">{`mkdir app/labs/lab2`}</CodeBlock>
        <p>
          Start <code>app/labs/lab2/page.tsx</code>{" "}the same way Lab 1
          started — a single top-level component you will grow one exercise
          at a time:
        </p>
        <CodeBlock
          language="tsx"
          name="Lab2"
          file="app/labs/lab2/page.tsx"
        >{`export default function Lab2() {
  return (
    <div id="wd-lab2">
      <h2>Lab 2 - Cascading Style Sheets</h2>
    </div>
  );
}`}</CodeBlock>
        <p>
          Add a link to the new lab in both{" "}
          <code>app/labs/page.tsx</code>{" "}and{" "}
          <code>app/labs/TOC.tsx</code>, the same two files you updated for{" "}
          <Link href="/labs/lab1">Lab 1</Link>{" "}in <SectionLink to="1.3.11" />–<SectionLink to="1.3.12" />. Confirm
          you can reach{" "}
          <LocalUrl href="/labs/lab2" />{" "}from the Labs table
          of contents before continuing.
        </p>
      </Section>
    </>
  );
}
