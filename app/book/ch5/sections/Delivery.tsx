import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import CodeBlock from "../../components/CodeBlock";
import Link from "next/link";

export default function Delivery() {
  return (
    <Section id="sec-5-12" title="5.12 Delivery">
      <p>
        Submit this chapter&apos;s work as a new branch on the same{" "}
        <code>kambaz-next-js</code>{" "}repository and deployments from
        earlier chapters, so graders can compare{" "}
        <ChapterLink to={4} />&apos;s client-state screens against this
        chapter&apos;s HTTP APIs — both the same-app Route Handlers and
        the separate Render server — side by side.
      </p>
      <ol>
        <li>
          Finish every exercise described in this chapter inside the same{" "}
          <code>kambaz-next-js</code>{" "}project used in <ChapterLink to={1} />,{" "}
          <ChapterLink to={2} />, <ChapterLink to={3} />, and{" "}
          <ChapterLink to={4} />. Lab 5 must demonstrate both server
          models. Kambaz courses and modules must run against Route
          Handlers <em>and</em>{" "}against the Express routes in{" "}
          <code>server/</code>.
        </li>
        <li>
          Create a branch named <code>a5</code>, then add, commit, and push
          it to the same GitHub repository from <SectionLink to="1.5" />:
        </li>
      </ol>
      <CodeBlock language="shell">{`git checkout -b a5
git add .
git commit -am "a5 HTTP APIs"
git push -u origin a5`}</CodeBlock>
      <ol start={3}>
        <li>
          In Vercel, configure the project to deploy every branch to its own
          URL: open the project&apos;s <strong>Settings → Git</strong>{" "}and
          enable deployments for all branches (some Vercel plans expose this
          under <strong>Build & Deployment → Branches</strong>). From then on,
          each push to <code>a5</code>{" "}gets its own preview URL that
          contains the branch name, separate from your <ChapterLink to={4} />{" "}
          <code>a4</code>{" "}deployment.
        </li>
        <li>
          Deploy <code>server/</code>{" "}to Render.com as in{" "}
          <SectionLink to="5.8" />: Web Service, root directory{" "}
          <code>server</code>, branch <code>a5</code>, start{" "}
          <code>npm start</code>. Set <code>FRONTEND_ORIGIN</code>{" "}to
          your Vercel origin. Confirm{" "}
          <code>https://your-service.onrender.com/api/lab5/hello</code>{" "}
          returns the Express greeting.
        </li>
        <li>
          On the Vercel project, set{" "}
          <code>NEXT_PUBLIC_API_BASE</code>{" "}to that Render origin and
          redeploy <code>a5</code>{" "}so Lab 5 and Kambaz call the remote
          API (<SectionLink to="5.8.4" />).
        </li>
        <li>
          Confirm <code>app/labs/TOC.tsx</code>{" "}and{" "}
          <code>app/labs/page.tsx</code>{" "}still list every lab and Kambaz,
          plus a link to your GitHub repository with id{" "}
          <code>wd-github</code>{" "}and your full name (first name first,
          last name second, matching Canvas) on the Labs page — the same
          requirements from <SectionLink to="1.7" />, now revisited for this chapter.
        </li>
        <li>
          Push any remaining changes to the <code>a5</code>{" "}branch and
          confirm the branch deployment on Vercel and the Web Service on
          Render reflect them.
        </li>
        <li>
          In Canvas, submit the GitHub repository URL (pointed at the{" "}
          <code>a5</code>{" "}branch), the Vercel deployment URL for that
          branch, <em>and</em>{" "}the Render API URL. Disable Vercel&apos;s
          Deployment Protection on that deployment, as in{" "}
          <SectionLink to="1.6" />, so graders can open the UI without
          signing in.
        </li>
      </ol>
      <p>
        Continue practicing in{" "}
        <Link href="/labs">Labs</Link>, browse{" "}
        <Link href="/labs/lab5/intermediates">Lab 5 intermediate steps</Link>,
        or open the live{" "}
        <Link href="/">Kambaz</Link>{" "}prototype to create courses and
        modules through <code>/api</code>{" "}— same-origin or Render,
        depending on <code>NEXT_PUBLIC_API_BASE</code>.
      </p>
    </Section>
  );
}
