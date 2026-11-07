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

  it("asks the installed structured-output API and accepts a prose instruction", async () => {
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
        instruction: "Describe the client and the server.",
        section: "The web.",
      }),
      {
        staff: { email: "staff@example.com" },
        generate: async () => "The client sends a request. The server sends a response.",
      },
    );
    assert.equal(prose.status, 200);
    const proseBody = (await prose.json()) as { blocks: { kind: string }[] };
    assert.equal(proseBody.blocks.every((block) => block.kind === "p"), true);
    assert.equal(proseBody.blocks.some((block) => block.kind !== "p"), false);
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

const CYCLE =
  "Introduce the software development cycle. list the various steps/levels, and prepare the chapter with the purpose of identifying opportunities where AI could help at each step.";

describe("software development cycle instruction", () => {
  it("accepts an introduction plus an ordered list for the reported prompt", async () => {
    let calls = 0;
    const send = () =>
      handleAiSuggestRequest(request({ mode: "instruct", instruction: CYCLE, section: "Engineering" }), {
        staff: { email: "staff@example.com" },
        generateTextImpl: async () => {
          calls += 1;
          return {
            output: {
              blocks: [
                {
                  type: "paragraph",
                  text: "The software development cycle is the sequence of work from a need to a running system.",
                },
                {
                  type: "list",
                  ordered: true,
                  items: [
                    "<strong>Requirements</strong> — name what the program must do.",
                    "<strong>Design</strong> — choose the structure. AI can compare options.",
                    "<script>alert(1)</script><strong>Implementation</strong> — write the program.",
                  ],
                },
              ],
            },
          };
        },
      });
    const first = await send();
    const second = await send();
    assert.equal(calls, 2);
    assert.equal(first.status, 200);
    assert.equal(second.status, 200);
    const body = (await first.json()) as {
      blocks: { kind: string; html?: string; items?: string[] }[];
    };
    assert.equal(body.blocks[0]?.kind, "p");
    assert.match(body.blocks[0]?.html ?? "", /software development cycle/);
    assert.equal(body.blocks[1]?.kind, "ol");
    assert.match(body.blocks[1]?.items?.[0] ?? "", /<strong>Requirements<\/strong>/);
    assert.doesNotMatch(JSON.stringify(body), /<script|alert\(1\)/);
    assert.doesNotMatch(JSON.stringify(body), /data-ai-instruction/);
  });

  it("keeps paragraph steps when the provider does not return a list block", async () => {
    const response = await handleAiSuggestRequest(
      request({ mode: "instruct", instruction: CYCLE, section: "Engineering" }),
      {
        staff: { email: "staff@example.com" },
        generateTextImpl: async () => ({
          output: {
            blocks: [
              {
                type: "paragraph",
                text: "The cycle moves from a need to a running system.\n\n1. Requirements name the work.\n2. Design chooses the structure.",
              },
            ],
          },
        }),
      },
    );
    assert.equal(response.status, 200);
    const body = (await response.json()) as { blocks: { kind: string; items?: string[] }[] };
    assert.equal(body.blocks.some((block) => block.kind === "p"), true);
    assert.equal(body.blocks.some((block) => block.kind === "ol"), true);
  });

  it("reads a JSON object from text when structured output is empty", async () => {
    const response = await handleAiSuggestRequest(
      request({ mode: "instruct", instruction: CYCLE, section: "Engineering" }),
      {
        staff: { email: "staff@example.com" },
        generateTextImpl: async () => ({
          output: null,
          text: JSON.stringify({
            blocks: [
              { type: "paragraph", text: "The cycle has several levels." },
              { type: "ol", items: ["Requirements", "Design"] },
            ],
          }),
        }),
      },
    );
    assert.equal(response.status, 200);
    const body = (await response.json()) as { blocks: { kind: string }[] };
    assert.deepEqual(
      body.blocks.map((block) => block.kind),
      ["p", "ol"],
    );
  });

  it("does not invent a list when list items are not strings", async () => {
    let calls = 0;
    const response = await handleAiSuggestRequest(
      request({ mode: "instruct", instruction: CYCLE, section: "Engineering" }),
      {
        staff: { email: "staff@example.com" },
        generateTextImpl: async () => {
          calls += 1;
          return {
            output: {
              blocks: [
                { type: "paragraph", text: "The cycle is a sequence of work." },
                { type: "list", ordered: true, items: [{ text: "<script>alert(1)</script>Requirements" }] },
              ],
            },
            text: "",
          };
        },
      },
    );
    assert.equal(calls, 1);
    assert.equal(response.status, 200);
    const body = (await response.json()) as { blocks: { kind: string; html?: string }[] };
    assert.deepEqual(
      body.blocks.map((block) => block.kind),
      ["p"],
    );
    assert.doesNotMatch(JSON.stringify(body), /script|Requirements/);
  });

  it("surfaces one structured-output failure instead of a made-up list", async () => {
    const { NoObjectGeneratedError } = await import("ai");
    let calls = 0;
    const response = await handleAiSuggestRequest(
      request({ mode: "instruct", instruction: CYCLE, section: "Engineering" }),
      {
        staff: { email: "staff@example.com" },
        generateTextImpl: async () => {
          calls += 1;
          throw new NoObjectGeneratedError({
            message: "No object generated.",
            text: "not json",
            response: { id: "r", timestamp: new Date(), modelId: "anthropic/claude-haiku-4.5" },
            usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
            finishReason: "stop",
          });
        },
      },
    );
    assert.equal(calls, 1);
    assert.equal(response.status, 503);
    const body = (await response.json()) as { error?: string; blocks?: unknown };
    assert.match(body.error ?? "", /No object generated/);
    assert.equal(body.blocks, undefined);
  });
});