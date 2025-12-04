import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";
import { GraphState } from "./state";

import { inputInterpreterAgent } from "../agents/input_interpreter";
import { contextExpansionAgent } from "../agents/context_expansion";
import { useCaseGenerationAgent } from "../agents/use_case_generation";
import { portfolioOrchestrator } from "../agents/portfolio_orchestrator";

export function buildGraph() {
  const graph = new StateGraph(GraphState)
    .addNode("input_interpreter", inputInterpreterAgent)
    .addNode("context_expansion", contextExpansionAgent)
    .addNode("use_case_generation", useCaseGenerationAgent)
    .addNode("portfolio_orchestrator", portfolioOrchestrator)

    .addEdge(START, "input_interpreter")
    .addEdge("input_interpreter", "context_expansion")
    .addEdge("context_expansion", "use_case_generation")
    .addEdge("use_case_generation", "portfolio_orchestrator")
    .addEdge("portfolio_orchestrator", END);

  const memory = new MemorySaver();

  return graph.compile({ checkpointer: memory });
}
