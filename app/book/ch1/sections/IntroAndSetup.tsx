import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import LocalUrl from "../../components/LocalUrl";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import BookFigure from "../../components/BookFigure";
import FigureLink from "../../components/FigureLink";
import Lab1Starter from "@/app/labs/lab1/intermediates/1-2-4-Lab1Starter";

export default function IntroAndSetup() {
  return (
    <>
      <header id="intro" className="scroll-mt-6 mb-8">
        <p className="font-sans text-sm uppercase tracking-wide text-neutral-500">
          Developing Full Stack Next.js Web Applications
        </p>
        <h1 className="mt-1 font-sans text-4xl font-semibold leading-tight">
          Chapter 1 — Building Next.js User Interfaces with HTML
        </h1>
        <p className="text-neutral-600">Dr. Jose Annunziato</p>
      </header>

      <section className="space-y-4 text-[1.05rem]">
        <p>
          The foundation of our modern digital landscape is the{" "}
          <strong>Internet</strong>, a global array of interconnected computer
          networks. It originated in the early 1960s as a research project
          commissioned by the Advanced Research Projects Agency (
          <strong>ARPA</strong>), the research arm of the United States
          Department of Defense. The initial goal was to build{" "}
          <strong>ARPANET</strong>, a robust, decentralized, and redundant
          communication infrastructure capable of maintaining connectivity even
          in the event of major disruptions. By the 1980s, the standardization
          of protocols like TCP/IP allowed these isolated military and academic
          networks to proliferate and connect worldwide, establishing the
          underlying network of networks upon which modern digital communication
          relies.
        </p>
        <p>
          The <strong>World Wide Web</strong>{" "}was invented in 1989 by British
          computer scientist Sir Tim Berners-Lee during his tenure at{" "}
          <strong>CERN</strong>, the European particle physics laboratory in
          Switzerland. The objective was to enable the efficient sharing and
          linking of research documents over the existing Internet. In March
          1989, Sir Tim Berners-Lee proposed a system of hypertext documents
          connected via hyperlinks, which users access through Uniform Resource
          Locators (<strong>URL</strong>s) using the HyperText Transfer Protocol
          (<strong>HTTP</strong>). By 1990, he had created the first web browser
          (named <strong>WorldWideWeb</strong>), a <strong>web server</strong>,
          and the foundational HyperText Markup Language (
          <strong>HTML</strong>) language to create HTTP{" "}
          <strong>web pages</strong>. Browsers and servers connect to one
          another over the internet in a client-server architecture. Sir Tim
          Berners-Lee made the Web public in 1991, and on April 30, 1993, CERN
          released the technology into the public domain, facilitating explosive
          growth. Presently, billions of static and dynamic pages power various
          systems ranging from simple sites to complex applications.
        </p>

        <LiveDemo title="Figure 1.1 — The Client Server Architecture">
          <div
            style={{
              display: "flex",
              gap: "2rem",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              padding: "1rem 0",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  border: "2px solid #333",
                  borderRadius: "8px",
                  padding: "1rem 1.5rem",
                  minWidth: "8rem",
                }}
              >
                <strong>Browser</strong>
                <div style={{ fontSize: "0.9rem", marginTop: "0.35rem" }}>
                  Client
                </div>
              </div>
            </div>
            <div style={{ textAlign: "center", fontSize: "0.9rem" }}>
              <div>HTTP Request →</div>
              <div>← HTTP Response</div>
              <div style={{ marginTop: "0.35rem", color: "#555" }}>URL / HTML</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  border: "2px solid #333",
                  borderRadius: "8px",
                  padding: "1rem 1.5rem",
                  minWidth: "8rem",
                }}
              >
                <strong>Web Server</strong>
                <div style={{ fontSize: "0.9rem", marginTop: "0.35rem" }}>
                  Hosts documents
                </div>
              </div>
            </div>
          </div>
        </LiveDemo>

        <p>
          Web pages are comprised of plain text documents formatted with{" "}
          <strong>HTML</strong>, a dialect of <strong>XML</strong>{" "}(
          <strong>eXtensible Markup Language</strong>). HTML is a computer
          language utilized to format the content displayed in web pages,
          including properties such as foreground and background color, white
          spaces, text alignment, font, lists, tables, and forms. Browsers
          establish a network connection with servers to send HTTP Requests for
          HTML documents. These requests rely on Uniform Resource Locators (
          <strong>URL</strong>s), which specify the server&apos;s IP address or
          hostname alongside the precise path to the requested document. In local
          development you will often see a URL such as{" "}
          <LocalUrl href="/labs/lab1" /> — here{" "}
          <code>localhost</code>{" "}is the host on your machine and{" "}
          <code>3000</code>{" "}is the <strong>port</strong>{" "}where the Next.js
          dev server listens. Servers
          locate the requested documents, and then respond with the
          document&apos;s content. Browsers parse HTML documents to create
          in-memory object representations known as the <strong>DOM</strong>{" "}(
          <strong>Document Object Model</strong>). The DOM consists of a
          hierarchical data structure where each node is configured to render
          content in a specific format and style. This chapter examines using
          HTML for formatting web pages and creating user interfaces.
        </p>
        <p>
          <strong>JavaScript</strong>{" "}is a programming language that initially
          was mostly used to write programs that can execute within browsers and
          to programmatically manipulate the DOM and control what a browser
          renders on the screen. JavaScript files are referenced by HTML
          documents, downloaded from servers, and executed within the browser to
          implement dynamic user interfaces. Today JavaScript has outgrown beyond
          the browser and is widely used for implementing general-purpose
          programs. <strong>TypeScript</strong>{" "}is a version of JavaScript
          developed by Microsoft, that adds strong typing support and is quickly
          becoming the preferred programming language for web development. Later
          chapters discuss programming server-side logic, including API routes
          and database interactions with <strong>MongoDB</strong>.
        </p>
        <p>
          <strong>React</strong>{" "}is a popular JavaScript library developed by
          Meta for building dynamic and interactive user interfaces. It promotes
          a component-based architecture where developers break down complex UIs
          into small and reusable pieces of code called{" "}
          <strong>components</strong>. React efficiently manages the state of
          these components, ensuring that the user interface stays in sync with
          underlying data changes.           Developers use React to build Single Page
          Applications (<strong>SPA</strong>s), which provide a seamless, fluid
          user experience by updating only the necessary parts of the page
          without requiring full-page reloads — unlike traditional multi-page
          sites, where every link often fetches an entirely new HTML document
          from the server. Its declarative nature simplifies
          the process of creating complex web interfaces by describing what the
          UI should look like for a given state.
        </p>
        <p>
          <strong>Next.js</strong>{" "}is a powerful framework designed to simplify
          the construction of full-stack web applications. Built on top of React,
          it provides an all-in-one solution that includes robust features such
          as server-side rendering (<strong>SSR</strong>), static site generation
          (<strong>SSG</strong>), and seamless API endpoint integration. Next.js
          extends React by offering built-in routing, data fetching, and
          performance optimizations, allowing developers to create highly
          scalable applications that interact efficiently with backend resources,
          such as MongoDB, over HTTP.
        </p>
        <p>
          This chapter describes how to install and configure a local development
          environment for building Next.js applications. Development is done in
          the local environment and then shared in a remote GitHub source
          repository. The source in GitHub is then deployed to a remote server
          hosted on Vercel which is optimized for Next.js and provides seamless
          serverless deployment. This chapter introduces creating a Next.js
          application and explores building user interfaces using HTML and
          JavaScript. Various HTML elements are described to render user
          interface content, such as headings, paragraphs, lists, tables, and
          form elements. All sections in this chapter contain exercises that
          introduce basic HTML elements and concepts, giving an opportunity to
          learn and practice HTML skills. The exercises provide detailed
          instructions to successfully accomplish the tasks. Make sure to
          complete all exercises described in the book.
        </p>
        <p>
          The <strong>Kambaz</strong>{" "}sections in each chapter contain exercises
          that ask readers to build a fully functional web application inspired
          by a popular Learning Management System (<strong>LMS</strong>) with a
          similar name. The exercises provide sample code and requirements but
          deliberately leave out steps where the reader is expected to experiment
          and discover how to implement the requirements using the skills learned
          in prior sections. This chapter focuses on using plain HTML within
          Next.js components to implement a draft, rough prototype of various
          Kambaz screens, which at first won&apos;t look like the target
          product in <FigureLink to="1a" />–<FigureLink to="1d">1d</FigureLink>.
          Later chapters will continue working on the Kambaz
          application, introducing Cascading Style Sheets (<strong>CSS</strong>)
          to style the Web pages so they look more like these screen shots,
          and integrating MongoDB for data persistence.
        </p>
        <BookFigure
          sources={[
            {
              id: "fig-1a",
              src: "/images/book/kambaz/dashboard.png",
              alt: "Kambaz Dashboard target screenshot",
              caption: "Figure 1a — Dashboard Screen",
            },
            {
              id: "fig-1b",
              src: "/images/book/kambaz/modules.png",
              alt: "Kambaz Modules target screenshot",
              caption: "Figure 1b — Modules Screen",
            },
            {
              id: "fig-1c",
              src: "/images/book/kambaz/assignments.png",
              alt: "Kambaz Assignments target screenshot",
              caption: "Figure 1c — Assignments Screen",
            },
            {
              id: "fig-1d",
              src: "/images/book/kambaz/assignment-editor.png",
              alt: "Kambaz Assignment Editor target screenshot",
              caption: "Figure 1d — Assignment Editor",
            },
          ]}
        />
      </section>

      <Section id="sec-1-1" title="1.1 Learning Objectives">
        <p>By the end of this chapter, you will be able to:</p>
        <ul>
          <li>Understand the fundamentals of HTML and how it structures web content.</li>
          <li>Set up a development environment for Next.js applications.</li>
          <li>Create and organize Next.js components using JSX.</li>
          <li>Use Chrome DevTools to inspect and manipulate the DOM.</li>
          <li>Implement headings, paragraphs, lists, tables, and images.</li>
          <li>Build interactive web forms with different input types.</li>
          <li>
            Pass props into custom components and wrap nested content with{" "}
            <code>children</code>.
          </li>
          <li>Implement navigation in a Next.js SPA using built-in routing.</li>
          <li>Develop a structured approach to building UIs in Next.js.</li>
        </ul>
      </Section>

      <Section id="sec-1-2" title="1.2 Setting Up the Development Environment">
        <p>
          HTML practice in this book happens inside Next.js components, so first
          install the tools that run the app on your machine. Complete the
          exercises in order — later ones assume earlier ones.
        </p>

        <h3 id="sec-1-2-1" className="scroll-mt-6 font-sans text-xl font-semibold">
          1.2.1 Installing Node.js
        </h3>
        <p>
          <strong>Node.js</strong>{" "}is a JavaScript runtime that lets you run
          JavaScript outside the browser — typically from a terminal or console
          on your computer. It is essential for Next.js development: it powers
          the local development server, installs and manages project
          dependencies, and later enables server-side features such as API
          routes.
        </p>
        <p>
          Installing Node.js also gives you two companion tools,{" "}
          <strong>npm</strong>{" "}(Node Package Manager) and <strong>npx</strong>.
          Think of them as the JavaScript ecosystem&apos;s equivalent of build
          and package tools you may already know: <strong>mvn</strong>{" "}for Java
          (Maven) or <strong>pip</strong>{" "}for Python. With{" "}
          <code>npm</code>{" "}you install libraries, run project scripts (for
          example <code>npm run dev</code>), and manage versions listed in{" "}
          <code>package.json</code>. With <code>npx</code>{" "}you can run a
          one-off package command without installing it globally first — which
          is how we will scaffold the app with{" "}
          <code>npx create-next-app</code>{" "}in the next subsection.
        </p>
        <p>
          In this chapter we use Node.js mainly to create and host the React
          user interface. Later chapters will use the same runtime to implement
          HTTP servers and RESTful Web APIs, and to integrate databases such as
          MongoDB. Getting a solid Node.js install now sets you up for both the
          front end and the back end of the stack.
        </p>
        <p>
          Navigate to{" "}
          <a href="https://nodejs.org/" target="_blank" rel="noreferrer">
            https://nodejs.org/
          </a>
          , download the latest <strong>LTS</strong>{" "}(Long Term Support) version
          for your operating system (recommended: version 22.x or later as of
          2025), and install it. Restart your computer if prompted. Confirm the
          install by typing <code>node -v</code>{" "}in a console or terminal. The
          output should show the installed version (for example{" "}
          <code>v22.4.0</code>). Your exact version may differ, but it should be
          at least <strong>18.18</strong>{" "}or later, as required by Next.js.
        </p>
        <CodeBlock language="shell">{`node -v
v22.4.0`}</CodeBlock>

        <h3 id="sec-1-2-2" className="scroll-mt-6 font-sans text-xl font-semibold">
          1.2.2 Installing an Integrated Development Environment (IDE)
        </h3>
        <p>
          You can edit Next.js projects in any text editor, but an{" "}
          <strong>Integrated Development Environment (IDE)</strong>{" "}makes the
          work much smoother: syntax highlighting, autocomplete, inline errors,
          debugging, and a built-in terminal in one place. For this course,{" "}
          <strong>Visual Studio Code</strong>{" "}(<strong>VS Code</strong>) is
          highly recommended because of its strong support for JavaScript,
          TypeScript, React, and Next.js — including IntelliSense suggestions
          and debugging integrations.
        </p>
        <p>
          Download and install VS Code from{" "}
          <a
            href="https://code.visualstudio.com"
            target="_blank"
            rel="noreferrer"
          >
            https://code.visualstudio.com
          </a>
          . (Cursor and similar editors built on VS Code work well too, if you
          already prefer them.) Once installed, open the Extensions view and add
          a few useful packages: <strong>ESLint</strong>{" "}for catching common
          code problems, <strong>Prettier</strong>{" "}for consistent formatting, and
          browser <strong>React Developer Tools</strong>{" "}for inspecting
          component trees while you run the app.
        </p>
        <p>
          You will run many commands — <code>npm run dev</code>,{" "}
          <code>git</code>, and others — from a terminal. Prefer the integrated
          terminal inside the IDE (in VS Code:{" "}
          <strong>Terminal → New Terminal</strong>) so you stay in the same
          window as your files and do not have to switch back and forth to a
          separate console.
        </p>

        <h3 id="sec-1-2-3" className="scroll-mt-6 font-sans text-xl font-semibold">
          1.2.3 Creating a Next.js Application
        </h3>
        <p>
          React has become one of the most popular JavaScript libraries for
          building Web user interfaces. In this course we build on React using
          Next.js. With <code>npx</code> — the tool that shipped with your
          Node.js install — you can scaffold a new project from a maintained
          template that already follows current best practices.
        </p>
        <p>
          Start by creating a place on disk for your coursework. From your home
          directory (<code>~</code>), make a folder for the year, the term, and
          the course. On macOS use Terminal; on Windows use Command Prompt or
          PowerShell. For example, to create{" "}
          <code>~/2049/winter/webdev</code>:
        </p>
        <CodeBlock language="shell">{`cd ~
mkdir 2049
mkdir 2049/winter
mkdir 2049/winter/webdev
cd 2049/winter/webdev`}</CodeBlock>
        <p>
          You can pick another location if you prefer. Keep names lowercase,
          avoid spaces, and nest the project only under directories that follow
          the same rules — that prevents a lot of path and tooling headaches
          later.
        </p>
        <p>
          From that folder (or from the IDE&apos;s integrated terminal), create
          the app with:
        </p>
        <CodeBlock language="shell">{`npx create-next-app@latest`}</CodeBlock>
        <p>
          The first time you run this, npm may ask permission to download the{" "}
          <code>create-next-app</code>{" "}package. Accept and continue:
        </p>
        <CodeBlock language="shell">{`Need to install the following packages:
create-next-app@15.3.5
Ok to proceed? (y)`}</CodeBlock>
        <p>
          When prompted for a project name, enter{" "}
          <code>kambaz-next-js</code>. For the remaining prompts — TypeScript,
          ESLint, Tailwind CSS, <code>src/</code>{" "}directory, App Router,
          Turbopack, and the <code>@/*</code>{" "}import alias — choose the defaults
          (typically Yes for TypeScript, ESLint, Tailwind, App Router, and
          Turbopack; No for a <code>src/</code>{" "}directory and for customizing
          the alias). Exact wording can vary slightly by{" "}
          <code>create-next-app</code>{" "}version.
        </p>
        <CodeBlock language="shell">{`✔ What is your project named? … kambaz-next-js
✔ Would you like to use TypeScript? … No / Yes
✔ Would you like to use ESLint? … No / Yes
✔ Would you like to use Tailwind CSS? … No / Yes
✔ Would you like your code inside a \`src/\` directory? … No / Yes
✔ Would you like to use App Router? (recommended) … No / Yes
✔ Would you like to use Turbopack for \`next dev\`? … No / Yes
✔ Would you like to customize the import alias (\`@/*\` by default)? … No / Yes`}</CodeBlock>
        <p>
          Wait while dependencies install (<code>react</code>,{" "}
          <code>react-dom</code>, <code>next</code>, TypeScript types, Tailwind,
          ESLint, and related packages). When it finishes you should see a
          success message and a new <code>kambaz-next-js</code>{" "}directory. Change
          into that directory and start the development server:
        </p>
        <CodeBlock language="shell">{`cd kambaz-next-js
npm run dev`}</CodeBlock>
        <p>
          The console should report that Next.js is ready and print a local URL,
          usually{" "}
          <LocalUrl href="/" />
          . Open that URL in <strong>Google Chrome</strong>{" "}and confirm the
          default Next.js starter page (logo and getting-started content)
          appears. Stop the server anytime with <strong>Ctrl+C</strong>.
        </p>
        <LiveDemo title="Figure 1.2 — Default Next.js project running in a browser">
          <div
            style={{
              fontFamily: "system-ui, sans-serif",
              padding: "1.5rem 1rem",
              textAlign: "center",
              color: "#171717",
            }}
          >
            <div style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
              Next.js
            </div>
            <p style={{ margin: "0.75rem 0 0", color: "#525252" }}>
              Default starter app at{" "}
              <LocalUrl href="/" />
            </p>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.9rem", color: "#737373" }}>
              You should see the Next.js logo and welcome content in Chrome.
            </p>
          </div>
        </LiveDemo>
        <p>
          You can start the app from any terminal, but prefer running{" "}
          <code>npm run dev</code>{" "}from the IDE: open the{" "}
          <code>kambaz-next-js</code>{" "}folder in VS Code (or Cursor), show the
          terminal with <strong>View → Terminal</strong>{" "}if needed, and run the
          command there. Other browsers and editors are fine, but this course
          assumes <strong>Google Chrome</strong>{" "}and <strong>VS Code</strong>{" "}
          unless noted otherwise.
        </p>

        <h3 id="sec-1-2-4" className="scroll-mt-6 font-sans text-xl font-semibold">
          1.2.4 Creating Pages and Routes with the App Router
        </h3>
        <p>
          React is a JavaScript library for building dynamic web user interfaces
          (UI). In Next.js, which is built on React, those interfaces are written
          as JavaScript functions (or classes) called <strong>components</strong>.
          A component computes and returns the UI. The syntax that mixes
          JavaScript with HTML-like tags is called <strong>JSX</strong>{" "}
          (JavaScript XML). JSX deliberately blurs the line between JavaScript
          and HTML so you can <strong>compute</strong>{" "}dynamic HTML content —
          for example choosing tags, text, or structure based on data — instead
          of maintaining a static page file by hand. Files that use JSX typically
          end in <code>.jsx</code>. Chapter 3 covers JavaScript in more depth;
          for now, focus on the HTML-like markup inside each component.
        </p>
        <p>
          <strong>TypeScript</strong>{" "}is a superset of JavaScript that adds
          static typing. It has become the preferred language for many React and
          Next.js projects because types catch mistakes early, make larger
          codebases easier to refactor, and improve editor tooling (autocomplete,
          jump-to-definition, and clearer errors). Next.js supports TypeScript
          out of the box, and it is what this course uses. Component files
          therefore end in <code>.tsx</code>. When people say &quot;JSX&quot; in
          conversation, they often mean the markup syntax itself, whether the
          file is <code>.jsx</code>{" "}or <code>.tsx</code>.
        </p>
        <p>
          Before you create Lab 1, it helps to know how the browser address bar
          connects to files on disk. A <strong>URL path</strong>{" "}(for example{" "}
          <code>/labs/lab1</code>) is what the user opens. In Next.js we call
          that a <strong>route</strong>: a destination your app knows how to
          render. You do not register routes in a central config file for the
          basics of this course. Instead, the shape of folders under{" "}
          <code>app/</code>{" "}defines the routes.
        </p>
        <p>
          That folder-based system is the <strong>App Router</strong> — Next.js
          &apos;s current routing model (you chose it when you answered
          &quot;Would you like to use App Router?&quot; during{" "}
          <code>create-next-app</code>). An older Next.js style put routes under
          a <code>pages/</code>{" "}directory (the Pages Router). This course uses
          the App Router exclusively: look for an <code>app/</code>{" "}folder, not{" "}
          <code>pages/</code>.
        </p>
        <p>
          Inside <code>app/</code>, a few filenames are{" "}
          <strong>reserved</strong>. The most important for now is{" "}
          <code>page.tsx</code>. When a folder contains <code>page.tsx</code>,
          Next.js exposes that folder as a public route. Nested folders become
          nested path segments:
        </p>
        <ul>
          <li>
            <code>app/page.tsx</code>{" "}→ <code>/</code>{" "}(the site root)
          </li>
          <li>
            <code>app/labs/page.tsx</code>{" "}→ <code>/labs</code>
          </li>
          <li>
            <code>app/labs/lab1/page.tsx</code>{" "}→ <code>/labs/lab1</code>
          </li>
        </ul>
        <p>
          Another reserved file is <code>layout.tsx</code>: it does not create
          its own URL by itself. It wraps the <code>page.tsx</code>{" "}(and nested
          layouts) in the same folder tree with shared chrome such as
          navigation. You will use layouts for Labs in <SectionLink to="1.3.12" />{" "}and for Kambaz in
          <SectionLink to="1.4" />. Ordinary component files — for example{" "}
          <code>HeadingTags.tsx</code>{" "}later in Lab 1 — are{" "}
          <em>not</em>{" "}routes. Only the special filenames create URLs; other{" "}
          <code>.tsx</code>{" "}files are imported into pages (or layouts) when
          you need them.
        </p>
        <p>
          In the IDE Explorer, open the <code>app</code>{" "}directory and create
          Lab 1 at <code>app/labs/lab1/page.tsx</code>{" "}with the following
          source:
        </p>
        <CodeBlock language="tsx" name="Lab1" file="app/labs/lab1/page.tsx">{`export default function Lab1() {
  return (
    <div id="wd-lab1">
      <h2>Lab 1</h2>
    </div>
  );
}`}</CodeBlock>
        <p>
          <code>Lab1</code>{" "}is a default-exported React component. Because the
          file is named <code>page.tsx</code>{" "}under{" "}
          <code>app/labs/lab1/</code>, the App Router registers the route{" "}
          <code>/labs/lab1</code>. The function returns a <code>div</code>{" "}
          (division element) that contains an <code>h2</code>{" "}heading with the
          text &quot;Lab 1&quot;. Save the file, keep{" "}
          <code>npm run dev</code>{" "}running, and open{" "}
          <LocalUrl href="/labs/lab1" />{" "}in the browser to
          confirm it renders.
        </p>
        <LiveDemo name="Lab1" file="app/labs/lab1/page.tsx">
          <Lab1Starter />
        </LiveDemo>
        <p>
          As you add HTML examples in the next sections, keep{" "}
          <code>page.tsx</code>{" "}as a thin page that imports smaller components
          (one file per exercise) instead of pasting everything into this one
          file. Those exercise files are components, not new routes — Lab 1
          stays a single URL while its content grows.
        </p>
        <p>
          The starter project also loads Tailwind CSS through{" "}
          <code>app/globals.css</code>. For the HTML exercises in this chapter we
          want the browser&apos;s default styling, so comment out that import in{" "}
          <code>app/layout.tsx</code>{" "}(the root layout that already wraps every
          route) and leave the rest of the file alone:
        </p>
        <CodeBlock language="tsx" name="RootLayout" file="app/layout.tsx">{`import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// ... leave the rest of this file alone`}</CodeBlock>
        <p>
          Later chapters return to CSS and Tailwind when we start styling Kambaz
          and the labs more deliberately.
        </p>
      </Section>
    </>
  );
}
