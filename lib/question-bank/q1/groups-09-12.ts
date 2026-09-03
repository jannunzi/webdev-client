import { fib, mc, tf } from "../builders";
import type { QuestionGroup } from "../types";

const DEFAULT_VALUE_ANSWERS = [
  "defaultValue",
  "defaultvalue",
  "default value",
];

export const q1Group09: QuestionGroup = {
  id: "q1-g09-text-fields",
  order: 9,
  name: "Text fields and text areas",
  type: "fill_in_blank",
  chapter: 1,
  section: "1.3.6.2",
  skill: "Uncontrolled initial text uses defaultValue (including JSX textarea); placeholder is not the value.",
  questions: [
    ...[
      "Tenured Faculty username",
      "Full Time Employee password",
      "Savings Account nickname",
      "Course registration first name",
      "Library card last name",
      "Dining plan comments",
      "Parking appeal notes",
      "Research biography",
      "Club officer title",
      "Advisor meeting summary",
    ].map((domain, index) =>
      fib(
        `q1-g09-${String(index + 1).padStart(2, "0")}`,
        `For an uncontrolled ${domain} field in JSX (including <textarea>), put the starting text on the _____ prop — not on children, and not as if placeholder were the submitted value.`,
        DEFAULT_VALUE_ANSWERS,
        "Uncontrolled fields get defaultValue, then the browser owns typing. placeholder is hint text. React 19 throws if textarea children are set.",
      ),
    ),
  ],
};

export const q1Group10: QuestionGroup = {
  id: "q1-g10-radios-checkboxes",
  order: 10,
  name: "Radio buttons and checkboxes",
  type: "multiple_choice",
  chapter: 1,
  section: "1.3.6.3",
  skill: "Radios sharing name are mutually exclusive; checkboxes stay independent.",
  questions: [
    mc(
      "q1-g10-01",
      "The browser groups radio buttons that share the same _____ attribute.",
      ["id", "htmlFor", "name", "placeholder"],
      2,
    ),
    mc(
      "q1-g10-02",
      "What does mutually exclusive mean for radios that share a name?",
      [
        "The user can select every option at once",
        "Selecting one option clears the others in that name group",
        "The radios ignore the name attribute",
        "Only checkboxes can be selected",
      ],
      1,
    ),
    mc(
      "q1-g10-03",
      "Comedy is selected in a group named genre. The user then picks Weekly in a group named frequency. What is selected?",
      [
        "Only Weekly — any new radio click clears every radio on the page",
        "Only Comedy — frequency radios do not work",
        "Both Comedy and Weekly — different name values are separate groups",
        "Neither — radios cannot stay selected",
      ],
      2,
    ),
    mc(
      "q1-g10-04",
      "Which pair of radios is one mutually exclusive group?",
      [
        '<input type="radio" name="genre" id="comedy" /> and <input type="radio" name="genre" id="drama" />',
        '<input type="radio" name="genre" id="comedy" /> and <input type="radio" name="frequency" id="weekly" />',
        '<input type="radio" id="comedy" /> and <input type="radio" id="drama" />  (no name)',
        '<input type="checkbox" name="genre" /> and <input type="checkbox" name="genre" />',
      ],
      0,
    ),
    mc(
      "q1-g10-05",
      "How do checkboxes differ from radio buttons that share a name?",
      [
        "Checkboxes are also mutually exclusive — only one box in the name group can be on",
        "Each checkbox can be selected independently, so Comedy and Drama can both be on",
        "Checkboxes cannot use a label",
        "Checkboxes ignore id and htmlFor",
      ],
      1,
    ),
    mc(
      "q1-g10-06",
      "Each radio option still needs its own _____ even when they share a name.",
      [
        "form",
        "id (and usually a value when you submit later)",
        "placeholder",
        "rows attribute",
      ],
      1,
    ),
    mc(
      "q1-g10-07",
      "A second independent exclusive choice (for example class standing vs full-time/part-time) needs _____.",
      [
        "the same name as the first radio group",
        "a different name from the first radio group",
        "type=\"checkbox\" on every option",
        "no name attributes at all",
      ],
      1,
    ),
    mc(
      "q1-g10-08",
      "Checkboxes with the same name are _____.",
      [
        "forced to a single selection",
        "still independent; same name does not make them exclusive",
        "invalid HTML",
        "converted into a <select>",
      ],
      1,
    ),
    mc(
      "q1-g10-09",
      "Which control is the right fit for “pick every interest that applies”?",
      ["radio buttons that share one name", "checkboxes", "a single submit button", "type=\"range\" only"],
      1,
    ),
    mc(
      "q1-g10-10",
      "Which control is the right fit for “pick exactly one class standing”?",
      [
        "checkboxes",
        "radio buttons that share one name (or a single-select dropdown)",
        "three unrelated text fields",
        "type=\"date\"",
      ],
      1,
    ),
  ],
};

