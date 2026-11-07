import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { handleAiSuggestRequest } from "../../../../lib/inline-edit/ai-suggest.ts";
import { createRateLimit } from "../../../../lib/inline-edit/rate-limit.ts";

function request(body: unknown) {
  return new Request("http://localhost/api/staff/ai-suggest", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/staff/ai-suggest", () => {
  it("rejects a caller who is not staff", async () => {
    let called = false;
    const response = await handleAiSuggestRequest(request({ mode: "improve", text: "Hi", maskCount: 0 }), {
      staff: { error: "Staff only.", status: 403 },
      generate: async () => {
        called = true;
        return "Hi.";
      },
    });
    assert.equal(response.status, 403);
    assert.equal(called, false);
  });

  it("returns an improved passage only when placeholders survive", async () => {
    const response = await handleAiSuggestRequest(
      request({ mode: "improve", text: "Use ⟦0⟧ today", maskCount: 1 }),
      {
        staff: { email: "staff@example.com" },
        generate: async () => "Use ⟦0⟧ carefully.",
      },
    );
    assert.equal(response.status, 200);
    const body = (await response.json()) as { text: string };
    assert.equal(body.text, "Use ⟦0⟧ carefully.");

    const dropped = await handleAiSuggestRequest(
      request({ mode: "improve", text: "Use ⟦0⟧ today", maskCount: 1 }),
      {
        staff: { email: "staff@example.com" },
        generate: async () => "Use it carefully.",
      },
    );
    assert.equal(dropped.status, 422);
  });

  it("returns one continuation sentence", async () => {
    const response = await handleAiSuggestRequest(
      request({ mode: "continue", text: "The browser paints the page.", maskCount: 0 }),
      {
        staff: { email: "staff@example.com" },
        generate: async () => "CSS then sets the color. A second sentence.",
      },
    );
    assert.equal(response.status, 200);
    const body = (await response.json()) as { text: string };
    assert.equal(body.text, "CSS then sets the color.");
  });

  it("completes from the caret using the text before and after it", async () => {
    let prompt = "";
    const response = await handleAiSuggestRequest(
      request({
        mode: "continue",
        before: "The brow",
        after: "for the people who use it.",
        maskCount: 0,
      }),
      {
        staff: { email: "staff@example.com" },
        generate: async (input) => {
          prompt = input.prompt;
          return "ser paints the page. for the people who use it.";
        },
      },
    );
    assert.match(prompt, /BEFORE:\nThe brow\n\nAFTER:\nfor the people who use it\./);
    assert.equal(response.status, 200);
    const body = (await response.json()) as { text: string };
    assert.equal(body.text, "ser paints the page.");
  });

  it("does not treat a prose sentence as an instruction", async () => {
    let system = "";
    let structured = false;
    const response = await handleAiSuggestRequest(
      request({
        mode: "improve",
        text: "Create a list of terms introduced in this section",
        maskCount: 0,
      }),
      {
        staff: { email: "staff@example.com" },
        generate: async (input) => {
          system = input.system;
          structured = input.structured === true;
          return "Create a list of terms introduced in this section.";
        },
      },
    );
    assert.equal(response.status, 200);
    assert.equal(structured, false);
    assert.match(system, /Fix typos/);
    assert.doesNotMatch(system, /INSTRUCTION/);
    const body = (await response.json()) as { text?: string; blocks?: unknown };
    assert.equal(body.blocks, undefined);
    assert.match(body.text ?? "", /Create a list of terms/);
  });

  it("returns a semantic terms list for an explicit instruction and rejects non-staff", async () => {
    let called = false;
    const denied = await handleAiSuggestRequest(
      request({
        mode: "instruct",
        instruction: "Create a list of terms introduced in this section",
        before: "The Internet uses HTML.",
        after: "",
        section: "1.1 Learning objectives",
      }),
      {
        staff: { error: "Staff only.", status: 403 },
        generate: async () => {
          called = true;
          return "<ul><li><strong>HTML</strong> — markup.</li></ul>";
        },
      },
    );
    assert.equal(denied.status, 403);
    assert.equal(called, false);

    let prompt = "";
    let sawStructured = false;
    const response = await handleAiSuggestRequest(
      request({
        mode: "instruct",
        instruction: "Create a list of terms introduced in this section",
        before: "The <a href=\"/book/terms/internet\">Internet</a> uses HTML.",
        after: "Browsers request pages.",
        section: "Networks",
      }),
      {
        staff: { email: "staff@example.com" },
        generate: async (input) => {
          prompt = input.prompt;
          sawStructured = input.structured === true;
          return "- **Internet** — a global network.\n- **HTML** — the markup language.";
        },
      },
    );
    assert.equal(sawStructured, true);
    assert.match(prompt, /INSTRUCTION:\nCreate a list of terms introduced in this section/);
    assert.match(prompt, /BEFORE:/);
    assert.match(prompt, /⟦0⟧/);
    assert.equal(response.status, 200);
    const body = (await response.json()) as {
      blocks: { kind: string; items?: string[] }[];
    };
    assert.equal(body.blocks[0]?.kind, "ul");
    assert.match(body.blocks[0]?.items?.[0] ?? "", /<strong>Internet<\/strong>/);
    assert.match(body.blocks[0]?.items?.[1] ?? "", /<strong>HTML<\/strong>/);
    assert.doesNotMatch(JSON.stringify(body), /data-ai-instruction/);
  });

  it("asks the installed structured-output API for an instruction and rejects a non-list", async () => {
    let outputName = "";
    const response = await handleAiSuggestRequest(
      request({
        mode: "instruct",
        instruction: "Create a list of terms introduced in this section",
        section: "The web.",
      }),
      {
        staff: { email: "staff@example.com" },
        generateTextImpl: async (options) => {
          outputName = options.output && typeof options.output === "object" && "name" in options.output
            ? String(options.output.name)
            : "";
          return {
            output: {
              blocks: [
                {
                  type: "list",
                  ordered: false,
                  items: ["<strong>HTML</strong> — the markup language."],
                },
              ],
            },
          };
        },
      },
    );
    assert.equal(outputName, "object");
    assert.equal(response.status, 200);
    const body = (await response.json()) as { blocks: { kind: string; items: string[] }[] };
    assert.equal(body.blocks[0]?.kind, "ul");
    assert.match(body.blocks[0]?.items[0] ?? "", /<strong>HTML<\/strong>/);

    const prose = await handleAiSuggestRequest(
      request({
        mode: "instruct",
        instruction: "Create a list of terms introduced in this section",
        section: "The web.",
      }),
      {
        staff: { email: "staff@example.com" },
        generate: async () => "The Internet is a network.",
      },
    );
    assert.equal(prose.status, 422);
  });

  it("rate limits one staff member", async () => {
    const allow = createRateLimit(2, 60_000);
    const send = () =>
      handleAiSuggestRequest(request({ mode: "continue", text: "Done.", maskCount: 0 }), {
        staff: { email: "staff@example.com" },
        allow,
        generate: async () => "Next.",
      });
    assert.equal((await send()).status, 200);
    assert.equal((await send()).status, 200);
    assert.equal((await send()).status, 429);
  });
});