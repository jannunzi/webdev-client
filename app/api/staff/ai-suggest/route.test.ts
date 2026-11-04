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