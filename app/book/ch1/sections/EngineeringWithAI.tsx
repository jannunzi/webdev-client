import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import { OnYourOwn, WithAI } from "../../components/Practice";
import AiCourseBuilderDemo from "../embeds/AiCourseBuilderDemo";

const REQUIREMENTS = `# AI Course Builder — static controls

## Overview

Course authors need an AI Course Builder on Kambaz. This slice only places the controls. They are static HTML. Clicking a control does not call a model, edit the title or description, or insert a module or lesson.

Later slices of this same feature style the controls with Tailwind, show sample suggestions from a local JSON file, keep a draft in Zustand, and call Claude from a Next.js route handler. This slice does none of that. There is no mock AI API.

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
- The select options are exactly Reading, Slides, and Quiz. Slides means a slides.js lesson. This slice does not build the deck.
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
      id="sec-1-11"
      title="1.11 Engineering with AI (optional, not graded)"
    >
      <p>
        <strong>Optional. Not graded.</strong> This section is practice you
        can skip. Nothing here is collected, and it does not add a line to
        the checklist in <SectionLink to="1.7" />. If you are only finishing
        that checklist, stop at the conclusion and come back when you want
        to practice the workflow an engineer uses with an assistant.
      </p>
      <p>
        On a product team, the engineer does not invent the feature in the
        chat window and then hope it is what anyone wanted. Someone writes
        down what the user can do. The engineer implements that description
        on its own Git branch, reads the change line by line, and only then
        asks for it to be merged. That line-by-line change is a{" "}
        <strong>diff</strong>: Git&apos;s picture of which lines were added
        and which were removed. Teams at a company such as Amazon use an
        assistant to draft, to search, and to speed up the edit, and a
        person still reviews every line that merges. You own the code. Read
        it before you keep it, and if you cannot explain a line, delete it
        rather than shipping something you do not understand.
      </p>
      <p>
        The feature you will practice on is an <strong>AI Course Builder</strong>{" "}
        for Kambaz: buttons a course author would use to draft a title, a
        description, a module list, and lessons. In this chapter those
        buttons are static HTML. They show up on the screen, and clicking
        them does not call a model or change any text. Later chapters of
        this same optional thread style those controls with Tailwind, fill
        them from a local JSON file of sample suggestions, store the draft
        in Zustand, and only then call Claude from a Next.js route handler.
        Leave that work for those chapters. There is no mock AI service to
        stand in for the call, and adding one would teach the wrong habit:
        a fake endpoint that pretends the model answered.
      </p>

      <h3
        id="sec-1-11-1"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        1.11.1 Owning the code
      </h3>
      <p>
        Treat the assistant as a fast teammate who has not read the ticket.
        It will happily write something plausible. You still decide what
        lands in the repository, the same way you would if a coworker handed
        you a patch and walked away. When you ask for the edit, paste the
        requirements document first, then name the few files the task
        actually touches. After the reply, read it against the acceptance
        criteria — the checklist of what must be true when you are done —
        before you save any of it.
      </p>
      <p>
        Keep secrets out of the chat, out of the command-line tool, and out
        of the panel in the editor. A <strong>secret</strong> here means
        anything that would let someone else act as you or read private
        data: the personal access token from <SectionLink to="1.5" />,
        anything sitting in a <code>.env</code> file, passwords, and private
        details about real people. If the assistant needs to know that a
        file exists, describe the file in a sentence. Do not paste its
        contents. Once a secret is in the transcript, you should assume it
        has left your machine.
      </p>
      <p>
        You also do not ask the tool to skip a review, to hide a change, or
        to commit files you have not opened. Those requests feel efficient
        and they are how a bad diff gets merged. The assistant can draft.
        You are the person whose name is on the commit.
      </p>

      <h3
        id="sec-1-11-2"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        1.11.2 Chat, the CLI, and the IDE
      </h3>
      <p>
        Sign in with the Claude account you already use. A personal plan
        works, and so does a Team or Enterprise plan from an organization.
        You will meet the same account in three places. A <strong>surface</strong>{" "}
        here just means where you type: the website, a command in the
        terminal, or the panel inside the editor. Pick one surface for a
        given task. Running the same edit in all three spends the tokens
        three times and gives you three diffs to reconcile.
      </p>
      <p>
        The first surface is the chat on the website. Open{" "}
        <a href="https://claude.ai" target="_blank" rel="noreferrer">
          claude.ai
        </a>
        , start a new chat, and paste the requirements document before you
        ask for anything else, so the reply is about that document and not
        about whatever the previous conversation was doing. Use the chat
        when you want a plan, a checklist, a commit message, or the
        description of a pull request. A <strong>pull request</strong> is
        the GitHub page where you propose merging a branch and where
        someone — here, you — can comment on the diff before it lands. Chat
        returns text. It does not edit your repository. You copy only the
        parts you still agree with after you have read them.
      </p>
      <p>
        The second surface is the <strong>Claude Code CLI</strong>, the
        same assistant run as a command in your project folder. Reach for
        it when the change spans more than one file and you want the edit
        applied on disk, not pasted back as a message you then have to
        retype. Install it from the{" "}
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
        page and <code>Module.tsx</code> rather than telling it to wander
        through the whole tree.
      </p>
      <p>
        The third surface is the editor extension you installed in{" "}
        <SectionLink to="1.2.3" />. It is the same assistant, sitting beside
        the file you already have open, which makes it the right choice
        when the change is one or two files you are looking at. Open the
        file, start Claude Code the way that section showed, and paste the
        same requirements. In Cursor, that panel is still Claude Code,
        separate from the editor&apos;s built-in chat — the built-in chat
        is a different product, and this exercise uses the Claude account
        you signed into in <SectionLink to="1.2.3" />.
      </p>

      <h3
        id="sec-1-11-3"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        1.11.3 Token budgeting
      </h3>
      <p>
        A <strong>token</strong> is a small chunk of text the model reads or
        writes. Your prompt, the files you attach, and the reply are all
        counted, and on these three surfaces that count is billed to your
        own Claude account. A short prompt that includes the requirements
        and the two files you are changing costs less than a chat that
        rereads the whole repository, because the repository is mostly
        files this task does not touch.
      </p>
      <p>
        Send the requirements document and the files you are changing, and
        leave the rest of the repository out of the prompt. When you start
        a fresh chat, paste or attach that same requirements file again
        instead of retyping the story from memory. The file is the stable
        description; the chat is just the place you are working today.
      </p>
      <p>
        The account also lets you pick a <strong>model</strong>, which is
        the particular assistant behind the reply. The picker lists a
        cheaper, faster model and a stronger, slower one. Use the cheaper
        model for a commit message, for the blurb at the top of a pull
        request, or for a yes-or-no check against the acceptance criteria.
        Use a stronger model when it has to edit several files and keep
        them consistent. A strong model on a one-line message spends money
        you will want later, when the edit is actually hard.
      </p>
      <p>
        Keep a short <strong>cost log</strong> on your machine: one row per
        task, written before you start the next task, so a runaway chat is
        visible while you still remember what you sent. If a task takes
        many retries, stop and narrow the prompt instead of attaching more
        files. Leave the log out of the commit. It is a notebook, not
        project source, and it is easy to jot an account detail into it by
        accident.
      </p>
      <p>
        Copy the header below and replace the two sample rows with your
        own. The columns are the date, the task in a few words, which
        surface you used, whether you picked the cheaper or the stronger
        model, what you actually sent (file names, not secrets), and
        whether you kept the result:
      </p>
      <CodeBlock language="text" name="Cost log">{`Date       Task                     Tool   Model     Context sent                          Kept?
