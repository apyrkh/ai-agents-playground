import { Annotation } from "@langchain/langgraph";
import { BusinessContext } from "../schemas/business_context";
import { ExpandedContext } from "../schemas/expanded_context";
import { Portfolio } from "../schemas/portfolio_schema";
import { UseCaseList } from "../schemas/use_cases";

export const GraphState = Annotation.Root({
  rawInput: Annotation<string>(),
  businessContext: Annotation<BusinessContext | null>(),
  expandedContext: Annotation<ExpandedContext | null>(),
  useCases: Annotation<UseCaseList | null>(),
  portfolio: Annotation<Portfolio | null>(),
});

export type StateType = typeof GraphState["State"]
