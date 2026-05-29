import ansis from "ansis";
import type { Question, Requirements, StackChoice } from "../state.ts";

const SAMPLE_BRIEFS = [
  "I want a web-chat for 10 employees",
  "Build a small SaaS for freelance designers to invoice clients in EUR. Must run on Cloudflare.",
  "Internal tool for HR (~200 users) to track candidate interviews, schedule via Google Calendar, surface diversity metrics. Must be GDPR-compliant and integrate with Okta SSO.",
];

export const printWelcome = (): void => {
  console.clear();
  console.log(ansis.bold.cyan("=== Tech Design Architect ===\n"));

  console.log(ansis.gray.dim("Examples (copy any):"));
  SAMPLE_BRIEFS.forEach((it) => console.log(ansis.gray.dim(`  - ${it}`)));
  console.log();
};

export const readUserBrief = async (): Promise<string> => {
  printNodeTitle("Receiving Project Brief");
  printLabel("Describe your project requirements (blank line to submit):\n> ");

  const lines: string[] = [];
  for await (const line of stdinLines()) {
    if (line.trim() === "" && lines.length > 0) break;
    lines.push(line);
  }
  const text = lines.join("\n").trim();
  if (!text) {
    console.log("\nNo input — exiting.");
    process.exit(0);
  }
  return text;
};

export const readApproval = async (): Promise<{ approved: boolean; feedback: string | null }> => {
  while (true) {
    const rawInput = prompt("Approve proposed stack? [y/n]:");
    if (rawInput === null) {
      console.log("\nNo input — exiting.");
      process.exit(0);
    }

    const input = rawInput.trim().toLowerCase();
    if (input === "y" || input === "yes") {
      return { approved: true, feedback: null };
    }

    if (input === "n" || input === "no") {
      const rawFeedback = prompt("Reason for rejection:");
      if (rawFeedback === null) {
        console.log("\nNo input — exiting.");
        process.exit(0);
      }
      
      return { approved: false, feedback: rawFeedback.trim() || null };
    }
  }
};

export const readAnswers = async (questions: Question[]): Promise<string[]> => {
  const open = questions.filter((q) => q.status === "open");
  const answers: string[] = [];

  for (const q of open) {
    printLabel(`${ansis.bold.white(q.text)}\n> `);
    let answer = "";
    for await (const line of stdinLines()) {
      answer = line.trim();
      break;
    }
    answers.push(answer);
  }

  return answers;
};

export const printNodeTitle = (label: string): void => {
  console.log();
  console.log(ansis.bold.cyan(`${label}...`));
  console.log();
};

export const printThought = (text: string): void => {
  process.stdout.write(ansis.dim(text));
};

export const printRequirements = (req: Requirements): void => {
  printBlock("features", req.features);
  console.log();
  printBlock("constraints", req.constraints);
  console.log();
  printBlock("nfrs", req.nfrs);
  console.log();
  printBlock("assumptions", req.assumptions);
  console.log();
};

export const printOpenQuestions = (questions: Question[]): void => {
  const open = questions.filter((q) => q.status === "open");

  printBlock("open questions", open.map((q) => q.text));
};

export const printProposedStack = (stack: StackChoice[]): void => {
  if (stack.length === 0) {
    console.log(`${ansis.bold.white("proposed stack")} (${stack.length})`);
    console.log(`  ${ansis.dim("(none)")}`);
    console.log();
    return;
  }

  stack.forEach((choice) => {
    const version = choice.version ? ` v${choice.version}` : "";
    console.log(`${ansis.bold.white(choice.category)}: ${choice.selected}${ansis.dim(version)}`);
    console.log(`  rationale: ${ansis.dim(choice.rationale)}`);
    if (choice.alternatives.length > 0) {
      console.log(`  alternatives:`);
      choice.alternatives.forEach((it) => {
        console.log(`    ${ansis.dim(`• ${it.name} — ${it.rejectedBecause}`)}`);
      });
    }
    console.log();
  });
};

const printLabel = (text: string): void => {
  process.stdout.write(ansis.bold.white(text));
};

const printBlock = (label: string, items: string[]): void => {
  console.log(`${ansis.bold.white(label)} (${items.length})`);

  if (items.length === 0) {
    console.log(`  ${ansis.dim("(none)")}`);
    return;
  }

  items.forEach((it) => console.log(`  • ${it}`));
};

const stdinReader = Bun.stdin.stream().getReader();
const stdinDecoder = new TextDecoder();
let stdinBuffer = "";

const stdinLines = async function* (): AsyncGenerator<string> {
  while (true) {
    const { done, value } = await stdinReader.read();
    if (done) break;
    stdinBuffer += stdinDecoder.decode(value);
    const parts = stdinBuffer.split("\n");
    stdinBuffer = parts.pop() ?? "";
    for (const line of parts) yield line;
  }
  if (stdinBuffer) yield stdinBuffer;
};