---------- ------------------------ ------ --------- ------------------------------------- -----
2026-11-02 Add static AI buttons    CLI    stronger  requirements + two module files      yes
2026-11-02 Commit message           chat   cheaper   staged file names only               yes`}</CodeBlock>

      <h3
        id="sec-1-11-4"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        1.11.4 Requirements for the AI Course Builder
      </h3>
      <p>
        An engineer implements from a document the product team can review,
        not from a sentence typed into a chat. The document has four parts,
        and you will see all four in the sample below. The{" "}
        <strong>overview</strong> says what this slice is and, just as
        important, what it is not yet. The <strong>user stories</strong>{" "}
        are one sentence each, in the form &quot;as a course author, I can
        …, so that …&quot;, so you can tell who the control is for and why
        it is on the screen. The <strong>acceptance criteria</strong> are
        the checks you will run in the browser when the edit is done: which
        labels appear, where they sit, and what must not happen when you
        click. <strong>Out of scope</strong> is the list of tempting next
        steps you will refuse in this chapter, including a model call, a
        mock AI service, styling, and client state.
      </p>
      <p>
        Save the sample as <code>docs/ai-course-builder.md</code> on the
        feature branch you create in <SectionLink to="1.11.6" />. Later
        prompts point at that filename instead of pasting the whole story
        again, which is the token habit from the previous section. When you
        open the file you should see the overview, five user stories, the
        acceptance criteria, and the out-of-scope list, with the button
        labels written out so you can compare them to the screen.
      </p>
      <CodeBlock
        language="markdown"
        name="Requirements"
        file="docs/ai-course-builder.md"
      >
        {REQUIREMENTS}
      </CodeBlock>

      <h3
        id="sec-1-11-5"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        1.11.5 Course editor starter
      </h3>
      <p>
        The Modules screen from <SectionLink to="1.4.5" />{" "}is already in
        your project: the toolbar with <code>+ Module</code>, and the weeks
        built from <code>Module</code> and <code>Lesson</code>. You will
        extend that page and <code>Module.tsx</code>. Do not paste a second
        Modules page over the one you wrote, or you will lose the weeks you
        already typed.
      </p>
      <p>
        Chapter 1 has no course editor. The Dashboard in this chapter is a
        list of course cards, and the title and description form arrives
        later, on that Dashboard, in <SectionLink to="4.10.2" />. Leave
        that exercise where it is. Copying it forward would turn a later
        chapter into something you have already done, and this optional
        section is not the place that form is taught. What you need today
        is a short static page with a title field and a description field,
        so the generate buttons have something to sit under.
      </p>
      <p>
        Create <code>app/(kambaz)/courses/[cid]/editor/page.tsx</code> and
        paste the starter below. A <code>page.tsx</code> file is the route,
        the same rule as <SectionLink to="1.2.5" />{" "}and{" "}
        <SectionLink to="1.4.4" />: the folder path becomes the URL, so this
        file is <code>/courses/1234/editor</code> when <code>1234</code> is
        the course id. The page is a <strong>Server Component</strong> by
        default, which means the browser receives the HTML and there is no{" "}
        <code>use client</code> line at the top. That is what you want while
        the buttons do nothing. Adding <code>onClick</code> would force the
        file to become a Client Component, and that behavior belongs in a
        later chapter. The courses layout from{" "}
        <SectionLink to="1.4.4.1" />{" "}wraps every page under{" "}
        <code>[cid]</code>, including this new one, so Course Navigation
        stays as it is. You do not add an Editor link to that sidebar. Open{" "}
        <code>/courses/1234/editor</code> yourself in the dev server.
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
        The starter is only the fields. The heading says Course Editor, the
        label <code>Title</code> is tied to the input with{" "}
        <code>htmlFor</code> and <code>id=&quot;wd-course-title&quot;</code>,
        and the description is a <code>textarea</code> with a sample
        sentence already filled in so the page is not blank.{" "}
        <code>defaultValue</code> sets that initial text without{" "}
        <code>useState</code>. The <code>id</code> values are suggestions,
        the same <code>wd-</code> habit as the rest of the chapter. A
        control that appears once on the page can have an id. A control
        that is copied into every module should use a <code>class</code>{" "}
        instead, because an id is supposed to be unique and a repeated id
        is invalid HTML.
      </p>
      <p>
        Try the prompt in <SectionLink to="1.11.6" />{" "}before you paste the
        finished controls by hand. The snippets that follow are the
        reference you compare the assistant&apos;s diff against, and the
        markup you copy only if the diff missed a label. Under the
        textarea, the two generate buttons read{" "}
        <code>Generate description from title</code> and{" "}
        <code>Generate title from description</code>.{" "}
        <code>type=&quot;button&quot;</code> keeps them from submitting
        anything. There is no <code>onClick</code>, so clicking one leaves
        both fields exactly as they were:
      </p>
      <CodeBlock language="tsx" name="Editor buttons">{`<button type="button" id="wd-generate-description">
  Generate description from title
