/**
 * Canvas Classic Quiz QTI 1.2 (non-CC / `non_cc_assessments` shape).
 *
 * Matches `instructure/canvas-lms` `lib/cc/qti/qti_generator.rb` +
 * `qti_items.rb`: `questestinterop` → `assessment` → `root_section` →
 * per-topic `section` with `selection_ordering` (pick 1) → `item`.
 *
 * Common Cartridge `assessment_qti.xml` cannot express question groups
 * (one section only). Emit this full-fidelity file as
 * `non_cc_assessments/<ident>.xml.qti` so Canvas restores groups.
 */

import { parsePromptMarkup } from "./prompt-markup";
import { QTI_ITEM_TYPE } from "./types";
import type {
  BankQuestion,
  FillInBlankQuestion,
  MultipleChoiceQuestion,
  QuestionBank,
  QuestionGroup,
  TrueFalseQuestion,
} from "./types";

const QTI_NS = "http://www.imsglobal.org/xsd/ims_qtiasiv1p2";
const QTI_XSD = "http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd";
const CANVAS_NS = "http://canvas.instructure.com/xsd/cccv1p0";
const CANVAS_XSD = "https://canvas.instructure.com/xsd/cccv1p0.xsd";

export type CanvasAssessmentMetaInput = {
  ident: string;
  title: string;
  descriptionHtml: string;
  unlockAt?: string;
  dueAt?: string;
  lockAt?: string;
  pointsPossible?: number;
  allowedAttempts?: number;
};

export function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function pointsPerItem(groupCount: number): string {
  if (groupCount <= 0) return "0";
  const raw = 100 / groupCount;
  if (Number.isInteger(raw)) return String(raw);
  return raw.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}

