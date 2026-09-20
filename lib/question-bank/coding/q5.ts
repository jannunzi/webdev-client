import { numberedBlank } from "../blanks";
import { codingQuestion } from "../builders";
import type { QuestionBank, QuestionGroup } from "../types";

function fetchFib(input: {
  id: string;
  url: string;
  method: string;
}): ReturnType<typeof codingQuestion> {
  const template = `const response = await ${numberedBlank(0)}("${input.url}", {
  ${numberedBlank(1)}: "${input.method}",
  headers: { "Content-Type": "application/json" },
  body: JSON.${numberedBlank(2)}(payload),
});`;
  return codingQuestion({
    id: input.id,
    language: "javascript",
    style: "fib",
    prompt: `Send JSON to \`${input.url}\` with HTTP ${input.method}.

1. the browser function that makes the request
2. the option that sets the HTTP verb
3. the JSON method that turns the object into a string`,
    code: template,
    blankCount: 3,
    acceptedBlanks: [["fetch", "method", "stringify"]],
    referenceSolution: `const response = await fetch("${input.url}", {
  method: "${input.method}",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});`,
    rubric:
      "Blanks are fetch, method, stringify. Excuse JSON.stringify as stringify. Partial credit per blank. Trivial misspellings OK.",
    preview: {
      kind: "note",
      text: `${input.method} ${input.url} with a JSON body.`,
    },
  });
}

function expressGet(input: {
  id: string;
  path: string;
}): ReturnType<typeof codingQuestion> {
  return codingQuestion({
    id: input.id,
    language: "javascript",
    style: "implement",
    prompt: `Write an Express handler that listens for GET ${input.path} and responds with JSON \`[]\`. Assume \`app\` is already created.`,
    placeholder: `app.get("${input.path}", (req, res) => { ... });`,
    referenceSolution: `app.get("${input.path}", (req, res) => {
  res.json([]);
});`,
    rubric: `Require app.get for ${input.path} and a JSON empty-array response (res.json([]) or res.send([])). Excuse unused req, extra status codes, and quote style. Partial credit if the path or json is missing.`,
    preview: {
      kind: "note",
      text: `GET ${input.path} → JSON []`,
    },
    checks: {
      requiredTokens: ["app.get", input.path, "json"],
    },
  });
}

const FETCH: QuestionGroup = {
  id: "q5-code-fetch",
  order: 1,
  name: "Coding — fetch request",
  type: "coding",
  chapter: 5,
  section: "fetch",
  skill: "Fill in fetch, method, and JSON.stringify for a JSON request.",
  notes: "Website Q5 only. Canvas fallback stays traditional.",
  questions: [
    fetchFib({
      id: "q5-code-fetch-01",
      url: "https://example.com/api/todos",
      method: "POST",
    }),
    fetchFib({
      id: "q5-code-fetch-02",
      url: "https://example.com/api/modules",
      method: "PUT",
    }),
    fetchFib({
      id: "q5-code-fetch-03",
      url: "/api/users",
      method: "POST",
    }),
    fetchFib({
      id: "q5-code-fetch-04",
      url: "/api/assignments",
      method: "PATCH",
    }),
  ],
};

const ROUTES: QuestionGroup = {
  id: "q5-code-routes",
  order: 2,
  name: "Coding — an Express route",
  type: "coding",
  chapter: 5,
  section: "routes",
  skill: "Write a one-line Express GET handler that returns JSON.",
  notes: "Website Q5 only. Canvas fallback stays traditional.",
  questions: [
    expressGet({ id: "q5-code-routes-01", path: "/api/todos" }),
    expressGet({ id: "q5-code-routes-02", path: "/api/modules" }),
    expressGet({ id: "q5-code-routes-03", path: "/api/users" }),
    expressGet({ id: "q5-code-routes-04", path: "/api/courses" }),
  ],
};

export const Q5_CODING_GROUPS: QuestionGroup[] = [FETCH, ROUTES];

export const Q5_CODING_BANK: QuestionBank = {
  id: "q5-rest-coding",
  title: "Q5 — REST coding (website)",
  chapter: 5,
  status: "review_draft",
  groups: Q5_CODING_GROUPS,
};
