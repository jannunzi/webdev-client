import { codingHtml } from "../builders";
import type { QuestionBank, QuestionGroup } from "../types";

const LISTS: QuestionGroup = {
  id: "q1-code-lists",
  order: 1,
  name: "Coding — lists",
  type: "coding",
  chapter: 1,
  section: "1.3.3",
  skill: "Write a short unordered or ordered list in HTML.",
  notes:
    "Website Q1 only. AI-graded, lenient, partial credit. Canvas fallback does not include this group.",
  questions: [
    codingHtml(
      "q1-code-lists-01",
      "Write HTML for an unordered list of three fruits: Apple, Banana, and Cherry. Use only list markup — no html, head, or body wrapper.",
      `<ul>
  <li>Apple</li>
  <li>Banana</li>
  <li>Cherry</li>
</ul>`,
      "Require a ul (or equivalent unordered list) with three li items for Apple, Banana, and Cherry in that order. Excuse trivial misspellings of the fruit names, tag case, and extra whitespace. Partial credit if they used ol instead of ul, or missed one item, or omitted li wrappers. Full credit does not require a full HTML document.",
    ),
    codingHtml(
      "q1-code-lists-02",
      "Write HTML for an ordered list of three steps: Mix, Bake, and Cool. Use only list markup — no html, head, or body wrapper.",
      `<ol>
  <li>Mix</li>
  <li>Bake</li>
  <li>Cool</li>
</ol>`,
      "Require an ol with three li items for Mix, Bake, and Cool in that order. Excuse trivial misspellings, tag case, and extra whitespace. Partial credit if they used ul instead of ol or missed a step. Do not require a full HTML document.",
    ),
    codingHtml(
      "q1-code-lists-03",
      "Write HTML for an unordered list of two cities: Boston and Seattle. Use only list markup — no html, head, or body wrapper.",
      `<ul>
  <li>Boston</li>
  <li>Seattle</li>
</ul>`,
      "Require a ul with two li items for Boston and Seattle. Excuse trivial misspellings, tag case, and extra whitespace. Partial credit if they used ol or missed a city. Do not require a full HTML document.",
    ),
    codingHtml(
      "q1-code-lists-04",
      "Write HTML for an ordered list of two languages: HTML and CSS. Use only list markup — no html, head, or body wrapper.",
      `<ol>
  <li>HTML</li>
  <li>CSS</li>
</ol>`,
      "Require an ol with two li items for HTML and CSS in that order. Excuse tag case and extra whitespace. Partial credit if they used ul or missed an item. Do not require a full HTML document.",
    ),
  ],
};

const TABLES: QuestionGroup = {
  id: "q1-code-tables",
  order: 2,
  name: "Coding — tables",
  type: "coding",
  chapter: 1,
  section: "1.3.4",
  skill: "Write a small HTML table with a header row and one data row.",
  notes:
    "Website Q1 only. AI-graded, lenient, partial credit. Canvas fallback does not include this group.",
  questions: [
    codingHtml(
      "q1-code-tables-01",
      "Write HTML for a two-column table with a header row (Name, Role) and one data row (Ada, Author). Use table, tr, th, and td. No html, head, or body wrapper.",
      `<table>
  <tr>
    <th>Name</th>
    <th>Role</th>
  </tr>
  <tr>
    <td>Ada</td>
    <td>Author</td>
  </tr>
</table>`,
      "Require a table with a header row using th for Name and Role, plus a data row using td for Ada and Author. Excuse trivial misspellings, tag case, extra whitespace, and an optional thead/tbody. Partial credit if headers are td instead of th, or one cell is missing. Do not require a full HTML document.",
    ),
    codingHtml(
      "q1-code-tables-02",
      "Write HTML for a two-column table with a header row (City, State) and one data row (Boston, MA). Use table, tr, th, and td. No html, head, or body wrapper.",
      `<table>
  <tr>
    <th>City</th>
    <th>State</th>
  </tr>
  <tr>
    <td>Boston</td>
    <td>MA</td>
  </tr>
</table>`,
      "Require a table with th headers City and State and td cells Boston and MA. Excuse trivial misspellings, tag case, extra whitespace, and optional thead/tbody. Partial credit for missing a cell or using td for headers. Do not require a full HTML document.",
    ),
    codingHtml(
      "q1-code-tables-03",
      "Write HTML for a two-column table with a header row (Item, Qty) and one data row (Pens, 3). Use table, tr, th, and td. No html, head, or body wrapper.",
      `<table>
  <tr>
    <th>Item</th>
    <th>Qty</th>
  </tr>
  <tr>
    <td>Pens</td>
    <td>3</td>
  </tr>
</table>`,
      "Require a table with th headers Item and Qty and td cells Pens and 3. Excuse trivial misspellings, tag case, extra whitespace, and optional thead/tbody. Partial credit for a missing cell or td headers. Do not require a full HTML document.",
    ),
    codingHtml(
      "q1-code-tables-04",
      "Write HTML for a two-column table with a header row (Course, Credits) and one data row (Web, 4). Use table, tr, th, and td. No html, head, or body wrapper.",
      `<table>
  <tr>
    <th>Course</th>
    <th>Credits</th>
  </tr>
  <tr>
    <td>Web</td>
    <td>4</td>
  </tr>
</table>`,
      "Require a table with th headers Course and Credits and td cells Web and 4. Excuse trivial misspellings, tag case, extra whitespace, and optional thead/tbody. Partial credit for a missing cell or td headers. Do not require a full HTML document.",
    ),
  ],
};

