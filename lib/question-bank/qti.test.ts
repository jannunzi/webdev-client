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
    const xml = renderQtiItem(question, "6.25");
    assert.match(xml, /\[blank1\]/);
    assert.match(xml, /\[blank4\]/);
    assert.match(xml, /response_blank1/);
    assert.match(xml, />Hyper</);
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
    assert.equal(qtiItemIdent("q1-g01-01"), "gq1-g01-01");
    assert.equal(qtiGroupIdent("q1-g01-acronyms"), "gq1-g01-acronyms");
  });
});
