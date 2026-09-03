import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import CodeBlock from "../../components/CodeBlock";
import Link from "next/link";

export default function Conclusion() {
  return (
    <>
      <Section id="sec-5-6" title="5.6 Conclusion">
        <p>
          This chapter created HTTP servers with Node.js, implemented
          RESTful services with Express, and practiced sending and
          updating data over HTTP. The Next.js UI is the client; Express
          is the server.{" "}
          <SectionLink to="5.3" />{" "}showed Route Handlers as a
          same-app option. The next chapter adds MongoDB so the arrays
          survive a process restart.
        </p>
      </Section>

      <Section id="sec-5-7" title="5.7 Deliverables">
        <p>
          Complete every Lab 5 exercise, the course and module routes
          (and assignment routes) on the server, and the matching
          clients in the React project. Work on branch{" "}
          <code>a5</code>{" "}in <em>both</em>{" "}repositories. Deploy the
          UI to Vercel and the API to Render (or Heroku) and confirm
          they integrate.
        </p>
        <CodeBlock language="shell">{`# in kambaz-next-js
git checkout -b a5
git add .
git commit -am "a5 HTTP APIs"
git push -u origin a5

# in kambaz-node-server-app
git checkout -b a5
git add .
git commit -am "a5 HTTP APIs"
git push -u origin a5`}</CodeBlock>
        <ol>
          <li>
            Labs TOC still lists every lab, your full name,{" "}
            <code>wd-github</code>{" "}to the Next.js repo, plus links to
            the Node GitHub repo and the Render (or Heroku) root URL.
          </li>
          <li>
            Disable Vercel Deployment Protection so graders can open
            the <code>a5</code>{" "}preview without signing in (
            <SectionLink to="1.6" />).
          </li>
          <li>
            In Canvas, submit the Vercel URL for the{" "}
            <code>a5</code>{" "}branch deployment. Graders will also use
            the Render API and both GitHub <code>a5</code>{" "}branches.
          </li>
        </ol>
        <p>
          Continue in <Link href="/labs">Labs</Link>, browse{" "}
          <Link href="/labs/lab5/intermediates">Lab 5 steps</Link>, or
          open <Link href="/">Kambaz</Link>.{" "}
          <ChapterLink to={6} />{" "}replaces the in-memory arrays with
          MongoDB.
        </p>
      </Section>
    </>
  );
}
