import type { LectureSlide } from "../types";

export const WEB_FORMS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 1 · Web Forms",
      "Lab 1 folder: app/labs/lab1/forms/ — no page.tsx in that folder",
    ],
  },
  {
    id: "why-forms",
    title: "Forms collect data",
    kind: "content",
    bullets: [
      "Headings, lists, and tables **display**. A `form` is **input**",
      "A `<form>` wraps controls so they submit as one unit",
      "Lab 1 wrapper id: `wd-forms`. Sample form id: `wd-text-fields`",
      "Do **not** let the sample form reload the page — `onSubmit` + `preventDefault()`",
    ],
  },
  {
    id: "labels",
    title: "label + htmlFor",
    kind: "content",
    bullets: [
      "`<label htmlFor=\"the-id\">` points at the control’s `id` (JSX: `htmlFor`, HTML: `for`)",
      "Clicking the label focuses the field. Screen readers announce the name",
      "Placeholder text is a hint, not a label. Do not skip `label`",
      "Lab 1 uses the sibling-label style: label and input next to each other",
    ],
    code: `<label htmlFor="wd-text-fields-username">Username:</label>
<input id="wd-text-fields-username" />`,
    codeLanguage: "tsx",
  },
  {
    id: "text",
    title: "Text fields",
    kind: "content",
    bullets: [
      "`<input>` default `type` is `text` — short strings: username, first name",
      "Use `defaultValue` (uncontrolled). Do not set `value` without React state",
      "Useful attributes: `id`, `placeholder`, `defaultValue`, `title`",
    ],
  },
  {
    id: "password",
    title: "Password fields",
    kind: "content",
    bullets: [
      "`type=\"password\"` masks characters",
      "Still an `input`. Same labeling rules",
      "Lab 1 id: `wd-text-fields-password`",
    ],
    code: `<label htmlFor="wd-text-fields-password">Password:</label>
<input
  type="password"
  defaultValue="123@#$asd"
  id="wd-text-fields-password"
/>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/TextFields.tsx",
  },
  {
    id: "text-fields-demo",
    title: "Text + password live",
    kind: "demo",
    bullets: [
      "Type in the fields. The browser owns the text — that is uncontrolled",
      "Lab 1 ids: `wd-text-fields-username`, `-password`, `-first-name`, `-last-name`",
    ],
    embed: "text-fields",
  },
  {
    id: "textarea",
    title: "textarea",
    kind: "demo",
    embed: "textarea",
    bullets: [
      "`<textarea>` is for longer text: bios, comments",
      "It has an opening and closing tag. Prefer `defaultValue` in React",
      "Lab 1 id: `wd-textarea`",
    ],
    code: `<label htmlFor="wd-textarea">Biography:</label>
<textarea id="wd-textarea" cols={30} rows={4} defaultValue="I am a student." />`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/Textarea.tsx",
  },
  {
    id: "buttons",
    title: "Buttons: button vs submit",
    kind: "demo",
    embed: "buttons",
    bullets: [
      "A `<button>` inside a form defaults to `type=\"submit\"` — it sends the form",
      "Save can be the default submit. Cancel is `type=\"button\"` so it does not submit",
      "Lab 1 ids: `wd-html-button-save`, `wd-html-button-cancel`",
    ],
    code: `<button id="wd-html-button-save" type="submit">Save</button>
<button id="wd-html-button-cancel" type="button">Cancel</button>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/Buttons.tsx",
  },
  {
    id: "onclick-alert",
    title: "onClick can alert — don't submit",
    kind: "demo",
    bullets: [
      "`type=\"button\"` plus `onClick` runs JavaScript without sending the form",
      "Classroom demo: `alert(\"Hello\")` — later you will set React state instead",
      "The live button below uses `type=\"button\"`. It does not reload this slide",
    ],
    embed: "alert-button",
    code: `<button
  type="button"
  id="wd-alert-demo"
  onClick={() => alert("Hello from a button")}
>
  Say hello
</button>`,
    codeLanguage: "tsx",
  },
  {
    id: "file",
    title: "File input",
    kind: "demo",
    bullets: [
      "`type=\"file\"` lets the user pick a file. The browser draws the control",
      "Still pair it with a `label` and an `id`",
      "Do not submit the form. This week we only render the control",
    ],
    code: `<label htmlFor="wd-file">Upload:</label>
<input type="file" id="wd-file" />`,
    codeLanguage: "tsx",
    embed: "file-field",
  },
  {
    id: "radio-vs-checkbox",
    title: "Radio vs checkbox",
    kind: "content",
    bullets: [
      "**Radio** — one choice in a group. Checking one unchecks the others",
      "**Checkbox** — each box is independent. Check none, some, or all",
      "`defaultChecked` marks the initial selection (uncontrolled)",
    ],
  },
  {
    id: "radio-same-name",
    title: "Radios share a name",
    kind: "demo",
    bullets: [
      "Same `name` means they compete. Different `name`s are different groups",
      "Lab 1: `name=\"radio-genre\"` and `name=\"radio-frequency\"` in `RadioButtons.tsx`",
      "Each radio still needs its own `id` and a `label htmlFor`",
    ],
    code: `<input type="radio" name="radio-genre" id="wd-radio-comedy" />
<label htmlFor="wd-radio-comedy">Comedy</label>
<input type="radio" name="radio-genre" id="wd-radio-drama" />
<label htmlFor="wd-radio-drama">Drama</label>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/RadioButtons.tsx",
    embed: "radio-buttons",
  },
  {
    id: "checkboxes-multi",
    title: "Checkboxes are multi-select",
    kind: "demo",
    embed: "checkboxes",
    bullets: [
      "Each checkbox can stay on while others are on",
      "They may share a `name` for grouping, but they do not exclude each other",
      "Lab 1 ids: `wd-chkbox-comedy`, `-drama`, `-scifi`, `-fantasy`",
    ],
    code: `<input type="checkbox" name="check-genre" id="wd-chkbox-comedy" />
<label htmlFor="wd-chkbox-comedy">Comedy</label>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/Checkboxes.tsx",
  },
  {
    id: "select-one",
    title: "select one",
    kind: "demo",
    embed: "dropdowns",
    bullets: [
      "`<select>` plus `<option value=\"…\">`",
      "`defaultValue` on `select` picks the initial option (match an option’s `value`)",
      "Lab 1 id: `wd-select-one-genre`",
    ],
    code: `<select id="wd-select-one-genre" defaultValue="SCIFI">
  <option value="COMEDY">Comedy</option>
  <option value="SCIFI">Science Fiction</option>
</select>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/Dropdowns.tsx",
  },
  {
    id: "select-many",
    title: "select many",
    kind: "demo",
    embed: "dropdowns",
    bullets: [
      "`multiple` plus `defaultValue={[\"COMEDY\", \"SCIFI\"]}`",
      "Hold Cmd (macOS) or Ctrl (Windows) to pick more than one",
      "Lab 1 id: `wd-select-many-genre`",
    ],
  },
  {
    id: "number",
    title: "type=number",
    kind: "demo",
    embed: "typed-fields",
    bullets: [
      "Numeric keyboard / stepper where the browser supports it",
      "`min`, `max`, `step` constrain the value",
      "Lab 1: starting salary `wd-text-fields-salary-start`",
    ],
    code: `<input type="number" defaultValue="100000" min={0} id="wd-text-fields-salary-start" />`,
    codeLanguage: "tsx",
  },
  {
    id: "range",
    title: "type=range",
    kind: "demo",
    embed: "typed-fields",
    bullets: [
      "A slider. Pair it with a label so the value’s meaning is clear",
      "Lab 1: rating `wd-text-fields-rating` — `min=\"1\"` `max=\"5\"`",
    ],
  },
  {
    id: "email",
    title: "type=email",
    kind: "demo",
    embed: "typed-fields",
    bullets: [
      "The browser can hint a keyboard and do a basic format check",
      "Still uncontrolled with `placeholder` / `defaultValue`",
      "Lab 1 id: `wd-text-fields-email`",
    ],
  },
  {
    id: "date",
    title: "type=date",
    kind: "demo",
    bullets: [
      "A date picker where the browser supports it",
      "`min` / `max` keep the range sane",
      "Lab 1 id: `wd-text-fields-dob`",
    ],
    code: `<input
  type="date"
  defaultValue="2000-01-21"
  min="1900-01-01"
  max="2025-12-31"
  id="wd-text-fields-dob"
/>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/OtherFieldTypes.tsx",
    embed: "typed-fields",
  },
  {
    id: "uncontrolled-reminder",
    title: "defaultValue, not value",
    kind: "content",
    bullets: [
      "Lab 1 stays **uncontrolled**. The browser owns what the user types",
      "`value` without `onChange` + state freezes the field",
      "Controlled inputs return when you learn `useState`",
    ],
  },
  {
    id: "next-up",
    title: "Next: anchors",
    kind: "title",
    bullets: [
      "You can collect data without reloading the slide",
      "Deck 5: `href`, `mailto:`, `tel:`, and in-page `#hash` TOC",
    ],
  },
];