const FORMS: QuestionGroup = {
  id: "q1-code-forms",
  order: 3,
  name: "Coding — forms",
  type: "coding",
  chapter: 1,
  section: "1.3.6",
  skill: "Write a tiny HTML form with one control and a submit button.",
  notes:
    "Website Q1 only. AI-graded, lenient, partial credit. Canvas fallback does not include this group.",
  questions: [
    codingHtml(
      "q1-code-forms-01",
      "Write HTML for a form with one text input named email and a submit button whose label is Send. No html, head, or body wrapper.",
      `<form>
  <input type="text" name="email" />
  <button type="submit">Send</button>
</form>`,
      "Require a form, an input whose name is email (type text or email is fine), and a submit control labeled Send (button or input type=submit). Excuse tag case, quote style, self-closing slashes, and extra whitespace. Partial credit if the name or the Send label is missing. Do not require a full HTML document or a label element.",
    ),
    codingHtml(
      "q1-code-forms-02",
      "Write HTML for a form with one text input named q and a submit button whose label is Search. No html, head, or body wrapper.",
      `<form>
  <input type="text" name="q" />
  <button type="submit">Search</button>
</form>`,
      "Require a form, an input named q, and a submit control labeled Search. Excuse tag case, quote style, self-closing slashes, and extra whitespace. Partial credit if the name or Search label is missing. Do not require a full HTML document.",
    ),
    codingHtml(
      "q1-code-forms-03",
      "Write HTML for a form with one password input named secret and a submit button whose label is Login. No html, head, or body wrapper.",
      `<form>
  <input type="password" name="secret" />
  <button type="submit">Login</button>
</form>`,
      "Require a form, an input named secret (type password preferred; text is partial credit), and a submit control labeled Login. Excuse tag case, quote style, self-closing slashes, and extra whitespace. Do not require a full HTML document.",
    ),
    codingHtml(
      "q1-code-forms-04",
      "Write HTML for a form with one checkbox input named agree and a submit button whose label is Continue. No html, head, or body wrapper.",
      `<form>
  <input type="checkbox" name="agree" />
  <button type="submit">Continue</button>
</form>`,
      "Require a form, a checkbox named agree, and a submit control labeled Continue. Excuse tag case, quote style, self-closing slashes, and extra whitespace. Partial credit if type=checkbox or the name is missing. Do not require a full HTML document or a label element.",
    ),
  ],
};

const HEADINGS: QuestionGroup = {
  id: "q1-code-headings",
  order: 4,
  name: "Coding — headings",
  type: "coding",
  chapter: 1,
  section: "1.3.2",
  skill: "Write a short heading hierarchy with h1 and h2.",
  notes:
    "Website Q1 only. AI-graded, lenient, partial credit. Canvas fallback does not include this group.",
  questions: [
    codingHtml(
      "q1-code-headings-01",
      "Write HTML with an h1 that says Garden and an h2 that says Tools. No html, head, or body wrapper.",
      `<h1>Garden</h1>
<h2>Tools</h2>`,
      "Require an h1 whose text is Garden and an h2 whose text is Tools, in that order. Excuse trivial misspellings, tag case, and extra whitespace. Partial credit if they used the wrong heading level or missed one heading. Do not require a full HTML document.",
    ),
    codingHtml(
      "q1-code-headings-02",
      "Write HTML with an h1 that says Recipes and an h2 that says Desserts. No html, head, or body wrapper.",
      `<h1>Recipes</h1>
<h2>Desserts</h2>`,
      "Require an h1 Recipes and an h2 Desserts, in that order. Excuse trivial misspellings, tag case, and extra whitespace. Partial credit for the wrong heading level or a missing heading. Do not require a full HTML document.",
    ),
    codingHtml(
      "q1-code-headings-03",
      "Write HTML with an h1 that says Campus and an h2 that says Library. No html, head, or body wrapper.",
      `<h1>Campus</h1>
<h2>Library</h2>`,
      "Require an h1 Campus and an h2 Library, in that order. Excuse trivial misspellings, tag case, and extra whitespace. Partial credit for the wrong heading level or a missing heading. Do not require a full HTML document.",
    ),
    codingHtml(
      "q1-code-headings-04",
      "Write HTML with an h1 that says Music and an h2 that says Jazz. No html, head, or body wrapper.",
      `<h1>Music</h1>
<h2>Jazz</h2>`,
      "Require an h1 Music and an h2 Jazz, in that order. Excuse trivial misspellings, tag case, and extra whitespace. Partial credit for the wrong heading level or a missing heading. Do not require a full HTML document.",
    ),
  ],
};

