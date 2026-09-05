import type { LectureSlide } from "../types";

export const WEB_FORMS_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "Web Forms",
    kind: "title",
    bullets: [
      "Lecture 2 · Deck 4 — collecting data, not just displaying it",
      "Lab 1 folder: app/labs/lab1/forms/",
    ],
  },
  {
    id: "why-forms",
    title: "Forms let the user enter data",
    kind: "content",
    bullets: [
      "Headings, paragraphs, lists, and tables are **display**. A `form` is **input**",
      "Username, password, biography, class standing — later you will validate, store, and send that data",
      "A `<form>` wraps controls so they submit as one unit: `input`, `textarea`, `select`, `button`",
      "Lab 1 wrapper id: `wd-forms`. The sample form id: `wd-text-fields`",
    ],
  },
  {
    id: "forms-folder",
    title: "Put form work in its own folder",
    kind: "content",
    bullets: [
      "Forms is a cluster of components. Dumping them next to `page.tsx` buries the rest of Lab 1",
      "Use `app/labs/lab1/forms/` — organization only",
      "**Do not** add a `page.tsx` inside that folder or Next.js creates `/labs/lab1/forms`",
      "`Forms.tsx` assembles the pieces. Lab 1 imports `./forms/Forms`",
    ],
    code: `import Forms from "./forms/Forms";

export default function Lab1() {
  return (
    <div id="wd-lab1">
      <h2>Lab 1</h2>
      <Forms />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/page.tsx",
  },
  {
    id: "uncontrolled",
    title: "Lab 1 uses uncontrolled fields",
    kind: "content",
    bullets: [
      "**Uncontrolled**: the browser owns what the user types. React sets an initial value and steps back",
      "**Controlled**: React state holds the text; every keystroke goes through `onChange`",
      "For these HTML labs, stay uncontrolled with **`defaultValue`** (and `defaultChecked`)",
      "If you set `value` without state, the field looks frozen — React keeps forcing the same text back",
    ],
  },
  {
    id: "labels",
    title: "Every control needs a label",
    kind: "content",
    bullets: [
      "`<label htmlFor=\"the-id\">` points at the control’s `id` (JSX: `htmlFor`, HTML: `for`)",
      "Clicking the label focuses the field. Screen readers announce the name",
      "Radios and checkboxes can wrap the input or sit as a sibling — Lab 1 uses the sibling + `htmlFor` style",
      "Placeholder text is a hint, not a label. Do not skip `label`",
    ],
  },
  {
    id: "text-fields",
    title: "Text and password inputs",
    kind: "demo",
    bullets: [
      "`<input>` collects short strings. Default `type` is `text`",
      "`type=\"password\"` masks characters",
      "Useful attributes: `id`, `placeholder`, `defaultValue`, `title`",
      "Lab 1 ids: `wd-text-fields-username`, `-password`, `-first-name`, `-last-name`",
    ],
    code: `<label htmlFor="wd-text-fields-username">Username:</label>
<input placeholder="jdoe" id="wd-text-fields-username" />
<label htmlFor="wd-text-fields-password">Password:</label>
<input
  type="password"
  defaultValue="123@#$asd"
  id="wd-text-fields-password"
/>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/TextFields.tsx",
    embed: "text-fields",
  },
  {
    id: "textarea",
    title: "textarea is for longer text",
    kind: "content",
    bullets: [
      "`<textarea>` is a block with an opening and closing tag. The body is the initial text",
      "In React, prefer `defaultValue` on the tag instead of children between the tags",
      "Use it for bios, comments, and anything that needs more than one line",
    ],
    code: `<label htmlFor="wd-textarea">Bio:</label>
<textarea id="wd-textarea" defaultValue="I am a student." />`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/Textarea.tsx",
  },
  {
    id: "radio-checkbox",
    title: "Radio is exclusive; checkbox is not",
    kind: "content",
    bullets: [
      "`type=\"radio\"` — one choice in a **name** group. Same `name` means they compete",
      "`type=\"checkbox\"` — each box is independent. Check none, some, or all",
      "`defaultChecked` marks the initial selection (uncontrolled)",
      "Lab 1 keeps both radio groups in `RadioButtons.tsx` and checkboxes in `Checkboxes.tsx`",
    ],
    code: `<input type="radio" name="standing" id="wd-radio-frosh" defaultChecked />
<label htmlFor="wd-radio-frosh">Freshman</label>
<input type="checkbox" id="wd-check-css" defaultChecked />
<label htmlFor="wd-check-css">CSS</label>`,
    codeLanguage: "tsx",
  },
  {
    id: "select",
    title: "select and option",
    kind: "content",
    bullets: [
      "`<select>` shows a dropdown. Each `<option value=\"…\">` is a choice",
      "`defaultValue` on `select` picks the initial option (match an option’s `value`)",
      "`multiple` plus `defaultValue={[…]}` for a multi-select — hold Cmd/Ctrl to pick more than one",
      "Lab 1: a single select and a multiple select with four or more options",
    ],
    code: `<select id="wd-select-one" defaultValue="CSCI">
  <option value="CSCI">Computer Science</option>
  <option value="INFO">Information Science</option>
</select>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/Dropdowns.tsx",
  },
  {
    id: "typed-inputs",
    title: "Typed inputs: email, number, date, range",
    kind: "content",
    bullets: [
      "`type=\"email\"` — the browser can hint a keyboard and do basic format checks",
      "`type=\"number\"` — `min`, `max`, `step` (graduation year is a good Lab 1 example)",
      "`type=\"date\"` — a date picker where the browser supports it",
      "`type=\"range\"` — a slider. Pair it with a label so the value’s meaning is clear",
    ],
  },
  {
    id: "buttons",
    title: "Save submits; Cancel should not",
    kind: "content",
    bullets: [
      "A `<button>` inside a form defaults to `type=\"submit\"` — it sends the form",
      "Lab 1: give Save its own id and let it submit. Cancel is `type=\"button\"` so it does not submit",
      "On the sample form, `onSubmit` calls `event.preventDefault()` so Lab 1 does not reload",
      "You will wire real submit later. For now, prevent the full-page flash",
    ],
    code: `<form
  id="wd-text-fields"
  onSubmit={(event) => {
    event.preventDefault();
  }}
>
  <button id="wd-save">Save</button>
  <button type="button" id="wd-cancel">Cancel</button>
</form>`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab1/forms/Forms.tsx",
  },
  {
    id: "next-up",
    title: "Next: anchors",
    kind: "title",
    bullets: [
      "You can collect data without freezing fields or reloading the page",
      "Deck 5: the `a` tag — absolute, relative, and in-page links",
    ],
  },
];
