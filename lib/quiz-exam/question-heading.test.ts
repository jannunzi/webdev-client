import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, it } from "node:test";
import { GradedQuestionList } from "../../app/quizzes/take/components/AttemptReview.tsx";
import type { GradedAnswer, StudentQuestion } from "./types.ts";

const questions: StudentQuestion[] = [
  {
    id: "q-acro",
    groupId: "q1-g01-acronyms",
    groupName: "Acronyms",
    groupOrder: 1,
    type: "fill_in_blank",
    prompt: "Expand HTML.",
    blankCount: 4,
  },
  {
    id: "q-code",
    groupId: "q1-code-lists",
    groupName: "Ordered, unordered, and nested lists",
    groupOrder: 3,
    type: "coding",
    style: "implement",
    language: "html",
    prompt: "Write a nested list.",
  },
];

const graded: GradedAnswer[] = questions.map((question) => ({
  questionId: question.id,
  groupId: question.groupId,
  type: question.type,
  response: null,
  correct: true,
  points: 10,
  maxPoints: 10,
}));

describe("student vs staff question headings", () => {
  it("hides topic titles on the student review list, including coding items", () => {
    const html = renderToStaticMarkup(
      createElement(GradedQuestionList, {
        questions,
        graded,
        revealAnswers: true,
      }),
    );
    assert.match(html, />1\.\s— Correct/);
    assert.match(html, />2\.\s— Correct/);
    assert.doesNotMatch(html, /Acronyms/);
    assert.doesNotMatch(html, /Ordered, unordered, and nested lists/);
  });

  it("keeps topic titles on the staff review list", () => {
    const html = renderToStaticMarkup(
      createElement(GradedQuestionList, {
        questions,
        graded,
        revealAnswers: true,
        showGroupTitle: true,
      }),
    );
    assert.match(html, /1\. Acronyms/);
    assert.match(html, /2\. Ordered, unordered, and nested lists/);
  });
});