const LINKS: QuestionGroup = {
  id: "q1-code-links",
  order: 5,
  name: "Coding — links",
  type: "coding",
  chapter: 1,
  section: "1.3.5",
  skill: "Write an HTML anchor with an href and visible text.",
  notes:
    "Website Q1 only. AI-graded, lenient, partial credit. Canvas fallback does not include this group.",
  questions: [
    codingHtml(
      "q1-code-links-01",
      "Write an HTML link to https://example.com whose visible text is Example. Use the a element and href. No html, head, or body wrapper.",
      `<a href="https://example.com">Example</a>`,
      "Require an a element whose href is https://example.com (with or without a trailing slash) and whose visible text is Example. Excuse quote style, tag case, and extra whitespace. Partial credit if the href or the visible text is wrong but an anchor is present. Do not require target, rel, or a full HTML document.",
    ),
    codingHtml(
      "q1-code-links-02",
      "Write an HTML link to https://northeastern.edu whose visible text is Northeastern. Use the a element and href. No html, head, or body wrapper.",
      `<a href="https://northeastern.edu">Northeastern</a>`,
      "Require an a element whose href is https://northeastern.edu (optional trailing slash or www) and whose visible text is Northeastern. Excuse trivial misspellings, quote style, tag case, and extra whitespace. Partial credit if the href or text is wrong but an anchor is present. Do not require a full HTML document.",
    ),
    codingHtml(
      "q1-code-links-03",
      "Write an HTML link to /about whose visible text is About. Use the a element and href. No html, head, or body wrapper.",
      `<a href="/about">About</a>`,
      "Require an a element whose href is /about and whose visible text is About. Excuse quote style, tag case, and extra whitespace. Partial credit if they used about.html or missed the leading slash. Do not require a full HTML document.",
    ),
    codingHtml(
      "q1-code-links-04",
      "Write an HTML link to #top whose visible text is Back to top. Use the a element and href. No html, head, or body wrapper.",
      `<a href="#top">Back to top</a>`,
      "Require an a element whose href is #top and whose visible text is Back to top (excuse trivial wording tweaks like Back to Top). Excuse quote style, tag case, and extra whitespace. Partial credit if the href fragment is missing. Do not require a full HTML document.",
    ),
  ],
};

const IMAGES: QuestionGroup = {
  id: "q1-code-images",
  order: 6,
  name: "Coding — images",
  type: "coding",
  chapter: 1,
  section: "1.3.5",
  skill: "Write an img element with src and alternative text.",
  notes:
    "Website Q1 only. AI-graded, lenient, partial credit. Canvas fallback does not include this group.",
  questions: [
    codingHtml(
      "q1-code-images-01",
      "Write an HTML image for a file named cat.jpg with alternative text A gray cat. No html, head, or body wrapper.",
      `<img src="cat.jpg" alt="A gray cat" />`,
      "Require an img with src cat.jpg (relative path is fine) and alt text close to A gray cat. Excuse quote style, attribute order, self-closing slash, tag case, and grey/gray. Partial credit if src or alt is missing. Do not require width/height or a full HTML document.",
    ),
    codingHtml(
      "q1-code-images-02",
      "Write an HTML image for a file named logo.png with alternative text Site logo. No html, head, or body wrapper.",
      `<img src="logo.png" alt="Site logo" />`,
      "Require an img with src logo.png and alt text close to Site logo. Excuse quote style, attribute order, self-closing slash, and tag case. Partial credit if src or alt is missing. Do not require a full HTML document.",
    ),
    codingHtml(
      "q1-code-images-03",
      "Write an HTML image for a file named /images/map.svg with alternative text Campus map. No html, head, or body wrapper.",
      `<img src="/images/map.svg" alt="Campus map" />`,
      "Require an img whose src is /images/map.svg (images/map.svg without the leading slash is acceptable) and whose alt is close to Campus map. Excuse quote style, attribute order, self-closing slash, and tag case. Partial credit if src or alt is missing. Do not require a full HTML document.",
    ),
    codingHtml(
      "q1-code-images-04",
      "Write an HTML image for a file named dog.webp with alternative text A brown dog. No html, head, or body wrapper.",
      `<img src="dog.webp" alt="A brown dog" />`,
      "Require an img with src dog.webp and alt text close to A brown dog. Excuse quote style, attribute order, self-closing slash, tag case, and trivial misspellings. Partial credit if src or alt is missing. Do not require a full HTML document.",
    ),
  ],
};

export const CHAPTER1_CODING_GROUPS: QuestionGroup[] = [
  LISTS,
  TABLES,
  FORMS,
  HEADINGS,
  LINKS,
  IMAGES,
];

export const CHAPTER1_CODING_BANK: QuestionBank = {
  id: "q1-html-coding",
  title: "Q1 — HTML coding (website)",
  chapter: 1,
  status: "review_draft",
  groups: CHAPTER1_CODING_GROUPS,
};
