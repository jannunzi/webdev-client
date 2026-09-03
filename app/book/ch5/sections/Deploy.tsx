import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import OfficialLink from "../../components/OfficialLink";
import CodeBlock from "../../components/CodeBlock";
import { OnYourOwn, WithAI } from "../../components/Practice";

export default function Deploy() {
  return (
    <Section
      id="sec-5-5"
      title="5.5 Deploying RESTful Web Service APIs to a Public Remote Server"
    >
      <p>
        Develop locally until both processes work. Then replicate the
        pair: Next.js already deploys to Vercel; this section deploys
        Express to{" "}
        <OfficialLink href="https://render.com/">Render</OfficialLink>{" "}
        (or Heroku) and points Vercel at that origin.
      </p>

      <Section
        level={3}
        id="sec-5-5-1"
        title="5.5.1 Committing the Node Server to GitHub"
      >
        <p>
          The working source in this book repo is already{" "}
          <code>web-dev-server/</code>{" "}at the Next.js root.
          Delivery still wants a{" "}
          <strong>separate</strong>{" "}GitHub repository. In that folder
          run <code>git init</code>.{" "}
          <code>.gitignore</code>{" "}must list{" "}
          <code>node_modules</code>,{" "}
          <code>.env</code>, and{" "}
          <code>.env.development</code>. Create a public GitHub
          repository named <code>web-dev-server</code>{" "}and
          push. Work on branch{" "}
          <code>a5</code>{" "}in <em>both</em>{" "}repos.
        </p>
        <CodeBlock language="shell">{`git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/<you>/web-dev-server.git
git push -u origin main`}</CodeBlock>
      </Section>

      <Section
        level={3}
        id="sec-5-5-2"
        title="5.5.2 Deploying to Render.com from GitHub"
      >
        <p>
          Render dashboard: <strong>New → Web Service</strong>, connect
          the Node repo. Name it after the repository. Build{" "}
          <code>npm install</code>. Start{" "}
          <code>npm start</code>{" "}(or <code>node index.js</code>).
          Instance type <strong>Free</strong>{" "}— first request after
          idle can be slow. Environment variables:
        </p>
        <ul>
          <li>
            <code>SERVER_ENV</code>{" "}= <code>production</code>
          </li>
          <li>
            <code>CLIENT_URL</code>{" "}= your Vercel origin (no
            trailing slash)
          </li>
          <li>
            <code>SERVER_URL</code>{" "}= the Render hostname{" "}
            <em>without</em>{" "}<code>https://</code>
          </li>
          <li>
            <code>SESSION_SECRET</code>{" "}= a phrase that is not
            committed
          </li>
        </ul>
        <p>
          Confirm the root URL still says Welcome to Full Stack
          Development,{" "}
          <code>/api/courses</code>{" "}returns JSON, and{" "}
          <code>/api/courses/RS101/modules</code>{" "}lists modules. If
          Render rewrote the hostname, edit{" "}
          <code>SERVER_URL</code>{" "}and redeploy.
        </p>
        <OnYourOwn>
          Open the Render hello and courses URLs in a browser before
          touching Vercel.
        </OnYourOwn>
        <WithAI
          prompt={`Do not invent my Render URL. Checklist: Build npm install, Start npm start, SERVER_ENV production, CLIENT_URL is the Vercel origin, SERVER_URL has no https://.`}
        >
          Ask the assistant for the Render checklist — you still paste
          your own URLs:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-5-3"
        title="5.5.3 Configuring the Remote Environment in Vercel"
      >
        <p>
          Project Settings → Environment Variables. Key{" "}
          <code>NEXT_PUBLIC_HTTP_SERVER</code>, value the Render root
          URL <em>with</em>{" "}<code>https://</code>{" "}and{" "}
          <em>no</em>{" "}trailing slash. Save and Redeploy. Lab 5 and
          Dashboard should call Render. In DevTools → Network, none of
          the API calls should still use{" "}
          <code>http://localhost:4000</code>{" "}on the live site.
        </p>
        <p>
          Locally keep{" "}
          <code>.env.development</code>{" "}at{" "}
          <code>http://localhost:4000</code>{" "}so{" "}
          <SectionLink to="5.2" />{" "}LiveDemos stay on the companion
          process. Same <code>httpServer()</code>{" "}helper — only the
          env value changes. Lab 5 LiveDemos do{" "}
          <em>not</em>{" "}need this step; they already work against{" "}
          <code>http://localhost:4000</code>. Route Handler demos in{" "}
          <SectionLink to="5.3" />{" "}keep using same-origin{" "}
          <code>/api</code>{" "}even if that env is unset.
        </p>
      </Section>
    </Section>
  );
}