</button>{" "}
<button type="button" id="wd-generate-title">
  Generate title from description
</button>`}</CodeBlock>
      <p>
        On the Modules page, leave Collapse All, View Progress, and the
        publish select alone. The new button sits immediately after the
        existing <code>+ Module</code> button, and its label is{" "}
        <code>AI: suggest modules</code>, so it is obvious that this is
        where a suggested list of modules will eventually start. The{" "}
        <code>{`{" "}`}</code> between the two buttons is the same space
        you already use so the labels do not run together:
      </p>
      <CodeBlock language="tsx" name="Modules toolbar">{`<button>+ Module</button>{" "}
<button type="button" id="wd-ai-suggest-modules">
  AI: suggest modules
</button>`}</CodeBlock>
      <p>
        After the module list — after the closing <code>&lt;/ul&gt;</code>{" "}
        of <code>wd-modules</code>, not inside any week — add one more
        button, <code>AI: next module</code>. It appears once, under every
        week, because it offers the next module for the whole course rather
        than a lesson inside one week:
      </p>
      <CodeBlock language="tsx" name="After the module list">{`<button type="button" id="wd-ai-next-module">
  AI: next module
</button>`}</CodeBlock>
      <p>
        Inside each module the new controls belong on <code>Module</code>,
        so every week gets them without you copying the markup into{" "}
        <code>page.tsx</code>. Under the title, a label reads Lesson type
        and wraps a <code>select</code>. The options are exactly Reading,
        Slides, and Quiz. <strong>Slides</strong> here means a slides.js
        lesson, the same kind of deck the book&apos;s own slides use. This
        chapter only shows the option in the select. It does not build the
        deck, and there is no Video option to add. <code>Generate lessons</code>{" "}
        sits next to the select, above the lessons you already wrote.{" "}
        <code>AI: next lesson</code> sits after <code>wd-lessons</code>, so
        it is the last thing in that week, under the lessons rather than
        mixed into them. The select uses <code>className=&quot;wd-lesson-type&quot;</code>,
        and the two buttons use classes as well, because this component
        renders once per week and an id would be duplicated:
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
        replacement: it is that component plus the label, the select, and
        the two buttons. If you already changed the file, do not overwrite
        it. Add those three controls around the title and the{" "}
        <code>children</code> you already render, and leave your own markup
        in place. When you open Modules you should still see every week you
        wrote. The figure below shows one sample module so the new controls
        are easy to find; your page keeps the rest of the weeks around it.
      </p>
      <LiveDemo
        name="AiCourseBuilderDemo"
        file="app/book/ch1/embeds/AiCourseBuilderDemo.tsx"
      >
        <AiCourseBuilderDemo />
      </LiveDemo>

      <h3
        id="sec-1-11-6"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        1.11.6 Exercises
      </h3>
      <p>
        Work through the steps below on your own project, in order. Each
        violet block is a sample prompt, the same kind of copyable prompt
        as the With AI blocks earlier in the chapter. Treat it as a start:
        add the file names and the mismatch you actually see, and read the
        reply before you keep it. Add a row to the cost log after each
        prompt you send.
      </p>
      <ol>
        <li>
          <p>
            The buttons do not belong on <code>main</code> mixed in with
            the chapter work you already finished. Commit or stash anything
            you want to keep, then look at <code>git status</code> so you
            know the working tree is clean. <code>git checkout -b</code>{" "}
            creates a new branch and switches to it. Name it{" "}
            <code>feature/ai-buttons</code>, which is the branch the later
            prompts refer to:
          </p>
          <CodeBlock language="shell">{`git status
