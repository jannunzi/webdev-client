import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import { OnYourOwn, WithAI } from "../../components/Practice";
import AiCourseBuilderDemo from "../embeds/AiCourseBuilderDemo";

const REQUIREMENTS = `# AI Assisted Course Builder — static controls

## Overview

Course authors need an AI Assisted Course Builder on Kambaz. This chapter only places the controls. They are static HTML. Clicking a control does not call a model, edit the title or description, or insert a module or lesson.

Later chapters of this same feature style the controls with Tailwind, show sample suggestions from a local JSON file, keep a draft in Zustand, and call Claude from a Next.js route handler. This chapter does none of that. There is no mock AI API.

## User stories

1. As a course author, I can open the course editor, read the title and the description, and see "Generate description from title" and "Generate title from description", so I know where those actions will live.
2. As a course author, I can open Modules and see "AI: suggest modules" beside "+ Module", so I know where a suggested module list will start.
3. As a course author, I can see "AI: next module" after the module list, so I know where one more module will be offered.
4. As a course author, inside every module I can choose a lesson type of Reading, Slides, or Quiz and see "Generate lessons", so I know where a set of lessons of that type will be offered.
5. As a course author, inside every module I can see "AI: next lesson" after that module's lessons, so I know where one more lesson will be offered.

## Acceptance criteria

- New page at app/(kambaz)/courses/[cid]/editor/page.tsx. It shows a Title field, a Description field, and both generate buttons. Clicking a button leaves both fields unchanged.
- Optional ids on that page, used at most once: wd-course-editor, wd-course-title, wd-course-description, wd-generate-description, wd-generate-title.
- The Modules page already in the project stays. Collapse All, View Progress, the publish select, "+ Module", and every existing week, lesson, and content item remain.
- "AI: suggest modules" is the next control after "+ Module".
- "AI: next module" appears once, after the module list, outside every module.
- Optional ids for those two buttons: wd-ai-suggest-modules, wd-ai-next-module.
- Every module shows a "Lesson type" select, then "Generate lessons", then that module's existing lessons, then "AI: next lesson".
- The select options are exactly Reading, Slides, and Quiz. Slides means a slides.js lesson. This chapter does not build the deck.
- Controls that repeat inside every module use a class, so one id is not copied onto every module. Optional classes: wd-lesson-type, wd-generate-lessons, wd-ai-next-lesson.
- Every new button is type="button". No onClick. No fetch. No form element, so Enter in a field does not submit.
- The edited files stay Server Components. No "use client" line.
- Course Navigation is unchanged. The editor URL is /courses/1234/editor.

## Out of scope

- A call to Claude or any other model
- A mock AI service, or any new API route
- API keys, tokens, passwords, or environment files
- Tailwind, Bootstrap, or any other styling
- useState, Zustand, or any other client state
- A JSON file of suggestions
- A Video lesson type
- Edits to Dashboard, assignments, account screens, or Course Navigation
- Deleting or rewriting existing modules and lessons
`;

