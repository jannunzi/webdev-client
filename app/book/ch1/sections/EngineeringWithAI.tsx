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
        <strong>Optional. Not graded.</strong> Nothing in this section is
        collected, and it does not change the checklist in{" "}
        <SectionLink to="1.7" />. Skip it if you are only finishing that
        checklist.
      </p>
      <p>
        On a product team, an engineer ships what a requirements document
        says, on a branch, after reading the diff. Teams at a company such
        as Amazon use an assistant to draft and to search, and a person
        still reviews every line that merges. You own the code. Read it
        before you keep it. If you cannot explain a line, delete it.
      </p>
      <p>
        The feature you will practice on is an <strong>AI Course Builder</strong>{" "}
        for Kambaz. This chapter only puts static buttons on the screen.
        Later chapters of this optional thread style those same controls
        with Tailwind, fill them from a local JSON file of sample
        suggestions, store the draft in Zustand, and call Claude from a
        Next.js route handler. Leave that work for those chapters. Do not
        add a mock AI service in its place.
      </p>

      <h3
        id="sec-1-11-1"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        1.11.1 Owning the code
      </h3>
      <p>
        Treat the assistant as a fast teammate who has not seen the ticket.
        You still decide what lands in the repository.
      </p>
      <ul>
        <li>
          Paste the requirements, then the few files the task touches. Read
          the reply against the acceptance criteria before you save it.
        </li>
        <li>
          Keep secrets out of the chat, the CLI, and the IDE panel. That
          includes the personal access token from <SectionLink to="1.5" />,
          anything in <code>.env</code>, passwords, and private data about
          real people. Describe a secret file. Do not paste it.
        </li>
        <li>
          Do not ask the tool to skip a review, hide a change, or commit
          files you have not opened.
        </li>
      </ul>

      <h3
        id="sec-1-11-2"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        1.11.2 Chat, the CLI, and the IDE
      </h3>
      <p>
        Sign in with the Claude account you already use. A personal plan
        works, and so does a Team or Enterprise plan from an organization.
        Three surfaces share that account. Pick one per task. Running the
        same edit in all three spends tokens three times.
      </p>
      <p>
        <strong>Chat.</strong> Open{" "}
        <a href="https://claude.ai" target="_blank" rel="noreferrer">
          claude.ai
        </a>
        , start a new chat, and paste the requirements document first. Use
        chat for a plan, a checklist, a commit message, or a pull request
        description. Chat returns text. It does not edit your repository.
        You copy what you still agree with.
      </p>
      <p>
        <strong>Claude Code CLI.</strong> Use this when the change spans
        more than one file and you want the edit applied in the project.
        Install it from the{" "}
        <a
          href="https://code.claude.com/docs/en/setup"
          target="_blank"
          rel="noreferrer"
        >
          Claude Code setup
        </a>{" "}
        page, then from your project folder run <code>claude</code> and sign
        in if asked. Name the files to touch, paste the requirements, and
        read the diff before you accept it.
      </p>
      <CodeBlock language="shell">{`cd path/to/your/webdev-client
claude`}</CodeBlock>
      <p>
        <strong>IDE.</strong> The editor extension from{" "}
        <SectionLink to="1.2.3" />{" "}is the same assistant beside the file you
        have open. Use it for a change in one or two files you are already
        editing. In Cursor, that panel is still Claude Code, separate from
        the editor&apos;s built-in chat.
      </p>

      <h3
        id="sec-1-11-3"
        className="scroll-mt-6 font-sans text-xl font-semibold"
      >
        1.11.3 Token budgeting
      </h3>
      <p>
        Tokens on these three surfaces are billed to your own Claude
        account. A short prompt with the requirements and two files costs
        less than a chat that rereads the whole repository. A few habits
        keep a task small:
      </p>
      <ul>
        <li>
          Send the requirements document and the files you are changing.
          Leave the rest of the repository out of the prompt.
        </li>
        <li>
          Reuse one requirements file. In a new chat, paste or attach that
          file again instead of retyping the story.
        </li>
        <li>
          Use the cheaper model in the picker for a commit message, a pull
          request blurb, or a yes-or-no check against the acceptance
          criteria. Use a stronger model when it edits several files.
        </li>
        <li>
          Write one row in a cost log before you start the next task. If a
          task takes many retries, stop and narrow the prompt.
        </li>
      </ul>
      <p>
        Keep the log on your machine. Leave it out of the commit. Copy this
        header and replace the sample row:
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
        Engineers implement from a document a product team can review:
        overview, user stories, acceptance criteria, and out of scope. Save
        this sample as <code>docs/ai-course-builder.md</code> on your
        feature branch. Later prompts point at that file.
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
        your project. Extend that page and <code>Module.tsx</code>. Do not
        paste a second Modules page over it.
      </p>
      <p>
        Chapter 1 has no course editor. The title and description form
        arrives later, on the Dashboard, in <SectionLink to="4.10.2" />.
        Leave that exercise where it is. Copy the starter below into a new
        file so this optional work has fields to extend. A{" "}
        <code>page.tsx</code> file is the route. It is a Server Component
        by default, which is what you want while the buttons do nothing.
        The courses layout from <SectionLink to="1.4.4.1" />{" "}wraps the
        page, so Course Navigation stays as it is. Open{" "}
        <code>/courses/1234/editor</code> in your own dev server.
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
        Try the prompt in <SectionLink to="1.11.6" />{" "}before you paste the
        finished controls by hand. Use this reference when you review or
        fix the result. Ids on unique controls, and classes on controls
        that repeat in every module, are suggestions.
      </p>
      <CodeBlock language="tsx" name="Editor buttons">{`<button type="button" id="wd-generate-description">
  Generate description from title
</button>{" "}
<button type="button" id="wd-generate-title">
  Generate title from description
</button>`}</CodeBlock>
      <CodeBlock language="tsx" name="Modules toolbar">{`<button>+ Module</button>{" "}
<button type="button" id="wd-ai-suggest-modules">
  AI: suggest modules
</button>`}</CodeBlock>
      <CodeBlock language="tsx" name="After the module list">{`<button type="button" id="wd-ai-next-module">
  AI: next module
</button>`}</CodeBlock>
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
        Slides is a slides.js lesson. This chapter only shows the option in
        the select.
      </p>
      <p>
        If your <code>Module.tsx</code> still matches <SectionLink to="1.4.5" />,
        the reference above is a safe replacement. If you already changed
        that file, add the label, the select, and the two buttons, and keep
        your <code>title</code> and <code>children</code>. The rendered
        target looks like this (one sample module; your page still has the
        weeks you already wrote):
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
        Do these steps on your own project. The sample prompts are a start.
        Add the file names and the mismatch you actually see.
      </p>
      <ol>
        <li>
          <p>
            Commit or stash work you want to keep, then branch from your
            latest <code>main</code>:
          </p>
          <CodeBlock language="shell">{`git status
git checkout -b feature/ai-buttons`}</CodeBlock>
        </li>
        <li>
          <p>
            Save <code>docs/ai-course-builder.md</code> from{" "}
            <SectionLink to="1.11.4" />{" "}and the course editor starter from{" "}
            <SectionLink to="1.11.5" />. Leave the Modules files for the
            assistant.
          </p>
        </li>
        <li>
          <p>
            Prompt Claude with the requirements. In the CLI or the IDE, let
            it edit. In chat, apply only the parts you checked.
          </p>
          <WithAI
            prompt={`Read docs/ai-course-builder.md. Add the static controls from the acceptance criteria. The course editor file already exists; add the two generate buttons and keep the Title and Description fields. Edit app/(kambaz)/courses/[cid]/modules/page.tsx and Module.tsx. Keep every module, lesson, and content item, including Week 1. Put AI: suggest modules immediately after the + Module button. Put AI: next module after the module list. Inside each module, put a Lesson type select (Reading, Slides, Quiz only) and Generate lessons above the lessons, and AI: next lesson after the lessons. Use a class, not a repeated id, on those per-module controls. Buttons are type button, with no onClick and no fetch. Do not add a use client line, Tailwind, Bootstrap, useState, a JSON file, an API route, or a Video option. Do not edit Course Navigation. Show the diff and stop.`}
          >
            Attach the requirements file and the two module files. Do not
            attach the rest of the repository.
          </WithAI>
        </li>
        <li>
          <p>
            Review the diff the way you would review a teammate&apos;s pull
            request. Run <code>npm run dev</code> and check both screens
            against the acceptance criteria:
          </p>
          <ul>
            <li>
              <code>/courses/1234/editor</code> shows the title, the
              description, and both generate buttons. Clicking them leaves
              the text in place.
            </li>
            <li>
              <code>/courses/1234/modules</code> still shows your weeks.{" "}
              <code>AI: suggest modules</code> sits beside{" "}
              <code>+ Module</code>. <code>AI: next module</code> sits after
              the list.
            </li>
            <li>
              Each module has the lesson-type select,{" "}
              <code>Generate lessons</code>, the lessons you already had,
              and <code>AI: next lesson</code>. The select lists Reading,
              Slides, and Quiz.
            </li>
            <li>
              The browser console stays quiet, and the page does not
              navigate when you click a new button.
            </li>
          </ul>
          <WithAI
            prompt={`Compare the current diff to docs/ai-course-builder.md. List mismatches as a checklist. Do not edit files.`}
          >
            Fix the mismatches yourself, or send a short follow-up that
            quotes the checklist and says to leave every other file alone.
          </WithAI>
        </li>
        <li>
          <p>
            Ask for a commit message, then stage and commit the files you
            reviewed. Quote paths that contain parentheses.
          </p>
          <WithAI
            prompt={`Write a one-line git commit message for the staged diff on feature/ai-buttons. Imperative mood, 72 characters or fewer. Describe the static buttons. Do not run git commit.`}
          >
            Use the cheaper model. Reject a message that claims an API or
            a model call.
          </WithAI>
          <CodeBlock language="shell">{`git add docs/ai-course-builder.md "app/(kambaz)/courses/[cid]/editor" "app/(kambaz)/courses/[cid]/modules"
git commit -m "Add static AI Course Builder buttons"
git push -u origin feature/ai-buttons`}</CodeBlock>
        </li>
        <li>
          <p>
            On GitHub, open a pull request from{" "}
            <code>feature/ai-buttons</code> into <code>main</code>. Paste a
            description you reviewed. Create the pull request and leave it
            open.
          </p>
          <WithAI
            prompt={`Draft a GitHub pull request description for feature/ai-buttons. Use two headings: Summary and Test plan. State that the controls are static HTML, that this work is optional and not graded, and that the buttons do not call a model. Do not claim checks you did not run.`}
          >
            Read the Files changed tab before you submit. You are the
            author of the pull request.
          </WithAI>
        </li>
        <li>
          <p>
            Ask the assistant to review, then decide which comments are
            valid. A valid comment matches the requirements or fixes a real
            bug, such as a deleted week or a repeated id. A comment that
            asks for an API, styling, state, a mock service, or a Video
            lesson is out of scope. Apply only the valid ones, in a new
            commit on the same branch.
          </p>
          <WithAI
            prompt={`Review comments are below. For each one, answer valid or skip. Valid means it matches docs/ai-course-builder.md or fixes a real bug. Skip means it asks for an API, styling, state, a mock service, or a Video lesson. Do not edit files.

1. Add an onClick that fetches /api/ai.
2. The select offers Video.
3. Week 1 lessons were removed.
4. Suggest modules sits next to + Module.`}
          >
            Dry run: (1) skip, it asks for an API; (2) valid, remove
            Video; (3) valid, restore Week 1; (4) no edit, that control is
            already where the requirements put it. Then paste the comments
            from your own pull request and judge those the same way.
          </WithAI>
        </li>
      </ol>
      <p>
        <strong>What the assistant got wrong.</strong> On this kind of
        task it often adds a click handler, a Tailwind or Bootstrap class,
        a Video option, a new route, or a rewrite of Week 1. Your job is
        to notice that and refuse it.
      </p>
      <OnYourOwn>
        In your cost log, write three sentences: what you asked, what you
        rejected or fixed, and what you will put in the next prompt so
        that mistake does not repeat. Add a row for each prompt you sent.
      </OnYourOwn>
      <WithAI
        prompt={`From the diff on feature/ai-buttons, list three mistakes you introduced that I had to reject or fix. One sentence each. If the diff matches the requirements, name three changes that would have been out of scope. Do not edit files.`}
      >
        Compare its list with yours. Keep your sentences. They are the
        review.
      </WithAI>
    </Section>
  );
}