git checkout -b feature/ai-buttons`}</CodeBlock>
          <p>
            After the second command, <code>git status</code> should say
            you are on <code>feature/ai-buttons</code>. Everything you
            commit from here stays off <code>main</code> until you open the
            pull request.
          </p>
        </li>
        <li>
          <p>
            Save <code>docs/ai-course-builder.md</code> from{" "}
            <SectionLink to="1.11.4" />{" "}and create the course editor file
            from the starter in <SectionLink to="1.11.5" />. Do these two
            copies yourself, before you ask the assistant for anything, so
            the requirements file and the empty fields already exist when
            the prompt runs. Leave <code>page.tsx</code> and{" "}
            <code>Module.tsx</code> under <code>modules</code> for the
            assistant. Those files already contain your weeks, and the
            point of the next step is to watch whether the edit keeps them.
          </p>
        </li>
        <li>
          <p>
            Prompt Claude with the requirements. If you are in the CLI or
            the IDE, let it edit the files and then read the diff before
            you accept it. If you are in the website chat, the reply is
            text: apply only the parts you have checked against the
            reference snippets. The prompt tells it to show the diff and
            stop, so you should get a change to read rather than a second
            round of edits you did not ask for.
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
            Review the diff the way you would review a teammate&apos;s pull
            request: open every changed file, and reject a line you cannot
            explain. Then run <code>npm run dev</code> and walk both
            screens against the acceptance criteria, which is the same
            check you will ask the assistant to make in a moment.
          </p>
          <p>
            On <code>/courses/1234/editor</code> you should see the title,
            the description, and both generate buttons. Click each button.
            The text in the fields stays put, and the address bar does not
            change, because the buttons have no handler and no form to
            submit.
          </p>
          <p>
            On <code>/courses/1234/modules</code> your weeks are still
            there, including Week 1. <code>AI: suggest modules</code> sits
            beside <code>+ Module</code>, and <code>AI: next module</code>{" "}
            sits once, after the list. Each module shows the lesson-type
            select, then <code>Generate lessons</code>, then the lessons
            you already had, then <code>AI: next lesson</code>. Open the
            select and confirm the only options are Reading, Slides, and
            Quiz.
          </p>
          <p>
            The browser console stays quiet, and clicking a new button
            does not navigate away. If any of that is missing, you have a
            mismatch to fix before you commit.
          </p>
          <WithAI
            prompt={`Compare the current diff to docs/ai-course-builder.md. List mismatches as a checklist. Do not edit files.`}
          >
            This prompt asks for a checklist and tells the assistant not to
            edit. You should get a list, not another diff. Fix the
            mismatches yourself, or send a follow-up that quotes the
            checklist and says to leave every other file alone.
          </WithAI>
        </li>
        <li>
          <p>
            A commit message is a one-line summary of the diff, in the
            imperative mood you already used in <SectionLink to="1.5" />{" "}
            (&quot;Add …&quot;, not &quot;Added …&quot;). Ask for that line
            with the cheaper model, then read it. Reject a message that
            claims an API or a model call, because this commit only adds
            static buttons. The prompt says not to run{" "}
            <code>git commit</code>, so the assistant should hand you the
            sentence and stop.
          </p>
          <WithAI
            prompt={`Write a one-line git commit message for the staged diff on feature/ai-buttons. Imperative mood, 72 characters or fewer. Describe the static buttons. Do not run git commit.`}
          >
            Use the cheaper model. The reply is one line. If it is longer
            than 72 characters, or if it mentions an API, ask again or
            shorten it yourself before you use it.
          </WithAI>
          <p>
            Stage only the files you reviewed. Paths that contain
            parentheses must be quoted, or the shell treats{" "}
            <code>(kambaz)</code> as a grouping and the add fails. Then
            commit with the message you accepted, and push the branch.
            <code>git push -u</code> uploads it and remembers{" "}
            <code>origin</code> as the remote for later pushes:
          </p>
          <CodeBlock language="shell">{`git add docs/ai-course-builder.md "app/(kambaz)/courses/[cid]/editor" "app/(kambaz)/courses/[cid]/modules"
