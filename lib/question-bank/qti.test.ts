import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CHAPTER1_BANK } from "./q1";
import {
  pointsPerItem,
  promptToHtml,
  qtiGroupIdent,
  qtiItemIdent,
  renderCanvasAssessmentMeta,
  renderCanvasQtiAssessment,
  renderQtiItem,
} from "./qti";
import { acronymFib, fib, mc, tf } from "./builders";

describe("Canvas QTI serializer", () => {
  it("emits Canvas non_cc question groups that pick one item", () => {
    const xml = renderCanvasQtiAssessment(CHAPTER1_BANK, "gwebdev_q1_fallback");
    assert.match(xml, /<questestinterop xmlns="http:\/\/www\.imsglobal\.org\/xsd\/ims_qtiasiv1p2"/);
    assert.match(xml, /ident="gwebdev_q1_fallback"/);
    assert.match(xml, /<section ident="root_section">/);
    assert.match(xml, /<selection_number>1<\/selection_number>/);
    assert.match(xml, /<points_per_item>6\.25<\/points_per_item>/);
    assert.match(xml, /<fieldentry>multiple_choice_question<\/fieldentry>/);
    assert.match(xml, /<fieldentry>true_false_question<\/fieldentry>/);
    assert.match(xml, /<fieldentry>fill_in_multiple_blanks_question<\/fieldentry>/);
    assert.match(xml, /<fieldentry>short_answer_question<\/fieldentry>/);
    assert.equal((xml.match(/<section ident="g/g) ?? []).length, 16);
    assert.doesNotMatch(xml, /Kambaz|Lab [0-9]|\/labs\b|wd-/);
  });

  it("turns multi-blank acronyms into Canvas [blankN] tokens", () => {
    const question = acronymFib(
      "q1-g01-01",
      "HTML",
      ["Hyper", "Text", "Markup", "Language"],
      "HTML is HyperText Markup Language.",
    );
    assert.match(question.prompt, /___1___ ___2___ ___3___ ___4___/);
    const xml = renderQtiItem(question, "6.25");
    assert.match(xml, /\[blank1\]/);
    assert.match(xml, /\[blank4\]/);
    assert.match(xml, /response_blank1/);
    assert.match(xml, />Hyper</);
    assert.doesNotMatch(xml, /___1___/);
    assert.doesNotMatch(xml, /\[blank1\]1/);
  });

  it("puts paragraph preview blocks after a “below” stem", () => {
    const group = CHAPTER1_BANK.groups.find((item) => item.id === "q1-g03-paragraphs");
    const question = group?.questions[0];
    assert.ok(question && question.type === "multiple_choice");
    const html = promptToHtml(question.prompt, question.code, question.preview);
    const belowAt = html.indexOf("The three blocks below");
    const firstBlock = question.preview?.kind === "paragraphs" ? question.preview.blocks[0] : "";
    const blockAt = html.indexOf(firstBlock ?? "");
    assert.ok(belowAt >= 0 && blockAt > belowAt);
  });

  it("emits pretty-printed nested-list choices as pre/code, not a prefixed first line", () => {
    const group = CHAPTER1_BANK.groups.find((item) => item.id === "q1-g05-lists");
    const question = group?.questions.find((item) => item.id === "q1-g05-08");
    assert.ok(question && question.type === "multiple_choice");
    const xml = renderQtiItem(question, "6.25");
    assert.match(xml, /&lt;pre&gt;&lt;code&gt;/);
    assert.match(xml, /&amp;lt;ul&amp;gt;\n  &amp;lt;li&amp;gt;/);
  });

  it("serializes MC, T/F, and single-blank FIB", () => {
    const mcXml = renderQtiItem(
      mc("demo-mc", "Which tag is a paragraph?", ["<div>", "<p>", "<span>", "<li>"], 1),
      "10",
    );
    assert.match(mcXml, /multiple_choice_question/);
    assert.match(mcXml, /<varequal respident="response1">b<\/varequal>/);

    const tfXml = renderQtiItem(
      tf("demo-tf", "HTML has six heading levels.", true),
      "10",
    );
    assert.match(tfXml, /true_false_question/);
    assert.match(tfXml, /<varequal respident="response1">true<\/varequal>/);

    const fibXml = renderQtiItem(
      fib("demo-fib", "Wrap prose in the HTML _____ element.", ["p", "paragraph"]),
      "10",
    );
    assert.match(fibXml, /short_answer_question/);
    assert.match(fibXml, /case="No"/);
    assert.match(fibXml, />paragraph</);
  });

  it("escapes HTML in prompts and writes Canvas assessment_meta", () => {
    assert.match(promptToHtml("Use `<p>` tags."), /<code>&lt;p&gt;<\/code>/);
    const meta = renderCanvasAssessmentMeta({
      ident: "gwebdev_q1_fallback",
      title: "Q1 — HTML",
      descriptionHtml: "<p>Take Q1 on the course site.</p>",
      unlockAt: "2026-09-28T00:00:00",
      dueAt: "2026-10-04T23:59:00",
      lockAt: "2026-10-04T23:59:00",
    });
    assert.match(meta, /xmlns="http:\/\/canvas\.instructure\.com\/xsd\/cccv1p0"/);
    assert.match(meta, /&lt;p&gt;Take Q1 on the course site\./);
    assert.match(meta, /<workflow_state>unpublished<\/workflow_state>/);
    assert.match(meta, /<points_possible>100\.0<\/points_possible>/);
    assert.equal(pointsPerItem(16), "6.25");
    assert.equal(pointsPerItem(10), "10");
    assert.equal(pointsPerItem(36), "2.7778");
    assert.equal(qtiItemIdent("q1-g01-01"), "gq1-g01-01");
    assert.equal(qtiGroupIdent("q1-g01-acronyms"), "gq1-g01-acronyms");
  });

  it("writes time_limit minutes on Canvas assessment_meta when set", () => {
    const meta = renderCanvasAssessmentMeta({
      ident: "gwebdev_q1_fallback",
      title: "Q1 — HTML",
      descriptionHtml: "<p>Take Q1 on the course site.</p>",
      timeLimitMinutes: 30,
    });
    assert.match(meta, /<time_limit>30<\/time_limit>/);
    const exam = renderCanvasAssessmentMeta({
      ident: "gwebdev_x1_fallback",
      title: "X1 — Midterm",
      descriptionHtml: "<p>Take X1 on the course site.</p>",
      timeLimitMinutes: 90,
    });
    assert.match(exam, /<time_limit>90<\/time_limit>/);
  });
});
