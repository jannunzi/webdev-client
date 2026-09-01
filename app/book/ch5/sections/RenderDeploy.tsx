import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import OfficialLink from "../../components/OfficialLink";
import CodeBlock from "../../components/CodeBlock";
import { OnYourOwn, WithAI } from "../../components/Practice";

export default function RenderDeploy() {
  return (
    <Section
      id="sec-5-8"
      title="5.8 Deploying the API to Render.com"
    >
      <p>
        <SectionLink to="1.6" />{" "}put the Next.js UI on{" "}
        <OfficialLink href="https://vercel.com/">Vercel</OfficialLink>.
        The separate Node process needs a host that runs a long-lived
        server, not a serverless function per request.{" "}
        <OfficialLink href="https://render.com/">
          Render
        </OfficialLink>{" "}
        is that host for this course: a{" "}
        <OfficialLink href="https://render.com/docs/web-services">
          Web Service
        </OfficialLink>{" "}
        clones your GitHub repo, runs{" "}
        <code>npm install</code>{" "}in <code>server/</code>, then{" "}
        <code>npm start</code>, and keeps{" "}
        <code>tsx index.ts</code>{" "}listening on the port Render
        assigns.
      </p>
      <p>
        You will submit both URLs in{" "}
        <SectionLink to="5.12" />: the Vercel app{" "}
        <em>and</em>{" "}the Render API. Do not deploy the Next.js app
        to Render for this chapter, and do not deploy Express to
        Vercel — each platform is doing the job it is good at.
      </p>

      <Section
        level={3}
        id="sec-5-8-1"
        title="5.8.1 A Render Web Service"
      >
        <p>
          Create a Render account with the same GitHub login you used
          in <SectionLink to="1.5" />. In the dashboard,{" "}
          <strong>New → Web Service</strong>, connect the{" "}
          <code>kambaz-next-js</code>{" "}repository. Official walkthrough:{" "}
          <OfficialLink href="https://render.com/docs/deploy-node-express-app">
            Deploy a Node Express App on Render
          </OfficialLink>
          . This repo is a monorepo — the Next.js app at the root and
          the API under <code>server/</code> — so the next subsection
          matters more than the happy-path screenshot.
        </p>
        <p>
          Pick the <strong>Free</strong> instance type for the course.
          Free Web Services{" "}
          <OfficialLink href="https://render.com/docs/free">
            spin down
          </OfficialLink>{" "}
          after idle time. The first request after a nap can take
          half a minute while Render boots Node. That is expected.
          Refresh once; do not assume the API is broken because the
          first GET was slow.
        </p>
        <OnYourOwn>
          Create the Web Service
          and leave the settings form open. Do not click Create Web
          Service until the root directory and start command in{" "}
          <SectionLink to="5.8.2" />{" "}are filled in.
        </OnYourOwn>
        <WithAI
          prompt={`Do not invent a second GitHub repo. In three bullets, list what I click in the Render dashboard to attach my existing kambaz-next-js repository as a Web Service. Mention New → Web Service and connecting GitHub.`}
        >
          Ask the assistant for the click path — you still sign in
          yourself:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-8-2"
        title="5.8.2 Root Directory and Start Command"
      >
        <p>
          If you leave <strong>Root Directory</strong> empty, Render
          sees the Next.js <code>package.json</code>{" "}and will try to
          start the UI. Set:
        </p>
        <ul>
          <li>
            <strong>Language</strong> — Node
          </li>
          <li>
            <strong>Root Directory</strong> — <code>server</code>
          </li>
          <li>
            <strong>Branch</strong> — <code>a5</code>{" "}(the same
            delivery branch as <SectionLink to="5.12" />)
          </li>
          <li>
            <strong>Build Command</strong> — <code>npm install</code>
          </li>
          <li>
            <strong>Start Command</strong> — <code>npm start</code>
          </li>
        </ul>
        <p>
          Root Directory tells Render to treat{" "}
          <code>server/package.json</code>{" "}as the app.{" "}
          <code>npm start</code>{" "}runs <code>tsx index.ts</code>.
          Render sets <code>PORT</code>{" "}for you — that is why{" "}
          <SectionLink to="5.7.2" />{" "}reads{" "}
          <code>process.env.PORT</code>{" "}instead of hard-coding 4000
          in production. After the first deploy succeeds, copy the
          service URL. It looks like{" "}
          <code>https://kambaz-node-server-xxxx.onrender.com</code>{" "}
          with no trailing path.{" "}
          <code>https://…onrender.com/api/lab5/hello</code>{" "}should
          show the Express greeting in a browser tab.
        </p>
        <OnYourOwn>
          Confirm the hello URL
          on Render returns JSON. If the build fails, open the Render
          logs and look for a missing{" "}
          <code>server/package.json</code>{" "}(wrong root directory) or
          a bind error (you ignored <code>PORT</code>).
        </OnYourOwn>
        <WithAI
          prompt={`Do not change my Express routes. My Render build failed. Give a short checklist: Root Directory must be server, Build Command npm install, Start Command npm start, and index.ts must listen on process.env.PORT.`}
        >
          Ask the assistant for a deploy checklist — you still read
          your own logs:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-8-3"
        title="5.8.3 Environment Variables"
      >
        <p>
          On the Render service, open{" "}
          <strong>Environment</strong>{" "}and add{" "}
          <code>FRONTEND_ORIGIN</code>. The value is the origin of
          the Next.js UI that will call this API — your Vercel URL,
          including <code>https://</code>{" "}and{" "}
          <em>no</em>{" "}trailing slash, for example{" "}
          <code>https://kambaz-next-js-a5.vercel.app</code>. If you
          also test the production API from{" "}
          <code>next dev</code>, add a comma and localhost:
        </p>
        <CodeBlock language="shell">{`FRONTEND_ORIGIN=https://your-a5.vercel.app,http://localhost:3000`}</CodeBlock>
        <p>
          That list is what{" "}
          <SectionLink to="5.7.3" />{" "}puts into{" "}
          <code>cors({ origin })</code>. After you save env vars,
          Render redeploys. If{" "}
          <code>FRONTEND_ORIGIN</code>{" "}is wrong, hello in a raw
          browser tab still works (no CORS on a top-level navigation)
          but <code>fetch</code>{" "}from Vercel fails in the console.
        </p>
        <OnYourOwn>
          Set{" "}
          <code>FRONTEND_ORIGIN</code>{" "}to your Vercel origin and
          redeploy. Keep the Render URL handy for the next section.
        </OnYourOwn>
        <WithAI
          prompt={`Do not invent a Vercel domain for me. Explain the difference between FRONTEND_ORIGIN on Render (the UI origin allowed by CORS) and NEXT_PUBLIC_API_BASE on Vercel (the API host the UI calls). Two sentences.`}
        >
          Ask the assistant to name which var lives where — you still
          paste your own URLs:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-8-4"
        title="5.8.4 Pointing Next.js at Render"
      >
        <p>
          In the Vercel project,{" "}
          <strong>Settings → Environment Variables</strong>, add{" "}
          <code>NEXT_PUBLIC_API_BASE</code>{" "}with the Render origin —
          scheme and host only, no{" "}
          <code>/api</code>{" "}suffix:
        </p>
        <CodeBlock language="shell">{`NEXT_PUBLIC_API_BASE=https://your-service.onrender.com`}</CodeBlock>
        <p>
          Apply it to the Preview environment that deploys{" "}
          <code>a5</code>{" "}(and Production if you use that branch
          there). Redeploy the{" "}
          <code>a5</code>{" "}deployment so the client bundle inlines
          the new value. Lab 5&apos;s RemoteHello should now print the
          Express greeting from Render, and{" "}
          <code>apiUrl("/api/lab5/hello")</code>{" "}should be the full
          Render URL. Clear the variable — or omit it — and the same
          screens fall back to same-origin Route Handlers.
        </p>
        <p>
          Kambaz uses the same helper in{" "}
          <SectionLink to="5.11.7" />. Switching the env var switches
          Dashboard and Modules from{" "}
          <code>/api/courses</code>{" "}on Vercel to{" "}
          <code>https://your-service.onrender.com/api/courses</code>{" "}
          without editing every <code>fetch</code>{" "}by hand.
        </p>
        <OnYourOwn>
          Redeploy Vercel, open
          Lab 5 on the preview URL, and confirm RemoteHello shows{" "}
          <code>Hello World from the Express server</code>. Then open
          the raw Render hello URL in another tab and compare.
        </OnYourOwn>
        <WithAI
          prompt={`In app/lib/apiUrl.ts, keep my implementation. Add a one-line comment above apiUrl that says empty NEXT_PUBLIC_API_BASE means same-origin Route Handlers. Do not hard-code a Render URL.`}
        >
          Ask the assistant to comment the helper — you still set the
          Vercel env var:
        </WithAI>
      </Section>
    </Section>
  );
}
