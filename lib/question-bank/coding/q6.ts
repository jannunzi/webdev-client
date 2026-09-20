import { numberedBlank } from "../blanks";
import { codingQuestion } from "../builders";
import type { QuestionBank, QuestionGroup } from "../types";

function queryFib(input: {
  id: string;
  collection: string;
  field: string;
  value: string | number;
}): ReturnType<typeof codingQuestion> {
  const printed = typeof input.value === "string" ? `"${input.value}"` : String(input.value);
  const template = `const docs = await db.collection("${input.collection}").${numberedBlank(0)}({ ${input.field}: ${printed} });
await db.collection("${input.collection}").${numberedBlank(1)}({ ${input.field}: ${printed} });`;
  return codingQuestion({
    id: input.id,
    language: "javascript",
    style: "fib",
    prompt: `Talk to the \`${input.collection}\` collection.

1. find documents whose \`${input.field}\` is ${printed}
2. insert one document with that same field`,
    code: template,
    blankCount: 2,
    acceptedBlanks: [["find", "insertOne"]],
    referenceSolution: `const docs = await db.collection("${input.collection}").find({ ${input.field}: ${printed} });
await db.collection("${input.collection}").insertOne({ ${input.field}: ${printed} });`,
    rubric:
      `${numberedBlank(0)} is find. ${numberedBlank(1)} is insertOne (insert is accepted as a near miss via the local grader). Excuse find() with parens and trivial misspellings. Partial credit per blank.`,
    preview: {
      kind: "note",
      text: `find and insertOne on ${input.collection} where ${input.field} is ${printed}.`,
    },
  });
}

function findQuery(input: {
  id: string;
  collection: string;
  field: string;
  value: string | number;
}): ReturnType<typeof codingQuestion> {
  const printed = typeof input.value === "string" ? `"${input.value}"` : String(input.value);
  return codingQuestion({
    id: input.id,
    language: "javascript",
    style: "implement",
    prompt: `Write a MongoDB query that finds documents in \`${input.collection}\` whose \`${input.field}\` is ${printed}. Use \`db.collection(...).find(...)\`.`,
    placeholder: `db.collection("${input.collection}").find({ ... })`,
    referenceSolution: `db.collection("${input.collection}").find({ ${input.field}: ${printed} })`,
    rubric: `Require collection ${input.collection}, find, and a filter on ${input.field}. Excuse quotes, extra await, and toArray(). Partial credit if find is present but the filter is wrong.`,
    preview: {
      kind: "note",
      text: `find ${input.collection} where ${input.field} = ${printed}`,
    },
    checks: {
      requiredTokens: ["collection", input.collection, "find", input.field],
    },
  });
}

const METHODS: QuestionGroup = {
  id: "q6-code-methods",
  order: 1,
  name: "Coding — Mongo methods",
  type: "coding",
  chapter: 6,
  section: "methods",
  skill: "Fill in find and insertOne on a collection.",
  notes: "Website Q6 only. Canvas fallback stays traditional.",
  questions: [
    queryFib({
      id: "q6-code-methods-01",
      collection: "movies",
      field: "year",
      value: 1995,
    }),
    queryFib({
      id: "q6-code-methods-02",
      collection: "books",
      field: "title",
      value: "Dune",
    }),
    queryFib({
      id: "q6-code-methods-03",
      collection: "users",
      field: "role",
      value: "faculty",
    }),
    queryFib({
      id: "q6-code-methods-04",
      collection: "courses",
      field: "credits",
      value: 4,
    }),
  ],
};

const QUERIES: QuestionGroup = {
  id: "q6-code-queries",
  order: 2,
  name: "Coding — a find query",
  type: "coding",
  chapter: 6,
  section: "queries",
  skill: "Write a short collection.find filter.",
  notes: "Website Q6 only. Canvas fallback stays traditional.",
  questions: [
    findQuery({
      id: "q6-code-queries-01",
      collection: "movies",
      field: "year",
      value: 1995,
    }),
    findQuery({
      id: "q6-code-queries-02",
      collection: "books",
      field: "title",
      value: "Dune",
    }),
    findQuery({
      id: "q6-code-queries-03",
      collection: "users",
      field: "role",
      value: "faculty",
    }),
    findQuery({
      id: "q6-code-queries-04",
      collection: "courses",
      field: "credits",
      value: 4,
    }),
  ],
};

export const Q6_CODING_GROUPS: QuestionGroup[] = [METHODS, QUERIES];

export const Q6_CODING_BANK: QuestionBank = {
  id: "q6-mongo-coding",
  title: "Q6 — MongoDB coding (website)",
  chapter: 6,
  status: "review_draft",
  groups: Q6_CODING_GROUPS,
};
