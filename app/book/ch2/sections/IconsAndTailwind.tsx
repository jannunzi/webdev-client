// Tailwind utility classes (bg-red-500, grid-cols-4, md:flex, blur-lg, …) are
// already available book-wide via app/book/book.css, which imports only the
// `theme` + `utilities` layers (no `preflight`) so it never resets default
// HTML rendering the way the full `tailwindcss` import in
// app/labs/lab2/tailwind/index.css does — importing that here would leak
// Tailwind's CSS reset into this chapter's own prose.
import Section from "../../components/Section";
import SectionLink from "../../components/SectionLink";
import ChapterLink from "../../components/ChapterLink";
import LocalUrl from "../../components/LocalUrl";
import CodeBlock from "../../components/CodeBlock";
import LiveDemo from "../../components/LiveDemo";
import ReactIconsSampler from "@/app/labs/lab2/intermediates/2-2-ReactIconsSampler";
import TailwindSpacing from "@/app/labs/lab2/tailwind/TailwindSpacing";
import TailwindTypography from "@/app/labs/lab2/tailwind/TailwindTypography";
import TailwindBackgroundColors from "@/app/labs/lab2/tailwind/TailwindBackgroundColors";
import TailwindResponsiveDesign from "@/app/labs/lab2/tailwind/TailwindResponsiveDesign";
import TailwindFilters from "@/app/labs/lab2/tailwind/TailwindFilters";
import TailwindGrids from "@/app/labs/lab2/tailwind/TailwindGrids";

