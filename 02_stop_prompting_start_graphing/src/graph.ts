import { END, MemorySaver, START, StateGraph } from "@langchain/langgraph";
import { clarifyQuestions, CLARIFY_QUESTIONS_NODE } from "./nodes/clarify_questions/index.ts";
import { extractRequirements, EXTRACT_REQUIREMENTS_NODE } from "./nodes/extract_requirements/index.ts";
import { proposeStack, PROPOSE_STACK_NODE } from "./nodes/propose_stack/index.ts";
import { TechDesignAnnotation, type TechDesignState } from "./state.ts";

const checkCompleteness = (state: TechDesignState) => {
  return state.questions.length > 0 ? CLARIFY_QUESTIONS_NODE : PROPOSE_STACK_NODE;
};

export const graph = new StateGraph(TechDesignAnnotation)
  .addNode(EXTRACT_REQUIREMENTS_NODE, extractRequirements)
  .addNode(CLARIFY_QUESTIONS_NODE, clarifyQuestions)
  .addNode(PROPOSE_STACK_NODE, proposeStack)

  .addEdge(START, EXTRACT_REQUIREMENTS_NODE)
  .addConditionalEdges(EXTRACT_REQUIREMENTS_NODE, checkCompleteness, [CLARIFY_QUESTIONS_NODE, PROPOSE_STACK_NODE])
  .addEdge(CLARIFY_QUESTIONS_NODE, PROPOSE_STACK_NODE)
  .addEdge(PROPOSE_STACK_NODE, END)

  .compile({ checkpointer: new MemorySaver() });
