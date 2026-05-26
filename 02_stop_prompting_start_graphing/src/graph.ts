import { END, START, StateGraph } from "@langchain/langgraph";
import { TechDesignAnnotation } from "./state.ts";
import { extractRequirements, EXTRACT_REQUIREMENTS_NODE } from "./nodes/extract_requirements";

export const graph = new StateGraph(TechDesignAnnotation)
  .addNode(EXTRACT_REQUIREMENTS_NODE, extractRequirements)
  .addEdge(START, EXTRACT_REQUIREMENTS_NODE)
  .addEdge(EXTRACT_REQUIREMENTS_NODE, END)
  .compile();
