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
          Chapter 6 — Integrating React with MongoDB
        </h1>
        <p className="text-neutral-600">Dr. Jose Annunziato</p>
      </header>

      <section className="space-y-4 text-[1.05rem]">
        <p>
          There are two main families of databases.{" "}
          <strong>Relational</strong> databases — MySQL, SQL Server,
          Postgres — store rows in tables. A{" "}
          <code>courses</code> table holds every course; a{" "}
          <code>users</code> table holds every account. Columns are
          usually primitives (strings, numbers, dates, booleans). A
          column such as <code>instructor</code> can{" "}
          <em>relate</em> to a row in <code>users</code>. That
          relationship is where the family gets its name.{" "}
          <strong>SQL</strong> (Structured Query Language) is how you
          ask those tables for rows that match a predicate.
        </p>
        <p>
          <strong>Non-relational</strong> /{" "}
          <strong>NoSQL</strong> databases — MongoDB, Firebase,
          Couchbase — store <strong>documents</strong> in{" "}
          <strong>collections</strong>. A document is a JSON-shaped
          object: primitives plus nested objects and arrays. The
          database does not require a schema up front. The application
          decides the shape. That is a good fit for JavaScript: the
          same objects you already map in React can live on disk.
        </p>
        <p>
          <ChapterLink to={5} /> moved Kambaz state onto an Express
          process. Restart Node and the arrays reseed from JS copies of
          the JSON files. This chapter stores those collections in{" "}
          <OfficialLink href="https://www.mongodb.com/">
            MongoDB
          </OfficialLink>
          . <SectionLink to="6.1" /> installs a local instance and
          Compass. <SectionLink to="6.2" /> connects with{" "}
          <OfficialLink href="https://mongoosejs.com/">
            Mongoose
          </OfficialLink>
          : schemas, models, DAOs, then CRUD routes the React client
          already calls. <SectionLink to="6.3" /> points the same
          connection string at Atlas. <SectionLink to="6.4" /> migrates
          courses, modules, enrollments, and assignments.
        </p>
        <p>
          Right to left: a <code>kambaz</code> database with{" "}
          <code>users</code>, <code>courses</code>,{" "}
          <code>modules</code>, <code>assignments</code>,{" "}
          <code>enrollments</code>. Mongoose connects from Node. A
          schema describes a collection; a model implements generic
          CRUD; a DAO names the Kambaz operations; Express exposes
          them as REST; axios in the Next.js app calls those URLs.
        </p>
      </section>

      <Section id="sec-6-1" title="6.1 Working with a Local MongoDB Instance">
        <p>
          MongoDB stores JSON documents, which is why it sits so
          comfortably next to Node and React. This section installs the
          database, opens Compass, creates <code>kambaz</code>, and
          imports the files you already used in{" "}
          <SectionLink to="3.9.2" />. Glance at{" "}
          <LocalUrl href="/labs/lab6" /> as you go — the LiveDemos
          speak the same API the Express DAOs implement.
        </p>
      </Section>
    </>
  );
}
