import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AzureChatOpenAI } from "@langchain/openai";

const provider = (process.env.LLM_PROVIDER || "google").toLowerCase();

const buildGoogle = (): BaseChatModel => {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_API_KEY is not set");
  return new ChatGoogleGenerativeAI({
    apiKey,
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    temperature: 0.2,
    json: true,
    thinkingConfig: { includeThoughts: true },
  });
};

const buildAzure = (): BaseChatModel => {
  const apiKey = process.env.DIAL_API_KEY;
  if (!apiKey) throw new Error("DIAL_API_KEY is not set");
  const deployment = process.env.DIAL_DEPLOYMENT || "gpt-5-mini-2025-08-07";
  return new AzureChatOpenAI({
    apiKey,
    azureOpenAIBasePath: `${process.env.DIAL_ENDPOINT || "https://ai-proxy.lab.epam.com"}/openai/deployments`,
    azureOpenAIApiDeploymentName: deployment,
    azureOpenAIApiVersion: process.env.DIAL_API_VERSION || "2025-04-01-preview",
    temperature: 1,
    modelKwargs: { response_format: { type: "json_object" } },
  });
};

const buildModel = (): BaseChatModel => {
  if (provider === "google") return buildGoogle();
  if (provider === "azure") return buildAzure();
  throw new Error(`Unknown LLM_PROVIDER: ${provider}. Use "google" or "azure".`);
};

export const model: BaseChatModel = buildModel();
