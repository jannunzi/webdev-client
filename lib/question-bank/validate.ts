import type {
  BankQuestion,
  CodingQuestion,
  FillInBlankQuestion,
  MultipleChoiceQuestion,
  QuestionBank,
  QuestionGroup,
  QuestionType,
  TrueFalseQuestion,
} from "./types";
import { CODING_LANGUAGES } from "./types";

export type BankIssue = {
  path: string;
  message: string;
};

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function issue(path: string, message: string): BankIssue {
  return { path, message };
}

function isMc(question: BankQuestion): question is MultipleChoiceQuestion {
  return question.type === "multiple_choice";
}

function isTf(question: BankQuestion): question is TrueFalseQuestion {
  return question.type === "true_false";
}

function isFib(question: BankQuestion): question is FillInBlankQuestion {
  return question.type === "fill_in_blank";
}

function isCoding(question: BankQuestion): question is CodingQuestion {
  return question.type === "coding";
}

export function validateQuestion(
  question: BankQuestion,
  path: string,
  expectedType: QuestionType,
): BankIssue[] {
  const issues: BankIssue[] = [];
  if (!question.id || !ID_PATTERN.test(question.id)) {
    issues.push(issue(`${path}.id`, "Question id is missing or not kebab-case."));
  }
  if (!question.prompt?.trim()) {
    issues.push(issue(`${path}.prompt`, "Prompt is required."));
  }
  if (question.type !== expectedType) {
    issues.push(
      issue(
        `${path}.type`,
        `Question type ${question.type} does not match group type ${expectedType}.`,
      ),
    );
  }

  if (isMc(question)) {
    if (!question.choices || question.choices.length < 2) {
      issues.push(issue(`${path}.choices`, "Multiple choice needs at least two choices."));
    } else {
      const choiceIds = new Set<string>();
      for (const choice of question.choices) {
        if (!choice.id || !choice.text?.trim()) {
          issues.push(issue(`${path}.choices`, "Each choice needs id and text."));
        }
        if (choiceIds.has(choice.id)) {
          issues.push(issue(`${path}.choices`, `Duplicate choice id ${choice.id}.`));
        }
        choiceIds.add(choice.id);
      }
      if (!question.correctChoiceId || !choiceIds.has(question.correctChoiceId)) {
        issues.push(
          issue(`${path}.correctChoiceId`, "correctChoiceId must match a choice id."),
        );
      }
    }
  }

  if (isTf(question) && typeof question.answer !== "boolean") {
    issues.push(issue(`${path}.answer`, "True/false questions need a boolean answer."));
  }

  if (isFib(question)) {
    if (!Number.isInteger(question.blankCount) || question.blankCount < 1) {
      issues.push(issue(`${path}.blankCount`, "blankCount must be an integer >= 1."));
    }
    if (!question.acceptedCombinations?.length) {
      issues.push(
        issue(`${path}.acceptedCombinations`, "At least one accepted combination is required."),
      );
    } else {
      question.acceptedCombinations.forEach((combo, index) => {
        if (combo.length !== question.blankCount) {
          issues.push(
            issue(
              `${path}.acceptedCombinations[${index}]`,
              `Combination length ${combo.length} !== blankCount ${question.blankCount}.`,
            ),
          );
        }
        const allEmpty = combo.every((value) => value.trim() === "");
        if (allEmpty) {
          issues.push(
            issue(
              `${path}.acceptedCombinations[${index}]`,
              "A combination cannot be entirely empty.",
            ),
          );
        }
      });
    }
  }

  if (isCoding(question)) {
    if (!(CODING_LANGUAGES as readonly string[]).includes(question.language)) {
      issues.push(issue(`${path}.language`, "Coding language is not supported."));
    }
    if (question.style !== "fib" && question.style !== "implement") {
      issues.push(issue(`${path}.style`, "Coding style must be fib or implement."));
    }
    if (!question.referenceSolution?.trim()) {
      issues.push(issue(`${path}.referenceSolution`, "Reference solution is required."));
    } else if (question.referenceSolution.split("\n").length > 14) {
      issues.push(
        issue(`${path}.referenceSolution`, "Reference solution should stay at 14 lines or fewer."),
      );
    }
    if (!question.rubric?.trim()) {
      issues.push(issue(`${path}.rubric`, "Grading rubric is required."));
    }
    if (question.style === "fib") {
      if (!Number.isInteger(question.blankCount) || (question.blankCount ?? 0) < 1) {
        issues.push(issue(`${path}.blankCount`, "FIB coding items need blankCount >= 1."));
      }
      if (!question.acceptedBlanks?.length) {
        issues.push(issue(`${path}.acceptedBlanks`, "FIB coding items need accepted blanks."));
      } else {
        question.acceptedBlanks.forEach((combo, index) => {
          if (combo.length !== question.blankCount) {
            issues.push(
              issue(
                `${path}.acceptedBlanks[${index}]`,
                `Combination length ${combo.length} !== blankCount ${question.blankCount}.`,
              ),
            );
          }
        });
      }
      const markers = (question.code ?? "").match(/_{3,}/g)?.length ?? 0;
      if (question.blankCount && markers !== question.blankCount) {
        issues.push(
          issue(
            `${path}.code`,
            `Template has ${markers} blanks; blankCount is ${question.blankCount}.`,
          ),
        );
      }
    }
  }

  return issues;
}

