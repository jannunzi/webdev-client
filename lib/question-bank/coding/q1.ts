import { codingQuestion } from "../builders";
import type { QuestionBank, QuestionGroup } from "../types";

function formFib(input: {
  id: string;
  label: string;
  inputId: string;
  title: string;
  value: string;
  placeholder: string;
}): ReturnType<typeof codingQuestion> {
  const template = `<label _____="${input.inputId}">${input.label}</label>
<input _____="${input.inputId}" _____="${input.title}" _____="${input.value}" _____="${input.placeholder}">`;
  return codingQuestion({
    id: input.id,
    language: "html",
    style: "fib",
    prompt: `The live field below uses a label next to a text input.

- Hover the field — a small tooltip appears
- It starts with a default value
- If you delete that value, grayed example text appears and goes away when you type again
- Click the label text next to the field — the input gets focus

Complete the HTML. Fill each blank with the attribute name (\`for\`, \`id\`, \`title\`, \`value\`, or \`placeholder\`).

The tooltip text is “${input.title}”. The default value is “${input.value}”. The grayed example text is “${input.placeholder}”. The label must point at the input.`,
    code: template,
    blankCount: 5,
    acceptedBlanks: [["for", "id", "title", "value", "placeholder"]],
    referenceSolution: `<label for="${input.inputId}">${input.label}</label>
<input id="${input.inputId}" title="${input.title}" value="${input.value}" placeholder="${input.placeholder}">`,
    rubric:
      "Blank 1 is for (label). Blank 2 is id (must match). Blank 3 is title (tooltip). Blank 4 is value (default). Blank 5 is placeholder (gray example). Excuse htmlFor for for, quote style, and trivial misspellings. Partial credit per correct blank.",
    preview: {
      kind: "form-input",
      label: input.label,
      inputId: input.inputId,
      defaultValue: input.value,
      placeholder: input.placeholder,
      title: input.title,
    },
    explanation:
      "`for` + `id` connect the label. `title` is the hover tooltip. `value` is the starting text. `placeholder` is the gray hint after the value is cleared.",
  });
}

function listImplement(input: {
  id: string;
  items: [string, string, string];
}): ReturnType<typeof codingQuestion> {
  const [a, b, c] = input.items;
  return codingQuestion({
    id: input.id,
    language: "html",
    style: "implement",
    prompt:
      "Write HTML that produces the bullet list shown below. Use list tags only — no html, head, or body wrapper.",
    placeholder: "Write the list markup here.",
    referenceSolution: `<ul>
  <li>${a}</li>
  <li>${b}</li>
  <li>${c}</li>
</ul>`,
    rubric: `Require a ul with three li items for ${a}, ${b}, and ${c} in that order. Excuse trivial misspellings, tag case, extra whitespace, attribute order, a missing self-closing slash, and omitted </li> if the items are still there. Partial credit if they used ol, missed an item, or skipped li wrappers. Do not require a full HTML document.`,
    preview: { kind: "bullet-list", items: input.items },
    checks: {
      requiredTags: ["ul", "li"],
      requiredText: input.items,
    },
    explanation: "An unordered (bullet) list is `<ul>` with one `<li>` per item.",
  });
}

const FORMS: QuestionGroup = {
  id: "q1-code-forms",
  order: 1,
  name: "Coding — form attributes",
  type: "coding",
  chapter: 1,
  section: "forms",
  skill: "Name the HTML attributes that wire a label, tooltip, default, and placeholder.",
  notes:
    "Website Q1 only. Lenient local grader plus optional xAI. Canvas fallback does not include this group.",
  questions: [
    formFib({
      id: "q1-code-forms-01",
      label: "Username",
      inputId: "username",
      title: "Campus login",
      value: "pat",
      placeholder: "e.g. alex",
    }),
    formFib({
      id: "q1-code-forms-02",
      label: "Email",
      inputId: "email",
      title: "School email",
      value: "you@school.edu",
      placeholder: "name@school.edu",
    }),
    formFib({
      id: "q1-code-forms-03",
      label: "Full name",
      inputId: "fullname",
      title: "Your full name",
      value: "Pat Lee",
      placeholder: "First Last",
    }),
    formFib({
      id: "q1-code-forms-04",
      label: "City",
      inputId: "city",
      title: "Home city",
      value: "Boston",
      placeholder: "e.g. Seattle",
    }),
  ],
};

const LISTS: QuestionGroup = {
  id: "q1-code-lists",
  order: 2,
  name: "Coding — bullet list",
  type: "coding",
  chapter: 1,
  section: "lists",
  skill: "Write an unordered HTML list that matches a shown bullet list.",
  notes:
    "Website Q1 only. Lenient local grader plus optional xAI. Canvas fallback does not include this group.",
  questions: [
    listImplement({
      id: "q1-code-lists-01",
      items: ["Apple", "Banana", "Cherry"],
    }),
    listImplement({
      id: "q1-code-lists-02",
      items: ["Boston", "Seattle", "Austin"],
    }),
    listImplement({
      id: "q1-code-lists-03",
      items: ["HTML", "CSS", "JavaScript"],
    }),
    listImplement({
      id: "q1-code-lists-04",
      items: ["Mix", "Bake", "Cool"],
    }),
  ],
};

export const Q1_CODING_GROUPS: QuestionGroup[] = [FORMS, LISTS];

export const Q1_CODING_BANK: QuestionBank = {
  id: "q1-html-coding",
  title: "Q1 — HTML coding (website)",
  chapter: 1,
  status: "review_draft",
  groups: Q1_CODING_GROUPS,
};
