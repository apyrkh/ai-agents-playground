import "dotenv/config";
import readline from "node:readline";
import { buildGraph } from "./src/graph.js";

const graph = await buildGraph();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt("> ");
rl.prompt();

rl.on("line", async (line) => {
  // console.log(line);
  const res = await graph.invoke({ input: line });
  console.log(res.output);
  rl.prompt();
});
