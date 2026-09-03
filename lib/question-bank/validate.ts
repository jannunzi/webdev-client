import type {
  BankQuestion,
  FillInBlankQuestion,
  MultipleChoiceQuestion,
  QuestionBank,
  QuestionGroup,
  QuestionType,
  TrueFalseQuestion,
} from "./types";

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
  if (!Array.isArray(group.questions) || group.questions.length < 8) {
    issues.push(
      issue(`${path}.questions`, "Each group should have at least 8 questions/variants."),
    );
  }
  if (group.questions.length > 14) {
    issues.push(
      issue(`${path}.questions`, "Each group should stay manageable (14 or fewer)."),
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

export function bankStats(bank: QuestionBank) {
  const byType: Record<QuestionType, { groups: number; questions: number }> = {
    multiple_choice: { groups: 0, questions: 0 },
    true_false: { groups: 0, questions: 0 },
    fill_in_blank: { groups: 0, questions: 0 },
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
