import { Annotation } from "@langchain/langgraph";
import { BusinessContext } from "../schemas/business_context";

export const GraphState = {
  rawInput: Annotation<string>(),
  businessContext: Annotation<BusinessContext | null>(),
};
