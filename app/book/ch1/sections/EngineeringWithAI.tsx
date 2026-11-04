import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import OfficialLink from "../../components/OfficialLink";
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
        AI is quickly becoming an indispensable tool in most industries,
        bringing unprecedented opportunity as well as uncertainty and angst.
        As software engineers in general, and full stack developers in
        particular, we must learn to use AI throughout the day-to-day{" "}
        <OfficialLink href="https://en.wikipedia.org/wiki/Systems_development_life_cycle">
          <strong>software development lifecycle</strong>
        </OfficialLink>
        . This section is the first of several throughout the book that
        teach industry-leading practices for using AI to build Web
        applications. To practice these skills, we will build a new feature
        for Kambaz, the <strong>AI-Assisted Course Builder</strong>, and
        learn to work with an AI assistant the way a software engineer does
        on a professional team. A course author will be able to use the
        Course Builder to draft a course title from a description, a
        description from a title, a list of modules, and the lessons inside
        each module. We will build the feature one layer at a time over the
        next several chapters, and at each layer AI will take on a different
        part of the work. In this chapter, you will ask an AI assistant to
        turn the feature&apos;s requirements into a static HTML prototype,
        and then you will review its markup line by line before you commit
        it. In <ChapterLink to={2} />, you will ask the assistant to style
        those controls with{" "}
        <OfficialLink href="https://tailwindcss.com/">
          <strong>Tailwind CSS</strong>
        </OfficialLink>{" "}
        and to explain the classes it chose, so that you understand every
        style you accept. In <ChapterLink to={3} />, the assistant will
        generate a local JSON file of realistic sample suggestions, and you
        will check that the data matches the shape your components expect.
        In <ChapterLink to={4} />, the assistant will draft the{" "}
        <OfficialLink href="https://zustand.docs.pmnd.rs/">
          <strong>Zustand</strong>
        </OfficialLink>{" "}
        client-side store that holds the draft, along with tests that
        confirm it behaves as specified. A later chapter will call an AI
        model directly from a Next.js{" "}
        <OfficialLink
          href="https://nextjs.org/docs/app/building-your-application/routing/route-handlers"
          term="Route Handlers"
        >
          <strong>route handler</strong>
        </OfficialLink>
        , a function on the server that receives a request and sends back a
        response, so that the Course Builder can generate real suggestions.
        Throughout, AI will draft and explain while you decide what ships,
        which is how production teams at companies such as Amazon and Google
        use AI assistants.
      </p>
      <p>
        In a product team, a new feature or bug fix moves through the{" "}
        <OfficialLink href="https://en.wikipedia.org/wiki/Systems_development_life_cycle">
          <strong>software development lifecycle</strong>
        </OfficialLink>
        , the sequence of stages from the written requirement to production.
        Production is the environment where the released application runs
        for its users, separate from the copy on the developer&apos;s
        machine. A{" "}
        <OfficialLink href="https://en.wikipedia.org/wiki/Product_manager">
          <strong>product manager</strong>
        </OfficialLink>{" "}
        writes what the user needs and how the
        team will recognize finished work, the team tracks that work, and a
        software engineer designs the change, isolates it, writes the code,
        and checks it. The engineer then asks other developers to read the
        change, the project runs its automated checks, and the engineer
        combines the change into the main line, publishes it, and watches
        the released application. Across those stages an AI assistant helps
        the software engineer build a prototype or implement a feature, and
        it helps write{" "}
        <OfficialLink href="https://en.wikipedia.org/wiki/Unit_testing">
          <strong>unit tests</strong>
        </OfficialLink>
        , which check one piece of code, and{" "}
        <OfficialLink href="https://en.wikipedia.org/wiki/Integration_testing">
          <strong>integration tests</strong>
        </OfficialLink>
        , which check that the pieces work together. The
        same AI assistant can create a branch, rebase, merge, and open the
        proposal to merge, review that proposal, draft the requirements and
        the tracked work item, debug a failure, write documentation, and
        automate a repeated process such as the script those automated
        checks run. The software engineer and the product manager stay
        accountable for the decisions, and the exercises below follow the
        lifecycle through the requirements, the isolated branch, the
        implementation, a manual check, and the proposal to merge, stopping
        before the merge you already practice for this chapter in{" "}
        <SectionLink to="1.5" />{" "}and <SectionLink to="1.6" />.
      </p>
      <p>
        The lifecycle begins with the{" "}
        <OfficialLink href="https://en.wikipedia.org/wiki/Product_requirements_document">
          <strong>product requirements</strong>
        </OfficialLink>
        , which a product
        manager writes so the team agrees on the feature or the bug fix
        before a software engineer edits any code. A{" "}
        <OfficialLink href="https://www.atlassian.com/agile/project-management/user-stories">
          <strong>user story</strong>
        </OfficialLink>{" "}
        is one sentence of that document. It names who the user is, what
        they can do, and why that capability matters.{" "}
        <OfficialLink href="https://www.atlassian.com/work-management/project-management/acceptance-criteria">
          <strong>Acceptance criteria</strong>
        </OfficialLink>{" "}
        are the checks that define finished work, such as which labels
        appear on the screen and what stays unchanged when the user clicks.
        An assistant can draft the stories and the criteria from the
        product manager&apos;s notes. The product manager is accountable
        for accepting the document the software engineer will build.
      </p>
      <p>
        The team then files that agreed work as an issue, also called a
        ticket, in an{" "}
        <OfficialLink href="https://docs.github.com/en/issues">
          <strong>issue tracker</strong>
        </OfficialLink>
        , the shared list where the team records work and its status.{" "}
        <OfficialLink href="https://www.atlassian.com/software/jira">
          <strong>Jira</strong>
        </OfficialLink>{" "}
        is a common tracker, and{" "}
        <OfficialLink href="https://docs.github.com/en/issues/tracking-your-work-with-issues/about-issues">
          <strong>GitHub Issues</strong>
        </OfficialLink>{" "}
        and{" "}
        <OfficialLink href="https://linear.app/">
          <strong>Linear</strong>
        </OfficialLink>{" "}
        are others. The issue stores the requirement, the acceptance
        criteria, and a status that moves from to do, to in progress, to in
        review, and then to done, so a software engineer can pick the issue
        up and know which feature or bug fix it describes. An AI assistant can
        draft the issue text from the requirements. The product manager, or
        the developer who files the issue, sets its scope and assigns it,
        and the software engineer who takes it is accountable for building
        what it says.
      </p>
      <p>
        Design is the stage in which the software engineer decides the
        shape of the change before editing files. The engineer chooses
        which screens will change, which files those screens live in, and
        which requests belong in a later issue. An AI assistant can propose
        that list of files from the requirements. The engineer selects the
        design and writes it on the issue, so the implementation has a
        target the reviewer can compare with the code.
      </p>
      <p>
        The software engineer then isolates the work on a{" "}
        <OfficialLink href="https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell">
          <strong>feature branch</strong>
        </OfficialLink>
        , a separate line of Git commits started from <code>main</code>{" "}
        with <code>git checkout -b</code>. The unfinished commits stay off{" "}
        <code>main</code> until code review, using the same commits you
        already make in <SectionLink to="1.5" />. An AI assistant can create
        that branch. The software engineer chooses the branch name and
        remains accountable for every commit on it.
      </p>
      <p>
        Implementation is the stage in which the code for the issue is
        written on that branch. An AI assistant can draft the code from the
        requirements and from the files named in the design. The software
        engineer then reads the{" "}
        <OfficialLink href="https://git-scm.com/docs/git-diff">
          <strong>diff</strong>
        </OfficialLink>
        , Git&apos;s line-by-line record of which lines were added and
        which were removed, and compares that record with the acceptance
        criteria. The engineer keeps only the lines they can explain,
        because those are the lines they will defend in review.
      </p>
      <p>
        Tests are the stage in which the software engineer checks that the
        branch behaves as the issue requested. The check may be an
        automated command, or a manual pass through the screens. An
        assistant can draft a unit test, an integration test, or a
        checklist for that pass. The engineer runs the check and judges
        whether the behavior matches the acceptance criteria, and the
        engineer is accountable for that judgment.
      </p>
      <p>
        When the check is satisfactory, the software engineer opens a{" "}
        <OfficialLink href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests">
          <strong>pull request</strong>
        </OfficialLink>
        , the GitHub page that proposes merging the feature branch into{" "}
        <code>main</code> and shows the diff to reviewers.{" "}
        <OfficialLink href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews">
          <strong>Code review</strong>
        </OfficialLink>{" "}
        is that reading of the diff. An AI assistant can draft the pull
        request description and can add review comments. The software
        engineer who opened the pull request decides which comments match
        the requirements and which ask for work the issue did not include,
        and that engineer is accountable for what the pull request
        contains.
      </p>
      <p>
        <OfficialLink href="https://docs.github.com/en/actions/concepts/overview/about-continuous-integration-with-github-actions">
          <strong>Continuous integration</strong>
        </OfficialLink>
        , or CI, is the stage in which the repository runs its build and
        its tests on the pull request automatically. An assistant can help
        the software engineer read the log when a check fails, and it can
        draft the script those checks run. A green result is evidence that
        the automated steps passed. The engineer decides whether the
        feature is ready to merge.
      </p>
      <p>
        Merge is the stage that copies the reviewed feature branch onto{" "}
        <code>main</code>, and deploy is the stage that publishes{" "}
        <code>main</code> to the environment where the released application
        runs, which you already do for this chapter in{" "}
        <SectionLink to="1.6" />. An AI assistant can draft the short note
        that describes what changed, and it can run the merge or the deploy
        when the software engineer asks it to. The engineer who merges and
        deploys confirms that the released application is the one the
        reviewers read.
      </p>
      <p>
        After deploy, the software engineer monitors the released
        application. Monitoring means reading error logs and failed
        requests, and checking that the feature still meets the acceptance
        criteria. An assistant can summarize a log. The engineer decides
        whether the behavior is an incident and which new issue to file,
        which starts the lifecycle again.
      </p>

      <h3
        id="sec-1-7-1"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        1.7.1 Owning the code
      </h3>
      <p>
{"During implementation, software engineers are responsible for deciding how to best incorporate AI assistants into the process. It is best to think of them as very capable software engineers themselves, but you retain the criteria, decisions, and responsibility. You must decide what AI assistants are allowed to do, how they participate in the software development cycle, and how to review content generated by assistants. AI assistants can draft prototype implementations from the requirements and the files you include in the prompt. The issue, acceptance criteria, and file list appear in the response when you include them and are absent when you omit them. Paste the requirements document first, name the few files the issue covers, and after receiving the reply, save only the lines that match the acceptance criteria. Those are the lines you will explain in code review."}
</p>
      <p>
        That accountability also covers secrets, the values that would let
        someone else act as you or read private data. A secret includes the
        personal access token from <SectionLink to="1.5" />, anything in a{" "}
        <code>.env</code> file, a password, and private details about real
        people. Keep those values out of the browser chat, out of the
        command-line tool, and out of the panel in the editor. When the
        assistant needs to know that a file exists, describe the file in a
        sentence and leave its contents on your machine, because a value
        pasted into the conversation has left your machine.
      </p>

      <h3
        id="sec-1-7-2"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        1.7.2 Chat, the CLI, and the IDE
      </h3>
      <p>
        <OfficialLink href="https://claude.ai">
          <strong>Claude</strong>
        </OfficialLink>{" "}
        is an AI assistant from{" "}
        <OfficialLink href="https://www.anthropic.com/">
          <strong>Anthropic</strong>
        </OfficialLink>{" "}
        that a software engineer can use in three places, depending on
        whether the task is advice, an edit across files, or a suggestion
        beside one open file. In the browser you talk to Claude and copy
        the reply into the project, which fits a plan, a checklist, a
        commit message, or a pull request description. In the terminal you
        run Claude against the project so it can apply an edit, which fits
        a change that spans more than one file. In the editor you open
        Claude next to the file you are changing, which fits a smaller
        edit. This section assumes you already have a Claude account. A
        personal account works, and so does a Team or Enterprise account
        from your organization.
      </p>
      <p>
        The terminal way of working has a name of its own. Typing a
        program&apos;s name in the terminal, instead of clicking an icon,
        is a{" "}
        <OfficialLink href="https://en.wikipedia.org/wiki/Command-line_interface">
          <strong>command-line interface</strong>
        </OfficialLink>
        , shortened to CLI. The browser, the CLI, and the editor are called
        surfaces, the places where you type to the same AI assistant. Choose
        one surface for a task. Repeating the edit on all three bills the
        account three times and produces three diffs to reconcile.
      </p>
      <p>
        The browser surface is the chat at{" "}
        <a href="https://claude.ai" target="_blank" rel="noreferrer">
          claude.ai
        </a>
        , which you use when you want text back and you will apply the edit
        yourself. Start a new chat and paste the requirements document
        before you ask for the plan or the checklist, so the reply stays on
        that document. The chat returns text and does not edit the
        repository. You copy into the project only the parts that match the
        acceptance criteria.
      </p>
      <p>
        <OfficialLink href="https://code.claude.com/docs/en/vs-code">
          <strong>Claude Code</strong>
        </OfficialLink>{" "}
        is the CLI surface, the same AI assistant started as a command in your
        project folder when the edit should change more than one file.
        Install it from the{" "}
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
        issue tells you to edit. Read the diff before you accept it, so the
        files change only after you have compared them with the acceptance
        criteria.
      </p>
      <p>
        When the edit is confined to a file you already have open, use the
        editor surface, which is the Claude Code extension you installed
        in <SectionLink to="1.2.3" />. Open the file, start Claude Code the
        way that section showed, and paste the same requirements document,
        so the suggestion appears next to the code you are reviewing. In
        Cursor that panel is still Claude Code, separate from the
        editor&apos;s built-in chat. This exercise uses the Claude account
        you signed into in <SectionLink to="1.2.3" />.
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
        and the two files you are changing costs less than a chat that
        rereads the whole repository. Most of the repository is files this
        issue does not name. Send the requirements and those two files,
        leave the rest out, and attach the same requirements file again
        when you start a fresh chat, so you do not retype the user stories
        from memory.
      </p>
      <p>
        The account also lets you pick a <strong>model</strong>, the
        particular assistant that produces the reply. The picker offers a
        cheaper, faster model and a stronger, slower one. Use the cheaper
        model for a commit message, for the pull request description, or
        for a yes-or-no check against the acceptance criteria. Use the
        stronger model when the edit touches several files and has to keep
        them consistent.
      </p>
      <p>
        A <strong>cost log</strong> is the notebook where you record that
        choice, one row per task, written before you start the next task.
        Each row notes the surface, the model, the file names you sent, and
        whether you kept the result, while you still remember them. If a
        task takes many retries, stop and narrow the prompt to the files
        the issue names. Leave the log out of the commit, because it can
        pick up an account detail that does not belong in the repository.
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
        The implementation follows a requirements document a product
        manager could review. The sample below is that document for the AI
        Assisted Course Builder, written with the four parts from the
        lifecycle. The overview says what this chapter will build and what
        later chapters will add. Each user story is one sentence in the
        form &quot;as a course author, I can …, so that …&quot;, which
        describes the capability the course author will have. The
        acceptance criteria are the checks you will run in the browser.
        Out of scope, at the bottom of the document, lists the work this
        chapter does not include.
      </p>
      <p>
        Save the sample as <code>docs/ai-course-builder.md</code> on the
        feature branch you create in <SectionLink to="1.7.6" />. Later
        prompts can then point at that filename, and you can attach the
        file again instead of pasting the user stories into every chat.
        When you open the file you should see the overview, five user
        stories, the acceptance criteria, and the out-of-scope list. The
        button labels are written out so you can compare them with the
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
            acceptance criteria, the same check you will ask the AI assistant
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
            Ask the AI assistant to review the pull request, and then decide,
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
        <strong>What the AI assistant got wrong.</strong> When you compare
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
        the AI assistant&apos;s list in the next block is a second reading of
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
