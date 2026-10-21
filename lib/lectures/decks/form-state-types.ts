import type { LectureSlide } from "../types";

export const FORM_STATE_TYPES_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 4 · Form State Types",
      "§4.2.5–4.2.9 · boolean through array, same hook",
    ],
  },
  {
    id: "purpose",
    title: "Bind the field to the value",
    kind: "content",
    bullets: [
      "A controlled field has `value` (or `checked`) plus `onChange`",
      "The UI and the data stay in sync because they share one source",
      "Objects and arrays must be copied — never mutate the previous state",
    ],
  },
  {
    id: "boolean",
    title: "Boolean: checked and a ternary",
    kind: "content",
    code: `"use client";

import { useState } from "react";

export default function BooleanStateVariables() {
  const [done, setDone] = useState(true);
  return (
    <div id="wd-boolean-state-variables">
      <h2>Boolean State Variables</h2>
      <p>{done ? "Done" : "Not done"}</p>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={done}
          onChange={() => setDone(!done)}
          id="wd-boolean-checkbox"
        />
        Done
      </label>
      {done && <div className="mt-2 rounded bg-yellow-100 p-2">Yay! Done</div>}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/BooleanStateVariables.tsx",
    codeHighlightLines: [6, 12, 13, 14, 15, 16, 17],
  },
  {
    id: "boolean-live",
    title: "Boolean: live demo",
    kind: "demo",
    bullets: [
      "`useState(true)` seeds Done. The checkbox writes `!done`",
      "`{done ? \"Done\" : \"Not done\"}` and `{done && <div>Yay!</div>}`",
      "Use `checked={done}`, not `value`, on a checkbox",
    ],
    embed: "boolean-state",
  },
  {
    id: "string",
    title: "String: value and onChange",
    kind: "content",
    code: `"use client";

import { useState } from "react";

export default function StringStateVariables() {
  const [firstName, setFirstName] = useState("John");
  return (
    <div id="wd-string-state-variables">
      <h2>String State Variables</h2>
      <p>{firstName}</p>
      <input
        className="w-full max-w-sm rounded border border-neutral-300 px-3 py-1.5"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        id="wd-first-name"
      />
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/StringStateVariables.tsx",
    codeHighlightLines: [6, 11, 13, 14, 15],
  },
  {
    id: "string-live",
    title: "String: live demo",
    kind: "demo",
    bullets: [
      "`value={firstName}` shows the current string",
      "`onChange={(e) => setFirstName(e.target.value)}` writes each keystroke",
      "Without `value`, the field is uncontrolled and React cannot reset it",
    ],
    embed: "string-state",
  },
  {
    id: "date-intro",
    title: "Date: format for type=date",
    kind: "demo",
    bullets: [
      "`useState(new Date(2026, 0, 15, 10, 30))` — year, month, day, hour, minute. Months start at 0",
      "`type=\"date\"` wants `YYYY-MM-DD` — helper `dateObjectToHtmlDateString`",
      "`htmlDateStringToDate` reads the picker as a local date, so the day you pick stays that day",
    ],
  },
  {
    id: "date",
    title: "Date: format for type=date (code)",
    kind: "demo",
    code: `"use client";

import { useState } from "react";

function dateObjectToHtmlDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return \`\${year}-\${month}-\${day}\`;
}

function htmlDateStringToDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0);
}

export default function DateStateVariable() {
  const [startDate, setStartDate] = useState(new Date(2026, 0, 15, 10, 30));
  return (
    <div id="wd-date-state-variables">
      <h2>Date State Variables</h2>
      <h3>{startDate.toDateString()}</h3>
      <h3>{dateObjectToHtmlDateString(startDate)}</h3>
      <input
        type="date"
        className="rounded border border-neutral-300 px-3 py-1.5"
        value={dateObjectToHtmlDateString(startDate)}
        onChange={(e) => setStartDate(htmlDateStringToDate(e.target.value))}
        id="wd-start-date"
      />
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/DateStateVariable.tsx",
    codeHighlightLines: [[5, 15], 18, 28],
  },
  {
    id: "date-live",
    title: "Date: live demo",
    kind: "demo",
    embed: "date-state",
  },
  {
    id: "object-intro",
    title: "Object: spread, then overwrite",
    kind: "demo",
    bullets: [
      "`setPerson({ ...person, name: e.target.value })` copies, then writes one key",
      "Do not do `person.name = …` — that mutates and React may skip the paint",
      "`parseInt` on age; `|| 0` keeps the field a number if the box is empty",
    ],
  },
  {
    id: "object",
    title: "Object: spread, then overwrite (code)",
    kind: "demo",
    code: `"use client";

import { useState } from "react";

export default function ObjectStateVariable() {
  const [person, setPerson] = useState({ name: "Peter", age: 24 });
  return (
    <div id="wd-object-state-variables">
      <h2>Object State Variables</h2>
      <pre>{JSON.stringify(person, null, 2)}</pre>
      <input
        className="mb-2 block w-full max-w-sm rounded border border-neutral-300 px-3 py-1.5"
        value={person.name}
        onChange={(e) => setPerson({ ...person, name: e.target.value })}
        id="wd-person-name"
      />
      <input
        type="number"
        className="block w-full max-w-sm rounded border border-neutral-300 px-3 py-1.5"
        value={person.age}
        onChange={(e) =>
          setPerson({ ...person, age: parseInt(e.target.value) || 0 })
        }
        id="wd-person-age"
      />
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/ObjectStateVariable.tsx",
    codeHighlightLines: [6, 14, 21, 22],
  },
  {
    id: "object-live",
    title: "Object: spread, then overwrite: live demo",
    kind: "demo",
    embed: "object-state",
  },
  {
    id: "array-intro",
    title: "Array: copy, then add or filter",
    kind: "demo",
    bullets: [
      "`setArray([...array, Math.floor(Math.random() * 100)])` appends a copy",
      "`filter((_item, i) => i !== index)` drops one index without mutate",
      "Each `li` needs a `key`. Delete wraps `deleteElement(index)` in an arrow",
    ],
  },
  {
    id: "array",
    title: "Array: copy, add, or filter (1/2)",
    kind: "demo",
    code: `"use client";

import { useState } from "react";

export default function ArrayStateVariable() {
  const [array, setArray] = useState([1, 2, 3, 4, 5]);
  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };
  const deleteElement = (index: number) => {
    setArray(array.filter((_item, i) => i !== index));
  };`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/ArrayStateVariable.tsx",
    codeHighlightLines: [7, 8, 9, 10, 11, 12],
  },
  {
    id: "array-part-2",
    title: "Array: copy, add, or filter (2/2)",
    kind: "content",
    code: `  return (
    <div id="wd-array-state-variables">
      <h2>Array State Variable</h2>
      <button
        type="button"
        onClick={addElement}
        id="wd-add-element-click"
        className="mb-2 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white"
      >
        Add Element
      </button>
      <ul className="m-0 max-w-xs list-none p-0">
        {array.map((item, index) => (
          <li
            key={\`\${item}-\${index}\`}
            className="mb-1 flex items-center justify-between rounded border border-neutral-200 bg-green-50 px-3 py-1"
          >
            <span>{item}</span>
            <button
              type="button"
              onClick={() => deleteElement(index)}
              id={\`wd-delete-element-\${index}-click\`}
              className="rounded bg-red-600 px-2 py-0.5 text-sm font-medium text-white"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab4/ArrayStateVariable.tsx",
    codeStartLine: 13,
    codeHighlightLines: [13, 18, 25, 26, 27, 28],
  },
  {
    id: "array-live",
    title: "Array: copy, then add or filter: live demo",
    kind: "demo",
    embed: "array-state",
  },
  {
    id: "recap",
    title: "Form state recap",
    kind: "content",
    bullets: [
      "Boolean → `checked`. Text and date → `value` + `onChange`",
      "Objects and arrays: spread or `filter` / `map`, never mutate",
      "Kambaz New Course will reuse the object-spread draft",
    ],
  },
  {
    id: "next-up",
    title: "Next: share state with a child",
    kind: "title",
    bullets: [
      "`useState` belongs to the component that calls it",
      "§4.3.1: lift the counter so a child can increment it",
    ],
  },
];
