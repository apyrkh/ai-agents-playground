import { confirm, intro, isCancel, log, note, spinner, text } from "@clack/prompts";
import ansis from "ansis";
import type { DesignDoc, Question, Requirements, StackChoice } from "../state.ts";

const SAMPLE_BRIEFS = [
  "I want a web-chat for 10 employees",
  "Build a small SaaS for freelance designers to invoice clients in EUR. Must run on Cloudflare.",
  "Internal tool for HR (~200 users) to track candidate interviews, schedule via Google Calendar, surface diversity metrics. Must be GDPR-compliant and integrate with Okta SSO.",
];

export const printWelcome = (): void => {
  console.clear();
  intro("Tech Design Architect");
  note(SAMPLE_BRIEFS.map((it) => `• ${it}`).join("\n"), "Examples (copy any)");
};

export const readUserBrief = async (): Promise<string> => {
  printNodeTitle("Receiving Project Brief");
  const value = await text({
    message: "Describe your project requirements",
    validate: (v) => (!v || v.trim() === "" ? "Please describe your project" : undefined),
  });
  if (isCancel(value)) return exitNoInput();
  return value.trim();
};

export const readApproval = async (): Promise<{ approved: boolean; feedback: string | null }> => {
  const approved = await confirm({ message: "Approve proposed stack?" });
  if (isCancel(approved)) return exitNoInput();
  if (approved) return { approved: true, feedback: null };

  const feedback = await text({ message: "Reason for rejection" });
  if (isCancel(feedback)) return exitNoInput();
  return { approved: false, feedback: feedback.trim() || null };
};

export const readAnswers = async (questions: Question[]): Promise<string[]> => {
  const open = questions.filter((q) => q.status === "open");
  const answers: string[] = [];
  for (const q of open) {
    const answer = await text({ message: q.text });
    if (isCancel(answer)) return exitNoInput();
    answers.push(answer.trim());
  }
  return answers;
};

export const printNodeTitle = (label: string): void => {
  log.step(label);
};

export const createNodeSpinner = () => spinner();

export const printRequirements = (req: Requirements): void => {
  note(
    [
      formatBlock("features", req.features),
      formatBlock("constraints", req.constraints),
      formatBlock("nfrs", req.nfrs),
      formatBlock("assumptions", req.assumptions),
    ].join("\n\n"),
    "Requirements"
  );
};

export const printOpenQuestions = (questions: Question[]): void => {
  const open = questions.filter((q) => q.status === "open");
  note(formatBlock("open questions", open.map((q) => q.text)), "Clarification needed");
};

export const printProposedStack = (stack: StackChoice[]): void => {
  if (stack.length === 0) {
    note("(none)", "Proposed stack");
    return;
  }

  const content = stack
    .map((choice) => {
      const version = choice.version ? ` v${choice.version}` : "";
      const alts =
        choice.alternatives.length > 0
          ? "\n  alternatives:\n" +
            choice.alternatives.map((it) => `    • ${it.name} — ${it.rejectedBecause}`).join("\n")
          : "";
      return `${ansis.bold.white(choice.category)}: ${choice.selected}${ansis.dim(version)}\n  rationale: ${ansis.dim(choice.rationale)}${alts}`;
    })
    .join("\n\n");

  note(content, "Proposed stack");
};

export const printDesignDoc = async (doc: DesignDoc) => {
  if (doc.sections.length === 0) {
    note("(none)", "Design Document");
    return;
  }

  const sectionsMarkdown = doc.sections
    .map((section) => `## ${section.title}\n\n${section.content}`)
    .join("\n\n---\n\n");
  const fullMarkdown = `# ${doc.title}\n\n${sectionsMarkdown}`;

  const terminalOutput = Bun.markdown.ansi(fullMarkdown);
  // console.log();
  // console.log(terminalOutput);
  // @TODO: test this and also use spinner with the printNodeTitle
  note(terminalOutput, "Design Document");

  // === Markdown output
  const mdPath = "design-doc.md";
  await Bun.write(mdPath, fullMarkdown);
  log.success(`Markdown saved: ${mdPath}`);

  // === HTML output
  const htmlContent = Bun.markdown.html(fullMarkdown);
  const htmlPath = "design-doc.html";

  const htmlWrapper = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${doc.title} - Agent Design Document</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.0/github-markdown.min.css">
  <style>
    body {
      box-sizing: border-box;
      min-width: 200px;
      max-width: 980px;
      margin: 0 auto;
      padding: 45px;
      background-color: #0d1117;
    }
  </style>
</head>
<body class="markdown-body">
  ${htmlContent}
</body>
</html>`;

  await Bun.write(htmlPath, htmlWrapper);
  log.success(`HTML saved: ${htmlPath}`);
}

const formatBlock = (label: string, items: string[]): string => {
  if (items.length === 0) return `${label} (0)\n  (none)`;
  return `${label} (${items.length})\n${items.map((it) => `  • ${it}`).join("\n")}`;
};

const exitNoInput = (): never => {
  console.log("\nNo input — exiting.");
  process.exit(0);
};
