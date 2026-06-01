import type { AIMessageChunk, BaseMessage } from "@langchain/core/messages";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { ZodType } from "zod";

export const streamText = async (
  llm: BaseChatModel,
  messages: BaseMessage[],
): Promise<string> => {
  const stream = await llm.stream(messages);
  let answerBuf = "";
  for await (const chunk of stream) {
    const { text } = extractParts(chunk);
    if (text) answerBuf += text;
  }
  return answerBuf;
};

export const parseJsonResponse = <T>(raw: string, schema: ZodType<T>): T => {
  const cleaned = stripJsonFences(raw);
  if (!cleaned) {
    throw new Error("LLM returned no answer text. Retry, or simplify the brief.");
  }

  let rawObj: unknown;
  try {
    rawObj = JSON.parse(cleaned);
  } catch {
    throw new Error(`LLM returned unparseable JSON:\n${cleaned.slice(0, 200)}`);
  }
  return schema.parse(rawObj);
};

const extractParts = (chunk: AIMessageChunk): { thought: string; text: string } => {
  const content = chunk.content;
  if (typeof content === "string") return { thought: "", text: content };
  if (!Array.isArray(content)) return { thought: "", text: "" };

  let thought = "";
  let text = "";
  for (const part of content) {
    if (!part || typeof part !== "object") continue;
    const partObj = part as { type?: string; thinking?: string; text?: string };
    if (partObj.type === "thinking" && typeof partObj.thinking === "string") thought += partObj.thinking;
    else if (partObj.type === "text" && typeof partObj.text === "string") text += partObj.text;
  }
  return { thought, text };
};

const stripJsonFences = (raw: string): string => {
  const trimmed = raw.trim();

  const jsonFenced = trimmed.match(/```json\s*([\s\S]*?)\s*```/i);
  if (jsonFenced && jsonFenced[1]) return jsonFenced[1].trim();

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end > start) return trimmed.slice(start, end + 1);

  return trimmed;
};