git commit -m "Add static AI Course Builder buttons"
git push -u origin feature/ai-buttons`}</CodeBlock>
          <p>
            Replace the sample message with the line you actually reviewed.
            After the push, GitHub has the branch, and <code>main</code> on
            the remote is unchanged.
          </p>
        </li>
        <li>
          <p>
            On GitHub, open a pull request from{" "}
            <code>feature/ai-buttons</code> into <code>main</code>. The
            description is the note at the top of that page. Paste a
            description you have already read, create the pull request, and
            leave it open. Merging would put the buttons on{" "}
            <code>main</code>, and this exercise stops at the review.
          </p>
          <WithAI
            prompt={`Draft a GitHub pull request description for feature/ai-buttons. Use two headings: Summary and Test plan. State that the controls are static HTML, that this work is optional and not graded, and that the buttons do not call a model. Do not claim checks you did not run.`}
          >
            The reply should have a Summary and a Test plan, and it should
            say the buttons do not call a model. Before you submit, open
            the Files changed tab and confirm it matches the diff you
            already reviewed. You are the author of the pull request, so a
            wrong sentence in the description is yours.
          </WithAI>
        </li>
        <li>
          <p>
            Ask the assistant to review the pull request, then decide which
            comments are worth applying. A comment is valid when it matches{" "}
            <code>docs/ai-course-builder.md</code> or when it points at a
            real bug, such as a deleted week or an id copied onto every
            module. A comment is out of scope when it asks for an API, for
            styling, for state, for a mock service, or for a Video lesson.
            Apply only the valid ones, as a new commit on the same branch,
            and push again so the pull request updates.
          </p>
          <WithAI
            prompt={`Review comments are below. For each one, answer valid or skip. Valid means it matches docs/ai-course-builder.md or fixes a real bug. Skip means it asks for an API, styling, state, a mock service, or a Video lesson. Do not edit files.

