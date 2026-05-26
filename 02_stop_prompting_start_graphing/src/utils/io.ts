import ansis from "ansis";
import type { Requirements } from "../state.ts";

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
