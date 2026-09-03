import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import CodeBlock from "../../components/CodeBlock";
import Link from "next/link";

export default function Deliverables() {
  return (
    <Section id="sec-6-5" title="6.5 Deliverables">
      <p>
        Finish every Lab 6 exercise, the Mongoose schemas, models, and
        DAOs, and the React screens that call them. Work on branch{" "}
        <code>a6</code> in <em>both</em> repositories. Deploy the UI to
        Vercel and a <strong>new</strong> Render (or Heroku) service so
        you do not overwrite the <ChapterLink to={5} />{" "}
        <code>a5</code> API while TAs are grading. Confirm Dashboard
        courses and modules come from the database.
      </p>
      <CodeBlock language="shell">{`# in web-dev-client
git checkout -b a6
git add .
git commit -am "a6 MongoDB"
git push -u origin a6

# in web-dev-server
git checkout -b a6
git add .
git commit -am "a6 MongoDB"
git push -u origin a6`}</CodeBlock>
      <ol>
        <li>
          Labs TOC still lists every lab, your full name,{" "}
          <code>wd-github</code> to the Next.js repo, plus links to
          the Node GitHub repo and the new Render (or Heroku) root URL.
        </li>
        <li>
          On Render, set{" "}
          <code>DATABASE_CONNECTION_STRING</code> to the Atlas URI
          with <code>kambaz</code> in the path (
          <SectionLink to="6.3.1.2" />) and the session env vars from{" "}
          <SectionLink to="6.3.2" />.
        </li>
        <li>
          Disable Vercel Deployment Protection so graders can open the{" "}
          <code>a6</code> preview without signing in (
          <SectionLink to="1.6" />).
        </li>
        <li>
          In Canvas, submit the Vercel URL for the{" "}
          <code>a6</code> branch deployment.
        </li>
      </ol>
      <p>
        Continue in <Link href="/labs">Labs</Link>, browse{" "}
        <Link href="/labs/lab6/intermediates">Lab 6 steps</Link>, or
        open <Link href="/account/signin">Kambaz</Link>.
      </p>
    </Section>
  );
}
