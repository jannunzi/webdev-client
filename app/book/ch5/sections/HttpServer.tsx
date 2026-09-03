import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import OfficialLink from "../../components/OfficialLink";
import CodeBlock from "../../components/CodeBlock";
import { OnYourOwn, WithAI } from "../../components/Practice";

export default function HttpServer() {
  return (
    <>
      <Section
        level={3}
        id="sec-5-1-1"
        title="5.1.1 Introduction to Node.js"
      >
        <p>
          JavaScript began as a browser language.{" "}
          <OfficialLink href="https://nodejs.org/">
            Node.js
          </OfficialLink>{" "}
          is a runtime that interprets the same language{" "}
          <em>outside</em>{" "}the browser — a desktop terminal, a cloud VM.
          Browser JavaScript cannot open the filesystem or a database and
          has a tight network sandbox. Node can. What Node usually lacks
          is a rich UI; that stays in React.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-5-1-2"
        title="5.1.2 Installing Node.js"
      >
        <p>
          You already installed Node for earlier chapters. Confirm it:
        </p>
        <CodeBlock language="shell">{`node -v
# v22.11.0`}</CodeBlock>
        <p>
          If the command fails, install from{" "}
          <OfficialLink href="https://nodejs.org/en">
            nodejs.org
          </OfficialLink>{" "}
          and run <code>node -v</code>{" "}again.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-5-1-3"
        title="5.1.3 Creating a Node.js Project"
      >
        <p>
          <strong>NOTE: DO NOT</strong>{" "}create the Node project inside{" "}
          <code>kambaz-next-js</code>. The two directories are{" "}
          <strong>siblings</strong>{" "}under the same parent:
        </p>
        <CodeBlock language="shell">{`mkdir kambaz-node-server-app
cd kambaz-node-server-app
npm init`}</CodeBlock>
        <p>
          Accept the defaults. <code>npm init</code>{" "}writes{" "}
          <code>package.json</code>{" "}— the Node equivalent of a project
          manifest. This interactive book ships a working copy at the
          repo root as <code>kambaz-node-server-app/</code>{" "}so LiveDemos
          can call <code>http://localhost:4000</code>{" "}without cloning a
          second remote. It is still a{" "}
          <strong>separate project</strong>: own{" "}
          <code>package.json</code>, own{" "}
          <code>.gitignore</code>, own README. For Canvas you{" "}
          <code>git init</code>{" "}that folder and push a{" "}
          <strong>second</strong>{" "}GitHub repository named{" "}
          <code>kambaz-node-server-app</code>{" "}(
          <SectionLink to="5.5.1" />) — do not treat it as Next.js app
          source.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-5-1-4"
        title="5.1.4 Creating a Simple Hello World Node.js Program"
      >
        <p>
          At the root of the Node project, create{" "}
          <code>Hello.js</code>{" "}and run it with{" "}
          <code>node</code>:
        </p>
        <CodeBlock language="js" name="Hello" file="kambaz-node-server-app/Hello.js">{`console.log("Hello World!");`}</CodeBlock>
        <CodeBlock language="shell">{`node Hello.js
# Hello World!`}</CodeBlock>
        <p>
          Later files turn this into HTTP routes. MongoDB stays a later
          chapter.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-5-1-5"
        title="5.1.5 Creating a Node.js HTTP Web Server"
      >
        <p>
          Install{" "}
          <OfficialLink href="https://expressjs.com/">
            Express
          </OfficialLink>{" "}
          from the Node project root so it is listed in{" "}
          <code>package.json</code>:
        </p>
        <CodeBlock language="shell">{`npm install express`}</CodeBlock>
        <p>
          <code>express()</code>{" "}creates <code>app</code>.{" "}
          <code>app.get(&apos;/hello&apos;, …)</code>{" "}maps an HTTP GET
          to a handler. <code>res.send</code>{" "}writes the body.{" "}
          <code>app.listen(4000)</code>{" "}waits for requests. Local labs
          stay on 4000; a host can later set <code>PORT</code>.
        </p>
        <CodeBlock
          language="js"
          name="index"
          file="kambaz-node-server-app/index.js"
        >{`import express from "express";
const app = express();
app.get("/hello", (req, res) => {
  res.send("Hello World!");
});
app.listen(4000);`}</CodeBlock>
        <p>
          Run <code>node index.js</code>, then open{" "}
          <code>http://localhost:4000/hello</code>. Stop with Ctrl+C.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-5-1-6"
        title="5.1.6 Configuring Nodemon"
      >
        <p>
          <OfficialLink href="https://nodemon.io/">
            nodemon
          </OfficialLink>{" "}
          restarts Node when files change — the same comfort as{" "}
          <code>next dev</code>:
        </p>
        <CodeBlock language="shell">{`npm install nodemon --save-dev
npx nodemon index.js
# later: npm run dev   (same command, after the script in 5.1.7)`}</CodeBlock>
        <p>
          Keep this process running in the Node folder while{" "}
          <code>next dev</code>{" "}runs in the Next.js folder. Change the
          hello string to{" "}
          <code>Life is good!</code>, refresh, and confirm it updates
          without a manual restart. Add a root route{" "}
          <code>/</code>{" "}that sends{" "}
          <code>Welcome to Full Stack Development!</code>.
        </p>
        <OnYourOwn>
          Hit{" "}
          <code>http://localhost:4000</code>{" "}and{" "}
          <code>/hello</code>{" "}in two tabs and confirm both strings.
        </OnYourOwn>
        <WithAI
          prompt={`In kambaz-node-server-app/index.js, keep my /hello route. Add a sample GET / that sends Welcome to Full Stack Development! Do not remove hello.`}
        >
          Ask the assistant to add the root route — you still refresh
          both tabs:
        </WithAI>
      </Section>

      <Section
        level={3}
        id="sec-5-1-7"
        title="5.1.7 Configuring Node.js to Use ES6"
      >
        <p>
          React already uses <code>import</code>. Node needs{" "}
          <code>&quot;type&quot;: &quot;module&quot;</code>{" "}in{" "}
          <code>package.json</code>{" "}to do the same. Add a{" "}
          <code>start</code>{" "}script:
        </p>
        <CodeBlock language="json" name="package" file="kambaz-node-server-app/package.json">{`{
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}`}</CodeBlock>
        <p>
          Then rewrite <code>index.js</code>{" "}with{" "}
          <code>import express from &quot;express&quot;</code>{" "}instead
          of <code>require</code>.
        </p>
      </Section>

      <Section
        level={3}
        id="sec-5-1-8"
        title="5.1.8 Creating HTTP Routes"
      >
        <p>
          Do not pile every route into <code>index.js</code>. Pass the
          single <code>app</code>{" "}into a function per file. Move hello
          and welcome into <code>Hello.js</code>:
        </p>
        <CodeBlock
          language="js"
          name="Hello"
          file="kambaz-node-server-app/Hello.js"
        >{`export default function Hello(app) {
  const sayHello = (req, res) => {
    res.send("Life is good!");
  };
  const sayWelcome = (req, res) => {
    res.send("Welcome to Full Stack Development!");
  };
  app.get("/hello", sayHello);
  app.get("/", sayWelcome);
}`}</CodeBlock>
        <CodeBlock
          language="js"
          name="index"
          file="kambaz-node-server-app/index.js"
        >{`import express from "express";
import Hello from "./Hello.js";
const app = express();
Hello(app);
app.listen(4000);`}</CodeBlock>
        <p>
          Note the <code>.js</code>{" "}extension on the import. Confirm{" "}
          <code>/hello</code>{" "}still replies.{" "}
          <SectionLink to="5.2" />{" "}adds <code>Lab5/index.js</code>{" "}
          the same way.
        </p>
      </Section>
    </>
  );
}