export default function IconsAndTailwind() {
  return (
    <>
      <Section id="sec-2-2" title="2.2 Decorating Documents with React Icons">
        <p>
          <strong>React Icons</strong>{" "}bundles thousands of icons from
          several popular icon families — Font Awesome, Heroicons, and more —
          and exposes each one as a plain React
          component. Install it from the project root:
        </p>
        <CodeBlock language="shell">{`npm install react-icons`}</CodeBlock>
        <p>
          Browse{" "}
          <a
            href="https://react-icons.github.io/react-icons"
            target="_blank"
            rel="noreferrer"
          >
            react-icons.github.io/react-icons
          </a>{" "}
          and search by keyword or icon family. Each result page shows the
          import path and component name to copy. Try a handful from
          different families in one component:
        </p>
        <CodeBlock
          language="tsx"
          name="ReactIconsSampler"
          file="app/labs/lab2/ReactIconsSampler.tsx"
        >{`import { FaCalendar, FaEnvelopeOpenText, FaRegClock } from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaBookBible } from "react-icons/fa6";
import { VscAccount } from "react-icons/vsc";

export default function ReactIconsSampler() {
  return (
    <div id="wd-react-icons-sampler" className="mb-4 font-sans">
      <h3 className="text-lg font-semibold">React Icons Sampler</h3>
      <div className="flex gap-3 text-3xl">
        <VscAccount />
        <AiOutlineDashboard />
        <FaBookBible />
        <FaCalendar />
        <FaEnvelopeOpenText />
        <FaRegClock />
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          Six icons render inline, each imported from a different icon
          family through a different package path — <code>fa</code>,{" "}
          <code>ai</code>, <code>fa6</code>, and <code>vsc</code>{" "}each group
          icons by their source library. The parent uses{" "}
          <code>text-3xl</code>{" "}so each icon (sized in <code>em</code>)
          scales up; that utility comes from Tailwind, introduced properly
          in <SectionLink to="2.3" />. Icon components also accept ordinary{" "}
          <code>className</code>, <code>style</code>, and{" "}
          <code>size</code>{" "}props like any other element:
        </p>
        <LiveDemo mode="styled" name="ReactIconsSampler" file="app/labs/lab2/ReactIconsSampler.tsx">
          <ReactIconsSampler />
        </LiveDemo>
        <p>
          Import <code>ReactIconsSampler</code>{" "}into <code>Lab2</code>{" "}to
          keep it on the growing exercise page, then keep an eye out for
          icons that fit Kambaz screens later in <SectionLink to="2.4" /> — a dashboard icon for
          the Dashboard link, a calendar icon for Calendar, and so on.
        </p>
      
        <p>
          <strong>On your own.</strong>{" "}In <code>ReactIconsSampler.tsx</code>,
          import two more icons from families you have not used yet, give them a{" "}
          <code>className</code>{" "}for size or color, and keep them on the Lab 2
          page.
        </p>
      </Section>

      <Section
        id="sec-2-3"
        title="2.3 Styling Webpages with the Tailwind CSS Library"
      >
        <p>
          <strong>Tailwind CSS</strong>{" "}is a utility-first framework: instead
          of writing custom CSS rules, you compose a look directly in{" "}
          <code>className</code>{" "}out of small, single-purpose utility
          classes like <code>p-4</code>{" "}(padding) or{" "}
          <code>bg-red-500</code>{" "}(background color). <code>create-next-app</code>{" "}
          already installed and configured Tailwind when you scaffolded{" "}
          <code>kambaz-next-js</code>{" "}in <ChapterLink to={1} /> — you simply commented out
          its import in <code>app/layout.tsx</code>{" "}so the HTML exercises
          could render with plain browser defaults.
        </p>
        <p>
          Rather than re-enabling Tailwind globally, scope it to a new{" "}
          <code>tailwind</code>{" "}sub-lab so only pages that opt in load it.
          Create a small CSS file that imports the library:
        </p>
        <CodeBlock
          language="css"
          name="Tailwind entry"
          file="app/labs/lab2/tailwind/index.css"
        >{`@import "tailwindcss";`}</CodeBlock>
        <p>
          Then create the page that imports that CSS file — and, because it
          is its own route under <code>app/labs/lab2/tailwind/</code>, its own
          separate URL from the rest of Lab 2:
        </p>
        <CodeBlock
          language="tsx"
          name="TailwindLab"
          file="app/labs/lab2/tailwind/page.tsx"
        >{`import "./index.css";

export default function TailwindLab() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Tailwind CSS</h1>
    </div>
  );
}`}</CodeBlock>
        <p>
          Link to <LocalUrl href="/labs/lab2/tailwind">/labs/lab2/tailwind</LocalUrl>{" "}from the main Lab 2 page so
          both are reachable from the Labs table of contents, then work
          through the utility categories below one component at a time.
        </p>

        <h3
          id="sec-2-3-1"
          className="scroll-mt-6 font-sans text-xl font-semibold"
        >
          2.3.1 Spacing
        </h3>
        <p>
          Tailwind&apos;s spacing utilities follow a compact naming
          convention: classes starting with <code>m</code>{" "}set margin,
          classes starting with <code>p</code>{" "}set padding, and a number
          suffix (<code>-4</code>, <code>-8</code>, …) sets the amount on a
          consistent scale. Direction letters narrow which side: nothing for
          all sides, <code>s</code>/<code>e</code>{" "}for the logical start/end
          (left/right in English), <code>t</code>/<code>b</code>{" "}for
          top/bottom:
        </p>
        <CodeBlock
          language="tsx"
          name="TailwindSpacing"
          file="app/labs/lab2/tailwind/TailwindSpacing.tsx"
        >{`export default function TailwindSpacing() {
  return (
    <div>
      <h2 className="text-3xl">Margin</h2>
      <div className="bg-blue-200 mb-4 p-4">
        This div has a bottom margin of 4.
      </div>
      <div className="bg-blue-200 ms-4 me-8 p-4">
        This div has a start margin of 4 and an end margin of 8.
      </div>
      <h2 className="text-3xl mt-8">Padding</h2>
      <div className="bg-green-200 ps-2 pt-4 pb-8 mb-4">
        This div has starting padding of 2, top padding of 4, and bottom padding of 8.
      </div>
      <div className="bg-green-200 p-6">This div has padding all around of 6.</div>
    </div>
  );
}`}</CodeBlock>
        <p>
          Each box&apos;s spacing changes with nothing but its class list —
          no separate stylesheet, no selector to name:
        </p>
        <LiveDemo mode="styled" name="TailwindSpacing" file="app/labs/lab2/tailwind/TailwindSpacing.tsx">
          <TailwindSpacing />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}In <code>TailwindSpacing.tsx</code>, add
          one more box that mixes directional spacing utilities (for example{" "}
          <code>mt-*</code>, <code>ps-*</code>, <code>pb-*</code>) so margin and
          padding differences are obvious.
        </p>

        <h3
          id="sec-2-3-2"
          className="scroll-mt-6 font-sans text-xl font-semibold"
        >
          2.3.2 Typography
        </h3>
        <p>
          Typography utilities cover font size (<code>text-sm</code>{" "}through{" "}
          <code>text-3xl</code>) and weight (<code>font-thin</code>{" "}through{" "}
          <code>font-black</code>) with the same predictable naming:
        </p>
        <CodeBlock
          language="tsx"
          name="TailwindTypography"
          file="app/labs/lab2/tailwind/TailwindTypography.tsx"
        >{`export default function TailwindTypography() {
  return (
    <div>
      <h2 className="text-3xl">Font Size</h2>
      <p className="text-sm">This is small text.</p>
      <p className="text-3xl">This is 3x extra large text.</p>
      <h2 className="text-3xl font-bold mt-4">Font Weight</h2>
      <p className="font-thin">This is thin font weight.</p>
      <p className="font-black">This is black font weight.</p>
    </div>
  );
}`}</CodeBlock>
        <p>
          Font sizes step up visibly from <code>text-sm</code>{" "}to{" "}
          <code>text-3xl</code>, and weights step up from a barely-there{" "}
          <code>font-thin</code>{" "}to a heavy <code>font-black</code> — build
          the full component with every step listed in the code above to see
          the whole scale:
        </p>
        <LiveDemo mode="styled" name="TailwindTypography" file="app/labs/lab2/tailwind/TailwindTypography.tsx">
          <TailwindTypography />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}In <code>TailwindTypography.tsx</code>,
          add a short personal line that pairs a size utility with a weight utility
          you have not used yet (for example <code>text-xl</code>{" "}plus{" "}
          <code>font-semibold</code>).
        </p>

        <h3
          id="sec-2-3-3"
          className="scroll-mt-6 font-sans text-xl font-semibold"
        >
          2.3.3 Background Colors
        </h3>
        <p>
          Background color utilities follow the pattern{" "}
          <code>bg-{"{color}"}-{"{shade}"}</code>, where the shade is a number
          from 50 (lightest) to 950 (darkest) in steps of 100. Pair a
          background with a contrasting text color so the content stays
          readable:
        </p>
        <CodeBlock
          language="tsx"
          name="TailwindBackgroundColors"
          file="app/labs/lab2/tailwind/TailwindBackgroundColors.tsx"
        >{`export default function TailwindBackgroundColors() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Background Colors</h2>
      <div className="bg-red-500 text-white p-4 mb-4">This div has a red background.</div>
      <div className="bg-green-500 text-white p-4 mb-4">This div has a green background.</div>
      <div className="bg-blue-500 text-white p-4 mb-4">This div has a blue background.</div>
      <div className="bg-yellow-500 text-black p-4 mb-4">This div has a yellow background.</div>
    </div>
  );
}`}</CodeBlock>
        <p>
          Four bands of color render top to bottom — the same{" "}
          <code>-500</code>{" "}shade across red, green, and blue, but
          <code>yellow-500</code>{" "}is light enough that it needs black text
          instead of white to stay legible:
        </p>
        <LiveDemo mode="styled" name="TailwindBackgroundColors" file="app/labs/lab2/tailwind/TailwindBackgroundColors.tsx">
          <TailwindBackgroundColors />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}In{" "}
          <code>TailwindBackgroundColors.tsx</code>, add another band that uses a
          different color and shade (not just <code>-500</code>) and pick a
          contrasting <code>text-*</code>{" "}class so the text stays legible.
        </p>

        <h3
          id="sec-2-3-4"
          className="scroll-mt-6 font-sans text-xl font-semibold"
        >
          2.3.4 Responsive Design
        </h3>
        <p>
          Tailwind is <strong>mobile-first</strong>: an unprefixed class
          applies at every width, while a class prefixed with a breakpoint
          like <code>md:</code>{" "}only takes effect once the viewport reaches
          that breakpoint and up. Save an image of the React logo to{" "}
          <code>public/images/reactjs.jpg</code>{" "}(already available from
          <ChapterLink to={1} />&apos;s Kambaz Dashboard exercise) and build a card that
          stacks vertically on narrow screens but switches to a side-by-side
          layout at the <code>md</code>{" "}breakpoint:
        </p>
        <CodeBlock
          language="tsx"
          name="TailwindResponsiveDesign"
          file="app/labs/lab2/tailwind/TailwindResponsiveDesign.tsx"
        >{`export default function TailwindResponsiveDesign() {
  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">
      <div className="md:flex">
        <div className="md:shrink-0">
          <img
            className="h-48 w-full object-cover md:h-full md:w-48"
            src="/images/reactjs.jpg"
            alt="ReactJS logo"
          />
        </div>
        <div className="p-8">
          <div className="text-sm font-semibold tracking-wide text-indigo-500 uppercase">
            Professional Courses
          </div>
          <a href="#" className="mt-1 block text-lg leading-tight font-medium text-black hover:underline">
            Rocket Propulsion Fundamentals
          </a>
          <p className="mt-2 text-gray-500">
            An in-depth study of the fundamentals of rocket propulsion...
          </p>
        </div>
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          Drag this figure&apos;s panel narrower and wider — below the{" "}
          <code>md</code>{" "}breakpoint the image sits above the text in a
          single column; at <code>md</code>{" "}and above the{" "}
          <code>md:flex</code>{" "}class kicks in and the image moves beside the
          text:
        </p>
        <LiveDemo mode="styled" name="TailwindResponsiveDesign" file="app/labs/lab2/tailwind/TailwindResponsiveDesign.tsx">
          <TailwindResponsiveDesign />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}In{" "}
          <code>TailwindResponsiveDesign.tsx</code>, change the copy or image to
          something personal, then add one more{" "}
          <code>md:</code>{" "}(or <code>lg:</code>) utility so a property clearly
          differs between narrow and wide viewports.
        </p>

        <h3
          id="sec-2-3-5"
          className="scroll-mt-6 font-sans text-xl font-semibold"
        >
          2.3.5 Filters
        </h3>
        <p>
          Filter utilities apply visual effects — blur, brightness, contrast,
          grayscale, and more — straight onto an image or element. The
          original exercise blurs a photo of Angel Falls at four increasing
          strengths; if you do not have that image handy, any photo under{" "}
          <code>public/images</code>{" "}works just as well to see the effect —
          the sample below reuses{" "}
          <code>reactjs.jpg</code>:
        </p>
        <CodeBlock
          language="tsx"
          name="TailwindFilters"
          file="app/labs/lab2/tailwind/TailwindFilters.tsx"
        >{`export default function TailwindFilters() {
  const src = "/images/reactjs.jpg";
  return (
    <div>
      <h3>Blurs</h3>
      <div className="flex">
        <img className="blur-none w-1/4" src={src} alt="blur none" />
        <img className="blur-sm w-1/4" src={src} alt="blur sm" />
        <img className="blur-lg w-1/4" src={src} alt="blur lg" />
        <img className="blur-2xl w-1/4" src={src} alt="blur 2xl" />
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          Four copies of the same image sit side by side, the blur growing
          from imperceptible to nearly unrecognizable — each variation is
          nothing more than one utility class swapped for another:
        </p>
        <LiveDemo mode="styled" name="TailwindFilters" file="app/labs/lab2/tailwind/TailwindFilters.tsx">
          <TailwindFilters />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}In <code>TailwindFilters.tsx</code>, add a
          second row that demos a different filter family — for example{" "}
          <code>grayscale</code>, <code>brightness-*</code>, or{" "}
          <code>contrast-*</code> — on the same image.
        </p>

        <h3
          id="sec-2-3-6"
          className="scroll-mt-6 font-sans text-xl font-semibold"
        >
          2.3.6 CSS Grid Layout
        </h3>
        <p>
          Tailwind also wraps CSS Grid in utility classes:{" "}
          <code>grid grid-cols-4 gap-4</code>{" "}turns a container into a
          four-column grid with consistent gutters, and children automatically
          wrap onto new rows once a row fills up:
        </p>
        <CodeBlock
          language="tsx"
          name="TailwindGrids"
          file="app/labs/lab2/tailwind/TailwindGrids.tsx"
        >{`export default function TailwindGrids() {
  return (
    <div>
      <h3 className="mt-6 text-3xl font-bold">4 Columns Grid</h3>
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="text-center bg-blue-300 p-3">
            {String(i + 1).padStart(2, "0")}
          </div>
        ))}
      </div>
    </div>
  );
}`}</CodeBlock>
        <p>
          Nine numbered cells flow across four columns and wrap onto a third
          row for the last one — no manual row-breaking required:
        </p>
        <p>
          A single class can also span multiple grid columns with{" "}
          <code>col-span-{"{n}"}</code>. Append a &quot;Grid system&quot;
          demo to the same file that mixes an even two-column split with a
          twelve-column split for a one-third/two-thirds layout and a
          sidebar/content/sidebar layout — the same page layouts <SectionLink to="2.1.18" />{" "}built with float, this time with Grid:
        </p>
        <CodeBlock
          language="tsx"
          name="TailwindGrids"
          file="app/labs/lab2/tailwind/TailwindGrids.tsx"
        >{`<div id="wd-tailwind-grid-system" className="mt-6">
  <h2>Grid system</h2>
  <div className="grid grid-cols-2 gap-2">
    <div className="bg-red-500 text-white"><h3>Left half</h3></div>
    <div className="bg-blue-500 text-white"><h3>Right half</h3></div>
  </div>
  <div className="grid grid-cols-12 gap-2 mt-2">
    <div className="col-span-4 bg-yellow-500"><h3>One third</h3></div>
    <div className="col-span-8 bg-green-500 text-white"><h3>Two thirds</h3></div>
  </div>
  <div className="grid grid-cols-12 gap-2 mt-2">
    <div className="col-span-2 bg-black text-white"><h3>Sidebar</h3></div>
    <div className="col-span-8 bg-gray-500 text-white"><h3>Main content</h3></div>
    <div className="col-span-2 bg-blue-400"><h3>Sidebar</h3></div>
  </div>
</div>`}</CodeBlock>
        <p>
          A twelve-column grid is the sweet spot for page layout because
          twelve divides evenly by two, three, four, and six — which is why{" "}
          <code>col-span-4</code>{" "}(one third) and{" "}
          <code>col-span-8</code>{" "}(two thirds) add up cleanly to twelve, and
          why the sidebar/content/sidebar row below it uses 2/8/2:
        </p>
        <LiveDemo mode="styled" name="TailwindGrids" file="app/labs/lab2/tailwind/TailwindGrids.tsx">
          <TailwindGrids />
        </LiveDemo>
        <p>
          <strong>On your own.</strong>{" "}In <code>TailwindGrids.tsx</code>, add one
          more grid row that uses <code>col-span-*</code>{" "}in a layout you have not
          shown yet (for example three equal columns or a 3/9 split on a
          twelve-column grid).
        </p>

      </Section>
    </>
  );
}