export default function EngineeringWithAI() {
  return (
    <Section
      id="sec-1-7"
      title="1.7 Engineering with AI (optional, not graded)"
    >
      <p>
        This section is where you practice using an AI assistant the way a
        software engineer does on a professional team, because the{" "}
        <strong>AI Assisted Course Builder</strong> you start here is a
        feature you will keep building in later chapters. A course author
        uses it to draft a course title from a description, a description
        from a title, a list of modules, and the lessons inside a module,
        and in this chapter those controls are static HTML, so clicking a
        button leaves the text on the page exactly as you typed it.{" "}
        <ChapterLink to={2} />{" "}styles the same controls with Tailwind,{" "}
        <ChapterLink to={3} />{" "}fills them from a local JSON file of sample
        suggestions, <ChapterLink to={4} />{" "}stores the draft in Zustand, a
        client-side store, and a later chapter calls Claude from a Next.js{" "}
        <strong>route handler</strong>, which is a function on the server
        that receives a request and sends back a response. Learning the
        engineering process now, while the buttons still do not call
        Claude, means you already know who writes the requirement, who
        reviews the code, and who is accountable when the assistant is
        allowed to edit files.
      </p>
      <p>
        In a product team, a new feature or bug fix moves through the{" "}
        <strong>software development lifecycle</strong>, the sequence of
        stages that takes the work from an idea to{" "}
        <strong>production</strong>, the deployed application that users
        open. A product manager first writes the product requirements,
        including user stories and acceptance criteria, and the team files
        that work as an issue in a tracker such as Jira. A software
        engineer then designs the change, creates a feature branch,
        implements it, and tests it against those criteria. The same
        engineer opens a pull request for code review, continuous
        integration runs the project&apos;s checks, and after the review
        the engineer merges the branch and deploys it, then monitors the
        running application. An AI assistant can draft or search inside
        many of those stages, and the software engineer, the developer
        doing the work, or the product manager who owns the requirement
        remains the one who decides and who answers for the result. The
        exercises later in this section take the AI Assisted Course Builder
        through the requirements, the branch, the implementation, the
        manual test, and the pull request, and they stop before merge,
        which you already practice for the chapter itself in{" "}
        <SectionLink to="1.5" />{" "}and <SectionLink to="1.6" />.
      </p>
      <p>
        The lifecycle begins when a product manager writes down what the
        user can do. A <strong>user story</strong> is one sentence of that
        document, naming who the user is, what they can do, and why it
        matters, and <strong>acceptance criteria</strong> are the checks
        that define finished work, such as which labels appear on the
        screen and what stays unchanged when the user clicks. The team
        then records the story as an <strong>issue</strong>, also called a
        ticket, in an <strong>issue tracker</strong>, the shared list of
        work. Jira is a common tracker, and GitHub Issues and Linear are
        others. The issue stores the requirement, the acceptance criteria,
        and a status that moves from to do, to in progress, to in review,
        and then to done, so a software engineer can pick up that issue
        and know exactly which feature or bug fix it describes. An
        assistant can draft the user stories, the acceptance criteria, or
        the issue text from the product manager&apos;s notes, while the
        product manager is accountable for accepting the document and the
        software engineer who takes the issue is accountable for building
        what it says.
      </p>
      <p>
        With the issue assigned, the software engineer designs the change
        by choosing which screens will move, which files those screens
        live in, and which requests belong in a later issue, and an
        assistant can propose that list of files while the engineer
        selects the design and writes it on the issue so the
        implementation has a target. The engineer then creates a{" "}
        <strong>feature branch</strong>, a separate line of Git commits
        started from <code>main</code> with <code>git checkout -b</code>,
        which keeps the unfinished commits off <code>main</code> until
        code review, using the same commits you already make in{" "}
        <SectionLink to="1.5" />. During implementation the assistant can
        draft the code from the requirements and from the files named in
        the design, after which the software engineer reads the{" "}
        <strong>diff</strong>, Git&apos;s line-by-line record of which
        lines were added and which were removed, compares that record with
        the acceptance criteria, and keeps only the lines they can
        explain, because the engineer is accountable for every line that
        remains in the branch.
      </p>
      <p>
        The software engineer next checks the branch with tests, which may
        be an automated command or a manual pass through the screens, and
        an assistant can draft a test or a checklist while the engineer
        runs it and judges whether the behavior is the behavior the issue
        requested. When that check is satisfactory, the engineer opens a{" "}
        <strong>pull request</strong>, the GitHub page that proposes
        merging the feature branch into <code>main</code> and shows the
        diff for <strong>code review</strong>, the reading of that diff by
        the reviewers. An assistant can draft the pull request description
        and can add review comments, and the software engineer who opened
        the pull request decides which comments match the requirements and
        which ask for work the issue did not include, remaining
        accountable for what the pull request contains.{" "}
        <strong>Continuous integration</strong>, or <strong>CI</strong>,
        then runs the repository&apos;s build and its tests on that pull
        request. An assistant can help the engineer read the log when a
        check fails, a green result is evidence that those automated steps
        passed, and the engineer decides whether the feature is ready to
        merge.
      </p>
      <p>
        Merge copies the reviewed feature branch onto <code>main</code>,
        and deploy publishes <code>main</code> so users can open the
        application, which you already do for this chapter in{" "}
        <SectionLink to="1.6" />. An assistant can draft the short note
        that describes what changed, and the software engineer who merges
        and deploys confirms that the deployed application is the one the
        reviewers read. After deploy, the software engineer{" "}
        <strong>monitors</strong> the running application by reading error
        logs and failed requests and by checking that the feature still
        meets the acceptance criteria. An assistant can summarize a log,
        and the engineer decides whether the behavior is an incident and
        which new issue to file so the lifecycle starts again.
      </p>

      <h3
        id="sec-1-7-1"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        1.7.1 Owning the code
      </h3>
      <p>
        During implementation you are the software engineer, so the
        assistant drafts only from what you place in the prompt, which
        means the issue, the acceptance criteria, and the list of files
        appear in the reply when you include them and are absent when you
        leave them out. Paste the requirements document first, then name
        the few files the issue covers, and after the reply read the diff
        against the acceptance criteria and save only the lines that match,
        because those lines will be the ones you can explain in code
        review.
      </p>
      <p>
        The same accountability covers secrets, which are values that would
        let someone else act as you or read private data, including the
        personal access token from <SectionLink to="1.5" />, anything in a{" "}
        <code>.env</code> file, passwords, and private details about real
        people. Keep those values out of the browser chat, out of the
        command-line tool, and out of the panel in the editor. When the
        assistant needs to know that a file exists, describe the file in a
        sentence and leave its contents on your machine, since a value
        pasted into the conversation has left your machine.
      </p>

      <h3
        id="sec-1-7-2"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        1.7.2 Chat, the CLI, and the IDE
      </h3>
      <p>
        This section assumes you already have a Claude account, whether
        that account is a personal account or a Team or Enterprise account
        from your organization, and you will use it in whichever of three
        places fits the stage you are in. You can talk to Claude in a
        browser chat and copy the reply into your project yourself, which
        suits a plan, a checklist, a commit message, or a pull request
        description. You can run Claude in the terminal against the files
        in your project and let it apply an edit, which suits a change
        that spans more than one file. You can also open Claude inside
        your editor, beside the file you are already changing, which suits
        a change in one or two files you have open. Typing a program&apos;s
        name in the terminal, instead of clicking an icon, is a{" "}
        <strong>command-line interface</strong>, usually shortened to{" "}
        <strong>CLI</strong>, and these three places — the browser, the
        CLI, and the editor — are called <strong>surfaces</strong>. Choose
        one surface for a given task, because repeating the same edit on
        all three bills your account three times and leaves you with three
        diffs to reconcile.
      </p>
      <p>
        For the browser surface, open{" "}
        <a href="https://claude.ai" target="_blank" rel="noreferrer">
          claude.ai
        </a>
        , start a new chat, and paste the requirements document before you
        ask for the plan or the checklist, so the reply stays on that
        document. The chat returns text and does not edit your repository,
        which means you read the reply and copy into the project only the
        parts that match the acceptance criteria.
      </p>
      <p>
        For a change that should land in several files, use the CLI
        surface, <strong>Claude Code</strong>, which is the same assistant
        started as a command in your project folder so it can write the
        edit to disk. Install it from the{" "}
        <a
          href="https://code.claude.com/docs/en/setup"
          target="_blank"
          rel="noreferrer"
        >
          Claude Code setup
        </a>{" "}
        page. Then, from the folder that contains your{" "}
        <code>webdev-client</code> project, run <code>claude</code>. The
        first time, it asks you to sign in in the browser; after that it
        remembers the account. Name the files to touch, paste the
        requirements, and read the diff it offers before you accept the
        edit. Accepting writes the files. Rejecting leaves them as they
        were.
      </p>
      <CodeBlock language="shell">{`cd path/to/your/webdev-client
claude`}</CodeBlock>
      <p>
        The first line moves the terminal into your project, the same way
        you <code>cd</code> before <code>npm run dev</code>. Replace{" "}
        <code>path/to/your/webdev-client</code> with the real folder. The
        second line starts Claude in that folder, so the session is about
        this project. When it asks which files to change, name the modules
        page and <code>Module.tsx</code>, because those are the files the
        issue tells you to edit, and then read the diff before you accept
        it so the files change only after you have compared them with the
        acceptance criteria.
      </p>
      <p>
        When the edit is confined to a file you already have open, use the
        editor surface, which is the Claude Code extension you installed
        in <SectionLink to="1.2.3" />. Open the file, start Claude Code the
        way that section showed, and paste the same requirements document,
        so the suggestion appears next to the code you are reviewing. In
        Cursor that panel is still Claude Code, separate from the
        editor&apos;s built-in chat, and this exercise uses the Claude
        account you signed into in <SectionLink to="1.2.3" />.
      </p>

      <h3
        id="sec-1-7-3"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        1.7.3 Token budgeting
      </h3>
      <p>
        Each of those surfaces bills your Claude account by the{" "}
        <strong>token</strong>, a small chunk of text that Claude reads or
        writes, so the prompt, the files you attach, and the reply are all
        counted together. A prompt that carries the requirements document
        and the two files you are changing therefore costs less than a chat
        that rereads the whole repository, because most of the repository
        is files this issue does not name, which is why you send the
        requirements and those files, leave the rest out, and attach the
        same requirements file again when you start a fresh chat so you do
        not retype the user stories from memory.
      </p>
      <p>
        The account also lets you pick a <strong>model</strong>, the
        particular assistant that produces the reply, and the picker offers
        a cheaper, faster model alongside a stronger, slower one. Use the
        cheaper model when the task is a commit message, the pull request
        description, or a yes-or-no check against the acceptance criteria,
        and use the stronger model when the edit touches several files and
        has to keep them consistent. Record each task in a short{" "}
        <strong>cost log</strong> on your machine, one row written before
        you start the next task, while you still remember which surface you
        used, which model you picked, which file names you sent, and
        whether you kept the result. If a task takes many retries, stop and
        narrow the prompt to the files the issue names, and leave the log
        out of the commit, because it is your notebook and it can pick up
        an account detail that does not belong in the repository.
      </p>
      <p>
        Copy the header below and replace the two sample rows with your
        own. The columns are the date, a few words naming the task, the
        surface, whether you picked the cheaper or the stronger model, the
        file names you sent, and whether you kept the result:
      </p>
      <CodeBlock language="text" name="Cost log">{`Date       Task                     Tool   Model     Context sent                          Kept?
---------- ------------------------ ------ --------- ------------------------------------- -----
2026-11-02 Add static AI buttons    CLI    stronger  requirements + two module files      yes
2026-11-02 Commit message           chat   cheaper   staged file names only               yes`}</CodeBlock>

      <h3
        id="sec-1-7-4"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        1.7.4 Requirements for the AI Assisted Course Builder
      </h3>
      <p>
        The implementation follows a requirements document the product
        manager could review, and the sample below is that document for the
        AI Assisted Course Builder, written with the four parts you just
        met in the lifecycle. The <strong>overview</strong> says what this
        chapter builds and what later chapters will add, each{" "}
        <strong>user story</strong> is one sentence in the form &quot;as a
        course author, I can …, so that …&quot;, the{" "}
        <strong>acceptance criteria</strong> are the checks you will run in
        the browser, and <strong>out of scope</strong> lists the work this
        chapter does not include, which you can read at the bottom of the
        document.
      </p>
      <p>
        Save the sample as <code>docs/ai-course-builder.md</code> on the
        feature branch you create in <SectionLink to="1.7.6" />, so the
        later prompts can point at that filename and you can attach the
        file again instead of pasting the user stories into every chat.
        When you open the file you should see the overview, five user
        stories, the acceptance criteria, and the out-of-scope list, with
        the button labels written out so you can compare them with the
        screen.
      </p>
      <CodeBlock
        language="markdown"
        name="Requirements"
        file="docs/ai-course-builder.md"
      >
        {REQUIREMENTS}
      </CodeBlock>

      <h3
        id="sec-1-7-5"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        1.7.5 Course editor starter
      </h3>
      <p>
        The Modules screen from <SectionLink to="1.4.5" />{" "}is already in
        your project, with the toolbar that contains <code>+ Module</code>{" "}
        and the weeks built from <code>Module</code> and <code>Lesson</code>,
        so you extend that page and <code>Module.tsx</code> and you keep
        every week you have already typed.
      </p>
      <p>
        Chapter 1 has no course editor, because the Dashboard in this
        chapter is a list of course cards and the title and description
        form arrives later, on that Dashboard, in{" "}
        <SectionLink to="4.10.2" />, which is where that exercise stays.
        What this section needs today is a short static page with a title
        field and a description field, so the generate buttons have fields
        to sit under while you practice the lifecycle.
      </p>
      <p>
        Create <code>app/(kambaz)/courses/[cid]/editor/page.tsx</code> and
        paste the starter below. A <code>page.tsx</code> file is the route,
        the same rule as <SectionLink to="1.2.5" />{" "}and{" "}
        <SectionLink to="1.4.4" />, because the folder path becomes the
        URL, which makes this file <code>/courses/1234/editor</code> when{" "}
        <code>1234</code> is the course id. The page is a{" "}
        <strong>Server Component</strong> by default, which means the
        browser receives the HTML and there is no <code>use client</code>{" "}
        line at the top, and that is what you want while the buttons do
        nothing. Adding <code>onClick</code> would require the file to
        become a <strong>Client Component</strong>, a component that runs
        in the browser, and that behavior belongs in a later chapter. The
        courses layout from <SectionLink to="1.4.4.1" />{" "}wraps every page
        under <code>[cid]</code>, including this new one, so Course
        Navigation stays as you built it and you leave that sidebar without
        an Editor link. Open <code>/courses/1234/editor</code> in the dev
        server you started with <code>npm run dev</code>.
      </p>
      <CodeBlock
        language="tsx"
        name="CourseEditor"
        file="app/(kambaz)/courses/[cid]/editor/page.tsx"
      >{`export default function CourseEditor() {
  return (
    <div id="wd-course-editor">
      <h2>Course Editor</h2>
      <label htmlFor="wd-course-title">Title</label>
      <br />
      <input id="wd-course-title" defaultValue="Web Development" />
      <br />
      <br />
      <label htmlFor="wd-course-description">Description</label>
      <br />
      <textarea
        id="wd-course-description"
        rows={4}
        cols={40}
        defaultValue="Build web applications with HTML."
      />
    </div>
  );
}`}</CodeBlock>
      <p>
        The starter is only the fields. The heading reads Course Editor,
        the label <code>Title</code> is tied to the input by{" "}
        <code>htmlFor</code> matching{" "}
        <code>id=&quot;wd-course-title&quot;</code>, and the description is
        a <code>textarea</code> whose <code>defaultValue</code> already
        holds a sample sentence, which sets that initial text without{" "}
        <code>useState</code> so the page is not blank when you first open
        it. The <code>id</code> values are suggestions, the same{" "}
        <code>wd-</code> names you have used since the HTML labs, and a
        control that appears once on the page can carry an id while a
        control copied into every module should use a <code>class</code>,
        because an id is unique in the document and a repeated id is
        invalid HTML.
      </p>
      <p>
        Try the prompt in <SectionLink to="1.7.6" />{" "}before you paste the
        finished controls by hand, and use the snippets that follow as the
        reference you compare the assistant&apos;s diff against, copying
        them only when the diff missed a label. Under the textarea, the
        two generate buttons read{" "}
        <code>Generate description from title</code> and{" "}
        <code>Generate title from description</code>, and{" "}
        <code>type=&quot;button&quot;</code> keeps them from submitting a
        form. There is no <code>onClick</code>, so clicking either button
        leaves both fields exactly as they were:
      </p>
      <CodeBlock language="tsx" name="Editor buttons">{`<button type="button" id="wd-generate-description">
  Generate description from title
</button>{" "}
<button type="button" id="wd-generate-title">
  Generate title from description
</button>`}</CodeBlock>
      <p>
        On the Modules page, leave Collapse All, View Progress, and the
        publish select as you wrote them, and place the new button
        immediately after the existing <code>+ Module</code> button, with
        the label <code>AI: suggest modules</code>, which is where a
        suggested list of modules will eventually start. The{" "}
        <code>{`{" "}`}</code> between the two buttons is the same space
        you already use so the labels do not run together:
      </p>
      <CodeBlock language="tsx" name="Modules toolbar">{`<button>+ Module</button>{" "}
<button type="button" id="wd-ai-suggest-modules">
  AI: suggest modules
</button>`}</CodeBlock>
      <p>
        After the module list, which means after the closing{" "}
        <code>&lt;/ul&gt;</code> of <code>wd-modules</code> and outside
        every week, add one button labeled <code>AI: next module</code>.
        It appears once, under the whole list, because the next module
        belongs to the course, while a new lesson belongs inside one week:
      </p>
      <CodeBlock language="tsx" name="After the module list">{`<button type="button" id="wd-ai-next-module">
  AI: next module
</button>`}</CodeBlock>
      <p>
        Inside each module the new controls belong on <code>Module</code>,
        so every week receives them from that one component and you do not
        copy the markup into <code>page.tsx</code>. Under the title, a
        label reads Lesson type and wraps a <code>select</code> whose
        options are exactly Reading, Slides, and Quiz. <strong>Slides</strong>{" "}
        here means a slides.js lesson, the same kind of deck this book uses
        for its own slides, and this chapter only shows that option in the
        select, leaving the deck itself, and any Video option, out of the
        file. <code>Generate lessons</code> sits beside the select and
        above the lessons you already wrote, and{" "}
        <code>AI: next lesson</code> sits after <code>wd-lessons</code>,
        which places it last in the week, under those lessons. The select
        uses <code>className=&quot;wd-lesson-type&quot;</code> and the two
        buttons use classes as well, because this component renders once
        per week and an id would be duplicated on every week:
      </p>
      <CodeBlock
        language="tsx"
        name="Module"
        file="app/(kambaz)/courses/[cid]/modules/Module.tsx"
      >{`import type { ReactNode } from "react";

export default function Module({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <li className="wd-module">
      <div className="wd-title">{title}</div>
      <label>
        Lesson type{" "}
        <select className="wd-lesson-type" defaultValue="Reading">
          <option value="Reading">Reading</option>
          <option value="Slides">Slides</option>
          <option value="Quiz">Quiz</option>
        </select>
      </label>{" "}
      <button type="button" className="wd-generate-lessons">
        Generate lessons
      </button>
      <ul className="wd-lessons">{children}</ul>
      <button type="button" className="wd-ai-next-lesson">
        AI: next lesson
      </button>
    </li>
  );
}`}</CodeBlock>
      <p>
        If your <code>Module.tsx</code> still matches the component from{" "}
        <SectionLink to="1.4.5" />, the reference above is a safe
        replacement, because it is that component plus the label, the
        select, and the two buttons. If you have already changed the file,
        add those three controls around the title and the{" "}
        <code>children</code> you already render, and leave your own markup
        in place, so that when you open Modules you still see every week
        you wrote. The figure below shows one sample module so the new
        controls are easy to find, and your page keeps the rest of the
        weeks around it.
      </p>
      <LiveDemo
        name="AiCourseBuilderDemo"
        file="app/book/ch1/embeds/AiCourseBuilderDemo.tsx"
      >
        <AiCourseBuilderDemo />
      </LiveDemo>

      <h3
        id="sec-1-7-6"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        1.7.6 Exercises
      </h3>
      <p>
        The steps below are the part of the lifecycle you carry out on
        your own project, from the feature branch through the pull request,
        and each violet block is a sample prompt of the same kind you have
        copied since <SectionLink to="1.2.3" />. Add the file names and the
        mismatch you actually see, read the reply before you keep it, and
        add a row to the cost log after each prompt you send.
      </p>
      <ol>
        <li>
          <p>
            Create the feature branch described above so this work stays
            off <code>main</code> until the pull request is reviewed. Commit
            what you want to keep, or stash it, which sets the uncommitted
            edits aside without making a commit, and then look at{" "}
            <code>git status</code>, which should list nothing left to
            commit, before <code>git checkout -b</code> creates the branch
            named <code>feature/ai-buttons</code> and switches you onto it,
            the name the later prompts refer to:
          </p>
          <CodeBlock language="shell">{`git status
git checkout -b feature/ai-buttons`}</CodeBlock>
          <p>
            After the second command, <code>git status</code> should report
            that you are on <code>feature/ai-buttons</code>, and everything
            you commit from here stays off <code>main</code> until you open
            the pull request.
          </p>
        </li>
        <li>
          <p>
            Save <code>docs/ai-course-builder.md</code> from{" "}
            <SectionLink to="1.7.4" />{" "}and create the course editor file
            from the starter in <SectionLink to="1.7.5" />{" "}yourself, before
            you ask the assistant for anything, so the requirements file
            and the title and description fields already exist when the
            prompt runs. Leave <code>page.tsx</code> and{" "}
            <code>Module.tsx</code> under <code>modules</code> for the
            assistant, because those files already contain your weeks and
            the next step is where you check that the edit keeps them.
          </p>
        </li>
        <li>
          <p>
            Prompt Claude with the requirements, and if you are using the
            CLI or the editor, let it edit the files and then read the diff
            before you accept it, while if you are using the browser chat
            the reply is text that you apply only after you have checked it
            against the reference snippets. The prompt tells the assistant
            to show the diff and stop, so the reply is a diff you can read
            before any further edit.
          </p>
          <WithAI
            prompt={`Read docs/ai-course-builder.md. Add the static controls from the acceptance criteria. The course editor file already exists; add the two generate buttons and keep the Title and Description fields. Edit app/(kambaz)/courses/[cid]/modules/page.tsx and Module.tsx. Keep every module, lesson, and content item, including Week 1. Put AI: suggest modules immediately after the + Module button. Put AI: next module after the module list. Inside each module, put a Lesson type select (Reading, Slides, Quiz only) and Generate lessons above the lessons, and AI: next lesson after the lessons. Use a class, not a repeated id, on those per-module controls. Buttons are type button, with no onClick and no fetch. Do not add a use client line, Tailwind, Bootstrap, useState, a JSON file, an API route, or a Video option. Do not edit Course Navigation. Show the diff and stop.`}
          >
            Attach the requirements file and the two module files, and
            leave the rest of the repository out of the prompt. The reply
            should be a diff that adds buttons and does not delete Week 1.
          </WithAI>
        </li>
        <li>
          <p>
            Review the diff the way a software engineer reviews a
            teammate&apos;s pull request, which means you open every changed
            file and remove a line you cannot explain, and then run{" "}
            <code>npm run dev</code> and compare both screens with the
            acceptance criteria, the same check you will ask the assistant
            to make in a moment. On <code>/courses/1234/editor</code> you
            should see the title, the description, and both generate
            buttons, and clicking each button leaves the text in place and
            the address bar unchanged, because the buttons have no handler
            and no form to submit. On <code>/courses/1234/modules</code>{" "}
            your weeks are still there, including Week 1, with{" "}
            <code>AI: suggest modules</code> beside <code>+ Module</code>{" "}
            and <code>AI: next module</code> once after the list, while
            each module shows the lesson-type select, then{" "}
            <code>Generate lessons</code>, then the lessons you already
            had, then <code>AI: next lesson</code>, and the select lists
            only Reading, Slides, and Quiz. The browser console stays
            quiet, and clicking a new button does not navigate away, so
            any of that which is missing is a mismatch you fix before you
            commit.
          </p>
          <WithAI
            prompt={`Compare the current diff to docs/ai-course-builder.md. List mismatches as a checklist. Do not edit files.`}
          >
            This prompt asks for a checklist and tells the assistant not to
            edit, so the reply should be a list you can fix yourself, or a
            follow-up you send that quotes the checklist and tells the
            assistant to leave every other file alone.
          </WithAI>
        </li>
        <li>
          <p>
            A commit message is the one-line summary of the diff, written
            in the imperative mood you already used in{" "}
            <SectionLink to="1.5" />, such as &quot;Add …&quot; where the
            verb names the change that is happening now. Ask for that line
            with the cheaper model, then read it, and discard a message
            that claims an API or a model call, because this commit only
            adds static buttons. The prompt tells the assistant not to run{" "}
            <code>git commit</code>, so the reply should be the sentence
            and nothing further.
          </p>
          <WithAI
            prompt={`Write a one-line git commit message for the staged diff on feature/ai-buttons. Imperative mood, 72 characters or fewer. Describe the static buttons. Do not run git commit.`}
          >
            Use the cheaper model. The reply is one line. If it is longer
            than 72 characters, or if it mentions an API, ask again or
            shorten it yourself before you use it.
          </WithAI>
          <p>
            Stage only the files you reviewed, and quote any path that
            contains parentheses, because the shell otherwise treats{" "}
            <code>(kambaz)</code> as a grouping and the add fails. Commit
            with the message you accepted, then push the branch.{" "}
            <code>git push -u</code> uploads it and remembers{" "}
            <code>origin</code>, the remote you added in{" "}
            <SectionLink to="1.5" />, for later pushes:
          </p>
          <CodeBlock language="shell">{`git add docs/ai-course-builder.md "app/(kambaz)/courses/[cid]/editor" "app/(kambaz)/courses/[cid]/modules"
git commit -m "Add static AI Assisted Course Builder buttons"
git push -u origin feature/ai-buttons`}</CodeBlock>
          <p>
            Replace the sample message with the line you reviewed, and
            after the push GitHub has the branch while <code>main</code> on
            the remote is unchanged.
          </p>
        </li>
        <li>
          <p>
            On GitHub, open a pull request from{" "}
            <code>feature/ai-buttons</code> into <code>main</code>, paste a
            description you have already read, and leave the pull request
            open, because this exercise stops at code review and the merge
            onto <code>main</code> is a later decision.
          </p>
          <WithAI
            prompt={`Draft a GitHub pull request description for feature/ai-buttons. Use two headings: Summary and Test plan. State that the controls are static HTML, that this work is optional and not graded, and that the buttons do not call a model. Do not claim checks you did not run.`}
          >
            The reply should have a Summary and a Test plan, and it should
            say the buttons do not call a model. You are the author of the
            pull request. Read the description, then open the Files changed
            tab and confirm it matches the diff you already reviewed, before
            you submit.
          </WithAI>
        </li>
        <li>
          <p>
            Ask the assistant to review the pull request, and then decide,
            as the software engineer who opened it, which comments to
            apply. A comment is valid when it matches{" "}
            <code>docs/ai-course-builder.md</code> or when it points at a
            bug, such as a deleted week or an id copied onto every module,
            and a comment is outside this issue when it asks for an API,
            for styling, for state, or for a Video lesson. Apply only the
            valid comments, as a new commit on the same branch, and push
            again so the pull request shows the update.
          </p>
          <WithAI
            prompt={`Review comments are below. For each one, answer valid or skip. Valid means it matches docs/ai-course-builder.md or fixes a real bug. Skip means it asks for an API, styling, state, a mock service, or a Video lesson. Do not edit files.

1. Add an onClick that fetches /api/ai.
2. The select offers Video.
3. Week 1 lessons were removed.
4. Suggest modules sits next to + Module.`}
          >
            Read the four sample comments before you paste your own, so
            you can see the judgment in action. The first asks for a fetch
            to an API, which this issue does not include, so you skip it.
            The second reports that the select offers Video, which the
            requirements exclude, so you remove that option. The third
            reports that Week 1 was removed, which breaks the acceptance
            criteria, so you restore the lessons. The fourth observes that
            suggest-modules already sits next to <code>+ Module</code>,
            which is where the requirements put it, so there is nothing to
            edit. Then replace the list with the comments on your pull
            request and judge those the same way.
          </WithAI>
        </li>
      </ol>
      <p>
        <strong>What the assistant got wrong.</strong> When you compare
        the diff with the requirements, look for a click handler, a
        Tailwind or Bootstrap class, a Video option, a new route, or a
        rewrite of Week 1, each of which sits outside the acceptance
        criteria, and remove it, then write down what you changed while
        you still remember the prompt that produced it.
      </p>
      <OnYourOwn>
        In the cost log, write three sentences that record what you asked,
        what you rejected or fixed, and what you will put in the next
        prompt so that the same mismatch does not repeat, with one row for
        each prompt you sent. Those sentences are your code review, and
        the assistant&apos;s list in the next block is a second reading of
        the same diff.
      </OnYourOwn>
      <WithAI
        prompt={`From the diff on feature/ai-buttons, list three mistakes you introduced that I had to reject or fix. One sentence each. If the diff matches the requirements, name three changes that would have been out of scope. Do not edit files.`}
      >
        Compare its list with the three sentences you wrote. Keep yours
        when they disagree. The prompt asks it not to edit, so the files
        should be unchanged when the reply arrives.
      </WithAI>
    </Section>
  );
}
