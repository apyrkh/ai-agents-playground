import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";

const GEMINI_MODELS = {
  FLASH_LITE: "gemini-2.5-flash-lite",
  FLASH: "gemini-2.5-flash",
  PRO: "gemini-2.5-pro",
}

export const gemini = new ChatGoogleGenerativeAI({
  model: GEMINI_MODELS.FLASH,
});


const OPENAI_MODELS = {
  GPT_4O_MINI: "gpt-4o-mini", 
  GPT_3_5_TURBO: "gpt-3.5-turbo", 
  GPT_4O: "gpt-4o", 
  GPT_4_TURBO: "gpt-4-turbo",
};

export const openAi = new ChatOpenAI({
  model: OPENAI_MODELS.GPT_4O_MINI,
  temperature: 0.7,
});


export const model = gemini;
