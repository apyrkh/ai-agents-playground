import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import * as dotenv from "dotenv";

dotenv.config({ quiet: true });

const GEMINI_MODELS = {
  FLASH_LITE: "gemini-2.5-flash-lite",
  FLASH: "gemini-2.5-flash",
  PRO: "gemini-2.5-pro",
}
export const model = new ChatGoogleGenerativeAI({
  model: GEMINI_MODELS.FLASH_LITE,
});
