import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { cs5500AiSection } from "./cs5500-ai-strategies.ts";

describe("CS5500 AI strategy proposals", () => {
  it("covers each software engineering topic with two or three suggestions", () => {
    assert.equal(cs5500AiSection.status, "proposals");
    assert.equal(cs5500AiSection.title, "Bringing AI into the CS5500 topics");
    assert.match(cs5500AiSection.lede, /not assignments/i);
    assert.deepEqual(
      cs5500AiSection.topics.map((topic) => topic.title),
      [
        "Requirements and user stories",
        "Design and architecture",
        "Code review",
        "Testing (unit, property-based, and test generation)",
        "Debugging",
        "Refactoring and legacy code",
        "Version control and CI/CD",
        "Teamwork and process (agile)",
        "Documentation",
        "Security and quality",
        "Ethics, licensing, and responsible AI use",
      ],
    );
    for (const topic of cs5500AiSection.topics) {
      assert.ok(topic.suggestions.length >= 2 && topic.suggestions.length <= 3, topic.id);
      for (const suggestion of topic.suggestions) {
        assert.ok(suggestion.trim().length > 0);
        assert.equal(suggestion.includes("\n"), false);
      }
    }
  });

  it("includes prompt critiques, AI-off comparisons, and tests as assessment ideas", () => {
    const text = cs5500AiSection.assessments.join(" ");
    assert.match(text, /prompt/i);
    assert.match(text, /transcript/i);
    assert.match(text, /AI off/i);
    assert.match(text, /AI on/i);
    assert.match(text, /tests/i);
    assert.ok(cs5500AiSection.assessments.length >= 3);
  });

  it("renders the proposals section on the CS5500 page", () => {
    const page = readFileSync(join(process.cwd(), "app/cs5500/page.tsx"), "utf8");
    const view = readFileSync(
      join(process.cwd(), "app/cs5500/Cs5500AiStrategies.tsx"),
      "utf8",
    );
    assert.match(page, /Cs5500AiStrategies/);
    assert.match(view, /id="wd-cs5500-ai"/);
    assert.match(view, /Proposals/);
    assert.match(view, /cs5500AiSection/);
    assert.match(view, /Assessment ideas/);
  });
});
