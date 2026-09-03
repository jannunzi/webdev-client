import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import OfficialLink from "../../components/OfficialLink";
import CodeBlock from "../../components/CodeBlock";
import { OnYourOwn, WithAI } from "../../components/Practice";

export default function Atlas() {
  return (
    <Section
      id="sec-6-3"
      title="6.3 Integrating with MongoDB Hosted in Atlas Cloud Service"
    >
      <p>
        On your laptop, Express talks to <code>127.0.0.1:27017</code>.
        On Render or Heroku that address is the VM itself — empty.{" "}
        <OfficialLink href="https://www.mongodb.com/atlas">
          MongoDB Atlas
        </OfficialLink>{" "}
        hosts a cluster and hands you a connection string. This section
        creates that cluster, connects Compass to it, then points the
        Node env var at the same URI.
      </p>

      <Section
        level={3}
        id="sec-6-3-1"
        title="6.3.1 Setting up MongoDB Atlas"
      >
        <p>
          Sign in at{" "}
          <OfficialLink href="https://www.mongodb.com/">
            mongodb.com
          </OfficialLink>{" "}
          with Google or email. On Deploy your cluster, pick the{" "}
          <strong>Free</strong> plan. Name the cluster{" "}
          <code>Kambaz</code>. Choose a provider and a nearby region
          (for example AWS, North Virginia) and Create Deployment.
          Create a database user you will remember — Mongoose uses
          these credentials from Render. Jose&apos;s example was{" "}
          <code>giuseppi</code> / a password you should{" "}
          <em>not</em> commit.
        </p>

        <Section
          level={3}
          id="sec-6-3-1-1"
          title="6.3.1.1 Connecting to a Remote Database from Compass"
        >
          <p>
            Choose Compass as the connection method and copy the URI.
            It looks like:
          </p>
          <CodeBlock language="shell">{`mongodb+srv://USER:PASSWORD@kambaz.jxui0bc.mongodb.net/`}</CodeBlock>
          <p>
            In Compass: Connect → New Window, paste the URI, Connect.
            Import <code>courses</code>, <code>modules</code>, and{" "}
            <code>users</code> into the remote database the same way
            you did locally.
          </p>
        </Section>

        <Section
          level={3}
          id="sec-6-3-1-2"
          title="6.3.1.2 Connecting from Node.js"
        >
          <p>
            Network Access → + ADD IP ADDRESS → ALLOW ACCESS FROM
            ANYWHERE (<code>0.0.0.0/0</code>). Then Connect → Drivers
            → Node.js 5.5 or later, and copy the application URI. Put
            the database name <code>kambaz</code> in the path, between
            the last slash and the question mark:
          </p>
          <CodeBlock language="shell">{`mongodb+srv://USER:PASSWORD@kambaz.jxui0bc.mongodb.net/kambaz?retryWrites=true&w=majority&appName=Kambaz`}</CodeBlock>
          <p>
            Push branch <code>a6</code> and deploy a{" "}
            <strong>new</strong> Render (or Heroku) service — do not
            overwrite the Chapter 5 URL while TAs are grading. Set{" "}
            <code>DATABASE_CONNECTION_STRING</code> to that URI
            (password filled in). Redeploy so the env var is picked
            up. On Vercel, point{" "}
            <code>NEXT_PUBLIC_HTTP_SERVER</code> at the new Express
            origin, no trailing slash.
          </p>
        </Section>
      </Section>

      <Section
        level={3}
        id="sec-6-3-2"
        title="6.3.2 Configuring Session in Remote Servers"
      >
        <p>
          Render Environment needs the same keys as local{" "}
          <code>.env</code>, with production values. After you change
          them, Manual Deploy → Deploy latest commit. Use your Atlas
          URI, your Vercel <code>a6</code> origin, and your Render
          host. <code>SERVER_URL</code> is the host only — no{" "}
          <code>https://</code>.
        </p>
        <CodeBlock language="shell">{`DATABASE_CONNECTION_STRING=mongodb+srv://USER:PASSWORD@cluster/kambaz?retryWrites=true&w=majority
CLIENT_URL=https://your-a6-preview.vercel.app
SERVER_URL=your-web-dev-server.onrender.com
SERVER_ENV=production
SESSION_SECRET=a long random phrase`}</CodeBlock>
        <OnYourOwn>
          Create the free Atlas cluster and copy the Drivers URI with{" "}
          <code>kambaz</code> in the path. Do not paste the password
          into the book or a commit.
        </OnYourOwn>
        <WithAI
          prompt={`Check web-dev-server/.env.example lists DATABASE_CONNECTION_STRING, CLIENT_URL, SERVER_URL, SERVER_ENV, and SESSION_SECRET. Do not add real credentials.`}
        >
          Ask the assistant to confirm the env keys only:
        </WithAI>
      </Section>
    </Section>
  );
}
