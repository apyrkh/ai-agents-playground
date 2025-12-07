import * as readline from "readline";
import { run } from "./src/app";
import { inputPrompt, printEmptyLine, printInputHint, printResult, printWelcome } from "./src/utils/io";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.clear();
printWelcome();
printInputHint();

rl.question(inputPrompt, async (input) => {
  printEmptyLine();

  const result = await run(input.trim());

  printResult(result);

  rl.close();
});