export function validateGroup(group: QuestionGroup, path: string): BankIssue[] {
  const issues: BankIssue[] = [];
  if (!group.id || !ID_PATTERN.test(group.id)) {
    issues.push(issue(`${path}.id`, "Group id is missing or not kebab-case."));
  }
  if (!group.name?.trim()) {
    issues.push(issue(`${path}.name`, "Group name is required."));
  }
  if (!group.skill?.trim()) {
    issues.push(issue(`${path}.skill`, "Group skill is required."));
  }
  if (!group.section?.trim()) {
    issues.push(issue(`${path}.section`, "Group section is required."));
  }
  const minQuestions = group.type === "coding" ? 3 : 8;
  const maxQuestions = group.type === "coding" ? 8 : 14;
  if (!Array.isArray(group.questions) || group.questions.length < minQuestions) {
    issues.push(
      issue(
        `${path}.questions`,
        `Each ${group.type === "coding" ? "coding pool" : "group"} should have at least ${minQuestions} questions/variants.`,
      ),
    );
  }
  if (group.questions.length > maxQuestions) {
    issues.push(
      issue(
        `${path}.questions`,
        `Each ${group.type === "coding" ? "coding pool" : "group"} should stay manageable (${maxQuestions} or fewer).`,
      ),
    );
  }

  const questionIds = new Set<string>();
  group.questions.forEach((question, index) => {
    issues.push(
      ...validateQuestion(question, `${path}.questions[${index}]`, group.type),
    );
    if (questionIds.has(question.id)) {
      issues.push(issue(`${path}.questions`, `Duplicate question id ${question.id}.`));
    }
    questionIds.add(question.id);
  });

  return issues;
}

export function validateBank(bank: QuestionBank): BankIssue[] {
  const issues: BankIssue[] = [];
  if (!bank.id || !ID_PATTERN.test(bank.id)) {
    issues.push(issue("id", "Bank id is missing or not kebab-case."));
  }
  if (!bank.title?.trim()) {
    issues.push(issue("title", "Bank title is required."));
  }
  if (bank.groups.length !== 16) {
    issues.push(issue("groups", `Expected 16 groups; found ${bank.groups.length}.`));
  }

  const groupIds = new Set<string>();
  const questionIds = new Set<string>();
  bank.groups.forEach((group, index) => {
    issues.push(...validateGroup(group, `groups[${index}]`));
    if (group.chapter !== bank.chapter) {
      issues.push(
        issue(`groups[${index}].chapter`, "Group chapter must match the bank chapter."),
      );
    }
    if (group.order !== index + 1) {
      issues.push(
        issue(`groups[${index}].order`, `Expected order ${index + 1} in chapter sequence.`),
      );
    }
    if (groupIds.has(group.id)) {
      issues.push(issue("groups", `Duplicate group id ${group.id}.`));
    }
    groupIds.add(group.id);
    for (const question of group.questions) {
      if (questionIds.has(question.id)) {
        issues.push(issue("questions", `Duplicate question id ${question.id}.`));
      }
      questionIds.add(question.id);
    }
  });

  return issues;
}

export function assertBankValid(bank: QuestionBank): void {
  const issues = validateBank(bank);
  if (issues.length > 0) {
    const details = issues.map((item) => `${item.path}: ${item.message}`).join("\n");
    throw new Error(`Question bank is invalid:\n${details}`);
  }
}

/** Coding topic pools are not part of the 16-group traditional bank. */
export function validateCodingPool(bank: QuestionBank): BankIssue[] {
  const issues: BankIssue[] = [];
  if (!bank.id || !ID_PATTERN.test(bank.id)) {
    issues.push(issue("id", "Bank id is missing or not kebab-case."));
  }
  if (bank.groups.length < 2) {
    issues.push(issue("groups", "Coding pool needs a FIB group and an implement group."));
  }
  const groupIds = new Set<string>();
  const questionIds = new Set<string>();
  const styles = new Set<string>();
  bank.groups.forEach((group, index) => {
    if (group.type !== "coding") {
      issues.push(
        issue(`groups[${index}].type`, "Coding pool groups must have type coding."),
      );
    }
    issues.push(...validateGroup(group, `groups[${index}]`));
    if (group.chapter !== bank.chapter) {
      issues.push(
        issue(`groups[${index}].chapter`, "Group chapter must match the bank chapter."),
      );
    }
    if (groupIds.has(group.id)) {
      issues.push(issue("groups", `Duplicate group id ${group.id}.`));
    }
    groupIds.add(group.id);
    for (const question of group.questions) {
      if (question.type === "coding") styles.add(question.style);
      if (questionIds.has(question.id)) {
        issues.push(issue("questions", `Duplicate question id ${question.id}.`));
      }
      questionIds.add(question.id);
    }
  });
  if (!styles.has("fib") || !styles.has("implement")) {
    issues.push(
      issue("groups", "Each coding pool must include both a fib and an implement style."),
    );
  }
  return issues;
}

export function bankStats(bank: QuestionBank) {
  const byType: Record<QuestionType, { groups: number; questions: number }> = {
    multiple_choice: { groups: 0, questions: 0 },
    true_false: { groups: 0, questions: 0 },
    fill_in_blank: { groups: 0, questions: 0 },
    coding: { groups: 0, questions: 0 },
  };
  for (const group of bank.groups) {
    byType[group.type].groups += 1;
    byType[group.type].questions += group.questions.length;
  }
  return {
    groups: bank.groups.length,
    questions: bank.groups.reduce((sum, group) => sum + group.questions.length, 0),
    byType,
    perGroup: bank.groups.map((group) => ({
      id: group.id,
      name: group.name,
      type: group.type,
      count: group.questions.length,
    })),
  };
}