export function qtiItemIdent(questionId: string): string {
  return `g${questionId.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
}

export function qtiGroupIdent(groupId: string): string {
  return `g${groupId.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
}

export function promptToHtml(prompt: string, code?: string): string {
  const inline = parsePromptMarkup(prompt)
    .map((part) =>
      part.type === "code"
        ? `<code>${escapeXml(part.value)}</code>`
        : escapeXml(part.value),
    )
    .join("");
  const snippet = code
    ? `<pre><code>${escapeXml(code)}</code></pre>`
    : "";
  return `<div>${snippet}<p>${inline}</p></div>`;
}

function metaField(label: string, entry: string): string {
  return [
    "          <qtimetadatafield>",
    `            <fieldlabel>${escapeXml(label)}</fieldlabel>`,
    `            <fieldentry>${escapeXml(entry)}</fieldentry>`,
    "          </qtimetadatafield>",
  ].join("\n");
}

function mattextHtml(html: string, indent: string): string {
  return `${indent}<mattext texttype="text/html">${escapeXml(html)}</mattext>`;
}

function mattextPlain(text: string, indent: string): string {
  return `${indent}<mattext texttype="text/plain">${escapeXml(text)}</mattext>`;
}

function replaceBlanks(prompt: string, blankCount: number): string {
  let remaining = blankCount;
  const withTokens = prompt.replace(/_{3,}/g, () => {
    if (remaining <= 0) return "_____";
    const index = blankCount - remaining + 1;
    remaining -= 1;
    return `[blank${index}]`;
  });
  if (remaining === 0) return withTokens;
  const extras = Array.from(
    { length: remaining },
    (_, index) => `[blank${blankCount - remaining + index + 1}]`,
  ).join(" ");
  return `${withTokens} ${extras}`.trim();
}

function uniqueBlankAnswers(
  question: FillInBlankQuestion,
): string[][] {
  return Array.from({ length: question.blankCount }, (_, blankIndex) => {
    const seen = new Set<string>();
    const values: string[] = [];
    for (const combo of question.acceptedCombinations) {
      const value = combo[blankIndex]?.trim() ?? "";
      const key = value.toLowerCase();
      if (!value || seen.has(key)) continue;
      seen.add(key);
      values.push(value);
    }
    return values;
  });
}

function renderMultipleChoice(
  question: MultipleChoiceQuestion,
  points: string,
): string {
  const html = promptToHtml(question.prompt, question.code);
  const labels = question.choices
    .map((choice) =>
      [
        `          <response_label ident="${escapeXml(choice.id)}">`,
        "            <material>",
        mattextHtml(`<p>${escapeXml(choice.text)}</p>`, "              "),
        "            </material>",
        "          </response_label>",
      ].join("\n"),
    )
    .join("\n");
  return [
    `    <item ident="${qtiItemIdent(question.id)}" title="${escapeXml(question.id)}">`,
    "      <itemmetadata>",
    "        <qtimetadata>",
    metaField("question_type", QTI_ITEM_TYPE.multiple_choice),
    metaField("points_possible", points),
    metaField(
      "original_answer_ids",
      question.choices.map((choice) => choice.id).join(","),
    ),
    "        </qtimetadata>",
    "      </itemmetadata>",
    "      <presentation>",
    "        <material>",
    mattextHtml(html, "          "),
    "        </material>",
    `        <response_lid ident="response1" rcardinality="Single">`,
    "          <render_choice>",
    labels,
    "          </render_choice>",
    "        </response_lid>",
    "      </presentation>",
    "      <resprocessing>",
    "        <outcomes>",
    `          <decvar maxvalue="100" minvalue="0" varname="SCORE" vartype="Decimal"/>`,
    "        </outcomes>",
    `        <respcondition continue="No">`,
    "          <conditionvar>",
    `            <varequal respident="response1">${escapeXml(question.correctChoiceId)}</varequal>`,
    "          </conditionvar>",
    `          <setvar action="Set" varname="SCORE">100</setvar>`,
    "        </respcondition>",
    "      </resprocessing>",
    "    </item>",
  ].join("\n");
}

function renderTrueFalse(question: TrueFalseQuestion, points: string): string {
  const html = promptToHtml(question.prompt, question.code);
  const correct = question.answer ? "true" : "false";
  return [
    `    <item ident="${qtiItemIdent(question.id)}" title="${escapeXml(question.id)}">`,
    "      <itemmetadata>",
    "        <qtimetadata>",
    metaField("question_type", QTI_ITEM_TYPE.true_false),
    metaField("points_possible", points),
    metaField("original_answer_ids", "true,false"),
    "        </qtimetadata>",
    "      </itemmetadata>",
    "      <presentation>",
    "        <material>",
    mattextHtml(html, "          "),
    "        </material>",
    `        <response_lid ident="response1" rcardinality="Single">`,
    "          <render_choice>",
    "          <response_label ident=\"true\">",
    "            <material>",
    mattextPlain("True", "              "),
    "            </material>",
    "          </response_label>",
    "          <response_label ident=\"false\">",
    "            <material>",
    mattextPlain("False", "              "),
    "            </material>",
    "          </response_label>",
    "          </render_choice>",
    "        </response_lid>",
    "      </presentation>",
    "      <resprocessing>",
    "        <outcomes>",
    `          <decvar maxvalue="100" minvalue="0" varname="SCORE" vartype="Decimal"/>`,
    "        </outcomes>",
    `        <respcondition continue="No">`,
    "          <conditionvar>",
    `            <varequal respident="response1">${correct}</varequal>`,
    "          </conditionvar>",
    `          <setvar action="Set" varname="SCORE">100</setvar>`,
    "        </respcondition>",
    "      </resprocessing>",
    "    </item>",
  ].join("\n");
}

function renderShortAnswer(question: FillInBlankQuestion, points: string): string {
  const html = promptToHtml(question.prompt, question.code);
  const answers = uniqueBlankAnswers(question)[0] ?? [];
  const equals = answers
    .map(
      (answer) =>
        `            <varequal respident="response1" case="No">${escapeXml(answer)}</varequal>`,
    )
    .join("\n");
  return [
    `    <item ident="${qtiItemIdent(question.id)}" title="${escapeXml(question.id)}">`,
    "      <itemmetadata>",
    "        <qtimetadata>",
    metaField("question_type", "short_answer_question"),
    metaField("points_possible", points),
    metaField("original_answer_ids", answers.map((_, index) => String(index + 1)).join(",")),
    "        </qtimetadata>",
    "      </itemmetadata>",
    "      <presentation>",
    "        <material>",
    mattextHtml(html, "          "),
    "        </material>",
    `        <response_str ident="response1" rcardinality="Single">`,
    `          <render_fib>`,
    `            <response_label ident="answer1" rshuffle="No"/>`,
    "          </render_fib>",
    "        </response_str>",
    "      </presentation>",
    "      <resprocessing>",
    "        <outcomes>",
    `          <decvar maxvalue="100" minvalue="0" varname="SCORE" vartype="Decimal"/>`,
    "        </outcomes>",
    `        <respcondition continue="No">`,
    "          <conditionvar>",
    equals,
    "          </conditionvar>",
    `          <setvar action="Set" varname="SCORE">100</setvar>`,
    "        </respcondition>",
    "      </resprocessing>",
    "    </item>",
  ].join("\n");
}

function renderMultipleBlanks(question: FillInBlankQuestion, points: string): string {
  const html = promptToHtml(replaceBlanks(question.prompt, question.blankCount), question.code);
  const perBlank = uniqueBlankAnswers(question);
  const blankScore = (100 / question.blankCount).toFixed(2);
  const lids = perBlank
    .map((answers, blankIndex) => {
      const blankId = `blank${blankIndex + 1}`;
      const labels = answers
        .map((answer, answerIndex) => {
          const ident = `${qtiItemIdent(question.id)}_${blankId}_${answerIndex}`;
          return [
            `          <response_label ident="${ident}">`,
            "            <material>",
            mattextPlain(answer, "              "),
            "            </material>",
            "          </response_label>",
          ].join("\n");
        })
        .join("\n");
      return [
        `        <response_lid ident="response_${blankId}">`,
        "          <material>",
        mattextPlain(blankId, "            "),
        "          </material>",
        "          <render_choice>",
        labels,
        "          </render_choice>",
        "        </response_lid>",
      ].join("\n");
    })
    .join("\n");
  const conditions = perBlank
    .map((answers, blankIndex) => {
      const blankId = `blank${blankIndex + 1}`;
      const equals = answers
        .map((answer, answerIndex) => {
          const ident = `${qtiItemIdent(question.id)}_${blankId}_${answerIndex}`;
          return `              <varequal respident="response_${blankId}">${ident}</varequal>`;
        })
        .join("\n");
      const inner =
        answers.length > 1
          ? `            <or>\n${equals}\n            </or>`
          : equals;
      return [
        "        <respcondition>",
        "          <conditionvar>",
        inner,
        "          </conditionvar>",
        `          <setvar action="Add" varname="SCORE">${blankScore}</setvar>`,
        "        </respcondition>",
      ].join("\n");
    })
    .join("\n");
  const answerIds = perBlank
    .flatMap((answers, blankIndex) =>
      answers.map(
        (_, answerIndex) =>
          `${qtiItemIdent(question.id)}_blank${blankIndex + 1}_${answerIndex}`,
      ),
    )
    .join(",");
  return [
    `    <item ident="${qtiItemIdent(question.id)}" title="${escapeXml(question.id)}">`,
    "      <itemmetadata>",
    "        <qtimetadata>",
    metaField("question_type", QTI_ITEM_TYPE.fill_in_blank),
    metaField("points_possible", points),
    metaField("original_answer_ids", answerIds),
    "        </qtimetadata>",
    "      </itemmetadata>",
    "      <presentation>",
    "        <material>",
    mattextHtml(html, "          "),
    "        </material>",
    lids,
    "      </presentation>",
    "      <resprocessing>",
    "        <outcomes>",
    `          <decvar maxvalue="100" minvalue="0" varname="SCORE" vartype="Decimal"/>`,
    "        </outcomes>",
    conditions,
    "      </resprocessing>",
    "    </item>",
  ].join("\n");
}

export function renderQtiItem(question: BankQuestion, points: string): string {
  if (question.type === "multiple_choice") {
    return renderMultipleChoice(question, points);
  }
  if (question.type === "true_false") {
    return renderTrueFalse(question, points);
  }
  if (question.blankCount > 1) {
    return renderMultipleBlanks(question, points);
  }
  return renderShortAnswer(question, points);
}

export function renderQtiGroup(group: QuestionGroup, points: string): string {
  const items = group.questions
    .map((question) => renderQtiItem(question, points))
    .join("\n");
  return [
    `    <section ident="${qtiGroupIdent(group.id)}" title="${escapeXml(group.name)}">`,
    "      <selection_ordering>",
    "        <selection>",
    "          <selection_number>1</selection_number>",
    "          <selection_extension>",
    `            <points_per_item>${escapeXml(points)}</points_per_item>`,
    "          </selection_extension>",
    "        </selection>",
    "      </selection_ordering>",
    items,
    "    </section>",
  ].join("\n");
}

export function renderCanvasQtiAssessment(
  bank: QuestionBank,
  ident: string,
  title = bank.title,
): string {
  const points = pointsPerItem(bank.groups.length);
  const groups = bank.groups.map((group) => renderQtiGroup(group, points)).join("\n");
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<questestinterop xmlns="${QTI_NS}" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="${QTI_NS} ${QTI_XSD}">`,
    `  <assessment ident="${escapeXml(ident)}" title="${escapeXml(title)}">`,
    "    <qtimetadata>",
    "      <qtimetadatafield>",
    "        <fieldlabel>cc_maxattempts</fieldlabel>",
    "        <fieldentry>1</fieldentry>",
    "      </qtimetadatafield>",
    "    </qtimetadata>",
    `    <section ident="root_section">`,
    groups,
    "    </section>",
    "  </assessment>",
    "</questestinterop>",
    "",
  ].join("\n");
}

export function renderCanvasAssessmentMeta(input: CanvasAssessmentMetaInput): string {
  const points = (input.pointsPossible ?? 100).toFixed(1);
  const attempts = String(input.allowedAttempts ?? 1);
  const assignmentIdent = `${input.ident}_assignment`;
  const date = (value: string | undefined, tag: string): string =>
    value ? `  <${tag}>${escapeXml(value)}</${tag}>\n` : "";
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<quiz identifier="${escapeXml(input.ident)}" xmlns="${CANVAS_NS}" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="${CANVAS_NS} ${CANVAS_XSD}">`,
    `  <title>${escapeXml(input.title)}</title>`,
    `  <description>${escapeXml(input.descriptionHtml)}</description>`,
    date(input.unlockAt, "unlock_at"),
    date(input.dueAt, "due_at"),
    date(input.lockAt, "lock_at"),
    "  <shuffle_answers>true</shuffle_answers>",
    "  <scoring_policy>keep_highest</scoring_policy>",
    "  <hide_results>always</hide_results>",
    "  <quiz_type>assignment</quiz_type>",
    `  <points_possible>${points}</points_possible>`,
    "  <require_lockdown_browser>false</require_lockdown_browser>",
    `  <allowed_attempts>${escapeXml(attempts)}</allowed_attempts>`,
    "  <one_question_at_a_time>false</one_question_at_a_time>",
    "  <cant_go_back>false</cant_go_back>",
    "  <available>false</available>",
    "  <show_correct_answers>false</show_correct_answers>",
    "  <anonymous_submissions>false</anonymous_submissions>",
    "  <could_be_locked>false</could_be_locked>",
    `  <assignment identifier="${escapeXml(assignmentIdent)}">`,
    `    <title>${escapeXml(input.title)}</title>`,
    input.unlockAt ? `    <unlock_at>${escapeXml(input.unlockAt)}</unlock_at>\n` : "",
    input.dueAt ? `    <due_at>${escapeXml(input.dueAt)}</due_at>\n` : "",
    input.lockAt ? `    <lock_at>${escapeXml(input.lockAt)}</lock_at>\n` : "",
    `    <quiz_identifierref>${escapeXml(input.ident)}</quiz_identifierref>`,
    "    <workflow_state>unpublished</workflow_state>",
    `    <points_possible>${points}</points_possible>`,
    "    <grading_type>points</grading_type>",
    "    <submission_types>online_quiz</submission_types>",
    "    <position>1</position>",
    "  </assignment>",
    "</quiz>",
    "",
  ]
    .join("\n")
    .replaceAll("\n\n", "\n");
}

export function renderQtiPackageManifest(
  quizzes: Array<{ ident: string; href: string; title: string }>,
): string {
  const resources = quizzes
    .map(
      (quiz) =>
        [
          `    <resource identifier="${escapeXml(quiz.ident)}" type="imsqti_xmlv1p2" href="${escapeXml(quiz.href)}">`,
          `      <file href="${escapeXml(quiz.href)}"/>`,
          "    </resource>",
        ].join("\n"),
    )
    .join("\n");
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<manifest identifier="gwebdev_canvas_fallback_qti" xmlns="http://www.imsglobal.org/xsd/imsccv1p1/imscp_v1p1" xmlns:lom="http://ltsc.ieee.org/xsd/imsccv1p1/LOM/resource" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">`,
    "  <metadata>",
    "    <schema>IMS Content</schema>",
    "    <schemaversion>1.1.3</schemaversion>",
    "  </metadata>",
    "  <organizations/>",
    "  <resources>",
    resources,
    "  </resources>",
    "</manifest>",
    "",
  ].join("\n");
}
