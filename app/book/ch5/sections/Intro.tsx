import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import OfficialLink from "../../components/OfficialLink";
import LocalUrl from "../../components/LocalUrl";

export default function Intro() {
  return (
    <>
      <header id="intro" className="scroll-mt-6 mb-8">
        <p className="font-sans text-sm uppercase tracking-wide text-neutral-500">
          Developing Full Stack Next.js Web Applications
        </p>
        <h1 className="mt-1 font-sans text-4xl font-semibold leading-tight">
          Chapter 5 — Implementing RESTful Web APIs with Express.js
        </h1>
        <p className="text-neutral-600">Dr. Jose Annunziato</p>
      </header>

      <section className="space-y-4 text-[1.05rem]">
        <p>
          During the 1990s the World Wide Web grew into a place where
          businesses talked to customers (
          <strong>B2C</strong>) and to each other (
          <strong>B2B</strong>). Storefronts let people browse, order, and
          return without standing at a counter. Those screens are only half
          the system. Up through <ChapterLink to={4} />{" "}Kambaz rendered
          and edited{" "}
          <code>courses.json</code>{" "}and{" "}
          <code>modules.json</code>{" "}in the browser. Refresh, and the
          adds are gone. A JavaScript client — browser, console, or TV box
          — cannot be the permanent store.
        </p>
        <p>
          This chapter builds the other half: an{" "}
          <OfficialLink href="https://expressjs.com/">
            Express.js
          </OfficialLink>{" "}
          HTTP server in a{" "}
          <strong>sibling project</strong>{" "}named{" "}
          <code>kambaz-node-server-app</code>{" "}— not inside the Next.js
          app directory. Locally the UI is{" "}
          <code>next dev</code>{" "}on port 3000 and Express is{" "}
          <code>nodemon</code>{" "}/{" "}
          <code>npm start</code>{" "}on port 4000, with{" "}
          <code>NEXT_PUBLIC_HTTP_SERVER=http://localhost:4000</code>.{" "}
          <SectionLink to="5.5" />{" "}deploys that same server; you do
          not need a remote host for the labs.{" "}
          <OfficialLink href="https://axios-http.com/">
            axios
          </OfficialLink>{" "}
          talks to Express.{" "}
          <SectionLink to="5.3" />{" "}adds App Router Route Handlers as a
          same-app alternative — a section, not the chapter. MongoDB is{" "}
          <ChapterLink to={6} />.
        </p>
      </section>

      <Section id="sec-5-1" title="5.1 Installing and Configuring an HTTP Web Server">
        <p>
          Kambaz is the <strong>client</strong> in a client/server
          architecture. Users click; the client sends an HTTP request; the
          server runs logic the browser should not own and responds. This
          section stands up that server with{" "}
          <OfficialLink href="https://nodejs.org/">Node.js</OfficialLink>.
        </p>
        <p>
          Glance at the Lab 5 checklist as you go, then confirm coverage
          after you have built each sample —{" "}
          <SectionLink to="5.2" />{" "}is the walkthrough, not a skip list.
          Open <LocalUrl href="/labs/lab5" />{" "}once the companion server
          is running.
        </p>
      </Section>
    </>
  );
}