1. Add an onClick that fetches /api/ai.
2. The select offers Video.
3. Week 1 lessons were removed.
4. Suggest modules sits next to + Module.`}
          >
            Walk the four sample comments before you paste your own. The
            first asks for a fetch to an API, so you skip it. The second
            reports that the select offers Video, which the requirements
            forbid, so it is valid and you remove that option. The third
            reports that Week 1 was removed, which is a real bug, so it is
            valid and you restore the lessons. The fourth only observes
            that suggest-modules already sits next to <code>+ Module</code>,
            which is where the requirements put it, so there is nothing to
            edit. Then replace the list with the comments on your pull
            request and judge those the same way.
          </WithAI>
        </li>
      </ol>
      <p>
        <strong>What the assistant got wrong.</strong> On a task this
        small, the reply often still adds a click handler, a Tailwind or
        Bootstrap class, a Video option, a new route, or a rewrite of Week
        1. None of those are in the requirements, and each one is the kind
        of line you delete when you read the diff. Write down what happened
        this time, while you still remember the prompt that caused it.
      </p>
      <OnYourOwn>
        In the cost log, write three sentences: what you asked, what you
        rejected or fixed, and what you will put in the next prompt so that
        mistake does not repeat. One row per prompt is enough. The
        sentences are the review. The assistant&apos;s own list, in the
        next block, is only a second opinion.
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
