import test from "node:test";
import assert from "node:assert/strict";
import {
  createOpenAIService,
  formatToolsForOpenAI,
  normaliseConversationHistory,
  responseToConversationMessage,
} from "../app/services/openai.server.js";

test("formats Shopify tools for the Responses API", () => {
  assert.deepEqual(formatToolsForOpenAI([{
    name: "get_order_status",
    description: "Look up an order",
    input_schema: {
      type: "object",
      properties: {
        email: { type: "string" },
        order_number: { type: "string" },
      },
      required: ["email", "order_number"],
    },
  }]), [{
    type: "function",
    name: "get_order_status",
    description: "Look up an order",
    parameters: {
      type: "object",
      properties: {
        email: { type: "string" },
        order_number: { type: "string" },
      },
      required: ["email", "order_number"],
    },
    strict: false,
  }]);
});

test("converts stored tool history into Responses API input", () => {
  const result = normaliseConversationHistory([
    { role: "user", content: "Where is order 123?" },
    { role: "assistant", content: [{ type: "tool_use", id: "call_1", name: "get_order_status", input: { order_number: "123" } }] },
    { role: "user", content: [{ type: "tool_result", tool_use_id: "call_1", content: [{ type: "text", text: '{"found":true}' }] }] },
  ]);

  assert.deepEqual(result, [
    { role: "user", content: "Where is order 123?" },
    { type: "function_call", call_id: "call_1", name: "get_order_status", arguments: '{"order_number":"123"}' },
    { type: "function_call_output", call_id: "call_1", output: '{"found":true}' },
  ]);
});

test("preserves JSON-shaped customer messages in conversation history", () => {
  const result = normaliseConversationHistory([
    { role: "user", content: 123 },
    { role: "user", content: { question: "Where is my order?" } },
    { role: "user", content: [true, { value: "keep me" }] },
  ]);

  assert.deepEqual(result, [
    { role: "user", content: "123" },
    { role: "user", content: '{"question":"Where is my order?"}' },
    { role: "user", content: 'true\n{"value":"keep me"}' },
  ]);
});

test("converts OpenAI function calls into Barb's conversation contract", () => {
  const result = responseToConversationMessage({
    output_text: "I’ll check that.",
    output: [{ type: "function_call", call_id: "call_2", name: "get_order_status", arguments: '{"email":"a@example.com","order_number":"123"}' }],
  });

  assert.equal(result.stop_reason, "tool_use");
  assert.deepEqual(result.content[1], {
    type: "tool_use",
    id: "call_2",
    name: "get_order_status",
    input: { email: "a@example.com", order_number: "123" },
  });
});

test("streams text, stores the response and dispatches tool calls", async () => {
  const handlers = new Map();
  let request;
  const finalResponse = {
    output_text: "Checking now.",
    output: [{ type: "function_call", call_id: "call_3", name: "get_order_status", arguments: '{"email":"a@example.com","order_number":"123"}' }],
  };
  const fakeClient = {
    responses: {
      stream: (params) => {
        request = params;
        return {
        on: (event, handler) => handlers.set(event, handler),
        finalResponse: async () => {
          handlers.get("response.output_text.delta")?.({ delta: "Checking now." });
          return finalResponse;
        },
        };
      },
    },
  };
  const chunks = [];
  const calls = [];
  const messages = [];
  const service = createOpenAIService("test-key", fakeClient);

  const result = await service.streamConversation(
    { messages: [{ role: "user", content: "Order 123" }], tools: [] },
    {
      onText: (chunk) => chunks.push(chunk),
      onMessage: (message) => messages.push(message),
      onToolUse: (call) => calls.push(call),
    },
  );

  assert.deepEqual(chunks, ["Checking now."]);
  assert.equal(messages.length, 1);
  assert.equal(calls[0].id, "call_3");
  assert.equal(result.stop_reason, "tool_use");
  assert.equal(request.store, false);
  assert.equal(request.model, "gpt-5.6-terra");
  assert.deepEqual(request.reasoning, { effort: "none" });
});

test("ends the tool loop after a normal text response", () => {
  const result = responseToConversationMessage({
    output_text: "Here’s the sizing guide.",
    output: [],
  });

  assert.equal(result.stop_reason, "end_turn");
  assert.deepEqual(result.content, [{ type: "text", text: "Here’s the sizing guide." }]);
});

test("surfaces OpenAI refusals as customer-visible text", () => {
  const result = responseToConversationMessage({
    output: [{
      type: "message",
      content: [{ type: "refusal", refusal: "I can’t help with that request." }],
    }],
  });

  assert.equal(result.stop_reason, "end_turn");
  assert.deepEqual(result.content, [{ type: "text", text: "I can’t help with that request." }]);
});

test("rejects empty OpenAI responses instead of ending with a blank message", () => {
  assert.throws(
    () => responseToConversationMessage({ output: [] }),
    /empty response/,
  );
});

test("rejects truncated OpenAI responses instead of treating them as complete", () => {
  assert.throws(
    () => responseToConversationMessage({
      status: "incomplete",
      incomplete_details: { reason: "max_output_tokens" },
      output_text: "A cut-off answer",
      output: [],
    }),
    /incomplete response: max_output_tokens/,
  );
});
