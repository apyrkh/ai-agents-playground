import { buildGraph } from "./graph/buildGraph";

export const agentGraph = buildGraph();

export const run = (userInput: string) => {
  const config = { configurable: { thread_id: "1" } };

  return agentGraph.invoke({
    userInput: userInput,
  }, config);
};
