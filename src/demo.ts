import { buildGraph } from "./graph/buildGraph";

export async function run() {
  const app = buildGraph();

  await app.invoke({
    rawInput: "We want an AI solution that automates invoice processing...",
    businessContext: null,
  });
}
