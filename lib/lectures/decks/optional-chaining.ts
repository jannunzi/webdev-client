import type { LectureSlide } from "../types";

export const OPTIONAL_CHAINING_SLIDES: LectureSlide[] = [
  {
    id: "title",
    title: "WEB DEV",
    kind: "title",
    bullets: [
      "Chapter 3 · Optional Chaining",
      "§3.4.17 · stop at missing, then fill a default",
    ],
  },
  {
    id: "purpose",
    title: "Implementing Optional Chaining",
    kind: "content",
    bullets: [
      "`house.address.city` throws if `address` is `null` or `undefined`",
      "`?.` stops at the first empty value and yields `undefined`",
      "`??` fills a default **only** for `null` / `undefined`",
      "`||` also treats `0` and `\"\"` as missing — usually the wrong default",
    ],
  },
  {
    id: "sample",
    title: "?. then ?? on the page",
    kind: "content",
    code: `type House = {
  bedrooms: number;
  address?: { street: string; city: string; zip?: string };
  garage?: { cars: number };
};

export default function OptionalChaining() {
  const house: House = {
    bedrooms: 4,
    address: {
      street: "Via Roma",
      city: "Roma",
    },
  };
  const missing = undefined as { prop?: string } | undefined;
  return (
    <div id="wd-optional-chaining">
      <h4>Optional Chaining</h4>
      house.address?.city = {house.address?.city} <br />
      missing?.prop ?? "n/a" = {missing?.prop ?? "n/a"}
      <hr />
    </div>
  );
}`,
    codeLanguage: "tsx",
    codeFile: "app/labs/lab3/OptionalChaining.tsx",
    codeHighlightLines: [1, 2, 3, 4, 5, 8, 19, 20],
  },
  {
    id: "sample-live",
    title: "OptionalChaining: live demo",
    kind: "demo",
    bullets: [
      "`house.address?.city` is `Roma`",
      "`missing?.prop` is `undefined`, so `?? \"n/a\"` prints the fallback",
      "The `House` **type** names the object’s shape. `?` marks `address`, `zip`, and `garage` optional",
      "TypeScript only lets you read properties the type declares, even through `?.`",
      "Without the type, `house.garage?.cars` works in `npm run dev` but fails `next build`",
    ],
    embed: "js-optional-chaining",
  },
  {
    id: "recap",
    title: "Data structures recap",
    kind: "content",
    bullets: [
      "Arrays: `map`, `filter`, `find`, `reduce`, and a `key` on every sibling",
      "Objects: named fields, `JSON.stringify`, `console.log`",
      "Spread copies. Destructuring unpacks. `?.` / `??` stay safe",
    ],
  },
  {
    id: "next-up",
    title: "Next: TypeScript types",
    kind: "title",
    bullets: [
      "Types describe what each variable, object, and function holds",
      "§3.5: annotations, object types, unions, and narrowing",
    ],
  },
];
