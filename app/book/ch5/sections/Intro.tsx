import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import LocalUrl from "../../components/LocalUrl";
import ChapterLink from "../../components/ChapterLink";
import OfficialLink from "../../components/OfficialLink";
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
          Chapter 5 — Server-Side HTTP APIs with Next.js Route Handlers
        </h1>
        <p className="text-neutral-600">Dr. Jose Annunziato</p>
      </header>

      <section className="space-y-4 text-[1.05rem]">
        <p>
          <ChapterLink to={3} />{" "}taught the UI to render from data.{" "}
          <ChapterLink to={4} />{" "}taught it to change that data in the
          browser — Zustand holds courses and modules, so Add, Edit, and
          Delete update the screens that share those stores. The lists
          still live only in that browser tab. Refresh the page and the
          new course is gone. Open the same Dashboard on a phone and it
          never saw the add. Client state is a scratch pad, not a source
          of truth.
        </p>
        <p>
          The Web already has a language for asking another machine for
          data and sending changes back.{" "}
          <OfficialLink href="https://httpwg.org/specs/rfc9110.html">
            <strong>HTTP</strong>
          </OfficialLink>{" "}
          — HyperText Transfer Protocol — is the request/response
          protocol Sir Tim Berners-Lee designed in 1989–1991 so a browser
          could retrieve a document from a server. The first line of a
          request names a <strong>method</strong>{" "}(what to do) and a{" "}
          <strong>URL</strong>{" "}(which resource). The first line of a
          response names a <strong>status code</strong>{" "}(how it went).
          The body, when there is one, is often{" "}
          <OfficialLink href="https://www.json.org/">
            JSON
          </OfficialLink>{" "}
          today — the same JavaScript Object Notation{" "}
          <SectionLink to="3.4.10" />{" "}already stringifies in the lab.
        </p>
        <p>
          In 2000, Roy Fielding&apos;s dissertation named{" "}
          <OfficialLink href="https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm">
            <strong>REST</strong>
          </OfficialLink>{" "}
          — Representational State Transfer — the architectural style
          that treats the Web as a set of <strong>resources</strong>{" "}
          identified by URLs. A course is a resource at{" "}
          <code>/api/courses/RS101</code>.{" "}
          <strong>CRUD</strong>{" "}(Create, Read, Update, Delete) maps onto
          HTTP methods: <code>POST</code>{" "}creates, <code>GET</code>{" "}
          reads, <code>PUT</code>{" "}replaces, <code>DELETE</code>{" "}
          removes. For two decades many Node courses stood up a separate{" "}
          <OfficialLink href="https://expressjs.com/">
            Express
          </OfficialLink>{" "}
          process to host those routes. This course does not.{" "}
          <OfficialLink href="https://nextjs.org/docs/app/building-your-application/routing/route-handlers">
            Route Handlers
          </OfficialLink>{" "}
          in the App Router live in the same Next.js project as the
          screens: a <code>route.ts</code>{" "}file under{" "}
          <code>app/api</code>{" "}exports <code>GET</code>,{" "}
          <code>POST</code>, <code>PUT</code>, or <code>DELETE</code>,
          and the browser calls them with{" "}
          <OfficialLink href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API">
            <code>fetch</code>
          </OfficialLink>
          . A later chapter will put MongoDB behind those same URLs. For
          now the store is a module-level array — in memory, seeded from
          the JSON <SectionLink to="3.9.2" />{" "}already uses — so you can
          learn the HTTP contract without standing up a database.
        </p>
      </section>

      <Section id="sec-5-1" title="5.1 Learning Objectives">
        <p>By the end of this chapter you will be able to:</p>
        <ul>
          <li>
            Explain HTTP as a request/response protocol and name the
            parts of a message — method, URL, headers, status, and body.
          </li>
          <li>
            Map CRUD operations onto REST resources and the HTTP methods{" "}
            <code>GET</code>, <code>POST</code>, <code>PUT</code>, and{" "}
            <code>DELETE</code>.
          </li>
          <li>
            Recognize common status codes: <code>200</code>,{" "}
            <code>201</code>, <code>400</code>, <code>404</code>, and{" "}
            <code>500</code>.
          </li>
          <li>
            Implement Next.js App Router Route Handlers in{" "}
            <code>app/api/**/route.ts</code>{" "}that read query parameters,{" "}
            <code>await params</code>, and parse a JSON body.
          </li>
          <li>
            Call those handlers from a Client Component with{" "}
            <code>fetch</code>{" "}inside <code>useEffect</code>{" "}and from
            click handlers that POST, PUT, and DELETE.
          </li>
          <li>
            Contrast Server Component data loading with client{" "}
            <code>fetch</code>{" "}— the server can read the store (or{" "}
            <code>await fetch</code>) before HTML is sent.
          </li>
          <li>
            Distinguish Route Handlers from Server Actions and choose
            Route Handlers when you want a public HTTP API.
          </li>
          <li>
            Wire Kambaz courses and modules through{" "}
            <code>/api/courses</code>{" "}and <code>/api/modules</code>{" "}
            with an in-memory store — no Express server and no MongoDB
            yet.
          </li>
        </ul>
        <p>
          Those objectives are best achieved by building along with the
          narration — each Lab 5 handler and Kambaz API as it appears —
          rather than reading first and coding later. Glance at the Lab 5
          checklist in <SectionLink to="5.7" />{" "}and the Kambaz checklist
          in <SectionLink to="5.9.7" />{" "}so the expected coverage is
          visible from the start. Those lists are recaps, not a reason to
          skip ahead: work through each section, then use them to confirm
          what stuck.
        </p>
      </Section>

      <Section id="sec-5-2" title="5.2 HTTP Fundamentals">
        <p>
          HTML, CSS, and JavaScript run in the browser. HTTP is how that
          browser talks to a <strong>server</strong> — a program that
          listens for requests and sends responses. The conversation is
          always one request followed by one response. There is no
          standing connection that pushes updates; if the UI needs new
          data, it sends another request. That is why{" "}
          <ChapterLink to={4} />&apos;s Zustand lists vanish on refresh:
          nothing asked a server to remember them.
        </p>
        <p>
          Keep working in the same{" "}
          <code>kambaz-next-js</code>{" "}project. Under <code>app/labs</code>,
          create <code>lab5</code>{" "}and add <code>page.tsx</code>:
        </p>
        <CodeBlock language="shell">{`mkdir app/labs/lab5`}</CodeBlock>
        <p>
          Start <code>app/labs/lab5/page.tsx</code>{" "}as a single top-level
          component:
        </p>
        <CodeBlock language="tsx" name="Lab5" file="app/labs/lab5/page.tsx">{`export default function Lab5() {
  return (
    <div id="wd-lab5">
      <h2>Lab 5</h2>
    </div>
  );
}`}</CodeBlock>
        <p>
          Add a link to the new lab in both{" "}
          <code>app/labs/page.tsx</code>{" "}and{" "}
          <code>app/labs/TOC.tsx</code>, the same two files you updated
          for <Link href="/labs/lab4">Lab 4</Link>. Confirm you can reach{" "}
          <LocalUrl href="/labs/lab5" />{" "}from the Labs table of contents
          before continuing. A coverage checklist for Lab 5 is in{" "}
          <SectionLink to="5.7" /> — use it after you have walked through
          the samples, not instead of building them as you read.
        </p>
      </Section>
    </>
  );
}