export const q1Group11: QuestionGroup = {
  id: "q1-g11-dropdowns",
  order: 11,
  name: "Dropdowns and option values",
  type: "multiple_choice",
  chapter: 1,
  section: "1.3.6.5",
  skill: "select/option: visible label vs value token; defaultValue; multiple.",
  questions: [
    mc(
      "q1-g11-01",
      "In <option value=\"SCIFI\">Science Fiction</option>, what do people see, and what does the form record?",
      [
        "They see SCIFI; the form records Science Fiction",
        "They see Science Fiction; the form records SCIFI",
        "Both the label and the value must be identical",
        "Neither is used on submit",
      ],
      1,
    ),
    mc(
      "q1-g11-02",
      "Option value attributes are typically short _____ rather than the display prose.",
      ["paragraphs", "tokens / stable codes", "file paths under public/", "heading levels"],
      1,
    ),
    mc(
      "q1-g11-03",
      "On an uncontrolled <select>, defaultValue=\"SCIFI\" will select which option?",
      [
        "The option whose visible text is SCIFI",
        "The option whose value attribute is SCIFI",
        "Every option",
        "Nothing — defaultValue is invalid on select",
      ],
      1,
    ),
    mc(
      "q1-g11-04",
      "How do you let the user pick more than one option in a <select>?",
      [
        'type="multiple"',
        "Add the multiple attribute on <select>",
        "Use <option multiple> on every choice",
        "You cannot; use radio buttons instead",
      ],
      1,
    ),
    mc(
      "q1-g11-05",
      "For a multi-select, defaultValue can be _____.",
      [
        "only a boolean",
        "an array of option value tokens, for example [\"COMEDY\", \"SCIFI\"]",
        "only the visible labels",
        "a CSS class list",
      ],
      1,
    ),
    mc(
      "q1-g11-06",
      "Which element contains the list of choices?",
      ["<input type=\"dropdown\">", "<select> with nested <option> elements", "<ul> with <a> children", "<datalist> is required in this chapter"],
      1,
    ),
    mc(
      "q1-g11-07",
      "The visible option text can change later without breaking stored data if you _____.",
      [
        "keep the value tokens stable",
        "delete the value attribute",
        "put the database id in the visible text only",
        "switch to checkboxes",
      ],
      0,
    ),
    mc(
      "q1-g11-08",
      "In the browser, adding or removing individual options in a multiple select without clearing the rest typically uses _____.",
      [
        "Alt-click only",
        "Command (macOS) or Control (Windows/Linux) click",
        "the Enter key alone",
        "double-clicking the <label>",
      ],
      1,
    ),
    mc(
      "q1-g11-09",
      "Shift-click in a multiple <select> is used to _____.",
      [
        "submit the form",
        "select a contiguous range of options",
        "open the option in a new tab",
        "toggle type=\"email\"",
      ],
      1,
    ),
    mc(
      "q1-g11-10",
      "A single-choice dropdown (no multiple) is a reasonable alternative to _____ when the exclusive options are a moderately long list.",
      [
        "a set of radio buttons sharing one name",
        "an unordered list of links",
        "a table footer",
        "an h1",
      ],
      0,
    ),
  ],
};

export const q1Group12: QuestionGroup = {
  id: "q1-g12-typed-inputs",
  order: 12,
  name: "Typed inputs (email, number, range, date)",
  type: "true_false",
  chapter: 1,
  section: "1.3.6.6",
  skill: "Core typed inputs from the chapter: email, number, range, date (not exploratory types).",
  questions: [
    tf(
      "q1-g12-01",
      "type=\"email\" expects an address-like value (for example name@domain) and on many phones shows a keyboard that emphasizes @ and .",
      true,
    ),
    tf(
      "q1-g12-02",
      "type=\"number\" is for numeric values; min and max can limit the allowed range.",
      true,
    ),
    tf(
      "q1-g12-03",
      "type=\"range\" renders as a slider along a continuum and is typically paired with min, max, and a starting defaultValue.",
      true,
    ),
    tf(
      "q1-g12-04",
      "type=\"date\" stores values as YYYY-MM-DD even when the browser displays a localized date.",
      true,
    ),
    tf(
      "q1-g12-05",
      "min and max on a date input also use YYYY-MM-DD when you restrict which dates are allowed.",
      true,
    ),
    tf(
      "q1-g12-06",
      "Plain type=\"text\" is the better default whenever you want the browser to check email shape for you.",
      false,
      "Prefer type=\"email\" when the value is an email address so the browser can validate a basic shape.",
    ),
    tf(
      "q1-g12-07",
      "A rating from 1 to 5 is a typical use of type=\"range\".",
      true,
    ),
    tf(
      "q1-g12-08",
      "type=\"number\" with min={0} can be used to reject negative salaries in supporting browsers.",
      true,
    ),
    tf(
      "q1-g12-09",
      "This chapter treats type=\"color\" and type=\"file\" as core required controls that every form must include.",
      false,
      "Those types are listed as exploratory extras, not the core email/number/range/date set.",
    ),
    tf(
      "q1-g12-10",
      "Typed inputs can show specialized mobile keyboards or native pickers, which reduces some entry mistakes before JavaScript validation.",
      true,
    ),
  ],
};
