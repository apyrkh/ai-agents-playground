import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";

const GEMINI_MODELS = {
  FLASH_LITE: "gemini-2.5-flash-lite",
  FLASH: "gemini-2.5-flash",
  PRO: "gemini-2.5-pro",
}

const getGemini = () => {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;

  const model = GEMINI_MODELS[process.env.GEMINI_MODEL as keyof typeof GEMINI_MODELS] || GEMINI_MODELS.FLASH_LITE;

  return new ChatGoogleGenerativeAI({ apiKey, model });
};


const OPENAI_MODELS = {
  GPT_3_5_TURBO: "gpt-3.5-turbo",
  GPT_4O_MINI: "gpt-4o-mini",
  GPT_4O: "gpt-4o",
  GPT_4_TURBO: "gpt-4-turbo",
};

const getOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = OPENAI_MODELS[process.env.OPENAI_MODEL as keyof typeof OPENAI_MODELS] || OPENAI_MODELS.GPT_4O_MINI;

  return new ChatOpenAI({ apiKey, model, temperature: 0.7 });
};


export const mockModel = {
  withStructuredOutput: <T>(schema: T) => ({
    invoke: async (messages: any[]): Promise<T> => {
      return {} as T;
    },
  }),
};

export const model = getOpenAI() ?? getGemini() ?? (() => { throw new Error("No LLM API key provided"); })();
