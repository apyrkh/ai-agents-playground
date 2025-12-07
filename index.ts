import { AIMessage } from "@langchain/core/messages";
import * as readline from "readline";
import { run } from "./src/app";
import { inputPrompt, printAiMessage, printEmptyLine, printInputHint, printResult, printWelcome } from "./src/utils/io";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.clear();
printWelcome();

const chatLoop = () => {
  printInputHint();
  rl.question(inputPrompt, async (input) => {
    printEmptyLine();

    const result = await run(input.trim());
    const askUser = AIMessage.isInstance(result.messages[result.messages.length - 1]);
    if (askUser) {
      printAiMessage(result.messages[result.messages.length - 1].content.toString());
      return chatLoop();
    }

    printResult(result);
    rl.close();
  });
};

// Start the chat loop
chatLoop();
