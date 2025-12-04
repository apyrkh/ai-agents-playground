import { buildGraph } from "./graph/buildGraph";

export const agentGraph = buildGraph();

export async function run(userInput: string) {
  const config = { configurable: { thread_id: "1" } };

  await agentGraph.invoke({
    rawInput: userInput,
  }, config);
};
