import { buildGraph } from "./graph/buildGraph";

export async function run(userInput: string) {
  const app = buildGraph();

  const config = { configurable: { thread_id: "1" } };

  await app.invoke({
    rawInput: userInput,
  }, config);
};
