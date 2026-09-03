import type { BankQuestion } from "../question-bank";
import type { DrawnQuestion } from "./sample";
import type { StudentQuestion } from "./types";

export function toStudentQuestion(drawn: DrawnQuestion): StudentQuestion {
  const { group, question } = drawn;
  return {
    id: question.id,
    groupId: group.id,
    groupName: group.name,
    groupOrder: group.order,
    type: question.type,
    prompt: question.prompt,
    code: question.code,
    choices:
      question.type === "multiple_choice"
        ? question.choices.map((choice) => ({ id: choice.id, text: choice.text }))
        : undefined,
    blankCount: question.type === "fill_in_blank" ? question.blankCount : undefined,
  };
}

export function assertNoAnswerLeak(question: StudentQuestion): void {
  const blob = JSON.stringify(question);
  if (
    /correctChoiceId|acceptedCombinations|"answer":(true|false)/.test(blob)
  ) {
    throw new Error(`Student payload leaked an answer field: ${question.id}`);
  }
}

export function revealCorrectAnswer(question: BankQuestion): string {
  if (question.type === "multiple_choice") {
    const choice = question.choices.find((item) => item.id === question.correctChoiceId);
    return choice ? `${choice.id}. ${choice.text}` : question.correctChoiceId;
  }
  if (question.type === "true_false") {
    return question.answer ? "True" : "False";
  }
  return question.acceptedCombinations
    .map((combo) =>
      combo.length === 1
        ? combo[0]
        : combo.map((blank) => `[${blank === "" ? "blank" : blank}]`).join(""),
    )
    .join(" · ");
}
