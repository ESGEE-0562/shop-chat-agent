import OpenAI from "openai";
import { createRequire } from "node:module";
import AppConfig from "./config.server.js";

const require = createRequire(import.meta.url);
const systemPrompts = require("../prompts/prompts.json");

export function formatToolsForOpenAI(tools = []) {
  return tools.map((tool) => ({
    type: "function",
    name: tool.name,
    description: tool.description,
    parameters: tool.input_schema || tool.inputSchema || { type: "object", properties: {} },
    strict: false,
  }));
}

export function normaliseConversationHistory(messages = []) {
  const input = [];

  for (const message of messages) {
    if (typeof message.content === "string") {
      input.push({ role: message.role, content: message.content });
      continue;
    }

    if (!Array.isArray(message.content)) continue;

    const text = message.content
      .filter((item) => item?.type === "text")
      .map((item) => item.text)
      .join("\n");
    if (text) input.push({ role: message.role, content: text });

    for (const item of message.content) {
      if (item?.type === "tool_use") {
        input.push({
          type: "function_call",
          call_id: item.id,
          name: item.name,
          arguments: JSON.stringify(item.input || {}),
        });
      }
      if (item?.type === "tool_result") {
        input.push({
          type: "function_call_output",
          call_id: item.tool_use_id,
          output: serialiseToolOutput(item.content),
        });
      }
    }
  }

  return input;
}

export function responseToConversationMessage(response) {
  const content = [];
  if (response.output_text) content.push({ type: "text", text: response.output_text });

  for (const item of response.output || []) {
    if (item.type !== "function_call") continue;
    content.push({
      type: "tool_use",
      id: item.call_id,
      name: item.name,
      input: parseToolArguments(item.arguments),
    });
  }

  return {
    role: "assistant",
    content,
    stop_reason: content.some((item) => item.type === "tool_use") ? "tool_use" : "end_turn",
  };
}

export function createOpenAIService(apiKey = process.env.OPENAI_API_KEY, clientOverride) {
  const client = clientOverride || new OpenAI({ apiKey });

  const streamConversation = async ({ messages, promptType = AppConfig.api.defaultPromptType, tools }, streamHandlers) => {
    const responseStream = client.responses.stream({
      model: AppConfig.api.defaultModel,
      max_output_tokens: AppConfig.api.maxTokens,
      reasoning: { effort: "none" },
      store: false,
      instructions: getSystemPrompt(promptType),
      input: normaliseConversationHistory(messages),
      tools: formatToolsForOpenAI(tools),
    });

    responseStream.on("response.output_text.delta", (event) => {
      if (streamHandlers.onText) streamHandlers.onText(event.delta);
    });

    const response = await responseStream.finalResponse();
    const message = responseToConversationMessage(response);

    if (streamHandlers.onMessage) await streamHandlers.onMessage(message);
    for (const content of message.content) {
      if (content.type === "tool_use" && streamHandlers.onToolUse) await streamHandlers.onToolUse(content);
      if (content.type === "text" && streamHandlers.onContentBlock) streamHandlers.onContentBlock(content);
    }
    return message;
  };

  return { streamConversation, getSystemPrompt };
}

function getSystemPrompt(promptType) {
  return systemPrompts.systemPrompts[promptType]?.content
    || systemPrompts.systemPrompts[AppConfig.api.defaultPromptType].content;
}

function parseToolArguments(value) {
  try { return JSON.parse(value || "{}"); }
  catch { return {}; }
}

function serialiseToolOutput(content) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((item) => item?.text ?? (typeof item === "string" ? item : JSON.stringify(item)))
      .join("\n");
  }
  return JSON.stringify(content ?? null);
}

export default { createOpenAIService };
