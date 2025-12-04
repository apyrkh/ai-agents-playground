import { Annotation } from "@langchain/langgraph";
import { BusinessContext } from "../schemas/business_context";
import { ExpandedContext } from "../schemas/expanded_context";

export const GraphState = {
  rawInput: Annotation<string>(),
  businessContext: Annotation<BusinessContext | null>(),
  expandedContext: Annotation<ExpandedContext | null>(),   // ← новое поле
};
